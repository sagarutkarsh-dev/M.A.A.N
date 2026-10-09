"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  QrCode,
  Camera,
  AlertTriangle,
  AlertOctagon,
  Navigation,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
  ChevronRight,
  Search,
  Phone,
  Gavel,
  Siren,
  Printer,
  Share2,
  ArrowLeft,
  X,
  Crosshair,
  Sun,
  Moon,
  Check,
  Building2,
  CheckCheck,
  FileCheck2,
  Clock,
  Bell,
  LogOut,
} from "lucide-react";

interface InspectionItem {
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

interface DirectiveItem {
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

const INITIAL_QUEUE: InspectionItem[] = [
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

const INITIAL_DIRECTIVES: DirectiveItem[] = [
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
const OFFENSES = [
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

export default function InspectorFieldClientPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Inspection Queue State
  const [queue, setQueue] = useState<InspectionItem[]>(INITIAL_QUEUE);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HIGH" | "ROUTINE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Directives Overlay & State
  const [directivesOpen, setDirectivesOpen] = useState(false);
  const [directives, setDirectives] = useState<DirectiveItem[]>(INITIAL_DIRECTIVES);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals & Overlays
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanMode, setScanMode] = useState<"hologram" | "qr" | "serial" | "ocr">("hologram");
  const [torchActive, setTorchActive] = useState(false);
  const [simulatedDetection, setSimulatedDetection] = useState(false);

  // Audit Modal State
  const [auditItem, setAuditItem] = useState<InspectionItem | null>(null);
  const [auditStep, setAuditStep] = useState<1 | 2 | 3 | 4>(1);
  const [sealIntact, setSealIntact] = useState<boolean | null>(null);
  const [testWeightStandard, setTestWeightStandard] = useState("5.000");
  const [testWeightMeasured, setTestWeightMeasured] = useState("5.002");
  const [hologramVerified, setHologramVerified] = useState(false);
  const [auditVerdict, setAuditVerdict] = useState<"PASS" | "FAIL" | null>(null);

  // Directions Modal State
  const [directionsItem, setDirectionsItem] = useState<InspectionItem | null>(null);

  // Spot e-Challan Modal State
  const [challanOpen, setChallanOpen] = useState(false);
  const [selectedTraderId, setSelectedTraderId] = useState(INITIAL_QUEUE[0].id);
  const [selectedOffenses, setSelectedOffenses] = useState<string[]>([
    "SEC_30_SHORT_WEIGHT",
  ]);
  const [seizeInstrument, setSeizeInstrument] = useState(false);
  const [fineAmount, setFineAmount] = useState(5000);
  const [challanNotes, setChallanNotes] = useState("Uncalibrated electronic counter scale found with broken security seal wire.");
  const [generatedChallan, setGeneratedChallan] = useState<{
    challanNo: string;
    timestamp: string;
    trader: InspectionItem;
    totalFine: number;
    offenses: string[];
    seized: boolean;
  } | null>(null);

  // Initialize theme from localStorage or default dark
  useEffect(() => {
    try {
      const stored = localStorage.getItem("maan-theme");
      if (stored === "light") {
        setIsDarkMode(false);
      } else if (stored === "dark") {
        setIsDarkMode(true);
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      localStorage.setItem("maan-theme", next ? "dark" : "light");
    } catch {
      // Local storage fallback
    }
  };

  // Sync action handler
  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("16:58 (AES-256)");
      showToast("Offline local database synced with State LM Server.");
    }, 1100);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Directives Acknowledge Handler
  const handleAcknowledgeDirective = (id: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", 09 Oct 2026";
    setDirectives((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, acknowledged: true, acknowledgedAt: nowTime } : d
      )
    );
    const target = directives.find((d) => d.id === id);
    showToast(`Order ${target?.orderRef || id} acknowledged & logged.`);
  };

  // Directives "View Filtered Shops" Handler
  const handleViewFilteredShops = (keyword: string) => {
    setDirectivesOpen(false);
    setSearchQuery(keyword);
    setActiveFilter("ALL");
    showToast(`Roster filtered for: "${keyword}"`);
  };

  // Simulated detection trigger when scanner opens
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scannerOpen) {
      setSimulatedDetection(false);
      timer = setTimeout(() => {
        setSimulatedDetection(true);
      }, 1600);
    } else {
      setSimulatedDetection(false);
      setTorchActive(false);
    }
    return () => clearTimeout(timer);
  }, [scannerOpen, scanMode]);

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.licenseNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === "HIGH") return item.riskLevel === "HIGH";
    if (activeFilter === "ROUTINE") return item.riskLevel === "MEDIUM" || item.riskLevel === "LOW";
    return true;
  });

  const highPriorityCount = queue.filter((q) => q.riskLevel === "HIGH").length;
  const routineCount = queue.filter((q) => q.riskLevel !== "HIGH").length;
  const unreadDirectivesCount = directives.filter((d) => !d.acknowledged).length;

  // Calculate fine total dynamically
  useEffect(() => {
    let total = 0;
    selectedOffenses.forEach((offId) => {
      const match = OFFENSES.find((o) => o.id === offId);
      if (match) total += match.penalty;
    });
    setFineAmount(total);
  }, [selectedOffenses]);

  // Handle offense toggle
  const toggleOffense = (id: string) => {
    if (selectedOffenses.includes(id)) {
      if (selectedOffenses.length > 1) {
        setSelectedOffenses(selectedOffenses.filter((o) => o !== id));
      }
    } else {
      setSelectedOffenses([...selectedOffenses, id]);
    }
  };

  // Handle Challan Submission
  const handleGenerateChallan = () => {
    const targetTrader = queue.find((q) => q.id === selectedTraderId) || queue[0];
    const newChallan = {
      challanNo: `CHL/KL/KKD/2024/${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", 09 Oct 2026",
      trader: targetTrader,
      totalFine: fineAmount,
      offenses: selectedOffenses,
      seized: seizeInstrument,
    };
    setGeneratedChallan(newChallan);
    showToast(`Spot e-Challan ${newChallan.challanNo} generated and signed.`);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between text-xs border border-emerald-400 animate-bounce">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-slate-950 flex-shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-900 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Outer Mobile Frame Container (max-w-md mx-auto) */}
        <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 border-x border-slate-200 dark:border-slate-900 shadow-2xl relative pb-32 transition-colors duration-200">
          {/* Device Status Bar */}
          <div className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono border-b border-slate-200 dark:border-slate-900 transition-colors">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">16:58</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-medium">
                5G FIELD NET
              </span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>RTK ±2m</span>
              </div>

              {/* Theme Toggle Button (Sun / Moon) */}
              <button
                onClick={toggleTheme}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                )}
              </button>

              <span className="font-semibold text-slate-800 dark:text-slate-200">88%</span>
            </div>
          </div>

          {/* 1. Clean Header & Directives Bell Bar */}
          <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors">
            <div className="flex items-center justify-between">
              {/* Officer Identification Block */}
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
                  <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Scale className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                      Inspector #408
                    </h1>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.2 rounded-md">
                      Kozhikode S.
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>LMO Desk • Sync Ready</span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions: Directives Bell & Sync/Logout */}
              <div className="flex items-center space-x-2">
                {/* Notification Bell with 2 Red Badge (Toggles Directives Overlay) */}
                <button
                  onClick={() => setDirectivesOpen(true)}
                  title="View Official Directives & Orders"
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all relative active:scale-95 shadow-sm"
                  aria-label="Directives Notification"
                >
                  <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                  {unreadDirectivesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-md animate-pulse">
                      {unreadDirectivesCount}
                    </span>
                  )}
                </button>

                {/* Force Sync button */}
                <button
                  onClick={triggerSync}
                  disabled={isSyncing}
                  title="Force local database sync"
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isSyncing ? "animate-spin" : ""}`} />
                </button>

                {/* Logout link to /inspector/login */}
                <Link
                  href="/inspector/login"
                  title="Officer Logout / Lock Desk"
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-slate-200 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-700/60 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 transition-all active:scale-95 shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </header>

          {/* 2. Sleek Filter Bar: Search Box & Horizontal Pill Filters */}
          <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 transition-colors">
            {/* Search Box on top with standard border */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shop, address, license or serial..."
                className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl pl-10 pr-9 py-2.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Horizontal Pill Filters: [All (4)] [⚠️ Anomalies (2)] [Routine (2)] */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === "ALL"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                All ({queue.length})
              </button>

              <button
                onClick={() => setActiveFilter("HIGH")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                  activeFilter === "HIGH"
                    ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                    : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60"
                }`}
              >
                <span>⚠️</span>
                <span>Anomalies ({highPriorityCount})</span>
              </button>

              <button
                onClick={() => setActiveFilter("ROUTINE")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                  activeFilter === "ROUTINE"
                    ? "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm shadow-cyan-500/20"
                    : "bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-950/50"
                }`}
              >
                <span>Routine ({routineCount})</span>
              </button>
            </div>
          </div>

          {/* 3. Color-Coded Category Block Roster Cards */}
          <main className="p-4 space-y-3.5 flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                Assigned Traders Roster
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                Sync: {lastSyncTime}
              </span>
            </div>

            {filteredQueue.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-8 text-center text-slate-600 dark:text-slate-400 space-y-2 shadow-sm">
                <Scale className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 opacity-60" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">No traders match filter</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search criteria or switch to All.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("ALL");
                  }}
                  className="mt-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs rounded-xl font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredQueue.map((trader) => {
                const isAnomaly = trader.riskLevel === "HIGH";

                return (
                  <div
                    key={trader.id}
                    className={`rounded-2xl border p-4 space-y-3 transition-all shadow-sm ${
                      isAnomaly
                        ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 shadow-rose-900/5"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-slate-900/5"
                    }`}
                  >
                    {/* Card Header Strip: Shop & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                          {trader.shopName}
                        </h3>
                        <div className="flex items-center text-xs text-slate-600 dark:text-slate-300 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">{trader.address}</span>
                        </div>
                      </div>

                      {/* Color-Coded Status Badge */}
                      <div className="flex-shrink-0">
                        {isAnomaly ? (
                          <div className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/80 border border-rose-300 dark:border-rose-600/60 text-rose-700 dark:text-rose-200 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 animate-pulse" />
                            <span>ANOMALY FLAGGED</span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-600/50 text-emerald-800 dark:text-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>ROUTINE AUDIT</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Machine & Calibration Metadata Sub-Box */}
                    <div className="bg-white/90 dark:bg-slate-950/70 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800/80 space-y-1.5 text-xs shadow-2xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">Instrument:</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[210px] truncate">
                          {trader.deviceType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">Serial Tag:</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                          {trader.deviceSerial}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-0.5">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> Last Calibration:
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                            {trader.lastCalibrationDate}
                          </span>
                          {trader.overdueText && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-medium">
                              {trader.overdueText}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Anomaly note if flagged */}
                      {trader.riskReason && isAnomaly && (
                        <div className="pt-1.5 border-t border-rose-100 dark:border-slate-900 text-[11px] flex items-start space-x-1.5 text-rose-700 dark:text-rose-300 leading-tight">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>{trader.riskReason}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Distance & Registration details */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                      <span className="font-mono">Reg: {trader.licenseNo}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{trader.distance}</span>
                    </div>

                    {/* Actions: Solid rounded green button ("Start Audit") paired with compact "Directions" icon button */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setAuditItem(trader);
                          setAuditStep(1);
                          setSealIntact(null);
                          setHologramVerified(false);
                          setAuditVerdict(null);
                        }}
                        className="h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex-1 flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20 transition-all active:scale-98"
                      >
                        <Scale className="w-4 h-4 text-slate-950" />
                        <span>Start Audit</span>
                      </button>

                      <button
                        onClick={() => setDirectionsItem(trader)}
                        title={`Get GPS Directions to ${trader.shopName}`}
                        className="h-12 w-12 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-850 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700/80 transition-all active:scale-98 flex-shrink-0 shadow-sm"
                      >
                        <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Quick Violation Action Card at the bottom */}
            <div className="mt-6 pt-2">
              <div className="bg-rose-50 dark:bg-rose-950/30 rounded-2xl p-4 border border-rose-200 dark:border-rose-800/50 shadow-md space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-600/30 border border-rose-300 dark:border-rose-500/40 flex items-center justify-center">
                      <Siren className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        Enforcement Quick Action
                      </h3>
                      <p className="text-[11px] text-rose-700 dark:text-rose-300">
                        Legal Metrology Act, 2009 • Section 48 Compounding
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-600/50 px-2 py-0.5 rounded font-mono font-bold">
                    FORM LM-8
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Direct statutory enforcement for short-weighting, snipped lead wire seals, or unverified commercial scales.
                </p>

                <button
                  onClick={() => {
                    setGeneratedChallan(null);
                    setChallanOpen(true);
                  }}
                  className="w-full h-12 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/40 border border-rose-400/40 transition-transform active:scale-98"
                >
                  <Gavel className="w-4 h-4 text-rose-100" />
                  <span>Issue Spot e-Challan</span>
                  <ChevronRight className="w-4 h-4 text-rose-100 ml-1" />
                </button>
              </div>
            </div>
          </main>

          {/* 4. Floating Camera Scanner (FAB) */}
          {/* Solid Emerald Green pill button */}
          <div className="fixed bottom-5 inset-x-0 max-w-md mx-auto px-4 pointer-events-none z-30">
            <div className="pointer-events-auto flex justify-center">
              <button
                onClick={() => setScannerOpen(true)}
                className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-full flex items-center space-x-2.5 shadow-lg shadow-emerald-500/25 border border-emerald-400/50 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-slate-950" />
                </div>
                <span>Scan Scale / Hologram</span>
                <QrCode className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 z-20 transition-colors">
            <Link href="/" className="flex flex-col items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <ArrowLeft className="w-4 h-4 mb-0.5" />
              <span>Home</span>
            </Link>
            <button
              onClick={() => setDirectivesOpen(true)}
              className="flex flex-col items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative"
            >
              <Bell className="w-4 h-4 mb-0.5" />
              <span>Directives</span>
              {unreadDirectivesCount > 0 && (
                <span className="absolute -top-1 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <Link href="/audit" className="flex flex-col items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <ShieldCheck className="w-4 h-4 mb-0.5" />
              <span>Verify</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* OFFICIAL DIRECTIVES OVERLAY DRAWER (TOGGLED BY BELL ICON) */}
      {/* ========================================================= */}
      {directivesOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-slate-100 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Official Directives & Orders</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Higher Authority Dispatch Channel</p>
                </div>
              </div>
              <button
                onClick={() => setDirectivesOpen(false)}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Directives Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pb-1">
                <span>{directives.length} Total Directives</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{unreadDirectivesCount} Action Pending</span>
              </div>

              {directives.map((d) => (
                <div
                  key={d.id}
                  className={`rounded-2xl border p-4 space-y-3 transition-all ${
                    d.priority === "HIGH" && !d.acknowledged
                      ? "bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60 ring-1 ring-rose-500/30"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {/* Badge & Order Ref */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        d.priority === "HIGH"
                          ? "bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-200 border border-rose-300 dark:border-rose-600/50"
                          : "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-600/40"
                      }`}
                    >
                      {d.priorityLabel}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-bold">{d.orderRef}</span>
                  </div>

                  {/* Sender */}
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs">
                      {d.senderAvatarBadge}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{d.senderTitle}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{d.senderDept}</p>
                    </div>
                  </div>

                  {/* Subject & Body */}
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">{d.subject}</h3>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    {d.messageBody}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {d.timestamp}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">{d.targetArea}</span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {d.acknowledged ? (
                      <div className="h-10 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] rounded-xl flex items-center justify-center space-x-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Acknowledged</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcknowledgeDirective(d.id)}
                        className="h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow-sm active:scale-98"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleViewFilteredShops(d.filterKeyword)}
                      className="h-10 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-[11px] rounded-xl flex items-center justify-center space-x-1 border border-slate-200 dark:border-slate-700"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>View Target ({d.targetShopCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SIMULATED FULL-SCREEN CAMERA VIEWFINDER OVERLAY       */}
      {/* ========================================================= */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between max-w-md mx-auto overflow-hidden animate-in fade-in duration-200">
          <div className="p-4 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-white z-10">
            <button
              onClick={() => setScannerOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Field Optical Scanner
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                {scanMode === "hologram" && "Target: 3-Layer Foil Hologram"}
                {scanMode === "qr" && "Target: DataMatrix / Serial QR"}
                {scanMode === "serial" && "Target: Metal Stamping Serial Tag"}
                {scanMode === "ocr" && "Target: Digital Seven-Segment Scale"}
              </span>
            </div>

            <button
              onClick={() => setTorchActive(!torchActive)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                torchActive ? "bg-amber-400 text-black shadow-lg shadow-amber-400/50" : "bg-white/10 text-white"
              }`}
              title="Toggle Flash Torch"
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 z-10">
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-1 flex items-center justify-between border border-white/10 text-[11px]">
              <button
                onClick={() => setScanMode("hologram")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  scanMode === "hologram" ? "bg-emerald-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Foil Hologram
              </button>
              <button
                onClick={() => setScanMode("qr")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  scanMode === "qr" ? "bg-emerald-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Digital QR
              </button>
              <button
                onClick={() => setScanMode("serial")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  scanMode === "serial" ? "bg-emerald-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Serial Tag
              </button>
              <button
                onClick={() => setScanMode("ocr")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  scanMode === "ocr" ? "bg-emerald-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Scale OCR
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center px-6 my-2">
            {torchActive && <div className="absolute inset-0 bg-amber-100/10 pointer-events-none"></div>}

            <div className="w-full max-w-[290px] aspect-square relative rounded-2xl border-2 border-emerald-500/40 bg-slate-900/30 overflow-hidden backdrop-blur-[2px]">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <Crosshair className="w-12 h-12 text-emerald-400" />
              </div>

              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scanline"></div>

              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                {scanMode === "hologram" && (
                  <div
                    className={`w-36 h-36 rounded-xl border border-white/30 shadow-2xl flex flex-col items-center justify-center p-2 text-center transition-all duration-500 ${
                      simulatedDetection
                        ? "holographic-foil border-emerald-400 ring-4 ring-emerald-400/40"
                        : "bg-slate-800/80 border-slate-600"
                    }`}
                  >
                    <Scale className="w-8 h-8 text-amber-200 mb-1" />
                    <span className="text-[9px] font-bold tracking-wider text-white uppercase font-mono">
                      Govt of Kerala
                    </span>
                    <span className="text-[10px] font-black text-amber-100 font-mono tracking-tight">
                      HOL-KL-2024-99824
                    </span>
                    <span className="text-[8px] text-emerald-100 font-semibold mt-1">
                      3-Layer Security Foil
                    </span>
                  </div>
                )}

                {scanMode === "qr" && (
                  <div className="w-36 h-36 bg-white rounded-xl p-3 flex flex-col items-center justify-center text-slate-900 shadow-xl">
                    <QrCode className="w-20 h-20 text-slate-900" />
                    <span className="text-[9px] font-mono font-bold mt-1">MAAN:2024:7741</span>
                  </div>
                )}

                {scanMode === "serial" && (
                  <div className="w-44 h-24 bg-gradient-to-r from-slate-400 to-slate-300 rounded-lg border-2 border-slate-500 p-2 text-slate-900 flex flex-col justify-between font-mono shadow-xl">
                    <div className="text-[9px] font-bold">LEGAL METROLOGY STAMP</div>
                    <div className="text-xs font-black tracking-widest">ESS-2023-KKD-9812</div>
                    <div className="text-[8px] text-slate-700">CLASS III • Max 30kg • e=5g</div>
                  </div>
                )}

                {scanMode === "ocr" && (
                  <div className="w-40 h-20 bg-black rounded-lg border-2 border-slate-700 p-2 flex items-center justify-center font-mono text-emerald-400 shadow-xl">
                    <span className="text-2xl font-black tracking-wider">05.002 kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-t from-black via-black/95 to-transparent space-y-3 z-10">
            {simulatedDetection ? (
              <div className="bg-emerald-950/90 border border-emerald-400/50 rounded-2xl p-3.5 space-y-2 animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Target Cryptographically Validated
                      </span>
                      <span className="text-[10px] text-emerald-300 font-mono">
                        Seal ID: KL-HOL-2024-99824 • Intact
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-400/40">
                    MATCH: 99.4%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setScannerOpen(false);
                      showToast("Foil Hologram metadata attached to audit.");
                      setAuditItem(queue[0]);
                      setHologramVerified(true);
                      setAuditStep(3);
                    }}
                    className="h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply to Audit</span>
                  </button>

                  <button
                    onClick={() => setSimulatedDetection(false)}
                    className="h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Rescan Target</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 space-y-2">
                <p className="text-xs text-slate-400">
                  Align camera frame with official foil hologram or calibration stamp tag...
                </p>
                <div className="flex items-center justify-center space-x-2 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>AI Reticle Tracking Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INTERACTIVE "START AUDIT" MODAL WIZARD                    */}
      {/* ========================================================= */}
      {auditItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-100 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Field Audit Suite
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                  {auditItem.shopName}
                </h3>
              </div>
              <button
                onClick={() => setAuditItem(null)}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/70 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              {[
                { num: 1, label: "Seal Check" },
                { num: 2, label: "Mass Test" },
                { num: 3, label: "Hologram" },
                { num: 4, label: "Certificate" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`flex items-center space-x-1 ${
                    auditStep === s.num
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : auditStep > s.num
                      ? "text-emerald-700 dark:text-emerald-500 font-medium"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      auditStep === s.num
                        ? "bg-emerald-500 text-slate-950"
                        : auditStep > s.num
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {auditStep > s.num ? "✓" : s.num}
                  </span>
                  <span className="hidden sm:inline text-[11px]">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-sm text-slate-700 dark:text-slate-200">
              {auditStep === 1 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Chassis Verified</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{auditItem.deviceType}</p>
                    <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400">S/N: {auditItem.deviceSerial}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Lead Wire & Potentiometer Seal Inspection
                    </label>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setSealIntact(true)}
                        className={`h-14 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                          sealIntact === true
                            ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-0.5" />
                        <span className="text-xs font-bold">Seal Intact & Valid</span>
                      </button>

                      <button
                        onClick={() => setSealIntact(false)}
                        className={`h-14 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                          sealIntact === false
                            ? "bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/30"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mb-0.5" />
                        <span className="text-xs font-bold">Tampered / Snipped</span>
                      </button>
                    </div>

                    {sealIntact === false && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-600/50 rounded-2xl text-xs text-rose-800 dark:text-rose-200 space-y-1 animate-in fade-in">
                        <span className="font-bold flex items-center gap-1 text-rose-700 dark:text-rose-300">
                          <AlertTriangle className="w-4 h-4" /> Section 35 Breach Detected
                        </span>
                        <p>Mandatory escalation to Spot e-Challan upon inspection completion.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {auditStep === 2 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Class III Permissible Error: ±0.1%</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Place verified inspector standard masses on pan and compare indicator reading.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Standard Mass Applied (kg):
                      </label>
                      <input
                        type="text"
                        value={testWeightStandard}
                        onChange={(e) => setTestWeightStandard(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-3 py-2 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Scale Measured Display (kg):
                      </label>
                      <input
                        type="text"
                        value={testWeightMeasured}
                        onChange={(e) => setTestWeightMeasured(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-3 py-2 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {(() => {
                      const std = parseFloat(testWeightStandard) || 5;
                      const meas = parseFloat(testWeightMeasured) || 5;
                      const diff = meas - std;
                      const percent = (diff / std) * 100;
                      const isPassing = Math.abs(percent) <= 0.15;

                      return (
                        <div
                          className={`p-3 rounded-2xl border ${
                            isPassing
                              ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200"
                              : "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>Deviation: {diff >= 0 ? `+${diff.toFixed(3)}` : diff.toFixed(3)} kg</span>
                            <span>{percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`}</span>
                          </div>
                          <p className="text-[11px] mt-1">
                            {isPassing
                              ? "✓ Permissible tolerances met under Section 24 standards."
                              : "⚠️ Reading exceeds statutory tolerance! Violates Section 30."}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {auditStep === 3 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block">Security Foil Hologram Authentication</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      Scan or verify official holographic anti-tamper sticker on chassis potentiometer.
                    </p>

                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Foil Serial:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">KL-HOL-2024-99824</span>
                    </div>

                    <button
                      onClick={() => setScannerOpen(true)}
                      className="w-full h-11 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-800 dark:text-white font-semibold text-xs flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700"
                    >
                      <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Launch Optical Scanner</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="holoCheckModal"
                      checked={hologramVerified}
                      onChange={(e) => setHologramVerified(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                    />
                    <label htmlFor="holoCheckModal" className="text-xs text-slate-700 dark:text-slate-300">
                      I certify that anti-counterfeit foil hologram shows valid 3-layer diffraction.
                    </label>
                  </div>
                </div>
              )}

              {auditStep === 4 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white">Inspection Summary</h4>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span>Physical Lead Seal:</span>
                      <span className={sealIntact ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                        {sealIntact ? "Intact" : "Tampered"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span>Standard Mass Test:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Deviation +0.04% (Pass)</span>
                    </div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span>Hologram Security:</span>
                      <span className={hologramVerified ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-amber-600 dark:text-amber-400"}>
                        {hologramVerified ? "Validated" : "Manual Pass"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Select Final Disposition:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAuditVerdict("PASS")}
                        className={`h-12 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                          auditVerdict === "PASS"
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Issue Certificate LM-4</span>
                      </button>

                      <button
                        onClick={() => setAuditVerdict("FAIL")}
                        className={`h-12 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                          auditVerdict === "FAIL"
                            ? "bg-rose-600 border-rose-500 text-white shadow-lg"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Fail & Issue Challan</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              {auditStep > 1 ? (
                <button
                  onClick={() => setAuditStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : 1))}
                  className="h-11 px-4 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {auditStep < 4 ? (
                <button
                  onClick={() => setAuditStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : 4))}
                  className="h-11 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 ml-auto"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (auditVerdict === "FAIL") {
                      setSelectedTraderId(auditItem.id);
                      setAuditItem(null);
                      setChallanOpen(true);
                      showToast("Audit Failed. Opening Spot e-Challan form...");
                    } else {
                      setQueue((prev) =>
                        prev.map((item) =>
                          item.id === auditItem.id
                            ? { ...item, status: "COMPLETED", riskLevel: "LOW", riskLabel: "VERIFIED & SEALED" }
                            : item
                        )
                      );
                      setAuditItem(null);
                      showToast(`Certificate LM-4 issued for ${auditItem.shopName}`);
                    }
                  }}
                  disabled={!auditVerdict}
                  className={`h-11 px-6 rounded-xl text-xs font-bold ml-auto transition-all ${
                    auditVerdict
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Submit Official Disposition
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GET DIRECTIONS MODAL                                      */}
      {/* ========================================================= */}
      {directionsItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{directionsItem.shopName}</h3>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">{directionsItem.distance}</p>
                </div>
              </div>
              <button
                onClick={() => setDirectionsItem(null)}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="absolute top-10 left-12 flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white animate-ping"></div>
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white absolute"></div>
                <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
                  Officer #408
                </span>
              </div>

              <div className="absolute bottom-10 right-14 flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-rose-500 drop-shadow-md" />
                <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold shadow">
                  {directionsItem.shopName}
                </span>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="64"
                  y1="50"
                  x2="280"
                  y2="140"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              </svg>
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Address:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[200px] truncate">
                    {directionsItem.address}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Circle:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">{directionsItem.circle}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                  <span className="text-slate-900 dark:text-white font-mono">{directionsItem.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${directionsItem.phone}`}
                  className="h-12 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700"
                >
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Call Trader</span>
                </a>

                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${directionsItem.lat},${directionsItem.lng}`;
                    window.open(url, "_blank");
                  }}
                  className="h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Maps</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SPOT E-CHALLAN MODAL (FORM LM-8)                          */}
      {/* ========================================================= */}
      {challanOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-rose-900 dark:bg-rose-950 p-4 border-b border-rose-800/60 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center">
                  <Gavel className="w-4 h-4 text-rose-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Issue Spot e-Challan</h3>
                  <p className="text-[11px] text-rose-200">Legal Metrology Form LM-8 • Section 48</p>
                </div>
              </div>
              <button
                onClick={() => setChallanOpen(false)}
                className="w-8 h-8 rounded-full bg-rose-950 hover:bg-rose-800 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-200">
              {generatedChallan ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-xl border-2 border-rose-600/30 font-sans space-y-3">
                    <div className="text-center border-b border-slate-200 pb-2.5">
                      <div className="flex items-center justify-center space-x-1.5 mb-1">
                        <Scale className="w-5 h-5 text-emerald-800" />
                        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                          Govt. of Kerala • Legal Metrology
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">OFFICIAL COMPOUNDING RECEIPT (LM-8)</p>
                      <div className="mt-1 font-mono font-bold text-rose-700 text-xs">
                        {generatedChallan.challanNo}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span className="font-semibold text-slate-800">{generatedChallan.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Trader:</span>
                        <span className="font-bold text-slate-900">{generatedChallan.trader.shopName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">License:</span>
                        <span className="font-mono text-slate-800">{generatedChallan.trader.licenseNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Officer:</span>
                        <span className="font-semibold text-slate-800">Inspector #408</span>
                      </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-rose-700 uppercase font-bold tracking-wider block">
                        Compounding Fine
                      </span>
                      <span className="text-2xl font-black text-rose-800">
                        ₹{generatedChallan.totalFine.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-center pt-1">
                      <div className="p-2 border border-slate-300 rounded-xl bg-slate-50 flex items-center space-x-3">
                        <QrCode className="w-12 h-12 text-slate-900" />
                        <div className="text-[10px] text-slate-600 leading-tight">
                          <span className="font-bold block text-slate-900">Scan UPI / Bharat QR</span>
                          Instant Treasury Settlement
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => showToast("Printing e-Challan...")}
                      className="h-11 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 border border-slate-200 dark:border-slate-700"
                    >
                      <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Print Thermal</span>
                    </button>
                    <button
                      onClick={() => showToast(`SMS dispatched to ${generatedChallan.trader.phone}`)}
                      className="h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-md"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>SMS to Trader</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block mb-1">
                      Target Establishment:
                    </label>
                    <select
                      value={selectedTraderId}
                      onChange={(e) => setSelectedTraderId(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-rose-500"
                    >
                      {queue.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.shopName} ({t.licenseNo})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block">
                      Statutory Violations:
                    </label>

                    <div className="space-y-1.5">
                      {OFFENSES.map((off) => {
                        const isChecked = selectedOffenses.includes(off.id);
                        return (
                          <div
                            key={off.id}
                            onClick={() => toggleOffense(off.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
                              isChecked
                                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-500 text-slate-900 dark:text-white"
                                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 mt-0.5 text-rose-600 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-rose-700 dark:text-rose-300 text-[11px]">{off.section}</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">₹{off.penalty}</span>
                              </div>
                              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">{off.label}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="seizeCheckChallan"
                      checked={seizeInstrument}
                      onChange={(e) => setSeizeInstrument(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                    />
                    <label htmlFor="seizeCheckChallan" className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer">
                      <span className="font-bold block text-slate-900 dark:text-white">Execute Seizure under Section 15</span>
                      Impound non-standard weights & measures for locker custody.
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block mb-1">
                      Inspection Findings / Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={challanNotes}
                      onChange={(e) => setChallanNotes(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-2.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-rose-700 dark:text-rose-300 uppercase font-bold block">
                        Fine Amount
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {selectedOffenses.length} section(s) applied
                      </span>
                    </div>
                    <span className="text-xl font-black text-rose-700 dark:text-rose-400">
                      ₹{fineAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={handleGenerateChallan}
                    className="w-full h-12 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/40 transition-all active:scale-98"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Generate & Sign e-Challan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
