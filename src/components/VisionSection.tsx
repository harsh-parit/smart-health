/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Network, Sparkles, Smartphone, Award, Server, Database, ShieldCheck, HeartPulse } from 'lucide-react';

export default function VisionSection() {
  const stack = [
    { name: 'React 19 & Vite', desc: 'Ultra-fast, responsive state rendering and optimized client packaging.', icon: Smartphone, color: 'text-blue-500 bg-blue-50' },
    { name: 'Gemini AI Pro', desc: 'Differential clinical diagnostics reasoning and ambient chart transcription.', icon: Sparkles, color: 'text-amber-500 bg-amber-50' },
    { name: 'Google Cloud Firestore', desc: 'Secure local-offline document caches syncing to global cloud targets.', icon: Database, color: 'text-orange-500 bg-orange-50 font-mono' },
    { name: 'Material Design 3', desc: 'Intuitive design tokens, dynamic content coloring, and high-contrast styling.', icon: HeartPulse, color: 'text-rose-500 bg-rose-50' }
  ];

  return (
    <>
      {/* Concept & Vision Section */}
      <section id="vision" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Visual Comparison Sheet */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 bg-slate-50 border border-slate-100/80 rounded-[2.5rem] p-8 space-y-6 shadow-inner"
            >
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest block">
                The Healthcare Gap
              </span>
              <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                Addressing Key Barriers in Underserved Clinics
              </h3>
              
              <div className="space-y-4">
                {/* Challenge Item 1 */}
                <div className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Expert Shortages</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Rural health posts are usually run by junior nursing assistants. AI provides reliable diagnostic support guards.</p>
                  </div>
                </div>

                {/* Challenge Item 2 */}
                <div className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Connectivity Latency</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Remote centers experience severe network dropout. Design focuses on edge storage syncing to central data.</p>
                  </div>
                </div>

                {/* Challenge Item 3 */}
                <div className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Outbreak Visibility</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Health departments cannot track rural vectors in time. geocoded telemetry automates outbreak mapping.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1.5 rounded-full font-mono">
                Concept & Strategy
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-950 tracking-tight leading-tight">
                Empowering frontline providers with clinical-grade reasoning systems.
              </h2>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed font-sans">
                Our vision isn’t to replace human clinicians, but to give them a staff-level assistant directly on their tablets. By integrating Google's Gemini models with robust clinical schemas, we help providers check symptoms, validate prescription guidelines, and identify dangerous localized disease vectors.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-800 text-sm">Regulatory Ready</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Built with robust medical safety constraints, auditing trails, and privacy guards.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-800 text-sm">Offline First</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Local-caching databases sync automatically the moment a cellular signal recovers.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tech Stack Specifications Block */}
      <section id="tech-stack" className="py-24 bg-slate-50/70 border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-50 px-3 py-1.5 rounded-full font-mono">
              The Architecture Blueprint
            </span>
            <h2 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">
              A Complete Stack Built for Impact
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Designed according to modern software enterprise guidelines, facilitating instant deployments and cloud security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-100/80 p-6 rounded-[1.75rem] shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tech.color}`}>
                  <tech.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-sm">{tech.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
