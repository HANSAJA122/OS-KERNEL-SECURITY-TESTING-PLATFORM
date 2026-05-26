'use client';

import { motion } from 'framer-motion';
import {
  MemoryStick,
  Terminal,
  HardDrive,
  KeyRound,
  Puzzle,
  RefreshCw,
} from 'lucide-react';

/* ── Risk severity config ────────────────── */
const riskConfig = {
  Critical: {
    badge: 'bg-red-500/10 text-red-400 border border-red-500/25',
    dot: 'status-dot-red',
    meter: 'meter-critical',
    meterWidth: '90%',
  },
  High: {
    badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/25',
    dot: 'status-dot-amber',
    meter: 'meter-high',
    meterWidth: '75%',
  },
  Medium: {
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    dot: '',
    meter: 'meter-medium',
    meterWidth: '50%',
  },
  Low: {
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    dot: '',
    meter: 'meter-low',
    meterWidth: '25%',
  },
};

/* ── Module data ─────────────────────────── */
const modules = [
  {
    id: 'MOD-01',
    icon: MemoryStick,
    title: 'Memory Safety Testing',
    description:
      'Tests for buffer overflows, use-after-free, and memory corruption vulnerabilities in kernel memory management.',
    risk: 'High',
    objective: 'Verify kernel memory protection mechanisms.',
  },
  {
    id: 'MOD-02',
    icon: Terminal,
    title: 'System Call Validation',
    description:
      'Validates input sanitization and access control on system call interfaces between user space and kernel space.',
    risk: 'Medium',
    objective: 'Ensure proper system call filtering and validation.',
  },
  {
    id: 'MOD-03',
    icon: HardDrive,
    title: 'Driver Security Testing',
    description:
      'Analyzes kernel-mode drivers for security flaws, improper input handling, and privilege escalation paths.',
    risk: 'High',
    objective: 'Identify vulnerable or unsigned drivers.',
  },
  {
    id: 'MOD-04',
    icon: KeyRound,
    title: 'Privilege Escalation Risk Analysis',
    description:
      'Examines potential paths for unauthorized privilege elevation from user mode to kernel mode.',
    risk: 'Critical',
    objective: 'Detect privilege boundary violations.',
  },
  {
    id: 'MOD-05',
    icon: Puzzle,
    title: 'Kernel Module Analysis',
    description:
      'Reviews loaded kernel modules for integrity, authenticity, and potential malicious modifications.',
    risk: 'Medium',
    objective: 'Verify module signing and permissions.',
  },
  {
    id: 'MOD-06',
    icon: RefreshCw,
    title: 'Patch Compliance Checking',
    description:
      'Checks kernel version and applied patches against known vulnerability databases and security advisories.',
    risk: 'Low',
    objective: 'Ensure kernel is up to date with security patches.',
  },
];

/* ── Animation variants ──────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

export default function TestingModules() {
  return (
    <section id="modules" className="soc-section py-24 px-6">
      <div className="relative mx-auto max-w-7xl">
        {/* ── Section header ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          {/* Small label with side lines */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#06d6a0]/40" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#06d6a0]">
              Testing Arsenal
            </span>
            <span className="h-px w-8 bg-[#06d6a0]/40" />
          </div>

          <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
            SECURITY TESTING MODULES
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-[#4b5576]">
            Comprehensive kernel security assessment tools designed to uncover
            vulnerabilities across every critical attack surface.
          </p>
        </motion.div>

        {/* ── Module cards grid ────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {modules.map((mod) => {
            const Icon = mod.icon;
            const risk = riskConfig[mod.risk];

            return (
              <motion.div
                key={mod.id}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group soc-panel rounded-xl p-6 flex flex-col transition-all duration-300 hover:border-[#06d6a0]/20 hover:shadow-lg"
              >
                {/* Top row — Module ID + Risk badge */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#4b5576]">
                    {mod.id}
                  </span>

                  {/* Severity badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${risk.badge}`}
                  >
                    {risk.dot && (
                      <span className={`${risk.dot} !h-[6px] !w-[6px]`} />
                    )}
                    {mod.risk}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#151a2e] p-2.5 text-[#06d6a0]">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="mb-2 font-semibold text-white">{mod.title}</h3>

                {/* Description */}
                <p className="mb-5 flex-1 text-sm leading-relaxed text-[#6b7294]">
                  {mod.description}
                </p>

                {/* Objective — terminal style */}
                <div className="mb-5 rounded-lg bg-[#080a12] px-3 py-2">
                  <p className="font-mono text-xs leading-relaxed">
                    <span className="text-[#06d6a0]">{'> '}</span>
                    <span className="text-[#8892b0]">{mod.objective}</span>
                  </p>
                </div>

                {/* Threat meter */}
                <div className="threat-meter mt-auto">
                  <div
                    className={`threat-meter-fill ${risk.meter}`}
                    style={{ width: risk.meterWidth }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
