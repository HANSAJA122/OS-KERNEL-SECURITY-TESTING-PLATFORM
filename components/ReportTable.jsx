'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';

/* ── status badge config ── */
const statusMap = {
  Passed: {
    label: 'CLEAR',
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]',
    badge: 'text-emerald-400 bg-emerald-500/8 border border-emerald-500/20',
    border: 'border-l-emerald-500',
  },
  Warning: {
    label: 'ALERT',
    dot: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]',
    badge: 'text-amber-400 bg-amber-500/8 border border-amber-500/20',
    border: 'border-l-amber-500',
  },
  Failed: {
    label: 'CRITICAL',
    dot: 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse',
    badge: 'text-red-400 bg-red-500/8 border border-red-500/20',
    border: 'border-l-red-500',
  },
};

const riskColors = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-orange-400',
  Critical: 'text-red-400',
};

export default function ReportTable({ results }) {
  const hasResults = results && results.length > 0;

  const clearCount = hasResults ? results.filter((r) => r.status === 'Passed').length : 0;
  const alertCount = hasResults ? results.filter((r) => r.status === 'Warning').length : 0;
  const criticalCount = hasResults ? results.filter((r) => r.status === 'Failed').length : 0;

  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  /* overall assessment */
  const assessment =
    criticalCount > 0
      ? { text: 'IMMEDIATE ACTION NEEDED', color: 'text-red-400' }
      : alertCount > 0
        ? { text: 'REVIEW REQUIRED', color: 'text-amber-400' }
        : { text: 'SYSTEM SECURE', color: 'text-emerald-400' };

  return (
    <section id="report" className="soc-section py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="font-mono text-[10px] text-[#06d6a0] uppercase tracking-widest">
            INCIDENT REPORT
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            SECURITY ASSESSMENT REPORT
          </h2>
        </motion.div>

        {/* ── Content ── */}
        {!hasResults ? (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="soc-panel soc-bracket rounded-2xl relative overflow-hidden flex flex-col items-center justify-center py-24 px-6"
          >
            {/* scan-line animation */}
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            <FileText className="w-12 h-12 text-[#1e2540] mb-5" />
            <p className="font-mono text-sm text-[#4b5576] tracking-wider mb-2">
              AWAITING SCAN DATA
            </p>
            <p className="text-[#3d4566] text-xs text-center max-w-sm">
              Execute a security scan to generate assessment report
            </p>
          </motion.div>
        ) : (
          /* ── Table ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="soc-panel rounded-2xl overflow-hidden"
          >
            {/* scrollable wrapper for mobile */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="bg-[#0c0f1a]">
                    {['TEST VECTOR', 'STATUS', 'SEVERITY', 'RECOMMENDATION'].map((col) => (
                      <th
                        key={col}
                        className="soc-label px-5 py-4 text-[10px] font-medium uppercase tracking-widest text-[#4b5576]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {results.map((row, idx) => {
                      const cfg = statusMap[row.status] || statusMap.Passed;
                      return (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: idx * 0.07 }}
                          className={`border-l-2 ${cfg.border} ${
                            idx % 2 === 0 ? 'bg-[#080a12]/50' : 'bg-[#0c0f1a]/50'
                          } transition-colors hover:bg-[#0e1225]/80`}
                        >
                          {/* Test Vector */}
                          <td className="px-5 py-4 text-sm font-medium text-gray-200 whitespace-nowrap font-mono">
                            {row.testArea}
                          </td>

                          {/* Status Badge */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs font-semibold ${cfg.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </td>

                          {/* Severity / Risk Level */}
                          <td
                            className={`px-5 py-4 text-sm font-semibold font-mono ${
                              riskColors[row.riskLevel] || 'text-[#4b5576]'
                            }`}
                          >
                            {row.riskLevel}
                          </td>

                          {/* Recommendation */}
                          <td className="px-5 py-4 text-sm text-[#8892b0] max-w-xs">
                            {row.recommendation}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ── Summary Footer ── */}
            <div className="border-t border-[#151a2e] px-5 py-5 flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Left: count badges */}
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  {clearCount} CLEAR
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                  {alertCount} ALERTS
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse" />
                  {criticalCount} CRITICAL
                </span>
              </div>

              {/* Center: overall assessment */}
              <span className={`font-mono text-xs font-bold tracking-wider ${assessment.color}`}>
                {assessment.text}
              </span>

              {/* Right: timestamp */}
              <span className="soc-label font-mono text-[10px] text-[#4b5576] tracking-wider">
                Generated: {timestamp}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
