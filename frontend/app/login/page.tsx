"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Building2, Key, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TraderAuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [step, setStep] = useState<1 | 2>(1);
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1000);
    };

    const handleVerifyLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;
        setIsLoading(true);
        setTimeout(() => {
            router.push('/register');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Two-Tier Navbar Simulation */}
            <div className="bg-emerald-900 text-white px-6 py-1.5 flex justify-between items-center text-xs font-medium">
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Department of Legal Metrology, Government of India</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                        <button className="hover:text-emerald-200">A-</button>
                        <button className="hover:text-emerald-200">A</button>
                        <button className="hover:text-emerald-200">A+</button>
                    </div>
                    <span className="opacity-50">|</span>
                    <button className="hover:text-emerald-200">English ▾</button>
                </div>
            </div>

            <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 leading-none">M.A.A.N.</h1>
                        <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">Digital Metrology Engine</p>
                    </div>
                </div>
                <Link href="/" className="flex items-center text-sm font-medium text-slate-600 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
                </Link>
            </nav>

            {/* Auth Container */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8">

                        {/* Register / Login Tabs */}
                        <div className="flex p-1 bg-slate-100 rounded-xl mb-8 border border-slate-200">
                            <button
                                onClick={() => { setActiveTab('login'); setStep(1); }}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setActiveTab('register'); setStep(1); }}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'register' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'}`}
                            >
                                Register Business
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                            {activeTab === 'login' ? 'Merchant Desk Login' : 'New Registration'}
                        </h2>
                        <p className="text-sm text-slate-500 mb-8">
                            {activeTab === 'login'
                                ? 'Secure access to register scales, view notices, and pay e-Challans.'
                                : 'Initiate a new Legal Metrology registration via GSTIN validation.'}
                        </p>

                        {/* STEP 1: Enter Identifier */}
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-5 animate-in fade-in duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-900">
                                        {activeTab === 'login' ? 'Registered GSTIN or Mobile' : 'Enter GSTIN to Verify'}
                                    </label>
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder={activeTab === 'login' ? "e.g. 9876543210" : "e.g. 29GGGGG1314R9Z6"}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !identifier}
                                    className="w-full h-11 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Secure OTP'}
                                </button>
                            </form>
                        )}

                        {/* STEP 2: Enter OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-2">
                                    <p className="text-xs text-emerald-800">
                                        A 6-digit verification code has been sent to the contact associated with <strong>{identifier}</strong>.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-900">Enter OTP</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="• • • • • •"
                                            maxLength={6}
                                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 bg-white text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length < 4}
                                    className="w-full h-11 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center disabled:opacity-70 shadow-sm"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Proceed'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-xs text-slate-500 hover:text-zinc-900 font-medium mt-2"
                                >
                                    Change identifier
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            Govt. of India | Electronic metrology framework
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}