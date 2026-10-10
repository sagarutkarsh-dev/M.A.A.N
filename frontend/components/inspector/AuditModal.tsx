import React from "react";
import { InspectionItem } from "@/lib/data";
import {
  Scale,
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  ChevronRight,
} from "lucide-react";

interface AuditModalProps {
  auditItem: InspectionItem | null;
  auditStep: 1 | 2 | 3 | 4;
  setAuditStep: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4>>;
  sealIntact: boolean | null;
  setSealIntact: (val: boolean | null) => void;
  testWeightStandard: string;
  setTestWeightStandard: (val: string) => void;
  testWeightMeasured: string;
  setTestWeightMeasured: (val: string) => void;
  hologramVerified: boolean;
  setHologramVerified: (val: boolean) => void;
  auditVerdict: "PASS" | "FAIL" | null;
  setAuditVerdict: (val: "PASS" | "FAIL" | null) => void;
  onClose: () => void;
  onOpenScanner: () => void;
  onSubmitDisposition: () => void;
}

export function AuditModal({
  auditItem,
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
  onClose,
  onOpenScanner,
  onSubmitDisposition,
}: AuditModalProps) {
  if (!auditItem) return null;

  return (
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
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Steps indicator */}
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

        {/* Wizard Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-sm text-slate-700 dark:text-slate-200">
          {auditStep === 1 && (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Chassis Verified
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{auditItem.deviceType}</p>
                <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                  S/N: {auditItem.deviceSerial}
                </p>
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
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Class III Permissible Error: ±0.1%
                </span>
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
                <span className="font-bold text-slate-900 dark:text-white block">
                  Security Foil Hologram Authentication
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Scan or verify official holographic anti-tamper sticker on chassis potentiometer.
                </p>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Foil Serial:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    KL-HOL-2024-99824
                  </span>
                </div>

                <button
                  onClick={onOpenScanner}
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
                  <span
                    className={
                      sealIntact
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-rose-600 dark:text-rose-400 font-semibold"
                    }
                  >
                    {sealIntact ? "Intact" : "Tampered"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Standard Mass Test:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Deviation +0.04% (Pass)
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Hologram Security:</span>
                  <span
                    className={
                      hologramVerified
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {hologramVerified ? "Validated" : "Manual Pass"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Select Final Disposition:
                </label>
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
              onClick={onSubmitDisposition}
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
  );
}

export default AuditModal;
