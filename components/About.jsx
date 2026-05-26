'use client';

import { motion } from 'framer-motion';
import { Cpu, ShieldAlert, Layers, AlertTriangle } from 'lucide-react';

const infoCards = [
  {
    id: 'INTEL-01',
    icon: Cpu,
    accent: 'cyan',
    title: 'What an OS Kernel Is',
    description:
      'The kernel is the core of an operating system that manages hardware, memory, processes, and system resources. It acts as a bridge between software applications and hardware.',
    meterWidth: '85%',
  },
  {
    id: 'INTEL-02',
    icon: ShieldAlert,
    accent: 'cyan',
    title: 'Why Kernel Security Is Important',
    description:
      'The kernel has complete control over the system. A compromised kernel means total system compromise — attackers gain unrestricted access to all data, processes, and hardware.',
    meterWidth: '95%',
  },
  {
    id: 'INTEL-03',
    icon: Layers,
    accent: 'blue',
    title: 'User Mode vs Kernel Mode',
    description:
      'User mode restricts application access to system resources for safety. Kernel mode provides unrestricted hardware access. The boundary between them is a critical security perimeter.',
    meterWidth: '70%',
  },
  {
    id: 'INTEL-04',
    icon: AlertTriangle,
    accent: 'blue',
    title: 'Why Kernel Vulnerabilities Are High Risk',
    description:
      'Kernel vulnerabilities bypass all security mechanisms. They can lead to privilege escalation, data theft, rootkits, and complete system takeover with no user-level detection.',
    meterWidth: '98%',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function About() {
  return (
    <section id="about" className="soc-section py-24 px-6">
      <div className="relative mx-auto max-w-7xl">
        {/* ── Section header ─────────────────────── */}
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
              Intelligence Briefing
            </span>
            <span className="h-px w-8 bg-[#06d6a0]/40" />
          </div>

          <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
            KERNEL SECURITY OVERVIEW
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-[#4b5576]">
            Understanding the foundation of operating system security — from
            kernel architecture to the critical attack surfaces that demand
            constant vigilance.
          </p>
        </motion.div>

        {/* ── Cards grid ─────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {infoCards.map((card) => {
            const Icon = card.icon;
            const accentLine =
              card.accent === 'cyan'
                ? 'bg-[#06d6a0]'
                : 'bg-[#4361ee]';

            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className="group soc-panel soc-bracket rounded-xl p-6 transition-all duration-300 hover:border-[#06d6a0]/30 hover:neon-border-cyan"
              >
                {/* Top accent line */}
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] ${accentLine} opacity-60`}
                />

                {/* Intel ID label */}
                <span className="mb-3 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#4b5576]">
                  {card.id}
                </span>

                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[#06d6a0]/20 bg-[#06d6a0]/[0.08] text-[#06d6a0] transition-colors duration-300 group-hover:bg-[#06d6a0]/[0.14]">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-base font-semibold text-white">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="mb-5 text-sm leading-relaxed text-[#6b7294]">
                  {card.description}
                </p>

                {/* Threat meter */}
                <div className="threat-meter mt-auto">
                  <div
                    className="threat-meter-fill meter-high"
                    style={{ width: card.meterWidth }}
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
