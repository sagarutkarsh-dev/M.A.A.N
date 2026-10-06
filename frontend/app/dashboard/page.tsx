"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Scale,
    ShieldCheck,
    LogOut,
    PlusCircle,
    Store,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    QrCode,
    Eye,
    Download,
    Receipt,
    Coins,
    FileText,
    Search,
    ArrowUpRight,
    Home
} from 'lucide-react';

interface InstrumentData {
    id: string;
    name: string;
    serialNo: string;
    accuracyClass: string;
    capacity: string;
    cadence: string;
    lastStamped: string;
    expiryDate: string;
    status: 'VALID' | 'DUE_SOON' | 'EXPIRED';
    hologramId: string;
}

const mockInstruments: InstrumentData[] = [
    {
        id: 'INST-001',
        name: 'Electronic Counter Scale',
        serialNo: 'SN-8839201-X',
        accuracyClass: 'Class III',
        capacity: '30 kg (e = 5g)',
        cadence: '24 Months (Biennial)',
        lastStamped: '15 Aug 2026',
        expiryDate: '14 Aug 2028',
        status: 'VALID',
        hologramId: 'HOLO-992-KRL',
    },
    {
        id: 'INST-002',
        name: 'Electronic Weighbridge',
        serialNo: 'WB-449102-M',
        accuracyClass: 'Class III',
        capacity: '50 Ton (e = 10kg)',
        cadence: '12 Months (Annual)',
        lastStamped: '10 Oct 2025',
        expiryDate: '09 Oct 2026',
        status: 'DUE_SOON',
        hologramId: 'HOLO-881-KRL',
    },
    {
        id: 'INST-003',
        name: 'Precision Lab Balance',
        serialNo: 'PB-299381-Z',
        accuracyClass: 'Class II',
        capacity: '1200 g (e = 0.01g)',
        cadence: '12 Months (Annual)',
        lastStamped: '01 Nov 2025',
        expiryDate: '31 Oct 2026',
        status: 'VALID',
        hologramId: 'HOLO-773-KRL',
    },
    {
        id: 'INST-004',
        name: 'Manual Mechanical Platform',
        serialNo: 'MP-110294-A',
        accuracyClass: 'Class III',
        capacity: '100 kg (e = 50g)',
        cadence: '24 Months (Biennial)',
        lastStamped: '20 Jul 2024',
        expiryDate: '19 Jul 2026',
        status: 'EXPIRED',
        hologramId: 'HOLO-331-KRL',
    },
];

export default function MerchantDashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [selectedInstrument, setSelectedInstrument] = useState<InstrumentData | null>(null);
    const [eChallanGenerated, setEChallanGenerated] = useState(false);

    // Filter instruments based on search and status
    const filteredInstruments = mockInstruments.filter((inst) => {
        const matchesSearch =
            inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.hologramId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            selectedStatus === 'ALL' || inst.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: InstrumentData['status']) => {
        switch (status) {
            case 'VALID':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Valid
                    </span>
                );
            case 'DUE_SOON':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Due Soon
                    </span>
                );
            case 'EXPIRED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        Expired
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">

            {/* ========================================================================= */}
            {/* LAYER 1: MINIMALIST WHITE TOP NAVIGATION                                  */}
            {/* ========================================================================= */}
            <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 sm:px-8 py-4 shadow-2xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Brand & GSTIN Subtext - Clickable to Home */}
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
                            title="Return to M.A.A.N. Home"
                        >
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-200 shadow-xs group-hover:scale-105 group-hover:bg-emerald-100 transition-all">
                                <Scale className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors">
                                        Merchant Desk
                                    </span>
                                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded border border-slate-200 uppercase tracking-wider group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                                        M.A.A.N.
                                    </span>
                                </div>
                                <span className="block text-xs font-medium text-slate-500">
                                    GSTIN: <span className="font-mono text-zinc-700 font-semibold">32AABCK9182Z1ZU</span> • Legal Metrology Act, 2009
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Action Links & Logout */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
                            title="Return to Portal Home"
                        >
                            <Home className="w-3.5 h-3.5 text-slate-500" />
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/audit"
                            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
                        >
                            Public Audit <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            href="/login"
                            className="flex items-center text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-xl shadow-2xs"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span>Logout</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ========================================================================= */}
            {/* MAIN DASHBOARD CANVAS                                                     */}
            {/* ========================================================================= */}
            <main className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8">

                {/* LAYER 1B: COMPLIANCE BANNER */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-start sm:items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-xs flex-shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-zinc-900 leading-tight">
                                    All Weighing Scales Compliant
                                </h2>
                                <span className="hidden sm:inline-flex text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                                    Rule 27 Verified
                                </span>
                            </div>
                            <p className="text-sm text-emerald-800 mt-0.5">
                                3-layer anti-fraud hardware binding active. Next statutory calibration cadence due in Dec 2027.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98] whitespace-nowrap self-start sm:self-auto"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Register New Scale</span>
                    </Link>
                </div>

                {/* ========================================================================= */}
                {/* LAYER 2: MERCHANT PROFILE CARD                                            */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                        {/* Left Profile Details */}
                        <div className="space-y-4">
                            <div className="flex items-start sm:items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                                    <Store className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                                            Kerala Supermart
                                        </h1>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            ACTIVE TRADER
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Proprietor: <strong className="text-zinc-700">Utkarsh Sagar</strong> • Commercial Food & Grain Retail
                                    </p>
                                </div>
                            </div>

                            {/* License & Jurisdiction Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider">
                                        License Number
                                    </span>
                                    <span className="font-mono font-bold text-zinc-900 text-sm mt-0.5 block">
                                        LM-KER-2024-88419
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider">
                                        Jurisdiction
                                    </span>
                                    <span className="font-semibold text-zinc-900 text-sm mt-0.5 block truncate">
                                        Circle 4, Kozhikode Urban
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider">
                                        Inspection Office
                                    </span>
                                    <span className="font-semibold text-zinc-900 text-sm mt-0.5 block">
                                        Officer #408 (Kerala LMD)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Two Distinct KPI Blocks */}
                        <div className="grid grid-cols-2 gap-4 lg:w-80 flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            {/* KPI 1: Total Instruments */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Total Instruments
                                    </span>
                                    <Scale className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="mt-3">
                                    <div className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                                        4 Units
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
                                        <span className="text-emerald-600 font-semibold">3 Active</span> • 1 In-Renewal
                                    </p>
                                </div>
                            </div>

                            {/* KPI 2: Compliance Ratio */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Compliance Ratio
                                    </span>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="mt-3">
                                    <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                                        100%
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500 mt-1">
                                        Zero Statutory Violations
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ========================================================================= */}
                {/* LAYER 3: INVENTORY TABLE (REGISTERED WEIGHTS & MEASURES)                   */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Table Header & Quick Search Bar */}
                    <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                                Registered Weights & Measures
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Statutory calibration ledger maintaining Rule 27 verification certificates and tamper-evident hardware bindings.
                            </p>
                        </div>

                        {/* Filter Controls */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search serial, model, or hologram..."
                                    className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs w-52 sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                />
                            </div>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="py-1.5 px-3 rounded-xl border border-slate-300 text-xs bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                            >
                                <option value="ALL">All Status</option>
                                <option value="VALID">Valid</option>
                                <option value="DUE_SOON">Due Soon</option>
                                <option value="EXPIRED">Expired</option>
                            </select>
                        </div>
                    </div>

                    {/* 7-Column Responsive Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold">
                                    <th className="py-3.5 px-5">Instrument / Serial</th>
                                    <th className="py-3.5 px-5">Class / Capacity</th>
                                    <th className="py-3.5 px-5">Statutory Cadence</th>
                                    <th className="py-3.5 px-5">Last Stamped</th>
                                    <th className="py-3.5 px-5">Expiry Date</th>
                                    <th className="py-3.5 px-5">Status</th>
                                    <th className="py-3.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-zinc-800">
                                {filteredInstruments.length > 0 ? (
                                    filteredInstruments.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/70 transition-colors group"
                                        >
                                            {/* Col 1: Instrument / Serial */}
                                            <td className="py-4 px-5">
                                                <div className="font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                                                    <span>SN: {item.serialNo}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-emerald-600 font-medium">{item.hologramId}</span>
                                                </div>
                                            </td>

                                            {/* Col 2: Class / Capacity */}
                                            <td className="py-4 px-5">
                                                <span className="font-semibold text-zinc-900 block">
                                                    {item.capacity}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {item.accuracyClass}
                                                </span>
                                            </td>

                                            {/* Col 3: Statutory Cadence */}
                                            <td className="py-4 px-5 text-xs text-slate-600 font-medium">
                                                {item.cadence}
                                            </td>

                                            {/* Col 4: Last Stamped */}
                                            <td className="py-4 px-5 text-xs font-medium text-slate-600">
                                                {item.lastStamped}
                                            </td>

                                            {/* Col 5: Expiry Date */}
                                            <td className="py-4 px-5 text-xs font-semibold text-zinc-900">
                                                {item.expiryDate}
                                            </td>

                                            {/* Col 6: Status Pill Badge */}
                                            <td className="py-4 px-5">
                                                {getStatusBadge(item.status)}
                                            </td>

                                            {/* Col 7: Actions */}
                                            <td className="py-4 px-5 text-right">
                                                <div className="flex items-center justify-end space-x-1.5">
                                                    <button
                                                        onClick={() => setSelectedInstrument(item)}
                                                        title="Inspect Certificate Details"
                                                        className="p-1.5 text-slate-400 hover:text-zinc-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <Link
                                                        href="/audit"
                                                        title="Verify Hologram QR Code"
                                                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => alert(`Downloading statutory calibration certificate for ${item.serialNo}...`)}
                                                        title="Download Official Stamp Certificate"
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                                            No instruments found matching &quot;{searchQuery}&quot;.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* LAYER 4: STATUTORY FEE LEDGER (ELEVENTH SCHEDULE)                         */}
                {/* ========================================================================= */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                            Eleventh Schedule Statutory Stamping Fees
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Automated statutory cadence fees prescribed under Section 24 of the Legal Metrology Act, 2009 for verification and stamping.
                        </p>
                    </div>

                    {/* Three Side-by-Side Breakdown Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1: Upcoming Renewal Fee */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Statutory Cadence
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                                        <Receipt className="w-5 h-5 text-slate-600" />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 block">
                                    Upcoming Renewal Fee
                                </span>
                                <div className="text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
                                    ₹450.00
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                                Statutory calibration fee for Class III retail scale (valid 24 months under Rule 27).
                            </p>
                        </div>

                        {/* Card 2: User Charges */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Digital Portal Charge
                                    </span>
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                                        <Coins className="w-5 h-5 text-slate-600" />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 block">
                                    User Charges
                                </span>
                                <div className="text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
                                    ₹50.00
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                                Includes tamper-evident 3-layer security hologram foil and national digital register sync.
                            </p>
                        </div>

                        {/* Card 3: Total Payable Challan (Distinctly Styled Blue Card) */}
                        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl border border-blue-800 p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
                            {/* Subtle decorative glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 px-2 py-0.5 rounded-full bg-blue-800/60 border border-blue-700">
                                        Schedule XI Challan
                                    </span>
                                    <span className="text-xs font-mono text-blue-200">
                                        Ref: CHL-2026-992
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-blue-100 block">
                                    Total Payable Challan
                                </span>
                                <div className="text-3xl font-extrabold text-white tracking-tight mt-1">
                                    ₹500.00
                                </div>
                                <p className="text-xs text-blue-200/80 mt-2">
                                    Consolidated fee for next statutory stamping cadence.
                                </p>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => setEChallanGenerated(true)}
                                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4 text-emerald-100" />
                                    <span>Generate e-Challan</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Modal: Instrument Details Viewer */}
                {selectedInstrument && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-zinc-900 text-base">
                                        {selectedInstrument.name}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedInstrument(null)}
                                    className="text-slate-400 hover:text-zinc-900 font-bold p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="py-4 space-y-3 text-xs">
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-500">Serial Number:</span>
                                    <span className="font-mono font-bold text-zinc-900">{selectedInstrument.serialNo}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-500">Hologram Token:</span>
                                    <span className="font-mono font-semibold text-emerald-700">{selectedInstrument.hologramId}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-500">Accuracy & Capacity:</span>
                                    <span className="font-medium text-zinc-900">{selectedInstrument.accuracyClass} ({selectedInstrument.capacity})</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-500">Statutory Cadence:</span>
                                    <span className="font-medium text-zinc-900">{selectedInstrument.cadence}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-500">Last Official Stamp:</span>
                                    <span className="font-medium text-zinc-900">{selectedInstrument.lastStamped}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-50">
                                    <span className="text-slate-500">Validity Expiration:</span>
                                    <span className="font-bold text-zinc-900">{selectedInstrument.expiryDate}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-500">Current Status:</span>
                                    <span>{getStatusBadge(selectedInstrument.status)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedInstrument(null)}
                                className="w-full mt-2 h-10 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors"
                            >
                                Close Inspector
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal: e-Challan Generator Confirmation */}
                {eChallanGenerated && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
                        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-zinc-900 text-lg mb-1">
                                e-Challan Generated!
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 font-mono">
                                Challan ID: CHL-2026-992-KRL (₹500.00)
                            </p>
                            <p className="text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                Forwarded to Government Gateway. You can pay via Bharatkosh or Net Banking for instant automated stamp receipt issuance.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEChallanGenerated(false)}
                                    className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Pay via Gateway
                                </button>
                                <button
                                    onClick={() => setEChallanGenerated(false)}
                                    className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}