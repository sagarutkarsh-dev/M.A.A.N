from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.entities import Certificate, Instrument

router = APIRouter()

EVENT_RULES = {
    "DISMANTLED": ("INVALIDATED_DISMANTLED", "Rule 27(3)"),
    "RELOCATED": ("INVALIDATED_RELOCATION", "Rule 27(3)"),
    "REPAIRED": ("INVALIDATED_REPAIR", "Rule 27(4)"),
    "ADJUSTED": ("INVALIDATED_REPAIR", "Rule 27(4)"),
}


class InstrumentEventRequest(BaseModel):
    event: Literal["DISMANTLED", "RELOCATED", "REPAIRED", "ADJUSTED"]
    notes: Optional[str] = None


class InstrumentEventResponse(BaseModel):
    instrument_id: int
    event: str
    statutory_rule: str
    new_status: str
    certificates_revoked: int


@router.post("/{instrument_id}/events", response_model=InstrumentEventResponse,
             summary="Report dismantling, relocation or repair (Rule 27(3)/(4))")
async def report_event(instrument_id: int, payload: InstrumentEventRequest,
                       db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Instrument).filter(Instrument.id == instrument_id))
    instrument = res.scalars().first()
    if not instrument:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Instrument {instrument_id} not found.")

    new_status, rule = EVENT_RULES[payload.event]
    revoked = await db.execute(
        update(Certificate)
        .where(Certificate.instrument_id == instrument_id, Certificate.status == "ACTIVE")
        .values(status=new_status)
    )
    instrument.status = new_status
    await db.commit()

    return InstrumentEventResponse(
        instrument_id=instrument_id,
        event=payload.event,
        statutory_rule=rule,
        new_status=new_status,
        certificates_revoked=revoked.rowcount,
    )