class InspectionModel {
  final int? id;
  final int instrumentId;
  final String lmoId;
  final String tradeName;
  final String chassisSerialObserved;
  final String hologramIdAffixed;
  final String eepromCounterSync;
  final String? chassisPhotoPath;
  final String? wireSealPhotoPath;
  final String? hologramPhotoPath;
  final String? legacyCertPhotoPath;
  final String? legacyCertificateNo;
  final double? latitude;
  final double? longitude;
  final DateTime? geotagTimestamp;
  final bool wireSealIntact;
  final List<Map<String, dynamic>> turningPointResults;
  final String? remarks;
  final bool isPassed;
  final bool isSynced;
  final DateTime timestamp;

  InspectionModel({
    this.id,
    required this.instrumentId,
    required this.lmoId,
    this.tradeName = "Commercial Establishment",
    required this.chassisSerialObserved,
    required this.hologramIdAffixed,
    this.eepromCounterSync = "0x0001",
    this.chassisPhotoPath,
    this.wireSealPhotoPath,
    this.hologramPhotoPath,
    this.legacyCertPhotoPath,
    this.legacyCertificateNo,
    this.latitude,
    this.longitude,
    this.geotagTimestamp,
    this.wireSealIntact = true,
    this.turningPointResults = const [],
    this.remarks,
    this.isPassed = false,
    this.isSynced = false,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'instrument_id': instrumentId,
      'lmo_id': lmoId,
      'trade_name': tradeName,
      'chassis_serial_observed': chassisSerialObserved,
      'hologram_id_affixed': hologramIdAffixed,
      'eeprom_counter_sync': eepromCounterSync,
      'chassis_photo_path': chassisPhotoPath,
      'wire_seal_photo_path': wireSealPhotoPath,
      'hologram_photo_path': hologramPhotoPath,
      'legacy_cert_photo_path': legacyCertPhotoPath,
      'legacy_certificate_no': legacyCertificateNo,
      'latitude': latitude,
      'longitude': longitude,
      'geotag_timestamp': geotagTimestamp?.toIso8601String(),
      'wire_seal_intact': wireSealIntact,
      'turning_point_results': turningPointResults,
      'remarks': remarks,
      'is_passed': isPassed,
      'is_synced': isSynced,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory InspectionModel.fromJson(Map<String, dynamic> json) {
    return InspectionModel(
      id: json['id'],
      instrumentId: json['instrument_id'] ?? 0,
      lmoId: json['lmo_id'] ?? '',
      tradeName: json['trade_name'] ?? 'Commercial Establishment',
      chassisSerialObserved: json['chassis_serial_observed'] ?? '',
      hologramIdAffixed: json['hologram_id_affixed'] ?? '',
      eepromCounterSync: json['eeprom_counter_sync'] ?? '0x0001',
      chassisPhotoPath: json['chassis_photo_path'],
      wireSealPhotoPath: json['wire_seal_photo_path'],
      hologramPhotoPath: json['hologram_photo_path'],
      legacyCertPhotoPath: json['legacy_cert_photo_path'],
      legacyCertificateNo: json['legacy_certificate_no'],
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      geotagTimestamp: json['geotag_timestamp'] != null
          ? DateTime.parse(json['geotag_timestamp'])
          : null,
      wireSealIntact: json['wire_seal_intact'] ?? true,
      turningPointResults: List<Map<String, dynamic>>.from(json['turning_point_results'] ?? []),
      remarks: json['remarks'],
      isPassed: json['is_passed'] ?? false,
      isSynced: json['is_synced'] ?? false,
      timestamp: json['timestamp'] != null ? DateTime.parse(json['timestamp']) : DateTime.now(),
    );
  }

  InspectionModel copyWith({
    int? id,
    int? instrumentId,
    String? lmoId,
    String? tradeName,
    String? chassisSerialObserved,
    String? hologramIdAffixed,
    String? eepromCounterSync,
    String? chassisPhotoPath,
    String? wireSealPhotoPath,
    String? hologramPhotoPath,
    String? legacyCertPhotoPath,
    String? legacyCertificateNo,
    double? latitude,
    double? longitude,
    DateTime? geotagTimestamp,
    bool? wireSealIntact,
    List<Map<String, dynamic>>? turningPointResults,
    String? remarks,
    bool? isPassed,
    bool? isSynced,
    DateTime? timestamp,
  }) {
    return InspectionModel(
      id: id ?? this.id,
      instrumentId: instrumentId ?? this.instrumentId,
      lmoId: lmoId ?? this.lmoId,
      tradeName: tradeName ?? this.tradeName,
      chassisSerialObserved: chassisSerialObserved ?? this.chassisSerialObserved,
      hologramIdAffixed: hologramIdAffixed ?? this.hologramIdAffixed,
      eepromCounterSync: eepromCounterSync ?? this.eepromCounterSync,
      chassisPhotoPath: chassisPhotoPath ?? this.chassisPhotoPath,
      wireSealPhotoPath: wireSealPhotoPath ?? this.wireSealPhotoPath,
      hologramPhotoPath: hologramPhotoPath ?? this.hologramPhotoPath,
      legacyCertPhotoPath: legacyCertPhotoPath ?? this.legacyCertPhotoPath,
      legacyCertificateNo: legacyCertificateNo ?? this.legacyCertificateNo,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      geotagTimestamp: geotagTimestamp ?? this.geotagTimestamp,
      wireSealIntact: wireSealIntact ?? this.wireSealIntact,
      turningPointResults: turningPointResults ?? this.turningPointResults,
      remarks: remarks ?? this.remarks,
      isPassed: isPassed ?? this.isPassed,
      isSynced: isSynced ?? this.isSynced,
      timestamp: timestamp ?? this.timestamp,
    );
  }
}
