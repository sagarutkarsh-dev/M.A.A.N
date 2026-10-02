/// On-Device Seventh Schedule Table 20 MPE Tolerance Calculator
/// Legal Metrology Act, 2009 & General Rules, 2011 (Seventh Schedule, Table 20)
/// Clause 3(6)(ii) In-Service (Field) 2x Multiplier & Continuous Rounding via Turning Points

class MpeResult {
  final String accuracyClass;
  final double loadMass;
  final double indicatedMass;
  final double deltaL;
  final double scaleIntervalE;
  final double pTrueIndication;
  final double rawError;
  final double correctedError;
  final double effectiveMpeMass;
  final double effectiveMpeE;
  final double loadInE;
  final bool isPass;
  final double toleranceUtilizationPct;
  final String formulaApplied;

  MpeResult({
    required this.accuracyClass,
    required this.loadMass,
    required this.indicatedMass,
    required this.deltaL,
    required this.scaleIntervalE,
    required this.pTrueIndication,
    required this.rawError,
    required this.correctedError,
    required this.effectiveMpeMass,
    required this.effectiveMpeE,
    required this.loadInE,
    required this.isPass,
    required this.toleranceUtilizationPct,
    this.formulaApplied = "P = I + 0.5e - ΔL; E = P - L",
  });

  Map<String, dynamic> toJson() {
    return {
      'accuracy_class': accuracyClass,
      'load_mass': loadMass,
      'indicated_mass': indicatedMass,
      'delta_l': deltaL,
      'scale_interval_e': scaleIntervalE,
      'p_true_indication': pTrueIndication,
      'raw_error': rawError,
      'corrected_error': correctedError,
      'effective_mpe_mass': effectiveMpeMass,
      'effective_mpe_e': effectiveMpeE,
      'load_in_e': loadInE,
      'is_pass': isPass,
      'status': isPass ? 'PASS' : 'FAIL',
      'tolerance_utilization_pct': toleranceUtilizationPct,
      'formula_applied': formulaApplied,
    };
  }
}

class MpeCalculatorEngine {
  /// Evaluates continuous rounding via turning point formula:
  /// P = I + 0.5e - ΔL
  /// E = P - L
  /// E_c = E - E_0
  /// Pass if |E_c| <= MPE_effective
  static MpeResult evaluate({
    required String accuracyClass,
    required double loadMass,
    required double indicatedMass,
    required double deltaL,
    required double scaleIntervalE,
    double zeroError = 0.0,
    bool isInService = true, // Statutory 2x multiplier for field inspections
  }) {
    if (scaleIntervalE <= 0) {
      throw ArgumentError("Verification interval 'e' must be strictly positive");
    }

    final loadInE = loadMass / scaleIntervalE;
    final baseMpeE = _getBaseMpeInE(accuracyClass, loadInE);
    final multiplier = isInService ? 2.0 : 1.0;
    final effectiveMpeE = baseMpeE * multiplier;
    final effectiveMpeMass = effectiveMpeE * scaleIntervalE;

    // Continuous rounding via turning points (error before rounding)
    final pIndicated = indicatedMass + (0.5 * scaleIntervalE) - deltaL;
    final rawError = pIndicated - loadMass;
    final correctedError = rawError - zeroError;

    final isPass = correctedError.abs() <= (effectiveMpeMass + 1e-9);
    final utilization = effectiveMpeMass > 0
        ? (correctedError.abs() / effectiveMpeMass) * 100.0
        : 0.0;

    return MpeResult(
      accuracyClass: accuracyClass.toUpperCase(),
      loadMass: loadMass,
      indicatedMass: indicatedMass,
      deltaL: deltaL,
      scaleIntervalE: scaleIntervalE,
      pTrueIndication: double.parse(pIndicated.toStringAsFixed(6)),
      rawError: double.parse(rawError.toStringAsFixed(6)),
      correctedError: double.parse(correctedError.toStringAsFixed(6)),
      effectiveMpeMass: double.parse(effectiveMpeMass.toStringAsFixed(6)),
      effectiveMpeE: effectiveMpeE,
      loadInE: double.parse(loadInE.toStringAsFixed(4)),
      isPass: isPass,
      toleranceUtilizationPct: double.parse(utilization.toStringAsFixed(2)),
    );
  }

  static double _getBaseMpeInE(String accuracyClass, double loadInE) {
    final cls = accuracyClass.toUpperCase().trim();
    final m = loadInE.abs();

    if (cls == "I" || cls == "CLASS I") {
      if (m <= 50000.0) return 0.5;
      if (m <= 200000.0) return 1.0;
      return 1.5;
    } else if (cls == "II" || cls == "CLASS II") {
      if (m <= 5000.0) return 0.5;
      if (m <= 20000.0) return 1.0;
      return 1.5;
    } else if (cls == "III" || cls == "CLASS III") {
      if (m <= 500.0) return 0.5;
      if (m <= 2000.0) return 1.0;
      return 1.5;
    } else {
      // Class IV / IIII
      if (m <= 50.0) return 0.5;
      if (m <= 200.0) return 1.0;
      return 1.5;
    }
  }
}
