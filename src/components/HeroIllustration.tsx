/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { User, Sparkles, ShieldCheck, Activity, BarChart3, ChevronDown } from 'lucide-react';

export default function HeroIllustration() {
  const steps = [
    {
      id: 'citizen',
      title: 'Citizen',
      desc: 'Reports Symptoms',
      icon: User,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600',
      glow: 'shadow-blue-500/10',
    },
    {
      id: 'gemini',
      title: 'Gemini AI',
      desc: 'Symptom Triage Analysis',
      icon: Sparkles,
      color: 'from-purple-500/15 to-pink-500/15 border-purple-500/30 text-purple-600',
      glow: 'shadow-purple-500/15',
    },
    {
      id: 'asha',
      title: 'ASHA Worker',
      desc: 'Field Risk Verification',
      icon: ShieldCheck,
      color: 'from-[#ec003f]/10 to-rose-500/10 border-[#ec003f]/20 text-[#ec003f]',
      glow: 'shadow-rose-500/10',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      desc: 'Clinical Copilot Consultation',
      icon: Activity,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600',
      glow: 'shadow-emerald-500/10',
    },
    {
      id: 'district',
      title: 'District Dashboard',
      desc: 'Population Health Analytics',
      icon: BarChart3,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600',
      glow: 'shadow-amber-500/10',
    }
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto py-4 flex flex-col items-center">
      {/* Background soft glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Vertical pipeline layout with connecting lines */}
      <div className="relative flex flex-col items-center w-full space-y-5 z-10">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div key={step.id} className="w-full flex flex-col items-center relative">
              {/* Connecting animated line */}
              {idx > 0 && (
                <div className="absolute -top-5 h-5 w-[2px] bg-slate-100 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      y: [-10, 10],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: idx * 0.4
                    }}
                    className="w-[3px] h-3 bg-gradient-to-b from-blue-500 via-purple-500 to-rose-500 rounded-full"
                  />
                </div>
              )}

              {/* Step Card with Motion */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`w-full max-w-sm bg-white/90 backdrop-blur-md border rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all ${step.color} ${step.glow}`}
              >
                {/* Circle Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-slate-50 flex items-center justify-center border border-slate-100 shadow-sm relative shrink-0">
                  <IconComponent className="w-5 h-5" />
                  {idx === 1 && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                    <h3 className="text-sm font-display font-extrabold text-slate-950">{step.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate leading-tight font-sans">{step.desc}</p>
                </div>

                {/* Interactive Dot */}
                <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors shrink-0" />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Accent SVG Background connector indicator */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ec003f" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M 50,0 Q 40,50 50,100" fill="none" stroke="url(#grid-grad)" strokeWidth="1" strokeDasharray="3,3" />
      </svg>
    </div>
  );
}
