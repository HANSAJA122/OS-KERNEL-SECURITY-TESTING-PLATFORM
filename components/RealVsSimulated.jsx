'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Code2, Layers, AlertCircle, Terminal, HelpCircle, HardDrive, RefreshCw } from 'lucide-react';

const realFeatures = [
  {
    icon: Code2,
    title: 'Next.js App Core & Server Routing',
    description: 'Production-ready Next.js backend API architecture query endpoints linking directly to host terminals.',
  },
  {
    icon: Layers,
    title: 'React Engine & State Orchestration',
    description: 'Dynamic parent-child state synchronization for dashboard widgets and report metrics on scan completion.',
  },
  {
    icon: RefreshCw,
    title: 'Safe Read-Only Agent Integrations',
    description: 'Active shell command executions (uname, ps, sw_vers) translating actual OS statistics into JSON payloads.',
  },
  {
    icon: Cpu,
    title: 'Real-Time Risk Scoring Algorithm',
    description: 'Numerical scoring matrix checking and deducting points relative to active ports, firewall, and process loads.',
  },
  {
    icon: ShieldCheck,
    title: 'Premium CSS SOC Aesthetics',
    description: 'Highly customized Tailwind visual themes, scan line animations, threat-bar scales, and spring animations.',
  },
];

const simulatedFeatures = [
  {
    icon: AlertCircle,
    title: 'Active Exploit Injections',
    description: 'Simulates memory protection failures without executing buffer overflows or corrupting host RAM.',
  },
  {
    icon: Terminal,
    title: 'Syscall Address Bypasses',
    description: 'Illustrates system call table overrides in a safe mock sandbox instead of modifying core system interrupt maps.',
  },
  {
    icon: HardDrive,
    title: 'Driver Memory Vulnerabilities',
    description: 'Emulates driver signature verification advisories safely without loading unsigned kernel extensions.',
  },
  {
    icon: HelpCircle,
    title: 'Privilege Escalation Scans',
    description: 'Models user-to-kernel mode privilege bypass boundary alerts without executing actual escalation code.',
  },
  {
    icon: HardDrive,
    title: 'Storage Encryption & OS compliance',
    description: 'Emulates corporate endpoint policy checks for FileVault disk encryption and update patch audits.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function RealVsSimulated() {
  return (
    <section id="integrity" className="soc-section py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="font-mono text-[10px] text-[#06d6a0] uppercase tracking-widest">
            SYSTEM INTEGRITY ANALYSIS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-white mt-3">
            PROJECT DESIGN TRANSPARENCY
          </h2>
          <p className="text-[#4b5576] text-xs font-mono max-w-lg mx-auto mt-2">
            Detailed matrix overview outlining our real-world defensive telemetry and the simulated exploit sandbox.
          </p>
        </motion.div>

        {/* ── Side-by-Side Comparison Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ═══════════════ LEFT PANEL: REAL DEFENSIVE CORE ═══════════════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-6"
          >
            {/* Side Header */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-[#06d6a0]/30 bg-[#06d6a0]/8">
              <span className="status-dot-green h-2 w-2 block" />
              <h3 className="font-mono text-xs font-extrabold tracking-widest text-[#06d6a0] uppercase">
                REAL DEFENSIVE SYSTEM CORE
              </h3>
            </div>

            {/* List of Real Features */}
            <div className="space-y-4">
              {realFeatures.map((item, idx) => {
                const Icon = item.icon || ShieldCheck;
                return (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    className="soc-panel rounded-xl p-5 border-l-2 border-l-[#06d6a0] flex gap-4 hover:bg-[#0c0f1a]/85 transition-colors"
                  >
                    <div className="p-2.5 rounded-lg border border-[#06d6a0]/25 bg-[#06d6a0]/8 text-[#06d6a0] shrink-0 h-10 w-10 flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-mono text-sm font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#8892b0] leading-relaxed mt-1.5">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ═══════════════ RIGHT PANEL: SIMULATED THREAT LAB ═══════════════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-6"
          >
            {/* Side Header */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/8">
              <span className="status-dot-red h-2 w-2 block" />
              <h3 className="font-mono text-xs font-extrabold tracking-widest text-[#ef4444] uppercase">
                SIMULATED ATTACK SANDBOX
              </h3>
            </div>

            {/* List of Simulated Features */}
            <div className="space-y-4">
              {simulatedFeatures.map((item, idx) => {
                const Icon = item.icon || AlertCircle;
                return (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    className="soc-panel rounded-xl p-5 border-l-2 border-l-[#ef4444] flex gap-4 hover:bg-[#0c0f1a]/85 transition-colors"
                  >
                    <div className="p-2.5 rounded-lg border border-[#ef4444]/25 bg-[#ef4444]/8 text-[#ef4444] shrink-0 h-10 w-10 flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-mono text-sm font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#8892b0] leading-relaxed mt-1.5">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* Dynamic Architectural Note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="soc-panel rounded-xl p-6 border-t border-[#151a2e] text-center"
        >
          <h4 className="text-white font-mono text-xs font-bold tracking-wider mb-2 uppercase flex items-center justify-center gap-2">
            🔒 EDUCATIONAL COMPLIANCE ASSURANCE
          </h4>
          <p className="text-xs text-[#6b7294] font-mono max-w-2xl mx-auto leading-relaxed">
            By running safe telemetry collections rather than real stack overflows, this application demonstrates
            compliance auditing principles identical to those deployed in actual enterprise security models—keeping
            both the operator and the host machine 100% secure.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
