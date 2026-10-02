import datetime
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Configure async engine
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db() -> None:
    """Initialize database tables and seed initial demo data."""
    # Ensure all models are imported so Base.metadata contains table schemas
    from app.models.entities import Trader, Instrument, InspectionRecord, Certificate
    from sqlalchemy.future import select

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed demo records if database is empty
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(Trader).filter(Trader.id == 1))
        trader = res.scalars().first()
        if not trader:
            trader = Trader(
                id=1,
                business_name="Mahalaxmi Provisions & Spices",
                trade_license_no="LM-TR-2024-88419",
                gstin="32AAAAA0000A1Z5",
                contact_person="K. R. Nambiar",
                phone="+91 98470 12345",
                email="mahalaxmi.provisions@gmail.com",
                address="Shop 14, Central Market, Kozhikode, Kerala - 673001",
                latitude=11.2588,
                longitude=75.7804,
            )
            session.add(trader)
            await session.flush()

            instrument = Instrument(
                id=1,
                trader_id=trader.id,
                serial_no="SN-8839201-X",
                hologram_id="HOLO-992-KRL",
                eeprom_counter="0x004A",
                model_name="Essae DS-215 Electronic Counter Scale",
                manufacturer="Essae-Teraoka Ltd.",
                accuracy_class="III",
                category="GENERAL_COMMERCIAL",
                capacity_kg=30.0,
                scale_interval_e_kg=0.005,
                status="ACTIVE",
            )
            session.add(instrument)
            await session.flush()

            now = datetime.datetime.utcnow()
            cert = Certificate(
                id=1,
                certificate_no="CERT-2026-8839",
                verification_token="demo-hash-123",
                instrument_id=instrument.id,
                trader_id=trader.id,
                lmo_id="LMO-KL-442",
                issue_date=now - datetime.timedelta(days=60),
                expiry_date=now + datetime.timedelta(days=670),
                status="ACTIVE",
                data_source="PORTAL_NEW",
                wire_seal_intact=True,
                latitude=11.2588,
                longitude=75.7804,
            )
            session.add(cert)
            await session.commit()
