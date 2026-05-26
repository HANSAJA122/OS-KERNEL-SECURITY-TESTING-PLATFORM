'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  User,
  ShieldAlert,
  Terminal,
  Bug,
  Skull,
  Wrench,
  ArrowUpCircle,
  HardDrive,
  Puzzle,
} from 'lucide-react';

const terms = [
  {
    title: 'Kernel',
    icon: Cpu,
    description:
      'The kernel is the core program of an operating system. It controls everything: memory management, process scheduling, device communication, and system security. Think of it as the \'brain\' of your computer that runs with the highest level of trust and access.',
  },
  {
    title: 'User Mode',
    icon: User,
    description:
      'User mode is a restricted processing mode where applications run with limited access to system resources. Programs in user mode cannot directly access hardware or critical memory areas. This isolation protects the system from buggy or malicious applications.',
  },
  {
    title: 'Kernel Mode',
    icon: ShieldAlert,
    description:
      'Kernel mode is a privileged processing mode where code runs with complete, unrestricted access to all hardware and memory. Only trusted operating system code should run in kernel mode. A bug here can crash the entire system.',
  },
  {
    title: 'System Call',
    icon: Terminal,
    description:
      'A system call is the controlled gateway through which user-mode programs request services from the kernel, such as reading files, creating processes, or accessing network resources. It\'s like a secure API between applications and the OS core.',
  },
  {
    title: 'Vulnerability',
    icon: Bug,
    description:
      'A vulnerability is a weakness or flaw in software code that could be exploited by attackers to perform unauthorized actions. Kernel vulnerabilities are especially dangerous because they affect the most privileged layer of the system.',
  },
  {
    title: 'Exploit',
    icon: Skull,
    description:
      'An exploit is a piece of code or technique that takes advantage of a vulnerability to cause unintended behavior, such as gaining unauthorized access, crashing a system, or stealing data. Kernel exploits can give attackers complete system control.',
  },
  {
    title: 'Patch',
    icon: Wrench,
    description:
      'A patch is a software update released to fix vulnerabilities, bugs, or security issues. Kernel patches are critical and should be applied promptly because unpatched kernels remain vulnerable to known attacks.',
  },
  {
    title: 'Privilege Escalation',
    icon: ArrowUpCircle,
    description:
      'Privilege escalation occurs when an attacker gains higher access rights than they\'re authorized to have. In kernel security, this typically means moving from user mode to kernel mode, gaining root or administrator access without authorization.',
  },
  {
    title: 'Driver',
    icon: HardDrive,
    description:
      'A driver is a specialized program that allows the operating system kernel to communicate with hardware devices like graphics cards, network adapters, and storage controllers. Drivers run in kernel mode, so a vulnerable driver can compromise the entire system.',
  },
  {
    title: 'Kernel Module',
    icon: Puzzle,
    description:
      'A kernel module is a piece of code that can be loaded into or unloaded from the kernel at runtime to extend its functionality, such as adding support for a new filesystem or device. Malicious modules can be used to create rootkits.',
  },
];

export default function LearningGuide() {
  const [expanded, setExpanded] = useState({});

  const toggle = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section id="learning" className="soc-section py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="font-mono text-[10px] text-[#06d6a0] uppercase tracking-widest">
            KNOWLEDGE BASE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-3">
            SECURITY CONCEPTS GUIDE
          </h2>
          <p className="text-[#4b5576] text-sm max-w-xl mx-auto">
            Essential kernel security concepts explained for students
          </p>
        </motion.div>

        {/* ── Accordion cards ── */}
        <div className="flex flex-col gap-3">
          {terms.map((term, idx) => {
            const isOpen = !!expanded[idx];
            const Icon = term.icon;
            const kbTag = `KB-${String(idx + 1).padStart(2, '0')}`;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="soc-panel rounded-xl overflow-hidden"
              >
                {/* Header button */}
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer group transition-colors hover:bg-[#0c0f1a]/80"
                >
                  <div className="flex items-center gap-3">
                    {/* KB tag */}
                    <span className="font-mono text-[10px] text-[#4b5576] bg-[#151a2e] rounded px-2 py-0.5 shrink-0">
                      {kbTag}
                    </span>

                    {/* Icon */}
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#06d6a0]/8 text-[#06d6a0] shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>

                    {/* Term name */}
                    <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                      {term.title}
                    </span>
                  </div>

                  {/* Chevron */}
                  <span className="text-[#4b5576] shrink-0 transition-colors group-hover:text-[#06d6a0]">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {/* Expandable body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="ml-12 pl-4 pr-5 pb-5 pt-1 border-l-2 border-[#06d6a0]/30">
                        <p className="text-[#8892b0] text-sm leading-relaxed mb-3">
                          {term.description}
                        </p>
                        <span className="inline-block font-mono text-[9px] text-[#3d4566] bg-[#0c0f1a] border border-[#151a2e] rounded px-2 py-0.5 tracking-wider uppercase">
                          Classification: Educational
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
