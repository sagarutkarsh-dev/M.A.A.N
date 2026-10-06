"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Landmark, 
  Scale, 
  Menu, 
  X, 
  Globe, 
  ChevronDown, 
  ArrowRight,
  Store,
  Check,
  Info
} from 'lucide-react';

interface NavLinkItem {
  label: string;
  href: string;
  disabled?: boolean;
  badge?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTextSize, setActiveTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [selectedLang, setSelectedLang] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Text resize handler for accessibility
  const handleResize = (size: 'sm' | 'base' | 'lg') => {
    setActiveTextSize(size);
    if (typeof document !== 'undefined') {
      if (size === 'sm') {
        document.documentElement.style.fontSize = '92%';
      } else if (size === 'base') {
        document.documentElement.style.fontSize = '100%';
      } else if (size === 'lg') {
        document.documentElement.style.fontSize = '108%';
      }
    }
  };

  const navLinks: NavLinkItem[] = [
    { label: 'Verify Scale', href: '/audit' },
    { label: 'Dashboard', href: '#', disabled: true },
    { label: 'LMO Field Portal', href: '#', disabled: true, badge: 'In Dev' },
    { label: 'FAQ', href: '/#faq' },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: NavLinkItem) => {
    if (link.disabled) {
      e.preventDefault();
      setToastMessage(`${link.label}: Module under construction`);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleMobileLinkClick = (e: React.MouseEvent, link: NavLinkItem) => {
    if (link.disabled) {
      e.preventDefault();
      setToastMessage(`${link.label}: Module under construction`);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2500);
    } else {
      setMobileMenuOpen(false);
    }
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
  ];

  return (
    <header className="w-full font-sans relative">
      {/* Non-intrusive Toast Notification for disabled modules */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-zinc-700/60 backdrop-blur-md flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIER 1: THE AUTHORITY STRIP (Govt. Authority & Accessibility Bar)          */}
      {/* ========================================================================= */}
      <div className="bg-emerald-900 text-white text-xs border-b border-emerald-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          {/* Left: Government Authority & Emblem */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-emerald-800/80 flex items-center justify-center text-emerald-200 border border-emerald-700/60 shadow-xs">
              <Landmark className="w-3 h-3" />
            </div>
            <span className="font-medium tracking-wide text-emerald-100 text-[11px] sm:text-xs">
              Department of Legal Metrology, Government of India
            </span>
          </div>

          {/* Right: Accessibility Controls & Language Selector */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Text Resize Controls */}
            <div className="flex items-center bg-emerald-950/60 rounded border border-emerald-800/80 p-0.5">
              <span className="text-[10px] text-emerald-300 font-semibold px-1.5 hidden sm:inline">
                Text:
              </span>
              <button
                type="button"
                onClick={() => handleResize('sm')}
                title="Decrease font size"
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeTextSize === 'sm'
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleResize('base')}
                title="Normal font size"
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeTextSize === 'base'
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleResize('lg')}
                title="Increase font size"
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeTextSize === 'lg'
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                }`}
              >
                A+
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="h-3.5 w-px bg-emerald-700/60" />

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-800/80 rounded px-2 py-1 text-[11px] sm:text-xs font-medium text-emerald-100 transition-colors"
                aria-label="Select Language"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-300" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {langDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-emerald-950 border border-emerald-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setSelectedLang(lang.label.split(' ')[0]);
                          setLangDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-emerald-100 hover:bg-emerald-800/80 flex items-center justify-between transition-colors"
                      >
                        <span>{lang.label}</span>
                        {selectedLang === lang.label.split(' ')[0] && (
                          <Check className="w-3 h-3 text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: THE MAIN APPLICATION BAR (Brand, Nav Links, Sign In CTA)           */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand / Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-105 group-hover:bg-emerald-100 transition-all duration-200">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-emerald-600 group-hover:text-emerald-700 transition-colors leading-none">
                  M.A.A.N.
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 mt-1">
                  Digital Metrology Engine
                </span>
              </div>
            </Link>

            {/* Center: Horizontal Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = !link.disabled && pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                        : 'text-zinc-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full leading-none">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Far Right: Trader / Sign In CTA Button (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-150"
              >
                <Store className="w-4 h-4 text-emerald-100" />
                <span>Trader / Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-emerald-100" />
              </Link>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-zinc-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-zinc-900" />
                ) : (
                  <Menu className="w-6 h-6 text-zinc-900" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3 duration-200 shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = !link.disabled && pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleMobileLinkClick(e, link)}
                    className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                        : 'text-zinc-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full leading-none">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-sm transition-all"
              >
                <Store className="w-4 h-4 text-emerald-100" />
                <span>Trader / Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export { Navbar };
