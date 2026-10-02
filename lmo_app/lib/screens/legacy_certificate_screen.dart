import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/inspection.dart';
import '../services/api_service.dart';
import '../services/offline_manifest_service.dart';

class LegacyCertificateScreen extends StatefulWidget {
  const LegacyCertificateScreen({super.key});

  @override
  State<LegacyCertificateScreen> createState() => _LegacyCertificateScreenState();
}

class _LegacyCertificateScreenState extends State<LegacyCertificateScreen> {
  final _picker = ImagePicker();
  XFile? _certImage;

  final _certNoController = TextEditingController(text: "LEGACY-KL-2023-90812");
  final _traderNameController = TextEditingController(text: "Mahalaxmi Provisions & Spices");
  final _serialNoController = TextEditingController(text: "SN-8839201-X");
  final _hologramController = TextEditingController(text: "HOLO-992-KRL");

  bool _isUploading = false;

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picked = await _picker.pickImage(source: source, imageQuality: 85);
      if (picked != null) {
        setState(() {
          _certImage = picked;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  Future<void> _submitMigration() async {
    setState(() => _isUploading = true);

    final inspection = InspectionModel(
      instrumentId: 1,
      lmoId: "LMO-KL-442",
      chassisSerialObserved: _serialNoController.text.trim(),
      hologramIdAffixed: _hologramController.text.trim(),
      legacyCertPhotoPath: _certImage?.path,
      legacyCertificateNo: _certNoController.text.trim(),
      remarks: "Day-Forward migration from paper certificate #${_certNoController.text}",
      isPassed: true,
    );

    try {
      final api = ApiService();
      await api.uploadInspection(inspection);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFF10B981),
            content: Text('Legacy paper certificate successfully migrated to digital M.A.A.N. ledger!'),
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      final storage = OfflineManifestService();
      await storage.saveInspectionOffline(inspection);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFFF59E0B),
            content: Text('Saved offline for later sync.'),
          ),
        );
        Navigator.pop(context);
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: const Text(
          'Legacy Paper Migration',
          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Explanatory Banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.history_edu, color: Color(0xFFA855F7), size: 20),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Zero-Downtime Day-Forward Migration: Digitize active legacy paper certificates during routine field renewal cycles.',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Paper Certificate Photo
            GestureDetector(
              onTap: () => _pickImage(ImageSource.camera),
              child: Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _certImage != null ? const Color(0xFF10B981) : const Color(0xFF475569),
                    width: 1.5,
                  ),
                ),
                child: _certImage != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(15),
                        child: Image.file(File(_certImage!.path), fit: BoxFit.cover),
                      )
                    : Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.document_scanner, size: 40, color: const Color(0xFFA855F7)),
                          const SizedBox(height: 8),
                          const Text(
                            'Photograph Physical Stamping Certificate',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          const SizedBox(height: 4),
                          const Text('Camera or Gallery Scan', style: TextStyle(color: Color(0xFF64748B), fontSize: 11)),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () => _pickImage(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library, size: 16, color: Color(0xFF94A3B8)),
                  label: const Text('Pick from Gallery', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Form Fields
            _buildInputField('Legacy Certificate Number', _certNoController, Icons.tag),
            const SizedBox(height: 12),
            _buildInputField('Registered Trader / Establishment', _traderNameController, Icons.storefront),
            const SizedBox(height: 12),
            _buildInputField('Machine Serial Number', _serialNoController, Icons.precision_manufacturing),
            const SizedBox(height: 12),
            _buildInputField('New Tamper Foil Hologram ID to Affix', _hologramController, Icons.qr_code_scanner),
            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: _isUploading ? null : _submitMigration,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFA855F7),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: _isUploading
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.upgrade),
                label: Text(
                  _isUploading ? 'Migrating...' : 'Migrate to Digital M.A.A.N. Ledger',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputField(String label, TextEditingController controller, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          style: const TextStyle(color: Colors.white, fontSize: 13),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: const Color(0xFF64748B), size: 18),
            filled: true,
            fillColor: const Color(0xFF1E293B),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFF334155)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFF334155)),
            ),
          ),
        ),
      ],
    );
  }
}
