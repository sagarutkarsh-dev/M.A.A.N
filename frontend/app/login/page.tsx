"use client";

import React, { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TraderLogin() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [authMode, setAuthMode] = useState<'gstin' | 'aadhaar'>('gstin');
  const [inputValue, setInputValue] = useState('');
  
  // OTP state & Profile transfer
  const [isSending, setIsSending] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [enteredIdentifier, setEnteredIdentifier] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');

  // Validation rules
  const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const AADHAAR_REGEX = /^\d{12}$/;

  const trimmedInput = inputValue.trim();
  const isGstinValid = GSTIN_REGEX.test(trimmedInput.toUpperCase());
  const isAadhaarValid = AADHAAR_REGEX.test(trimmedInput);
  const isValid = authMode === 'gstin' ? isGstinValid : isAadhaarValid;
  const showError = trimmedInput.length > 0 && !isValid;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (authMode === 'gstin') {
      // Auto-uppercase alphanumeric GSTIN up to 15 chars
      setInputValue(val.toUpperCase().slice(0, 15));
    } else {
      // Only digits for 12-digit Aadhaar
      setInputValue(val.replace(/\D/g, '').slice(0, 12));
    }
  };

  const handleSendOtp = () => {
    if (!isValid || isSending) return;
    setIsSending(true);

    // Simulate profile lookup mapping entered GSTIN/ID to a mock registered profile
    setTimeout(() => {
      const finalId = authMode === 'gstin' ? trimmedInput.toUpperCase() : trimmedInput;
      setEnteredIdentifier(finalId);
      
      // Mock registered masked mobile number
      setMaskedPhone('+91 ******9821');

      setIsSending(false);
      setShowOtpForm(true);
    }, 1200);
  };

  const handleVerify = () => {
    if (otp.length !== 6 || isVerifying) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/dashboard');
    }, 1200);
  };

  const handleBackToEdit = () => {
    setShowOtpForm(false);
    setOtp('');
  };

  const authTypeLabel = authMode === 'gstin' ? 'GSTIN' : 'Aadhaar';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        
        {/* Top Tabs (Hidden on OTP screen) */}
        {!showOtpForm && (
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 mb-8">
            <button 
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setInputValue('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'signin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
              }`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => {
                setActiveTab('register');
                setInputValue('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'register' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
              }`}
            >
              Register Business
            </button>
          </div>
        )}

        {/* Card Header & Dynamic Subtext */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            {showOtpForm ? 'Verify OTP' : (activeTab === 'signin' ? 'Trader / Shop Access' : 'New Registration')}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {showOtpForm ? (
              <>
                We&apos;ve sent a 6-digit secure code to <span className="font-semibold text-zinc-800">{maskedPhone}</span> linked to {authTypeLabel}: <span className="font-mono font-semibold text-zinc-800">{enteredIdentifier}</span>.
              </>
            ) : (
              activeTab === 'signin' 
                ? 'Secure access for traders and shop owners to register scales, view notices, and pay e-Challans.'
                : 'Initiate a new Legal Metrology registration for your business or shop.'
            )}
          </p>
        </div>

        {/* Dynamic View: OTP Verification Form vs Input Form */}
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
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow font-mono"
              />
            </div>

            <button 
              type="button"
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full h-12 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={handleBackToEdit}
              className="w-full mt-2 text-sm font-medium text-slate-500 hover:text-zinc-900 transition-colors flex items-center justify-center gap-1.5 py-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to edit number
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            
            {/* Identity Mode Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 mb-4">
              <button 
                type="button"
                onClick={() => {
                  setAuthMode('gstin');
                  setInputValue('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'gstin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
                }`}
              >
                Registered GSTIN
              </button>
              <button 
                type="button"
                onClick={() => {
                  setAuthMode('aadhaar');
                  setInputValue('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'aadhaar' ? 'bg-white text-zinc-900 shadow-sm' : 'text-slate-500 hover:text-zinc-700'
                }`}
              >
                Aadhaar (Micro-Vendor)
              </button>
            </div>

            {/* Input Field with Inline Validation */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                {authMode === 'gstin' ? 'Registered GSTIN' : 'Aadhaar / Mobile Number'}
              </label>
              <input 
                type="text" 
                value={inputValue}
                onChange={handleInputChange}
                placeholder={authMode === 'gstin' ? 'e.g. 29GGGGG1314R9Z6' : 'Enter 12-digit Aadhaar number'} 
                className={`w-full h-12 px-4 rounded-xl border bg-white text-sm focus:outline-none transition-shadow ${
                  showError
                    ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                }`}
              />
              {showError && (
                <p className="text-xs text-red-600 font-medium mt-1.5 animate-in fade-in">
                  {authMode === 'gstin' 
                    ? 'Please enter a valid 15-character GSTIN' 
                    : 'Please enter a valid 12-digit Aadhaar number'}
                </p>
              )}
            </div>

            {/* Send OTP Action Button */}
            <button 
              type="button"
              onClick={handleSendOtp}
              disabled={!isValid || isSending}
              className="w-full h-12 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Secure OTP'}
            </button>

            {/* VLE / Agent Assisted Service */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button 
                type="button"
                className="w-full h-11 bg-white border border-slate-200 text-emerald-700 rounded-xl font-medium text-sm hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                VLE / Agent Login via Digital Seva
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}