# M.A.A.N. LMO Mobile Client (मान)

Offline-first native mobile client for **Legal Metrology Officers (LMOs)** and field inspectors enforcing the **Legal Metrology Act, 2009** and the **Legal Metrology (General) Rules, 2011**.

---

## 📱 Core Architecture & Field Modules

### 1. Offline-First Manifest Architecture (`Hive` / Local Cache)
- Pre-caches routed daily inspection manifests assigned by pin code and PostGIS spatial boundaries.
- Allows LMOs to perform inspections in remote rural mandis with zero 4G connectivity.
- Local inspection queue (`OfflineManifestService`) with one-touch background synchronization once connectivity is restored.

### 2. In-Situ Evidence & 3-Layer Anti-Fraud Hardware Binding
- **On-Device OCR**: Photographs the machine metal chassis plate and extracts the unalterable engraved hardware serial number via Google ML Kit OCR text recognition.
- **Physical Wire Seal Capture**: High-resolution, geotagged (GPS Latitude/Longitude) and timestamped photo of the intact physical wire seal.
- **Holographic Foil Sticker**: Geotagged photo capture of the tamper-evident foil hologram seal (e.g. `HOLO-992-KRL`).
- **EEPROM Calibration Counter**: Mandatory entry of the internal digital calibration cycle counter to detect post-inspection recalibration tampering.

### 3. On-Device Seventh Schedule Table 20 MPE Calculator
- Hardcodes statutory Maximum Permissible Error (MPE) curves for NAWI Classes I–IV (Seventh Schedule, Heading A, Part II).
- Implements continuous rounding via turning points:
  $$P = I + 0.5e - \Delta L \quad \text{(true indication before rounding)}$$
  $$E = P - L = I + 0.5e - \Delta L - L \quad \text{(error before rounding)}$$
  $$E_c = E - E_0 \quad \text{(zero-load corrected error)}$$
  $$\text{Verdict} = \begin{cases} \text{PASS} & \text{if } |E_c| \le \text{MPE} \\ \text{FAIL} & \text{if } |E_c| > \text{MPE} \end{cases}$$
- Statutory $2\times \text{MPE}$ multiplier for in-service field inspections (Clause 3(6)(ii)).
- Instant visual PASS/FAIL verdicts calculated entirely offline.

### 4. Zero-Downtime Day-Forward Migration
- On-demand field digitization of historical paper stamping certificates.

---

## 🛠️ Project Structure

```text
lmo_app/
├── lib/
│   ├── main.dart                          # App entry point with Emerald/Slate Metrology theme
│   ├── models/
│   │   ├── manifest_item.dart             # Daily routed dispatch item (shop, GPS, specs)
│   │   ├── inspection.dart                # In-situ evidence, wire seal, hologram, OCR serial
│   │   └── instrument.dart                # Instrument specifications
│   ├── screens/
│   │   ├── dashboard_screen.dart          # LMO Dashboard with daily metrics & sync queue
│   │   ├── manifest_screen.dart           # Daily inspection route (offline Hive cache)
│   │   ├── chassis_capture_screen.dart    # Camera OCR, wire seal geotag, MPE evaluation
│   │   ├── mpe_field_tool_screen.dart     # Standalone Table 20 MPE turning point evaluator
│   │   └── legacy_certificate_screen.dart # Day-Forward paper migration capture
│   └── services/
│       ├── api_service.dart               # HTTP client connecting to FastAPI backend
│       ├── offline_manifest_service.dart  # Offline-first caching & sync manager
│       └── mpe_calculator_engine.dart     # Pure Dart Table 20 MPE tolerance calculation engine
├── android/
│   └── app/src/main/AndroidManifest.xml   # Camera, GPS, and Storage permissions
├── ios/
│   └── Runner/Info.plist                  # Camera & Photo Library usage descriptions
└── pubspec.yaml                           # Flutter dependencies
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
flutter pub get

# 2. Run on connected device or emulator
flutter run
```
