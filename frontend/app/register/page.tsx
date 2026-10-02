"use client";

import React, { useState } from 'react';
import { Zap, MapPin, Scale, Camera, Loader2 } from 'lucide-react';

export default function TraderRegistration() {
    // This state tracks our current step in the form (1, 2, or 3)
    const [step, setStep] = useState(1);
    const [location, setLocation] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    // Form inputs state
    const [contact, setContact] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [serial, setSerial] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [businessName, setBusinessName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [category, setCategory] = useState('Retailer');
    const [appType, setAppType] = useState('New Verification');
    const [instrumentType, setInstrumentType] = useState('Electronic Weighing Scale');
    const [capacity, setCapacity] = useState('10 kg');
    const [accuracyClass, setAccuracyClass] = useState('Class III (Medium / Retail)');

    const handleDetectLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(5);
                    const lng = position.coords.longitude.toFixed(5);
                    setLocation(`Lat: ${lat}, Lng: ${lng}`);
                    setIsLocating(false);
                },
                (error) => {
                    setLocation('Location access denied or unavailable.');
                    setIsLocating(false);
                }
            );
        } else {
            setLocation('Geolocation not supported by browser.');
            setIsLocating(false);
        }
    };

    const handleNextStep2 = () => {
        if (!businessName || !ownerName || !contact || !location || location.includes('denied')) {
            setErrorMsg('Please fill out all Business Details and successfully detect Shop Location.');
            return;
        }
        setErrorMsg('');
        setStep(2);
    };

    const handleNextStep3 = () => {
        setErrorMsg('');
        setStep(3);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Top Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
                <div className="flex items-center space-x-2">
                    <Scale className="w-6 h-6 text-emerald-500" />
                    <span className="text-xl font-bold tracking-tight text-zinc-900">M.A.A.N.</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
            </nav>

            {/* Main Centered Container */}
            <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Header & Stepper */}
                    <div className="p-8 border-b border-slate-100">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Register Weighing Instrument</h1>
                        <p className="text-sm text-slate-500 mt-1">Apply for Rule 27 Stamping and Verification</p>

                        {/* Dynamic Stepper */}
                        <div className="flex items-center space-x-4 mt-6">
                            {/* Step 1 */}
                            <div className={`flex items-center space-x-2 ${step !== 1 && 'opacity-50'}`}>
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step === 1 || step > 1 ? 'bg-zinc-900 text-white' : 'bg-white border border-slate-300 text-slate-500'}`}>1</span>
                                <span className="text-sm font-medium text-zinc-900">Business Details</span>
                            </div>
                            <div className="w-8 h-px bg-slate-200"></div>

                            {/* Step 2 */}
                            <div className={`flex items-center space-x-2 ${step !== 2 && 'opacity-50'}`}>
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step === 2 || step > 2 ? 'bg-zinc-900 text-white' : 'bg-white border border-slate-300 text-slate-500'}`}>2</span>
                                <span className={`text-sm font-medium ${step === 2 ? 'text-zinc-900' : 'text-slate-500'}`}>Asset</span>
                            </div>
                            <div className="w-8 h-px bg-slate-200"></div>

                            {/* Step 3 */}
                            <div className={`flex items-center space-x-2 ${step !== 3 && 'opacity-50'}`}>
                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step === 3 ? 'bg-zinc-900 text-white' : 'bg-white border border-slate-300 text-slate-500'}`}>3</span>
                                <span className={`text-sm font-medium ${step === 3 ? 'text-zinc-900' : 'text-slate-500'}`}>Review & Pay</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Content - Dynamically rendered based on 'step' state */}
                    <div className="p-8 space-y-8">

                        {/* --- STEP 1: BUSINESS DETAILS --- */}
                        {step === 1 && (
                            <>
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Zap className="w-5 h-5 text-emerald-500" />
                                        <h2 className="text-sm font-semibold text-zinc-900">Fast-Track Registration</h2>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input type="text" placeholder="Enter GSTIN or Shop License Number" className="flex-grow h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" />
                                        <button className="h-10 px-4 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap">Auto-Fetch</button>
                                    </div>
                                    <p className="text-xs font-medium text-emerald-600 mt-2">✓ Connected to Govt. Registry</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-900">Business Name</label>
                                        <input 
                                            type="text" 
                                            value={businessName} 
                                            onChange={(e) => setBusinessName(e.target.value)} 
                                            placeholder="e.g. Sagar Supermarket" 
                                            className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-900">Owner Name</label>
                                        <input 
                                            type="text" 
                                            value={ownerName} 
                                            onChange={(e) => setOwnerName(e.target.value)} 
                                            placeholder="e.g. Utkarsh Sagar" 
                                            className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-900">Contact Number</label>
                                        <input 
                                            type="text" 
                                            value={contact} 
                                            onChange={(e) => setContact(e.target.value)} 
                                            placeholder="+91" 
                                            className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-900">Category</label>
                                        <select 
                                            value={category} 
                                            onChange={(e) => setCategory(e.target.value)} 
                                            className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                        >
                                            <option>Retailer</option>
                                            <option>Wholesaler</option>
                                            <option>Packer</option>
                                        </select>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-900">Shop Location (For LMO Field Visit)</label>
                                        <div 
                                            onClick={!location ? handleDetectLocation : undefined}
                                            className={`w-full h-32 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                                                location && !location.includes('denied') 
                                                    ? 'bg-emerald-50 border-emerald-300 border-solid' 
                                                    : 'bg-slate-100 border-slate-300 border-dashed hover:bg-slate-200 cursor-pointer'
                                            }`}
                                        >
                                            {isLocating ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 text-emerald-500 mb-2 animate-spin" />
                                                    <span className="text-sm font-medium text-emerald-600">Acquiring GPS Signal...</span>
                                                </>
                                            ) : location ? (
                                                <>
                                                    <MapPin className={`w-6 h-6 mb-2 ${location.includes('denied') ? 'text-red-500' : 'text-emerald-500'}`} />
                                                    <span className={`text-sm font-medium ${location.includes('denied') ? 'text-red-600' : 'text-emerald-700'}`}>
                                                        {location}
                                                    </span>
                                                    {!location.includes('denied') && (
                                                        <span className="text-xs text-emerald-600 mt-1 font-medium">✓ Coordinates secured for LMO routing</span>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="w-6 h-6 text-slate-500 mb-2" />
                                                    <span className="text-sm font-medium text-slate-600">Detect Current Location</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* --- STEP 2: ASSET DETAILS --- */}
                        {step === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-900">Application Type</label>
                                    <select 
                                        value={appType} 
                                        onChange={(e) => setAppType(e.target.value)} 
                                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    >
                                        <option>New Verification</option>
                                        <option>Re-Verification (Annual)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-900">Instrument Type</label>
                                    <select 
                                        value={instrumentType} 
                                        onChange={(e) => setInstrumentType(e.target.value)} 
                                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    >
                                        <option>Electronic Weighing Scale</option>
                                        <option>Mechanical Scale</option>
                                        <option>Dispensing Pump</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-900">Make / Manufacturer</label>
                                    <input 
                                        type="text" 
                                        value={make} 
                                        onChange={(e) => setMake(e.target.value)} 
                                        placeholder="e.g. Casio, Essae, Avery" 
                                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-900">Model Number</label>
                                    <input 
                                        type="text" 
                                        value={model} 
                                        onChange={(e) => setModel(e.target.value)} 
                                        placeholder="e.g. DS-852" 
                                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-900">Max Capacity</label>
                                    <select 
                                        value={capacity} 
                                        onChange={(e) => setCapacity(e.target.value)} 
                                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    >
                                        <option>10 kg</option>
                                        <option>30 kg</option>
                                        <option>50 kg</option>
                                        <option>100+ kg</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-zinc-900">Accuracy Class</label>
                                    <select 
                                        value={accuracyClass} 
                                        onChange={(e) => setAccuracyClass(e.target.value)} 
                                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                                    >
                                        <option>Class III (Medium / Retail)</option>
                                        <option>Class II (High Accuracy)</option>
                                        <option>Class I (Special Accuracy)</option>
                                    </select>
                                </div>

                                {/* Smart OCR Upload Box */}
                                <div className="col-span-1 md:col-span-2 space-y-1.5 mt-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-zinc-900">Machine Serial Number</label>
                                        <span className="text-xs text-emerald-600 font-medium flex items-center"><Camera className="w-3 h-3 mr-1" /> Auto-OCR enabled</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <input 
                                            type="text" 
                                            value={serial} 
                                            onChange={(e) => setSerial(e.target.value)} 
                                            placeholder="Enter Serial No. manually or upload photo" 
                                            className="flex-grow h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" 
                                        />
                                        <button className="h-10 px-4 bg-slate-100 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors whitespace-nowrap">
                                            Upload Photo
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500">Uploading the serial number plate pre-fills data for the LMO's field app.</p>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 3: REVIEW & PAY --- */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-zinc-900 mb-1">Review Application</h3>
                                    <p className="text-sm text-emerald-800">Please verify your details. Once submitted, these will be locked for the LMO's field inspection.</p>
                                </div>
                                
                                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-5">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-slate-500 block mb-1">Business Name</span> <p className="font-medium text-zinc-900">{businessName}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Owner Name</span> <p className="font-medium text-zinc-900">{ownerName}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Contact</span> <p className="font-medium text-zinc-900">{contact}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Category</span> <p className="font-medium text-zinc-900">{category}</p></div>
                                        <div className="col-span-2"><span className="text-slate-500 block mb-1">Location Coordinates</span> <p className="font-medium text-zinc-900">{location}</p></div>
                                    </div>
                                    <div className="h-px w-full bg-slate-200"></div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-slate-500 block mb-1">Application Type</span> <p className="font-medium text-zinc-900">{appType}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Instrument</span> <p className="font-medium text-zinc-900">{instrumentType}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Make / Model</span> <p className="font-medium text-zinc-900">{make} / {model}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Serial Number</span> <p className="font-medium text-zinc-900">{serial}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Capacity</span> <p className="font-medium text-zinc-900">{capacity}</p></div>
                                        <div><span className="text-slate-500 block mb-1">Accuracy Class</span> <p className="font-medium text-zinc-900">{accuracyClass}</p></div>
                                    </div>
                                </div>

                                {/* Dummy Payment Card */}
                                <div className="bg-zinc-900 text-white rounded-xl p-6 flex items-center justify-between shadow-md">
                                    <div>
                                        <p className="text-sm text-zinc-400 font-medium mb-1">Statutory Fee (Schedule XI)</p>
                                        <p className="text-3xl font-bold">₹250.00</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-emerald-400 font-medium mb-2">Secure Government Gateway</p>
                                        <Scale className="w-8 h-8 text-emerald-500 ml-auto"/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error notification banner if validation fails */}
                    {errorMsg && (
                        <div className="px-8 py-3 bg-red-50 border-t border-red-200 text-sm font-medium text-red-600">
                            {errorMsg}
                        </div>
                    )}

                    {/* Dynamic Card Footer */}
                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        {step === 1 ? (
                            <button className="text-sm font-medium text-slate-500 hover:text-zinc-900 transition-colors">Cancel</button>
                        ) : (
                            <button onClick={() => { setErrorMsg(''); setStep(step - 1); }} className="text-sm font-medium text-slate-500 hover:text-zinc-900 transition-colors">&larr; Back</button>
                        )}

                        {step === 1 && (
                            <button onClick={handleNextStep2} className="h-10 px-6 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors ml-auto">
                                Continue to Asset Details &rarr;
                            </button>
                        )}
                        {step === 2 && (
                            <button onClick={handleNextStep3} className="h-10 px-6 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
                                Review Application &rarr;
                            </button>
                        )}
                        {step === 3 && (
                            <button onClick={() => alert("Payment Processing... e-Challan Generated!")} className="h-10 px-6 bg-emerald-500 text-white rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center space-x-2">
                                <span>Pay ₹250 & Submit</span>
                            </button>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}