"""
Algorithmic Seventh Schedule MPE Tolerance Engine & Continuous Rounding
Legal Metrology Act, 2009 & Legal Metrology (General) Rules, 2011
Seventh Schedule, Heading A, Part II (Table 20) - Non-Automatic Weighing Instruments (NAWI)
Rule Reference: Clause 3(6)(i) (Initial Verification) and Clause 3(6)(ii) (In-Service Inspection / Field Surveillance)
"""

from enum import Enum
from typing import Dict, Any, Optional, Tuple
from app.services.fee_engine import TwelfthScheduleFeeEngine, FeeCategory

class AccuracyClass(str, Enum):
    CLASS_I = "I"        # Special Accuracy (Analytical balances: e >= 1mg, n >= 50,000)
    CLASS_II = "II"      # High Accuracy (Laboratory, precision balances: n >= 100 or n >= 5,000)
    CLASS_III = "III"    # Medium Accuracy (Commercial retail, weighbridges, platform: n >= 100 or n >= 500)
    CLASS_IIII = "IIII"  # Ordinary Accuracy (Bulk weighing, crane scales: 100 <= n <= 1,000)
    CLASS_IV = "IV"      # Alias for IIII

class InspectionType(str, Enum):
    INITIAL_VERIFICATION = "INITIAL_VERIFICATION"  # 1.0x MPE
    IN_SERVICE = "IN_SERVICE"                      # 2.0x MPE (Field Surveillance)
    FIELD_INSPECTION = "FIELD_INSPECTION"          # Alias for IN_SERVICE

# Statutory Table 20 Limits: (max_m_in_e, initial_mpe_e, in_service_mpe_e)
TABLE_20_STATUTORY: Dict[AccuracyClass, list] = {
    AccuracyClass.CLASS_I: [
        (50000.0, 0.5, 1.0),
        (200000.0, 1.0, 2.0),
        (float("inf"), 1.5, 3.0),
    ],
    AccuracyClass.CLASS_II: [
        (5000.0, 0.5, 1.0),
        (20000.0, 1.0, 2.0),
        (float("inf"), 1.5, 3.0),
    ],
    AccuracyClass.CLASS_III: [
        (500.0, 0.5, 1.0),
        (2000.0, 1.0, 2.0),
        (float("inf"), 1.5, 3.0),
    ],
    AccuracyClass.CLASS_IIII: [
        (50.0, 0.5, 1.0),
        (200.0, 1.0, 2.0),
        (float("inf"), 1.5, 3.0),
    ],
}
TABLE_20_STATUTORY[AccuracyClass.CLASS_IV] = TABLE_20_STATUTORY[AccuracyClass.CLASS_IIII]

class MPEToleranceEngine:
    """
    Statutory Engine computing Maximum Permissible Error (MPE) curves
    under Seventh Schedule Table 20 and continuous rounding via turning points.
    """

    @staticmethod
    def normalize_accuracy_class(accuracy_class: AccuracyClass | str) -> AccuracyClass:
        val = accuracy_class.value if isinstance(accuracy_class, AccuracyClass) else str(accuracy_class).strip().upper()
        if val in ("IV", "CLASS_IV", "CLASS IV"):
            return AccuracyClass.CLASS_IIII
        for member in AccuracyClass:
            if member.value == val or member.name == val:
                return AccuracyClass.CLASS_IIII if member == AccuracyClass.CLASS_IV else member
        return AccuracyClass.CLASS_III

    @classmethod
    def get_table_20_tier(cls, accuracy_class: AccuracyClass, load_in_e: float) -> Tuple[float, float, float]:
        """
        Returns (max_m_e, initial_mpe_e, in_service_mpe_e) for a given load expressed in intervals of e.
        """
        norm_class = cls.normalize_accuracy_class(accuracy_class)
        tiers = TABLE_20_STATUTORY.get(norm_class)
        if not tiers:
            raise ValueError(f"Unsupported accuracy class: {accuracy_class}")

        load_abs = abs(load_in_e)
        for max_m, init_mpe, ins_mpe in tiers:
            if load_abs <= max_m:
                return (max_m, init_mpe, ins_mpe)
        return (float("inf"), 1.5, 3.0)

    @classmethod
    def calculate_statutory_mpe(
        cls,
        accuracy_class: AccuracyClass | str,
        load_mass: float,
        scale_interval_e: float,
        inspection_type: InspectionType | str = InspectionType.IN_SERVICE,
    ) -> Dict[str, Any]:
        """
        Computes statutory MPE limits for a specific load under Seventh Schedule Table 20.
        Clause 3(6)(i) (Initial Verification): MPE = +/-0.5e, +/-1.0e, +/-1.5e
        Clause 3(6)(ii) (In-Service / Field): MPE = +/-1.0e, +/-2.0e, +/-3.0e (2x multiplier)
        """
        if scale_interval_e <= 0:
            raise ValueError("Scale interval 'e' must be strictly positive.")

        norm_class = cls.normalize_accuracy_class(accuracy_class)
        norm_inspection = (
            inspection_type.value if isinstance(inspection_type, InspectionType)
            else str(inspection_type).strip().upper()
        )
        is_field = norm_inspection in (
            InspectionType.IN_SERVICE.value,
            InspectionType.FIELD_INSPECTION.value,
            "IN_SERVICE",
            "FIELD_INSPECTION",
            "FIELD",
        )

        load_in_e = load_mass / scale_interval_e
        max_tier_e, initial_mpe_e, in_service_mpe_e = cls.get_table_20_tier(norm_class, load_in_e)

        effective_mpe_e = in_service_mpe_e if is_field else initial_mpe_e
        multiplier = 2.0 if is_field else 1.0
        effective_mpe_mass = effective_mpe_e * scale_interval_e

        return {
            "accuracy_class": norm_class.value,
            "load_mass": load_mass,
            "scale_interval_e": scale_interval_e,
            "load_in_e": round(load_in_e, 4),
            "tier_max_e": max_tier_e if max_tier_e != float("inf") else "> 200,000e",
            "base_mpe_e": initial_mpe_e,
            "multiplier": multiplier,
            "effective_mpe_e": effective_mpe_e,
            "effective_mpe_mass": round(effective_mpe_mass, 6),
            "inspection_type": "IN_SERVICE" if is_field else "INITIAL_VERIFICATION",
            "statutory_clause": "Clause 3(6)(ii) In-Service (Field)" if is_field else "Clause 3(6)(i) Initial Verification",
        }

    @classmethod
    def evaluate_turning_point_load(
        cls,
        accuracy_class: AccuracyClass | str,
        load_mass: float,
        indicated_mass: float,
        delta_l: float,
        scale_interval_e: float,
        inspection_type: InspectionType | str = InspectionType.IN_SERVICE,
        zero_error: float = 0.0,
    ) -> Dict[str, Any]:
        """
        Evaluates test load using continuous rounding via turning points (error before rounding):
        Implementation Note (Statutory Specification Module 3.1):
        ΔL = turning point addition
        P = I + 0.5e - ΔL  (true indication before rounding)
        E = P - L = I + 0.5e - ΔL - L  (error before rounding)
        E_c = E - E_0  (corrected error against zero load)
        Status = PASS if |E| <= MPE else FAIL
        """
        # Continuous rounding calculation of true pre-rounding indication P
        p_indicated = indicated_mass + (0.5 * scale_interval_e) - delta_l
        
        # Raw error before rounding E = P - L
        error_raw = p_indicated - load_mass
        
        # Corrected error E_c = E - E_0
        error_corrected = error_raw - zero_error

        # Table 20 MPE threshold
        mpe_spec = cls.calculate_statutory_mpe(
            accuracy_class=accuracy_class,
            load_mass=load_mass,
            scale_interval_e=scale_interval_e,
            inspection_type=inspection_type,
        )

        effective_limit_mass = mpe_spec["effective_mpe_mass"]
        is_compliant = abs(error_corrected) <= (effective_limit_mass + 1e-9)
        utilization = (abs(error_corrected) / effective_limit_mass) * 100.0 if effective_limit_mass > 0 else 0.0

        return {
            **mpe_spec,
            "indicated_mass": indicated_mass,
            "delta_l": delta_l,
            "p_true_indication": round(p_indicated, 6),
            "raw_error": round(error_raw, 6),
            "zero_error": round(zero_error, 6),
            "corrected_error": round(error_corrected, 6),
            "is_compliant": is_compliant,
            "status": "PASS" if is_compliant else "FAIL",
            "tolerance_utilization_pct": round(utilization, 2),
            "rule_reference": "Seventh Schedule, Heading A, Part II (Table 20) & Continuous Rounding",
            "formula_applied": "P = I + 0.5e - ΔL; E = P - L",
        }

    @classmethod
    def validate_classification_criteria(
        cls,
        accuracy_class: AccuracyClass | str,
        scale_interval_e_grams: float,
        capacity_max_grams: float,
    ) -> Dict[str, Any]:
        """
        Verifies classification criteria (n = Max/e) under Section 3.1:
        Class I: e >= 1mg (0.001g), n >= 50,000
        Class II: 0.001g <= e <= 0.05g, n >= 100; or e >= 0.1g, n >= 5000
        Class III: 0.1g <= e <= 2g, n >= 100; or e >= 5g, n >= 500
        Class IV: e >= 5g, 100 <= n <= 1000
        """
        norm_class = cls.normalize_accuracy_class(accuracy_class)
        n = capacity_max_grams / scale_interval_e_grams if scale_interval_e_grams > 0 else 0
        is_valid = True
        criteria_msg = ""

        if norm_class == AccuracyClass.CLASS_I:
            is_valid = (scale_interval_e_grams >= 0.001) and (n >= 50000)
            criteria_msg = "Class I requires e >= 1mg (0.001g) and n >= 50,000."
        elif norm_class == AccuracyClass.CLASS_II:
            cond1 = (0.001 <= scale_interval_e_grams <= 0.05) and (n >= 100)
            cond2 = (scale_interval_e_grams >= 0.1) and (n >= 5000)
            is_valid = cond1 or cond2
            criteria_msg = "Class II requires (0.001g <= e <= 0.05g, n >= 100) or (e >= 0.1g, n >= 5000)."
        elif norm_class == AccuracyClass.CLASS_III:
            cond1 = (0.1 <= scale_interval_e_grams <= 2.0) and (n >= 100)
            cond2 = (scale_interval_e_grams >= 5.0) and (n >= 500)
            is_valid = cond1 or cond2
            criteria_msg = "Class III requires (0.1g <= e <= 2g, n >= 100) or (e >= 5g, n >= 500)."
        elif norm_class == AccuracyClass.CLASS_IIII:
            is_valid = (scale_interval_e_grams >= 5.0) and (100 <= n <= 1000)
            criteria_msg = "Class IV requires e >= 5g and 100 <= n <= 1000."

        return {
            "accuracy_class": norm_class.value,
            "scale_interval_e_grams": scale_interval_e_grams,
            "capacity_max_grams": capacity_max_grams,
            "number_of_intervals_n": round(n, 2),
            "is_statutorily_valid": is_valid,
            "statutory_criteria": criteria_msg,
        }

    # Integration helper with Twelfth Schedule Fee Engine
    @classmethod
    def calculate_statutory_fee(
        cls,
        fee_category: FeeCategory | str,
        capacity_or_param: float,
        unit: str = "kg",
        quantity: int = 1,
        sub_type: Optional[str] = None,
        instrument_designation: str = "",
        is_user_requested_onsite: bool = False,
        is_licensed_premises: bool = False,
        delay_quarters: int = 0,
    ) -> Dict[str, Any]:
        """
        Direct interface to Twelfth Schedule Fee Calculation Engine.
        """
        cat_enum = (
            fee_category if isinstance(fee_category, FeeCategory)
            else FeeCategory(str(fee_category).upper())
        )
        base = TwelfthScheduleFeeEngine.calculate_base_fee(
            category=cat_enum,
            capacity_or_param=capacity_or_param,
            unit=unit,
            quantity=quantity,
            sub_type=sub_type,
        )
        billing = TwelfthScheduleFeeEngine.calculate_total_billing(
            base_fee=base["total_base_fee"],
            instrument_designation=instrument_designation or base["description"],
            is_user_requested_onsite=is_user_requested_onsite,
            is_licensed_premises=is_licensed_premises,
            delay_quarters=delay_quarters,
        )
        return {**base, **billing}
