class InstrumentModel {
  final int id;
  final String serialNo;
  final String hologramId;
  final String eepromCounter;
  final String modelName;
  final String accuracyClass;
  final String category;
  final double capacityKg;
  final double scaleIntervalEKg;
  final String status;

  InstrumentModel({
    required this.id,
    required this.serialNo,
    required this.hologramId,
    required this.eepromCounter,
    required this.modelName,
    required this.accuracyClass,
    required this.category,
    required this.capacityKg,
    required this.scaleIntervalEKg,
    required this.status,
  });

  factory InstrumentModel.fromJson(Map<String, dynamic> json) {
    return InstrumentModel(
      id: json['id'] ?? 0,
      serialNo: json['serial_no'] ?? '',
      hologramId: json['hologram_id'] ?? '',
      eepromCounter: json['eeprom_counter'] ?? '0x0001',
      modelName: json['model_name'] ?? '',
      accuracyClass: json['accuracy_class'] ?? 'III',
      category: json['category'] ?? 'GENERAL_COMMERCIAL',
      capacityKg: (json['capacity_kg'] as num?)?.toDouble() ?? 0.0,
      scaleIntervalEKg: (json['scale_interval_e_kg'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'ACTIVE',
    );
  }
}
