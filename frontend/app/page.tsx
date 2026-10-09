"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, Store, Smartphone } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-8 border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Engine for Legal Metrology Act, 2009</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6">
          Eliminate Scale Tampering.<br />
          <span className="text-emerald-500">Assure Every Gram & Milliliter.</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          M.A.A.N. bridges physical calibration with digital trust through automated Seventh Schedule MPE tolerance curves, 3-layer anti-fraud hardware binding, and zero-app citizen audits.
        </p>

        {/* Unified Search/Verify Bar */}
        <div className="max-w-xl mx-auto bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center mb-16">
          <Search className="w-5 h-5 text-slate-400 ml-3" />
          <input
            type="text"
            placeholder="Enter Hologram ID, Serial No, or QR Token..."
            className="flex-grow h-12 px-4 focus:outline-none text-zinc-900 bg-transparent"
          />
          <button className="h-12 px-6 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Verify &rarr;
          </button>
        </div>

        {/* Three Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Citizen Public Audit</h3>
            <p className="text-sm text-slate-500 mb-6">Scan QR sticker on any commercial scale or fuel pump. Instantly verify 3-layer binding without installing any app.</p>
            <Link href="/audit" className="text-emerald-600 text-sm font-semibold hover:text-emerald-700">View Verification UI &rarr;</Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Trader Self-Service</h3>
            <p className="text-sm text-slate-500 mb-6">Declare assets, monitor Rule 27 statutory cadences, and generate automated e-Challans.</p>
            <Link href="/login" className="text-blue-600 text-sm font-semibold hover:text-blue-700">Open Merchant Desk &rarr;</Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-4 right-4 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Private Route</div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">LMO Field Mobile Client</h3>
            <p className="text-sm text-slate-500 mb-6">Field enforcement client. Offline-ready sync, optical reticle scanner for foil holograms, and spot e-Challans.</p>
            <Link href="/inspector" className="text-amber-600 text-sm font-semibold hover:text-amber-700">Open Field Client &rarr;</Link>
          </div>

        </div>
      </main>
    </div>
  );
}