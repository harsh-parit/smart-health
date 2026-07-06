/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Cpu, Activity, ArrowUpRight } from 'lucide-react';
import { ActiveModalType } from '../types';

interface FeatureCardsProps {
  onSelectFeature: (type: ActiveModalType) => void;
}

export default function FeatureCards({ onSelectFeature }: FeatureCardsProps) {
  const cards = [
    {
      id: 'symptom' as const,
      title: 'AI Symptom Analysis',
      description: 'Instant diagnostic triage using advanced neural networks trained for specialized rural cases.',
      icon: Shield,
      color: 'bg-blue-50/70 text-blue-600 border border-blue-100/30',
      borderColor: 'group-hover:border-blue-200',
      iconColor: 'text-blue-600',
      tag: 'Triage & Intake'
    },
    {
      id: 'copilot' as const,
      title: 'Doctor Copilot',
      description: 'Decision support for practitioners with automated research references and peer-reviewed protocols.',
      icon: Cpu,
      color: 'bg-emerald-50/70 text-emerald-600 border border-emerald-100/30',
      borderColor: 'group-hover:border-emerald-200',
      iconColor: 'text-emerald-600',
      tag: 'Clinical Advisory'
    },
    {
      id: 'dashboard' as const,
      title: 'Intelligence Dashboard',
      description: 'Population health metrics and outbreak monitoring for regional healthcare administrators.',
      icon: Activity,
      color: 'bg-amber-50/70 text-amber-600 border border-amber-100/30',
      borderColor: 'group-hover:border-amber-200',
      iconColor: 'text-amber-600',
      tag: 'Epidemiology Map'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-50/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-50/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full font-mono"
          >
            Core Solutions
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight"
          >
            Intelligent Tools Built for Underserved Communities
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-slate-500 leading-relaxed"
          >
            Providing high-fidelity analytical assistants to empower regional healthcare providers, shorten waiting list times, and prevent outbreaks.
          </motion.p>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              onClick={() => onSelectFeature(card.id)}
              className="group bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-[32px] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              {/* Card Hover Ambient Light */}
              <div className="absolute inset-0 bg-radial from-slate-50/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div>
                {/* Header Row with Icon & Open Action */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color} transition-colors duration-300`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="text-slate-300 group-hover:text-slate-950 transition-colors duration-300 p-1.5 bg-slate-50/50 rounded-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2 block">
                  {card.tag}
                </span>

                <h3 className="text-lg font-display font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Interactive trigger indicator */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border-t border-slate-50 pt-4 group-hover:border-slate-100 transition-colors duration-300">
                <span className="font-sans">Explore Platform Vision</span>
                <span className="text-[10px] font-mono opacity-60">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
