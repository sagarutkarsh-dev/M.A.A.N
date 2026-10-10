import React from "react";
import { Siren, Gavel, ChevronRight } from "lucide-react";

interface EnforcementActionProps {
  onOpenChallan: () => void;
}

export function EnforcementAction({ onOpenChallan }: EnforcementActionProps) {
  return (
    <div className="pt-2">
      <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl p-4 space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center flex-shrink-0">
              <Siren className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Enforcement Quick Action
              </h3>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                Legal Metrology Act, 2009 • Section 48 Compounding
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-rose-100/80 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md font-mono font-bold">
            FORM LM-8
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Direct statutory enforcement for short-weighting, snipped lead wire seals, or unverified commercial scales.
        </p>

        <button
          onClick={onOpenChallan}
          className="w-full h-11 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs tracking-wide rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-sm"
        >
          <Gavel className="w-4 h-4 text-white" />
          <span>Issue Spot e-Challan</span>
          <ChevronRight className="w-4 h-4 text-white/80" />
        </button>
      </div>
    </div>
  );
}

export default EnforcementAction;
