'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Loader2,
  Play,
} from 'lucide-react';

/* ══════════════════════════════════════════════════
   Test Configuration — Areas & Outcome Mappings
   ══════════════════════════════════════════════════ */
const TEST_AREAS = [
  {
    name: 'Memory Protection',
    outcomes: {
      Passed:  { riskLevel: 'Low',    recommendation: 'Continue monitoring memory safety controls' },
      Warning: { riskLevel: 'Medium', recommendation: 'Review memory allocation patterns' },
      Failed:  { riskLevel: 'High',   recommendation: 'Critical memory protection failure detected' },
    },
  },
  {
    name: 'System Call Validation',
    outcomes: {
      Passed:  { riskLevel: 'Low',    recommendation: 'System call interfaces properly validated' },
      Warning: { riskLevel: 'Medium', recommendation: 'Review input validation for system call interfaces' },
      Failed:  { riskLevel: 'High',   recommendation: 'System call filtering bypassed' },
    },
  },
  {
    name: 'Driver Security',
    outcomes: {
      Passed:  { riskLevel: 'Low',    recommendation: 'All drivers verified and signed' },
      Warning: { riskLevel: 'Medium', recommendation: 'Some drivers require updates' },
      Failed:  { riskLevel: 'High',   recommendation: 'Update or remove vulnerable drivers' },
    },
  },
  {
    name: 'Privilege Escalation',
    outcomes: {
      Passed:  { riskLevel: 'Low',    recommendation: 'No escalation paths detected' },
      Warning: { riskLevel: 'Medium', recommendation: 'Potential escalation vectors found' },
      Failed:  { riskLevel: 'Critical', recommendation: 'Active privilege escalation vulnerability' },
    },
  },
  {
    name: 'Kernel Module Analysis',
    outcomes: {
      Passed:  { riskLevel: 'Low',    recommendation: 'All modules verified' },
      Warning: { riskLevel: 'Medium', recommendation: 'Review loaded modules and permissions' },
      Failed:  { riskLevel: 'High',   recommendation: 'Unsigned or suspicious modules detected' },
    },
  },
  {
    name: 'Patch Compliance',
    outcomes: {
      Passed:  { riskLevel: 'Low',    recommendation: 'Kernel patch level is acceptable' },
      Warning: { riskLevel: 'Medium', recommendation: 'Some patches pending' },
      Failed:  { riskLevel: 'High',   recommendation: 'Critical patches missing' },
    },
  },
];

const SCAN_LOG_MESSAGES = [
  { time: '0.2s', message: 'Initializing memory protection audit...' },
  { time: '0.5s', message: 'Scanning system call interfaces...' },
  { time: '0.8s', message: 'Validating driver signatures...' },
  { time: '1.2s', message: 'Checking privilege escalation vectors...' },
  { time: '1.5s', message: 'Analyzing kernel modules...' },
  { time: '1.8s', message: 'Verifying patch compliance...' },
];

/* ══════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════ */

/** Weighted random: 50% Passed · 30% Warning · 20% Failed */
function randomStatus() {
  const r = Math.random();
  if (r < 0.5) return 'Passed';
  if (r < 0.8) return 'Warning';
  return 'Failed';
}

function getRiskHex(level) {
  switch (level) {
    case 'Low':      return '#06d6a0';
    case 'Medium':   return '#fbbf24';
    case 'High':     return '#ef4444';
    case 'Critical': return '#ef4444';
    default:         return '#4b5576';
  }
}

function getThreatWidth(level) {
  switch (level) {
    case 'Low':      return '25%';
    case 'Medium':   return '55%';
    case 'High':     return '85%';
    case 'Critical': return '95%';
    default:         return '0%';
  }
}

function getThreatGradient(level) {
  switch (level) {
    case 'Low':      return 'from-[#06d6a0]/80 to-[#06d6a0]';
    case 'Medium':   return 'from-[#fbbf24]/80 to-[#fbbf24]';
    case 'High':     return 'from-[#ef4444]/80 to-[#ef4444]';
    case 'Critical': return 'from-[#ef4444] to-[#ff1744]';
    default:         return 'from-[#4b5576]/50 to-[#4b5576]';
  }
}

/* ══════════════════════════════════════════════════
   Animated Value — spring remount on change
   ══════════════════════════════════════════════════ */
function AnimatedValue({ value, className = '' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 14, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

/* ══════════════════════════════════════════════════
   SOC Stat Card
   ══════════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, accentHex, microStatus }) {
  const isNumeric = typeof value === 'number';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="soc-panel relative rounded-xl overflow-hidden group hover:bg-[#151a2e]/90 transition-colors"
    >
      {/* 2px accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ backgroundColor: accentHex }}
      />

      <div className="p-5">
        {/* Top row: label + icon */}
        <div className="flex items-center justify-between mb-4">
          <span className="soc-label">{label}</span>
          <Icon size={16} style={{ color: accentHex }} className="opacity-50" />
        </div>

        {/* Large value */}
        <div className="text-3xl font-bold font-mono text-white tracking-tight mb-2">
          {isNumeric ? (
            <AnimatedValue value={value} />
          ) : (
            <AnimatedValue
              value={value}
              className=""
              style={{ color: accentHex }}
            />
          )}
        </div>

        {/* Micro status */}
        {microStatus && (
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#4b5576] leading-tight">
            {microStatus}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   Scan Log Feed Line
   ══════════════════════════════════════════════════ */
function LogLine({ time, message, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.28, duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-2 font-mono text-xs"
    >
      <span className="text-[#4b5576] shrink-0">[{time}]</span>
      <span className="text-[#06d6a0]/70">{message}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   ▸ DASHBOARD COMPONENT
   ══════════════════════════════════════════════════ */
export default function Dashboard({ onTestComplete }) {
  const [totalTests, setTotalTests]   = useState(0);
  const [passed, setPassed]           = useState(0);
  const [warnings, setWarnings]       = useState(0);
  const [failed, setFailed]           = useState(0);
  const [riskLevel, setRiskLevel]     = useState('N/A');
  const [loading, setLoading]         = useState(false);
  const [showLogs, setShowLogs]       = useState(false);

  const runTest = useCallback(() => {
    setLoading(true);
    setShowLogs(true);

    setTimeout(() => {
      const results = TEST_AREAS.map((area) => {
        const status = randomStatus();
        const { riskLevel: risk, recommendation } = area.outcomes[status];
        return {
          testArea: area.name,
          status,
          riskLevel: risk,
          recommendation,
        };
      });

      const passedCount  = results.filter((r) => r.status === 'Passed').length;
      const warningCount = results.filter((r) => r.status === 'Warning').length;
      const failedCount  = results.filter((r) => r.status === 'Failed').length;

      let overall = 'Low';
      if (failedCount > 0) overall = 'High';
      else if (warningCount > 0) overall = 'Medium';

      setTotalTests(6);
      setPassed(passedCount);
      setWarnings(warningCount);
      setFailed(failedCount);
      setRiskLevel(overall);
      setLoading(false);
      setShowLogs(false);

      if (onTestComplete) onTestComplete(results);
    }, 2000);
  }, [onTestComplete]);

  /* ── Risk-aware accent for RISK LEVEL card ── */
  const riskHex = getRiskHex(riskLevel);

  /* ── Micro-status text per card ── */
  const riskMicro =
    riskLevel === 'N/A'
      ? 'Awaiting scan execution'
      : riskLevel === 'Low'
      ? 'All systems nominal'
      : riskLevel === 'Medium'
      ? 'Advisory conditions detected'
      : 'Immediate action required';

  /* ── Card definitions ── */
  const cards = [
    {
      icon: Activity,
      label: 'TOTAL TESTS',
      value: totalTests,
      accentHex: '#3b82f6',
      microStatus: totalTests === 0 ? 'No scans initiated' : `${totalTests} subsystems scanned`,
    },
    {
      icon: CheckCircle2,
      label: 'PASSED',
      value: passed,
      accentHex: '#06d6a0',
      microStatus: passed === 0 ? 'Pending results' : `${passed} checks cleared`,
    },
    {
      icon: AlertTriangle,
      label: 'WARNINGS',
      value: warnings,
      accentHex: '#fbbf24',
      microStatus: warnings === 0 ? 'No advisories' : `${warnings} advisories flagged`,
    },
    {
      icon: XCircle,
      label: 'FAILED',
      value: failed,
      accentHex: '#ef4444',
      microStatus: failed === 0 ? 'No failures' : `${failed} critical findings`,
    },
    {
      icon: Shield,
      label: 'RISK LEVEL',
      value: riskLevel,
      accentHex: riskHex,
      microStatus: riskMicro,
    },
  ];

  return (
    <section id="dashboard" className="soc-section">
      <div className="py-24 px-6 max-w-7xl mx-auto">

        {/* ═══════════════ SECTION HEADER ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-[#06d6a0] mb-3">
            OPERATIONS CENTER
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
            SECURITY TESTING DASHBOARD
          </h2>
          <p className="mt-3 text-[#4b5576] max-w-xl mx-auto text-sm font-mono">
            Run simulated kernel security tests and monitor real-time threat
            assessment across critical subsystems.
          </p>
        </motion.div>

        {/* ═══════════════ TOP ROW — KEY METRICS ═══════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* ═══════════════ MIDDLE ROW — THREAT GAUGE ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="soc-panel rounded-xl p-6 mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="soc-label">THREAT ASSESSMENT</span>
            <motion.span
              key={riskLevel}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="font-mono text-xs uppercase tracking-wider font-bold"
              style={{ color: riskHex }}
            >
              {riskLevel === 'N/A' ? 'STANDBY' : riskLevel.toUpperCase()}
            </motion.span>
          </div>

          {/* Threat bar track */}
          <div className="relative h-3 rounded-full bg-[#151a2e] overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getThreatGradient(riskLevel)}`}
              initial={{ width: '0%' }}
              animate={{ width: getThreatWidth(riskLevel) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* Subtle glow overlay */}
            {riskLevel !== 'N/A' && (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: getThreatWidth(riskLevel) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  background: `linear-gradient(90deg, transparent 60%, ${riskHex}40)`,
                }}
              />
            )}
          </div>

          {/* Gauge scale markers */}
          <div className="flex justify-between mt-2">
            {['SAFE', '25%', '50%', '75%', 'CRITICAL'].map((mark) => (
              <span key={mark} className="text-[9px] font-mono text-[#4b5576]/60 tracking-wider">
                {mark}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ═══════════════ RUN TEST BUTTON ═══════════════ */}
        <div className="flex flex-col items-center gap-5">
          <motion.button
            onClick={runTest}
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.03 }}
            whileTap={loading ? {} : { scale: 0.97 }}
            animate={
              loading
                ? {}
                : {
                    boxShadow: [
                      '0 0 0px rgba(6,214,160,0)',
                      '0 0 20px rgba(6,214,160,0.2)',
                      '0 0 0px rgba(6,214,160,0)',
                    ],
                  }
            }
            transition={
              loading
                ? {}
                : {
                    boxShadow: {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
            }
            className={`
              inline-flex items-center gap-3 px-8 py-3.5 rounded-lg
              font-mono uppercase tracking-wider text-sm font-semibold
              transition-all duration-300 cursor-pointer
              ${
                loading
                  ? 'bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] cursor-not-allowed opacity-90'
                  : 'bg-[#06d6a0]/10 border border-[#06d6a0]/30 text-[#06d6a0] hover:bg-[#06d6a0]/20 hover:border-[#06d6a0]/50'
              }
            `}
            style={
              !loading
                ? {}
                : {}
            }
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                EXECUTING SECURITY SCAN...
              </>
            ) : (
              <>
                <Play size={14} />
                RUN SECURITY TEST
              </>
            )}
          </motion.button>

          {/* ── Progress bar + Log feed during scan ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-lg overflow-hidden"
              >
                {/* Progress bar */}
                <div className="relative h-1.5 rounded-full bg-[#151a2e] overflow-hidden mb-5">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#06d6a0] via-[#06d6a0]/80 to-[#3b82f6]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                </div>

                {/* Scan log feed */}
                <div className="soc-panel rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#06d6a0] animate-pulse" />
                    <span className="soc-label !mb-0">LIVE SCAN OUTPUT</span>
                  </div>
                  {SCAN_LOG_MESSAGES.map((log, i) => (
                    <LogLine
                      key={log.time}
                      time={log.time}
                      message={log.message}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
