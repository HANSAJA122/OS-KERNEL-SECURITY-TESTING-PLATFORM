'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Loader2,
  Play,
  Cpu,
  Monitor,
  Server,
  Zap,
  RefreshCw,
  Info
} from 'lucide-react';

/* ── Help functions ── */
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
   Animated Value
   ══════════════════════════════════════════════════ */
function AnimatedValue({ value, className = '' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
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
      className="soc-panel relative rounded-xl overflow-hidden group hover:bg-[#151a2e]/60 transition-colors"
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ backgroundColor: accentHex }}
      />

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="soc-label">{label}</span>
          <Icon size={16} style={{ color: accentHex }} className="opacity-50" />
        </div>

        <div className="text-3xl font-bold font-mono text-white tracking-tight mb-2">
          {isNumeric ? (
            <AnimatedValue value={value} />
          ) : (
            <AnimatedValue value={value} className="" style={{ color: accentHex }} />
          )}
        </div>

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
      transition={{ delay: index * 0.15, duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-2 font-mono text-[11px]"
    >
      <span className="text-[#4b5576] shrink-0">[{time}]</span>
      <span className="text-[#06d6a0]/80">{message}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   Dashboard Component
   ══════════════════════════════════════════════════ */
export default function Dashboard({ onTestComplete }) {
  // Counters states
  const [totalTests, setTotalTests] = useState(0);
  const [passed, setPassed] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [failed, setFailed] = useState(0);
  const [riskLevel, setRiskLevel] = useState('N/A');
  const [securityScore, setSecurityScore] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [activeScanType, setActiveScanType] = useState(null); // 'real' | 'demo'
  const [scanLogs, setScanLogs] = useState([]);

  // Agent Telemetry States
  const [agentConnected, setAgentConnected] = useState(false);
  const [lastScanTime, setLastScanTime] = useState('NEVER');
  const [dataSource, setDataSource] = useState('None');
  const [systemInfo, setSystemInfo] = useState(null);

  // Attempt to ping /api/system-info on load to establish initial connection state
  const checkAgentStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/system-info');
      if (response.ok) {
        const json = await response.json();
        setAgentConnected(json.agentConnected);
        setDataSource(json.source);
        if (json.data) {
          setSystemInfo(json.data);
        }
      }
    } catch (e) {
      setAgentConnected(false);
      setDataSource('Error pinging host');
    }
  }, []);

  useEffect(() => {
    checkAgentStatus();
  }, [checkAgentStatus]);

  // ═══════════════ RUN REAL DEFENSIVE SCAN ═══════════════
  const runRealScan = useCallback(async () => {
    setLoading(true);
    setActiveScanType('real');
    setScanLogs([]);

    // Telemetry log feeds
    const logs = [
      { time: '0.1s', message: 'Querying Next.js backend API routing...' },
      { time: '0.3s', message: 'Pinging local read-only security agent (port 3001)...' },
      { time: '0.6s', message: 'Agent connection status checked...' },
      { time: '0.9s', message: 'Extracting safe OS details & active platform uptime...' },
      { time: '1.2s', message: 'Running read-only kernel version audit...' },
      { time: '1.5s', message: 'Auditing application firewall state & listening TCP sockets...' },
      { time: '1.7s', message: 'Analyzing loaded modules & counting process density...' },
      { time: '2.0s', message: 'Generating defensive hardening score & recommendations...' }
    ];

    // Push logs staggeredly
    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, log]);
      }, index * 250);
    });

    // Make the actual API request
    setTimeout(async () => {
      try {
        const infoRes = await fetch('/api/system-info');
        const reportRes = await fetch('/api/security-report');

        if (infoRes.ok && reportRes.ok) {
          const infoJson = await infoRes.json();
          const reportJson = await reportRes.json();

          // Update agent connection data
          setAgentConnected(infoJson.agentConnected);
          setDataSource(infoJson.source);
          setSystemInfo(infoJson.data);

          // Update scorecard metrics
          const report = reportJson.report;
          setTotalTests(report.totalChecks);
          setPassed(report.passed);
          setWarnings(report.warnings);
          setFailed(report.failed);
          setRiskLevel(report.riskLevel);
          setSecurityScore(report.score);

          setLastScanTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
          
          if (onTestComplete) {
            onTestComplete(reportJson);
          }
        }
      } catch (err) {
        console.error('Safe defensive scan error: ', err);
      } finally {
        setLoading(false);
        setActiveScanType(null);
      }
    }, 2200);
  }, [onTestComplete]);

  // ═══════════════ RUN WEIGHTED DEMO SCAN ═══════════════
  const runDemoScan = useCallback(() => {
    setLoading(true);
    setActiveScanType('demo');
    setScanLogs([]);

    const logs = [
      { time: '0.2s', message: '[SIMULATED] Launching stack canary check...' },
      { time: '0.5s', message: '[SIMULATED] auditing user mode permissions...' },
      { time: '0.8s', message: '[SIMULATED] running sandbox container audit...' },
      { time: '1.2s', message: '[SIMULATED] validating virtual address space integrity...' },
      { time: '1.5s', message: '[SIMULATED] analyzing mock device driver signatures...' },
      { time: '1.8s', message: '[SIMULATED] scanning syscall table maps...' }
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, log]);
      }, index * 300);
    });

    setTimeout(() => {
      // 50% Passed, 30% Warning, 20% Failed per vector
      const TEST_AREAS = [
        'Memory Protection', 'System Call Validation', 'Driver Security', 
        'Privilege Escalation', 'Kernel Module Analysis', 'Patch Compliance'
      ];
      
      const results = TEST_AREAS.map((name) => {
        const r = Math.random();
        let status = 'Passed';
        let risk = 'Low';
        let rec = 'Subsystem verified. Continuing routine compliance checking.';
        
        if (r >= 0.8) {
          status = 'Failed';
          risk = name === 'Privilege Escalation' ? 'Critical' : 'High';
          rec = `Critical vulnerability detected in ${name}! Apply compliance patches immediately.`;
        } else if (r >= 0.5) {
          status = 'Warning';
          risk = 'Medium';
          rec = `Advisory: Minor structural issues or signature warnings detected in ${name}.`;
        }

        return { testArea: name, status, riskLevel: risk, source: 'Simulation', recommendation: rec };
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
      setSecurityScore(null); // No static score for simulated array
      setLastScanTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
      setDataSource('Simulation Demo');

      if (onTestComplete) {
        onTestComplete(results);
      }
      setLoading(false);
      setActiveScanType(null);
    }, 2000);
  }, [onTestComplete]);

  // Risk aware colors
  const riskHex = getRiskHex(riskLevel);
  const riskMicro =
    riskLevel === 'N/A'
      ? 'Awaiting scan execution'
      : riskLevel === 'Low'
      ? 'All systems nominal'
      : riskLevel === 'Medium'
      ? 'Advisory conditions detected'
      : 'Immediate action required';

  // Cards definitions
  const statCards = [
    {
      icon: Activity,
      label: 'TOTAL CHECKS',
      value: totalTests,
      accentHex: '#3b82f6',
      microStatus: totalTests === 0 ? 'No scans initiated' : `${totalTests} subsystems audited`,
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
      label: 'FAILED / CRITICAL',
      value: failed,
      accentHex: '#ef4444',
      microStatus: failed === 0 ? 'No failures' : `${failed} critical findings`,
    },
    {
      icon: Shield,
      label: 'OVERALL RISK',
      value: riskLevel,
      accentHex: riskHex,
      microStatus: riskMicro,
    },
  ];

  return (
    <section id="dashboard" className="soc-section">
      <div className="py-24 px-6 max-w-7xl mx-auto space-y-10">

        {/* ═══════════════ SECTION HEADER ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-[#06d6a0] mb-3">
            OPERATIONS CENTER
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
            SECURITY TESTING DASHBOARD
          </h2>
          <p className="mt-3 text-[#4b5576] max-w-xl mx-auto text-sm font-mono">
            Execute real-world safe defensive checks via the endpoint agent or run a weighted simulated attack telemetry test.
          </p>
        </motion.div>

        {/* ═══════════════ AGENT CONNECTION & SYSTEM INFO ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent connection panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="soc-panel rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="soc-label">AGENT CONNECTION STATUS</span>
                <span className="flex items-center gap-2 px-2 py-0.5 rounded border border-[#151a2e] bg-[#0c0f1a] text-[9px] font-mono font-bold text-[#6b7294]">
                  PORT 3001
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <span className={`status-dot-${agentConnected ? 'green' : 'red'} h-4 w-4 block`} />
                </div>
                <div>
                  <h4 className="text-white font-mono text-sm font-semibold">
                    {agentConnected ? 'SECURITY AGENT ACTIVE' : 'SECURITY AGENT OFFLINE'}
                  </h4>
                  <p className="text-[11px] font-mono text-[#4b5576] mt-0.5">
                    Source: <span className="text-white">{dataSource}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#151a2e] pt-4 space-y-2 font-mono text-xs text-[#6b7294]">
              <div className="flex justify-between">
                <span>Last System Scan:</span>
                <span className="text-white">{lastScanTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Agent Connection:</span>
                <button
                  onClick={checkAgentStatus}
                  className="flex items-center gap-1 text-[#06d6a0] hover:text-[#00f5a0] font-semibold text-[10px] uppercase cursor-pointer"
                >
                  <RefreshCw size={10} /> Ping Agent
                </button>
              </div>
            </div>
          </motion.div>

          {/* Real System Information Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soc-panel rounded-xl p-6 lg:col-span-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="soc-label">ENDPOINT INFORMATION</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#4361ee] uppercase font-bold">
                <Monitor size={12} /> HOST TELEMETRY
              </span>
            </div>

            {systemInfo ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                <div>
                  <span className="text-[10px] font-mono text-[#4b5576] block">HOSTNAME</span>
                  <span className="font-mono text-xs text-white truncate block">{systemInfo.hostname}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#4b5576] block">OS / PLATFORM</span>
                  <span className="font-mono text-xs text-white block">{systemInfo.osName} {systemInfo.osVersion}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#4b5576] block">KERNEL VERSION</span>
                  <span className="font-mono text-xs text-white block">{systemInfo.kernelVersion}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#4b5576] block">ARCHITECTURE</span>
                  <span className="font-mono text-xs text-white block">{systemInfo.architecture}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#4b5576] block">SYSTEM UPTIME</span>
                  <span className="font-mono text-xs text-white block">{systemInfo.uptimeString}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#4b5576] block">RAM UTILIZATION</span>
                  <span className="font-mono text-xs text-white block">
                    {systemInfo.freeMemory} Free / {systemInfo.totalMemory}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 border border-dashed border-[#151a2e] rounded-lg">
                <p className="text-xs font-mono text-[#4b5576] text-center">
                  <Info size={16} className="inline mr-2 text-[#4361ee]" />
                  Awaiting scan data... Click "Run Real Safe Check" below to query endpoint.
                </p>
              </div>
            )}

            {systemInfo && (
              <div className="mt-4 pt-3 border-t border-[#151a2e] flex items-center justify-between gap-4">
                <span className="text-[9px] font-mono text-[#3d4566] uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={12} className="text-[#6b7294]" /> CPU: {systemInfo.cpuModel} ({systemInfo.cpuCores} Cores)
                </span>
                <span className="text-[9px] font-mono text-[#06d6a0] font-bold">
                  {systemInfo.integrityStatus}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* ═══════════════ TOP ROW — KEY METRICS ═══════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* ═══════════════ MIDDLE ROW — THREAT GAUGE ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="soc-panel rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="soc-label">THREAT ASSESSMENT SCALE</span>
            <span className="font-mono text-xs uppercase tracking-wider font-bold" style={{ color: riskHex }}>
              {riskLevel === 'N/A' ? 'STANDBY' : riskLevel.toUpperCase()}
            </span>
          </div>

          <div className="relative h-3 rounded-full bg-[#151a2e] overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getThreatGradient(riskLevel)}`}
              initial={{ width: '0%' }}
              animate={{ width: getThreatWidth(riskLevel) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
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

          <div className="flex justify-between mt-2">
            {['SAFE', '25%', '50%', '75%', 'CRITICAL'].map((mark) => (
              <span key={mark} className="text-[9px] font-mono text-[#4b5576]/60 tracking-wider">
                {mark}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ═══════════════ SCANNING TRIGGERS ═══════════════ */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-4">
            
            {/* Real Safe Audit Check */}
            <motion.button
              onClick={runRealScan}
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className={`
                inline-flex items-center gap-3 px-6 py-3.5 rounded-lg
                font-mono uppercase tracking-wider text-xs font-semibold
                transition-all duration-300 cursor-pointer
                ${
                  loading
                    ? 'bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] cursor-not-allowed opacity-90'
                    : 'bg-[#4361ee]/10 border border-[#4361ee]/40 text-[#4361ee] hover:bg-[#4361ee]/20 hover:border-[#4361ee]/60 hover:shadow-[0_0_20px_rgba(67,97,238,0.15)]'
                }
              `}
            >
              {loading && activeScanType === 'real' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  AUDITING ENDPOINT...
                </>
              ) : (
                <>
                  <Zap size={14} />
                  RUN REAL SAFE CHECK
                </>
              )}
            </motion.button>

            {/* Simulated Demo Check */}
            <motion.button
              onClick={runDemoScan}
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className={`
                inline-flex items-center gap-3 px-6 py-3.5 rounded-lg
                font-mono uppercase tracking-wider text-xs font-semibold
                transition-all duration-300 cursor-pointer
                ${
                  loading
                    ? 'bg-[#4b5576]/10 border border-[#4b5576]/20 text-[#4b5576] cursor-not-allowed opacity-50'
                    : 'bg-[#06d6a0]/10 border border-[#06d6a0]/30 text-[#06d6a0] hover:bg-[#06d6a0]/20 hover:border-[#06d6a0]/50 hover:shadow-[0_0_20px_rgba(6,214,160,0.15)]'
                }
              `}
            >
              {loading && activeScanType === 'demo' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  SIMULATING THREATS...
                </>
              ) : (
                <>
                  <Play size={12} />
                  RUN SIMULATION SCAN
                </>
              )}
            </motion.button>
          </div>

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
                <div className="relative h-1.5 rounded-full bg-[#151a2e] overflow-hidden mb-5">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${
                      activeScanType === 'real' 
                        ? 'from-[#4361ee] via-[#06d6a0] to-[#4361ee]' 
                        : 'from-[#06d6a0] via-[#00f5a0] to-[#4361ee]'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                </div>

                <div className="soc-panel rounded-lg p-4 space-y-2 bg-[#080a12]/80 border-[#151a2e]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06d6a0] animate-pulse" />
                    <span className="soc-label !mb-0">
                      {activeScanType === 'real' ? 'REAL AUDIT FEED' : 'SIMULATOR LOG STACKS'}
                    </span>
                  </div>
                  <div className="max-h-[150px] overflow-y-auto space-y-1.5">
                    {scanLogs.map((log, i) => (
                      <LogLine
                        key={i}
                        time={log.time}
                        message={log.message}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
