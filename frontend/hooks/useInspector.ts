import { useState, useEffect } from "react";
import {
  InspectionItem,
  DirectiveItem,
  ChallanData,
  INITIAL_QUEUE,
  INITIAL_DIRECTIVES,
  OFFENSES,
} from "@/lib/data";

export function useInspector() {
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

  // Scanner Modals & Overlays
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
    "SEC_24_UNVERIFIED",
    "SEC_30_SHORT_WEIGHT",
  ]);
  const [seizeInstrument, setSeizeInstrument] = useState(false);
  const [fineAmount, setFineAmount] = useState(5000);
  const [challanNotes, setChallanNotes] = useState(
    "Uncalibrated electronic counter scale found with broken security seal wire."
  );
  const [generatedChallan, setGeneratedChallan] = useState<ChallanData | null>(null);

  // Theme Sync
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

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
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

  // Directives Acknowledge Handler
  const handleAcknowledgeDirective = (id: string) => {
    const nowTime =
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      ", 09 Oct 2026";
    setDirectives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, acknowledged: true, acknowledgedAt: nowTime } : d))
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
    if (activeFilter === "ROUTINE")
      return item.riskLevel === "MEDIUM" || item.riskLevel === "LOW";
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

  const toggleOffense = (id: string) => {
    if (selectedOffenses.includes(id)) {
      if (selectedOffenses.length > 1) {
        setSelectedOffenses(selectedOffenses.filter((o) => o !== id));
      }
    } else {
      setSelectedOffenses([...selectedOffenses, id]);
    }
  };

  const handleGenerateChallan = () => {
    const targetTrader = queue.find((q) => q.id === selectedTraderId) || queue[0];
    const newChallan: ChallanData = {
      challanNo: `CHL/KL/KKD/2024/${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp:
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        ", 09 Oct 2026",
      trader: targetTrader,
      totalFine: fineAmount,
      offenses: selectedOffenses,
      seized: seizeInstrument,
    };
    setGeneratedChallan(newChallan);
    showToast(`Spot e-Challan ${newChallan.challanNo} generated and signed.`);
  };

  const startAudit = (item: InspectionItem) => {
    setAuditItem(item);
    setAuditStep(1);
    setSealIntact(null);
    setHologramVerified(false);
    setAuditVerdict(null);
  };

  const submitAuditDisposition = () => {
    if (!auditItem || !auditVerdict) return;
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
  };

  return {
    isDarkMode,
    toggleTheme,
    queue,
    setQueue,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredQueue,
    highPriorityCount,
    routineCount,
    directivesOpen,
    setDirectivesOpen,
    directives,
    unreadDirectivesCount,
    handleAcknowledgeDirective,
    handleViewFilteredShops,
    isSyncing,
    lastSyncTime,
    triggerSync,
    toastMsg,
    setToastMsg,
    showToast,
    scannerOpen,
    setScannerOpen,
    scanMode,
    setScanMode,
    torchActive,
    setTorchActive,
    simulatedDetection,
    setSimulatedDetection,
    auditItem,
    setAuditItem,
    auditStep,
    setAuditStep,
    sealIntact,
    setSealIntact,
    testWeightStandard,
    setTestWeightStandard,
    testWeightMeasured,
    setTestWeightMeasured,
    hologramVerified,
    setHologramVerified,
    auditVerdict,
    setAuditVerdict,
    startAudit,
    submitAuditDisposition,
    directionsItem,
    setDirectionsItem,
    challanOpen,
    setChallanOpen,
    selectedTraderId,
    setSelectedTraderId,
    selectedOffenses,
    seizeInstrument,
    setSeizeInstrument,
    fineAmount,
    challanNotes,
    setChallanNotes,
    generatedChallan,
    setGeneratedChallan,
    toggleOffense,
    handleGenerateChallan,
  };
}

export default useInspector;
