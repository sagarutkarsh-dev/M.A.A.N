"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, ShieldCheck } from "lucide-react";
import { useInspectorAuth } from "@/hooks/useInspectorAuth";
import { OfficerLoginForm } from "@/components/inspector/OfficerLoginForm";

export default function InspectorLoginPage() {
  const {
    isDarkMode,
    toggleTheme,
    authMethod,
    setAuthMethod,
    badgeId,
    setBadgeId,
    pin,
    setPin,
    showPassword,
    setShowPassword,
    isLoading,
    errorMessage,
    successStep,
    handleVerifyCredential,
    handleBiometricAuth,
  } = useInspectorAuth();

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden transition-colors duration-200">
        {/* Background ambient security grid */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#065f46 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />

        {/* Top Bar with back link & theme toggle */}
        <header className="max-w-md w-full mx-auto flex items-center justify-between z-10 pt-2 pb-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 px-3 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal Home</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>TLS 1.3 SECURE</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center my-4 z-10 space-y-6">
          {/* Top Branding */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-xl shadow-emerald-500/20 border border-emerald-400/40 relative">
              <ShieldCheck className="w-9 h-9 text-slate-950" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <span className="text-[7px] text-slate-950 font-black">★</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Official Enforcement Gateway</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Legal Metrology Dept
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Government of Kerala • Consumer Affairs & Metrological Assurance
              </p>
            </div>
          </div>

          {/* Modularized Officer Login Form */}
          <OfficerLoginForm
            authMethod={authMethod}
            setAuthMethod={setAuthMethod}
            badgeId={badgeId}
            setBadgeId={setBadgeId}
            pin={pin}
            setPin={setPin}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            errorMessage={errorMessage}
            successStep={successStep}
            onVerifyCredential={handleVerifyCredential}
            onBiometricAuth={handleBiometricAuth}
          />

          {/* Security Warning Notice */}
          <div className="text-center px-4">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Restricted government portal under Section 15 of Legal Metrology Act, 2009.
              Unauthorized access or spoofing is punishable under IPC & Information Technology Act.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-md w-full mx-auto text-center py-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono z-10">
          <span>National Metrological Network (M.A.A.N.) • Build v3.4.1</span>
        </footer>
      </div>
    </div>
  );
}
