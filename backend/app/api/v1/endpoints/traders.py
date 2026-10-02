from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.entities import Trader, Instrument
from app.schemas.trader import TraderCreate, TraderResponse, InstrumentCreate, InstrumentResponse

router = APIRouter()

@router.post("/", response_model=TraderResponse, status_code=status.HTTP_201_CREATED, summary="Register New Trader")
async def create_trader(payload: TraderCreate, db: AsyncSession = Depends(get_db)):
    # Check if license exists
    res = await db.execute(select(Trader).filter(Trader.trade_license_no == payload.trade_license_no))
    existing = res.scalars().first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trader with license {payload.trade_license_no} already exists."
        )

    trader = Trader(
        business_name=payload.business_name,
        trade_license_no=payload.trade_license_no,
        gstin=payload.gstin,
        contact_person=payload.contact_person,
        phone=payload.phone,
        email=payload.email,
        address=payload.address,
    )
    db.add(trader)
    await db.commit()
    await db.refresh(trader)
    return trader

@router.get("/{trader_id}", response_model=TraderResponse, summary="Get Trader Details & Registered Instruments")
async def get_trader(trader_id: int, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Trader)
        .filter(Trader.id == trader_id)
        .options(selectinload(Trader.instruments))
    )
    res = await db.execute(stmt)
    trader = res.scalars().first()
    if not trader:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trader with id {trader_id} not found."
        )
    return trader

@router.post("/{trader_id}/instruments", response_model=InstrumentResponse, status_code=status.HTTP_201_CREATED, summary="Register Instrument")
async def register_instrument(trader_id: int, payload: InstrumentCreate, db: AsyncSession = Depends(get_db)):
    # Verify trader exists
    res = await db.execute(select(Trader).filter(Trader.id == trader_id))
    trader = res.scalars().first()
    if not trader:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trader with id {trader_id} not found."
        )

    instrument = Instrument(
        trader_id=trader_id,
        serial_no=payload.serial_no,
        hologram_id=payload.hologram_id,
        eeprom_counter=payload.eeprom_counter,
        model_name=payload.model_name,
        manufacturer=payload.manufacturer,
        accuracy_class=payload.accuracy_class,
        category=payload.category,
        capacity_kg=payload.capacity_kg,
        scale_interval_e_kg=payload.scale_interval_e_kg,
        status="PENDING_INSPECTION",
    )
    db.add(instrument)
    await db.commit()
    await db.refresh(instrument)
    return instrument
