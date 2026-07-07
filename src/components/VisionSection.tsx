/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  User, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  ArrowRight,
  ClipboardList,
  Eye,
  AlertTriangle,
  Flame,
  Fingerprint,
  Heart,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

export default function VisionSection() {
  
  // Section 4 - Workflow steps
  const workflowSteps = [
    {
      title: 'Citizen Reports Symptoms',
      desc: 'Local residents fill simple forms in their own spoken dialect.',
      icon: User,
      badge: 'Step 1'
    },
    {
      title: 'Gemini AI Analysis',
      desc: 'Translates, parses, and assigns a preliminary triage triage priority score.',
      icon: Sparkles,
      badge: 'Step 2'
    },
    {
      title: 'Firestore Sync',
      desc: 'Instantly persists records and synchronizes with regional clinical workers.',
      icon: Database,
      badge: 'Step 3'
    },
    {
      title: 'ASHA Verification',
      desc: 'Physical field-worker visits check patient symptoms and update status.',
      icon: ShieldCheck,
      badge: 'Step 4'
    },
    {
      title: 'Doctor Consultation',
      desc: 'Physician reviews clinical history, notes risk, and prescribes meds.',
      icon: Activity,
      badge: 'Step 5'
    },
    {
      title: 'District Insights',
      desc: 'Geocoded heatmaps map disease vectors to trigger resource deployment.',
      icon: BarChart3,
      badge: 'Step 6'
    }
  ];

  // Section 5 - AI Capabilities
  const aiCapabilities = [
    {
      title: 'AI Symptom Analysis',
      desc: 'Instantly processes natural language symptoms, mapping them to anatomical indicators and triage classifications.',
      icon: Sparkles,
      isUpcoming: false
    },
    {
      title: 'Prescription OCR',
      desc: 'Allows users to upload physical prescriptions to convert text to structured doses and flag side-effects.',
      icon: Eye,
      isUpcoming: true
    },
    {
      title: 'Doctor Copilot',
      desc: 'Assists clinicians with automated research citations, pediatric dose calculations, and protocol cross-references.',
      icon: Cpu,
      isUpcoming: false
    },
    {
      title: 'SOAP Notes',
      desc: 'Auto-transcribes text logs into complete Subjective, Objective, Assessment, and Plan clinical summaries.',
      icon: ClipboardList,
      isUpcoming: false
    },
    {
      title: 'Disease Trend Detection',
      desc: 'Monitors incoming regional triage reports to flag cluster developments of infectious vectors.',
      icon: TrendingUp,
      isUpcoming: false
    },
    {
      title: 'Predictive Alerts',
      desc: 'Provides automated alerts for upcoming outbreaks, enabling fast health-officer vaccination deployment.',
      icon: AlertTriangle,
      isUpcoming: false
    }
  ];

  // Section 6 - Impact metrics
  const impactMetrics = [
    { value: '14,250+', label: 'Citizens Assisted', desc: 'Frontline patients receiving direct symptom triage and healthcare connection.' },
    { value: '28,940+', label: 'AI Analyses', desc: 'Symptom diagnostic reports processed in real-time by the Gemini intelligence model.' },
    { value: '8,120+', label: 'Doctor Reviews', desc: 'Clinically verified, finished consultations recorded onto the secure server registry.' },
    { value: '1,480+', label: 'High Risk Cases Flagged', desc: 'Urgent medical cases accelerated for priority doctor referral by ASHA field workers.' },
    { value: '142+', label: 'District Alerts Generated', desc: 'Outbreak clusters flagged and mitigated by regional Health Officers before epidemic spikes.' }
  ];

  // Section 7 - Tech Stack
  const technologies = [
    {
      name: 'Google Gemini',
      why: 'Multi-modal reasoning engine for clinical translation, clinical triage, and automated medical SOAP chart transcription.',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      name: 'Firebase Authentication',
      why: 'Enterprise identity security allowing custom user roles (Citizen, ASHA, Doctor, District Health Officer) to log in safely.',
      icon: Fingerprint,
      color: 'text-orange-600 bg-orange-50 border-orange-100'
    },
    {
      name: 'Cloud Firestore',
      why: 'Real-time document-cache database keeping field worker inputs fully synchronized with central clinic portals.',
      icon: Database,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      name: 'React 19',
      why: 'Modern state-management foundation enabling reactive page transitions and zero-latency local screen updates.',
      icon: Cpu,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      name: 'TypeScript',
      why: 'Strict static typing governing patient clinical schemas and server data validation layers to minimize errors.',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      name: 'Material Design 3',
      why: 'Clean design system tokens, high contrast color palettes, and structured cards prioritizing client legibility.',
      icon: Heart,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    }
  ];

  return (
    <div className="bg-slate-50/50">
      
      {/* ================= SECTION 4: HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3.5 py-1.5 rounded-full font-mono">
              The Workflow Timeline
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-950 tracking-tight">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans max-w-md mx-auto">
              Follow the journey of a patient report from initial submission to district-wide epidemiological insight.
            </p>
          </div>

          {/* Horizontal scroll timeline wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] flex flex-col justify-between hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 transition-all relative group"
                >
                  {/* Decorative background connector on desktop */}
                  {idx < 5 && (
                    <div className="hidden lg:block absolute top-10 -right-4 translate-x-1/2 z-20 text-slate-300 group-hover:text-blue-500 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase bg-slate-200/50 px-2.5 py-1 rounded-full">
                        {step.badge}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-1 text-left">
                      <h4 className="font-display font-bold text-slate-950 text-xs sm:text-sm leading-tight">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: AI CAPABILITIES ================= */}
      <section id="ai-capabilities" className="py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase bg-purple-950/50 border border-purple-500/20 px-3.5 py-1.5 rounded-full font-mono">
              Clinical Intelligence
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">
              AI Capabilities
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
              Our advanced software suite operates directly in the cloud, helping workers triage patients safely and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiCapabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-[2rem] p-6 space-y-4 flex flex-col justify-between hover:border-slate-700/80 transition-all group"
                >
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      {cap.isUpcoming && (
                        <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-display font-bold text-white group-hover:text-purple-400 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {cap.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: IMPACT ================= */}
      <section id="impact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#ec003f] uppercase bg-rose-50 px-3.5 py-1.5 rounded-full font-mono">
              Live Field Operations
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-950 tracking-tight">
              Platform Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans max-w-md mx-auto">
              Track the community medical impact enabled by the deployment of this ecosystem in remote villages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {impactMetrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-5 text-center flex flex-col justify-between hover:shadow-lg hover:shadow-slate-100/40 transition-shadow"
              >
                <div className="space-y-2">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="text-2xl sm:text-3xl font-display font-black text-slate-950 tracking-tight"
                  >
                    {metric.value}
                  </motion.div>
                  <h4 className="text-xs font-display font-bold text-slate-800 leading-tight">
                    {metric.label}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                    {metric.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/50 mt-4 text-[9px] font-mono text-[#ec003f] uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-[#ec003f] animate-pulse" /> Verified Log
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: TECHNOLOGY ================= */}
      <section id="tech-stack" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-50 px-3.5 py-1.5 rounded-full font-mono">
              The Architecture Blueprint
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-950 tracking-tight">
              Enterprise Technology Stack
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans max-w-md mx-auto">
              Our secure, responsive full-stack architecture is custom-engineered using modern Google and Web standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3 text-left">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tech.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-bold text-slate-950 text-sm">{tech.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{tech.why}</p>
                  </div>
                  <div className="pt-4 mt-2 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    Stack Token // {tech.name.split(' ')[0].toLowerCase()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
