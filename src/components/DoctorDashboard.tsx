/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Users, 
  FileText, 
  PlusCircle, 
  ArrowLeft, 
  Bell, 
  LogOut, 
  Stethoscope, 
  ChevronRight,
  Clipboard,
  Pill,
  Send,
  Search,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

interface DoctorDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function DoctorDashboard({ onBackToRoles, onLogout }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'queue' | 'records'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'home' as const, label: 'Clinical Hub', icon: Stethoscope },
    { id: 'queue' as const, label: 'Patient Queue', icon: Users },
    { id: 'records' as const, label: 'Electronic Records', icon: Clipboard },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile Top Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-extrabold text-slate-900 text-sm">
            Clinician Portal
          </span>
        </div>

        <button
          onClick={onBackToRoles}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Roles</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white relative shadow-md shadow-purple-500/10">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-display font-bold text-slate-950 tracking-tight text-xs leading-none block">
                  Doctor Portal
                </span>
                <span className="block text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-0.5 leading-none">
                  Smart Health AI
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-purple-50 text-purple-700 border border-purple-100/30' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer buttons */}
        <div className="space-y-2 border-t border-slate-50 pt-6">
          <button
            onClick={onBackToRoles}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-transparent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Switch Role</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 transition-all border border-transparent cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 space-y-8 relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Upper Header (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              Clinical Support Workspace
            </span>
            <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight mt-0.5">
              Welcome, Doctor
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Notification feature coming in next sprint.")}
              className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl relative transition-all border border-slate-100 shadow-xs"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </div>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Today's Queue */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-purple-50/30 to-transparent rounded-full pointer-events-none" />

              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Today's Queue
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient Case 1 */}
                <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3 relative group hover:border-purple-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100/40 px-2 py-0.5 rounded-lg">
                      High Priority
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">#01</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm">Amina Khatun</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Gestational hypertension, localized preeclampsia screening</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span>ASHA: Savitri Devi</span>
                    <span className="font-semibold text-slate-700">9 mins ago</span>
                  </div>
                </div>

                {/* Patient Case 2 */}
                <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3 relative group hover:border-purple-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100/40 px-2 py-0.5 rounded-lg">
                      Moderate
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">#02</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm">Gopal Sharma</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Chronic diabetic ulcer, requests insulin renewal</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span>ASHA: Savitri Devi</span>
                    <span className="font-semibold text-slate-700">22 mins ago</span>
                  </div>
                </div>

                {/* Patient Case 3 */}
                <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3 relative group hover:border-purple-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100/40 px-2 py-0.5 rounded-lg">
                      Routine
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">#03</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm">Arjun Das</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Seasonal allergic rhinitis, general advisory request</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Self-Check</span>
                    <span className="font-semibold text-slate-700">45 mins ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('queue')}
                  className="bg-white border border-slate-100 hover:border-purple-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Operations</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Patient Queue
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("Interactive consultation pad coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-blue-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Intake</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Consultation Notes
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("Digital e-prescriptions console coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Therapeutics</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Prescriptions
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("Referrals routing desk coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-amber-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Outbound</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Referrals
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Patients */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                Recent Patients
              </h2>

              <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[180px]">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-slate-700 text-sm">
                  No patients available
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-normal">
                  There are no recently archived consultations or outpatient histories logged during this clinical session.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Queue Tab */}
        {activeTab === 'queue' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient roster queue..."
                disabled
                className="bg-transparent border-none text-xs outline-none w-full text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Users className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-display font-bold text-slate-700 text-sm">Roster queue offline</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Clinical outpatient streaming queue and automatic FHIR ingestion protocols are set up. Live syncing is arriving in next sprint.
              </p>
            </div>
          </motion.div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Clipboard className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-display font-bold text-slate-700 text-sm">Records ledger locked</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Electronic patient summaries are encrypted for privacy compliance. Secured viewing credentials will arrive in the next sprint release.
              </p>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
