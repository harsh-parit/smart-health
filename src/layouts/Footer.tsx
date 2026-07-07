/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Github, ShieldAlert, Award, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900 font-sans relative overflow-hidden">
      {/* Subtle overlay glow */}
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 relative z-10">
        
        {/* Brand Column (Col span 4) */}
        <div className="md:col-span-4 space-y-5 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white relative shadow-md shadow-blue-500/15">
              <Activity className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-display font-extrabold text-white tracking-tight text-base leading-none block">
                Smart Health AI
              </span>
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">
                Google Cloud AI Ecosystem
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-medium">
            An advanced AI-powered rural healthcare intelligence platform and decision-support system, designed to bridge the diagnosis and triage gap for remote primary health centers.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] text-emerald-400 font-bold font-mono uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FHIR Core Connectable
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] text-blue-400 font-bold font-mono uppercase">
              HIPAA Compliant Rules
            </span>
          </div>
        </div>

        {/* Modules Column (Col span 2.5) */}
        <div className="md:col-span-2.5 space-y-4.5 text-left">
          <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 border-b border-slate-900 pb-2">
            Platform Modules
          </h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><a href="#features" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1">Citizen Symptom Entry</a></li>
            <li><a href="#features" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1">ASHA Field verification</a></li>
            <li><a href="#features" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1">Physician Copilot Core</a></li>
            <li><a href="#features" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1">District Surveillance Map</a></li>
          </ul>
        </div>

        {/* Quick Links Column (Col span 2.5) */}
        <div className="md:col-span-2.5 space-y-4.5 text-left">
          <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 border-b border-slate-900 pb-2">
            Ecosystem Links
          </h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><a href="#hero" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1">Smart Health Proposal</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1">Process Workflow</a></li>
            <li><a href="#technology" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1">Technology Blueprint</a></li>
            <li>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm px-1"
                aria-label="GitHub Repository (opens in a new tab)"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Contact info Column (Col span 3) */}
        <div className="md:col-span-3 space-y-4.5 text-left">
          <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 border-b border-slate-900 pb-2">
            Technical Contact
          </h4>
          <ul className="space-y-3 text-xs font-medium text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>health-ai-support@google.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>+91 11-4284-9680</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Datia Regional HQ, Madhya Pradesh, India</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Professional Medical Safety Warnings */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-slate-900/60 border border-slate-800 p-5.5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 text-left">
            <ShieldAlert className="w-5.5 h-5.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Professional Safety Triage Warning</h5>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-medium">
                Smart Health AI is a prototype build submitted for evaluation. This technology does not render final medical diagnostic decisions, prescribe medications, or replace licensed professional clinical consultations. It is strictly an auxiliary triage, decision validation, and epidemiological surveillance assistance ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer Brand Attribution Signature */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <span>&copy; {currentYear} Smart Health AI Project. All rights reserved.</span>
          <span className="hidden sm:inline text-slate-800">|</span>
          <span className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for global clinical equity.
          </span>
        </div>
        
        {/* Hackathon Credentials badge */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-4 py-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300 text-left">
            Built for <span className="text-blue-400 font-extrabold">Google Cloud</span> Build with AI: Code for Communities
          </span>
        </div>
      </div>
    </footer>
  );
}
