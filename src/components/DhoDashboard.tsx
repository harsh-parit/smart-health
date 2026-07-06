/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Landmark, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Activity, 
  ArrowLeft, 
  Bell, 
  LogOut, 
  ShieldAlert,
  ServerCrash,
  BarChart3,
  Globe,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

interface DhoDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function DhoDashboard({ onBackToRoles, onLogout }: DhoDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'inventory'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'overview' as const, label: 'District Overview', icon: Landmark },
    { id: 'analytics' as const, label: 'Outbreak Analytics', icon: BarChart3 },
    { id: 'inventory' as const, label: 'Supply Chain', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-rose-100/10 rounded-full blur-3xl pointer-events-none" />

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
            DHO Central
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
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white relative shadow-md shadow-amber-500/10">
                <Landmark className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-display font-bold text-slate-950 tracking-tight text-xs leading-none block">
                  DHO Central
                </span>
                <span className="block text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-0.5 leading-none">
                  District Command
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
                      ? 'bg-amber-50 text-amber-700 border border-amber-100/35' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
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

      {/* Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 space-y-8 relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Upper Header Block (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              Epidemiological Control Console
            </span>
            <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight mt-0.5">
              District Health Dashboard
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

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overview Cards (4 grids) */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                Overview Cards
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total PHCs */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32 relative overflow-hidden">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Total PHCs
                  </span>
                  <div>
                    <span className="text-2xl font-display font-black text-slate-900">14</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">100% Operational</span>
                  </div>
                  <Landmark className="absolute right-4 bottom-4 w-10 h-10 text-slate-100/80 pointer-events-none" />
                </div>

                {/* 2. Today's Cases */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32 relative overflow-hidden">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Today's Cases
                  </span>
                  <div>
                    <span className="text-2xl font-display font-black text-slate-900">182</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ Logged & Managed</span>
                  </div>
                  <Activity className="absolute right-4 bottom-4 w-10 h-10 text-slate-100/80 pointer-events-none" />
                </div>

                {/* 3. Alerts */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32 relative overflow-hidden">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Alerts
                  </span>
                  <div>
                    <span className="text-2xl font-display font-black text-rose-600">02</span>
                    <span className="text-[10px] text-rose-500 font-semibold block mt-1">Outbreaks Flagged</span>
                  </div>
                  <AlertTriangle className="absolute right-4 bottom-4 w-10 h-10 text-rose-50 pointer-events-none" />
                </div>

                {/* 4. Medicine Availability */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32 relative overflow-hidden">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Medicine Stock
                  </span>
                  <div>
                    <span className="text-2xl font-display font-black text-slate-900">94%</span>
                    <span className="text-[10px] text-amber-600 font-semibold block mt-1">Normal Supply Level</span>
                  </div>
                  <Package className="absolute right-4 bottom-4 w-10 h-10 text-slate-100/80 pointer-events-none" />
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
                  onClick={() => alert("Detailed Health Analytics engine coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-amber-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Metrics</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Health Analytics
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("Medicine Logistics ledger coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Supplies</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Medicine Inventory
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("High Risk Alerts command center coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-rose-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Triage</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      High Risk Alerts
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => alert("Resource dispatch sheets coming in next sprint.")}
                  className="bg-white border border-slate-100 hover:border-blue-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Logistics</h3>
                    <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                      Resource Allocation
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Empty State representing Real-time streaming */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                Real-Time Outbreak Map
              </h2>

              <div className="bg-white border border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center min-h-[220px]">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
                  <ServerCrash className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-slate-700 text-sm">
                  Waiting for real-time data
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-normal">
                  District epidemiology coordinates and PHC patient intakes are queued for FHIR synchronization. Live mapping is scheduled to start streaming in next sprint.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <BarChart3 className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-display font-bold text-slate-700 text-sm">Outbreak analysis offline</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Geospatial pathogen analysis and vector migration metrics are offline. Database schemas are coming in next sprint.
              </p>
            </div>
          </motion.div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Package className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-display font-bold text-slate-700 text-sm">Inventory ledger locked</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                District-level medical stockpile telemetry and supply chain routing is arriving in the next release sprint.
              </p>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
