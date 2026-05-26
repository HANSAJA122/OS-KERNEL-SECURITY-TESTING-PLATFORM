'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Download, Shield, ShieldAlert, CheckCircle, AlertTriangle, XCircle, SlidersHorizontal } from 'lucide-react';

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

export default function ReportTable({ reportData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Passed' | 'Warning' | 'Failed'

  // Support both old array structure and the new API report object structure
  const isObjectReport = reportData && !Array.isArray(reportData) && reportData.report && reportData.report.checks;
  const isArrayReport = Array.isArray(reportData);
  const hasResults = isObjectReport || (isArrayReport && reportData.length > 0);

  // Extract total checks list
  const results = isObjectReport 
    ? reportData.report.checks 
    : isArrayReport 
    ? reportData 
    : [];

  // Summary statistics (based on absolute totals)
  const clearCount = isObjectReport
    ? reportData.report.passed
    : hasResults
    ? results.filter((r) => r.status === 'Passed').length
    : 0;

  const alertCount = isObjectReport
    ? reportData.report.warnings
    : hasResults
    ? results.filter((r) => r.status === 'Warning').length
    : 0;

  const criticalCount = isObjectReport
    ? reportData.report.failed
    : hasResults
    ? results.filter((r) => r.status === 'Failed').length
    : 0;

  // Custom defensive security score
  const hasScore = isObjectReport && typeof reportData.report.score === 'number';
  const score = hasScore ? reportData.report.score : null;

  // Filtering / Search logic using useMemo
  const filteredResults = useMemo(() => {
    return results.filter((row) => {
      // 1. Text Search query filter
      const matchesSearch = row.testArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Status Category filter
      const matchesStatus = statusFilter === 'ALL' || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [results, searchQuery, statusFilter]);

  // Dynamic Overall risk level
  const overallRisk = isObjectReport ? reportData.report.riskLevel : null;
  const assessment =
    criticalCount > 0 || overallRisk === 'High'
      ? { text: 'IMMEDIATE ACTION NEEDED', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' }
      : alertCount > 0 || overallRisk === 'Medium'
      ? { text: 'REVIEW REQUIRED', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
      : { text: 'SYSTEM SECURE', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };

  // Formatting timestamp
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Client-Side Report Downloader (.txt format)
  const downloadTxtReport = () => {
    if (!hasResults) return;

    const sourceLabel = isObjectReport ? reportData.source : 'Simulated';
    const computedScore = hasScore ? `${score}/100` : 'N/A';
    
    let reportText = `========================================================================
             OS KERNEL SECURITY TESTING PLATFORM AUDIT REPORT
========================================================================
Generated On  : ${new Date().toISOString()}
Data Source   : ${sourceLabel}
Overall Risk  : ${overallRisk || 'N/A'}
Audit Score   : ${computedScore}
Compliance    : ${assessment.text}
------------------------------------------------------------------------
STATISTICS SUMMARY:
- [CLEAR] Passed Checks      : ${clearCount}
- [ALERT] Warning Advisory   : ${alertCount}
- [CRITICAL] Failed Findings : ${criticalCount}
------------------------------------------------------------------------

DETAILED AUDIT FINDINGS:
`;

    results.forEach((row, index) => {
      const idxStr = String(index + 1).padStart(2, '0');
      reportText += `\n[${idxStr}] VULNERABILITY VECTOR: ${row.testArea}
     Status         : ${row.status.toUpperCase()}
     Risk Severity  : ${row.riskLevel.toUpperCase()}
     Verify Source  : ${row.source || sourceLabel}
     Recommendation : ${row.recommendation}
------------------------------------------------------------------------`;
    });

    reportText += `\n\n========================================================================
     [SAFETY NOTICE] For educational and defense compliance testing only.
========================================================================`;

    // Trigger local download
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kstp-security-audit-report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <p className="text-[#4b5576] text-xs font-mono max-w-lg mx-auto mt-2">
            Detailed telemetry analysis of endpoint configurations, service counts, and kernel vector compliance.
          </p>
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
              Execute a simulation scan or run a safe defensive check to generate audit telemetry.
            </p>
          </motion.div>
        ) : (
          /* ── Report Container ── */
          <div className="space-y-6">
            
            {/* ── Upper Stats Row for Live Score & Overall Risk ── */}
            {hasScore && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Security Score Widget */}
                <div className="soc-panel rounded-xl p-5 flex items-center justify-between border-l-2 border-l-[#4361ee]">
                  <div>
                    <span className="soc-label block mb-1">DEFENSIVE SCORE</span>
                    <span className="font-mono text-xs text-[#6b7294]">Endpoint hardening status</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-3xl font-extrabold text-white">
                      {score}
                    </span>
                    <span className="font-mono text-xs text-[#4b5576]">/100</span>
                  </div>
                </div>

                {/* Overall Assessment Widget */}
                <div className={`soc-panel rounded-xl p-5 flex items-center justify-between border-l-2 border-l-[#06d6a0] ${assessment.bg}`}>
                  <div>
                    <span className="soc-label block mb-1">COMPLIANCE STATE</span>
                    <span className="font-mono text-xs text-[#6b7294]">Audit safety rating</span>
                  </div>
                  <span className={`font-mono text-sm font-bold tracking-wider ${assessment.color}`}>
                    {assessment.text}
                  </span>
                </div>

                {/* Audit Source Widget */}
                <div className="soc-panel rounded-xl p-5 flex items-center justify-between border-l-2 border-l-[#fbbf24]">
                  <div>
                    <span className="soc-label block mb-1">TELEMETRY DATA SOURCE</span>
                    <span className="font-mono text-xs text-[#6b7294]">Verification channel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status-dot-${reportData.agentConnected ? 'green' : 'amber'} inline-block`} />
                    <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                      {reportData.source || 'Simulated'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── High-Tech Search & Filter Toolbar ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="soc-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-t-[#151a2e]"
            >
              {/* Text Search Field */}
              <div className="relative w-full md:w-80">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5576]" />
                <input
                  type="text"
                  placeholder="Search test vectors or recs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#151a2e] bg-[#080a12] text-xs font-mono text-white placeholder-[#4b5576] focus:outline-none focus:border-[#06d6a0]/60 transition-colors"
                />
              </div>

              {/* Status Segmented Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4b5576] mr-2 flex items-center gap-1.5 shrink-0">
                  <SlidersHorizontal size={10} /> Filters:
                </span>
                
                {['ALL', 'Passed', 'Warning', 'Failed'].map((status) => {
                  const isActive = statusFilter === status;
                  const label = status === 'ALL' ? 'ALL' : status === 'Passed' ? 'CLEAR' : status === 'Warning' ? 'ALERT' : 'CRITICAL';
                  
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`
                        px-3 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider transition-all duration-200 cursor-pointer
                        ${
                          isActive 
                            ? 'bg-[#06d6a0]/15 border border-[#06d6a0]/50 text-[#06d6a0] shadow-[0_0_10px_rgba(6,214,160,0.1)]' 
                            : 'bg-[#080a12] border border-[#151a2e] text-[#4b5576] hover:border-[#4b5576]/30 hover:text-white'
                        }
                      `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Download Action Trigger */}
              <button
                onClick={downloadTxtReport}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#06d6a0]/30 bg-[#06d6a0]/10 font-mono text-[10px] font-bold uppercase tracking-wider text-[#06d6a0] hover:bg-[#06d6a0]/20 hover:border-[#06d6a0]/60 transition-all cursor-pointer shrink-0"
              >
                <Download size={12} />
                Export Audit Log
              </button>
            </motion.div>

            {/* ── Table Grid ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="soc-panel rounded-2xl overflow-hidden"
            >
              {/* scrollable wrapper for mobile */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead>
                    <tr className="bg-[#0c0f1a]">
                      {['TEST VECTOR / AUDIT AREA', 'STATUS', 'SEVERITY', 'SOURCE', 'RECOMMENDATION'].map((col) => (
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
                    <AnimatePresence mode="popLayout">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((row, idx) => {
                          const cfg = statusMap[row.status] || statusMap.Passed;
                          const rowSource = row.source || (isArrayReport ? 'Simulation' : 'Compliance');
                          
                          return (
                            <motion.tr
                              key={row.testArea}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                              className={`border-l-2 ${cfg.border} ${
                                idx % 2 === 0 ? 'bg-[#080a12]/50' : 'bg-[#0c0f1a]/50'
                              } transition-colors hover:bg-[#0e1225]/80`}
                            >
                              {/* Test Vector */}
                              <td className="px-5 py-4 text-sm font-semibold text-gray-200 whitespace-nowrap font-mono">
                                {row.testArea}
                              </td>

                              {/* Status Badge */}
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-md font-mono text-[10px] font-semibold tracking-wider ${cfg.badge}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                  {cfg.label}
                                </span>
                              </td>

                              {/* Severity / Risk Level */}
                              <td
                                className={`px-5 py-4 text-xs font-bold font-mono ${
                                  riskColors[row.riskLevel] || 'text-[#4b5576]'
                                }`}
                              >
                                {row.riskLevel}
                              </td>

                              {/* Source */}
                              <td className="px-5 py-4 text-xs font-mono text-[#6b7294] whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded border border-[#151a2e] bg-[#0c0f1a]">
                                  {rowSource}
                                </span>
                              </td>

                              {/* Recommendation */}
                              <td className="px-5 py-4 text-xs text-[#8892b0] max-w-xs leading-relaxed">
                                {row.recommendation}
                              </td>
                            </motion.tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-xs font-mono text-[#4b5576]">
                            No matching test vectors found for current filters.
                          </td>
                        </tr>
                      )}
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
          </div>
        )}
      </div>
    </section>
  );
}
