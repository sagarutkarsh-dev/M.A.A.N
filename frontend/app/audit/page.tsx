"use client";

import React from 'react';
import { Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CitizenPublicAudit from '../../components/CitizenPublicAudit';

export default function CitizenAuditPage() {
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
        <CitizenPublicAudit />
      </main>
    </div>
  );
}
