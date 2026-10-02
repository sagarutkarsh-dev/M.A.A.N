from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class InspectionUploadRequest(BaseModel):
    instrument_id: int
    lmo_id: str
    inspection_type: str = "IN_SERVICE"
    chassis_serial_observed: str
    hologram_id_affixed: str
    eeprom_counter_sync: str = "0x0001"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    geotag_timestamp: Optional[str] = None
    wire_seal_intact: bool = True
    turning_point_results: Optional[List[Dict[str, Any]]] = None
    remarks: Optional[str] = None
    legacy_certificate_no: Optional[str] = None

class InspectionUploadResponse(BaseModel):
    inspection_id: int
    instrument_id: int
    lmo_id: str
    is_passed: bool
    status: str
    hardware_binding_matched: bool
    chassis_photo_url: Optional[str] = None
    wire_seal_photo_url: Optional[str] = None
    hologram_photo_url: Optional[str] = None
    legacy_cert_photo_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    certificate_token: Optional[str] = None
    timestamp: datetime
