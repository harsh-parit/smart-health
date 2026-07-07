/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Server, Laptop, Play } from 'lucide-react';
import HeroIllustration from './HeroIllustration';
import { ActiveModalType } from '../types';

interface HeroSectionProps {
  onGetStarted: (type: ActiveModalType) => void;
  onOpenDemo?: () => void;
}

export default function HeroSection({ onGetStarted, onOpenDemo }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="hero" className="relative min-h-[95vh] flex items-center bg-gradient-to-br from-white via-white to-blue-50/20 pt-28 pb-20 overflow-hidden">
      {/* Grid background layer */}
      <div className="absolute inset-0 bg-white bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      
      {/* Decorative colored glow orbs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 w-full">
        
        {/* Left Side: Copy and Call to Action */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-7 text-left"
        >
          {/* Spark Hackathon Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Built for Google Cloud - Code for Communities</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-slate-950 leading-[1.05]"
          >
            Transforming Rural <br />
            Healthcare <span className="text-blue-600 relative inline-block">with AI</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl font-medium"
          >
            Smart Health AI empowers Citizens, ASHA Workers, Doctors, and District Health Officers through one intelligent healthcare platform powered by Gemini AI and Firebase.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <button
              onClick={() => onGetStarted('get-started')}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl py-4 px-8 text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {!import.meta.env.PROD && onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className="border border-amber-300 hover:border-amber-400 bg-amber-50 hover:bg-amber-100/60 text-amber-950 font-bold rounded-2xl py-4 px-8 text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Launch Demo Mode</span>
              </button>
            )}

            <a
              href="#how-it-works"
              className="border border-slate-200 hover:border-slate-300 bg-white/80 text-slate-700 font-bold rounded-2xl py-4 px-8 text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all duration-300 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-500 text-slate-500" />
              <span>Watch Demo</span>
            </a>
          </motion.div>

          {/* Architecture Features */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-6 pt-6 text-[10px] text-slate-400 font-mono border-t border-slate-100"
          >
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-500" /> React / TypeScript SPA
            </span>
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-500" /> Server-Side Gemini API Ready
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side: Animated workflow illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center w-full"
        >
          <HeroIllustration />
        </motion.div>

      </div>
    </section>
  );
}
