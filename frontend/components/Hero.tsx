import React from 'react';
import { ShieldCheck, Search } from 'lucide-react';

export default function Hero() {
  return (
    <div>
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
    </div>
  );
}
