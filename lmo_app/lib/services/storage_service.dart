import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/inspection.dart';

class StorageService {
  static const String _inspectionsQueueKey = 'offline_inspections_queue';

  Future<void> saveInspectionOffline(InspectionModel inspection) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> list = prefs.getStringList(_inspectionsQueueKey) ?? [];
    list.add(jsonEncode(inspection.toJson()));
    await prefs.setStringList(_inspectionsQueueKey, list);
  }

  Future<List<InspectionModel>> getOfflineInspections() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> list = prefs.getStringList(_inspectionsQueueKey) ?? [];
    return list.map((item) => InspectionModel.fromJson(jsonDecode(item))).toList();
  }

  Future<void> clearSyncedInspections() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_inspectionsQueueKey);
  }
}
