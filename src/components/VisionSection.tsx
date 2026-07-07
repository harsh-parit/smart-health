/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
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
  TrendingUp,
  Cpu,
  Layers,
  Heart,
  Fingerprint,
  Mic,
  MapPin
} from 'lucide-react';

// ================= IN-VIEW ANIMATED COUNTER =================
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const duration = 1.6; // seconds

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, isInView]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-display font-black text-slate-950 tracking-tight">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function VisionSection() {
  
  // SECTION 5: How It Works Timeline steps
  const workflowSteps = [
    {
      title: 'Citizen Reports Symptoms',
      desc: 'Local residents fill simple forms or dictate in their native spoken dialect.',
      icon: User,
      badge: 'Step 1'
    },
    {
      title: 'Gemini AI Analysis',
      desc: 'Translates, parses, and assigns a clinical triage score instantly.',
      icon: Sparkles,
      badge: 'Step 2'
    },
    {
      title: 'Health Report Generated',
      desc: 'Standardized clinical charts stored securely onto Cloud Firestore.',
      icon: ClipboardList,
      badge: 'Step 3'
    },
    {
      title: 'ASHA Worker Verification',
      desc: 'Physical field-worker visits check patient symptoms and confirm vitals.',
      icon: ShieldCheck,
      badge: 'Step 4'
    },
    {
      title: 'Doctor Consultation',
      desc: 'Physician reviews clinical history, notes risk, and prescribes treatment.',
      icon: Activity,
      badge: 'Step 5'
    },
    {
      title: 'District Intelligence',
      desc: 'Anonymized spatial heatmaps map disease vectors to deploy resources.',
      icon: BarChart3,
      badge: 'Step 6'
    }
  ];

  // SECTION 8: AI Capabilities
  const aiCapabilities = [
    {
      title: 'Gemini Symptom Analysis',
      desc: 'Translates user voice or text reports into structured clinical severity indicators.',
      icon: Sparkles,
      isUpcoming: false
    },
    {
      title: 'Doctor Copilot',
      desc: 'Ambient conversation scribe and clinical guidelines validator.',
      icon: Cpu,
      isUpcoming: false
    },
    {
      title: 'Clinical SOAP Notes',
      desc: 'Auto-structures summaries into standard Subjective, Objective, Assessment, and Plan logs.',
      icon: ClipboardList,
      isUpcoming: false
    },
    {
      title: 'District Intelligence',
      desc: 'Aggregates clinic inputs into regional heatmaps and real-time disease outbreak flags.',
      icon: BarChart3,
      isUpcoming: false
    },
    {
      title: 'Predictive Health Alerts',
      desc: 'Monitors early triage flags to alert local health departments of infectious spikes.',
      icon: TrendingUp,
      isUpcoming: false
    },
    {
      title: 'Prescription OCR',
      desc: 'Read handwriting and dosage guidelines off medicine slips to verify compatibility.',
      icon: Eye,
      isUpcoming: true
    },
    {
      title: 'Voice Health Reporting',
      desc: 'Submit multi-dialect speech reports for automated regional diagnosis translation.',
      icon: Mic,
      isUpcoming: true
    }
  ];

  // SECTION 9: Technology Stack
  const technologies = [
    {
      name: 'Google Gemini',
      why: 'Multi-modal reasoning engine for clinical translation, clinical triage, and automated medical SOAP chart transcription.',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      name: 'Firebase / Firestore',
      why: 'Secure, real-time document database keeping frontline field worker inputs fully synchronized with central clinic portals.',
      icon: Database,
      color: 'text-orange-600 bg-orange-50 border-orange-100'
    },
    {
      name: 'React',
      why: 'Modern UI framework enabling reactive page transitions and zero-latency local screen states.',
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

  // SECTION 7: Disease Surveillance Stats
  const diseaseDist = [
    { name: 'Respiratory Infection', pct: 34, color: 'bg-rose-500' },
    { name: 'Maternal Care Support', pct: 25, color: 'bg-emerald-500' },
    { name: 'Hypertension Diagnostics', pct: 18, color: 'bg-blue-500' },
    { name: 'Dengue Outbreak Tracking', pct: 12, color: 'bg-amber-500' },
    { name: 'Malaria Vector Checks', pct: 8, color: 'bg-purple-500' },
    { name: 'Diabetes Screenings', pct: 5, color: 'bg-teal-500' },
    { name: 'Active Vaccination Coverage', pct: 98, color: 'bg-emerald-600' }
  ];

  const hotspots = [
    { name: 'Simra Village', high: 14, medium: 28, low: 45 },
    { name: 'Datia Rural', high: 11, medium: 18, low: 36 },
    { name: 'Bhander Block', high: 9, medium: 15, low: 22 },
    { name: 'Unao Region', high: 6, medium: 10, low: 18 },
    { name: 'Sevda Station', high: 4, medium: 8, low: 14 }
  ];

  return (
    <div className="bg-slate-50/50">
      
      {/* ================= SECTION 5: HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-150/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3.5 py-1.5 rounded-full font-mono">
              Ecosystem Blueprint
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-950 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans max-w-md mx-auto font-medium">
              A comprehensive system syncing patients, field ASHA workers, physicians, and administrative offices instantly.
            </p>
          </div>

          {/* Staggered Vertical Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] flex flex-col justify-between hover:bg-white hover:shadow-xl hover:shadow-slate-100/40 transition-all relative group"
                >
                  {/* Decorative horizontal arrow on desktop */}
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
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-xs">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <h4 className="font-display font-extrabold text-slate-950 text-xs sm:text-sm leading-tight group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: REAL-TIME HEALTH INSIGHTS ================= */}
      <section id="impact" className="py-24 bg-slate-50 border-t border-slate-150/50 relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full font-mono">
              Live Field Statistics
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-950 tracking-tight">
              Real-Time Health Insights
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans max-w-md mx-auto font-medium">
              Key operational performance markers aggregated from our synchronized rural healthcare registries.
            </p>
          </div>

          {/* Responsive Bento Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            
            {/* Metric 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-200/60 rounded-3xl p-5 text-center flex flex-col justify-between hover:shadow-lg hover:shadow-slate-100/50 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Today's Patients</span>
                <AnimatedCounter value={1284} />
              </div>
              <div className="pt-3 border-t border-slate-100 mt-4 text-[8px] font-mono text-emerald-500 uppercase tracking-wider font-bold">
                ▲ Active Sync
              </div>
            </motion.div>

            {/* Metric 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-5 text-center flex flex-col justify-between hover:shadow-lg hover:shadow-slate-100/50 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">AI Analyses</span>
                <AnimatedCounter value={612} />
              </div>
              <div className="pt-3 border-t border-slate-100 mt-4 text-[8px] font-mono text-emerald-500 uppercase tracking-wider font-bold">
                ▲ Active Sync
              </div>
            </motion.div>

            {/* Metric 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-5 text-center flex flex-col justify-between hover:shadow-lg hover:shadow-slate-100/50 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Doctor Reviews</span>
                <AnimatedCounter value={312} />
              </div>
              <div className="pt-3 border-t border-slate-100 mt-4 text-[8px] font-mono text-emerald-500 uppercase tracking-wider font-bold">
                ▲ Active Sync
              </div>
            </motion.div>

            {/* Metric 4 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-5 text-center flex flex-col justify-between hover:shadow-lg hover:shadow-slate-100/50 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Home Visits</span>
                <AnimatedCounter value={89} />
              </div>
              <div className="pt-3 border-t border-slate-100 mt-4 text-[8px] font-mono text-emerald-500 uppercase tracking-wider font-bold">
                ▲ Active Sync
              </div>
            </motion.div>

            {/* Metric 5 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-rose-200 rounded-3xl p-5 text-center flex flex-col justify-between hover:shadow-lg hover:shadow-slate-100/50 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-rose-500 uppercase tracking-widest block">Critical Cases</span>
                <AnimatedCounter value={42} />
              </div>
              <div className="pt-3 border-t border-rose-100 mt-4 text-[8px] font-mono text-rose-500 uppercase tracking-wider font-bold">
                ● Action Alert
              </div>
            </motion.div>

            {/* Metric 6 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-5 text-center flex flex-col justify-between hover:shadow-lg hover:shadow-slate-100/50 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Connected PHCs</span>
                <AnimatedCounter value={27} />
              </div>
              <div className="pt-3 border-t border-slate-100 mt-4 text-[8px] font-mono text-emerald-500 uppercase tracking-wider font-bold">
                ▲ Active Sync
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 7: DISEASE SURVEILLANCE ================= */}
      <section className="py-24 bg-white border-t border-slate-150/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#ec003f] uppercase bg-rose-50 px-3.5 py-1.5 rounded-full font-mono">
              Population Health Maps
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-950 tracking-tight">
              Disease Surveillance Center
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans max-w-md mx-auto font-medium">
              Regional outbreak surveillance metrics and high-priority hotspots updated in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Progress Bars Disease Distribution (Span 7) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-slate-50/70 border border-slate-100 p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between"
            >
              <div className="text-left mb-6">
                <h3 className="font-display font-extrabold text-base text-slate-950">Active Disease Breakdown</h3>
                <p className="text-xs text-slate-500 mt-1">Aggregated ratio of diagnostic complaints recorded in the current billing cycle.</p>
              </div>

              <div className="space-y-4.5">
                {diseaseDist.map((disease) => (
                  <div key={disease.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-700">{disease.name}</span>
                      <span className="font-mono text-slate-900">{disease.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${disease.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full ${disease.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-[10px] font-mono text-slate-400 mt-6 pt-4 border-t border-slate-200/50 text-left">
                *Statistics synchronized with Central Ministry Epidemiology databases.
              </div>
            </motion.div>

            {/* Right Column: Hotspots / Top 5 Villages (Span 5) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-100/50 flex flex-col justify-between"
            >
              <div className="text-left mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-base text-slate-950">Top 5 Hotspot Villages</h3>
                  <MapPin className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Sectors exhibiting highest relative density of high-risk cases.</p>
              </div>

              <div className="divide-y divide-slate-100">
                {hotspots.map((village, idx) => (
                  <div key={village.name} className="py-3 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                      <span className="text-xs font-bold text-slate-900 font-display">{village.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                        {village.high} High
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md">
                        {village.medium} Med
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50/50 border border-rose-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-left mt-6">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-[10px] text-rose-950 leading-relaxed font-medium">
                  <strong>Simra Village Alert:</strong> Active Dengue cluster detected. Immediate local vector control deployment recommended.
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 8: AI CAPABILITIES ================= */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
        {/* Soft atmospheric radial gradient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase bg-purple-950/50 border border-purple-500/20 px-3.5 py-1.5 rounded-full font-mono">
              Clinical Intelligence
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              AI Capabilities
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
              Our advanced software suite operates directly in the cloud, helping workers triage patients safely and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiCapabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-[2rem] p-6.5 space-y-4 flex flex-col justify-between hover:border-slate-700/80 transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4.5 text-left">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400">
                        <Icon className="w-5.5 h-5.5" />
                      </div>
                      {cap.isUpcoming && (
                        <span className="text-[8px] font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-blue-400" /> Soon
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-display font-bold text-white group-hover:text-purple-400 transition-colors">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {cap.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: TECHNOLOGY STACK ================= */}
      <section id="technology" className="py-24 bg-slate-50 border-t border-slate-150/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-50 px-3.5 py-1.5 rounded-full font-mono">
              The Architecture Blueprint
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-950 tracking-tight">
              Enterprise Technology Stack
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans max-w-md mx-auto font-medium">
              Our secure, responsive full-stack architecture is custom-engineered using modern Google and Web standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="bg-white border border-slate-150/70 p-5 rounded-3xl space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3.5 text-left">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${tech.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="font-display font-extrabold text-slate-950 text-xs sm:text-sm leading-tight">{tech.name}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">{tech.why}</p>
                  </div>
                  <div className="pt-3 mt-2 border-t border-slate-50 text-[8px] font-mono text-slate-400 uppercase tracking-wider text-left">
                    Stack Node // {tech.name.split(' ')[0].toLowerCase()}
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
