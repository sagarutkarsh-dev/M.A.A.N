import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Trader(Base):
    __tablename__ = "traders"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(255), nullable=False)
    trade_license_no = Column(String(100), unique=True, index=True, nullable=False)
    gstin = Column(String(20), nullable=True)
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=True, default=11.2588)
    longitude = Column(Float, nullable=True, default=75.7804)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    instruments = relationship("Instrument", back_populates="trader", lazy="selectin")
    certificates = relationship("Certificate", back_populates="trader", lazy="selectin")

class Instrument(Base):
    __tablename__ = "instruments"

    id = Column(Integer, primary_key=True, index=True)
    trader_id = Column(Integer, ForeignKey("traders.id"), nullable=False)
    serial_no = Column(String(100), unique=True, index=True, nullable=False)
    hologram_id = Column(String(100), unique=True, index=True, nullable=False)
    eeprom_counter = Column(String(50), nullable=False, default="0x0001")
    model_name = Column(String(100), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    accuracy_class = Column(String(10), nullable=False)  # I, II, III, IIII
    category = Column(String(50), nullable=False)        # WEIGHBRIDGE, FUEL_DISPENSER, GENERAL_COMMERCIAL
    capacity_kg = Column(Float, nullable=False)
    scale_interval_e_kg = Column(Float, nullable=False)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trader = relationship("Trader", back_populates="instruments", lazy="selectin")
    inspections = relationship("InspectionRecord", back_populates="instrument", lazy="selectin")
    certificates = relationship("Certificate", back_populates="instrument", lazy="selectin")

class InspectionRecord(Base):
    __tablename__ = "inspection_records"

    id = Column(Integer, primary_key=True, index=True)
    instrument_id = Column(Integer, ForeignKey("instruments.id"), nullable=False)
    lmo_id = Column(String(50), nullable=False)
    inspection_type = Column(String(50), default="IN_SERVICE")
    chassis_photo_url = Column(String(500), nullable=True)
    wire_seal_photo_url = Column(String(500), nullable=True)
    hologram_photo_url = Column(String(500), nullable=True)
    legacy_cert_photo_url = Column(String(500), nullable=True)
    ocr_serial_detected = Column(String(100), nullable=True)
    hologram_id_affixed = Column(String(100), nullable=True)
    eeprom_counter_sync = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    wire_seal_intact = Column(Boolean, default=True)
    turning_point_data = Column(Text, nullable=True)  # JSON string of test loads & errors
    is_passed = Column(Boolean, default=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    instrument = relationship("Instrument", back_populates="inspections", lazy="selectin")

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_no = Column(String(100), unique=True, index=True, nullable=False)
    verification_token = Column(String(64), unique=True, index=True, nullable=False)
    instrument_id = Column(Integer, ForeignKey("instruments.id"), nullable=False)
    trader_id = Column(Integer, ForeignKey("traders.id"), nullable=False)
    lmo_id = Column(String(50), nullable=False)
    issue_date = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    expiry_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="ACTIVE")
    data_source = Column(String(20), default="PORTAL_NEW")  # PORTAL_NEW vs LEGACY_MIGRATED
    wire_seal_intact = Column(Boolean, default=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    chassis_photo_url = Column(String(500), nullable=True)
    wire_seal_photo_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    instrument = relationship("Instrument", back_populates="certificates", lazy="selectin")
    trader = relationship("Trader", back_populates="certificates", lazy="selectin")

# Alias for Inspection
Inspection = InspectionRecord