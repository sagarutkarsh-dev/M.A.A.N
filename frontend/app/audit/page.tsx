"use client";

import React, { useState } from 'react';
import { Scale, QrCode, Search, ShieldCheck, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CitizenAuditPage() {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<null | 'success' | 'invalid'>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    // Simulate verification check (if query contains '123' or 'demo', pass it)
    if (query.toLowerCase().includes('123') || query.toLowerCase().includes('demo')) {
      setSearchResult('success');
    } else {
      setSearchResult('invalid');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Scale className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-bold tracking-tight text-zinc-900">M.A.A.N.</span>
        </div>
        <Link href="/" className="flex items-center text-sm font-medium text-slate-600 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
        </Link>
      </nav>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl mb-3 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Citizen Public Audit</h1>
            <p className="text-sm text-slate-500 mt-1">Instantly verify the statutory calibration and 3-layer anti-fraud hardware binding of any commercial weighing scale.</p>
            
            {/* Mode Selector Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs mx-auto mt-6 border border-slate-200">
              <button 
                onClick={() => { setActiveTab('scan'); setSearchResult(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${activeTab === 'scan' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-900'}`}
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR Code</span>
              </button>
              <button 
                onClick={() => { setActiveTab('manual'); setSearchResult(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${activeTab === 'manual' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-900'}`}
              >
                <Search className="w-4 h-4" />
                <span>Manual Lookup</span>
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8">
            
            {/* TAB 1: SCAN QR CODE */}
            {activeTab === 'scan' && (
              <div className="space-y-6 text-center">
                <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner">
                  {/* Simulated Viewfinder Target Box */}
                  <div className="w-40 h-40 border-2 border-dashed border-emerald-400 rounded-xl flex items-center justify-center animate-pulse">
                    <QrCode className="w-12 h-12 text-emerald-400/50" />
                  </div>
                  <p className="text-xs text-slate-400 mt-4">Align the Holographic QR sticker inside the frame</p>
                </div>

                <button 
                  onClick={() => setSearchResult('success')}
                  className="w-full h-12 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center space-x-2"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Simulate Successful QR Scan</span>
                </button>
              </div>
            )}

            {/* TAB 2: MANUAL LOOKUP */}
            {activeTab === 'manual' && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Hologram ID, Serial Number, or Token</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. demo-hash-123" 
                      className="flex-grow h-12 px-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <button type="submit" className="h-12 px-6 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap">
                      Verify
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Hint: Type <code className="bg-slate-100 px-1.5 py-0.5 rounded text-zinc-800">demo-hash-123</code> to test a verified result.</p>
                </div>
              </form>
            )}

            {/* VERIFICATION RESULT CARD (Appears when verified) */}
            {searchResult === 'success' && (
              <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-emerald-900">Scale Verified & Compliant</h3>
                    <p className="text-xs text-emerald-700 mt-0.5">This instrument is officially stamped under Rule 27.</p>
                    
                    <div className="mt-4 pt-4 border-t border-emerald-200/60 grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-emerald-800/70 block">Trader / Shop</span> <span className="font-semibold text-emerald-950">Sagar Supermarket</span></div>
                      <div><span className="text-emerald-800/70 block">Instrument</span> <span className="font-semibold text-emerald-950">Electronic Scale (30kg)</span></div>
                      <div><span className="text-emerald-800/70 block">LMO Inspector</span> <span className="font-semibold text-emerald-950">Officer #408 (Kozhikode)</span></div>
                      <div><span className="text-emerald-800/70 block">Valid Until</span> <span className="font-semibold text-emerald-950">October 2027</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {searchResult === 'invalid' && (
              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-red-900">Invalid or Tampered Scale</h3>
                    <p className="text-xs text-red-700 mt-0.5">No active hardware binding found for this identifier. Report this to the LMD immediately.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
