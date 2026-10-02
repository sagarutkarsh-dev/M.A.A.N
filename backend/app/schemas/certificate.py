from typing import Optional
from pydantic import BaseModel

class CertificateVerificationResponse(BaseModel):
    cert_id: str
    verification_token: str
    trade_name: str
    accuracy_class: str
    capacity: str
    scale_interval_e: str
    hologram_id: str
    serial_no: str
    eeprom_counter: str
    stamping_date: str
    expiry_date: str
    lmo_id: str
    data_source: str
    is_valid: bool
    status: str
    days_remaining: int
    rule_reference: str
    tamper_seal_intact: bool = True
    tamper_seal_status: str = "INTACT"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    chassis_photo_url: Optional[str] = None
    wire_seal_photo_url: Optional[str] = None
