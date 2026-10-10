import React from "react";
import { InspectionItem } from "@/lib/data";
import {
  Scale,
  MapPin,
  Calendar,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Navigation,
} from "lucide-react";

interface TraderCardProps {
  trader: InspectionItem;
  onStartAudit: (trader: InspectionItem) => void;
  onDirections: (trader: InspectionItem) => void;
}

export function TraderCard({ trader, onStartAudit, onDirections }: TraderCardProps) {
  const isAnomaly = trader.riskLevel === "HIGH";

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 transition-all shadow-sm ${
        isAnomaly
          ? "border-l-4 border-l-rose-500 bg-white dark:bg-slate-900"
          : "border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900"
      }`}
    >
      {/* Card Header Strip: Shop & Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {trader.shopName}
          </h3>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
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

      {/* Instrument & Calibration Details */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Instrument</span>
          <span className="font-mono text-slate-800 dark:text-slate-200 text-right max-w-[210px] truncate">
            {trader.deviceType}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Serial Tag</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">
            {trader.deviceSerial}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Last Calibration
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {trader.lastCalibrationDate}
            </span>
            {trader.overdueText && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700 font-medium">
                {trader.overdueText}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="text-slate-500 dark:text-slate-400">Registration</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">{trader.licenseNo}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Proximity</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{trader.distance}</span>
        </div>

        {/* Telemetry Warning */}
        {trader.riskReason && isAnomaly && (
          <div className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5 pt-1">
            <AlertOctagon className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
            <span>{trader.riskReason}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onStartAudit(trader)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-5 flex-1 font-semibold text-sm flex items-center justify-center space-x-2 transition-all active:scale-98 shadow-sm"
        >
          <Scale className="w-4 h-4 text-white" />
          <span>Start Audit</span>
        </button>

        <button
          onClick={() => onDirections(trader)}
          title={`Get GPS Directions to ${trader.shopName}`}
          className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors active:scale-98 flex-shrink-0"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default TraderCard;
