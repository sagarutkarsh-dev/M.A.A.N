import React from "react";
import { DirectiveItem } from "@/lib/data";
import {
  Bell,
  X,
  Clock,
  CheckCheck,
  FileCheck2,
  Building2,
} from "lucide-react";

interface DirectivesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  directives: DirectiveItem[];
  unreadDirectivesCount: number;
  onAcknowledgeDirective: (id: string) => void;
  onViewFilteredShops: (keyword: string) => void;
}

export function DirectivesDrawer({
  isOpen,
  onClose,
  directives,
  unreadDirectivesCount,
  onAcknowledgeDirective,
  onViewFilteredShops,
}: DirectivesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Directives & Orders
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Higher Authority Dispatch Channel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Directives Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pb-1">
            <span>{directives.length} Total Directives</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">
              {unreadDirectivesCount} Action Pending
            </span>
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
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  {d.orderRef}
                </span>
              </div>

              {/* Sender */}
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs">
                  {d.senderAvatarBadge}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {d.senderTitle}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{d.senderDept}</p>
                </div>
              </div>

              {/* Subject & Body */}
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {d.subject}
              </h3>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {d.messageBody}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {d.timestamp}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {d.targetArea}
                </span>
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
                    onClick={() => onAcknowledgeDirective(d.id)}
                    className="h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow-sm active:scale-98"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                )}

                <button
                  onClick={() => onViewFilteredShops(d.filterKeyword)}
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
  );
}

export default DirectivesDrawer;
