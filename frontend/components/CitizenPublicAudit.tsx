"use client";

import React, { useState } from 'react';
import { QrCode, Search, ShieldCheck } from 'lucide-react';

export default function CitizenPublicAudit() {
    const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
    const [inputValue, setInputValue] = useState('');

    // Smart Input Detection Logic
    const getHelperText = () => {
        if (!inputValue) return "Enter an ID to auto-detect format.";

        const upperVal = inputValue.toUpperCase();

        if (upperVal.startsWith('HL-')) {
            return "Searching by Hologram ID...";
        }
        if (inputValue.length > 15 || /^[0-9a-f]{8}-/i.test(inputValue)) {
            return "Searching by Digital Token...";
        }
        return "Searching by Device Serial Number...";
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden font-sans">
            {/* Header Section */}
            <div className="p-8 pb-6 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Citizen Public Audit</h2>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                    Instantly verify the statutory calibration and 3-layer anti-fraud hardware binding of any commercial weighing scale.
                </p>
            </div>

            {/* Tabs */}
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

            {/* Tab Content */}
            <div className="border-t border-slate-100 p-8">

                {/* SCANNER TAB */}
                {activeTab === 'scan' && (
                    <div className="animate-in fade-in duration-300 max-w-md mx-auto space-y-4">
                        {/* The Light Theme "Frosted Glass" Scanner Box */}
                        <div className="bg-slate-50 shadow-inner rounded-2xl p-8 flex flex-col items-center justify-center border border-slate-200 min-h-[260px]">
                            <div className="w-48 h-48 border-2 border-dashed border-emerald-500 rounded-xl relative flex items-center justify-center bg-white/60">
                                <QrCode className="w-10 h-10 text-emerald-600 opacity-40" />
                            </div>
                            <p className="text-sm text-slate-500 mt-6 font-medium">
                                Align the Holographic QR sticker inside the frame
                            </p>
                        </div>

                        <button className="w-full h-12 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <QrCode className="w-5 h-5" /> Simulate Successful QR Scan
                        </button>
                    </div>
                )}

                {/* MANUAL LOOKUP TAB */}
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
                                disabled={!inputValue}
                                className="h-12 px-8 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Verify
                            </button>
                        </div>

                        {/* Smart Helper Text */}
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