/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Clock, 
  FileText, 
  Unlink, 
  EyeOff, 
  User, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  ArrowUpRight 
} from 'lucide-react';
import { ActiveModalType } from '../types';

interface FeatureCardsProps {
  onSelectFeature: (type: ActiveModalType) => void;
}

export default function FeatureCards({ onSelectFeature }: FeatureCardsProps) {
  
  // Section 2 - The Problem Cards
  const problems = [
    {
      title: 'Delayed Diagnosis',
      desc: 'Patients in remote rural communities wait weeks or travel miles to see a physician, causing minor treatable cases to progress to advanced critical stages.',
      icon: Clock,
      color: 'bg-rose-50 text-rose-600 border-rose-100/40',
    },
    {
      title: 'Manual Paperwork',
      desc: 'ASHA workers and rural nurses spend valuable hours manually writing paper logs, leading to transcription errors and delayed medical registers.',
      icon: FileText,
      color: 'bg-amber-50 text-amber-600 border-amber-100/40',
    },
    {
      title: 'Disconnected Systems',
      desc: 'Frontline workers lack direct real-time communication bridges to referral clinics, leaving high-risk patients stranded without triage validation.',
      icon: Unlink,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100/40',
    },
    {
      title: 'Lack of Visibility',
      desc: 'District Health Officers lack regional epidemiological dashboards, leaving them unable to track disease surges, plan interventions, or allocate vaccines.',
      icon: EyeOff,
      color: 'bg-slate-50 text-slate-600 border-slate-100/40',
    }
  ];

  // Section 3 - Our Solution Cards
  const solutions = [
    {
      id: 'symptom' as const,
      role: 'Citizen',
      title: 'AI Symptom Reporting',
      desc: 'Empowers citizens to input symptoms in native dialects. Gemini instantly analyzes complaints, translates logs, and alerts local ASHA workers.',
      icon: User,
      color: 'from-blue-50/50 to-blue-100/30 text-blue-600 border-blue-100',
      tag: 'Empowering Citizens',
    },
    {
      id: 'copilot' as const, // Maps to asha/verification
      role: 'ASHA Worker',
      title: 'Field Verification',
      desc: 'Enables mobile-first physical checks. ASHA workers receive local alerts, confirm clinical conditions, and instantly escalate high-risk red-flags.',
      icon: ShieldCheck,
      color: 'from-rose-50/50 to-rose-100/30 text-rose-600 border-rose-100',
      tag: 'Frontline Support',
    },
    {
      id: 'copilot' as const, // Maps to doctor
      role: 'Doctor',
      title: 'Clinical Decision Support',
      desc: 'Equips physicians with an interactive assistant. Recommends WHO protocols, flags drug conflicts, and auto-generates structured SOAP medical notes.',
      icon: Activity,
      color: 'from-emerald-50/50 to-emerald-100/30 text-emerald-600 border-emerald-100',
      tag: 'Clinical Intelligence',
    },
    {
      id: 'dashboard' as const, // Maps to DHO
      role: 'District Health Officer',
      title: 'Population Health Intelligence',
      desc: 'Provides central administrators with geocoded heatmaps, predictive vector alerts, and real-time resource-allocation telemetry.',
      icon: BarChart3,
      color: 'from-amber-50/50 to-amber-100/30 text-amber-600 border-amber-100',
      tag: 'Epidemiological Map',
    }
  ];

  return (
    <div id="features" className="space-y-24 py-20 bg-white relative overflow-hidden">
      {/* Background soft glow accents */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-50/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= SECTION 2: THE PROBLEM ================= */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-rose-600 uppercase bg-rose-50 px-3.5 py-1.5 rounded-full font-mono"
          >
            The Critical Gap
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight"
          >
            Healthcare Challenges We Solve
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans max-w-xl mx-auto"
          >
             Frontline clinics in underserved areas face systemic hurdles that inhibit timely care delivery. Our goal is to dismantle these barriers.
          </motion.p>
        </div>

        {/* 4-Column Problem Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 transition-all hover:shadow-lg hover:shadow-slate-100/50 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${prob.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-display font-bold text-slate-950">{prob.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{prob.desc}</p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Challenge 0{idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= SECTION 3: OUR SOLUTION ================= */}
      <section className="max-w-7xl mx-auto px-6 relative z-10 border-t border-slate-100 pt-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3.5 py-1.5 rounded-full font-mono"
          >
            Digital Architecture
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight"
          >
            One Intelligent Healthcare Ecosystem
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans max-w-xl mx-auto"
          >
            A unified pipeline bridging local community health needs with district-wide medical administration using secure data sync and Gemini reasoning.
          </motion.p>
        </div>

        {/* 4-Column Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.6 }}
                whileHover={{ y: -8 }}
                onClick={() => onSelectFeature(sol.id)}
                className="group bg-white border border-slate-100 shadow-sm hover:shadow-xl rounded-[32px] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                {/* Translucent background elements */}
                <div className="absolute inset-0 bg-radial from-slate-50/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${sol.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-slate-300 group-hover:text-slate-950 transition-colors duration-300 p-1.5 bg-slate-50/50 rounded-lg">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-1 block">
                      {sol.tag}
                    </span>
                    <h4 className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">
                      {sol.role}
                    </h4>
                    <h3 className="text-base font-display font-extrabold text-slate-950 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {sol.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                      {sol.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 border-t border-slate-50 pt-4 mt-6 group-hover:border-slate-100 transition-colors duration-300">
                  <span className="font-sans">Explore Module Details</span>
                  <span className="text-[10px] font-mono opacity-60">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
