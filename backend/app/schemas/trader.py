from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class InstrumentCreate(BaseModel):
    serial_no: str
    hologram_id: str
    eeprom_counter: str = "0x0001"
    model_name: str
    manufacturer: str
    accuracy_class: str = "III"
    category: str = "GENERAL_COMMERCIAL"
    capacity_kg: float
    scale_interval_e_kg: float

class InstrumentResponse(InstrumentCreate):
    id: int
    trader_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class TraderCreate(BaseModel):
    business_name: str
    trade_license_no: str
    gstin: Optional[str] = None
    contact_person: str
    phone: str
    email: Optional[str] = None
    address: str

class TraderResponse(TraderCreate):
    id: int
    created_at: datetime
    instruments: List[InstrumentResponse] = []

    class Config:
        from_attributes = True
