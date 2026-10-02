class ManifestItem {
  final int id;
  final int instrumentId;
  final String shopName;
  final String proprietor;
  final String address;
  final String pinCode;
  final double latitude;
  final double longitude;
  final String instrumentCategory;
  final String serialNo;
  final String accuracyClass;
  final double capacityKg;
  final double scaleIntervalEGrams;
  final int cadenceMonths;
  final String stampingQuarterCode;
  final String status; // PENDING, IN_PROGRESS, COMPLETED, SYNCED

  ManifestItem({
    required this.id,
    required this.instrumentId,
    required this.shopName,
    required this.proprietor,
    required this.address,
    required this.pinCode,
    required this.latitude,
    required this.longitude,
    required this.instrumentCategory,
    required this.serialNo,
    required this.accuracyClass,
    required this.capacityKg,
    required this.scaleIntervalEGrams,
    required this.cadenceMonths,
    required this.stampingQuarterCode,
    this.status = 'PENDING',
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'instrument_id': instrumentId,
      'shop_name': shopName,
      'proprietor': proprietor,
      'address': address,
      'pin_code': pinCode,
      'latitude': latitude,
      'longitude': longitude,
      'instrument_category': instrumentCategory,
      'serial_no': serialNo,
      'accuracy_class': accuracyClass,
      'capacity_kg': capacityKg,
      'scale_interval_e_grams': scaleIntervalEGrams,
      'cadence_months': cadenceMonths,
      'stamping_quarter_code': stampingQuarterCode,
      'status': status,
    };
  }

  factory ManifestItem.fromJson(Map<String, dynamic> json) {
    return ManifestItem(
      id: json['id'] ?? 0,
      instrumentId: json['instrument_id'] ?? 0,
      shopName: json['shop_name'] ?? '',
      proprietor: json['proprietor'] ?? '',
      address: json['address'] ?? '',
      pinCode: json['pin_code'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      instrumentCategory: json['instrument_category'] ?? 'General Commercial',
      serialNo: json['serial_no'] ?? '',
      accuracyClass: json['accuracy_class'] ?? 'III',
      capacityKg: (json['capacity_kg'] as num?)?.toDouble() ?? 30.0,
      scaleIntervalEGrams: (json['scale_interval_e_grams'] as num?)?.toDouble() ?? 5.0,
      cadenceMonths: json['cadence_months'] ?? 24,
      stampingQuarterCode: json['stamping_quarter_code'] ?? 'B-26',
      status: json['status'] ?? 'PENDING',
    );
  }

  ManifestItem copyWith({String? status}) {
    return ManifestItem(
      id: id,
      instrumentId: instrumentId,
      shopName: shopName,
      proprietor: proprietor,
      address: address,
      pinCode: pinCode,
      latitude: latitude,
      longitude: longitude,
      instrumentCategory: instrumentCategory,
      serialNo: serialNo,
      accuracyClass: accuracyClass,
      capacityKg: capacityKg,
      scaleIntervalEGrams: scaleIntervalEGrams,
      cadenceMonths: cadenceMonths,
      stampingQuarterCode: stampingQuarterCode,
      status: status ?? this.status,
    );
  }
}
