/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Github, ShieldAlert, Award, Globe, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 font-sans relative overflow-hidden">
      {/* Subtle overlay glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 relative z-10">
        
        {/* Brand Column (Col span 4) */}
        <div className="col-span-2 md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white relative shadow-md shadow-blue-500/15">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-white tracking-tight text-sm">
                Smart Health AI
              </span>
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                Google Cloud AI Ecosystem
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            A state-of-the-art medical decision copilot and citizen triage pipeline purpose-built to close the primary care gap in remote regions.
          </p>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-semibold font-mono uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FHIR Core Connected
            </span>
          </div>
        </div>

        {/* Modules Column (Col span 2) */}
        <div className="col-span-1 md:col-span-2 space-y-3 text-left">
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-500">
            Modules
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#features" className="hover:text-white transition-colors">Citizen Triage</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">ASHA Verification</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Doctor Copilot</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">District Officer Map</a></li>
          </ul>
        </div>

        {/* Tech Stack Column (Col span 2) */}
        <div className="col-span-1 md:col-span-2 space-y-3 text-left">
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-500">
            Technology
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#tech-stack" className="hover:text-white transition-colors">Google Gemini</a></li>
            <li><a href="#tech-stack" className="hover:text-white transition-colors">Cloud Firestore</a></li>
            <li><a href="#tech-stack" className="hover:text-white transition-colors">Firebase Auth</a></li>
            <li><a href="#tech-stack" className="hover:text-white transition-colors">React & Tailwind</a></li>
          </ul>
        </div>

        {/* Info & GitHub Column (Col span 2) */}
        <div className="col-span-1 md:col-span-2 space-y-3 text-left">
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-500">
            Hackathon
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Code</span>
              </a>
            </li>
            <li><span className="text-slate-500">Build with AI</span></li>
            <li><span className="text-slate-500">Google Cloud</span></li>
            <li><span className="text-slate-500">Code for Communities</span></li>
          </ul>
        </div>

        {/* Safety & Info Column (Col span 2) */}
        <div className="col-span-1 md:col-span-2 space-y-3 text-left">
          <h4 className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-500">
            Legal & Privacy
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Audit logs</a></li>
            <li><span className="text-slate-500 font-mono text-[9px]">Apache-2.0 License</span></li>
          </ul>
        </div>

      </div>

      {/* Professional Medical Disclaimer Box */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Professional Safety Warning</h5>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Smart Health AI is a prototype designed for Google Cloud's evaluation hackathon. This technology does not render final clinical diagnostic decisions or replace professional consultation. It acts strictly as an assistant decision validation system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer Branding Signature */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <span>&copy; {currentYear} Smart Health AI. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for community impact.
          </span>
        </div>
        
        {/* Hackathon Attribution Badge */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-4 py-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
            Built for <span className="text-blue-400">Google Cloud</span> Build with AI: Code for Communities Hackathon
          </span>
        </div>
      </div>
    </footer>
  );
}
