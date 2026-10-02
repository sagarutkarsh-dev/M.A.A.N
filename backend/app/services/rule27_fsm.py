"""
Rule 27 Lifecycle State Machine (FSM)
Legal Metrology Act, 2009 & Legal Metrology (General) Rules, 2011
Module 1: Instrument Validity & Re-verification Matrix (Rule 27)

Statutory Cadences & Invalidation Rules:
- Rule 27(2)(a): 24 Months - Weights, Capacity Measures, Length Measures, Tapes, Beam Scales, Counter Machines (quarter expiry).
- Rule 27(2)(b): 60 Months - Storage Tanks (Vertical Oil Tanks, Bulk Vats - calibration dipping/strapping tables).
- Rule 27(2)(c): 12 Months - All other W&M (Weighbridges, Platform Machines, Electronic Scales, Tank Lorries, Fuel Dispensers, Flow Meters, AWI).
- Rule 27(3): Immediate Revocation if dismantled & re-installed / relocated prior to statutory due date.
- Rule 27(4): Immediate Revocation if repaired or mechanically/electronically adjusted prior to statutory due date.
"""

from datetime import datetime, timezone, timedelta
from enum import Enum
from typing import Dict, Any, Optional
import calendar

class InstrumentCategory(str, Enum):
    # Rule 27(2)(a) - 24 Months
    WEIGHTS_MEASURES_24M = "WEIGHTS_MEASURES_24M"
    GENERAL_COMMERCIAL = "GENERAL_COMMERCIAL"      # Alias
    BEAM_SCALE = "BEAM_SCALE"                      # Alias
    COUNTER_MACHINE = "COUNTER_MACHINE"            # Alias
    CAPACITY_MEASURE = "CAPACITY_MEASURE"          # Alias
    LENGTH_MEASURE = "LENGTH_MEASURE"              # Alias

    # Rule 27(2)(b) - 60 Months
    STORAGE_TANK = "STORAGE_TANK"
    VERTICAL_OIL_TANK = "VERTICAL_OIL_TANK"        # Alias
    BULK_STORAGE_VAT = "BULK_STORAGE_VAT"          # Alias

    # Rule 27(2)(c) - 12 Months
    ALL_OTHER_WM_12M = "ALL_OTHER_WM_12M"
    WEIGHBRIDGE = "WEIGHBRIDGE"                    # Alias
    FUEL_DISPENSER = "FUEL_DISPENSER"              # Alias
    ELECTRONIC_SCALE = "ELECTRONIC_SCALE"          # Alias
    PLATFORM_MACHINE = "PLATFORM_MACHINE"          # Alias
    TANK_LORRY = "TANK_LORRY"                      # Alias
    FLOW_METER = "FLOW_METER"                      # Alias
    AUTOMATIC_WEIGHING_INSTRUMENT = "AWI"          # Alias

class CertificateStatus(str, Enum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    INVALIDATED_RELOCATION = "INVALIDATED_RELOCATION"      # Rule 27(3) Immediate Revocation
    INVALIDATED_DISMANTLED = "INVALIDATED_DISMANTLED"      # Rule 27(3) Alias
    INVALIDATED_REPAIR = "INVALIDATED_REPAIR"              # Rule 27(4) Immediate Revocation
    INVALIDATED_REPAIRED = "INVALIDATED_REPAIRED"          # Rule 27(4) Alias
    SUSPENDED_TAMPERED = "SUSPENDED_TAMPERED"

STATUTORY_VALIDITY_MATRIX: Dict[InstrumentCategory, int] = {
    # 24 Months (Rule 27(2)(a))
    InstrumentCategory.WEIGHTS_MEASURES_24M: 24,
    InstrumentCategory.GENERAL_COMMERCIAL: 24,
    InstrumentCategory.BEAM_SCALE: 24,
    InstrumentCategory.COUNTER_MACHINE: 24,
    InstrumentCategory.CAPACITY_MEASURE: 24,
    InstrumentCategory.LENGTH_MEASURE: 24,

    # 60 Months (Rule 27(2)(b))
    InstrumentCategory.STORAGE_TANK: 60,
    InstrumentCategory.VERTICAL_OIL_TANK: 60,
    InstrumentCategory.BULK_STORAGE_VAT: 60,

    # 12 Months (Rule 27(2)(c))
    InstrumentCategory.ALL_OTHER_WM_12M: 12,
    InstrumentCategory.WEIGHBRIDGE: 12,
    InstrumentCategory.FUEL_DISPENSER: 12,
    InstrumentCategory.ELECTRONIC_SCALE: 12,
    InstrumentCategory.PLATFORM_MACHINE: 12,
    InstrumentCategory.TANK_LORRY: 12,
    InstrumentCategory.FLOW_METER: 12,
    InstrumentCategory.AUTOMATIC_WEIGHING_INSTRUMENT: 12,
}

QUARTER_NAMES = {
    1: "Quarter A (Jan - Mar)",
    2: "Quarter B (Apr - Jun)",
    3: "Quarter C (Jul - Sep)",
    4: "Quarter D (Oct - Dec)",
}
QUARTER_LETTERS = {1: "A", 2: "B", 3: "C", 4: "D"}

class Rule27StateMachine:
    """
    Finite State Machine managing statutory verification cycles, quarter calculations,
    and immediate invalidation triggers under Rule 27.
    """

    @classmethod
    def normalize_category(cls, category: InstrumentCategory | str) -> InstrumentCategory:
        if isinstance(category, InstrumentCategory):
            return category
        val = str(category).strip().upper()
        # Direct match or alias
        for member in InstrumentCategory:
            if member.value == val or member.name == val:
                return member
        # Heuristic keywords
        if "TANK" in val or "VAT" in val:
            return InstrumentCategory.STORAGE_TANK
        if any(kw in val for kw in ("WEIGHBRIDGE", "DISPENSER", "ELECTRONIC", "PLATFORM", "LORRY", "FLOW")):
            return InstrumentCategory.ALL_OTHER_WM_12M
        return InstrumentCategory.WEIGHTS_MEASURES_24M

    @classmethod
    def get_cadence_months(cls, category: InstrumentCategory | str) -> int:
        norm_cat = cls.normalize_category(category)
        return STATUTORY_VALIDITY_MATRIX.get(norm_cat, 12)

    @classmethod
    def get_statutory_rule_clause(cls, category: InstrumentCategory | str) -> str:
        norm_cat = cls.normalize_category(category)
        cadence = cls.get_cadence_months(norm_cat)
        if cadence == 24:
            return "Rule 27(2)(a)"
        elif cadence == 60:
            return "Rule 27(2)(b)"
        else:
            return "Rule 27(2)(c)"

    @classmethod
    def get_end_of_quarter(cls, dt: datetime) -> datetime:
        """
        Calculates the end timestamp of the calendar quarter containing dt.
        Q1: March 31, Q2: June 30, Q3: September 30, Q4: December 31
        """
        year = dt.year
        quarter = (dt.month - 1) // 3 + 1
        end_month = quarter * 3
        last_day = calendar.monthrange(year, end_month)[1]
        tz = dt.tzinfo or timezone.utc
        return datetime(year, end_month, last_day, 23, 59, 59, tzinfo=tz)

    @classmethod
    def calculate_statutory_expiry(
        cls,
        stamping_date: datetime,
        category: InstrumentCategory | str,
        align_to_quarter_end: bool = True,
    ) -> datetime:
        """
        Computes statutory expiry date based on Rule 27 parameters:
        - Rule 27(2)(a) (24 Months): Expires at the end of the quarter of the 24th month.
        - Rule 27(2)(b) (60 Months): 5-year dipping table calibration validity.
        - Rule 27(2)(c) (12 Months): 1-year operational cycle.
        """
        months = cls.get_cadence_months(category)
        tz = stamping_date.tzinfo or timezone.utc
        
        # Approximate rollover
        target_year = stamping_date.year + (stamping_date.month + months - 1) // 12
        target_month = (stamping_date.month + months - 1) % 12 + 1
        last_day = calendar.monthrange(target_year, target_month)[1]
        target_day = min(stamping_date.day, last_day)

        target_date = datetime(
            target_year, target_month, target_day,
            stamping_date.hour, stamping_date.minute, stamping_date.second,
            tzinfo=tz,
        )

        # For 24-month weights/measures under Rule 27(2)(a), cycle extends to the end of the quarter
        if months == 24 and align_to_quarter_end:
            return cls.get_end_of_quarter(target_date)

        return target_date

    # Backwards-compatible alias
    calculate_expiry = calculate_statutory_expiry

    @classmethod
    def get_quarter_stamp_code(cls, dt: datetime, inspector_code: str = "01", state_code: str = "KL") -> str:
        """
        Generates the standard statutory seal impression code (e.g. KL-04 / B-26)
        as mandated on Page 42 of the Statutory Specifications.
        """
        quarter_num = (dt.month - 1) // 3 + 1
        q_letter = QUARTER_LETTERS[quarter_num]
        year_short = str(dt.year)[-2:]
        return f"{state_code}-{inspector_code} / {q_letter}-{year_short}"

    @classmethod
    def evaluate_status(
        cls,
        stamping_date: datetime,
        expiry_date: datetime,
        category: InstrumentCategory | str,
        is_dismantled: bool = False,
        is_relocated: bool = False,
        is_repaired: bool = False,
        is_adjusted: bool = False,
        seal_tampered: bool = False,
        eeprom_mismatch: bool = False,
    ) -> Dict[str, Any]:
        """
        Evaluates the statutory state under Rule 27 of the Legal Metrology (General) Rules, 2011:
        - Rule 27(3): Dismantling or relocation in-situ triggers IMMEDIATE REVOCATION.
        - Rule 27(4): Repair or mechanical/electronic adjustment triggers IMMEDIATE REVOCATION.
        - Security alert for foil seal broken or EEPROM calibration counter mismatch.
        - Expiry checking against statutory validity period.
        """
        now = datetime.now(timezone.utc)
        if stamping_date.tzinfo is None:
            stamping_date = stamping_date.replace(tzinfo=timezone.utc)
        if expiry_date.tzinfo is None:
            expiry_date = expiry_date.replace(tzinfo=timezone.utc)

        norm_cat = cls.normalize_category(category)
        cadence_months = cls.get_cadence_months(norm_cat)
        rule_clause = cls.get_statutory_rule_clause(norm_cat)

        # Rule 27(3): Dismantled or relocated in-situ before statutory due date
        if is_dismantled or is_relocated:
            return {
                "status": CertificateStatus.INVALIDATED_RELOCATION.value,
                "is_valid": False,
                "statutory_rule": "Rule 27(3)",
                "reason": "Rule 27(3): Stamping immediately revoked because instrument was dismantled or relocated before due date. Mandatory re-verification required prior to recommissioning.",
                "days_remaining": 0,
                "action_required": "RE_VERIFICATION_MANDATORY",
            }

        # Rule 27(4): Repaired or mechanically/electronically adjusted
        if is_repaired or is_adjusted:
            return {
                "status": CertificateStatus.INVALIDATED_REPAIR.value,
                "is_valid": False,
                "statutory_rule": "Rule 27(4)",
                "reason": "Rule 27(4): Stamping immediately revoked because instrument underwent repair or mechanical/electronic adjustment. Mandatory re-verification required prior to reuse.",
                "days_remaining": 0,
                "action_required": "RE_VERIFICATION_MANDATORY",
            }

        # Seal / EEPROM Tampering
        if seal_tampered or eeprom_mismatch:
            return {
                "status": CertificateStatus.SUSPENDED_TAMPERED.value,
                "is_valid": False,
                "statutory_rule": "Anti-Fraud Hardware Binding",
                "reason": "Security Alert: Tamper-evident holographic foil broken or internal EEPROM calibration counter mismatch.",
                "days_remaining": 0,
                "action_required": "ENFORCEMENT_INVESTIGATION",
            }

        # Operational Expiry
        if now > expiry_date:
            days_overdue = (now - expiry_date).days
            overdue_quarters = math_ceil_quarters(days_overdue)
            return {
                "status": CertificateStatus.EXPIRED.value,
                "is_valid": False,
                "statutory_rule": rule_clause,
                "reason": f"Statutory validity period of {cadence_months} months has expired.",
                "days_remaining": 0,
                "days_overdue": days_overdue,
                "overdue_quarters": overdue_quarters,
                "action_required": "PERIODICAL_RENEWAL",
            }

        days_left = max(0, (expiry_date - now).days)
        return {
            "status": CertificateStatus.ACTIVE.value,
            "is_valid": True,
            "statutory_rule": rule_clause,
            "cadence_months": cadence_months,
            "reason": f"Statutorily verified and compliant under {rule_clause}.",
            "days_remaining": days_left,
            "action_required": "NONE",
        }

def math_ceil_quarters(days: int) -> int:
    if days <= 0:
        return 0
    # ~91.25 days per quarter; any part thereof constitutes a quarter
    import math
    return max(1, math.ceil(days / 91.25))
