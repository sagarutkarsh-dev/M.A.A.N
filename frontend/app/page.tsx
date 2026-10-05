"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ActionCards from '@/components/ActionCards';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      <Navbar />

      {/* Hero & Action Sections */}
      <main className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-16 text-center">
        <Hero />
        <ActionCards />
      </main>
    </div>
  );
}