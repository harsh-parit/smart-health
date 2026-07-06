/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Server, Laptop } from 'lucide-react';
import HeroIllustration from './HeroIllustration';
import { ActiveModalType } from '../types';

interface HeroSectionProps {
  onGetStarted: (type: ActiveModalType) => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-white via-white to-blue-50/30 pt-24 pb-16 overflow-hidden">
      {/* Abstract light grid background layer */}
      <div className="absolute inset-0 bg-white bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      
      {/* Decorative colored glow orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        
        {/* Left Side: Copy and Call to Action */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 space-y-6 text-left"
        >
          {/* Spark Hackathon Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Empowering Communities</span>
          </motion.div>

          {/* Main Display Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-950"
          >
            Smart Health <span className="text-blue-600">AI</span>
          </motion.h1>

          {/* Required Tagline */}
          <motion.h2 
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-slate-700 tracking-tight leading-snug"
          >
            AI-Powered Rural Healthcare Intelligence Platform
          </motion.h2>

          {/* Short Bio Description */}
          <motion.p 
            variants={itemVariants}
            className="text-sm md:text-base text-slate-500 leading-relaxed font-sans max-w-xl"
          >
            An advanced clinical assistance ecosystem purpose-built for low-resource environments. Equipping remote clinical officers with diagnostic validation systems, real-time outbreak vectors, and localized decision-support frameworks to narrow the primary care gap.
          </motion.p>

          {/* Core Interactive Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            {/* One Prominent Get Started Button */}
            <button
              onClick={() => onGetStarted('get-started')}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-2xl py-3.5 px-7 text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Option */}
            <a
              href="#features"
              className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold rounded-2xl py-3.5 px-6 text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all duration-300"
            >
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* Meta Specifications list */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-6 pt-6 text-xs text-slate-400 font-mono border-t border-slate-100"
          >
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-500" /> React / TypeScript SPA
            </span>
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-500" /> Server-Side Gemini API Ready
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side: Hand-crafted SVG Dashboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="lg:col-span-6 flex justify-center w-full"
        >
          <HeroIllustration />
        </motion.div>

      </div>
    </section>
  );
}
