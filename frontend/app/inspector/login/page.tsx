"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  BadgeCheck,
  KeyRound,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
} from "lucide-react";

export default function InspectorLoginPage() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [authMethod, setAuthMethod] = useState<"PIN" | "BIOMETRIC" | "OTP">("PIN");
  const [badgeId, setBadgeId] = useState("LMO-KL-408");
  const [pin, setPin] = useState("772910");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successStep, setSuccessStep] = useState(false);

  // Initialize theme from localStorage or default dark
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

  // Authentication submission handler
  const handleVerifyCredential = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!badgeId.trim()) {
      setErrorMessage("Please enter your Officer Service ID / Badge Number.");
      return;
    }

    if (authMethod === "PIN" && !pin.trim()) {
      setErrorMessage("Please enter your secure access PIN or passphrase.");
      return;
    }

    setIsLoading(true);

    // Simulate authentic government clearance handshake
    setTimeout(() => {
      setIsLoading(false);
      setSuccessStep(true);

      setTimeout(() => {
        router.push("/inspector");
      }, 700);
    }, 1100);
  };

  // Biometric 1-tap fast verify
  const handleBiometricAuth = () => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessStep(true);
      setTimeout(() => {
        router.push("/inspector");
      }, 700);
    }, 900);
  };

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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>TLS 1.3 SECURE</span>
            </div>

            {/* Sun / Moon Theme Toggle */}
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

        {/* Main Container */}
        <main className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center my-4 z-10 space-y-6">
          {/* Top Branding Card */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-xl shadow-emerald-500/20 border border-emerald-400/40 relative">
              <ShieldCheck className="w-9 h-9 text-slate-950" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <span className="text-[7px] text-slate-950 font-black">★</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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

          {/* High-Contrast Form Container (bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm) */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-2xl backdrop-blur-md space-y-5 transition-colors">
            {/* Method Switcher Pills */}
            <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors">
              <button
                type="button"
                onClick={() => setAuthMethod("PIN")}
                className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all ${
                  authMethod === "PIN"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>PIN Pass</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod("BIOMETRIC")}
                className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all ${
                  authMethod === "BIOMETRIC"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Biometric</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod("OTP")}
                className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all ${
                  authMethod === "OTP"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Gov OTP</span>
              </button>
            </div>

            {/* Form Error Banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-600/50 rounded-2xl text-xs text-rose-800 dark:text-rose-200 flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form: Badge + PIN */}
            {authMethod === "PIN" && (
              <form onSubmit={handleVerifyCredential} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Officer Service ID / Badge Number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      placeholder="e.g. LMO-KL-408"
                      className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors uppercase tracking-wider"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800/80 px-2 py-0.5 rounded">
                      ZONE-03
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Secure Gov Access PIN / Passphrase</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter 6-digit Officer PIN"
                      className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || successStep}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm shadow-emerald-500/20 transition-all text-xs uppercase tracking-wider active:scale-98 disabled:opacity-75 disabled:cursor-wait mt-2"
                >
                  {successStep ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-slate-950 animate-bounce" />
                      <span>Credentials Approved • Routing...</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying with Metrology HSM...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Officer Credential</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Form: Biometric Simulation */}
            {authMethod === "BIOMETRIC" && (
              <div className="text-center space-y-4 py-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Aadhaar Registered Device / FIDO2 Passkey
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Touch scanner pad or use iris biometric for Inspector #408 authentication.
                  </p>
                </div>

                <div className="flex justify-center py-2">
                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    disabled={isLoading || successStep}
                    className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-950 border-2 border-emerald-500/50 hover:border-emerald-500 flex flex-col items-center justify-center space-y-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 shadow-sm shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <Fingerprint className={`w-12 h-12 ${isLoading ? "animate-pulse text-emerald-500" : ""}`} />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white">
                      {isLoading ? "Reading..." : "Touch to Scan"}
                    </span>
                  </button>
                </div>

                {successStep ? (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center space-x-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Biometric Verified • Logging into Field Desk...</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 font-mono">
                    RD Service Status: READY (Morpho MSO-1300 E3)
                  </p>
                )}
              </div>
            )}

            {/* Form: Quick OTP Option */}
            {authMethod === "OTP" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Registered Mobile OTP (K-Gov e-Pramaan)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      maxLength={6}
                      defaultValue="842109"
                      className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-2xl px-4 py-3 text-sm font-mono text-center text-slate-900 dark:text-white tracking-[0.4em] focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => alert("OTP resent to registered mobile +91 ******408.")}
                      className="px-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold rounded-2xl text-slate-700 dark:text-slate-300"
                    >
                      Resend
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Sent to government registered SIM ending in <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">**408</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyCredential}
                  disabled={isLoading || successStep}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm shadow-emerald-500/20 text-xs uppercase tracking-wider"
                >
                  <span>Verify OTP & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Demo Pre-fill Pill */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Inspector #408 • Kozhikode South</span>
              <button
                type="button"
                onClick={() => {
                  setBadgeId("LMO-KL-408");
                  setPin("772910");
                  setAuthMethod("PIN");
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                Demo Credentials
              </button>
            </div>
          </div>

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
