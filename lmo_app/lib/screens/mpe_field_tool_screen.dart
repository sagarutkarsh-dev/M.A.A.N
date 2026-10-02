import 'package:flutter/material.dart';
import '../services/mpe_calculator_engine.dart';

class MPEFieldToolScreen extends StatefulWidget {
  const MPEFieldToolScreen({super.key});

  @override
  State<MPEFieldToolScreen> createState() => _MPEFieldToolScreenState();
}

class _MPEFieldToolScreenState extends State<MPEFieldToolScreen> {
  String _accuracyClass = 'III';
  bool _isInService = true; // Statutory 2x multiplier for in-service field inspections

  final _loadController = TextEditingController(text: '10.0');        // 10 kg
  final _intervalController = TextEditingController(text: '5.0');     // 5 grams
  final _indicatedController = TextEditingController(text: '10.002'); // 10.002 kg
  final _deltaLController = TextEditingController(text: '1.5');       // 1.5 grams
  final _zeroErrorController = TextEditingController(text: '0.0');    // 0.0 grams

  MpeResult? _result;

  @override
  void initState() {
    super.initState();
    _recalculate();
  }

  void _recalculate() {
    final loadKg = double.tryParse(_loadController.text) ?? 0.0;
    final intervalG = double.tryParse(_intervalController.text) ?? 1.0;
    final indicatedKg = double.tryParse(_indicatedController.text) ?? 0.0;
    final deltaLG = double.tryParse(_deltaLController.text) ?? 0.0;
    final zeroErrorG = double.tryParse(_zeroErrorController.text) ?? 0.0;

    if (intervalG <= 0) return;

    try {
      final res = MpeCalculatorEngine.evaluate(
        accuracyClass: _accuracyClass,
        loadMass: loadKg,
        indicatedMass: indicatedKg,
        deltaL: deltaLG,
        scaleIntervalE: intervalG,
        zeroError: zeroErrorG,
        isInService: _isInService,
      );
      setState(() => _result = res);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Seventh Schedule MPE Calculator',
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'Table 20 Continuous Rounding via Turning Points',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Statutory Decision Card
            if (_result != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: _result!.isPass ? const Color(0xFF064E3B) : const Color(0xFF7F1D1D),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _result!.isPass ? const Color(0xFF059669) : const Color(0xFFDC2626),
                    width: 1.5,
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _result!.isPass ? Icons.check_circle : Icons.cancel,
                          color: _result!.isPass ? const Color(0xFF34D399) : const Color(0xFFF87171),
                          size: 36,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          _result!.isPass ? 'COMPLIANT (PASS)' : 'EXCEEDS MPE (FAIL)',
                          style: TextStyle(
                            color: _result!.isPass ? const Color(0xFFA7F3D0) : const Color(0xFFFECACA),
                            fontWeight: FontWeight.w900,
                            fontSize: 18,
                            letterSpacing: 1.1,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Column(
                          children: [
                            const Text('Corrected Error (E_c)', style: TextStyle(color: Colors.white70, fontSize: 10)),
                            const SizedBox(height: 2),
                            Text(
                              '${_result!.correctedError >= 0 ? '+' : ''}${_result!.correctedError.toStringAsFixed(2)} g',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15, fontFamily: 'monospace'),
                            ),
                          ],
                        ),
                        Container(height: 28, width: 1, color: Colors.white24),
                        Column(
                          children: [
                            Text(
                              _isInService ? 'Statutory Limit (2x MPE)' : 'Initial Limit (1x MPE)',
                              style: const TextStyle(color: Colors.white70, fontSize: 10),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '±${_result!.effectiveMpeMass.toStringAsFixed(2)} g',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15, fontFamily: 'monospace'),
                            ),
                          ],
                        ),
                        Container(height: 28, width: 1, color: Colors.white24),
                        Column(
                          children: [
                            const Text('Tolerance Used', style: TextStyle(color: Colors.white70, fontSize: 10)),
                            const SizedBox(height: 2),
                            Text(
                              '${_result!.toleranceUtilizationPct}%',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 18),

            // Mode Selector: In-Service vs Initial Verification
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Inspection Stage', style: TextStyle(color: Colors.white, fontSize: 12)),
                  Row(
                    children: [
                      _buildStageChip('In-Service (2x)', _isInService, () {
                        setState(() => _isInService = true);
                        _recalculate();
                      }),
                      const SizedBox(width: 6),
                      _buildStageChip('Initial (1x)', !_isInService, () {
                        setState(() => _isInService = false);
                        _recalculate();
                      }),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Accuracy Class Selection
            const Text(
              "METROLOGICAL PARAMETERS",
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _accuracyClass,
                  dropdownColor: const Color(0xFF1E293B),
                  isExpanded: true,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  items: const [
                    DropdownMenuItem(value: 'III', child: Text('Class III (Medium Accuracy - Commercial Retail / Weighbridge)')),
                    DropdownMenuItem(value: 'II', child: Text('Class II (High Accuracy - Precision / Lab / Jewellery)')),
                    DropdownMenuItem(value: 'I', child: Text('Class I (Special Accuracy - Analytical Micro-Balances)')),
                    DropdownMenuItem(value: 'IIII', child: Text('Class IIII (Ordinary Accuracy - Bulk / Crane Scales)')),
                  ],
                  onChanged: (val) {
                    if (val != null) {
                      setState(() => _accuracyClass = val);
                      _recalculate();
                    }
                  },
                ),
              ),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(child: _buildParamField('Standard Test Load (L in kg)', _loadController)),
                const SizedBox(width: 10),
                Expanded(child: _buildParamField('Verification Interval (e in g)', _intervalController)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildParamField('Observed Scale Indication (I in kg)', _indicatedController)),
                const SizedBox(width: 10),
                Expanded(child: _buildParamField('Turning Point Added (ΔL in g)', _deltaLController)),
              ],
            ),
            const SizedBox(height: 12),
            _buildParamField('Zero-Load Error (E_0 in g, optional)', _zeroErrorController),
            const SizedBox(height: 20),

            // Formula & Continuous Rounding Step-by-Step Breakdown
            if (_result != null)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Continuous Rounding Calculation Log (Seventh Schedule Table 20):',
                      style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 11),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '1. Load in intervals of e: m = L / e = ${_result!.loadInE} e\n'
                      '2. True Indication: P = I + 0.5e - ΔL = ${_result!.pTrueIndication} g\n'
                      '3. Error before rounding: E = P - L = ${_result!.rawError} g\n'
                      '4. Corrected Error: E_c = E - E_0 = ${_result!.correctedError} g\n'
                      '5. Statutory MPE Tier: ±${_result!.effectiveMpeE} e = ±${_result!.effectiveMpeMass} g\n'
                      '6. Verdict: |${_result!.correctedError}| ${_result!.isPass ? '<=' : '>'} ${_result!.effectiveMpeMass} g -> ${_result!.isPass ? "PASS" : "FAIL"}',
                      style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 11, fontFamily: 'monospace', height: 1.5),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStageChip(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF10B981) : const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF94A3B8),
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildParamField(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          onChanged: (_) => _recalculate(),
          style: const TextStyle(color: Colors.white, fontSize: 12, fontFamily: 'monospace'),
          decoration: InputDecoration(
            filled: true,
            fillColor: const Color(0xFF1E293B),
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFF334155)),
            ),
          ),
        ),
      ],
    );
  }
}
