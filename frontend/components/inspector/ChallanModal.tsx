import React from "react";
import { InspectionItem, ChallanData, OFFENSES } from "@/lib/data";
import {
  Gavel,
  X,
  Scale,
  QrCode,
  Printer,
  Share2,
} from "lucide-react";

interface ChallanModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedChallan: ChallanData | null;
  queue: InspectionItem[];
  selectedTraderId: string;
  setSelectedTraderId: (id: string) => void;
  selectedOffenses: string[];
  toggleOffense: (id: string) => void;
  seizeInstrument: boolean;
  setSeizeInstrument: (val: boolean) => void;
  challanNotes: string;
  setChallanNotes: (notes: string) => void;
  fineAmount: number;
  onGenerateChallan: () => void;
  onPrint: () => void;
  onSendSMS: () => void;
}

export function ChallanModal({
  isOpen,
  onClose,
  generatedChallan,
  queue,
  selectedTraderId,
  setSelectedTraderId,
  selectedOffenses,
  toggleOffense,
  seizeInstrument,
  setSeizeInstrument,
  challanNotes,
  setChallanNotes,
  fineAmount,
  onGenerateChallan,
  onPrint,
  onSendSMS,
}: ChallanModalProps) {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
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
                  onClick={onPrint}
                  className="h-11 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 border border-slate-200 dark:border-slate-700"
                >
                  <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Print Thermal</span>
                </button>
                <button
                  onClick={onSendSMS}
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
                            <span className="font-bold text-rose-700 dark:text-rose-300 text-[11px]">
                              {off.section}
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                              ₹{off.penalty}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                            {off.label}
                          </p>
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
                  <span className="font-bold block text-slate-900 dark:text-white">
                    Execute Seizure under Section 15
                  </span>
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
                onClick={onGenerateChallan}
                className="w-full h-12 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/40 transition-all active:scale-98"
              >
                <Gavel className="w-4 h-4" />
                <span>Issue & Sign Spot e-Challan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallanModal;
