"use client";

import React from "react";
import { CheckCircle2, X, Scale } from "lucide-react";
import { useInspector } from "@/hooks/useInspector";
import { InspectorHeader } from "@/components/inspector/InspectorHeader";
import { TraderCard } from "@/components/inspector/TraderCard";
import { EnforcementAction } from "@/components/inspector/EnforcementAction";
import { BottomNav } from "@/components/inspector/BottomNav";
import { DirectivesDrawer } from "@/components/inspector/DirectivesDrawer";
import { ScannerModal } from "@/components/inspector/ScannerModal";
import { AuditModal } from "@/components/inspector/AuditModal";
import { DirectionsModal } from "@/components/inspector/DirectionsModal";
import { ChallanModal } from "@/components/inspector/ChallanModal";

export default function InspectorFieldClientPage() {
  const {
    isDarkMode,
    toggleTheme,
    queue,
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
    toggleOffense,
    handleGenerateChallan,
  } = useInspector();

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

        {/* Outer Mobile Frame Container */}
        <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 border-x border-slate-200 dark:border-slate-900 shadow-2xl relative pb-32 transition-colors duration-200">
          {/* Header & Filter Controls */}
          <InspectorHeader
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            isSyncing={isSyncing}
            triggerSync={triggerSync}
            unreadDirectivesCount={unreadDirectivesCount}
            onOpenDirectives={() => setDirectivesOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            totalCount={queue.length}
            highPriorityCount={highPriorityCount}
            routineCount={routineCount}
          />

          {/* Assigned Traders Roster Cards */}
          <main className="p-4 space-y-4 flex-1 pb-32">
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
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  No traders match filter
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try adjusting your search criteria or switch to All.
                </p>
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
              filteredQueue.map((trader) => (
                <TraderCard
                  key={trader.id}
                  trader={trader}
                  onStartAudit={startAudit}
                  onDirections={setDirectionsItem}
                />
              ))
            )}

            {/* Enforcement Quick Action */}
            <EnforcementAction onOpenChallan={() => setChallanOpen(true)} />
          </main>

          {/* Bottom Navigation & Floating FAB */}
          <BottomNav
            unreadDirectivesCount={unreadDirectivesCount}
            onOpenScanner={() => setScannerOpen(true)}
            onOpenDirectives={() => setDirectivesOpen(true)}
          />
        </div>
      </div>

      {/* Official Directives Overlay Drawer */}
      <DirectivesDrawer
        isOpen={directivesOpen}
        onClose={() => setDirectivesOpen(false)}
        directives={directives}
        unreadDirectivesCount={unreadDirectivesCount}
        onAcknowledgeDirective={handleAcknowledgeDirective}
        onViewFilteredShops={handleViewFilteredShops}
      />

      {/* Camera Optical Scanner Modal */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        scanMode={scanMode}
        setScanMode={setScanMode}
        torchActive={torchActive}
        setTorchActive={setTorchActive}
        simulatedDetection={simulatedDetection}
        setSimulatedDetection={setSimulatedDetection}
        onApplyToAudit={() => {
          setScannerOpen(false);
          showToast("Foil Hologram metadata attached to audit.");
          setAuditItem(queue[0]);
          setHologramVerified(true);
          setAuditStep(3);
        }}
      />

      {/* Interactive Audit Modal Wizard */}
      <AuditModal
        auditItem={auditItem}
        auditStep={auditStep}
        setAuditStep={setAuditStep}
        sealIntact={sealIntact}
        setSealIntact={setSealIntact}
        testWeightStandard={testWeightStandard}
        setTestWeightStandard={setTestWeightStandard}
        testWeightMeasured={testWeightMeasured}
        setTestWeightMeasured={setTestWeightMeasured}
        hologramVerified={hologramVerified}
        setHologramVerified={setHologramVerified}
        auditVerdict={auditVerdict}
        setAuditVerdict={setAuditVerdict}
        onClose={() => setAuditItem(null)}
        onOpenScanner={() => setScannerOpen(true)}
        onSubmitDisposition={submitAuditDisposition}
      />

      {/* Get Directions Modal */}
      <DirectionsModal
        directionsItem={directionsItem}
        onClose={() => setDirectionsItem(null)}
      />

      {/* Spot e-Challan Modal */}
      <ChallanModal
        isOpen={challanOpen}
        onClose={() => setChallanOpen(false)}
        generatedChallan={generatedChallan}
        queue={queue}
        selectedTraderId={selectedTraderId}
        setSelectedTraderId={setSelectedTraderId}
        selectedOffenses={selectedOffenses}
        toggleOffense={toggleOffense}
        seizeInstrument={seizeInstrument}
        setSeizeInstrument={setSeizeInstrument}
        challanNotes={challanNotes}
        setChallanNotes={setChallanNotes}
        fineAmount={fineAmount}
        onGenerateChallan={handleGenerateChallan}
        onPrint={() => showToast("Printing e-Challan...")}
        onSendSMS={() => {
          if (generatedChallan) {
            showToast(`SMS dispatched to ${generatedChallan.trader.phone}`);
          }
        }}
      />
    </div>
  );
}
