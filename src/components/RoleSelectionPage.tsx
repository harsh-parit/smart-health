/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Users, Activity, Landmark, ArrowLeft, LogOut, Info, AlertTriangle, Sparkles, X } from 'lucide-react';

interface RoleSelectionPageProps {
  onBackToLogin: () => void;
  onLogout: () => void;
}

interface RoleCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  hoverColor: string;
  accent: string;
}

export default function RoleSelectionPage({ onBackToLogin, onLogout }: RoleSelectionPageProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles: RoleCard[] = [
    {
      id: 'citizen',
      title: 'Citizen',
      subtitle: 'Patient Portal',
      description: 'Access personalized health cards, describe symptoms in local dialects, and track local family clinic records.',
      icon: User,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      hoverColor: 'hover:border-blue-300',
      accent: 'blue'
    },
    {
      id: 'asha',
      title: 'ASHA Worker',
      subtitle: 'Community Health Hub',
      description: 'Accredited Social Health Activist toolset to register households, run fast diagnostic advisory triage, and log vaccines.',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      hoverColor: 'hover:border-emerald-300',
      accent: 'emerald'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      subtitle: 'Clinical Copilot',
      description: 'Decision support system with automated chart summarization, ambient transcription, and regional vector disease advisories.',
      icon: Activity,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      hoverColor: 'hover:border-purple-300',
      accent: 'purple'
    },
    {
      id: 'dho',
      title: 'District Health Officer',
      subtitle: 'Intelligence Dashboard',
      description: 'Command center to evaluate district health metrics, geolocate epidemiologic outbreaks, and dispatch localized vaccine stock.',
      icon: Landmark,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      hoverColor: 'hover:border-amber-300',
      accent: 'amber'
    }
  ];

  const handleRoleClick = (role: RoleCard) => {
    setSelectedRole(role.title);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between py-12 px-6 relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top action header bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between mb-8 relative z-10">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Grid Card Panel */}
      <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Workspace Role</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Choose Your Access Role
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Please select your respective agency role to launch the specialized intelligence suite tailored for your specific community workflows.
          </p>
        </div>

        {/* Roles 4-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleRoleClick(role)}
              className={`bg-white border border-slate-100 hover:shadow-xl rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden group ${role.hoverColor}`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${role.color}`}>
                  <role.icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  {role.subtitle}
                </span>
                
                <h3 className="text-lg font-display font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                  {role.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {role.description}
                </p>
              </div>

              <div className="border-t border-slate-50 pt-4 text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                <span>Access Module</span>
                <span className="font-mono text-[10px] opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating alert backdrop for "Coming in next sprint" */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRole(null)}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl z-10 text-center space-y-4"
            >
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100">
                <Info className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-bold text-lg text-slate-800">
                  {selectedRole} Workspace
                </h4>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider font-mono">
                  Module Coming in Next Sprint
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                As per the strict community roadmap, clinical authentication logic and sandbox database schemas are complete. Direct integration interfaces are arriving in the next release sprint.
              </p>

              <button
                onClick={() => setSelectedRole(null)}
                className="w-full bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                Return to Selection
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standard bottom specs banner */}
      <footer className="max-w-5xl mx-auto w-full text-center relative z-10 pt-12">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          SYSTEM ENVIRONMENT: DEMO_MODE | SECURED BY FHIR COMPLIANCY PROTOCOLS
        </p>
      </footer>
    </div>
  );
}
