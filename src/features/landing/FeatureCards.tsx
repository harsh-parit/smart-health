/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  User, 
  ShieldAlert, 
  Activity, 
  BarChart3,
  Check 
} from 'lucide-react';
import { ActiveModalType } from '../../types';

interface FeatureCardsProps {
  onSelectFeature: (type: ActiveModalType) => void;
}

export default function FeatureCards({ onSelectFeature }: FeatureCardsProps) {
  
  // SECTION 3: Healthcare Challenges Data
  const challenges = [
    {
      title: 'Delayed Diagnosis',
      desc: 'Patients wait too long before receiving care.',
      illustration: (
        <svg className="w-full h-16 text-rose-500" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="16" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="animate-spin [animation-duration:15s]" />
          <circle cx="25" cy="25" r="2" fill="currentColor" />
          <path d="M25 13V25H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 15L85 35" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="2 2" />
          <circle cx="85" cy="35" r="5" stroke="currentColor" strokeWidth="2" className="animate-pulse" />
          <path d="M50 15H54" stroke="currentColor" strokeWidth="2" />
          <path d="M70 25H74" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      badge: 'Challenge 01',
      bgGlow: 'from-rose-500/5 to-transparent'
    },
    {
      title: 'Disconnected Healthcare Records',
      desc: 'Health information is fragmented across systems.',
      illustration: (
        <svg className="w-full h-16 text-indigo-500" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="10" width="22" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
          <line x1="20" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="1.5" />
          
          <rect x="63" y="14" width="22" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
          <line x1="68" y1="22" x2="80" y2="22" stroke="currentColor" strokeWidth="1.5" />
          <line x1="68" y1="28" x2="76" y2="28" stroke="currentColor" strokeWidth="1.5" />

          {/* Broken disconnected bridge arrow */}
          <path d="M43 25C48 20, 52 30, 57 25" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
          <circle cx="50" cy="24" r="2" fill="#f43f5e" className="animate-ping" />
        </svg>
      ),
      badge: 'Challenge 02',
      bgGlow: 'from-indigo-500/5 to-transparent'
    },
    {
      title: 'Limited District Visibility',
      desc: 'Officials lack real-time insights into disease trends.',
      illustration: (
        <svg className="w-full h-16 text-amber-500" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wave line grid */}
          <path d="M10 38 Q 30 25, 50 35 T 90 28" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M10 28 Q 30 18, 50 25 T 90 18" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Obscured spotlight geopin */}
          <g className="translate-x-[15px] -translate-y-[5px]">
            <path d="M35 15C31.5 15 28.5 17.5 28.5 21C28.5 25.5 35 32 35 32C35 32 41.5 25.5 41.5 21C41.5 17.5 38.5 15 35 15Z" fill="currentColor" />
            <circle cx="35" cy="20.5" r="2" fill="white" />
          </g>

          <g className="translate-x-[35px] translate-y-[2px]">
            <path d="M35 15C31.5 15 28.5 17.5 28.5 21C28.5 25.5 35 32 35 32C35 32 41.5 25.5 41.5 21C41.5 17.5 38.5 15 35 15Z" fill="#cbd5e1" />
            <circle cx="35" cy="20.5" r="2" fill="white" />
          </g>

          {/* Radar/Scan effect */}
          <circle cx="50" cy="18" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 1" className="animate-pulse" />
        </svg>
      ),
      badge: 'Challenge 03',
      bgGlow: 'from-amber-500/5 to-transparent'
    },
    {
      title: 'Manual Field Reporting',
      desc: 'ASHA Workers spend valuable time on paperwork.',
      illustration: (
        <svg className="w-full h-16 text-sky-500" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="35" y="8" width="30" height="34" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M43 8C43 6 45 4 48 4H52C55 4 57 6 57 8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="8" r="2.5" fill="currentColor" />
          
          <line x1="42" y1="18" x2="52" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="42" y1="24" x2="58" y2="24" stroke="currentColor" strokeWidth="1.5" />
          <line x1="42" y1="30" x2="54" y2="30" stroke="currentColor" strokeWidth="1.5" />

          {/* Running Clock hands overlaying representing lost time */}
          <circle cx="78" cy="30" r="8" stroke="#f43f5e" strokeWidth="1.5" />
          <path d="M78 25V30H82" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      badge: 'Challenge 04',
      bgGlow: 'from-sky-500/5 to-transparent'
    }
  ];

  // SECTION 4: Our Solution Data
  const solutions = [
    {
      id: 'symptom' as const,
      role: 'Citizen',
      title: 'AI Symptom Reporting',
      desc: 'Connect with local care instantly using smart diagnostic translation.',
      icon: User,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/50',
      bullets: [
        'AI Symptom Reporting',
        'Prescription Upload',
        'Health Reports'
      ]
    },
    {
      id: 'copilot' as const,
      role: 'ASHA Worker',
      title: 'Frontline Assistant',
      desc: 'Empower field visits with intelligent offline risk evaluation guides.',
      icon: ShieldAlert,
      color: 'from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/50',
      bullets: [
        'Patient Registration',
        'Home Visits',
        'Risk Verification'
      ]
    },
    {
      id: 'copilot' as const,
      role: 'Doctor',
      title: 'Clinical Copilot',
      desc: 'Accelerate patient queues and automate complete health records.',
      icon: Activity,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/50',
      bullets: [
        'Patient Queue',
        'Consultation',
        'SOAP Notes',
        'AI Assistance'
      ]
    },
    {
      id: 'dashboard' as const,
      role: 'District Officer',
      title: 'Health Dashboard',
      desc: 'Real-time regional vector disease surveillance for local officials.',
      icon: BarChart3,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/50',
      bullets: [
        'Disease Trends',
        'Resource Allocation',
        'Alerts',
        'Analytics'
      ]
    }
  ];

  return (
    <div id="features" className="space-y-28 py-24 bg-white relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-50/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-50/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= SECTION 3: THE CHALLENGES ================= */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-rose-600 uppercase bg-rose-50 px-3.5 py-1.5 rounded-full font-mono inline-block"
          >
            Systemic Roadblocks
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight"
          >
            Challenges in Rural Healthcare
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-500 leading-relaxed font-sans max-w-lg mx-auto font-medium"
          >
            Frontline workers and remote clinics encounter significant infrastructural obstacles that we aim to systematically target and resolve.
          </motion.p>
        </div>

        {/* 4-Column Challenge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="bg-slate-50/40 hover:bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-slate-100/50 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${item.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              
              <div className="space-y-4 relative z-10">
                {/* Custom SVG Illustration */}
                <div className="h-16 flex items-center justify-center bg-white/50 group-hover:bg-white rounded-2xl border border-slate-100/50 transition-colors p-2">
                  {item.illustration}
                </div>
                
                <div className="space-y-2 text-left">
                  <h3 className="text-sm font-display font-extrabold text-slate-950 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-5 text-[9px] font-mono text-slate-400 uppercase tracking-widest relative z-10">
                {item.badge}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 4: THE SOLUTIONS ================= */}
      <section className="max-w-7xl mx-auto px-6 relative z-10 border-t border-slate-100/80 pt-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3.5 py-1.5 rounded-full font-mono inline-block"
          >
            Digital Ecosystem
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight"
          >
            One Intelligent Healthcare Ecosystem
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-500 leading-relaxed font-sans max-w-lg mx-auto font-medium"
          >
            Integrating clinic records, frontline worker verification grids, and physician decision copilots to deliver optimized community surveillance.
          </motion.p>
        </div>

        {/* 4-Column Solutions Bento-esque Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((sol, idx) => {
            const IconComponent = sol.icon;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                onClick={() => onSelectFeature(sol.id)}
                className="group bg-white border border-slate-200/60 shadow-sm hover:shadow-xl rounded-[32px] p-6.5 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                {/* Dynamic radial gradient focus */}
                <div className="absolute inset-0 bg-radial from-slate-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${sol.color} border`}>
                      <IconComponent className="w-5.5 h-5.5" />
                    </div>
                    <div className="text-slate-300 group-hover:text-slate-800 transition-colors p-1.5 bg-slate-50/50 rounded-xl">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="text-left space-y-2">
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest leading-none block">
                      {sol.role}
                    </span>
                    <h3 className="text-base font-display font-extrabold text-slate-950 group-hover:text-blue-600 transition-colors duration-300">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                      {sol.desc}
                    </p>
                  </div>

                  {/* Bullet / Details list */}
                  <div className="border-t border-slate-100/80 pt-4.5 space-y-2.5 text-left">
                    {sol.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-center gap-2 text-xs text-slate-600 font-sans">
                        <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="font-medium">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom link bar */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 pt-5 mt-6 border-t border-slate-50/50 group-hover:border-slate-100/80 transition-colors relative z-10">
                  <span>Explore Module Specs</span>
                  <span className="text-[10px] font-mono transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
