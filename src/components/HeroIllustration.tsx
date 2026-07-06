/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, Activity, Heart, Eye, AlertCircle, MapPin } from 'lucide-react';

export default function HeroIllustration() {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] max-w-xl mx-auto flex items-center justify-center">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 bg-radial from-blue-50/50 to-transparent rounded-full blur-2xl transform scale-110 pointer-events-none" />
      
      {/* Outer Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-100/20 rounded-full blur-3xl" />

      {/* Main Material Design Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-slate-200/80 transition-shadow duration-500"
      >
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {/* MD3 Dashboard Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-display font-bold text-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-slate-800 text-sm">Clinic Intelligence Hub</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">NODE: CO-82-EAST | PROT: v3.2</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              AI: ONLINE
            </span>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 flex-1 z-10">
          
          {/* Card 1: Cardiac Telemetry (Dynamic Heart Rate Chart) */}
          <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100/80 rounded-[1.75rem] p-4 flex flex-col justify-between transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 font-display">
                <Heart className="w-3.5 h-3.5 text-rose-500 animate-bounce" /> Live Telemetry
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono animate-pulse">78 BPM</span>
            </div>
            
            {/* SVG ECG Line Graph */}
            <div className="w-full h-16 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                {/* Static Grid Lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="25" y1="0" x2="25" y2="40" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="50" y1="0" x2="50" y2="40" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="75" y1="0" x2="75" y2="40" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2" />
                
                {/* ECG Wave Path */}
                <path
                  d="M 0,20 L 10,20 L 15,20 L 18,12 L 21,32 L 24,18 L 27,20 L 35,20 L 38,5 L 41,35 L 44,16 L 47,20 L 55,20 L 60,20 L 63,14 L 66,30 L 69,18 L 72,20 L 80,20 L 83,5 L 86,35 L 89,16 L 92,20 L 100,20"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-dash"
                  style={{
                    strokeDasharray: '300',
                    strokeDashoffset: '0',
                    animation: 'dash 6s linear infinite'
                  }}
                />
              </svg>
            </div>
            
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 self-start px-2 py-0.5 rounded-full mt-2">
              Sinus Rhythm Normal
            </span>
          </div>

          {/* Card 2: AI Diagnostic Copilot Triage Output */}
          <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100/80 rounded-[1.75rem] p-4 flex flex-col justify-between transition-colors duration-300">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 font-display">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> AI Diagnostic Advisory
              </span>
            </div>

            <div className="space-y-1.5 mt-1">
              <div className="text-[10px] font-mono text-slate-400">INPUT PATIENT CL-8012:</div>
              <div className="text-[11px] font-medium text-slate-700 bg-white border border-slate-100 px-2 py-1 rounded-md">
                "Fever, joint ache, skin rash..."
              </div>
              
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800 font-display">Dengue Advisory</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Confidence Index: 84%. Advise prompt rapid-antigen diagnostic screening.</p>
            </div>
            
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-2">
              <div className="bg-rose-500 h-full w-[84%]" />
            </div>
          </div>

          {/* Card 3: Regional Epidemiology Map Vector */}
          <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100/80 rounded-[1.75rem] p-4 flex flex-col justify-between sm:col-span-2 transition-colors duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 font-display">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Regional Hotspots & Distribution
              </span>
              <span className="text-[10px] font-mono text-slate-400">ACTIVE OUTBREAK MONITORING</span>
            </div>

            <div className="h-28 w-full bg-white rounded-2xl border border-slate-100 flex items-center justify-center relative overflow-hidden p-2">
              {/* Fake Low-Poly Dot Map Graphic */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-10">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-slate-400" />
                ))}
              </div>

              {/* Glowing Outline representing community map area */}
              <svg className="w-full h-full text-slate-200" viewBox="0 0 200 80">
                <path d="M10,40 Q40,10 80,30 T150,20 T190,60" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                <path d="M15,60 Q60,70 110,40 T180,30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
                
                {/* Active Hotspot Pins */}
                <g className="animate-pulse">
                  <circle cx="50" cy="25" r="4" fill="#10B981" />
                  <circle cx="50" cy="25" r="8" fill="#10B981" fillOpacity="0.2" />
                </g>
                <g className="animate-pulse" style={{ animationDelay: '1s' }}>
                  <circle cx="110" cy="40" r="4" fill="#2563EB" />
                  <circle cx="110" cy="40" r="8" fill="#2563EB" fillOpacity="0.2" />
                </g>
                <g className="animate-pulse" style={{ animationDelay: '1.5s' }}>
                  <circle cx="150" cy="20" r="5" fill="#EF4444" />
                  <circle cx="150" cy="20" r="10" fill="#EF4444" fillOpacity="0.2" />
                </g>
              </svg>

              <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[9px] font-mono flex items-center gap-1.5">
                <AlertCircle className="w-2.5 h-2.5 text-rose-400" /> Sector 3 Outbreak Risk High
              </div>
            </div>
          </div>
        </div>

        {/* MD3 Dashboard Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50 font-sans z-10">
          <span className="flex items-center gap-1 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Live Telemetry Linked
          </span>
          <span className="font-mono">SECURE FHIR/HL7 PIPELINE</span>
        </div>

        {/* Floating Accent Capsule */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-100/10 rounded-full blur-2xl group-hover:bg-emerald-100/20 transition-all duration-700" />
      </motion.div>

      {/* CSS For dash SVG Animation */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -300;
          }
        }
      `}</style>
    </div>
  );
}
