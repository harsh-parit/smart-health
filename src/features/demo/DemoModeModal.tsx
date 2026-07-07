/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  Sparkles, 
  Terminal, 
  LockKeyhole 
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDemoUser: (demoUser: { user: any; profile: UserProfile }) => void;
}

export default function DemoModeModal({ isOpen, onClose, onSelectDemoUser }: DemoModeModalProps) {
  const demoUsers = [
    {
      id: 'citizen',
      role: 'citizen' as UserRole,
      name: 'Ramesh Kumar',
      email: 'ramesh.kumar@demo.smarthealthai',
      roleTitle: 'Citizen (Patient Portal)',
      focus: 'Multi-dialect symptom entry, real-time translations, and automated severity warnings.',
      icon: User,
      color: 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/60 hover:bg-blue-500/10 text-blue-600',
      tag: 'Translation & Triage',
    },
    {
      id: 'asha',
      role: 'asha' as UserRole,
      name: 'Sunita Devi',
      email: 'sunita.devi@demo.smarthealthai',
      roleTitle: 'ASHA Worker',
      focus: 'Frontline field checks, instant high-risk alerts, and offline-compatible patient visit sync.',
      icon: ShieldCheck,
      color: 'border-[#ec003f]/20 bg-[#ec003f]/5 hover:border-[#ec003f]/60 hover:bg-[#ec003f]/10 text-[#ec003f]',
      tag: 'Field Verification',
    },
    {
      id: 'doctor',
      role: 'doctor' as UserRole,
      name: 'Dr. Anand Verma',
      email: 'anand.verma@demo.smarthealthai',
      roleTitle: 'Doctor (Clinical Copilot)',
      focus: 'WHO treatment protocol guidelines, automatic SOAP medical note drafting, and script review.',
      icon: Activity,
      color: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-emerald-600',
      tag: 'Decision Support',
    },
    {
      id: 'districtOfficer',
      role: 'districtOfficer' as UserRole,
      name: 'Dr. Rajesh Patel',
      email: 'rajesh.patel@demo.smarthealthai',
      roleTitle: 'District Health Officer',
      focus: 'Geocoded epidemiological heatmap tracking, infection cluster alarms, and resource telemetry.',
      icon: BarChart3,
      color: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/60 hover:bg-amber-500/10 text-amber-600',
      tag: 'Regional Command',
    },
  ];

  const handleSelect = (userItem: typeof demoUsers[0]) => {
    const mockUser = {
      uid: `demo-uid-${userItem.id}`,
      email: userItem.email,
      displayName: `${userItem.name} (Demo)`,
      emailVerified: true,
      isAnonymous: false,
    };

    const mockProfile: UserProfile = {
      uid: `demo-uid-${userItem.id}`,
      name: userItem.name,
      email: userItem.email,
      role: userItem.role,
      district: 'Raipur District, CG',
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      lastLogin: { seconds: Date.now() / 1000, nanoseconds: 0 },
    };

    onSelectDemoUser({ user: mockUser, profile: mockProfile });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] shadow-3xl max-w-2xl w-full p-6 md:p-8 relative z-10 overflow-hidden"
          >
            {/* Header Sparkle Icon Grid Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1.5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-[10px] font-bold uppercase tracking-wider font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                  <span>Interactive Demonstration Suite</span>
                </div>
                <h3 className="text-2xl font-display font-black text-slate-950 tracking-tight leading-none">
                  Launch Presentation Sandbox
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  Select any profile below to bypass Firebase authentication and evaluate full-stack workflows using pre-configured local telemetry data.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of 4 simulated user accounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {demoUsers.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`border text-left p-5 rounded-2xl flex gap-4 transition-all hover:shadow-lg cursor-pointer duration-200 group relative overflow-hidden ${item.color}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm relative z-10">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 relative z-10 text-slate-900">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-slate-950 text-sm group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500 leading-none">
                        {item.roleTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 font-sans leading-tight pt-1.5 border-t border-slate-100 mt-1.5">
                        {item.focus}
                      </p>
                    </div>

                    {/* Gradient background hover fade */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                  </button>
                );
              })}
            </div>

            {/* Verification & Sandbox Info Bar */}
            <div className="bg-slate-950/90 text-slate-400 rounded-2xl p-4 flex items-center gap-3 border border-slate-800 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-amber-500 border border-slate-800 shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-[10px] leading-relaxed">
                <div className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <LockKeyhole className="w-3.5 h-3.5 text-amber-500" />
                  <span>Production Identity Integrity Protected</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  Real client authentication is bypassed **locally only**. No write transactions will modify live production records. This feature is compiled-out of the production application bundle.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
