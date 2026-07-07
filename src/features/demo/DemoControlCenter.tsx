import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Database, 
  RefreshCw, 
  Play, 
  Zap, 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  X, 
  Users, 
  FileText, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  getDemoEvents, 
  addDemoEvent, 
  clearDemoEvents, 
  generateDemoCitizens, 
  generateDemoRiskCases, 
  generateDemoConsultations, 
  generateDemoHomeVisits, 
  generateDemoAlerts, 
  resetDemoData, 
  replayDemoWorkflow, 
  generateRandomHealthEvent, 
  simulateDoctorCompletion,
} from '../../services/demoService';
import { DemoEvent } from '../../types';

export default function DemoControlCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeline, setTimeline] = useState<DemoEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [workflowStep, setWorkflowStep] = useState<string | null>(null);
  
  // Simulation Toggles
  const [simCitizenEnabled, setSimCitizenEnabled] = useState(false);
  const [simDoctorEnabled, setSimDoctorEnabled] = useState(false);
  
  // Timer Refs
  const citizenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const doctorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timelineEndRef = useRef<HTMLDivElement | null>(null);

  // Load and subscribe to timeline updates
  useEffect(() => {
    const loadTimeline = () => {
      setTimeline(getDemoEvents());
    };
    
    loadTimeline();
    window.addEventListener('sh_demo_timeline_updated', loadTimeline);
    return () => {
      window.removeEventListener('sh_demo_timeline_updated', loadTimeline);
    };
  }, []);

  // Handle Simulation: Citizen reports every 10 seconds
  useEffect(() => {
    if (simCitizenEnabled) {
      addDemoEvent({
        type: 'system',
        title: 'Simulation Started',
        description: 'New Citizen Report generator scheduled every 10 seconds.',
        severity: 'info'
      });
      citizenIntervalRef.current = setInterval(async () => {
        try {
          await generateRandomHealthEvent();
        } catch (e) {
          console.error("Failed to generate random report in simulation loop:", e);
        }
      }, 10000);
    } else {
      if (citizenIntervalRef.current) {
        clearInterval(citizenIntervalRef.current);
        citizenIntervalRef.current = null;
        addDemoEvent({
          type: 'system',
          title: 'Simulation Stopped',
          description: 'Citizen report generator deactivated.',
          severity: 'info'
        });
      }
    }

    return () => {
      if (citizenIntervalRef.current) {
        clearInterval(citizenIntervalRef.current);
      }
    };
  }, [simCitizenEnabled]);

  // Handle Simulation: Doctor completed reviews
  useEffect(() => {
    if (simDoctorEnabled) {
      addDemoEvent({
        type: 'system',
        title: 'Simulation Started',
        description: 'Automated Doctor review processor scheduled every 12 seconds.',
        severity: 'info'
      });
      doctorIntervalRef.current = setInterval(async () => {
        try {
          const processed = await simulateDoctorCompletion();
          if (!processed) {
            addDemoEvent({
              type: 'system',
              title: 'Doctor Queue Empty',
              description: 'Automated review skipped: No pending triage reports in queue.',
              severity: 'low'
            });
          }
        } catch (e) {
          console.error("Failed doctor simulation review:", e);
        }
      }, 12000);
    } else {
      if (doctorIntervalRef.current) {
        clearInterval(doctorIntervalRef.current);
        doctorIntervalRef.current = null;
        addDemoEvent({
          type: 'system',
          title: 'Simulation Stopped',
          description: 'Doctor consultation processor deactivated.',
          severity: 'info'
        });
      }
    }

    return () => {
      if (doctorIntervalRef.current) {
        clearInterval(doctorIntervalRef.current);
      }
    };
  }, [simDoctorEnabled]);

  // Scroll to top of timeline when updated
  useEffect(() => {
    if (isOpen) {
      timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [timeline, isOpen]);

  // Action: Generate complete base dataset
  const handleGenerateBaseData = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      addDemoEvent({
        type: 'system',
        title: 'Mock Generation Initialized',
        description: 'Generating realistic, comprehensive presentation suite...',
        severity: 'info'
      });
      
      // 10 Citizens
      await generateDemoCitizens(10);
      
      // Cases: 5 High, 8 Med, 15 Low
      await generateDemoRiskCases(5, 8, 15);
      
      // 3 Consultations
      await generateDemoConsultations(3);
      
      // 4 Home Visits
      await generateDemoHomeVisits(4);
      
      // 2 Alerts
      await generateDemoAlerts(2);

      addDemoEvent({
        type: 'system',
        title: 'Suite successfully created!',
        description: '10 Citizens, 28 Cases, 3 Consultations, 4 Visits, and 2 Alerts are now active in Sandbox.',
        severity: 'info'
      });
    } catch (err: any) {
      addDemoEvent({
        type: 'system',
        title: 'Generation Failed',
        description: err.message || 'Error occurred during generation.',
        severity: 'high'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Action: Reset Sandbox
  const handleResetSandbox = async () => {
    if (isResetting) return;
    setIsResetting(true);
    setSimCitizenEnabled(false);
    setSimDoctorEnabled(false);
    try {
      await resetDemoData();
      clearDemoEvents();
      addDemoEvent({
        type: 'system',
        title: 'Sandbox Restored',
        description: 'Sandbox storage purged and rebuilt.',
        severity: 'info'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  // Action: Replay Demo Workflow
  const handleReplayWorkflow = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setSimCitizenEnabled(false);
    setSimDoctorEnabled(false);
    try {
      await replayDemoWorkflow((step) => {
        setWorkflowStep(step);
      });
      setWorkflowStep(null);
    } catch (e) {
      console.error(e);
      setWorkflowStep(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper for timeline badges
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/15 border cursor-pointer select-none transition-all duration-300 ${
            isOpen 
              ? 'bg-slate-950 text-amber-400 border-amber-400/40' 
              : 'bg-amber-500 text-slate-950 border-amber-600 hover:bg-amber-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sliders className={`w-4 h-4 ${isOpen ? 'animate-spin' : ''}`} />
          <span>Demo Controls</span>
          {timeline.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Control Drawer / Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 150 }}
            className="fixed inset-y-0 left-0 w-96 bg-slate-950/95 backdrop-blur-md border-r border-slate-800 shadow-2xl z-45 flex flex-col p-6 text-slate-200 font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-100">Sandbox Cockpit</h3>
                  <p className="text-[10px] font-mono text-amber-500 tracking-widest mt-0.5">ISOLATED DEMO ENVIRONMENT</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable controls */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
              
              {/* Info Disclaimer */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-[11px] leading-relaxed text-slate-400">
                <div className="flex gap-2 items-start mb-1 text-amber-400 font-bold uppercase tracking-wider font-mono text-[10px]">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Presenter Information</span>
                </div>
                Database writes are redirected to sandbox <code className="font-mono text-slate-300">demo_</code> collections. Production metrics and live health reports remain entirely secure and unaffected.
              </div>

              {/* Action Section: Suite Generation */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block">Data Generators</span>
                
                <button
                  onClick={handleGenerateBaseData}
                  disabled={isGenerating || isResetting}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 hover:border-amber-500/30 font-medium text-xs flex items-center justify-between transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <div className="text-left">
                      <span className="block font-bold">Generate Presentation Suite</span>
                      <span className="block text-[10px] text-slate-500">10 Citizens, 28 Cases, 4 Visits, 2 Alerts</span>
                    </div>
                  </div>
                  {isGenerating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  )}
                </button>
              </div>

              {/* Action Section: Presentation Controls */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block">Reset & Presentation Actions</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleReplayWorkflow}
                    disabled={isGenerating || isResetting}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Replay Workflow</span>
                  </button>

                  <button
                    onClick={handleResetSandbox}
                    disabled={isGenerating || isResetting}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-900/60 border border-slate-800 hover:border-rose-500/30 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Purge Sandbox</span>
                  </button>
                </div>

                {workflowStep && (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-lg px-3 py-2 text-[10px] font-mono text-emerald-400 flex items-center gap-2 animate-pulse">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{workflowStep}</span>
                  </div>
                )}
              </div>

              {/* Action Section: Simulation Controls */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block">Simulation Core Toggles</span>
                
                <div className="space-y-2">
                  {/* Toggle 1: Citizen Simulation */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-200">Auto Citizen Reports</span>
                      <span className="block text-[10px] text-slate-500">Injects random symptoms every 10s</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={simCitizenEnabled}
                        onChange={(e) => setSimCitizenEnabled(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-emerald-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-950 border border-slate-700"></div>
                    </label>
                  </div>

                  {/* Toggle 2: Doctor Simulation */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-200">Auto Doctor Reviews</span>
                      <span className="block text-[10px] text-slate-500">Resolves 1 case from queue every 12s</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={simDoctorEnabled}
                        onChange={(e) => setSimDoctorEnabled(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-emerald-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-950 border border-slate-700"></div>
                    </label>
                  </div>

                  {/* Action 3: Manual Triage Injection */}
                  <button
                    onClick={async () => {
                      try {
                        await generateRandomHealthEvent();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    disabled={isGenerating || isResetting}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/20 text-slate-200 hover:text-amber-400 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Trigger Random Health Event</span>
                  </button>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="flex-1 flex flex-col min-h-[220px]">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Live Activity Feed</span>
                  <span className="text-[9px] font-mono text-emerald-400 animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Listening</span>
                  </span>
                </div>

                <div className="flex-1 min-h-0 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-4 overflow-y-auto max-h-[300px] flex flex-col gap-3 custom-scrollbar">
                  {timeline.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <Clock className="w-5 h-5 text-slate-700 mb-2" />
                      <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">No events logged</span>
                      <span className="text-[10px] text-slate-600 mt-1">Initiate mock logs above to seed timeline activity.</span>
                    </div>
                  ) : (
                    timeline.map((event) => (
                      <div key={event.id} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0 text-left">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-200 line-clamp-1">{event.title}</span>
                          <span className="text-[9px] font-mono text-slate-500 shrink-0 mt-0.5">{event.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{event.description}</p>
                        
                        {/* Tags */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold tracking-wide ${getSeverityStyles(event.severity)}`}>
                            {event.severity}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600 uppercase">
                            {event.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={timelineEndRef} />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
