import React from "react";
import Link from "next/link";
import { Camera, QrCode, ArrowLeft, Bell, ShieldCheck } from "lucide-react";

interface BottomNavProps {
  unreadDirectivesCount: number;
  onOpenScanner: () => void;
  onOpenDirectives: () => void;
}

export function BottomNav({
  unreadDirectivesCount,
  onOpenScanner,
  onOpenDirectives,
}: BottomNavProps) {
  return (
    <>
      {/* Floating Camera Scanner (FAB) */}
      <div className="fixed bottom-5 inset-x-0 max-w-md mx-auto px-4 pointer-events-none z-30">
        <div className="pointer-events-auto flex justify-center">
          <button
            onClick={onOpenScanner}
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
        <Link
          href="/"
          className="flex flex-col items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </Link>
        <button
          onClick={onOpenDirectives}
          className="flex flex-col items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative"
        >
          <Bell className="w-4 h-4 mb-0.5" />
          <span>Directives</span>
          {unreadDirectivesCount > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>
        <Link
          href="/audit"
          className="flex flex-col items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 mb-0.5" />
          <span>Verify</span>
        </Link>
      </div>
    </>
  );
}

export default BottomNav;
