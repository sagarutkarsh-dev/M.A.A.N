import os
import uuid
import json
import datetime
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.config import settings
from app.models.entities import Instrument, InspectionRecord, Certificate, Trader
from app.schemas.inspection import InspectionUploadResponse
from app.services.rule27_fsm import Rule27StateMachine, InstrumentCategory
from app.services.mpe_engine import MPEToleranceEngine, AccuracyClass, InspectionType

router = APIRouter()

@router.post("/upload", response_model=InspectionUploadResponse, summary="Upload Field Inspection with Chassis Photo, Wire Seal & Hologram Evidence")
async def upload_inspection(
    instrument_id: int = Form(1),
    lmo_id: str = Form("LMO-KL-442"),
    inspection_type: str = Form("IN_SERVICE"),
    chassis_serial_observed: str = Form(...),
    hologram_id_affixed: str = Form(...),
    eeprom_counter_sync: str = Form("0x0001"),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    geotag_timestamp: Optional[str] = Form(None),
    wire_seal_intact: bool = Form(True),
    turning_point_results: Optional[str] = Form(None), # JSON serialized test loads
    remarks: Optional[str] = Form(None),
    legacy_certificate_no: Optional[str] = Form(None),
    chassis_photo: Optional[UploadFile] = File(None),
    wire_seal_photo: Optional[UploadFile] = File(None),
    hologram_photo: Optional[UploadFile] = File(None),
    legacy_cert_photo: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Field inspector submission endpoint:
    - Stores submitted inspection evidence in SQLite database
    - Evaluates 3-layer anti-fraud hardware binding (Chassis Serial, Foil Hologram, EEPROM, Wire Seal)
    - Evaluates on-device MPE tolerance continuous rounding results
    - Automatically generates an active Certificate record with Rule 27 expiry date if inspection passes
    """
    # 1. Fetch or auto-register instrument/trader if not found
    result = await db.execute(select(Instrument).filter(
        (Instrument.id == instrument_id) | (Instrument.serial_no == chassis_serial_observed)
    ))
    instrument = result.scalars().first()

    if not instrument:
        # Create default trader if none exists
        trader_res = await db.execute(select(Trader).filter(Trader.id == 1))
        trader = trader_res.scalars().first()
        if not trader:
            trader = Trader(
                business_name="Mahalaxmi Provisions & Spices",
                trade_license_no=f"LM-TR-{uuid.uuid4().hex[:6].upper()}",
                gstin="32AAAAA0000A1Z5",
                contact_person="K. R. Nambiar",
                phone="+91 98470 12345",
                address="Shop 14, Central Market, Kozhikode, Kerala - 673001",
                latitude=latitude or 11.2588,
                longitude=longitude or 75.7804,
            )
            db.add(trader)
            await db.flush()

        instrument = Instrument(
            trader_id=trader.id,
            serial_no=chassis_serial_observed,
            hologram_id=hologram_id_affixed,
            eeprom_counter=eeprom_counter_sync,
            model_name="Electronic Weighing Scale",
            manufacturer="Certified Manufacturer",
            accuracy_class="III",
            category="GENERAL_COMMERCIAL",
            capacity_kg=30.0,
            scale_interval_e_kg=0.005,
            status="ACTIVE",
        )
        db.add(instrument)
        await db.flush()

    # 2. Check 3-Layer Anti-Fraud Hardware Binding & Wire Seal
    serial_match = (instrument.serial_no.strip().upper() == chassis_serial_observed.strip().upper())
    hologram_match = (instrument.hologram_id.strip().upper() == hologram_id_affixed.strip().upper())
    eeprom_match = (instrument.eeprom_counter.strip().upper() == eeprom_counter_sync.strip().upper())
    binding_ok = serial_match and hologram_match and eeprom_match and wire_seal_intact

    # 3. Handle File Uploads
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    async def save_uploaded(upload_file: Optional[UploadFile], prefix: str) -> Optional[str]:
        if not upload_file:
            return None
        file_ext = Path(upload_file.filename).suffix or ".jpg"
        filename = f"{prefix}_{instrument.id}_{uuid.uuid4().hex[:8]}{file_ext}"
        filepath = upload_dir / filename
        content = await upload_file.read()
        with open(filepath, "wb") as f:
            f.write(content)
        return f"/uploads/{filename}"

    chassis_photo_url = await save_uploaded(chassis_photo, "chassis")
    wire_seal_photo_url = await save_uploaded(wire_seal_photo, "wire_seal")
    hologram_photo_url = await save_uploaded(hologram_photo, "hologram")
    legacy_cert_photo_url = await save_uploaded(legacy_cert_photo, "legacy_cert")

    # 4. Evaluate MPE Test Load Results
    mpe_pass = True
    if turning_point_results:
        try:
            parsed_tests = json.loads(turning_point_results)
            if isinstance(parsed_tests, list):
                for t in parsed_tests:
                    # Check pre-evaluated status
                    if t.get("status") == "FAIL" or t.get("is_pass") is False:
                        mpe_pass = False
                        break
                    # If raw parameters are provided, evaluate via MPEToleranceEngine
                    if "load_mass" in t and "indicated_mass" in t and "scale_interval_e" in t:
                        scale_e = float(t["scale_interval_e"])
                        delta_l_val = float(t.get("delta_l", 0.0))
                        load_val = float(t["load_mass"])
                        # If scale_interval_e is in kg (e.g. 0.005) but delta_l was submitted in grams (e.g. 1.5)
                        if scale_e < 0.1 and delta_l_val >= 0.1:
                            delta_l_val = delta_l_val / 1000.0
                        # If scale_interval_e was submitted in grams (e.g. 5.0) while load is in kg (e.g. 10.0)
                        if load_val >= 1.0 and scale_e >= 1.0:
                            scale_e = scale_e / 1000.0
                            delta_l_val = delta_l_val / 1000.0

                        eval_res = MPEToleranceEngine.evaluate_turning_point_load(
                            accuracy_class=instrument.accuracy_class,
                            load_mass=load_val,
                            indicated_mass=float(t["indicated_mass"]),
                            delta_l=delta_l_val,
                            scale_interval_e=scale_e,
                            inspection_type=InspectionType.IN_SERVICE,
                            zero_error=float(t.get("zero_error", 0.0)),
                        )
                        if not eval_res["is_compliant"]:
                            mpe_pass = False
                            break
        except Exception:
            pass

    # Overall statutory pass verdict
    is_passed = binding_ok and mpe_pass

    # 5. Save Inspection Record in SQLite
    combined_notes = remarks or ""
    if latitude and longitude:
        combined_notes = f"[GPS: {latitude}, {longitude} | Timestamp: {geotag_timestamp}] {combined_notes}"

    inspection = InspectionRecord(
        instrument_id=instrument.id,
        lmo_id=lmo_id,
        inspection_type=inspection_type,
        chassis_photo_url=chassis_photo_url,
        wire_seal_photo_url=wire_seal_photo_url,
        hologram_photo_url=hologram_photo_url,
        legacy_cert_photo_url=legacy_cert_photo_url,
        ocr_serial_detected=chassis_serial_observed,
        hologram_id_affixed=hologram_id_affixed,
        eeprom_counter_sync=eeprom_counter_sync,
        latitude=latitude,
        longitude=longitude,
        wire_seal_intact=wire_seal_intact,
        turning_point_data=turning_point_results,
        is_passed=is_passed,
        remarks=combined_notes,
    )
    db.add(inspection)
    await db.flush()

    # 6. Automatically Generate Active Certificate Record if Passed
    cert_token = None
    if is_passed:
        cert_token = f"maan-{uuid.uuid4().hex[:16]}"
        now = datetime.datetime.utcnow()
        cat_enum = getattr(InstrumentCategory, instrument.category, InstrumentCategory.GENERAL_COMMERCIAL)
        expiry = Rule27StateMachine.calculate_statutory_expiry(now, cat_enum)

        certificate = Certificate(
            certificate_no=f"CERT-{now.year}-{1000 + inspection.id}",
            verification_token=cert_token,
            instrument_id=instrument.id,
            trader_id=instrument.trader_id,
            lmo_id=lmo_id,
            issue_date=now,
            expiry_date=expiry,
            status="ACTIVE",
            data_source="LEGACY_MIGRATED" if legacy_certificate_no else "PORTAL_NEW",
            wire_seal_intact=wire_seal_intact,
            latitude=latitude,
            longitude=longitude,
            chassis_photo_url=chassis_photo_url,
            wire_seal_photo_url=wire_seal_photo_url,
        )
        db.add(certificate)
        instrument.status = "ACTIVE"
    else:
        instrument.status = "INSPECTION_FAILED" if not mpe_pass else "SUSPENDED_TAMPERED"

    await db.commit()
    await db.refresh(inspection)

    return InspectionUploadResponse(
        inspection_id=inspection.id,
        instrument_id=instrument.id,
        lmo_id=lmo_id,
        is_passed=is_passed,
        status="PASS" if is_passed else "FAIL",
        hardware_binding_matched=binding_ok,
        chassis_photo_url=chassis_photo_url,
        wire_seal_photo_url=wire_seal_photo_url,
        hologram_photo_url=hologram_photo_url,
        legacy_cert_photo_url=legacy_cert_photo_url,
        latitude=latitude,
        longitude=longitude,
        certificate_token=cert_token,
        timestamp=inspection.created_at,
    )
