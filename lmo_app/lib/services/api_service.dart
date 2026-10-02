import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/inspection.dart';

class ApiService {
  // Configured default base URL pointing directly to FastAPI server root
  static const String defaultBaseUrl = 'http://localhost:8000';
  final String baseUrl;

  ApiService({this.baseUrl = defaultBaseUrl});

  Future<Map<String, dynamic>> uploadInspection(InspectionModel inspection) async {
    // If baseUrl contains /api/v1, use that; otherwise root /inspections/upload
    final endpoint = baseUrl.endsWith('/api/v1') ? '$baseUrl/inspections/upload' : '$baseUrl/inspections/upload';
    final uri = Uri.parse(endpoint);
    final request = http.MultipartRequest('POST', uri);

    // Form fields
    request.fields['instrument_id'] = inspection.instrumentId.toString();
    request.fields['lmo_id'] = inspection.lmoId;
    request.fields['inspection_type'] = 'IN_SERVICE';
    request.fields['chassis_serial_observed'] = inspection.chassisSerialObserved;
    request.fields['hologram_id_affixed'] = inspection.hologramIdAffixed;
    request.fields['eeprom_counter_sync'] = inspection.eepromCounterSync;
    
    if (inspection.latitude != null) {
      request.fields['latitude'] = inspection.latitude.toString();
    }
    if (inspection.longitude != null) {
      request.fields['longitude'] = inspection.longitude.toString();
    }
    if (inspection.geotagTimestamp != null) {
      request.fields['geotag_timestamp'] = inspection.geotagTimestamp!.toIso8601String();
    }
    request.fields['wire_seal_intact'] = inspection.wireSealIntact.toString();

    if (inspection.remarks != null) {
      request.fields['remarks'] = inspection.remarks!;
    }
    if (inspection.legacyCertificateNo != null) {
      request.fields['legacy_certificate_no'] = inspection.legacyCertificateNo!;
    }
    if (inspection.turningPointResults.isNotEmpty) {
      request.fields['turning_point_results'] = jsonEncode(inspection.turningPointResults);
    }

    // Attach chassis photo
    if (!kIsWeb && inspection.chassisPhotoPath != null) {
      final file = File(inspection.chassisPhotoPath!);
      if (await file.exists()) {
        request.files.add(
          await http.MultipartFile.fromPath('chassis_photo', file.path),
        );
      }
    }

    // Attach physical wire seal photo
    if (!kIsWeb && inspection.wireSealPhotoPath != null) {
      final file = File(inspection.wireSealPhotoPath!);
      if (await file.exists()) {
        request.files.add(
          await http.MultipartFile.fromPath('wire_seal_photo', file.path),
        );
      }
    }

    // Attach holographic sticker photo
    if (!kIsWeb && inspection.hologramPhotoPath != null) {
      final file = File(inspection.hologramPhotoPath!);
      if (await file.exists()) {
        request.files.add(
          await http.MultipartFile.fromPath('hologram_photo', file.path),
        );
      }
    }

    // Attach legacy certificate photo
    if (!kIsWeb && inspection.legacyCertPhotoPath != null) {
      final file = File(inspection.legacyCertPhotoPath!);
      if (await file.exists()) {
        request.files.add(
          await http.MultipartFile.fromPath('legacy_cert_photo', file.path),
        );
      }
    }

    try {
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Server rejected inspection: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Network or upload failure: $e');
    }
  }

  Future<Map<String, dynamic>> calculateMPE({
    required String accuracyClass,
    required double loadMass,
    required double scaleIntervalE,
    String inspectionType = 'IN_SERVICE',
  }) async {
    final uri = Uri.parse('$baseUrl/mpe/calculate');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'accuracy_class': accuracyClass,
        'load_mass': loadMass,
        'scale_interval_e': scaleIntervalE,
        'inspection_type': inspectionType,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to calculate MPE: ${response.body}');
    }
  }
}
