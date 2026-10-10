import React from "react";
import Link from "next/link";
import {
  MapPin,
  Sun,
  Moon,
  Scale,
  Bell,
  RefreshCw,
  LogOut,
  Search,
  X,
} from "lucide-react";

interface InspectorHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isSyncing: boolean;
  triggerSync: () => void;
  unreadDirectivesCount: number;
  onOpenDirectives: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: "ALL" | "HIGH" | "ROUTINE";
  setActiveFilter: (filter: "ALL" | "HIGH" | "ROUTINE") => void;
  totalCount: number;
  highPriorityCount: number;
  routineCount: number;
}

export function InspectorHeader({
  isDarkMode,
  toggleTheme,
  isSyncing,
  triggerSync,
  unreadDirectivesCount,
  onOpenDirectives,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  totalCount,
  highPriorityCount,
  routineCount,
}: InspectorHeaderProps) {
  return (
    <>
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

      {/* Clean Header & Directives Bell Bar */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors">
        <div className="flex items-center justify-between">
          {/* Officer Identification Block */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300/60 dark:border-emerald-800/60 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  Inspector #408
                </h1>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md">
                  Kozhikode S.
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>LMO Desk • Sync Ready</span>
              </div>
            </div>
          </div>

          {/* Header Right Actions: Directives Bell & Sync/Logout */}
          <div className="flex items-center space-x-2">
            {/* Notification Bell */}
            <button
              onClick={onOpenDirectives}
              title="View Official Directives & Orders"
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all relative active:scale-95 shadow-sm"
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
              <RefreshCw
                className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${
                  isSyncing ? "animate-spin" : ""
                }`}
              />
            </button>

            {/* Logout link */}
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

      {/* Filter Bar: Search Box & Horizontal Pill Filters */}
      <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 transition-colors">
        {/* Search Box on top */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
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

        {/* Horizontal Pill Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === "ALL"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All ({totalCount})
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
    </>
  );
}

export default InspectorHeader;
