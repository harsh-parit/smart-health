/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Github, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-500 py-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left block - Bio and Brand */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white relative shadow-md shadow-blue-500/10">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-display font-bold text-slate-950 tracking-tight text-sm">
                Smart Health AI
              </span>
              <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                Google Health Hackathon
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-sans">
            Designed as a production-quality blueprint for Google's "Build with AI: Code for Communities" Hackathon. Empowering rural healthcare clinics with intelligent assistive infrastructure.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Google Build with AI 2026 Submission</span>
          </div>
        </div>

        {/* Middle block - Resources / Tech Stack info */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
            Project Architecture
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-sans">
            <li>
              <span className="text-slate-600 font-medium">Model</span>: Google Gemini Pro / Flash
            </li>
            <li>
              <span className="text-slate-600 font-medium">Backend</span>: Google GenAI SDK (Node)
            </li>
            <li>
              <span className="text-slate-600 font-medium">Database</span>: Google Cloud Firestore
            </li>
            <li>
              <span className="text-slate-600 font-medium">Styling</span>: Tailwind & MD3 Tokens
            </li>
          </ul>
        </div>

        {/* Right block - Safety & Regulatory Medical Disclaimer */}
        <div className="md:col-span-4 space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Professional Disclaimer
          </h4>
          <p className="text-[10px] text-slate-400 leading-normal font-sans">
            Smart Health AI is a concept demonstration prototype created for informational, educational, and community evaluation purposes. This platform does not provide diagnostic decisions, medical prescriptions, or emergency services. It is designed to assist, not replace, licensed medical personnel.
          </p>
        </div>

      </div>

      {/* Sub-footer Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-6">
          <span>&copy; {currentYear} Smart Health AI. Apache-2.0 License.</span>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Clinical Compliance</a>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 font-sans">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System Live
          </span>
          <span className="h-4 w-px bg-slate-200"></span>
          <span>Built with Gemini AI for Communities</span>
        </div>
      </div>
    </footer>
  );
}
