'use client';

import { motion } from 'framer-motion';
import { Shield, Globe, Mail, BookOpen } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Modules', href: '#modules' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Report', href: '#report' },
  { label: 'Learning', href: '#learning' },
];

const socialIcons = [
  { icon: Globe, label: 'GitHub' },
  { icon: Mail, label: 'Mail' },
  { icon: BookOpen, label: 'Docs' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#050610] border-t border-[#151a2e]">
      <motion.div
        className="mx-auto max-w-6xl px-6 py-16 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* ── Brand ── */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-[#06d6a0]" />
          <span className="font-mono text-sm font-semibold text-[#06d6a0] tracking-wider">
            KSTP
          </span>
          <span className="text-[#2a3050]">|</span>
          <span className="font-mono text-xs text-[#4b5576] tracking-wide">
            Kernel Security Testing Platform
          </span>
        </motion.div>

        {/* ── Tagline ── */}
        <motion.p
          variants={itemVariants}
          className="mx-auto max-w-2xl text-sm leading-relaxed text-[#4b5576] mb-8"
        >
          Developed as an educational cybersecurity project for learning OS Kernel Security Testing
          concepts.
        </motion.p>

        {/* ── Animated gradient divider ── */}
        <motion.div variants={itemVariants} className="relative mx-auto mb-8 h-px w-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#151a2e] to-transparent" />
          <motion.div
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-cyan-500/40 blur-sm"
            animate={{ left: ['-6rem', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* ── Quick links ── */}
        <motion.nav
          variants={itemVariants}
          aria-label="Footer quick links"
          className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {quickLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[10px] uppercase tracking-wider text-[#4b5576] transition-colors duration-200 hover:text-[#06d6a0]"
            >
              {label}
            </a>
          ))}
        </motion.nav>

        {/* ── Social icons ── */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex items-center justify-center gap-4"
        >
          {socialIcons.map(({ icon: Icon, label }) => (
            <span
              key={label}
              aria-label={label}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#151a2e] bg-[#0c0f1a] text-[#4b5576] transition-all duration-200 hover:border-[#06d6a0]/30 hover:text-[#06d6a0] hover:shadow-[0_0_12px_rgba(6,214,160,0.08)] cursor-pointer"
            >
              <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
            </span>
          ))}
        </motion.div>

        {/* ── Copyright ── */}
        <motion.p
          variants={itemVariants}
          className="font-mono text-[10px] text-[#3d4566] mb-2"
        >
          © 2026 KSTP — Kernel Security Testing Platform. Educational Use Only.
        </motion.p>

        {/* ── Disclaimer ── */}
        <motion.p
          variants={itemVariants}
          className="text-[9px] leading-relaxed text-[#2a3050] max-w-lg mx-auto mb-10"
        >
          This platform uses only simulated data for educational purposes. No real security testing
          is performed. All vulnerability data shown is synthetic and for demonstration only.
        </motion.p>

        {/* ── Heartbeat flatline decoration ── */}
        <motion.div variants={itemVariants} className="relative mx-auto h-px w-full max-w-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[#0c0f1a]" />
          <motion.div
            className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent"
            animate={{ left: ['-8rem', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    </footer>
  );
}
