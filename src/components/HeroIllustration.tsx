/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Activity, 
  UserCheck, 
  Home, 
  Building, 
  Percent, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

export default function HeroIllustration() {
  const [activeFeedIdx, setActiveFeedIdx] = useState(0);

  const feedItems = [
    { text: "Citizen submitted symptoms", desc: "Awaiting frontline ASHA dispatch", time: "Just Now", color: "text-blue-500 bg-blue-50 border-blue-100", icon: Activity },
    { text: "Gemini completed analysis", desc: "Triage flagged as HIGH risk (98.2% conf.)", time: "1m ago", color: "text-purple-500 bg-purple-50 border-purple-100", icon: Sparkles },
    { text: "Doctor accepted consultation", desc: "Electronic SOAP charts synchronized", time: "3m ago", color: "text-emerald-500 bg-emerald-50 border-emerald-100", icon: CheckCircle },
    { text: "District dashboard updated", desc: "Epidemic surge alerts computed", time: "5m ago", color: "text-amber-500 bg-amber-50 border-amber-100", icon: Clock }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeedIdx((prev) => (prev + 1) % feedItems.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [feedItems.length]);

  return (
    <div className="relative w-full max-w-xl mx-auto p-4 flex flex-col gap-5">
      {/* Background soft glowing elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Behind Panel */}
      <div className="absolute inset-0 bg-radial from-slate-100/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* ================= CARD 1: DISTRICT OVERVIEW ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-slate-200/80 rounded-[28px] p-5 shadow-xl shadow-slate-100/60 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50/50 via-transparent to-transparent rounded-bl-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-display font-extrabold text-sm text-slate-900 tracking-tight">District Overview</h3>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">DATIA REGION • REALTIME TELEMETRY</p>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE DATA
          </span>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          
          {/* Patients Today */}
          <div className="bg-slate-50/70 border border-slate-100 p-3 rounded-2xl relative overflow-hidden group">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Patients Today</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-display font-black text-slate-950 tracking-tight">1,284</span>
              <span className="text-[9px] font-bold text-emerald-500 font-sans">+4.8%</span>
            </div>
            <Users className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-slate-300" />
          </div>

          {/* High Risk Cases */}
          <div className="bg-rose-50/40 border border-rose-100/40 p-3 rounded-2xl relative overflow-hidden">
            <span className="block text-[9px] font-mono font-bold text-rose-500 uppercase tracking-wide">High Risk</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-display font-black text-rose-600 tracking-tight">42</span>
              <span className="text-[9px] font-bold text-rose-500 font-sans">Active</span>
            </div>
            <AlertTriangle className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-rose-300" />
          </div>

          {/* Doctor Reviews */}
          <div className="bg-slate-50/70 border border-slate-100 p-3 rounded-2xl relative overflow-hidden">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Doctor Reviews</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-display font-black text-slate-950 tracking-tight">312</span>
              <span className="text-[9px] font-bold text-slate-400 font-sans">Queue</span>
            </div>
            <UserCheck className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-slate-300" />
          </div>

          {/* Home Visits */}
          <div className="bg-slate-50/70 border border-slate-100 p-3 rounded-2xl relative overflow-hidden">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Home Visits</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-display font-black text-slate-950 tracking-tight">89</span>
              <span className="text-[9px] font-bold text-emerald-500 font-sans">Done</span>
            </div>
            <Home className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-slate-300" />
          </div>

          {/* Connected PHCs */}
          <div className="bg-slate-50/70 border border-slate-100 p-3 rounded-2xl relative overflow-hidden">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide">Connected PHCs</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-display font-black text-slate-950 tracking-tight">27</span>
              <span className="text-[9px] font-bold text-slate-400 font-sans">Nodes</span>
            </div>
            <Building className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-slate-300" />
          </div>

          {/* AI Confidence */}
          <div className="bg-blue-50/40 border border-blue-100/40 p-3 rounded-2xl relative overflow-hidden">
            <span className="block text-[9px] font-mono font-bold text-blue-500 uppercase tracking-wide">AI Confidence</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-display font-black text-blue-600 tracking-tight">96.8%</span>
              <span className="text-[9px] font-bold text-blue-500 font-sans">FHIR</span>
            </div>
            <Percent className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-blue-300" />
          </div>

        </div>
      </motion.div>

      {/* ================= ROW 2: RISK DISTRIBUTION & LIVE FEED ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
        
        {/* CARD 2: RISK DISTRIBUTION (Span 5) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="sm:col-span-5 bg-white border border-slate-200/80 rounded-[28px] p-5 shadow-xl shadow-slate-100/60 flex flex-col justify-between"
        >
          <div>
            <h4 className="font-display font-extrabold text-sm text-slate-900 tracking-tight">Risk Distribution</h4>
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">Clinical Classification</p>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4 my-4">
            {/* LOW RISK */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-emerald-600">LOW</span>
                <span className="font-mono text-slate-800">74%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "74%" }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* MEDIUM RISK */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-amber-600">MEDIUM</span>
                <span className="font-mono text-slate-800">19%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "19%" }}
                  transition={{ duration: 1.2, delay: 0.45, ease: "easeOut" }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* HIGH RISK */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-rose-600">HIGH</span>
                <span className="font-mono text-slate-800">7%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "7%" }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                  className="h-full bg-rose-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[8px] font-mono text-slate-400 tracking-wide">
            Updated milliseconds ago
          </div>
        </motion.div>

        {/* CARD 3: LIVE ACTIVITY FEED (Span 7) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="sm:col-span-7 bg-white border border-slate-200/80 rounded-[28px] p-5 shadow-xl shadow-slate-100/60 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display font-extrabold text-sm text-slate-900 tracking-tight">Live Activity Feed</h4>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">System Pipeline Events</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
          </div>

          {/* List of animated events */}
          <div className="space-y-3.5 my-4">
            {feedItems.map((item, idx) => {
              const IconComp = item.icon;
              const isActive = idx === activeFeedIdx;
              return (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 transition-all duration-300 ${
                    isActive ? "opacity-100 scale-[1.01]" : "opacity-40 scale-98"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${item.color} ${isActive ? 'animate-pulse' : ''}`}>
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold block ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                        {item.text}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-sans block leading-none mt-0.5 truncate">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">AI AGENT ENGINE ACTIVE</span>
            <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-wider font-bold">● OPERATIONAL</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
