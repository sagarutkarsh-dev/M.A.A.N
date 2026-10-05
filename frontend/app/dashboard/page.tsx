"use client";

import React from 'react';
import { Scale, ShieldCheck, FileText, AlertCircle, LogOut, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Top Bar */}
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                        <Scale className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight text-zinc-900">Merchant Desk</span>
                        <span className="block text-xs text-slate-500">Kerala Supermart (GSTIN: 32AABCK9182Z1ZU)</span>
                    </div>
                </div>

                <Link
                    href="/login"
                    className="flex items-center text-sm font-medium text-slate-600 hover:text-red-600 transition-colors bg-slate-100 px-4 py-2 rounded-xl"
                >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                </Link>
            </nav>

            {/* Main Dashboard Content */}
            <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6">

                {/* Status Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900">All Weighing Scales Compliant</h2>
                            <p className="text-sm text-emerald-700">3-layer hardware binding active. Next statutory calibration due in Dec 2027.</p>
                        </div>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                        <PlusCircle className="w-4 h-4" /> Register New Scale
                    </button>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Registered Scales */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-slate-500">Registered Scales</span>
                            <Scale className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="text-3xl font-bold text-zinc-900 mb-1">2 Units</div>
                        <p className="text-xs text-slate-500">Active IoT anti-fraud binding verified</p>
                    </div>

                    {/* Card 2: Statutory Notices */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-slate-500">Pending e-Challans</span>
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="text-3xl font-bold text-zinc-900 mb-1">0 Active</div>
                        <p className="text-xs text-slate-500">No rule violations flagged by LMO</p>
                    </div>

                    {/* Card 3: Certificates */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-slate-500">Legal Certificates</span>
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-zinc-900 mb-1">Verified</div>
                        <p className="text-xs text-slate-500">Seventh Schedule MPE curves compliant</p>
                    </div>

                </div>

            </main>
        </div>
    );
}