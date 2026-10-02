import pytest
from datetime import datetime, timezone, timedelta
from app.services.mpe_engine import MPEToleranceEngine, AccuracyClass, InspectionType
from app.services.rule27_fsm import Rule27StateMachine, InstrumentCategory, CertificateStatus
from app.services.fee_engine import TwelfthScheduleFeeEngine, FeeCategory

def test_class_iii_table_20_tiers():
    """
    Seventh Schedule Table 20 for Class III (Retail / Platform scales):
    0 <= m <= 500 e   -> Initial +/- 0.5 e, Field +/- 1.0 e
    500 < m <= 2000 e -> Initial +/- 1.0 e, Field +/- 2.0 e
    m > 2000 e        -> Initial +/- 1.5 e, Field +/- 3.0 e
    """
    scale_e = 5.0  # 5 grams

    # Tier 1: 1000g / 5g = 200e (<= 500e)
    # Field inspection: 1.0e = 5.0g
    res1 = MPEToleranceEngine.calculate_statutory_mpe(
        accuracy_class=AccuracyClass.CLASS_III,
        load_mass=1000.0,
        scale_interval_e=scale_e,
        inspection_type=InspectionType.IN_SERVICE,
    )
    assert res1["base_mpe_e"] == 0.5
    assert res1["multiplier"] == 2.0
    assert res1["effective_mpe_e"] == 1.0
    assert res1["effective_mpe_mass"] == 5.0

    # Tier 2: 5000g / 5g = 1000e (500e < m <= 2000e)
    # Field inspection: 2.0e = 10.0g
    res2 = MPEToleranceEngine.calculate_statutory_mpe(
        accuracy_class=AccuracyClass.CLASS_III,
        load_mass=5000.0,
        scale_interval_e=scale_e,
        inspection_type=InspectionType.IN_SERVICE,
    )
    assert res2["base_mpe_e"] == 1.0
    assert res2["effective_mpe_e"] == 2.0
    assert res2["effective_mpe_mass"] == 10.0

    # Tier 3: 15000g / 5g = 3000e (> 2000e)
    # Initial verification: 1.5e = 7.5g
    res3 = MPEToleranceEngine.calculate_statutory_mpe(
        accuracy_class=AccuracyClass.CLASS_III,
        load_mass=15000.0,
        scale_interval_e=scale_e,
        inspection_type=InspectionType.INITIAL_VERIFICATION,
    )
    assert res3["base_mpe_e"] == 1.5
    assert res3["multiplier"] == 1.0
    assert res3["effective_mpe_mass"] == 7.5

def test_continuous_rounding_turning_point_pass():
    """
    Continuous Rounding via Turning Points (Page 21 & Page 32):
    P = I + 0.5e - ΔL
    E = P - L = I + 0.5e - ΔL - L
    Status = PASS if |E| <= MPE

    Test Load L = 10,000 g, e = 5 g (m = 2000e -> Field MPE limit = 2.0e = 10.0 g)
    Indication I = 10,000 g
    Turning point addition ΔL = 2.0 g
    P = 10000 + 0.5(5) - 2.0 = 10000.5 g
    E = 10000.5 - 10000 = +0.5 g <= 10.0 g -> PASS
    """
    res = MPEToleranceEngine.evaluate_turning_point_load(
        accuracy_class=AccuracyClass.CLASS_III,
        load_mass=10000.0,
        indicated_mass=10000.0,
        delta_l=2.0,
        scale_interval_e=5.0,
        inspection_type=InspectionType.IN_SERVICE,
    )
    assert res["status"] == "PASS"
    assert res["is_compliant"] is True
    assert res["corrected_error"] == 0.5
    assert res["p_true_indication"] == 10000.5

def test_continuous_rounding_turning_point_fail():
    """
    Test continuous rounding failure when error exceeds MPE:
    L = 1000 g, e = 2 g (m = 500e -> Initial MPE = 0.5e = 1.0 g)
    I = 1002 g, ΔL = 0.2 g
    P = 1002 + 1.0 - 0.2 = 1002.8 g
    E = 1002.8 - 1000 = 2.8 g > 1.0 g -> FAIL
    """
    res = MPEToleranceEngine.evaluate_turning_point_load(
        accuracy_class=AccuracyClass.CLASS_III,
        load_mass=1000.0,
        indicated_mass=1002.0,
        delta_l=0.2,
        scale_interval_e=2.0,
        inspection_type=InspectionType.INITIAL_VERIFICATION,
    )
    assert res["status"] == "FAIL"
    assert res["is_compliant"] is False
    assert res["corrected_error"] == 2.8

def test_rule_27_statutory_cycles():
    """
    Rule 27(2) Statutory Validity Cycles:
    - Rule 27(2)(a): 24 Months for Weights & Measures (expires at quarter end)
    - Rule 27(2)(b): 60 Months for Storage Tanks
    - Rule 27(2)(c): 12 Months for Weighbridges, Fuel Dispensers, Platform Machines
    """
    stamping = datetime(2026, 1, 15, 10, 0, tzinfo=timezone.utc)

    # 1. 24 Months (Quarter aligned)
    expiry_24m = Rule27StateMachine.calculate_statutory_expiry(
        stamping, InstrumentCategory.WEIGHTS_MEASURES_24M, align_to_quarter_end=True
    )
    # January 2026 + 24 months = January 2028 -> Q1 end is March 31, 2028
    assert expiry_24m.year == 2028
    assert expiry_24m.month == 3
    assert expiry_24m.day == 31

    # 2. 60 Months (Storage Tanks)
    expiry_60m = Rule27StateMachine.calculate_statutory_expiry(
        stamping, InstrumentCategory.STORAGE_TANK
    )
    assert expiry_60m.year == 2031
    assert expiry_60m.month == 1

    # 3. 12 Months (Weighbridge / Dispensers)
    expiry_12m = Rule27StateMachine.calculate_statutory_expiry(
        stamping, InstrumentCategory.WEIGHBRIDGE
    )
    assert expiry_12m.year == 2027
    assert expiry_12m.month == 1

def test_rule_27_immediate_invalidation_relocation_and_repair():
    """
    Rule 27(3) and 27(4) Immediate Invalidation Triggers:
    - Rule 27(3): Dismantled and re-installed / relocated in-situ -> Immediate Revocation
    - Rule 27(4): Repaired or mechanically/electronically adjusted -> Immediate Revocation
    """
    now = datetime.now(timezone.utc)
    future_expiry = now + timedelta(days=200)

    # Rule 27(3) Relocation / Dismantling
    status_reloc = Rule27StateMachine.evaluate_status(
        stamping_date=now - timedelta(days=30),
        expiry_date=future_expiry,
        category=InstrumentCategory.WEIGHBRIDGE,
        is_relocated=True,
    )
    assert status_reloc["is_valid"] is False
    assert status_reloc["status"] == CertificateStatus.INVALIDATED_RELOCATION.value
    assert "Rule 27(3)" in status_reloc["statutory_rule"]

    # Rule 27(4) Repair / Adjustment
    status_repair = Rule27StateMachine.evaluate_status(
        stamping_date=now - timedelta(days=30),
        expiry_date=future_expiry,
        category=InstrumentCategory.FUEL_DISPENSER,
        is_repaired=True,
    )
    assert status_repair["is_valid"] is False
    assert status_repair["status"] == CertificateStatus.INVALIDATED_REPAIR.value
    assert "Rule 27(4)" in status_repair["statutory_rule"]

def test_twelfth_schedule_fee_and_surcharge_logic():
    """
    Twelfth Schedule & Section 4.2 Enforcement Surcharges:
    - Base fee for Weighbridge up to 50t = ₹4,000.00
    - Non-movable exempt from 50% in-situ surcharge and T&H charge
    - Movable scale at user premises requested by user: 50% surcharge + min ₹100 T&H
    - Late penalty: 50% per quarter of delay
    """
    # 1. Non-movable Weighbridge (Exempt from 50% in-situ surcharge)
    res_wb = TwelfthScheduleFeeEngine.calculate_base_fee(
        category=FeeCategory.NAWI_MECHANICAL_CLASS_III_IV,
        capacity_or_param=40000.0,  # 40 tons
        unit="kg",
    )
    assert res_wb["unit_fee"] == 4000.0

    billing_wb = TwelfthScheduleFeeEngine.calculate_total_billing(
        base_fee=res_wb["total_base_fee"],
        instrument_designation="Electronic Weighbridge 40t",
        is_user_requested_onsite=True,  # Even if on-site, it is exempt because it is non-movable!
    )
    assert billing_wb["is_non_movable_exempt"] is True
    assert billing_wb["in_situ_surcharge"] == 0.0
    assert billing_wb["travel_handling_cost"] == 0.0
    assert billing_wb["total_statutory_billing"] == 4000.0

    # 2. Movable Counter Machine (50% user-requested surcharge applies)
    res_cm = TwelfthScheduleFeeEngine.calculate_base_fee(
        category=FeeCategory.COUNTER_MACHINES,
        capacity_or_param=10.0,
        unit="kg",
    )
    assert res_cm["unit_fee"] == 30.0

    billing_cm = TwelfthScheduleFeeEngine.calculate_total_billing(
        base_fee=res_cm["total_base_fee"],
        instrument_designation="Counter Machine 10kg",
        is_user_requested_onsite=True,
        delay_quarters=2,  # 2 quarters delay = 2 * 0.5 * 30 = ₹30 penalty
    )
    assert billing_cm["is_non_movable_exempt"] is False
    assert billing_cm["in_situ_surcharge"] == 15.0  # 50% of ₹30
    assert billing_cm["travel_handling_cost"] == 100.0  # Min ₹100 T&H
    assert billing_cm["late_penalty"] == 30.0  # 2 quarters * 50% * ₹30 = ₹30
    assert billing_cm["total_statutory_billing"] == 30.0 + 15.0 + 100.0 + 30.0  # ₹175.00
