export interface InspectionItem {
  id: string;
  shopName: string;
  address: string;
  circle: string;
  tradeType: string;
  licenseNo: string;
  deviceType: string;
  deviceSerial: string;
  lastCalibrationDate: string;
  overdueText?: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  riskLabel: string;
  riskReason: string;
  distance: string;
  phone: string;
  lat: number;
  lng: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface DirectiveItem {
  id: string;
  orderRef: string;
  priority: "HIGH" | "STANDARD" | "POLICY";
  priorityLabel: string;
  senderTitle: string;
  senderDept: string;
  senderAvatarBadge: string;
  subject: string;
  messageBody: string;
  timestamp: string;
  targetArea: string;
  targetShopCount: number;
  filterKeyword: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface OffenseItem {
  id: string;
  section: string;
  label: string;
  penalty: number;
}

export interface ChallanData {
  challanNo: string;
  timestamp: string;
  trader: InspectionItem;
  totalFine: number;
  offenses: string[];
  seized: boolean;
}

export const INITIAL_QUEUE: InspectionItem[] = [
  {
    id: "TR-8812",
    shopName: "Kerala Supermart - Circle 4",
    address: "Mavoor Road Junction, Circle 4, Kozhikode South",
    circle: "Circle 4",
    tradeType: "Supermarket / Retail Grocery",
    licenseNo: "LMO/KKD/2024/7741",
    deviceType: "Essae Teraoka Electronic Counter Scale Class III (30kg / e=5g)",
    deviceSerial: "ESS-2023-KKD-9812",
    lastCalibrationDate: "14 Oct 2023",
    overdueText: "Overdue by 18 days",
    riskLevel: "HIGH",
    riskLabel: "ANOMALY FLAGGED",
    riskReason: "AI Telemetry: Recurring weight drift (+8.4%) & 3 citizen short-weight complaints this week.",
    distance: "0.4 km away (3 mins)",
    phone: "+91 98470 12345",
    lat: 11.2588,
    lng: 75.7804,
    status: "PENDING",
  },
  {
    id: "TR-1049",
    shopName: "Malabar Gold & Diamonds - SM Street",
    address: "Shop 42, Sweet Meat Street, Kozhikode South",
    circle: "Circle 1 - Heritage Commercial",
    tradeType: "Precious Metals & Bullion",
    licenseNo: "LMO/KKD/2023/1089",
    deviceType: "Mettler Toledo High-Precision Balance Class II (1200g / e=0.01g)",
    deviceSerial: "MT-KL-2023-0041B",
    lastCalibrationDate: "02 Nov 2023",
    overdueText: "Verification due in 3 days",
    riskLevel: "HIGH",
    riskLabel: "ANOMALY FLAGGED",
    riskReason: "Sensor Telemetry: Ambient temperature compensation bypass alert recorded.",
    distance: "1.1 km away (7 mins)",
    phone: "+91 94471 88990",
    lat: 11.2515,
    lng: 75.7792,
    status: "PENDING",
  },
  {
    id: "TR-7740",
    shopName: "Calicut Wholesale Provisions - Big Bazaar",
    address: "Bay 12, Valiyangadi Wholesale Market, Kozhikode South",
    circle: "Circle 2 - Commodity Hub",
    tradeType: "Wholesale Grain & Pulses",
    licenseNo: "LMO/KKD/2022/9903",
    deviceType: "Avery Weigh-Tronix Heavy Duty Platform Scale (300kg / Class III)",
    deviceSerial: "AVW-2022-7719A",
    lastCalibrationDate: "15 Dec 2023",
    riskLevel: "MEDIUM",
    riskLabel: "ROUTINE AUDIT",
    riskReason: "Statutory 12-month re-stamping window open under Section 24.",
    distance: "1.8 km away (10 mins)",
    phone: "+91 97455 33211",
    lat: 11.2467,
    lng: 75.7725,
    status: "PENDING",
  },
  {
    id: "TR-3310",
    shopName: "Highland Seafoods & Cold Storage",
    address: "Pier 6, Vellayil Harbour Road, Kozhikode South",
    circle: "Circle 5 - Coastal Sector",
    tradeType: "Fishery Weighment & Logistics",
    licenseNo: "LMO/KKD/2024/4412",
    deviceType: "Salter Suspended Crane Scale IP68 (100kg / e=20g)",
    deviceSerial: "SLT-2024-MAR-08",
    lastCalibrationDate: "28 Aug 2023",
    overdueText: "Calibration expired",
    riskLevel: "MEDIUM",
    riskLabel: "ROUTINE AUDIT",
    riskReason: "Annual coastal periodic audit under Rule 24.",
    distance: "3.2 km away (14 mins)",
    phone: "+91 99950 44556",
    lat: 11.2682,
    lng: 75.7661,
    status: "PENDING",
  },
];

export const INITIAL_DIRECTIVES: DirectiveItem[] = [
  {
    id: "DIR-2026-089",
    orderRef: "DIR/LM/KL/2026/8812-URG",
    priority: "HIGH",
    priorityLabel: "Urgent Action Required",
    senderTitle: "Joint Controller of Legal Metrology",
    senderDept: "State Enforcement Wing, Thiruvananthapuram HQ",
    senderAvatarBadge: "JC",
    subject: "Urgent Action: Re-inspect Kerala Supermart scale #HOLO-992-KRL following 3 citizen short-weight complaints",
    messageBody:
      "Consumer grievance telemetry reports recurring weight drift (+8.4%) across pulses & dry-fruits pan. Execute immediate surprise spot inspection, perform 5kg/20kg standard mass verification tests, and verify lead wire seal integrity under Section 30.",
    timestamp: "10:45 AM Today • 09 Oct 2026",
    targetArea: "Circle 4 - Mavoor Road Sector",
    targetShopCount: 1,
    filterKeyword: "Kerala Supermart",
    acknowledged: false,
  },
  {
    id: "DIR-2026-074",
    orderRef: "ORD/COLL-KKD/LM/2026/410",
    priority: "HIGH",
    priorityLabel: "Special Enforcement Drive",
    senderTitle: "District Collector & Executive Magistrate",
    senderDept: "District Collectorate, Kozhikode",
    senderAvatarBadge: "DC",
    subject: "Special Drive: Pre-festive audit of all Class II high-precision balances in Kozhikode Jewellers Guild",
    messageBody:
      "In view of festival season bullion procurement, inspect calibration certificates and gravity compensation verification tags for all Class II jewellery balances (max 1200g, e=0.01g). Issue spot e-Challan for uncertified weights.",
    timestamp: "08:30 AM Today • 09 Oct 2026",
    targetArea: "Circle 1 - SM Street Jewellers Guild",
    targetShopCount: 3,
    filterKeyword: "Malabar Gold",
    acknowledged: false,
  },
  {
    id: "DIR-2026-061",
    orderRef: "CIR/DCLM/NR/2026/109",
    priority: "STANDARD",
    priorityLabel: "Standard Notice / Circular",
    senderTitle: "Deputy Controller (Enforcement)",
    senderDept: "Northern Region Metrology Division, Kozhikode",
    senderAvatarBadge: "DC-N",
    subject: "Monsoon Compliance: Annual Verification of Coastal Crane Scales",
    messageBody:
      "All suspended crane scales and harbour cold-storage weighbridges must be audited for marine corrosion on load-cell junctions and lead wire stamping seals pursuant to Rule 24.",
    timestamp: "Yesterday, 04:15 PM • 08 Oct 2026",
    targetArea: "Circle 5 - Vellayil Fishing Pier & Harbour",
    targetShopCount: 2,
    filterKeyword: "Highland Seafoods",
    acknowledged: true,
    acknowledgedAt: "08 Oct, 05:20 PM",
  },
];

// Statutory offense schedule under Legal Metrology Act, 2009
export const OFFENSES: OffenseItem[] = [
  {
    id: "SEC_24_UNVERIFIED",
    section: "Section 24",
    label: "Use of Unverified Weight or Measure",
    penalty: 2500,
  },
  {
    id: "SEC_30_SHORT_WEIGHT",
    section: "Section 30",
    label: "Penalty for Non-standard Weight / Short-Weighment",
    penalty: 5000,
  },
  {
    id: "SEC_35_TAMPERED_SEAL",
    section: "Section 35",
    label: "Tampering with Official Verification Lead Seal",
    penalty: 10000,
  },
  {
    id: "PCR_2011_DEFECTIVE_PACK",
    section: "PCR Rule 18/32",
    label: "Packaged Commodities Rule Violation (MRP / Net Qty Mismatch)",
    penalty: 5000,
  },
];
