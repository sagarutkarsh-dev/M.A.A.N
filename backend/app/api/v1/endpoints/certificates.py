from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.entities import Certificate
from app.schemas.certificate import CertificateVerificationResponse
from app.services.rule27_fsm import Rule27StateMachine, InstrumentCategory

router = APIRouter()


@router.get("/{token}", response_model=CertificateVerificationResponse, summary="Citizen QR Audit Public Verification")
async def verify_certificate(token: str, db: AsyncSession = Depends(get_db)):
    """
    Public zero-login verification endpoint for citizens scanning the QR sticker:
    live Rule 27 status, expiry, days remaining, serial, seal status and location.
    """
    stmt = (
        select(Certificate)
        .filter(Certificate.verification_token == token)
        .options(selectinload(Certificate.instrument), selectinload(Certificate.trader))
    )
    result = await db.execute(stmt)
    cert = result.scalars().first()

    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate verification token '{token}' not recognized or expired.",
        )

    cat_enum = getattr(InstrumentCategory, cert.instrument.category, InstrumentCategory.GENERAL_COMMERCIAL)
    fsm_state = Rule27StateMachine.evaluate_status(
        stamping_date=cert.issue_date,
        expiry_date=cert.expiry_date,
        category=cat_enum,
        seal_tampered=not cert.wire_seal_intact,
    )

    # A certificate revoked by a Rule 27(3)/(4) event is invalid no matter what the dates say
    revoked = cert.status != "ACTIVE"
    is_valid = fsm_state["is_valid"] and cert.wire_seal_intact and not revoked
    status_label = cert.status if revoked else fsm_state["status"]
    if revoked:
        rule_ref = "Rule 27(4)" if cert.status == "INVALIDATED_REPAIR" else "Rule 27(3)"
    else:
        rule_ref = fsm_state.get("statutory_rule", "Rule 27, Legal Metrology Rules, 2011")

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
        is_valid=is_valid,
        status=status_label,
        days_remaining=0 if revoked else fsm_state.get("days_remaining", 0),
        rule_reference=rule_ref,
        tamper_seal_intact=cert.wire_seal_intact,
        tamper_seal_status="INTACT" if cert.wire_seal_intact else "TAMPERED",
        latitude=cert.latitude or cert.trader.latitude,
        longitude=cert.longitude or cert.trader.longitude,
        chassis_photo_url=cert.chassis_photo_url,
        wire_seal_photo_url=cert.wire_seal_photo_url,
    )