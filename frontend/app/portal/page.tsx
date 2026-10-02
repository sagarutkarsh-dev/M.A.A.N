'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  Download, 
  CreditCard,
  QrCode
} from 'lucide-react';

interface InstrumentItem {
  id: string;
  serialNo: string;
  hologramId: string;
  category: string;
  accuracyClass: string;
  capacity: string;
  cadenceMonths: number;
  lastStamped: string;
  expiryDate: string;
  status: 'COMPLIANT' | 'DUE_SOON' | 'EXPIRED';
  certToken: string;
}

export default function TraderPortalPage() {
  const [instruments, setInstruments] = useState<InstrumentItem[]>([
    {
      id: 'INST-001',
      serialNo: 'SN-8839201-X',
      hologramId: 'HOLO-992-KRL',
      category: 'Counter Scale (General)',
      accuracyClass: 'III',
      capacity: '30 kg',
      cadenceMonths: 24,
      lastStamped: '2026-08-15',
      expiryDate: '2028-08-14',
      status: 'COMPLIANT',
      certToken: 'demo-hash-123',
    },
    {
      id: 'INST-002',
      serialNo: 'WB-449102-M',
      hologramId: 'HOLO-881-KRL',
      category: 'Electronic Weighbridge',
      accuracyClass: 'III',
      capacity: '50 Ton',
      cadenceMonths: 12,
      lastStamped: '2025-10-10',
      expiryDate: '2026-10-09',
      status: 'DUE_SOON',
      certToken: 'demo-wb-449',
    },
    {
      id: 'INST-003',
      serialNo: 'PREC-11029-A',
      hologramId: 'HOLO-773-KRL',
      category: 'Precision Laboratory Balance',
      accuracyClass: 'II',
      capacity: '500 g',
      cadenceMonths: 24,
      lastStamped: '2024-05-12',
      expiryDate: '2026-05-11',
      status: 'EXPIRED',
      certToken: 'demo-prec-110',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    serialNo: '',
    hologramId: '',
    category: 'Counter Scale (General)',
    accuracyClass: 'III',
    capacity: '15 kg',
    scaleInterval: '2 g',
  });

  const handleAddInstrument = (e: React.FormEvent) => {
    e.preventDefault();
    const newInst: InstrumentItem = {
      id: `INST-00${instruments.length + 1}`,
      serialNo: formData.serialNo || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      hologramId: formData.hologramId || `HOLO-${Math.floor(100 + Math.random() * 900)}-KRL`,
      category: formData.category,
      accuracyClass: formData.accuracyClass,
      capacity: formData.capacity,
      cadenceMonths: formData.category.includes('Weighbridge') ? 12 : 24,
      lastStamped: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 2).toISOString().split('T')[0],
      status: 'COMPLIANT',
      certToken: `maan-${Math.random().toString(36).substring(2, 10)}`,
    };
    setInstruments([...instruments, newInst]);
    setShowAddModal(false);
    setFormData({
      serialNo: '',
      hologramId: '',
      category: 'Counter Scale (General)',
      accuracyClass: 'III',
      capacity: '15 kg',
      scaleInterval: '2 g',
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-6 shadow-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
              <ArrowLeft className="w-4 h-4 text-slate-300" />
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Trader Self-Service Portal</span>
                <span className="text-[10px] uppercase font-semibold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  Rule 27 Compliance
                </span>
              </h1>
              <p className="text-xs text-slate-400">Legal Metrology Act, 2009 • Merchant Assurance Desk</p>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Instrument</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Merchant Summary Profile */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Mahalaxmi Provisions & Spices</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ACTIVE TRADER
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                License No: <strong className="font-mono text-slate-700">LM-TR-2024-88419</strong> • GSTIN: <strong className="font-mono text-slate-700">32AAAAA0000A1Z5</strong>
              </p>
              <p className="text-xs text-slate-500">Jurisdiction: LMO Division Kozhikode South, Kerala</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right border-r border-slate-200 pr-4">
              <span className="text-[11px] text-slate-500 font-medium block">Total Instruments</span>
              <span className="text-xl font-black text-slate-900">{instruments.length}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">Compliance Ratio</span>
              <span className="text-xl font-black text-emerald-600">
                {Math.round((instruments.filter(i => i.status === 'COMPLIANT').length / instruments.length) * 100)}%
              </span>
            </div>
          </div>
        </section>

        {/* Instruments Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Weights & Measures</h3>
              <p className="text-xs text-slate-500">Statutory verification cadences under Legal Metrology Rules, 2011</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Showing {instruments.length} units</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Instrument / Serial</th>
                  <th className="py-3 px-4">Class / Capacity</th>
                  <th className="py-3 px-4">Statutory Cadence</th>
                  <th className="py-3 px-4">Last Stamped</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {instruments.map((inst) => {
                  const isCompliant = inst.status === 'COMPLIANT';
                  const isDueSoon = inst.status === 'DUE_SOON';
                  return (
                    <tr key={inst.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{inst.category}</div>
                        <div className="text-xs font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>SN: {inst.serialNo}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-blue-600">{inst.hologramId}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800">Class {inst.accuracyClass}</span>
                        <div className="text-xs text-slate-500">{inst.capacity}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {inst.cadenceMonths} Months (Rule 27)
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {inst.lastStamped}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-900">
                        {inst.expiryDate}
                      </td>
                      <td className="py-3.5 px-4">
                        {isCompliant && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        )}
                        {isDueSoon && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Due Soon
                          </span>
                        )}
                        {!isCompliant && !isDueSoon && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3" /> Expired
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/verify/${inst.certToken}`}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Public QR Audit"
                          >
                            <QrCode className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                            title="Download Certificate"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dynamic Billing & Challan Estimator */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Eleventh Schedule Statutory Stamping Fees</h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">
              e-GRAS / Bharatkosh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Upcoming Renewal Fee</span>
              <p className="text-xl font-black text-slate-900 mt-1">₹ 450.00</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Weighbridge annual calibration fee</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">User Charges (Portal)</span>
              <p className="text-xl font-black text-slate-900 mt-1">₹ 50.00</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Statutory digital verification ledger</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs text-blue-700 font-semibold">Total Payable Challan</span>
                <p className="text-xl font-black text-blue-900 mt-1">₹ 500.00</p>
              </div>
              <button className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                Generate e-Challan &rarr;
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Add Instrument Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Register Weighing Instrument</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddInstrument} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instrument Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-800 text-xs"
                >
                  <option value="Counter Scale (General)">Counter Scale (General) - 24m Cadence</option>
                  <option value="Electronic Weighbridge">Electronic Weighbridge - 12m Cadence</option>
                  <option value="Fuel Dispenser Unit">Fuel Dispenser Unit - 12m Cadence</option>
                  <option value="Precision Laboratory Balance">Precision Laboratory Balance - 24m</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chassis Serial Number</label>
                <input
                  type="text"
                  placeholder="e.g. SN-883910"
                  value={formData.serialNo}
                  onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Accuracy Class</label>
                  <select
                    value={formData.accuracyClass}
                    onChange={(e) => setFormData({ ...formData, accuracyClass: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-xs"
                  >
                    <option value="I">Class I (Special)</option>
                    <option value="II">Class II (High)</option>
                    <option value="III">Class III (Medium)</option>
                    <option value="IIII">Class IIII (Ordinary)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 kg"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 shadow-sm"
                >
                  Register Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
