import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/manifest_item.dart';
import '../models/inspection.dart';
import 'api_service.dart';

class OfflineManifestService {
  static const String _manifestKey = 'lmo_daily_manifest_cache';
  static const String _inspectionsQueueKey = 'lmo_offline_inspections_queue';
  static const String hiveBoxName = 'maan_inspections_cache';

  /// Helper to get or open Hive box for offline inspection records
  Future<Box<String>> _getHiveBox() async {
    if (!Hive.isBoxOpen(hiveBoxName)) {
      try {
        return await Hive.openBox<String>(hiveBoxName);
      } catch (_) {
        await Hive.initFlutter();
        return await Hive.openBox<String>(hiveBoxName);
      }
    }
    return Hive.box<String>(hiveBoxName);
  }

  /// Seed initial manifest if cache is empty (ensures offline usability in remote mandis)
  static final List<ManifestItem> _defaultSeedManifest = [
    ManifestItem(
      id: 101,
      instrumentId: 1,
      shopName: "Mahalaxmi Provisions & Spices",
      proprietor: "K. R. Nambiar",
      address: "Shop 14, Central Market, Kozhikode",
      pinCode: "673001",
      latitude: 11.2588,
      longitude: 75.7804,
      instrumentCategory: "Counter Scale (General)",
      serialNo: "SN-8839201-X",
      accuracyClass: "III",
      capacityKg: 30.0,
      scaleIntervalEGrams: 5.0,
      cadenceMonths: 24,
      stampingQuarterCode: "B-26",
      status: "PENDING",
    ),
    ManifestItem(
      id: 102,
      instrumentId: 2,
      shopName: "Malabar Bullion & Jewellery",
      proprietor: "P. V. Haridas",
      address: "Mavoor Road Junction, Kozhikode",
      pinCode: "673004",
      latitude: 11.2612,
      longitude: 75.7891,
      instrumentCategory: "Precision Balance",
      serialNo: "PREC-11029-A",
      accuracyClass: "II",
      capacityKg: 1.0,
      scaleIntervalEGrams: 0.01,
      cadenceMonths: 24,
      stampingQuarterCode: "B-26",
      status: "PENDING",
    ),
    ManifestItem(
      id: 103,
      instrumentId: 3,
      shopName: "Calicut Agro Wholesale Weighbridge",
      proprietor: "S. Mohanraj",
      address: "Beypore Industrial Area, Kozhikode",
      pinCode: "673015",
      latitude: 11.1822,
      longitude: 75.8089,
      instrumentCategory: "Electronic Weighbridge",
      serialNo: "WB-449102-M",
      accuracyClass: "III",
      capacityKg: 50000.0,
      scaleIntervalEGrams: 10000.0,
      cadenceMonths: 12,
      stampingQuarterCode: "B-26",
      status: "PENDING",
    ),
    ManifestItem(
      id: 104,
      instrumentId: 4,
      shopName: "Bharat Petroleum Highway Outlet",
      proprietor: "T. K. Suresh",
      address: "NH-66 Bypass, Kozhikode South",
      pinCode: "673014",
      latitude: 11.2291,
      longitude: 75.8152,
      instrumentCategory: "Fuel Dispenser Unit",
      serialNo: "FDU-PET-904",
      accuracyClass: "III",
      capacityKg: 100.0,
      scaleIntervalEGrams: 20.0,
      cadenceMonths: 12,
      stampingQuarterCode: "B-26",
      status: "PENDING",
    ),
  ];

  /// Loads the daily inspection manifest from local cache
  Future<List<ManifestItem>> loadDailyManifest() async {
    final prefs = await SharedPreferences.getInstance();
    final cachedJson = prefs.getString(_manifestKey);

    if (cachedJson != null && cachedJson.isNotEmpty) {
      try {
        final List<dynamic> list = jsonDecode(cachedJson);
        return list.map((item) => ManifestItem.fromJson(item)).toList();
      } catch (_) {
        // Fallback to default seed on corrupted cache
      }
    }

    // Initialize with default routed manifest
    await saveDailyManifest(_defaultSeedManifest);
    return _defaultSeedManifest;
  }

  /// Caches the daily manifest locally
  Future<void> saveDailyManifest(List<ManifestItem> items) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = jsonEncode(items.map((i) => i.toJson()).toList());
    await prefs.setString(_manifestKey, jsonStr);
  }

  /// Updates status of a manifest item (e.g. COMPLETED, SYNCED)
  Future<void> updateItemStatus(int instrumentId, String newStatus) async {
    final items = await loadDailyManifest();
    final updated = items.map((item) {
      if (item.instrumentId == instrumentId) {
        return item.copyWith(status: newStatus);
      }
      return item;
    }).toList();
    await saveDailyManifest(updated);
  }

  /// Queues an inspection offline in both Hive cache and SharedPreferences
  Future<void> saveInspectionOffline(InspectionModel inspection) async {
    // 1. Save in Hive cache
    try {
      final box = await _getHiveBox();
      await box.put(inspection.instrumentId.toString(), jsonEncode(inspection.toJson()));
    } catch (_) {}

    // 2. Dual-save in SharedPreferences queue
    final prefs = await SharedPreferences.getInstance();
    final List<String> list = prefs.getStringList(_inspectionsQueueKey) ?? [];
    list.removeWhere((item) {
      try {
        final decoded = jsonDecode(item);
        return decoded['instrument_id'] == inspection.instrumentId;
      } catch (_) {
        return false;
      }
    });
    list.add(jsonEncode(inspection.toJson()));
    await prefs.setStringList(_inspectionsQueueKey, list);

    // Update manifest status to COMPLETED
    await updateItemStatus(inspection.instrumentId, "COMPLETED");
  }

  /// Updates the local Hive cache so inspection records mark their sync status as SYNCED upon receiving HTTP 200
  Future<void> markInspectionAsSynced(int instrumentId) async {
    // 1. Update Hive box cache record
    try {
      final box = await _getHiveBox();
      final recordStr = box.get(instrumentId.toString());
      if (recordStr != null) {
        final decoded = jsonDecode(recordStr) as Map<String, dynamic>;
        decoded['is_synced'] = true;
        decoded['status'] = 'SYNCED';
        await box.put(instrumentId.toString(), jsonEncode(decoded));
      } else {
        // Search SharedPreferences and backfill Hive cache with SYNCED status
        final prefs = await SharedPreferences.getInstance();
        final List<String> list = prefs.getStringList(_inspectionsQueueKey) ?? [];
        for (final item in list) {
          try {
            final decoded = jsonDecode(item) as Map<String, dynamic>;
            if (decoded['instrument_id'] == instrumentId) {
              decoded['is_synced'] = true;
              decoded['status'] = 'SYNCED';
              await box.put(instrumentId.toString(), jsonEncode(decoded));
              break;
            }
          } catch (_) {}
        }
      }
    } catch (_) {}

    // 2. Update SharedPreferences queue
    final prefs = await SharedPreferences.getInstance();
    final List<String> list = prefs.getStringList(_inspectionsQueueKey) ?? [];
    final updatedList = list.map((item) {
      try {
        final decoded = jsonDecode(item) as Map<String, dynamic>;
        if (decoded['instrument_id'] == instrumentId) {
          decoded['is_synced'] = true;
          decoded['status'] = 'SYNCED';
          return jsonEncode(decoded);
        }
      } catch (_) {}
      return item;
    }).toList();
    await prefs.setStringList(_inspectionsQueueKey, updatedList);

    // 3. Mark manifest item as SYNCED
    await updateItemStatus(instrumentId, "SYNCED");
  }

  /// Retrieves all inspections waiting in the offline queue (checking Hive cache first)
  Future<List<InspectionModel>> getOfflineInspections() async {
    try {
      final box = await _getHiveBox();
      if (box.isNotEmpty) {
        final List<InspectionModel> hiveInspections = [];
        for (final val in box.values) {
          try {
            hiveInspections.add(InspectionModel.fromJson(jsonDecode(val)));
          } catch (_) {}
        }
        if (hiveInspections.isNotEmpty) {
          return hiveInspections;
        }
      }
    } catch (_) {}

    final prefs = await SharedPreferences.getInstance();
    final List<String> list = prefs.getStringList(_inspectionsQueueKey) ?? [];
    return list.map((item) => InspectionModel.fromJson(jsonDecode(item))).toList();
  }

  /// Gets the live sync status of an inspection from Hive cache
  Future<String> getInspectionSyncStatus(int instrumentId) async {
    try {
      final box = await _getHiveBox();
      final recordStr = box.get(instrumentId.toString());
      if (recordStr != null) {
        final decoded = jsonDecode(recordStr) as Map<String, dynamic>;
        if (decoded['is_synced'] == true || decoded['status'] == 'SYNCED') {
          return 'SYNCED';
        }
      }
    } catch (_) {}
    return 'PENDING';
  }

  /// Syncs all queued inspections with the FastAPI backend
  Future<int> syncAllQueuedInspections(ApiService api) async {
    final queued = await getOfflineInspections();
    if (queued.isEmpty) return 0;

    int syncedCount = 0;
    for (final inspection in queued) {
      if (inspection.isSynced) continue;
      try {
        await api.uploadInspection(inspection);
        syncedCount++;
        await markInspectionAsSynced(inspection.instrumentId);
      } catch (e) {
        // Keep in queue if server unreachable
      }
    }

    return syncedCount;
  }
}

