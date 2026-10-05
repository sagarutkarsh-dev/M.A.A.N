import React from 'react';
import Link from 'next/link';
import { Search, Store, Smartphone } from 'lucide-react';

export default function ActionCards() {
  return (
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
        <p className="text-sm text-slate-500 mb-6">Offline-first Flutter client. Capture chassis OCR, foil holograms, and turning point data in the field.</p>
        <a href="#" className="text-amber-600 text-sm font-semibold hover:text-amber-700">Download APK &rarr;</a>
      </div>

    </div>
  );
}
