'use client';

import { Shield, Terminal, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const terminalLines = [
  { text: '$ sudo kstp --init --mode=educational', type: 'cmd' },
  { text: '[INIT] Loading kernel security modules...', type: 'info' },
  { text: '[AUTH] Certificate validation: ✓ PASSED', type: 'success' },
  { text: '[SCAN] Initializing syscall table monitor...', type: 'info' },
  { text: '[SCAN] Memory protection audit: READY', type: 'info' },
  { text: '[DONE] Platform operational — 0 threats detected', type: 'done' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#05060b] py-20"
    >
      {/* ── BACKGROUND LAYERS ── */}
      {/* 1. Hex-Grid Pattern */}
      <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />

      {/* 2. Scan-Line Effect */}
      <div className="absolute inset-0 scan-line pointer-events-none opacity-20" />

      {/* 3. Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#06d6a0]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[450px] h-[450px] rounded-full bg-[#4361ee]/5 blur-[100px] pointer-events-none" />

      {/* 4. Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 2,
              height: Math.random() * 3 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#06d6a0' : '#4361ee',
              boxShadow: i % 2 === 0 ? '0 0 8px #06d6a0' : '0 0 8px #4361ee',
            }}
            animate={{
              y: [0, -100 - Math.random() * 150],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* 1. Status Badge */}
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#151a2e] bg-[#0c0f1a] font-mono text-[10px] uppercase tracking-wider text-[#4b5576]">
              <span className="status-dot-green inline-block" />
              <span className="text-[#06d6a0] font-bold">[SECURE]</span> Educational Platform
            </div>
          </motion.div>

          {/* 2. Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none"
          >
            <span className="font-mono text-white tracking-tight uppercase neon-glow-cyan">
              OS KERNEL SECURITY
            </span>
            <br />
            <span className="font-mono bg-gradient-to-r from-[#06d6a0] via-[#3b82f6] to-[#4361ee] bg-clip-text text-transparent tracking-tight uppercase">
              TESTING PLATFORM
            </span>
          </motion.h1>

          {/* 3. Subtitle */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-sm sm:text-base text-[#6b7294] leading-relaxed font-mono"
          >
            A safe educational dashboard simulating real-time kernel vulnerability audits, risk vector identification, and defense compliance reports.
          </motion.p>

          {/* 4. Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mt-2">
            <a
              href="#dashboard"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#06d6a0]/30 bg-[#06d6a0]/10 text-xs font-bold font-mono tracking-widest text-[#06d6a0] uppercase transition-all duration-300 hover:bg-[#06d6a0]/20 hover:border-[#06d6a0]/60 hover:shadow-[0_0_20px_rgba(6,214,160,0.15)] cursor-pointer"
            >
              Initialize Demo Test
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#learning"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#1e2540] bg-transparent text-xs font-bold font-mono tracking-widest text-[#4b5576] uppercase transition-all duration-300 hover:border-[#4361ee]/40 hover:text-[#4361ee] cursor-pointer"
            >
              Access Learning Guide
            </a>
          </motion.div>
        </motion.div>

        {/* 5. Terminal Panel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 w-full max-w-xl text-left"
        >
          <div className="soc-panel soc-bracket rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c0f1a] border-b border-[#151a2e]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ef4444]/60" />
                <span className="h-2 w-2 rounded-full bg-[#fbbf24]/60" />
                <span className="h-2 w-2 rounded-full bg-[#06d6a0]/60" />
              </div>
              <span className="text-[10px] text-[#4b5576] font-mono tracking-wide flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-[#4b5576]" />
                root@kernel-sec:~#
              </span>
              <div className="w-12" /> {/* spacer */}
            </div>

            {/* Terminal Body */}
            <div className="p-5 space-y-2 bg-[#080a12]/50 backdrop-blur-md min-h-[170px] flex flex-col justify-center">
              {terminalLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.2, duration: 0.3 }}
                  className="font-mono text-xs text-left tracking-wide"
                >
                  {line.type === 'cmd' ? (
                    <span className="text-[#06d6a0] font-semibold">{line.text}</span>
                  ) : line.type === 'success' ? (
                    <span className="text-[#00f5a0]">{line.text}</span>
                  ) : line.type === 'done' ? (
                    <span className="text-[#3b82f6] font-semibold">{line.text}</span>
                  ) : (
                    <span className="text-[#6b7294]">{line.text}</span>
                  )}
                </motion.div>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 2.5, duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-3.5 bg-[#06d6a0] mt-1"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Horizontal Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#151a2e] to-transparent" />
    </section>
  );
}
