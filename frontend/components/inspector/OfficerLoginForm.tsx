import React from "react";
import {
  KeyRound,
  Fingerprint,
  Smartphone,
  AlertCircle,
  BadgeCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface OfficerLoginFormProps {
  authMethod: "PIN" | "BIOMETRIC" | "OTP";
  setAuthMethod: (method: "PIN" | "BIOMETRIC" | "OTP") => void;
  badgeId: string;
  setBadgeId: (val: string) => void;
  pin: string;
  setPin: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  errorMessage: string | null;
  successStep: boolean;
  onVerifyCredential: (e?: React.FormEvent) => void;
  onBiometricAuth: () => void;
}

export function OfficerLoginForm({
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
  onVerifyCredential,
  onBiometricAuth,
}: OfficerLoginFormProps) {
  return (
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
        <form onSubmit={onVerifyCredential} className="space-y-4">
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
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
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
              onClick={onBiometricAuth}
              disabled={isLoading || successStep}
              className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-950 border-2 border-emerald-500/50 hover:border-emerald-500 flex flex-col items-center justify-center space-y-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 shadow-sm shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all group"
            >
              <Fingerprint
                className={`w-12 h-12 ${isLoading ? "animate-pulse text-emerald-500" : ""}`}
              />
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
              Sent to government registered SIM ending in{" "}
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                **408
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onVerifyCredential}
            disabled={isLoading || successStep}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm text-xs uppercase tracking-wider"
          >
            {successStep ? "OTP Verified • Redirecting..." : "Submit OTP Verification"}
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
  );
}

export default OfficerLoginForm;
