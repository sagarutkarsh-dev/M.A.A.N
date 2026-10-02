import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lmo_app/models/inspection.dart';
import 'package:lmo_app/services/offline_manifest_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late Directory tempDir;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    tempDir = await Directory.systemTemp.createTemp('hive_test_');
    Hive.init(tempDir.path);
  });

  tearDown(() async {
    await Hive.close();
    if (await tempDir.exists()) {
      await tempDir.delete(recursive: true);
    }
  });

  test('Inspection is cached in Hive and marked SYNCED upon HTTP 200 response', () async {
    final manifestService = OfflineManifestService();

    // 1. Initial daily manifest loaded
    final manifest = await manifestService.loadDailyManifest();
    expect(manifest.isNotEmpty, true);
    final targetItem = manifest.first;
    expect(targetItem.status, 'PENDING');

    // 2. Inspection captured by LMO inspector with chassis serial, hologram, wire seal, GPS & MPE results
    final inspection = InspectionModel(
      instrumentId: targetItem.instrumentId,
      lmoId: "LMO-KL-442",
      tradeName: targetItem.shopName,
      chassisSerialObserved: "SN-8839201-X",
      hologramIdAffixed: "HOLO-992-KRL",
      eepromCounterSync: "0x004A",
      latitude: 11.2588,
      longitude: 75.7804,
      wireSealIntact: true,
      turningPointResults: [
        {
          "load_mass": 10.0,
          "indicated_mass": 10.002,
          "delta_l": 0.0015,
          "scale_interval_e": 0.005,
          "status": "PASS",
          "is_pass": true,
        }
      ],
      remarks: "Field test compliant with Seventh Schedule Table 20",
      isPassed: true,
      isSynced: false,
    );

    // 3. Save inspection offline in Hive cache
    await manifestService.saveInspectionOffline(inspection);

    // Verify it is present in Hive box
    final box = await Hive.openBox<String>(OfflineManifestService.hiveBoxName);
    final cachedStr = box.get(inspection.instrumentId.toString());
    expect(cachedStr, isNotNull);
    final cachedJson = jsonDecode(cachedStr!);
    expect(cachedJson['chassis_serial_observed'], 'SN-8839201-X');
    expect(cachedJson['hologram_id_affixed'], 'HOLO-992-KRL');
    expect(cachedJson['wire_seal_intact'], true);
    expect(cachedJson['latitude'], 11.2588);
    expect(cachedJson['longitude'], 75.7804);
    expect(cachedJson['is_synced'], false);

    // 4. Simulate HTTP 200 response from FastAPI backend POST /inspections/upload
    await manifestService.markInspectionAsSynced(inspection.instrumentId);

    // 5. Verify local Hive cache record marked SYNCED
    final updatedStr = box.get(inspection.instrumentId.toString());
    expect(updatedStr, isNotNull);
    final updatedJson = jsonDecode(updatedStr!);
    expect(updatedJson['is_synced'], true);
    expect(updatedJson['status'], 'SYNCED');

    // 6. Verify sync status lookup returns SYNCED
    final syncStatus = await manifestService.getInspectionSyncStatus(inspection.instrumentId);
    expect(syncStatus, 'SYNCED');

    // 7. Verify daily manifest item status is updated to SYNCED
    final updatedManifest = await manifestService.loadDailyManifest();
    final updatedItem = updatedManifest.firstWhere((i) => i.instrumentId == targetItem.instrumentId);
    expect(updatedItem.status, 'SYNCED');
  });
}
