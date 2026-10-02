from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.services.mpe_engine import AccuracyClass, InspectionType
from app.services.fee_engine import FeeCategory

class MPECalculationRequest(BaseModel):
    accuracy_class: AccuracyClass = Field(..., description="NAWI Class I, II, III, or IIII/IV")
    load_mass: float = Field(..., gt=0, description="Test load applied in kg or grams")
    scale_interval_e: float = Field(..., gt=0, description="Verification scale interval 'e' in identical unit")
    inspection_type: InspectionType = Field(InspectionType.IN_SERVICE, description="INITIAL_VERIFICATION or IN_SERVICE")

class MPECalculationResponse(BaseModel):
    accuracy_class: str
    load_mass: float
    scale_interval_e: float
    load_in_e: float
    tier_max_e: Any
    base_mpe_e: float
    multiplier: float
    effective_mpe_e: float
    effective_mpe_mass: float
    inspection_type: str
    statutory_clause: str

class TurningPointEvaluationRequest(BaseModel):
    accuracy_class: AccuracyClass = Field(..., description="NAWI Class I, II, III, or IIII/IV")
    load_mass: float = Field(..., gt=0, description="Test load applied L")
    indicated_mass: float = Field(..., ge=0, description="Observed instrument reading I")
    delta_l: float = Field(..., ge=0, description="Additional turning point weights added until transition ΔL")
    scale_interval_e: float = Field(..., gt=0, description="Verification scale interval e")
    inspection_type: InspectionType = Field(InspectionType.IN_SERVICE, description="INITIAL_VERIFICATION or IN_SERVICE")
    zero_error: float = Field(0.0, description="Zero load error E0 if measured")

class TurningPointEvaluationResponse(BaseModel):
    accuracy_class: str
    load_mass: float
    indicated_mass: float
    delta_l: float
    scale_interval_e: float
    p_true_indication: float
    raw_error: float
    zero_error: float
    corrected_error: float
    effective_mpe_mass: float
    is_compliant: bool
    status: str
    tolerance_utilization_pct: float
    inspection_type: str
    rule_reference: str
    formula_applied: str

class ClassificationValidationRequest(BaseModel):
    accuracy_class: AccuracyClass = Field(..., description="NAWI Class I, II, III, or IIII/IV")
    scale_interval_e_grams: float = Field(..., gt=0, description="Verification scale interval 'e' in grams")
    capacity_max_grams: float = Field(..., gt=0, description="Max capacity in grams")

class ClassificationValidationResponse(BaseModel):
    accuracy_class: str
    scale_interval_e_grams: float
    capacity_max_grams: float
    number_of_intervals_n: float
    is_statutorily_valid: bool
    statutory_criteria: str

class FeeCalculationRequest(BaseModel):
    category: str = Field(..., description="Twelfth Schedule Category (e.g. NAWI_MECHANICAL_CLASS_III_IV, NAWI_ELECTRONIC_CLASS_I_II, COMMERCIAL_WEIGHTS)")
    capacity_or_param: float = Field(..., gt=0, description="Capacity in kg, volume in L, length in m, or compartment count")
    unit: str = Field("kg", description="Unit: kg, g, ton, L, ml, m")
    quantity: int = Field(1, ge=1, description="Quantity / pieces / sets")
    sub_type: Optional[str] = Field(None, description="Sub-type designation (e.g. weighbridge, tape, peg, sheet)")
    instrument_designation: Optional[str] = Field(None, description="Full instrument name (checked for non-movable exemption)")
    is_user_requested_onsite: bool = Field(False, description="User-requested on-site verification at private premises (50% surcharge if non-exempt)")
    is_licensed_premises: bool = Field(False, description="Testing in premises of licensed manufacturer/repairer (exempt)")
    delay_quarters: int = Field(0, ge=0, description="Quarters of delay after expiry (50% penalty per quarter)")
    custom_th_cost: Optional[float] = Field(None, description="Transport & handling expenses (minimum Rs. 100)")

class FeeCalculationResponse(BaseModel):
    category: str
    unit_fee: float
    quantity: int
    total_base_fee: float
    description: str
    base_verification_fee: float
    is_user_requested_onsite: bool
    is_non_movable_exempt: bool
    in_situ_surcharge_pct: float
    in_situ_surcharge: float
    travel_handling_cost: float
    delay_quarters: int
    late_penalty: float
    total_statutory_billing: float
    surcharge_reason: str
    statutory_reference: str
