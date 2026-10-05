"use client";

import React, { useState } from 'react';
import { QrCode, Search, ShieldCheck, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function CitizenPublicAudit() {
    const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
    const [inputValue, setInputValue] = useState('');

    // New state variables for the verification flow
    const [isVerifying, setIsVerifying] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Smart Input Detection Logic
    const getHelperText = () => {
        if (!inputValue) return "Enter an ID to auto-detect format.";
        const upperVal = inputValue.toUpperCase();
        if (upperVal.startsWith('HL-')) return "Searching by Hologram ID...";
        if (inputValue.length > 15 || /^[0-9a-f]{8}-/i.test(inputValue)) return "Searching by Digital Token...";
        return "Searching by Device Serial Number...";
    };

    // Mock Database Fetch
    const handleVerify = () => {
        setIsVerifying(true);
        // Simulate a 1.5-second network request to your backend
        setTimeout(() => {
            setIsVerifying(false);
            setShowResult(true);
        }, 1500);
    };

    const resetAudit = () => {
        setShowResult(false);
        setInputValue('');
    };

    // SUCCESS STATE UI
    if (showResult) {
        return (
            <div className="w-full bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden font-sans p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-1">Scale Verified</h2>
                    <p className="text-sm text-emerald-600 font-medium mb-6">Hardware Binding Authentic</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3 mb-6 text-sm">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Merchant</span>
                        <span className="font-semibold text-zinc-900">Kerala Supermart, Kozhikode</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Calibration Valid Till</span>
                        <span className="font-semibold text-zinc-900">15 Dec 2027</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Inspecting LMO</span>
                        <span className="font-semibold text-zinc-900">Circle 4 - Kerala Legal Metrology</span>
                    </div>
                </div>

                <button
                    onClick={resetAudit}
                    className="w-full h-12 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Scan Another Scale
                </button>
            </div>
        );
    }

    // DEFAULT SEARCH UI
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden font-sans">
            <div className="p-8 pb-6 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Citizen Public Audit</h2>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                    Instantly verify the statutory calibration and 3-layer anti-fraud hardware binding of any commercial weighing scale.
                </p>
            </div>

            <div className="px-8 pb-6">
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 max-w-md mx-auto">
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'scan' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
                            }`}
                    >
                        <QrCode className="w-4 h-4" /> Scan QR Code
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
                            }`}
                    >
                        <Search className="w-4 h-4" /> Manual Lookup
                    </button>
                </div>
            </div>

            <div className="border-t border-slate-100 p-8">
                {activeTab === 'scan' && (
                    <div className="animate-in fade-in duration-300 max-w-md mx-auto space-y-4">
                        <div className="bg-slate-50 shadow-inner rounded-2xl p-8 flex flex-col items-center justify-center border border-slate-200 min-h-[260px]">
                            <div className="w-48 h-48 border-2 border-dashed border-emerald-500 rounded-xl relative flex items-center justify-center bg-white/60">
                                <QrCode className="w-10 h-10 text-emerald-600 opacity-40" />
                            </div>
                            <p className="text-sm text-slate-500 mt-6 font-medium">
                                Align the Holographic QR sticker inside the frame
                            </p>
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isVerifying}
                            className="w-full h-12 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                        >
                            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                            {isVerifying ? 'Verifying Binding...' : 'Simulate Successful QR Scan'}
                        </button>
                    </div>
                )}

                {activeTab === 'manual' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-md mx-auto py-8">
                        <label className="block text-sm font-semibold text-zinc-900 mb-2">
                            Device Identifier
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter ID from the physical sticker"
                                className="flex-1 h-12 px-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                            />
                            <button
                                onClick={handleVerify}
                                disabled={!inputValue || isVerifying}
                                className="h-12 w-28 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                            </button>
                        </div>
                        <div className="mt-3">
                            <p className="text-xs font-medium text-slate-500 transition-all duration-200">
                                {getHelperText()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}