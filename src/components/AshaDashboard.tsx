/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  MapPin, 
  AlertTriangle, 
  FileCheck, 
  Clock, 
  ClipboardList, 
  ArrowLeft, 
  Bell, 
  LogOut, 
  Search,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

interface AshaDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function AshaDashboard({ onBackToRoles, onLogout }: AshaDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'patients' | 'tasks'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'home' as const, label: 'Dashboard Hub', icon: ClipboardList },
    { id: 'patients' as const, label: 'Patient Register', icon: Users },
    { id: 'tasks' as const, label: 'Task List', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Decorative glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-extrabold text-slate-900 text-sm">
            ASHA Hub
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
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white relative shadow-md shadow-emerald-500/10">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-display font-bold text-slate-950 tracking-tight text-xs leading-none block">
                  ASHA Portal
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
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/30' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
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

      {/* Backdrop for mobile menu drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 space-y-8 relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Upper Dashboard Header (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              Community Outreach Platform
            </span>
            <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight mt-0.5">
              Welcome, ASHA Worker
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

        {/* Tab Views */}
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Today's Assigned Visits */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-emerald-50/30 to-transparent rounded-full pointer-events-none" />

              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Today's Assigned Visits
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                      Visit 1 • 09:30 AM
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm">Meera Devi</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Maternal health follow-up & vaccination check</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sector 2, Family Hub</span>
                  </div>
                </div>

                <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                      Visit 2 • 11:45 AM
                    </span>
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm">Rajesh Kumar</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Post-operative outpatient wound dressing</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sector 3, Outer Border</span>
                  </div>
                </div>

                <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                      Visit 3 • 02:00 PM
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-sm">Sita Devi</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Infant immunization schedule & polio drops</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sector 2, Health Camp</span>
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
                  onClick={() => alert("Registration interface coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Outreach</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Register Patient
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("Home visits logbook interface coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-blue-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Itinerary</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Home Visits
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("High risk patients filter coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-rose-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Triage</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      High Risk Patients
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("Referral routing sheet coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-purple-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Advisory</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Referrals
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Today's Tasks (Empty State) */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                Today's Tasks
              </h2>

              <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[180px]">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-slate-700 text-sm">
                  No pending tasks
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-normal">
                  All task queues, patient records audits, and demographic reports are successfully completed for today.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered patients by name or ID..."
                disabled
                className="bg-transparent border-none text-xs outline-none w-full text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Users className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-display font-bold text-slate-700 text-sm">Patient directory offline</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Real-time patient directories are configured. Secure patient roster streaming is coming in next sprint.
              </p>
            </div>
          </motion.div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <FileCheck className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-display font-bold text-slate-700 text-sm">No tasks pending</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                You have logged and closed all demographic audits and vaccine inventories for Sector 3 Outpost.
              </p>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
