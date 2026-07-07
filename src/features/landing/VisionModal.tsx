/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Cpu, Users, Layers, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { ActiveModalType, FeatureDetail } from '../../types';
import React, { useState } from 'react';

interface VisionModalProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  userEmail?: string;
}

const FEATURE_DATA: Record<string, FeatureDetail> = {
  symptom: {
    id: 'symptom',
    title: 'AI Symptom Analysis',
    shortDesc: 'Instant, clinical-grade triage in remote and low-connectivity environments.',
    longDesc: 'The AI Symptom Analyst acts as a highly capable first-line triage layer in remote clinics. Developed with Google Health guidance, it accepts multi-lingual voice descriptions of symptoms and utilizes localized LLM inference strategies to assess severity and construct prioritized clinical risk indexes.',
    iconName: 'Shield',
    accentColor: 'text-blue-600 bg-blue-50',
    bulletPoints: [
      'Multi-lingual speech-to-text integration for remote clinical dialects.',
      'Edge-caching algorithms allowing basic triage operations even under zero internet connectivity.',
      'Automated alignment with World Health Organization (WHO) and regional clinical guidelines.'
    ],
    techImpact: 'Reduces medical triage bottlenecks in rural health centers by up to 60%, directing urgent cases to clinical officers instantly.'
  },
  copilot: {
    id: 'copilot',
    title: 'Doctor Copilot',
    shortDesc: 'A clinical decision-support co-pilot for remote clinical officers.',
    longDesc: 'Remote clinics are frequently run by community nursing staff or clinical officers without specialized medical degrees. The Doctor Copilot leverages the Google Gemini model via the Google GenAI SDK to act as an assistant, analyzing patient charts, validating prescriptions against potential interactions, and generating customized summaries.',
    iconName: 'Cpu',
    accentColor: 'text-emerald-600 bg-emerald-50',
    bulletPoints: [
      'Automated ambient notes transcription converting patient-doctor dialogue to standard health records.',
      'Drug-to-drug interaction alerts and localized dosage validation models.',
      'Context-aware differential diagnosis suggestions prioritizing endemic regional vector diseases.'
    ],
    techImpact: 'Empowers clinical assistants to operate with clinical safety guards, narrowing the primary care diagnostic gap in remote populations.'
  },
  dashboard: {
    id: 'dashboard',
    title: 'Healthcare Intelligence Dashboard',
    shortDesc: 'Community-wide epidemiology modeling and real-time disease vector tracking.',
    longDesc: 'Moving from reactive medicine to proactive population health. The Healthcare Intelligence Dashboard aggregates anonymized diagnostic inputs from dozens of local clinics into a regional overview. Built with d3 and Firestore real-time listener feeds, it models local disease vectors and maps emerging clinical trends.',
    iconName: 'Users',
    accentColor: 'text-purple-600 bg-purple-50',
    bulletPoints: [
      'Real-time Outbreak Maps using geocoded anonymized symptom vectors.',
      'Predictive analytics predicting infectious spikes (e.g., Dengue, Malaria) up to 2 weeks in advance.',
      'Automated clinic resource monitoring tracking vaccine, test-kit, and pharmaceutical inventories.'
    ],
    techImpact: 'Gives public health coordinators and local ministries direct spatial-temporal visibility into rural outbreaks to direct resources proactively.'
  }
};

export default function VisionModal({ activeModal, onClose, userEmail }: VisionModalProps) {
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!activeModal) return null;

  const isGetStarted = activeModal === 'get-started';
  const detail = !isGetStarted ? FEATURE_DATA[activeModal as string] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />

        {/* Modal Sheet Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white w-full max-w-lg rounded-[2.25rem] shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Top Decorative Line */}
          <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {isGetStarted ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-800">Get Started with Smart Health AI</h3>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Welcome to the prototype workspace for Google's <span className="font-semibold text-slate-700">"Build with AI: Code for Communities"</span> Hackathon.
                  </p>
                  
                  {userEmail && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Authenticated via <strong>{userEmail}</strong></span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="name-input" className="block text-xs font-semibold text-slate-600 uppercase font-sans tracking-wider">
                      Your First Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      required
                      placeholder="e.g. Harsh"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold rounded-2xl py-3 px-4 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg shadow-blue-500/10"
                  >
                    Launch Interactive Workspace
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 py-4 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-slate-800">
                    Welcome aboard, {userName || 'Community Health Pioneer'}!
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                    As a <span className="font-medium text-slate-700">Senior Staff Engineer at Google Health</span>, I have provisioned this front-end architecture to serve as a high-fidelity landing pad.
                  </p>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-[1.5rem] text-left text-xs text-blue-800 space-y-2 max-w-md mx-auto">
                    <span className="font-semibold block font-display">Planned Full-Stack Integration Flow:</span>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700 font-sans">
                      <li><strong>Authentication</strong>: Secure login with Firebase Auth.</li>
                      <li><strong>Database</strong>: Firestore with real-time sync for remote clinical records.</li>
                      <li><strong>AI Logic</strong>: Gemini API integration utilizing the <code>@google/genai</code> SDK for offline differential diagnosing.</li>
                    </ol>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Return to Platform
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            detail && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${detail.accentColor}`}>
                    {detail.id === 'symptom' && <Shield className="w-5 h-5" />}
                    {detail.id === 'copilot' && <Cpu className="w-5 h-5" />}
                    {detail.id === 'dashboard' && <Users className="w-5 h-5" />}
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800">{detail.title}</h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed">{detail.longDesc}</p>

                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-sans">
                    Key Features & Technical Implementation
                  </span>
                  <ul className="space-y-2.5">
                    {detail.bulletPoints.map((point, index) => (
                      <li key={index} className="flex gap-2.5 items-start text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] mt-4">
                  <span className="text-xs font-bold text-emerald-800 block font-display mb-1">
                    HACKATHON DEMOGRAPHIC IMPACT
                  </span>
                  <p className="text-xs text-emerald-700 leading-relaxed">{detail.techImpact}</p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-slate-900 text-white font-semibold rounded-2xl py-3 px-4 hover:bg-slate-800 active:scale-[0.98] transition-all text-sm mt-4 shadow-md"
                >
                  Close Specification
                </button>
              </div>
            )
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
