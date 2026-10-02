'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Scale, 
  QrCode, 
  Building2, 
  ArrowRight, 
  Search, 
  Smartphone,
  Calculator
} from 'lucide-react';

export default function Home() {
  const [searchToken, setSearchToken] = useState('');
  
  // Interactive Live MPE Calculator State
  const [loadKg, setLoadKg] = useState<number>(10);
  const [scaleIntervalG, setScaleIntervalG] = useState<number>(5);
  const [accuracyClass, setAccuracyClass] = useState<string>('III');
  const [indicatedKg, setIndicatedKg] = useState<number>(10.002);
  const [deltaLG, setDeltaLG] = useState<number>(1.5);

  // Calculate MPE on the fly
  const loadInE = (loadKg * 1000) / scaleIntervalG;
  let baseMpeE = 0.5;
  if (accuracyClass === 'III') {
    if (loadInE <= 500) baseMpeE = 0.5;
    else if (loadInE <= 2000) baseMpeE = 1.0;
    else baseMpeE = 1.5;
  } else if (accuracyClass === 'II') {
    if (loadInE <= 5000) baseMpeE = 0.5;
    else if (loadInE <= 20000) baseMpeE = 1.0;
    else baseMpeE = 1.5;
  }
  // Field inspection multiplier is 2x
  const effectiveMpeG = baseMpeE * 2.0 * scaleIntervalG;
  
  // Turning Point true error: P = I + 0.5e - delta_l
  const pIndicatedG = (indicatedKg * 1000) + (0.5 * scaleIntervalG) - deltaLG;
  const errorG = pIndicatedG - (loadKg * 1000);
  const isCompliant = Math.abs(errorG) <= effectiveMpeG;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans">
      
      {/* Top Gov Banner */}
      <div className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 py-1.5 px-4 text-center tracking-wide">
        Ministry of Consumer Affairs, Food & Public Distribution • Legal Metrology Division • Govt. of India
      </div>

      {/* Navigation Bar */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl shadow-lg shadow-emerald-950 text-white">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">M.A.A.N.</span>
              <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                मान
              </span>
            </div>
            <p className="text-xs text-slate-400">Metrological Assurance, Authentication & Network</p>
          </div>
        </div>

        <nav className="flex items-center space-x-3 text-xs">
          <Link 
            href="/verify/demo-hash-123" 
            className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
          >
            Citizen Audit
          </Link>
          <Link 
            href="/portal" 
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-950 transition flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Trader Portal</span>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statutory Engine for Legal Metrology Act, 2009 & General Rules, 2011</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Eliminate Scale Tampering. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Assure Every Gram & Milliliter.
          </span>
        </h1>

        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          M.A.A.N. bridges physical calibration with digital trust through automated 
          Seventh Schedule MPE tolerance curves, 3-layer anti-fraud hardware binding, and zero-app citizen audits.
        </p>

        {/* Quick QR / Token Search */}
        <div className="max-w-xl mx-auto mt-6">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchToken.trim()) {
                window.location.href = `/verify/${encodeURIComponent(searchToken.trim())}`;
              }
            }}
            className="flex items-center gap-2 p-1.5 bg-slate-800/90 border border-slate-700 rounded-2xl shadow-xl focus-within:border-emerald-500 transition"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              placeholder="Enter Hologram ID, Serial No, or QR Token (e.g. demo-hash-123)"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              className="bg-transparent flex-1 px-2 py-2 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <span>Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-left mt-2 px-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Try sample token:</span>
            <Link href="/verify/demo-hash-123" className="text-emerald-400 hover:underline font-mono">
              demo-hash-123
            </Link>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Citizen Verification Card */}
          <Link 
            href="/verify/demo-hash-123"
            className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-emerald-500 hover:bg-slate-800 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                Citizen Public Audit
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan QR sticker on any commercial scale or fuel pump. Instantly verify 3-layer binding without installing any app.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition">
              <span>View Verification UI</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Trader Portal Card */}
          <Link 
            href="/portal"
            className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-blue-500 hover:bg-slate-800 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">
                Trader Self-Service
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Declare assets, monitor Rule 27 statutory cadences (12m/24m), and generate automated Eleventh Schedule e-Challans.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-blue-400 group-hover:translate-x-1 transition">
              <span>Open Merchant Desk</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* LMO Inspector App Card */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                LMO Field Mobile Client
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Offline-first Flutter client for Legal Metrology Officers. Capture chassis OCR, foil holograms, and turning point data in the field.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
                Flutter • Hive • ML Kit
              </span>
              <span className="text-amber-400 font-semibold">Active in /lmo_app</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Seventh Schedule MPE Live Sandbox */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Seventh Schedule Table 20 MPE Engine (Interactive Simulator)
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-rounding error formula: P = I + 0.5e - ΔL • Legal Metrology (General) Rules, 2011
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-emerald-950 border border-emerald-800 text-emerald-400 px-2.5 py-1 rounded-full">
              Field 2x MPE Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Accuracy Class</label>
              <select
                value={accuracyClass}
                onChange={(e) => setAccuracyClass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              >
                <option value="III">Class III (Medium / Retail)</option>
                <option value="II">Class II (High / Lab)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Standard Test Load (L in kg)</label>
              <input
                type="number"
                step="0.5"
                value={loadKg}
                onChange={(e) => setLoadKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Verification Interval (e in grams)</label>
              <input
                type="number"
                step="1"
                value={scaleIntervalG}
                onChange={(e) => setScaleIntervalG(parseFloat(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Indicated Reading (I in kg)</label>
              <input
                type="number"
                step="0.001"
                value={indicatedKg}
                onChange={(e) => setIndicatedKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Turning Point Weights (ΔL in grams)</label>
              <input
                type="number"
                step="0.1"
                value={deltaLG}
                onChange={(e) => setDeltaLG(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className={`p-3 rounded-xl border flex flex-col justify-between ${isCompliant ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300' : 'bg-red-950/40 border-red-700/60 text-red-300'}`}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider">Statutory Result</span>
                <div className="text-lg font-black mt-0.5">{isCompliant ? 'PASS (COMPLIANT)' : 'FAIL (EXCEEDS MPE)'}</div>
              </div>
              <div className="text-[11px] mt-2 text-slate-300">
                True Error: <strong className="font-mono">{errorG.toFixed(2)} g</strong> | Limit: <strong className="font-mono">±{effectiveMpeG.toFixed(2)} g</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 pt-12 pb-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          M.A.A.N. Regulatory Operating System • Team Tech Titans, NIT Calicut
        </div>
        <div className="flex items-center space-x-4">
          <span>Legal Metrology Act, 2009</span>
          <span>•</span>
          <span>General Rules, 2011</span>
          <span>•</span>
          <span>SIH 2026</span>
        </div>
      </footer>

    </main>
  );
}