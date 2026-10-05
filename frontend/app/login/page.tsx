"use client";

import React, { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'; // 1. Import the Next.js router

export default function TraderLogin() {
  const router = useRouter(); // 2. Initialize the router
  
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [authMode, setAuthMode] = useState<'gstin' | 'aadhaar'>('gstin');
  const [inputValue, setInputValue] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowOtpForm(true);
    }, 1500);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // 3. Swap the alert for actual page navigation
      router.push('/dashboard'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        
        {!showOtpForm && (
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 mb-8">
            <button 
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'signin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'register' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
              }`}
            >
              Register Business
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            {showOtpForm ? 'Verify OTP' : (activeTab === 'signin' ? 'Trader / Shop Access' : 'New Registration')}
          </h2>
          <p className="text-sm text-slate-500">
            {showOtpForm 
              ? `We've sent a 6-digit secure code to ${inputValue}.`
              : (activeTab === 'signin' 
                ? 'Secure access for traders and shop owners to register scales, view notices, and pay e-Challans.'
                : 'Initiate a new Legal Metrology registration for your business or shop.')}
          </p>
        </div>

        {showOtpForm ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Secure OTP
              </label>
              <input 
                type="text" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                placeholder="0 0 0 0 0 0" 
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              />
            </div>

            <button 
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full h-12 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
            </button>

            <button
              onClick={() => {
                setShowOtpForm(false);
                setOtp('');
              }}
              className="w-full mt-2 text-sm font-medium text-slate-500 hover:text-zinc-900 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to edit number
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 mb-4">
              <button 
                onClick={() => setAuthMode('gstin')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'gstin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
                }`}
              >
                Registered GSTIN
              </button>
              <button 
                onClick={() => setAuthMode('aadhaar')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'aadhaar' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
                }`}
              >
                Aadhaar (Micro-Vendor)
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                {authMode === 'gstin' ? 'Registered GSTIN' : 'Aadhaar / Mobile Number'}
              </label>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={authMode === 'gstin' ? 'e.g. 29GGGGG1314R9Z6' : 'Enter 12-digit Aadhaar or Mobile'} 
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              />
            </div>

            <button 
              onClick={handleSendOtp}
              disabled={!inputValue || isSending}
              className="w-full h-12 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Secure OTP'}
            </button>

            <div className="mt-6 pt-4">
              <button className="w-full h-11 bg-white border border-slate-200 text-emerald-700 rounded-xl font-medium text-sm hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center justify-center gap-2">
                VLE / Agent Login via Digital Seva
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}