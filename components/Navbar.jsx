'use client';

import { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT', href: '#about' },
  { label: 'MODULES', href: '#modules' },
  { label: 'DASHBOARD', href: '#dashboard' },
  { label: 'REPORT', href: '#report' },
  { label: 'TIMELINE', href: '#timeline' },
  { label: 'INTEGRITY', href: '#integrity' },
  { label: 'LEARNING', href: '#learning' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080a12] border-b border-[#151a2e]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* ── LEFT: Logo + platform name ── */}
          <a href="#home" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <Shield className="h-6 w-6 text-[#06d6a0] transition-colors duration-300 group-hover:text-[#00f5a0]" />
              {/* Green pulsing dot */}
              <span
                className="absolute -top-0.5 -right-0.5 block"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.4)',
                  animation: 'status-pulse 2s ease-in-out infinite',
                }}
              />
            </div>
            <span
              className="text-[15px] font-bold tracking-wider"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                color: '#06d6a0',
              }}
            >
              KSTP
            </span>
            {/* Vertical separator */}
            <span className="hidden sm:block w-px h-5 bg-[#1e2540]" />
            <span
              className="hidden sm:block text-xs tracking-wide text-[#4b5576]"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Kernel Security Testing Platform
            </span>
          </a>

          {/* ── CENTER: Nav links as SOC tabs ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-[#4b5576] transition-all duration-300 hover:text-[#06d6a0] group"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {link.label}
                {/* Bottom highlight bar on hover */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#06d6a0] transition-all duration-300 group-hover:w-full rounded-full opacity-60" />
              </a>
            ))}
          </div>

          {/* ── RIGHT: System status + clock ── */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {/* System Online badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded border border-[#151a2e] bg-[#0c0f1a]">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 4px #22c55e, 0 0 10px rgba(34,197,94,0.35)',
                  animation: 'status-pulse 2s ease-in-out infinite',
                  display: 'inline-block',
                }}
              />
              <span
                className="text-[10px] font-semibold tracking-[0.1em] text-[#22c55e]"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                SYSTEM ONLINE
              </span>
            </div>

            {/* Live clock */}
            <div
              className="text-xs tabular-nums text-[#4b5576] tracking-wider"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              {currentTime || '--:--:--'}
            </div>
          </div>

          {/* ── MOBILE: Hamburger toggle ── */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded text-[#4b5576] transition-colors duration-300 hover:text-[#06d6a0] hover:bg-[#0c0f1a]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE: SOC Dropdown Panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden overflow-hidden bg-[#0c0f1a] border-t border-[#151a2e]"
          >
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                  className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold tracking-[0.1em] text-[#4b5576] transition-all duration-200 hover:text-[#06d6a0] group"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  {/* Left green indicator bar */}
                  <span className="w-[3px] h-4 rounded-full bg-[#151a2e] transition-colors duration-200 group-hover:bg-[#06d6a0]" />
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile system status row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#151a2e] px-3">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 4px #22c55e, 0 0 10px rgba(34,197,94,0.35)',
                      animation: 'status-pulse 2s ease-in-out infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    className="text-[10px] font-semibold tracking-[0.1em] text-[#22c55e]"
                    style={{ fontFamily: 'var(--font-mono), monospace' }}
                  >
                    SYSTEM ONLINE
                  </span>
                </div>
                <span
                  className="text-[10px] tabular-nums text-[#4b5576] tracking-wider"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  {currentTime || '--:--:--'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
