/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Server, Laptop, Play } from 'lucide-react';
import HeroIllustration from './HeroIllustration';
import { ActiveModalType } from '../../types';

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
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-white via-slate-50/50 to-blue-50/15 pt-28 pb-16 overflow-hidden">
      {/* Soft elegant grid lines mapping MD3 token guides */}
      <div className="absolute inset-0 bg-white bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
      
      {/* Google Health Inspired ambient accent lights */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-12 w-[400px] h-[400px] bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10 w-full">
        
        {/* Left Side: Deep Typography & Healthcare Intent */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-7 text-left"
        >
          {/* Clinical Blueprint Tag */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/60 text-blue-700 text-[10px] font-bold uppercase tracking-wider shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>Google Health Hackathon • Blueprint Proposal</span>
          </motion.div>

          {/* Deep Display Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-950 leading-[1.08]"
          >
            Transforming Rural <br className="hidden sm:inline" />
            Healthcare <span className="text-blue-600">with AI</span>
          </motion.h1>

          {/* Subtitle / Statement */}
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl font-medium"
          >
            Smart Health AI connects Citizens, ASHA Workers, Doctors and District Health Officers into one intelligent healthcare ecosystem powered by Gemini AI and Firebase.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 pt-1"
          >
            <button
              onClick={() => onGetStarted('get-started')}
              className="bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold rounded-2xl py-4 px-8 text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              className="border border-slate-200 hover:border-slate-300 bg-white/90 text-slate-700 font-bold rounded-2xl py-4 px-8 text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all duration-300 cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
              <span>Watch Demo</span>
            </a>

            {!import.meta.env.PROD && onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className="border border-amber-200 hover:border-amber-300 bg-amber-50/60 hover:bg-amber-50 text-amber-950 font-bold rounded-2xl py-4 px-6 text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Launch Demo Sandbox</span>
              </button>
            )}
          </motion.div>

          {/* Technical Spec Tags */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-6 pt-5 text-[10px] text-slate-400 font-mono border-t border-slate-150/75"
          >
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-500" /> Google Material Design 3
            </span>
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-500" /> Server-Side Gemini API
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side: Google Health Live Dashboard Visualizer Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center w-full"
        >
          <HeroIllustration />
        </motion.div>

      </div>
    </section>
  );
}
