from fastapi import APIRouter, HTTPException, status
from app.schemas.mpe import (
    MPECalculationRequest,
    MPECalculationResponse,
    TurningPointEvaluationRequest,
    TurningPointEvaluationResponse,
    ClassificationValidationRequest,
    ClassificationValidationResponse,
    FeeCalculationRequest,
    FeeCalculationResponse,
)
from app.services.mpe_engine import MPEToleranceEngine

router = APIRouter()

@router.post("/calculate", response_model=MPECalculationResponse, summary="Compute Statutory Seventh Schedule MPE")
async def calculate_mpe(payload: MPECalculationRequest):
    """
    Computes statutory Maximum Permissible Error (MPE) for Non-Automatic Weighing Instruments
    under the Legal Metrology (General) Rules, 2011 (Seventh Schedule, Heading A, Part II, Table 20).
    """
    try:
        result = MPEToleranceEngine.calculate_statutory_mpe(
            accuracy_class=payload.accuracy_class,
            load_mass=payload.load_mass,
            scale_interval_e=payload.scale_interval_e,
            inspection_type=payload.inspection_type,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/evaluate", response_model=TurningPointEvaluationResponse, summary="Evaluate Turning-Point Error Load Test")
async def evaluate_turning_point(payload: TurningPointEvaluationRequest):
    """
    Evaluates field pre-rounding error using continuous rounding via turning points:
    P = I + 0.5e - ΔL  (true indication before rounding)
    E = P - L = I + 0.5e - ΔL - L  (error before rounding)
    E_c = E - E_0  (corrected error against zero load)
    Status = PASS if |E| <= MPE else FAIL.
    """
    try:
        result = MPEToleranceEngine.evaluate_turning_point_load(
            accuracy_class=payload.accuracy_class,
            load_mass=payload.load_mass,
            indicated_mass=payload.indicated_mass,
            delta_l=payload.delta_l,
            scale_interval_e=payload.scale_interval_e,
            inspection_type=payload.inspection_type,
            zero_error=payload.zero_error,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/validate-criteria", response_model=ClassificationValidationResponse, summary="Validate NAWI Classification Criteria")
async def validate_criteria(payload: ClassificationValidationRequest):
    """
    Validates verification scale interval 'e' and resolution n = Max/e against statutory classification bounds.
    """
    try:
        result = MPEToleranceEngine.validate_classification_criteria(
            accuracy_class=payload.accuracy_class,
            scale_interval_e_grams=payload.scale_interval_e_grams,
            capacity_max_grams=payload.capacity_max_grams,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/fee/calculate", response_model=FeeCalculationResponse, summary="Calculate Twelfth Schedule Verification Fee & In-Situ Surcharge")
async def calculate_statutory_fee(payload: FeeCalculationRequest):
    """
    Calculates Twelfth Schedule statutory fee with Section 4.2 enforcement rules:
    Total Statutory Billing = Base Verification Fee + In-Situ Surcharge (50%) + T&H Cost (min Rs 100) + Late Penalty (50%/quarter).
    Exempts non-movable instruments (weighbridges, fuel dispensers, platform scales, tanks).
    """
    try:
        result = MPEToleranceEngine.calculate_statutory_fee(
            fee_category=payload.category,
            capacity_or_param=payload.capacity_or_param,
            unit=payload.unit,
            quantity=payload.quantity,
            sub_type=payload.sub_type,
            instrument_designation=payload.instrument_designation or payload.sub_type or "",
            is_user_requested_onsite=payload.is_user_requested_onsite,
            is_licensed_premises=payload.is_licensed_premises,
            delay_quarters=payload.delay_quarters,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
