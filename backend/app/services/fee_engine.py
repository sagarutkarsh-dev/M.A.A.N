"""
Twelfth Schedule Statutory Fee Calculation Engine & Enforcement Surcharges
Legal Metrology Act, 2009 & Legal Metrology (General) Rules, 2011 (Twelfth Schedule)
Module 4: Statutory Fee Matrix & Enforcement Schedules

Billing Formula:
Total Statutory Billing = Base Verification Fee + In-Situ Surcharge + Travel/Handling Cost + Late Penalty
"""

import math
from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class FeeCategory(str, Enum):
    BULLION_WEIGHTS = "BULLION_WEIGHTS"
    CARAT_WEIGHTS = "CARAT_WEIGHTS"
    COMMERCIAL_WEIGHTS = "COMMERCIAL_WEIGHTS"
    LINEAR_MEASURES = "LINEAR_MEASURES"
    LIQUID_CAPACITY_MEASURES = "LIQUID_CAPACITY_MEASURES"
    BEAM_SCALES_CLASS_AB = "BEAM_SCALES_CLASS_AB"
    BEAM_SCALES_CLASS_CD = "BEAM_SCALES_CLASS_CD"
    COUNTER_MACHINES = "COUNTER_MACHINES"
    NAWI_MECHANICAL_CLASS_III_IV = "NAWI_MECHANICAL_CLASS_III_IV"
    NAWI_ELECTRONIC_CLASS_I_II = "NAWI_ELECTRONIC_CLASS_I_II"
    AUTOMATIC_WEIGHING_INSTRUMENTS = "AUTOMATIC_WEIGHING_INSTRUMENTS"
    VOLUMETRIC_INSTRUMENTS = "VOLUMETRIC_INSTRUMENTS"
    STORAGE_TANKS_AND_LORRIES = "STORAGE_TANKS_AND_LORRIES"
    MEDICAL_AND_PUBLIC_TRANSPORT = "MEDICAL_AND_PUBLIC_TRANSPORT"

# Non-movable / in-situ mandate instruments strictly EXEMPT from the 50% on-site surcharge and T&H fees
EXEMPT_NON_MOVABLE_KEYWORDS = {
    "vehicle tank", "tank lorry", "fuel dispenser", "petrol dispenser", "diesel dispenser",
    "cng dispenser", "lpg dispenser", "dispenser", "weighbridge", "platform scale",
    "crane scale", "rail-weighbridge", "hopper weigher", "storage tank", "vertical oil tank",
    "bulk vat", "bulk meter", "flow meter"
}

class TwelfthScheduleFeeEngine:
    """
    Computes statutory verification & re-verification fees under Twelfth Schedule,
    evaluating user-premise in-situ surcharges, exemptions, and late penalties.
    """

    @classmethod
    def is_non_movable_exempt(cls, instrument_designation: str, is_licensed_premises: bool = False) -> bool:
        """
        Under Section 4.2 of statutory specifications:
        No additional 50% fee or T&H charge applies for instruments that cannot or
        should not be moved from their location (In-situ mandate):
        - Vehicle tanks, fuel/CNG/LPG dispensers, weighbridges, platform scales,
          crane scales, in-motion rail-weighbridges, discontinuous hopper weighers,
          vertical storage tanks.
        - Testing conducted in premises of licensed manufacturers or repairers.
        """
        if is_licensed_premises:
            return True

        normalized = instrument_designation.lower().strip()
        for kw in EXEMPT_NON_MOVABLE_KEYWORDS:
            if kw in normalized:
                return True
        return False

    @classmethod
    def calculate_base_fee(
        cls,
        category: FeeCategory,
        capacity_or_param: float,
        unit: str = "kg",
        quantity: int = 1,
        sub_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Calculates the Twelfth Schedule base verification fee based on capacity tiers.
        """
        fee_per_unit = 0.0
        description = ""

        # 1. Bullion Weights (10 kg: ₹30, 1-5 kg: ₹20, 1 mg - 500 g: ₹15)
        if category == FeeCategory.BULLION_WEIGHTS:
            cap_kg = capacity_or_param if unit == "kg" else capacity_or_param / 1000.0
            if cap_kg >= 10.0:
                fee_per_unit = 30.0
                description = "Bullion Weight: 10 kg tier"
            elif cap_kg >= 1.0:
                fee_per_unit = 20.0
                description = "Bullion Weight: 1 kg to 5 kg tier"
            else:
                fee_per_unit = 15.0
                description = "Bullion Weight: 1 mg to 500 g tier"

        # 2. Carat Weights (₹20 per set / piece)
        elif category == FeeCategory.CARAT_WEIGHTS:
            fee_per_unit = 20.0
            description = "Carat Weights: Per set / piece"

        # 3. Commercial Cast Iron / Brass
        elif category == FeeCategory.COMMERCIAL_WEIGHTS:
            cap_kg = capacity_or_param if unit == "kg" else capacity_or_param / 1000.0
            if sub_type and "sheet" in sub_type.lower():
                fee_per_unit = 15.0
                description = "Commercial Weights: Milligram sheets (per set)"
            elif cap_kg >= 50.0:
                fee_per_unit = 25.0
                description = "Commercial Weights: 50 kg"
            elif cap_kg >= 5.0:
                fee_per_unit = 20.0
                description = "Commercial Weights: 20 kg to 5 kg"
            else:
                fee_per_unit = 15.0
                description = "Commercial Weights: 2 kg to 1 g"

        # 4. Linear Measures
        elif category == FeeCategory.LINEAR_MEASURES:
            length_m = capacity_or_param
            sub_lower = (sub_type or "").lower()
            if "chain" in sub_lower:
                fee_per_unit = 100.0
                description = "Survey Chains (20 m, 30 m)"
            elif "folding" in sub_lower:
                fee_per_unit = 20.0
                description = "Folding scales (0.5 m, 1 m)"
            elif "tape" in sub_lower:
                if length_m <= 5.0:
                    fee_per_unit = 5.0
                    description = "Fabric/Plastic/Steel tape (up to 5 m)"
                else:
                    # ₹10 for 1st 10m + ₹5 per addl. 5m
                    extra_m = max(0.0, length_m - 10.0)
                    additional_steps = math.ceil(extra_m / 5.0)
                    fee_per_unit = 10.0 + (additional_steps * 5.0)
                    description = f"Tapes above 5 m ({length_m} m)"
            else:
                fee_per_unit = 10.0
                description = "Non-flexible (rigid) length measure up to 2 m"

        # 5. Liquid Capacity Measures
        elif category == FeeCategory.LIQUID_CAPACITY_MEASURES:
            vol_l = capacity_or_param if unit == "L" else capacity_or_param / 1000.0
            sub_lower = (sub_type or "").lower()
            if "peg" in sub_lower:
                fee_per_unit = 50.0
                description = "Liquor Peg Measures (30 ml, 60 ml, 100 ml)"
            elif vol_l > 5.0:
                fee_per_unit = 20.0
                description = "Liquid Capacity: Above 5 L to 20 L"
            elif vol_l >= 1.0:
                fee_per_unit = 10.0
                description = "Liquid Capacity: 1 L to 5 L"
            else:
                fee_per_unit = 5.0
                description = "Liquid Capacity: Below 1 L"

        # 6. Beam Scales (Class A & B)
        elif category == FeeCategory.BEAM_SCALES_CLASS_AB:
            cap_kg = capacity_or_param if unit == "kg" else capacity_or_param / 1000.0
            if cap_kg > 50.0:
                fee_per_unit = 200.0
                description = "Beam Scales (Class A&B): Exceeding 50 kg"
            elif cap_kg > 5.0:
                fee_per_unit = 150.0
                description = "Beam Scales (Class A&B): Above 5 kg up to 50 kg"
            elif cap_kg >= 1.0:
                fee_per_unit = 100.0
                description = "Beam Scales (Class A&B): 1 kg to 5 kg"
            else:
                fee_per_unit = 60.0
                description = "Beam Scales (Class A&B): 500 g and below"

        # 7. Beam Scales (Class C & D)
        elif category == FeeCategory.BEAM_SCALES_CLASS_CD:
            cap_kg = capacity_or_param if unit == "kg" else capacity_or_param / 1000.0
            if cap_kg >= 1000.0:
                fee_per_unit = 200.0
                description = "Beam Scales (Class C&D): 1000 kg"
            elif cap_kg > 50.0:
                fee_per_unit = 100.0
                description = "Beam Scales (Class C&D): Above 50 kg up to 500 kg"
            elif cap_kg >= 5.0:
                fee_per_unit = 30.0
                description = "Beam Scales (Class C&D): 5 kg to 50 kg"
            else:
                fee_per_unit = 15.0
                description = "Beam Scales (Class C&D): Below 5 kg"

        # 8. Counter Machines
        elif category == FeeCategory.COUNTER_MACHINES:
            cap_kg = capacity_or_param if unit == "kg" else capacity_or_param / 1000.0
            if cap_kg <= 10.0:
                fee_per_unit = 30.0
                description = "Counter Machine: Up to 10 kg"
            else:
                fee_per_unit = 50.0
                description = "Counter Machine: Above 10 kg up to 50 kg"

        # 9. NAWI (Mechanical - Class III/IV)
        elif category == FeeCategory.NAWI_MECHANICAL_CLASS_III_IV:
            cap_kg = capacity_or_param if unit == "kg" else (capacity_or_param * 1000.0 if unit == "ton" else capacity_or_param / 1000.0)
            if cap_kg <= 50.0:
                fee_per_unit = 100.0
                description = "NAWI Mechanical: Up to 50 kg"
            elif cap_kg <= 300.0:
                fee_per_unit = 200.0
                description = "NAWI Mechanical: Above 50 kg up to 300 kg"
            elif cap_kg <= 1500.0:
                fee_per_unit = 400.0
                description = "NAWI Mechanical: Above 300 kg up to 1500 kg"
            elif cap_kg <= 5000.0:
                fee_per_unit = 1000.0
                description = "NAWI Mechanical: Above 1500 kg up to 5000 kg"
            elif cap_kg <= 10000.0:
                fee_per_unit = 2000.0
                description = "NAWI Mechanical: Above 5000 kg up to 10,000 kg"
            elif cap_kg <= 50000.0:
                fee_per_unit = 4000.0
                description = "NAWI Mechanical: Above 10,000 kg (Weighbridges up to 50 t)"
            else:
                fee_per_unit = 5000.0
                description = "NAWI Mechanical: Exceeding 50,000 kg (Weighbridges > 50 t)"

        # 10. NAWI (Electronic - Class I & II)
        elif category == FeeCategory.NAWI_ELECTRONIC_CLASS_I_II:
            cap_kg = capacity_or_param if unit == "kg" else (capacity_or_param * 1000.0 if unit == "ton" else capacity_or_param / 1000.0)
            if cap_kg <= 10.0:
                fee_per_unit = 200.0
                description = "NAWI Electronic Class I/II: Not exceeding 10 kg"
            elif cap_kg <= 50.0:
                fee_per_unit = 250.0
                description = "NAWI Electronic Class I/II: Above 10 kg up to 50 kg"
            elif cap_kg <= 1000.0:
                fee_per_unit = 500.0
                description = "NAWI Electronic Class I/II: Above 50 kg up to 1000 kg"
            elif cap_kg <= 10000.0:
                fee_per_unit = 2000.0
                description = "NAWI Electronic Class I/II: Above 1000 kg up to 10,000 kg"
            elif cap_kg <= 50000.0:
                fee_per_unit = 4000.0
                description = "NAWI Electronic Class I/II: Above 10,000 kg up to 50,000 kg"
            else:
                fee_per_unit = 5000.0
                description = "NAWI Electronic Class I/II: Exceeding 50,000 kg"

        # 11. Automatic Weighing Instruments (AWI)
        elif category == FeeCategory.AUTOMATIC_WEIGHING_INSTRUMENTS:
            fee_per_unit = 5000.0
            description = "AWI: In-motion rail weighbridges / Totalizing hoppers"

        # 12. Volumetric Instruments
        elif category == FeeCategory.VOLUMETRIC_INSTRUMENTS:
            sub_lower = (sub_type or "").lower()
            if "totaliz" in sub_lower:
                fee_per_unit = 500.0
                description = "Volumetric: Totalizing counter verification"
            elif "cng" in sub_lower:
                fee_per_unit = 1000.0
                description = "Volumetric: CNG Dispenser"
            elif "lpg" in sub_lower:
                fee_per_unit = 1000.0
                description = "Volumetric: LPG Dispenser"
            elif "bulk" in sub_lower:
                # Flow rate in L/min
                flow_rate = capacity_or_param
                if flow_rate <= 100.0:
                    fee_per_unit = 2000.0
                    description = "Bulk Flow Meters (up to 100 L/min)"
                else:
                    fee_per_unit = 3000.0
                    description = "Bulk Flow Meters (> 100 L/min)"
            else:
                fee_per_unit = 1000.0
                description = "Fuel Dispenser: Petrol / Diesel (per nozzle/unit)"

        # 13. Storage Tanks & Lorries
        elif category == FeeCategory.STORAGE_TANKS_AND_LORRIES:
            sub_lower = (sub_type or "").lower()
            if "lorry" in sub_lower or "vehicle tank" in sub_lower:
                compartments = max(1, int(capacity_or_param))
                fee_per_unit = 500.0 * compartments
                description = f"Vehicle Tank (Lorry): {compartments} compartment(s) @ ₹500"
            else:
                fee_per_unit = 5000.0
                description = "Storage Tanks (Vertical Oil Tanks) - ₹5000 max cap"

        # 14. Medical & Public Transport
        elif category == FeeCategory.MEDICAL_AND_PUBLIC_TRANSPORT:
            sub_lower = (sub_type or "").lower()
            if "thermo" in sub_lower:
                fee_per_unit = 0.50
                description = "Clinical Thermometer (per unit)"
            elif "sphygmo" in sub_lower or "bp" in sub_lower:
                fee_per_unit = 20.0
                description = "Sphygmomanometer / BP Apparatus (per unit)"
            else:
                fee_per_unit = 100.0
                description = "Taximeter / Auto-rickshaw fare meter"

        total_base = fee_per_unit * max(1, quantity)
        return {
            "category": category.value,
            "unit_fee": fee_per_unit,
            "quantity": quantity,
            "total_base_fee": total_base,
            "description": description,
        }

    @classmethod
    def calculate_total_billing(
        cls,
        base_fee: float,
        instrument_designation: str,
        is_user_requested_onsite: bool = False,
        is_licensed_premises: bool = False,
        delay_quarters: int = 0,
        custom_th_cost: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Applies Section 4.2 Surcharges & Penalties:
        Total Statutory Billing = Base Fee + In-Situ Surcharge + Travel/Handling Cost + Late Penalty

        Rules:
        - If user-requested on-site verification (at private premises):
          Add 50% surcharge (0.5 * Base Fee) + T&H cost (minimum ₹100.00).
        - Exemption: Non-movable / in-situ mandate instruments (e.g. weighbridges, fuel dispensers,
          storage tanks, vehicle tanks, platform scales) or licensed manufacturer/repairer premises
          pay 0% surcharge and 0 T&H.
        - Late Re-verification Penalty: 50% of base fee per quarter of delay (or part thereof).
        """
        is_exempt = cls.is_non_movable_exempt(instrument_designation, is_licensed_premises)

        # 1. In-Situ Surcharge (50% of Base Fee)
        if is_user_requested_onsite and not is_exempt:
            in_situ_surcharge = 0.50 * base_fee
            applied_surcharge_pct = 50.0
            # Transport & Handling fee (minimum ₹100.00)
            th_fee = max(100.0, custom_th_cost if custom_th_cost is not None else 100.0)
            surcharge_reason = "User-requested on-site verification at private premises (50% surcharge + T&H standards fee)."
        else:
            in_situ_surcharge = 0.0
            applied_surcharge_pct = 0.0
            th_fee = 0.0
            if is_exempt:
                surcharge_reason = "Exempt from on-site surcharge (non-movable in-situ mandate or licensed premises)."
            else:
                surcharge_reason = "Verification at LMO office / camp office (no on-site surcharge applied)."

        # 2. Late Penalty (50% of Base Fee per quarter of delay)
        effective_delay_quarters = max(0, delay_quarters)
        late_penalty = effective_delay_quarters * (0.50 * base_fee)

        # 3. Total Billing
        total_billing = base_fee + in_situ_surcharge + th_fee + late_penalty

        return {
            "base_verification_fee": round(base_fee, 2),
            "is_user_requested_onsite": is_user_requested_onsite,
            "is_non_movable_exempt": is_exempt,
            "in_situ_surcharge_pct": applied_surcharge_pct,
            "in_situ_surcharge": round(in_situ_surcharge, 2),
            "travel_handling_cost": round(th_fee, 2),
            "delay_quarters": effective_delay_quarters,
            "late_penalty": round(late_penalty, 2),
            "total_statutory_billing": round(total_billing, 2),
            "surcharge_reason": surcharge_reason,
            "statutory_reference": "Twelfth Schedule & Rule 4.2 Surcharges, Legal Metrology (General) Rules, 2011",
        }
