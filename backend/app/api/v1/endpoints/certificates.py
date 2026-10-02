import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.entities import Certificate, Instrument, Trader
from app.schemas.certificate import CertificateVerificationResponse
from app.services.rule27_fsm import Rule27StateMachine, InstrumentCategory

router = APIRouter()

@router.get("/{token}", response_model=CertificateVerificationResponse, summary="Citizen QR Audit Public Verification")
async def verify_certificate(token: str, db: AsyncSession = Depends(get_db)):
    """
    Public zero-login verification endpoint for citizens and traders scanning
    the statutory QR sticker on legal metrology instruments:
    - Returns live certificate compliance status (Rule 27)
    - Calculated Rule 27 expiry date and days remaining
    - Machine chassis serial number
    - Physical wire seal & tamper-seal integrity status
    - Registered in-situ GPS coordinates
    """
    stmt = (
        select(Certificate)
        .filter(Certificate.verification_token == token)
        .options(selectinload(Certificate.instrument), selectinload(Certificate.trader))
    )
    result = await db.execute(stmt)
    cert = result.scalars().first()

    if not cert:
        # If demo token or not found, check if demo
        if token.lower().startswith("demo"):
            now = datetime.datetime.utcnow()
            expiry = now + datetime.timedelta(days=180)
            return CertificateVerificationResponse(
                cert_id="CERT-2026-8839",
                verification_token=token,
                trade_name="Mahalaxmi Provisions & Spices",
                accuracy_class="III",
                capacity="30 kg",
                scale_interval_e="5 g",
                hologram_id="HOLO-992-KRL",
                serial_no="SN-8839201-X",
                eeprom_counter="0x004A",
                stamping_date=now.strftime("%Y-%m-%d"),
                expiry_date=expiry.strftime("%Y-%m-%d"),
                lmo_id="LMO-KL-442",
                data_source="PORTAL_NEW",
                is_valid=True,
                status="ACTIVE",
                days_remaining=180,
                rule_reference="Rule 27(2)(a), Legal Metrology (General) Rules, 2011",
                tamper_seal_intact=True,
                tamper_seal_status="INTACT",
                latitude=11.2588,
                longitude=75.7804,
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate verification token '{token}' not recognized or expired."
        )

    cat_enum = getattr(InstrumentCategory, cert.instrument.category, InstrumentCategory.GENERAL_COMMERCIAL)
    fsm_state = Rule27StateMachine.evaluate_status(
        stamping_date=cert.issue_date,
        expiry_date=cert.expiry_date,
        category=cat_enum,
        seal_tampered=not cert.wire_seal_intact,
    )

    tamper_status = "INTACT" if cert.wire_seal_intact else "TAMPERED"

    return CertificateVerificationResponse(
        cert_id=cert.certificate_no,
        verification_token=cert.verification_token,
        trade_name=cert.trader.business_name,
        accuracy_class=cert.instrument.accuracy_class,
        capacity=f"{cert.instrument.capacity_kg} kg",
        scale_interval_e=f"{cert.instrument.scale_interval_e_kg * 1000:g} g",
        hologram_id=cert.instrument.hologram_id,
        serial_no=cert.instrument.serial_no,
        eeprom_counter=cert.instrument.eeprom_counter,
        stamping_date=cert.issue_date.strftime("%Y-%m-%d"),
        expiry_date=cert.expiry_date.strftime("%Y-%m-%d"),
        lmo_id=cert.lmo_id,
        data_source=cert.data_source,
        is_valid=fsm_state["is_valid"] and cert.wire_seal_intact,
        status=fsm_state["status"],
        days_remaining=fsm_state.get("days_remaining", 0),
        rule_reference=fsm_state.get("statutory_rule", "Rule 27, Legal Metrology Rules, 2011"),
        tamper_seal_intact=cert.wire_seal_intact,
        tamper_seal_status=tamper_status,
        latitude=cert.latitude or cert.trader.latitude,
        longitude=cert.longitude or cert.trader.longitude,
        chassis_photo_url=cert.chassis_photo_url,
        wire_seal_photo_url=cert.wire_seal_photo_url,
    )
