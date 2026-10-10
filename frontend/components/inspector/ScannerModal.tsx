import React from "react";
import {
  X,
  Zap,
  Crosshair,
  Scale,
  QrCode,
  Check,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanMode: "hologram" | "qr" | "serial" | "ocr";
  setScanMode: (mode: "hologram" | "qr" | "serial" | "ocr") => void;
  torchActive: boolean;
  setTorchActive: (val: boolean) => void;
  simulatedDetection: boolean;
  setSimulatedDetection: (val: boolean) => void;
  onApplyToAudit: () => void;
}

export function ScannerModal({
  isOpen,
  onClose,
  scanMode,
  setScanMode,
  torchActive,
  setTorchActive,
  simulatedDetection,
  setSimulatedDetection,
  onApplyToAudit,
}: ScannerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between max-w-md mx-auto overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-white z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            Field Optical Scanner
          </span>
          <span className="text-[11px] text-slate-300 font-mono">
            {scanMode === "hologram" && "Target: 3-Layer Foil Hologram"}
            {scanMode === "qr" && "Target: DataMatrix / Serial QR"}
            {scanMode === "serial" && "Target: Metal Stamping Serial Tag"}
            {scanMode === "ocr" && "Target: Digital Seven-Segment Scale"}
          </span>
        </div>

        <button
          onClick={() => setTorchActive(!torchActive)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            torchActive
              ? "bg-amber-400 text-black shadow-lg shadow-amber-400/50"
              : "bg-white/10 text-white"
          }`}
          title="Toggle Flash Torch"
        >
          <Zap className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Selectors */}
      <div className="px-4 z-10">
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-1 flex items-center justify-between border border-white/10 text-[11px]">
          <button
            onClick={() => setScanMode("hologram")}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              scanMode === "hologram"
                ? "bg-emerald-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Foil Hologram
          </button>
          <button
            onClick={() => setScanMode("qr")}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              scanMode === "qr"
                ? "bg-emerald-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Digital QR
          </button>
          <button
            onClick={() => setScanMode("serial")}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              scanMode === "serial"
                ? "bg-emerald-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Serial Tag
          </button>
          <button
            onClick={() => setScanMode("ocr")}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              scanMode === "ocr"
                ? "bg-emerald-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Scale OCR
          </button>
        </div>
      </div>

      {/* Reticle Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center px-6 my-2">
        {torchActive && <div className="absolute inset-0 bg-amber-100/10 pointer-events-none" />}

        <div className="w-full max-w-[290px] aspect-square relative rounded-2xl border-2 border-emerald-500/40 bg-slate-900/30 overflow-hidden backdrop-blur-[2px]">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <Crosshair className="w-12 h-12 text-emerald-400" />
          </div>

          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scanline" />

          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
            {scanMode === "hologram" && (
              <div
                className={`w-36 h-36 rounded-xl border border-white/30 shadow-2xl flex flex-col items-center justify-center p-2 text-center transition-all duration-500 ${
                  simulatedDetection
                    ? "holographic-foil border-emerald-400 ring-4 ring-emerald-400/40"
                    : "bg-slate-800/80 border-slate-600"
                }`}
              >
                <Scale className="w-8 h-8 text-amber-200 mb-1" />
                <span className="text-[9px] font-bold tracking-wider text-white uppercase font-mono">
                  Govt of Kerala
                </span>
                <span className="text-[10px] font-black text-amber-100 font-mono tracking-tight">
                  HOL-KL-2024-99824
                </span>
                <span className="text-[8px] text-emerald-100 font-semibold mt-1">
                  3-Layer Security Foil
                </span>
              </div>
            )}

            {scanMode === "qr" && (
              <div className="w-36 h-36 bg-white rounded-xl p-3 flex flex-col items-center justify-center text-slate-900 shadow-xl">
                <QrCode className="w-20 h-20 text-slate-900" />
                <span className="text-[9px] font-mono font-bold mt-1">MAAN:2024:7741</span>
              </div>
            )}

            {scanMode === "serial" && (
              <div className="w-44 h-24 bg-gradient-to-r from-slate-400 to-slate-300 rounded-lg border-2 border-slate-500 p-2 text-slate-900 flex flex-col justify-between font-mono shadow-xl">
                <div className="text-[9px] font-bold">LEGAL METROLOGY STAMP</div>
                <div className="text-xs font-black tracking-widest">ESS-2023-KKD-9812</div>
                <div className="text-[8px] text-slate-700">CLASS III • Max 30kg • e=5g</div>
              </div>
            )}

            {scanMode === "ocr" && (
              <div className="w-40 h-20 bg-black rounded-lg border-2 border-slate-700 p-2 flex items-center justify-center font-mono text-emerald-400 shadow-xl">
                <span className="text-2xl font-black tracking-wider">05.002 kg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Result / Status */}
      <div className="p-4 bg-gradient-to-t from-black via-black/95 to-transparent space-y-3 z-10">
        {simulatedDetection ? (
          <div className="bg-emerald-950/90 border border-emerald-400/50 rounded-2xl p-3.5 space-y-2 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Target Cryptographically Validated
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    Seal ID: KL-HOL-2024-99824 • Intact
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-400/40">
                MATCH: 99.4%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onApplyToAudit}
                className="h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply to Audit</span>
              </button>

              <button
                onClick={() => setSimulatedDetection(false)}
                className="h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rescan Target</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 space-y-2">
            <p className="text-xs text-slate-400">
              Align camera frame with official foil hologram or calibration stamp tag...
            </p>
            <div className="flex items-center justify-center space-x-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Reticle Tracking Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScannerModal;
