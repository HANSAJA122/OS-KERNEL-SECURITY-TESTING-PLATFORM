'use client';

import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Network, Award, Zap, CheckCircle2 } from 'lucide-react';

const timelineEvents = [
  {
    timeOffset: '-1.8s',
    title: 'Audit Agent Handshake',
    description: 'Defensive monitoring agent handshake verified. Listening on local port 3001.',
    icon: Zap,
    color: 'text-[#4361ee] bg-[#4361ee]/8 border-[#4361ee]/20',
    dotColor: 'bg-[#4361ee]',
  },
  {
    timeOffset: '-1.5s',
    title: 'Kernel Version Audit',
    description: 'Darwin/Linux kernel release details extracted using read-only child process commands.',
    icon: Cpu,
    color: 'text-[#06d6a0] bg-[#06d6a0]/8 border-[#06d6a0]/20',
    dotColor: 'bg-[#06d6a0]',
  },
  {
    timeOffset: '-1.2s',
    title: 'Firewall globalstate Query',
    description: 'System preference com.apple.alf settings scanned. Global state verified successfully.',
    icon: ShieldCheck,
    color: 'text-[#fbbf24] bg-[#fbbf24]/8 border-[#fbbf24]/20',
    dotColor: 'bg-[#fbbf24]',
  },
  {
    timeOffset: '-0.9s',
    title: 'Network Socket Extraction',
    description: 'Audit of active TCP listener sockets completed. Total active socket channels counted.',
    icon: Network,
    color: 'text-[#4361ee] bg-[#4361ee]/8 border-[#4361ee]/20',
    dotColor: 'bg-[#4361ee]',
  },
  {
    timeOffset: '-0.4s',
    title: 'Defensive Score Calculation',
    description: 'Risk analysis weights calculated. Deductions made for alerts, final score logged.',
    icon: Award,
    color: 'text-[#06d6a0] bg-[#06d6a0]/8 border-[#06d6a0]/20',
    dotColor: 'bg-[#06d6a0]',
  },
  {
    timeOffset: '0.0s',
    title: 'Security Report Finalized',
    description: 'Assessment compliance payload constructed. Visual metrics synchronized with SOC dashboard.',
    icon: CheckCircle2,
    color: 'text-[#06d6a0] bg-[#06d6a0]/8 border-[#06d6a0]/20',
    dotColor: 'bg-[#06d6a0] shadow-[0_0_8px_#06d6a0]',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function ActivityTimeline({ reportData }) {
  const isAgentActive = reportData && !Array.isArray(reportData) && reportData.agentConnected;
  const lastScan = reportData ? 'SEC SCAN INITIATED' : 'WAITING FOR INITIAL SCAN';

  return (
    <section id="timeline" className="soc-section py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[10px] text-[#06d6a0] uppercase tracking-widest">
            AUDIT TRAIL
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-white mt-3">
            SECURITY ACTIVITY TIMELINE
          </h2>
          <p className="text-[#4b5576] text-xs font-mono max-w-lg mx-auto mt-2">
            Step-by-step event trace of safe defensive security audits performed by the monitoring suite.
          </p>
        </motion.div>

        {/* ── Timeline Container ── */}
        <div className="relative pl-6 sm:pl-8 border-l border-[#151a2e] ml-2 sm:ml-4 space-y-10">
          
          {/* Vertical glowing bar */}
          <div className="absolute left-[-1px] top-4 bottom-4 w-px bg-gradient-to-b from-[#06d6a0]/40 via-[#4361ee]/30 to-transparent pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-8"
          >
            {timelineEvents.map((event, idx) => {
              const Icon = event.icon;
              
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative flex flex-col sm:flex-row gap-2 sm:gap-6 items-start"
                >
                  {/* Timeline Dot Indicator */}
                  <span className={`absolute left-[-31px] sm:left-[-39px] top-1.5 h-3 w-3 rounded-full border-2 border-[#05060b] ${event.dotColor}`} />

                  {/* Left Side: Time Offset badge */}
                  <span className="font-mono text-[10px] font-semibold text-[#4b5576] shrink-0 w-16 pt-1">
                    {event.timeOffset}
                  </span>

                  {/* Right Side: Log Content Panel */}
                  <div className="soc-panel rounded-xl p-5 flex-1 w-full flex items-start gap-4">
                    {/* Icon Wrapper */}
                    <div className={`p-2.5 rounded-lg border shrink-0 ${event.color}`}>
                      <Icon size={16} />
                    </div>

                    {/* Text Details */}
                    <div>
                      <h4 className="text-white font-mono text-sm font-semibold tracking-wide flex items-center gap-2">
                        {event.title}
                        {idx === timelineEvents.length - 1 && (
                          <span className="px-2 py-0.5 rounded-full border border-[#06d6a0]/25 bg-[#06d6a0]/8 font-mono text-[9px] text-[#06d6a0] font-bold uppercase tracking-wider animate-pulse">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#8892b0] leading-relaxed mt-1.5">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Timeline Metadata Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 soc-panel rounded-xl p-4 flex items-center justify-between border-t border-t-[#151a2e]"
        >
          <span className="text-[10px] font-mono text-[#4b5576] uppercase tracking-wider">
            TIMELINE TRACE STATUS: <span className="text-white font-bold">{lastScan}</span>
          </span>
          <span className="text-[9px] font-mono text-[#6b7294] uppercase tracking-wider">
            CONNECTION CHANNEL: <span className={isAgentActive ? 'text-[#06d6a0]' : 'text-amber-400'}>
              {isAgentActive ? 'LIVE WEBSOCKET / TCP' : 'SIMULATION TUNNEL'}
            </span>
          </span>
        </motion.div>

      </div>
    </section>
  );
}
