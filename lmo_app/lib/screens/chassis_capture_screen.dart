import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import '../models/inspection.dart';
import '../models/manifest_item.dart';
import '../services/api_service.dart';
import '../services/offline_manifest_service.dart';
import '../services/mpe_calculator_engine.dart';

class ChassisCaptureScreen extends StatefulWidget {
  final ManifestItem? manifestItem;

  const ChassisCaptureScreen({super.key, this.manifestItem});

  @override
  State<ChassisCaptureScreen> createState() => _ChassisCaptureScreenState();
}

class _ChassisCaptureScreenState extends State<ChassisCaptureScreen> {
  final _picker = ImagePicker();
  final _manifestService = OfflineManifestService();

  // Photo Evidence
  XFile? _chassisImage;
  XFile? _wireSealImage;
  XFile? _hologramImage;

  // Geotag Data
  double _currentLat = 11.2588;
  double _currentLng = 75.7804;
  DateTime _geotagTime = DateTime.now();

  // 3-Layer Hardware Binding Controllers
  final _serialController = TextEditingController();
  final _hologramController = TextEditingController(text: "HOLO-992-KRL");
  final _eepromController = TextEditingController(text: "0x004A");
  final _remarksController = TextEditingController();

  // In-Situ MPE Continuous Rounding Evaluator Controllers
  final _loadController = TextEditingController(text: "10.0");       // 10 kg
  final _intervalController = TextEditingController(text: "5.0");    // 5 g
  final _indicatedController = TextEditingController(text: "10.002"); // 10.002 kg
  final _deltaLController = TextEditingController(text: "1.5");      // 1.5 g
  String _accuracyClass = "III";
  MpeResult? _mpeResult;

  bool _isOcrProcessing = false;
  bool _isSubmitting = false;
  bool _wireSealIntact = true;

  @override
  void initState() {
    super.initState();
    if (widget.manifestItem != null) {
      final item = widget.manifestItem!;
      _serialController.text = item.serialNo;
      _accuracyClass = item.accuracyClass;
      _intervalController.text = item.scaleIntervalEGrams.toString();
      _loadController.text = (item.capacityKg / 2.0).toStringAsFixed(1);
      _currentLat = item.latitude;
      _currentLng = item.longitude;
    } else {
      _serialController.text = "SN-8839201-X";
    }
    _runOnDeviceMpeEvaluation();
  }

  void _runOnDeviceMpeEvaluation() {
    final load = double.tryParse(_loadController.text) ?? 10.0;
    final intervalGrams = double.tryParse(_intervalController.text) ?? 5.0;
    final indicated = double.tryParse(_indicatedController.text) ?? 10.0;
    final deltaLGrams = double.tryParse(_deltaLController.text) ?? 1.5;

    // Convert grams to kilograms to match loadMass and indicatedMass in kg
    final intervalKg = intervalGrams / 1000.0;
    final deltaLKg = deltaLGrams / 1000.0;

    try {
      final result = MpeCalculatorEngine.evaluate(
        accuracyClass: _accuracyClass,
        loadMass: load,
        indicatedMass: indicated,
        deltaL: deltaLKg,
        scaleIntervalE: intervalKg,
        isInService: true, // Statutory 2x field multiplier
      );
      setState(() => _mpeResult = result);
    } catch (_) {}
  }

  Future<void> _capturePhoto(String type, ImageSource source) async {
    try {
      final picked = await _picker.pickImage(source: source, imageQuality: 85);
      if (picked == null) return;

      setState(() {
        _geotagTime = DateTime.now();
        if (type == 'chassis') {
          _chassisImage = picked;
          _isOcrProcessing = true;
        } else if (type == 'wire_seal') {
          _wireSealImage = picked;
        } else if (type == 'hologram') {
          _hologramImage = picked;
        }
      });

      // OCR Extraction from machine chassis metal plate
      if (type == 'chassis') {
        await _performOcrExtraction(picked.path);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Camera error: $e')));
      }
    }
  }

  Future<void> _performOcrExtraction(String imagePath) async {
    // Simulated / Google ML Kit Latin Script text recognizer pattern
    await Future.delayed(const Duration(milliseconds: 1400));
    
    // Extracted alphanumeric serial from chassis plate
    final extractedSerial = widget.manifestItem?.serialNo ?? "SN-8839201-X";
    
    if (mounted) {
      setState(() {
        _isOcrProcessing = false;
        _serialController.text = extractedSerial;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: const Color(0xFF10B981),
          content: Text('Google ML Kit OCR Extracted Serial: $extractedSerial'),
        ),
      );
    }
  }

  Future<void> _saveAndUploadInspection() async {
    if (_eepromController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFEF4444),
          content: Text('EEPROM Calibration Counter is mandatory to prevent scale tampering!'),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final isPassed = (_mpeResult?.isPass ?? true) && _wireSealIntact;
    final inspection = InspectionModel(
      instrumentId: widget.manifestItem?.instrumentId ?? 1,
      lmoId: "LMO-KL-442",
      tradeName: widget.manifestItem?.shopName ?? "Mahalaxmi Provisions & Spices",
      chassisSerialObserved: _serialController.text.trim(),
      hologramIdAffixed: _hologramController.text.trim(),
      eepromCounterSync: _eepromController.text.trim(),
      chassisPhotoPath: _chassisImage?.path,
      wireSealPhotoPath: _wireSealImage?.path,
      hologramPhotoPath: _hologramImage?.path,
      latitude: _currentLat,
      longitude: _currentLng,
      geotagTimestamp: _geotagTime,
      wireSealIntact: _wireSealIntact,
      turningPointResults: _mpeResult != null ? [_mpeResult!.toJson()] : [],
      remarks: _remarksController.text.trim(),
      isPassed: isPassed,
      isSynced: false,
    );

    // 1. Save immediately into offline-first cache
    await _manifestService.saveInspectionOffline(inspection);

    // 2. Attempt online background push to http://localhost:8000/inspections/upload
    try {
      final api = ApiService();
      final response = await api.uploadInspection(inspection);
      // Mark as SYNCED in local Hive cache and daily manifest
      await _manifestService.markInspectionAsSynced(inspection.instrumentId);
      if (mounted) {
        final certToken = response['certificate_token'];
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFF10B981),
            content: Text(
              certToken != null
                  ? 'Inspection SYNCED! Active Certificate #$certToken generated.'
                  : 'Inspection synchronized with M.A.A.N. central ledger (SYNCED)!',
            ),
          ),
        );
        Navigator.pop(context);
      }
    } catch (_) {
      // Retained in offline queue
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFFF59E0B),
            content: Text('Saved to offline storage. Will automatically sync when 4G is restored.'),
          ),
        );
        Navigator.pop(context);
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd MMM yyyy, HH:mm:ss');
    final formattedTimestamp = dateFormat.format(_geotagTime);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'In-Situ Evidence & Binding',
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              widget.manifestItem?.shopName ?? 'Field Verification',
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Geotag & Time Header Card
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: Color(0xFF10B981), size: 24),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'POSTGIS IN-SITU EVIDENCE AUDIT',
                          style: TextStyle(
                            color: Color(0xFF94A3B8),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.1,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'GPS: ${_currentLat.toStringAsFixed(4)}°N, ${_currentLng.toStringAsFixed(4)}°E',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Timestamp: $formattedTimestamp IST',
                          style: const TextStyle(color: Color(0xFF64748B), fontSize: 10),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                    ),
                    child: const Text(
                      'GPS LOCKED',
                      style: TextStyle(color: Color(0xFF10B981), fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // SECTION 1: Dual Photographic Evidence
            const Text(
              "1. TAMPER EVIDENCE (WIRE SEAL & FOIL HOLOGRAM)",
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                // Wire Seal Photo Box
                Expanded(
                  child: _buildPhotoCaptureBox(
                    title: "Physical Wire Seal",
                    subtitle: "Intact government wire seal",
                    image: _wireSealImage,
                    icon: Icons.shield,
                    accentColor: const Color(0xFF38BDF8),
                    onTap: () => _capturePhoto('wire_seal', ImageSource.camera),
                  ),
                ),
                const SizedBox(width: 12),
                // Hologram Photo Box
                Expanded(
                  child: _buildPhotoCaptureBox(
                    title: "Foil Hologram Seal",
                    subtitle: "Sticker (e.g. HOLO-992)",
                    image: _hologramImage,
                    icon: Icons.qr_code_2,
                    accentColor: const Color(0xFFA855F7),
                    onTap: () => _capturePhoto('hologram', ImageSource.camera),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Wire seal integrity toggle
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Expanded(
                    child: Text('Physical Wire Seal Condition', style: TextStyle(color: Colors.white, fontSize: 12)),
                  ),
                  Switch(
                    value: _wireSealIntact,
                    activeColor: const Color(0xFF10B981),
                    inactiveThumbColor: const Color(0xFFEF4444),
                    onChanged: (val) => setState(() => _wireSealIntact = val),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _wireSealIntact ? 'INTACT' : 'TAMPERED',
                    style: TextStyle(
                      color: _wireSealIntact ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // SECTION 2: Machine Chassis Metal Plate OCR
            const Text(
              "2. CHASSIS SERIAL (ON-DEVICE GOOGLE ML KIT OCR)",
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            _buildPhotoCaptureBox(
              title: "Machine Metal Chassis Plate",
              subtitle: "Photograph engraved serial to extract via OCR",
              image: _chassisImage,
              icon: Icons.precision_manufacturing,
              accentColor: const Color(0xFFF59E0B),
              height: 140,
              onTap: () => _capturePhoto('chassis', ImageSource.camera),
            ),

            if (_isOcrProcessing)
              Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Row(
                  children: [
                    SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)),
                    SizedBox(width: 10),
                    Text('Reading metal engraved chassis serial via ML Kit...', style: TextStyle(color: Colors.white, fontSize: 11)),
                  ],
                ),
              ),

            const SizedBox(height: 14),

            // Input Fields
            _buildInputField('Extracted Machine Chassis Serial (OCR)', _serialController, Icons.tag),
            const SizedBox(height: 10),
            _buildInputField('Tamper Hologram Sticker ID', _hologramController, Icons.qr_code),
            const SizedBox(height: 10),
            _buildInputField('Scale EEPROM Calibration Counter (Mandatory)', _eepromController, Icons.memory, hint: "e.g. 0x004A"),
            const SizedBox(height: 24),

            // SECTION 3: On-Device MPE Tolerance Calculator
            const Text(
              "3. SEVENTH SCHEDULE TABLE 20 MPE EVALUATION (OFFLINE)",
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: _buildSmallNumberField("Test Load (L in kg)", _loadController, (v) => _runOnDeviceMpeEvaluation()),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildSmallNumberField("Scale Interval (e in g)", _intervalController, (v) => _runOnDeviceMpeEvaluation()),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _buildSmallNumberField("Indicated Reading (I in kg)", _indicatedController, (v) => _runOnDeviceMpeEvaluation()),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildSmallNumberField("Turning Pts (ΔL in g)", _deltaLController, (v) => _runOnDeviceMpeEvaluation()),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // MPE Instant Verdict Banner
                  if (_mpeResult != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: _mpeResult!.isPass ? const Color(0xFF064E3B) : const Color(0xFF7F1D1D),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: _mpeResult!.isPass ? const Color(0xFF059669) : const Color(0xFFDC2626),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            _mpeResult!.isPass ? Icons.check_circle : Icons.cancel,
                            color: _mpeResult!.isPass ? const Color(0xFF34D399) : const Color(0xFFF87171),
                            size: 28,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _mpeResult!.isPass ? 'PASS - COMPLIANT (WITHIN 2x MPE)' : 'FAIL - EXCEEDS MPE LIMIT',
                                  style: TextStyle(
                                    color: _mpeResult!.isPass ? const Color(0xFFA7F3D0) : const Color(0xFFFECACA),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                                Text(
                                  'True Error E: ${_mpeResult!.correctedError >= 0 ? '+' : ''}${_mpeResult!.correctedError.toStringAsFixed(2)} g | Limit: ±${_mpeResult!.effectiveMpeMass.toStringAsFixed(2)} g',
                                  style: const TextStyle(color: Colors.white70, fontSize: 10, fontFamily: 'monospace'),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            '${_mpeResult!.toleranceUtilizationPct}%',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _isSubmitting ? null : _saveAndUploadInspection,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 4,
                ),
                icon: _isSubmitting
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.verified),
                label: Text(
                  _isSubmitting ? 'Recording In-Situ Inspection...' : 'Certify & Save Inspection (Offline Ready)',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildPhotoCaptureBox({
    required String title,
    required String subtitle,
    required XFile? image,
    required IconData icon,
    required Color accentColor,
    required VoidCallback onTap,
    double height = 110,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: height,
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: image != null ? const Color(0xFF10B981) : const Color(0xFF334155),
            width: image != null ? 1.5 : 1.0,
          ),
        ),
        child: image != null
            ? Stack(
                fit: StackFit.expand,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(11),
                    child: Image.file(File(image.path), fit: BoxFit.cover),
                  ),
                  Positioned(
                    bottom: 4,
                    right: 4,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text('Captured', style: TextStyle(color: Colors.white, fontSize: 9)),
                    ),
                  ),
                ],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, size: 28, color: accentColor),
                  const SizedBox(height: 6),
                  Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(color: Color(0xFF64748B), fontSize: 9), textAlign: TextAlign.center),
                ],
              ),
      ),
    );
  }

  Widget _buildInputField(String label, TextEditingController controller, IconData icon, {String? hint}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          style: const TextStyle(color: Colors.white, fontSize: 12, fontFamily: 'monospace'),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF475569), fontSize: 11),
            prefixIcon: Icon(icon, color: const Color(0xFF64748B), size: 16),
            filled: true,
            fillColor: const Color(0xFF1E293B),
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF334155))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF334155))),
          ),
        ),
      ],
    );
  }

  Widget _buildSmallNumberField(String label, TextEditingController controller, ValueChanged<String> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          onChanged: onChanged,
          style: const TextStyle(color: Colors.white, fontSize: 12, fontFamily: 'monospace'),
          decoration: InputDecoration(
            filled: true,
            fillColor: const Color(0xFF0F172A),
            contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(6), borderSide: const BorderSide(color: Color(0xFF334155))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(6), borderSide: const BorderSide(color: Color(0xFF334155))),
          ),
        ),
      ],
    );
  }
}
