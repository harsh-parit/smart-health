/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  FileText, 
  User, 
  Heart, 
  Activity, 
  PhoneCall, 
  Upload, 
  PlusCircle, 
  ArrowLeft, 
  Bell, 
  LogOut, 
  Inbox, 
  AlertCircle 
} from 'lucide-react';

interface CitizenDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function CitizenDashboard({ onBackToRoles, onLogout }: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'reports' | 'profile'>('home');
  const [reportedSymptom, setReportedSymptom] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between pb-24 relative overflow-hidden">
      {/* Background soft glow orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToRoles}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              title="Back to Role Selection"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                Smart Health AI | Patient Portal
              </span>
              <h1 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
                Welcome, Citizen
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert("Notification feature coming in next sprint.")}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl relative transition-all"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-all border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 space-y-8 relative z-10">
        
        {/* Active Tab: Home view */}
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Today's Health Status */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-blue-50/30 to-transparent rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Today's Health Status
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50/50 border border-slate-100/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Pulse Rate</span>
                    <span className="text-lg font-display font-bold text-slate-800">72 BPM</span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Healthy Range</span>
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-100/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Blood Oxygen</span>
                    <span className="text-lg font-display font-bold text-slate-800">98% SpO2</span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Optimal</span>
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-100/50 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Active Alerts</span>
                    <span className="text-lg font-display font-bold text-slate-800">None</span>
                    <span className="text-[10px] text-slate-400 block font-medium">All parameters secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Action 1: Report Symptoms */}
                <button
                  onClick={() => alert("Symptom reporter interface coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-blue-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-center text-center justify-center gap-3 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-display font-bold text-slate-800">
                    Report Symptoms
                  </span>
                </button>

                {/* Action 2: Upload Prescription */}
                <button
                  onClick={() => alert("Prescription upload assistant coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-center text-center justify-center gap-3 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-display font-bold text-slate-800">
                    Upload Prescription
                  </span>
                </button>

                {/* Action 3: View Reports */}
                <button
                  onClick={() => setActiveTab('reports')}
                  className="bg-white border border-slate-100 hover:border-purple-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-center text-center justify-center gap-3 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-display font-bold text-slate-800">
                    View Reports
                  </span>
                </button>

                {/* Action 4: Emergency Help */}
                <button
                  onClick={() => alert("Emergency SOS beacon coming in next sprint.")}
                  className="bg-red-50 hover:bg-red-100 border border-red-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-center text-center justify-center gap-3 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-display font-bold text-red-800">
                    Emergency Help
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                Recent Activity
              </h2>

              <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[180px]">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
                  <Inbox className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-slate-700 text-sm">
                  No reports available yet
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-normal">
                  Your clinical consultation logs and diagnostic test reviews will automatically synchronize here once received from your local community health worker.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Tab: Reports view */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-700 text-sm">
                No reports available yet
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-normal">
                There are no medical laboratory files, AI triage summaries, or vaccination credentials currently logged to your patient identifier.
              </p>
            </div>
          </motion.div>
        )}

        {/* Active Tab: Profile view */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mb-3">
                <User className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-slate-800 text-lg">Harsh Parit</h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">
                PATIENT ID: SH-8012-DEMO
              </span>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Registered Email</span>
                <span className="font-semibold text-slate-700">harshparit@gmail.com</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Demographics</span>
                <span className="font-semibold text-slate-700">Male, 29 Years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Location Sector</span>
                <span className="font-semibold text-slate-700">Sector 3 Rural Outpost</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Emergency Contact</span>
                <span className="font-semibold text-slate-700">+91 98765 43210</span>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-slate-100 py-3 px-6">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Bottom Nav Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Home</span>
          </button>

          {/* Bottom Nav Reports */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'reports' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Reports</span>
          </button>

          {/* Bottom Nav Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
