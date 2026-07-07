/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
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
  BarChart3,
  Globe,
  PlusCircle,
  Menu,
  X,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  UserCheck,
  ChevronRight,
  Shield,
  Truck,
  Download,
  Printer,
  Calendar,
  Layers,
  Heart,
  Plus,
  ArrowRight,
  Check,
  FileSpreadsheet,
  Settings,
  RefreshCw,
  Clock,
  Briefcase
} from 'lucide-react';

interface DhoDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

// Interfaces for our interactive clinical states
interface HighRiskPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  symptoms: string[];
  vitals: {
    bp: string;
    pulse: number;
    bloodSugar: number;
    temp: number;
  };
  riskScore: number; // 1-100 scale
  status: 'Critical' | 'Warning' | 'Stable';
  flowStatus: 'Pending ASHA' | 'ASHA Dispatched' | 'Specialist Assigned' | 'Resolved';
  reportedDate: string;
}

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minSafety: number;
  unit: string;
  status: 'Optimal' | 'Low Stock' | 'Critical';
  facility: string;
  lastSupplied: string;
}

interface HealthAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
  acknowledged: boolean;
  village: string;
  patientsAffected: number;
  status: 'Active' | 'Assigned' | 'Reviewed';
  assignedTeam?: string;
  notes?: string;
}

export default function DhoDashboard({ onBackToRoles, onLogout }: DhoDashboardProps) {
  // Navigation Tabs including custom sub-actions
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'alerts' | 'inventory' | 'reports'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Success Notification state
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Interactive Medicine Reorder Form Overlay State
  const [selectedMedicineToReorder, setSelectedMedicineToReorder] = useState<MedicineItem | null>(null);
  const [reorderQty, setReorderQty] = useState<number>(1000);

  // Health Outbreak Alerts sub-system states
  const [alertSubTab, setAlertSubTab] = useState<'outbreaks' | 'citizens'>('outbreaks');
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState<HealthAlert | null>(null);
  const [alertToAssignTeam, setAlertToAssignTeam] = useState<HealthAlert | null>(null);
  const [assignTeamName, setAssignTeamName] = useState('District Rapid Response Squad A');

  // Simulated Datasets with full CRUD/Interaction support
  const [highRiskPatients, setHighRiskPatients] = useState<HighRiskPatient[]>([
    {
      id: 'HRP-01',
      name: 'Ramesh Kumar',
      age: 58,
      gender: 'Male',
      village: 'Unao Village',
      symptoms: ['Chest Tightness', 'Severe Headache', 'Dizziness'],
      vitals: { bp: '168/104', pulse: 98, bloodSugar: 280, temp: 98.6 },
      riskScore: 92,
      status: 'Critical',
      flowStatus: 'Pending ASHA',
      reportedDate: 'Today, 08:30 AM'
    },
    {
      id: 'HRP-02',
      name: 'Savitri Bai',
      age: 42,
      gender: 'Female',
      village: 'Bhander Block',
      symptoms: ['Polyuria', 'Extreme Fatigue', 'Blurred Vision'],
      vitals: { bp: '150/95', pulse: 82, bloodSugar: 340, temp: 99.1 },
      riskScore: 84,
      status: 'Critical',
      flowStatus: 'Specialist Assigned',
      reportedDate: 'Today, 06:15 AM'
    },
    {
      id: 'HRP-03',
      name: 'Geeta Ahirwar',
      age: 31,
      gender: 'Female (Pregnant)',
      village: 'Indergarh',
      symptoms: ['Spiking Fever', 'Chills', 'Nausea'],
      vitals: { bp: '138/88', pulse: 104, bloodSugar: 110, temp: 102.4 },
      riskScore: 81,
      status: 'Warning',
      flowStatus: 'ASHA Dispatched',
      reportedDate: 'Yesterday, 05:40 PM'
    },
    {
      id: 'HRP-04',
      name: 'Karan Singh',
      age: 67,
      gender: 'Male',
      village: 'Datia Central',
      symptoms: ['Persistent Cough', 'Shortness of Breath'],
      vitals: { bp: '142/90', pulse: 90, bloodSugar: 160, temp: 100.2 },
      riskScore: 72,
      status: 'Warning',
      flowStatus: 'Pending ASHA',
      reportedDate: 'Yesterday, 11:20 AM'
    },
    {
      id: 'HRP-05',
      name: 'Radhe Jatav',
      age: 49,
      gender: 'Male',
      village: 'Unao Village',
      symptoms: ['Acute Watery Diarrhoea', 'Muscle Cramps'],
      vitals: { bp: '110/72', pulse: 112, bloodSugar: 98, temp: 101.1 },
      riskScore: 88,
      status: 'Critical',
      flowStatus: 'Pending ASHA',
      reportedDate: 'Today, 09:10 AM'
    }
  ]);

  const [medicineInventory, setMedicineInventory] = useState<MedicineItem[]>([
    { id: 'MED-101', name: 'Paracetamol 500mg', category: 'Analgesics', stock: 14200, minSafety: 5000, unit: 'Tablets', status: 'Optimal', facility: 'Datia Storage', lastSupplied: '2026-06-28' },
    { id: 'MED-102', name: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 1200, minSafety: 4000, unit: 'Tablets', status: 'Critical', facility: 'Unao PHC Depot', lastSupplied: '2026-06-15' },
    { id: 'MED-103', name: 'Metformin 500mg', category: 'Antidiabetics', stock: 8500, minSafety: 3000, unit: 'Tablets', status: 'Optimal', facility: 'Datia Storage', lastSupplied: '2026-06-25' },
    { id: 'MED-104', name: 'Amlodipine 5mg', category: 'Antihypertensives', stock: 3200, minSafety: 3000, unit: 'Tablets', status: 'Low Stock', facility: 'Seondha PHC Depot', lastSupplied: '2026-06-22' },
    { id: 'MED-105', name: 'Oral Rehydration Salts (ORS)', category: 'Electrolytes', stock: 4500, minSafety: 2000, unit: 'Sachets', status: 'Optimal', facility: 'Datia Storage', lastSupplied: '2026-07-01' },
    { id: 'MED-106', name: 'Measles-Rubella Vaccine', category: 'Immunologicals', stock: 80, minSafety: 500, unit: 'Vials', status: 'Critical', facility: 'Cold Chain Unit', lastSupplied: '2026-05-10' },
    { id: 'MED-107', name: 'Insulin Glargine 100 IU', category: 'Hormones', stock: 45, minSafety: 200, unit: 'Vials', status: 'Critical', facility: 'Cold Chain Unit', lastSupplied: '2026-05-18' },
    { id: 'MED-108', name: 'Artesunate 60mg Injection', category: 'Antimalarials', stock: 950, minSafety: 800, unit: 'Ampoules', status: 'Low Stock', facility: 'Indergarh Depot', lastSupplied: '2026-06-20' }
  ]);

  const [alerts, setAlerts] = useState<HealthAlert[]>([
    {
      id: 'ALT-01',
      title: 'Waterborne Outbreak Signal',
      description: 'Acute Watery Diarrhoea spike (5 new cases) logged in Unao Village. Suspected community reservoir contamination.',
      severity: 'critical',
      category: 'Gastroenteritis',
      timestamp: 'Today, 09:25 AM',
      acknowledged: false,
      village: 'Unao Village',
      patientsAffected: 5,
      status: 'Active'
    },
    {
      id: 'ALT-02',
      title: 'Critical Cold Chain Breach Risk',
      description: 'Main Cold Chain Vault temp fluctuated to +8.2°C. Vaccine potency integrity compromised.',
      severity: 'high',
      category: 'Logistical Outbreak',
      timestamp: 'Today, 07:45 AM',
      acknowledged: false,
      village: 'Datia Storage Hub',
      patientsAffected: 0,
      status: 'Active'
    },
    {
      id: 'ALT-03',
      title: 'Pediatric Fever Referral Alarm',
      description: 'ASHA worker reports 3 pediatric pyrexia cases non-responsive to paracetamol in Indergarh. Direct referral scheduled.',
      severity: 'medium',
      category: 'Viral Pyrexia',
      timestamp: 'Yesterday, 04:30 PM',
      acknowledged: false,
      village: 'Indergarh Block',
      patientsAffected: 3,
      status: 'Assigned',
      assignedTeam: 'PHC Triage Team B'
    },
    {
      id: 'ALT-04',
      title: 'Amoxicillin Shortage Warning',
      description: 'District level supply of pediatric antibiotic Amoxicillin fell below minimum emergency threshold. Affected pediatric population high.',
      severity: 'low',
      category: 'Logistical Shortage',
      timestamp: 'Yesterday, 10:15 AM',
      acknowledged: true,
      village: 'Seondha PHC',
      patientsAffected: 12,
      status: 'Reviewed'
    }
  ]);

  // Report Generator Simulation State
  const [reportType, setReportType] = useState<'Epidemiological' | 'Logistical' | 'Operational'>('Epidemiological');
  const [reportDateRange, setReportDateRange] = useState('Last 14 Days');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReportPreview, setGeneratedReportPreview] = useState<boolean>(false);

  // Charts Datasets matching standard Datia District Metrics
  const patientTrendData = [
    { name: '22 Jun', Routine: 110, HighRisk: 12 },
    { name: '24 Jun', Routine: 132, HighRisk: 15 },
    { name: '26 Jun', Routine: 148, HighRisk: 21 },
    { name: '28 Jun', Routine: 125, HighRisk: 14 },
    { name: '30 Jun', Routine: 165, HighRisk: 26 },
    { name: '02 Jul', Routine: 180, HighRisk: 29 },
    { name: '04 Jul', Routine: 202, HighRisk: 32 },
    { name: '06 Jul', Routine: 182, HighRisk: 24 },
  ];

  const diseaseDistributionData = [
    { name: 'Hypertension', value: 412, color: '#3B82F6' },
    { name: 'Diabetes Type 2', value: 298, color: '#8B5CF6' },
    { name: 'Gastroenteritis', value: 189, color: '#F59E0B' },
    { name: 'Respiratory Inf.', value: 245, color: '#10B981' },
    { name: 'Malaria & Fevers', value: 115, color: '#EF4444' },
  ];

  const referralTrendData = [
    { block: 'Datia Block', ASHA: 45, PHC: 32, District: 14 },
    { block: 'Bhander', ASHA: 38, PHC: 28, District: 10 },
    { block: 'Indergarh', ASHA: 52, PHC: 41, District: 18 },
    { block: 'Seondha', ASHA: 29, PHC: 22, District: 8 },
  ];

  // Calculated Stats dynamically derived from real state!
  const statTotalPatients = 1482;
  const statTodayCases = 182;
  const statHighRiskCases = highRiskPatients.filter(p => p.flowStatus !== 'Resolved').length;
  const statPendingReviews = 18;
  const statMedicineAvailability = `${Math.round((medicineInventory.filter(m => m.status === 'Optimal').length / medicineInventory.length) * 100)}%`;

  // Navigation Items matching DHO Sidebar
  const navigationItems = [
    { id: 'overview' as const, label: 'District Commander', icon: Landmark },
    { id: 'analytics' as const, label: 'Epidemiology Analytics', icon: BarChart3 },
    { id: 'alerts' as const, label: 'High Risk Alert Core', icon: ShieldAlert },
    { id: 'inventory' as const, label: 'Medicine stockpile', icon: Package },
    { id: 'reports' as const, label: 'Report Generator', icon: FileText },
  ];

  const showToastMessage = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 4500);
  };

  // Dispatch ASHA Worker Event handler
  const handleDispatchAsha = (patientId: string) => {
    setHighRiskPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, flowStatus: 'ASHA Dispatched' };
      }
      return p;
    }));
    const ptName = highRiskPatients.find(p => p.id === patientId)?.name || 'Patient';
    showToastMessage(`ASHA Field Officer dispatched to triage ${ptName} immediately.`);
  };

  // Escalate to Specialist Event handler
  const handleAssignSpecialist = (patientId: string) => {
    setHighRiskPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, flowStatus: 'Specialist Assigned' };
      }
      return p;
    }));
    const ptName = highRiskPatients.find(p => p.id === patientId)?.name || 'Patient';
    showToastMessage(`Escalated ${ptName} to Senior Medical Specialist at Datia District Hospital.`);
  };

  // Resolve Alert Event handler
  const handleResolvePatient = (patientId: string) => {
    setHighRiskPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, flowStatus: 'Resolved' };
      }
      return p;
    }));
    const ptName = highRiskPatients.find(p => p.id === patientId)?.name || 'Patient';
    showToastMessage(`Patient ${ptName}'s emergency health signal marked as Resolved.`);
  };

  // Acknowledge Alert Message
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, acknowledged: true, status: 'Reviewed' };
      }
      return a;
    }));
    showToastMessage("Pathogen signal acknowledged and marked as Reviewed.");
  };

  const handleAssignTeamToAlert = (id: string, team: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'Assigned', assignedTeam: team };
      }
      return a;
    }));
    showToastMessage(`Response team "${team}" successfully assigned to alert.`);
  };

  const handleMarkAlertReviewed = (id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'Reviewed', acknowledged: true };
      }
      return a;
    }));
    showToastMessage("Alert marked as Reviewed and filed in clinical logs.");
  };

  // Handle Medicine Stock Reorder Request Submission
  const handleSubmitReorder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicineToReorder) return;

    setMedicineInventory(prev => prev.map(m => {
      if (m.id === selectedMedicineToReorder.id) {
        const newStock = m.stock + reorderQty;
        const newStatus = newStock >= m.minSafety ? 'Optimal' : 'Low Stock';
        return { ...m, stock: newStock, status: newStatus as 'Optimal' | 'Low Stock' | 'Critical', lastSupplied: new Date().toISOString().split('T')[0] };
      }
      return m;
    }));

    showToastMessage(`Dispatched emergency requisition of ${reorderQty} units of ${selectedMedicineToReorder.name}.`);
    setSelectedMedicineToReorder(null);
  };

  // Trigger simulated report compile process
  const handleCompileReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setGeneratedReportPreview(true);
      showToastMessage(`${reportType} clinical audit report successfully compiled and finalized.`);
    }, 1500);
  };

  // Trigger real print function for report preview
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] flex flex-col md:flex-row relative overflow-hidden text-slate-800 selection:bg-amber-100 selection:text-amber-900 font-sans">
      {/* Dynamic light background elements - Material Design 3 Palette */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-amber-100/25 to-orange-50/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-gradient-to-tr from-purple-50/20 to-amber-50/20 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between bg-white/95 backdrop-blur-md px-6 py-4 border-b border-orange-100/40 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              D
            </div>
            <span className="font-display font-black text-slate-900 tracking-tight text-sm">
              DHO Command Center
            </span>
          </div>
        </div>

        <button
          onClick={onBackToRoles}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-650 hover:bg-slate-50 rounded-full transition-all border border-orange-100/30"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Roles</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-orange-100/30 p-6 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white relative shadow-md shadow-orange-500/10">
                <Landmark className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-display font-black text-slate-950 tracking-tight text-xs leading-none block uppercase">
                  DHO COMMAND
                </span>
                <span className="block text-[8px] font-mono text-orange-600 uppercase font-black tracking-widest mt-0.5 leading-none">
                  District Datia Hub
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full md:hidden"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-orange-50 text-orange-900 border border-orange-100/40 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer buttons */}
        <div className="space-y-2 border-t border-slate-100 pt-6">
          <button
            onClick={onBackToRoles}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-transparent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Switch Portal Role</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50/40 transition-all border border-transparent cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out Command</span>
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
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 space-y-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Upper Header Block (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between pb-6 border-b border-orange-100/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded">
                National Health Mission (NHM) Telehealth protocol
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">Streaming Online</span>
            </div>
            <h1 className="text-2xl font-display font-black text-slate-950 tracking-tight mt-1.5">
              District Chief Health Administration Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Clock Badge */}
            <div className="bg-white/80 border border-slate-200/60 shadow-xs px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold text-slate-600 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>16:32 PM (IST)</span>
            </div>

            <button 
              onClick={() => showToastMessage("Clinical notification queue synchronised with state health repository.")}
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl relative transition-all border border-slate-200/40 bg-white/50 shadow-xs"
              title="System Alerts Inbox"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-600" />
            </button>
          </div>
        </div>

        {/* 1. Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Statistics - Grid of 5 (MD3 cards style) */}
            <div className="space-y-3.5">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono pl-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                <span>District Key Health Indictors</span>
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Total Patients */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-5 shadow-xs flex flex-col justify-between h-34 relative overflow-hidden hover:shadow-sm transition-all group">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Total Patients
                  </span>
                  <div>
                    <span className="text-3xl font-display font-black text-slate-900 group-hover:text-orange-700 transition-colors">
                      {statTotalPatients}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                      ↑ +12.4% vs last mo
                    </span>
                  </div>
                  <UserCheck className="absolute right-4 bottom-4 w-11 h-11 text-slate-50/80 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* 2. Today's Cases */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-5 shadow-xs flex flex-col justify-between h-34 relative overflow-hidden hover:shadow-sm transition-all group">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Today's Cases
                  </span>
                  <div>
                    <span className="text-3xl font-display font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                      {statTodayCases}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                      ✓ Logged & Managed
                    </span>
                  </div>
                  <Activity className="absolute right-4 bottom-4 w-11 h-11 text-slate-50/80 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* 3. High Risk Cases */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-5 shadow-xs flex flex-col justify-between h-34 relative overflow-hidden hover:shadow-sm transition-all group">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    High Risk Cases
                  </span>
                  <div>
                    <span className="text-3xl font-display font-black text-rose-600 group-hover:text-rose-700 transition-colors">
                      {statHighRiskCases}
                    </span>
                    <span className="text-[10px] text-rose-500 font-bold block mt-1">
                      Requires ASHA Review
                    </span>
                  </div>
                  <AlertTriangle className="absolute right-4 bottom-4 w-11 h-11 text-rose-50 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* 4. Pending Doctor Reviews */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-5 shadow-xs flex flex-col justify-between h-34 relative overflow-hidden hover:shadow-sm transition-all group">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Pending Reviews
                  </span>
                  <div>
                    <span className="text-3xl font-display font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                      {statPendingReviews}
                    </span>
                    <span className="text-[10px] text-purple-600 font-semibold block mt-1">
                      Avg wait: 14 mins
                    </span>
                  </div>
                  <Clock className="absolute right-4 bottom-4 w-11 h-11 text-slate-50/80 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* 5. Medicine Stock */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-5 shadow-xs flex flex-col justify-between h-34 relative overflow-hidden hover:shadow-sm transition-all group">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Medicine Stock
                  </span>
                  <div>
                    <span className="text-3xl font-display font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {statMedicineAvailability}
                    </span>
                    <span className="text-[10px] text-amber-600 font-bold block mt-1">
                      3 items running critical
                    </span>
                  </div>
                  <Package className="absolute right-4 bottom-4 w-11 h-11 text-slate-50/80 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Actions - Material Design 3 bento cards */}
            <div className="space-y-3.5">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono pl-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                <span>Clinical Command Quick Actions</span>
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Health Analytics */}
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="bg-white border border-orange-100/30 hover:border-amber-100 hover:shadow-md rounded-3xl p-5 flex flex-col items-start text-left justify-between gap-5 transition-all cursor-pointer group active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Epidemiology Data</h3>
                    <span className="text-sm font-display font-extrabold text-slate-900 mt-0.5 block flex items-center gap-1">
                      <span>Health Analytics</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>

                {/* 2. High Risk Alerts */}
                <button
                  onClick={() => setActiveTab('alerts')}
                  className="bg-white border border-orange-100/30 hover:border-rose-100 hover:shadow-md rounded-3xl p-5 flex flex-col items-start text-left justify-between gap-5 transition-all cursor-pointer group active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">ASHA Coordination</h3>
                    <span className="text-sm font-display font-extrabold text-slate-900 mt-0.5 block flex items-center gap-1">
                      <span>High Risk Alerts</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>

                {/* 3. Medicine Inventory */}
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="bg-white border border-orange-100/30 hover:border-emerald-100 hover:shadow-md rounded-3xl p-5 flex flex-col items-start text-left justify-between gap-5 transition-all cursor-pointer group active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Logistics Buffer</h3>
                    <span className="text-sm font-display font-extrabold text-slate-900 mt-0.5 block flex items-center gap-1">
                      <span>Medicine Inventory</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>

                {/* 4. Generate Reports */}
                <button
                  onClick={() => setActiveTab('reports')}
                  className="bg-white border border-orange-100/30 hover:border-blue-100 hover:shadow-md rounded-3xl p-5 flex flex-col items-start text-left justify-between gap-5 transition-all cursor-pointer group active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Audit finalisation</h3>
                    <span className="text-sm font-display font-extrabold text-slate-900 mt-0.5 block flex items-center gap-1">
                      <span>Generate Reports</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Split Grid for Main Charts & Recent Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Essential Visualizations */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Patient Intake Trend Card */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Time Series Trends</h3>
                      <h4 className="text-base font-display font-black text-slate-900 mt-0.5">District Patient Load Trend</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-200/50">
                      15 Days Moving Interval
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={patientTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRoutine" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                        <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                        <Area type="monotone" dataKey="Routine" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRoutine)" name="Routine Consultations" />
                        <Area type="monotone" dataKey="HighRisk" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHighRisk)" name="High Risk Warnings" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Grid for Disease Distribution and Referral source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Disease Distribution Pie Chart */}
                  <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Pathology Clusters</h3>
                      <h4 className="text-sm font-display font-black text-slate-900 mt-0.5">Prevalent Diseases Distribution</h4>
                    </div>
                    <div className="h-44 w-full relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={diseaseDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {diseaseDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">Prevalence</span>
                        <span className="text-base font-display font-black text-slate-900">Datia</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500 font-medium">
                      {diseaseDistributionData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="truncate">{item.name} ({item.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral Trend Bar Chart */}
                  <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Triage Pathways</h3>
                      <h4 className="text-sm font-display font-black text-slate-900 mt-0.5">Referral & Escalation Metrics</h4>
                    </div>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referralTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="block" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                          <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '10px' }} />
                          <Bar dataKey="ASHA" fill="#EAB308" radius={[4, 4, 0, 0]} name="ASHA Flags" />
                          <Bar dataKey="PHC" fill="#A855F7" radius={[4, 4, 0, 0]} name="PHC Audits" />
                          <Bar dataKey="District" fill="#F43F5E" radius={[4, 4, 0, 0]} name="District Trans" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-around text-[10px] text-slate-400 pt-1 border-t border-slate-50 font-mono">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" /> ASHA referred
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500" /> PHC level
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> Senior Hosp
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Pathogen Alerts & Command Centre Log */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Active Epidemic Signals Feed */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs flex flex-col justify-between min-h-[420px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-orange-50">
                      <div>
                        <h4 className="text-sm font-display font-black text-slate-900">Critical Outbreak Alerts</h4>
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-450">Active Pathogen Streams</span>
                      </div>
                      <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-100">
                        {alerts.filter(a => !a.acknowledged).length} New
                      </span>
                    </div>

                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {alerts.map((alertItem) => (
                          <motion.div
                            key={alertItem.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`p-4 rounded-2xl border transition-all ${
                              alertItem.acknowledged
                                ? 'bg-slate-50/50 border-slate-200/50 opacity-65'
                                : alertItem.severity === 'critical'
                                  ? 'bg-rose-50/55 border-rose-200/80 shadow-2xs animate-pulse'
                                  : alertItem.severity === 'high'
                                    ? 'bg-orange-50/45 border-orange-200/70 shadow-2xs'
                                    : alertItem.severity === 'medium'
                                      ? 'bg-amber-50/45 border-amber-200/60'
                                      : 'bg-slate-50/60 border-slate-250/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                                alertItem.severity === 'critical'
                                  ? 'bg-rose-100 text-rose-800'
                                  : alertItem.severity === 'high'
                                    ? 'bg-orange-100 text-orange-800'
                                    : alertItem.severity === 'medium'
                                      ? 'bg-amber-100 text-amber-850'
                                      : 'bg-slate-100 text-slate-700'
                              }`}>
                                {alertItem.category} • {alertItem.severity.toUpperCase()}
                              </span>
                              <span className="text-[8px] font-mono text-slate-400">{alertItem.timestamp}</span>
                            </div>

                            <h5 className="text-xs font-bold text-slate-900 mt-2">{alertItem.title}</h5>
                            <p className="text-[11px] text-slate-600 leading-normal mt-1">
                              {alertItem.description}
                            </p>

                            {!alertItem.acknowledged && (
                              <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100">
                                <button
                                  onClick={() => handleAcknowledgeAlert(alertItem.id)}
                                  className="text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                                >
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span>File Signal</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveTab('alerts');
                                    showToastMessage(`Switching console view to manage: ${alertItem.title}`);
                                  }}
                                  className="text-[10px] font-bold bg-orange-650 hover:bg-orange-700 text-white px-3 py-1 rounded-lg transition-colors cursor-pointer"
                                >
                                  Investigate
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <p className="text-[9px] font-mono text-slate-400">
                      Standard operating telemetry complies with India WHO Integrated Disease Surveillance Program (IDSP)
                    </p>
                  </div>
                </div>

                {/* Quick Stats Summary Widget */}
                <div className="bg-gradient-to-br from-orange-650 to-amber-700 rounded-[2rem] p-6 text-white shadow-md relative overflow-hidden">
                  <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                  <span className="text-[9px] font-mono uppercase font-extrabold tracking-wider bg-white/10 px-2 py-0.5 rounded inline-block">
                    Datia Command Metrics
                  </span>
                  <h4 className="text-sm font-display font-black mt-2">Active Field Response Matrix</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10 text-white">
                    <div>
                      <span className="text-[10px] text-white/70 block uppercase tracking-wide font-mono">ASHA Response</span>
                      <span className="text-xl font-display font-bold block mt-0.5">14 Active</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/70 block uppercase tracking-wide font-mono">Clinics Active</span>
                      <span className="text-xl font-display font-bold block mt-0.5">12 Block PHC</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* 2. Epidemiology Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* MD3 Title bar */}
            <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Advanced Pathology Audit</span>
                <h2 className="text-xl font-display font-black text-slate-900 mt-0.5">District Epidemiology Analytics Explorer</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">Block Territory:</span>
                <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none">
                  <option>All Blocks (Datia, Bhander, Indergarh, Seondha)</option>
                  <option>Datia Block Only</option>
                  <option>Bhander Block Only</option>
                  <option>Indergarh Block Only</option>
                </select>
              </div>
            </div>

            {/* Complete interactive dashboard of charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Analytics Summary Scorecards */}
              <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs space-y-6 lg:col-span-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Epidemic Risk Scorecard</h3>
                
                <div className="space-y-4">
                  <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-4">
                    <span className="text-[9px] font-mono font-bold text-rose-500 uppercase block">UNAO CLUSTER RISK RATING</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-display font-black text-rose-700">HIGH</span>
                      <span className="text-xs font-mono text-slate-400">(Score: 84/100)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Elevated risk calculated due to rapid temporal clustering of acute diarrhea symptoms. Water pipeline decontamination recommended.
                    </p>
                  </div>

                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4">
                    <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase block">CLINICAL DIAGNOSTIC ACCURACY</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-display font-black text-emerald-700">96.8%</span>
                      <span className="text-xs font-mono text-slate-400">(Target: 95%)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      High diagnostic concordance verified between regional ASHA field screening triggers and doctor telemedicine finalizations.
                    </p>
                  </div>

                  <div className="bg-purple-50/30 border border-purple-100 rounded-2xl p-4">
                    <span className="text-[9px] font-mono font-bold text-purple-600 uppercase block">TELEHEALTH TRIAGE EFFICIENCY</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-display font-black text-purple-700">14.2m</span>
                      <span className="text-xs font-mono text-slate-400">(Median Response)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Average elapsed duration between ASHA rural triage uploads and attending specialist digital SOAP signature.
                    </p>
                  </div>
                </div>
              </div>

              {/* Big Area Chart: Long Term Pathogen Intake */}
              <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs space-y-4 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Pathology Volume Metrics</h3>
                  <h4 className="text-base font-display font-black text-slate-900 mt-0.5">District Outbreak Volume & Pathology Vectors</h4>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={patientTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" dataKey="Routine" stroke="#10B981" fillOpacity={0.15} fill="#10B981" name="Routine Health Diagnostics" />
                      <Area type="monotone" dataKey="HighRisk" stroke="#F59E0B" fillOpacity={0.15} fill="#F59E0B" name="Active Vector Isolation Flags" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-[11px] text-slate-450 italic leading-relaxed pt-2 border-t border-slate-50 text-center">
                  Live pathogen trend charts are generated directly from aggregate, anonymized PHC electronic health registers (EHR).
                </div>
              </div>

            </div>

            {/* Demographics bento grid segment */}
            <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Population Stratification</h3>
              <h4 className="text-base font-display font-black text-slate-900 mt-0.5">Age & Gender Stratified Risk Prevalence</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/40">
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono">Pediatric (0-12 Yrs)</span>
                  <span className="text-xl font-display font-black text-slate-800 mt-1 block">18% of cases</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Normal baseline</span>
                </div>
                <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/40">
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono">Maternal / Pregnant</span>
                  <span className="text-xl font-display font-black text-orange-600 mt-1 block">6.4% of cases</span>
                  <span className="text-[10px] text-amber-500 font-bold block mt-0.5">High vigilance active</span>
                </div>
                <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/40">
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono">Adult (13-59 Yrs)</span>
                  <span className="text-xl font-display font-black text-slate-800 mt-1 block">48.2% of cases</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Mainly occupational flu</span>
                </div>
                <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/40">
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono">Geriatric (60+ Yrs)</span>
                  <span className="text-xl font-display font-black text-rose-600 mt-1 block">27.4% of cases</span>
                  <span className="text-[10px] text-rose-500 font-bold block mt-0.5">Cardiovascular risk alert</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. High Risk Alert Core Tab */}
        {activeTab === 'alerts' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title & Interactive Filter Header */}
            <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-rose-500">ASHA Integrated Triage Command</span>
                <h2 className="text-xl font-display font-black text-slate-900 mt-0.5">District Health Outbreak & High Risk Monitor</h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Box */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search alert/village/category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-200 w-52"
                  />
                </div>

                {/* Risk Filter */}
                <div className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="All">All Risk Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Material Design 3 Toggle Tabs */}
            <div className="flex border-b border-orange-100/30">
              <button
                onClick={() => setAlertSubTab('outbreaks')}
                className={`px-6 py-3 text-xs font-bold transition-all relative cursor-pointer ${
                  alertSubTab === 'outbreaks'
                    ? 'text-orange-900 border-b-2 border-orange-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Health Outbreak Alerts ({alerts.filter(a => a.status !== 'Reviewed').length})
              </button>
              <button
                onClick={() => setAlertSubTab('citizens')}
                className={`px-6 py-3 text-xs font-bold transition-all relative cursor-pointer ${
                  alertSubTab === 'citizens'
                    ? 'text-orange-900 border-b-2 border-orange-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                High Risk Citizen Tracker ({highRiskPatients.filter(p => p.flowStatus !== 'Resolved').length})
              </button>
            </div>

            {alertSubTab === 'outbreaks' ? (
              /* Outbreak Alert Grid */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {alerts
                    .filter(alertItem => {
                      const matchesSearch = 
                        alertItem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        alertItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        alertItem.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        alertItem.category.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesRisk = 
                        riskFilter === 'All' || 
                        alertItem.severity.toLowerCase() === riskFilter.toLowerCase();
                      return matchesSearch && matchesRisk;
                    })
                    .map((alertItem) => {
                      let severityColors = {
                        bg: 'bg-rose-50/20 hover:bg-rose-50/45 border-rose-200/50',
                        badge: 'bg-rose-100 text-rose-800 border-rose-200/45',
                        iconColor: 'text-rose-500'
                      };
                      if (alertItem.severity === 'high') {
                        severityColors = {
                          bg: 'bg-orange-50/20 hover:bg-orange-50/40 border-orange-200/50',
                          badge: 'bg-orange-100 text-orange-800 border-orange-200/40',
                          iconColor: 'text-orange-500'
                        };
                      } else if (alertItem.severity === 'medium') {
                        severityColors = {
                          bg: 'bg-amber-50/20 hover:bg-amber-50/40 border-amber-200/50',
                          badge: 'bg-amber-100 text-amber-850 border-amber-200/40',
                          iconColor: 'text-amber-500'
                        };
                      } else if (alertItem.severity === 'low') {
                        severityColors = {
                          bg: 'bg-slate-50/45 hover:bg-slate-50/80 border-slate-200/50',
                          badge: 'bg-slate-100 text-slate-700 border-slate-200/40',
                          iconColor: 'text-slate-500'
                        };
                      }

                      return (
                        <motion.div
                          key={alertItem.id}
                          layout
                          className={`p-6 rounded-[2rem] border transition-all flex flex-col justify-between ${severityColors.bg}`}
                        >
                          <div>
                            {/* Card Header: Severity capsule & Status capsule */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${severityColors.badge}`}>
                                  {alertItem.severity.toUpperCase()} ALERT
                                </span>
                                <span className="text-[10px] font-mono font-bold bg-white/80 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-250/40">
                                  {alertItem.category}
                                </span>
                              </div>
                              <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                alertItem.status === 'Active'
                                  ? 'bg-rose-50 text-rose-750 border-rose-200/50 animate-pulse'
                                  : alertItem.status === 'Assigned'
                                    ? 'bg-purple-50 text-purple-750 border-purple-200/50'
                                    : 'bg-emerald-50 text-emerald-750 border-emerald-200/50'
                              }`}>
                                ● {alertItem.status}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-display font-black text-slate-900 mt-4 leading-snug">
                              {alertItem.title}
                            </h3>

                            {/* Description */}
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                              {alertItem.description}
                            </p>

                            {/* Detail Fields Requested by User */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 mt-4 pt-4 border-t border-slate-200/35 text-xs text-slate-600">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <div>
                                  <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase leading-none">Village Location</span>
                                  <span className="font-bold text-slate-800 mt-0.5 block">{alertItem.village}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" />
                                <div>
                                  <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase leading-none">Patients Affected</span>
                                  <span className="font-bold text-slate-800 mt-0.5 block">{alertItem.patientsAffected} cases</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <div>
                                  <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase leading-none">Reported Time</span>
                                  <span className="font-bold text-slate-800 mt-0.5 block">{alertItem.timestamp}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-slate-400" />
                                <div>
                                  <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase leading-none">Active Assignment</span>
                                  <span className="font-bold text-slate-800 mt-0.5 block truncate max-w-[120px]">
                                    {alertItem.assignedTeam || 'None Allocated'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions Footer */}
                          <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-200/35">
                            <button
                              onClick={() => setSelectedAlertForDetails(alertItem)}
                              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
                            >
                              View Details
                            </button>
                            
                            {alertItem.status !== 'Reviewed' && (
                              <>
                                <button
                                  onClick={() => setAlertToAssignTeam(alertItem)}
                                  className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Assign Team</span>
                                </button>
                                
                                <button
                                  onClick={() => handleMarkAlertReviewed(alertItem.id)}
                                  className="px-3.5 py-1.5 bg-orange-650 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 border border-transparent"
                                >
                                  Mark Reviewed
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}

                  {alerts.filter(alertItem => {
                    const matchesSearch = 
                      alertItem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      alertItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      alertItem.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      alertItem.category.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesRisk = 
                      riskFilter === 'All' || 
                      alertItem.severity.toLowerCase() === riskFilter.toLowerCase();
                    return matchesSearch && matchesRisk;
                  }).length === 0 && (
                    <div className="col-span-1 md:col-span-2 bg-white border border-orange-100/30 rounded-[2rem] p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <CheckCircle2 className="w-12 h-12 text-slate-200" />
                        <h4 className="text-sm font-bold text-slate-700">No Outbreak Alerts Found</h4>
                        <p className="text-xs text-slate-400">All regional community outbreaks are currently controlled, assigned, or reviewed.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Pre-existing High Risk Citizen Tracker Table */
              <div className="space-y-6">
                <div className="bg-white border border-orange-100/30 rounded-[2rem] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-orange-100/20 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Emergency ID & Name</th>
                          <th className="px-6 py-4">Demographics</th>
                          <th className="px-6 py-4">Active Triage Vitals</th>
                          <th className="px-6 py-4">Symptoms Flagged</th>
                          <th className="px-6 py-4 text-center">Emergency Status</th>
                          <th className="px-6 py-4">Response Progress</th>
                          <th className="px-6 py-4 text-right">Command Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                        {highRiskPatients
                          .filter(p => {
                            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.village.toLowerCase().includes(searchQuery.toLowerCase());
                            const matchesRisk = riskFilter === 'All' || p.status === riskFilter;
                            return matchesSearch && matchesRisk;
                          })
                          .map((p) => (
                            <tr 
                              key={p.id} 
                              className={`hover:bg-orange-50/10 transition-colors ${p.flowStatus === 'Resolved' ? 'bg-slate-50/40 opacity-60' : ''}`}
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <span className="text-[10px] font-mono text-orange-600 block">{p.id}</span>
                                  <span className="font-display font-bold text-slate-900 text-sm mt-0.5 block">{p.name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium block">Reported: {p.reportedDate}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <span className="block">{p.age} Yrs / {p.gender}</span>
                                  <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide flex items-center gap-1 mt-0.5">
                                    <Globe className="w-3 h-3 text-orange-500" />
                                    <span>{p.village}</span>
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1 text-[11px] font-mono">
                                  <div>BP: <strong className="text-slate-950 font-bold">{p.vitals.bp}</strong> mmHg</div>
                                  <div>B.Sugar: <strong className="text-slate-950 font-bold">{p.vitals.bloodSugar}</strong> mg/dL</div>
                                  <div>Temp: <strong className={p.vitals.temp > 99.5 ? "text-rose-600 font-bold" : "text-slate-950"}>{p.vitals.temp}°F</strong></div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {p.symptoms.map((sym, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-700 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                                      {sym}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                  p.status === 'Critical'
                                    ? 'text-rose-700 bg-rose-50 border border-rose-100'
                                    : 'text-amber-700 bg-amber-50 border border-amber-100'
                                }`}>
                                  {p.status} (Sc: {p.riskScore})
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                  p.flowStatus === 'Resolved'
                                    ? 'text-emerald-700'
                                    : p.flowStatus === 'ASHA Dispatched'
                                      ? 'text-yellow-600'
                                      : p.flowStatus === 'Specialist Assigned'
                                        ? 'text-purple-600'
                                        : 'text-rose-500 animate-pulse'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    p.flowStatus === 'Resolved' ? 'bg-emerald-500' : p.flowStatus === 'ASHA Dispatched' ? 'bg-yellow-500' : p.flowStatus === 'Specialist Assigned' ? 'bg-purple-500' : 'bg-rose-500'
                                  }`} />
                                  <span>{p.flowStatus}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {p.flowStatus === 'Resolved' ? (
                                  <span className="text-[10px] text-slate-400 font-bold italic flex items-center justify-end gap-1">
                                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                                    <span>Signal resolved</span>
                                  </span>
                                ) : (
                                  <div className="flex items-center justify-end gap-2">
                                    {p.flowStatus === 'Pending ASHA' && (
                                      <button
                                        onClick={() => handleDispatchAsha(p.id)}
                                        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                                        title="Mobilize rural health officer to patient home coordinates"
                                      >
                                        <Truck className="w-3 h-3" />
                                        <span>Dispatch ASHA</span>
                                      </button>
                                    )}
                                    {p.flowStatus !== 'Specialist Assigned' && (
                                      <button
                                        onClick={() => handleAssignSpecialist(p.id)}
                                        className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                                        title="Initiate urgent clinical tele-consult with district physician"
                                      >
                                        <UserCheck className="w-3 h-3" />
                                        <span>Escalate Specialist</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleResolvePatient(p.id)}
                                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer active:scale-95"
                                      title="Close patient file and archive"
                                    >
                                      Resolve
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        {highRiskPatients.filter(p => {
                          const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.village.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesRisk = riskFilter === 'All' || p.status === riskFilter;
                          return matchesSearch && matchesRisk;
                        }).length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <CheckCircle2 className="w-10 h-10 text-slate-200" />
                                <p className="text-xs font-bold text-slate-700">No active high-risk patients matched</p>
                                <p className="text-[11px] text-slate-400">All citizens in Datia region are currently stabilized or resolved.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Information panel about ASHA command protocol */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Unified Rural Healthcare Command & Protocol</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    This portal operates in real-time correlation with primary health workers (ASHA) using mobile diagnostic apps and regional community health centers. All dispatch commands are cryptographically cataloged for compliance auditing.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Medicine Stockpile Tab */}
        {activeTab === 'inventory' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title & Interactive Stockpile Header */}
            <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-600">District Essential Medicines List (EML)</span>
                <h2 className="text-xl font-display font-black text-slate-900 mt-0.5">Medicine Stockpile & Supply Chain</h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Box */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search medicine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-200 w-44"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Analgesics">Analgesics</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Antidiabetics">Antidiabetics</option>
                    <option value="Electrolytes">Electrolytes</option>
                    <option value="Immunologicals">Immunologicals</option>
                    <option value="Hormones">Hormones</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inventory Ledger Table */}
            <div className="bg-white border border-orange-100/30 rounded-[2rem] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-orange-100/20 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Medicine Code & Name</th>
                      <th className="px-6 py-4">Therapeutic Category</th>
                      <th className="px-6 py-4">Current Stock Level</th>
                      <th className="px-6 py-4">Minimum Buffer</th>
                      <th className="px-6 py-4 text-center">Stockpile Health</th>
                      <th className="px-6 py-4">Assigned Warehouse Depot</th>
                      <th className="px-6 py-4">Last Supply Inflow</th>
                      <th className="px-6 py-4 text-right">Logistical Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {medicineInventory
                      .filter(m => {
                        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
                        return matchesSearch && matchesCategory;
                      })
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-orange-50/10 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block">{m.id}</span>
                              <span className="font-display font-bold text-slate-900 text-sm mt-0.5 block">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-lg font-mono font-bold">
                              {m.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono font-bold text-slate-900">
                              {m.stock.toLocaleString()} {m.unit}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                            {m.minSafety.toLocaleString()} {m.unit}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              m.status === 'Optimal'
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-100/50'
                                : m.status === 'Low Stock'
                                  ? 'text-amber-700 bg-amber-50 border border-amber-100/50'
                                  : 'text-rose-700 bg-rose-50 border border-rose-100/50'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-650">
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                              <span>{m.facility}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                            {m.lastSupplied}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedMedicineToReorder(m);
                                setReorderQty(m.status === 'Critical' ? 5000 : 2000);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-755 hover:text-slate-950 text-[10px] font-bold rounded-lg transition-colors cursor-pointer active:scale-95"
                            >
                              Emergency Reorder
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Informational strip */}
            <div className="bg-orange-50/20 border border-orange-100/30 rounded-[2rem] p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Essential Buffer Protocol</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  The Minimum Buffer represents the mandatory District emergency backup threshold. Falling below this level automatically triggers an integrated requisition order with the Central State Pharma Warehouse.
                </p>
              </div>
              <div className="flex items-center justify-start md:justify-end gap-3">
                <button
                  onClick={() => {
                    showToastMessage("Exporting district EML stock logs as CSV...");
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export Stock Sheets</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 5. Report Generator Tab */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Report Form panel */}
            <div className="bg-white border border-orange-100/30 rounded-[2rem] p-8 shadow-xs">
              <div className="max-w-2xl">
                <span className="text-[9px] font-mono font-bold uppercase text-orange-650">District Health Ledger</span>
                <h2 className="text-xl font-display font-black text-slate-900 mt-0.5">
                  Pathogen Audit & Health Report Compiler
                </h2>
                <p className="text-xs text-slate-450 leading-relaxed mt-1">
                  Configure the target telemetry parameters below to compile a formalized, print-ready healthcare audit document for Datia District health authorities.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {/* Select Report Theme */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 block">
                      Report Classification
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => {
                        setReportType(e.target.value as any);
                        setGeneratedReportPreview(false);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                    >
                      <option value="Epidemiological">Epidemiological Outbreaks & Pathogens</option>
                      <option value="Logistical">Logistical Buffer & Medicine Stockpile</option>
                      <option value="Operational">Operational Triage & ASHA Performance</option>
                    </select>
                  </div>

                  {/* Select Date Range */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 block">
                      Time Range Interval
                    </label>
                    <select
                      value={reportDateRange}
                      onChange={(e) => {
                        setReportDateRange(e.target.value);
                        setGeneratedReportPreview(false);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                    >
                      <option value="Last 24 Hours">Last 24 Hours</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 14 Days">Last 14 Days</option>
                      <option value="Current Fiscal Quarter">Current Fiscal Quarter</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleCompileReport}
                    disabled={isGeneratingReport}
                    className="px-5 py-2.5 bg-orange-650 hover:bg-orange-700 disabled:bg-slate-100 text-[#1d293d] disabled:text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-sm"
                  >
                    {isGeneratingReport ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                        <span>Compiling Audit Registry...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Compile & Finalise Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Live Report Preview Document (Material / Clincal Style) */}
            {generatedReportPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-350 rounded-[2rem] shadow-sm overflow-hidden"
              >
                {/* Print/Download toolbar */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    Compiled Preview Document
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintReport}
                      className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Document</span>
                    </button>
                    <button
                      onClick={() => showToastMessage("Downloading compiled report PDF...")}
                      className="px-4 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* The Clinical Sheet Content */}
                <div id="clinical-print-element" className="p-8 sm:p-12 space-y-6">
                  {/* Document Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-orange-600 text-white flex items-center justify-center rounded-xl font-display font-bold">
                        NHM
                      </div>
                      <div>
                        <h3 className="text-base font-display font-black tracking-wide uppercase text-slate-950">
                          GOVERNMENT OF MADHYA PRADESH
                        </h3>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                          Office of the District Health Officer • Datia Region
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right font-mono text-[9px] text-slate-500">
                      <div>REPORT-ID: NHM-DTA-2026-0922</div>
                      <div>COMPILED ON: 2026-07-06 03:34 AM</div>
                      <div>CLASSIFICATION: {reportType.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Title and stats summary */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-display font-extrabold text-slate-900">
                      District Executive Health Summary ({reportType})
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      This audit review details the {reportType.toLowerCase()} indices for Datia district during the {reportDateRange.toLowerCase()} monitoring period. Findings are aggregate calculations based on telemetry pipelines verified under NHM.
                    </p>
                  </div>

                  {/* Contextualized content based on chosen report type */}
                  {reportType === 'Epidemiological' && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">TOTAL INTUBATIONS</span>
                          <span className="text-lg font-display font-bold text-slate-800">182 Cases</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">OUTBREAK ALERT TRIGGERS</span>
                          <span className="text-lg font-display font-bold text-rose-600">02 High Risk</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">MORTALITY RATIO</span>
                          <span className="text-lg font-display font-bold text-slate-800">0.0% (Stable)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">EPIDEMIOLOGY FINDINGS & NOTES</span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          1. <strong>Unao Village Outbreak Cluster</strong>: Significant localized rise in Acute Watery Diarrhoea is flagged. Water sample isolation is active. Precautionary halogen tablets are distributed by ASHA workers.<br />
                          2. <strong>Respiratory Vector Baselines</strong>: Influenza and standard URI are within predictable seasonal standard deviation thresholds across Seondha and Indergarh blocks.
                        </p>
                      </div>
                    </div>
                  )}

                  {reportType === 'Logistical' && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">EML AVAILABILITY RATING</span>
                          <span className="text-lg font-display font-bold text-slate-800">88.5% Optimal</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">CRITICAL DEFICITS</span>
                          <span className="text-lg font-display font-bold text-rose-600">3 Medicines</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">REPLENISHMENT LATENCY</span>
                          <span className="text-lg font-display font-bold text-slate-800">48h (Scheduled)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">SUPPLY CHAIN ANOMALIES</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          - <strong>Measles Vaccines</strong>: Buffer is currently under safety thresholds in Bhander Cold Chain Hub. Vaccine dispatch command H-492 has been finalized.<br />
                          - <strong>Amoxicillin buffer level</strong>: Outflow registered elevated due to seasonal pediatric fever spikes. Dispatch from central Datia storage is underway.
                        </p>
                      </div>
                    </div>
                  )}

                  {reportType === 'Operational' && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">ACTIVE ASHA RATIO</span>
                          <span className="text-lg font-display font-bold text-slate-800">100% (14 Officers)</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">MEDIAN TRIAGE RESPONSE</span>
                          <span className="text-lg font-display font-bold text-purple-700">14.2 Mins</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">TELEHEALTH CONCORDANCE</span>
                          <span className="text-lg font-display font-bold text-slate-800">96.8% Satisfactory</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">COMMUNITY RESPONSE ANALYSIS</span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          - All 14 regional PHCs are fully operational under the Integrated Telehealth System. Digital diagnostic upload latency decreased by 18% following training rollout of active ASHA tablet updates.<br />
                          - High Risk triage response protocol has been successfully initiated for Ramesh Kumar and Radhe Jatav within 12 minutes of active field diagnostic telemetry logs.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Signatures */}
                  <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div>
                      <span>NHM CRYPTOGRAPHIC HASH: e4b292e22fa1896d85cd</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">Dr. Vikram S. Mehta, MD</p>
                      <p>Chief District Health Officer • Datia CMD</p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </main>

      {/* Success Notification MD3 Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4.5 h-4.5" />
              </div>
              <p className="text-xs font-semibold leading-normal">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast({ show: false, message: '' })}
              className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medicine Stock Reorder Overlay Dialog */}
      <AnimatePresence>
        {selectedMedicineToReorder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] border border-orange-100/30 shadow-xl max-w-md w-full p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-650" />
                  <h3 className="font-display font-black text-slate-900 text-sm">Emergency Medicine Reorder Requisition</h3>
                </div>
                <button
                  onClick={() => setSelectedMedicineToReorder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-750 hover:bg-slate-50 rounded-full"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Medicine Name:</span>
                  <span className="font-bold text-slate-850">{selectedMedicineToReorder.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Therapeutic Category:</span>
                  <span className="font-mono text-slate-850">{selectedMedicineToReorder.category}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Current Stock:</span>
                  <span className="font-mono font-bold text-rose-600">{selectedMedicineToReorder.stock.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Minimum Safety Stock:</span>
                  <span className="font-mono text-slate-600">{selectedMedicineToReorder.minSafety.toLocaleString()} units</span>
                </div>
              </div>

              <form onSubmit={handleSubmitReorder} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 block">
                    Reorder Quantity Units ({selectedMedicineToReorder.unit})
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={reorderQty}
                    onChange={(e) => setReorderQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-orange-200 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 italic block">
                    Recommended batch dispatch order: 5,000 tablets / 100 vials
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMedicineToReorder(null)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer text-center"
                  >
                    Cancel Requisition
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-orange-650 hover:bg-orange-700 text-[#45556c] transition-colors text-xs font-bold cursor-pointer text-center shadow-md shadow-orange-500/10"
                  >
                    Submit Requisition
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Details Dialog */}
      <AnimatePresence>
        {selectedAlertForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] border border-orange-100/30 shadow-xl max-w-lg w-full p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-orange-650" />
                  <h3 className="font-display font-black text-slate-900 text-sm">Epidemiological Alert Details</h3>
                </div>
                <button
                  onClick={() => setSelectedAlertForDetails(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-750 hover:bg-slate-50 rounded-full cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Outbreak Title</span>
                  <h4 className="text-base font-display font-black text-slate-950 mt-0.5">{selectedAlertForDetails.title}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">ALERT LEVEL</span>
                    <span className="font-bold text-slate-900 uppercase">{selectedAlertForDetails.severity}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">STATUS</span>
                    <span className="font-bold text-slate-900">{selectedAlertForDetails.status}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">VILLAGE</span>
                    <span className="font-bold text-slate-900">{selectedAlertForDetails.village}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">PATIENTS AFFECTED</span>
                    <span className="font-bold text-rose-600">{selectedAlertForDetails.patientsAffected} Citizens</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">REPORTED TIME</span>
                    <span className="font-mono text-slate-950">{selectedAlertForDetails.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">DISEASE CATEGORY</span>
                    <span className="font-mono text-slate-950">{selectedAlertForDetails.category}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Incident Description</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {selectedAlertForDetails.description}
                  </p>
                </div>

                {selectedAlertForDetails.assignedTeam && (
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Assigned Emergency Team</span>
                    <div className="mt-1 flex items-center gap-2 bg-purple-50 text-purple-900 px-3.5 py-2.5 rounded-xl border border-purple-100 text-xs font-bold">
                      <Truck className="w-4.5 h-4.5 text-purple-600 shrink-0" />
                      <span>{selectedAlertForDetails.assignedTeam}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 border-t border-slate-150 pt-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Protocol Action Checklists</span>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
                    <li>Activate ASHA rural field visit and patient monitoring registers.</li>
                    <li>Verify community water pipelines, temperature sensors or inventory levels.</li>
                    <li>Generate daily reports for NHM state telemedicine repository.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedAlertForDetails(null)}
                  className="w-full py-2.5 rounded-xl bg-orange-650 hover:bg-orange-700 text-white transition-colors text-xs font-bold cursor-pointer text-center shadow-md shadow-orange-500/10"
                >
                  Close Incident View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Responder Team Dialog */}
      <AnimatePresence>
        {alertToAssignTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] border border-orange-100/30 shadow-xl max-w-md w-full p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <h3 className="font-display font-black text-slate-900 text-sm">Assign Emergency Responder Team</h3>
                </div>
                <button
                  onClick={() => setAlertToAssignTeam(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-750 hover:bg-slate-50 rounded-full cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Outbreak Signal:</span>
                  <span className="font-bold text-slate-850">{alertToAssignTeam.title}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Village / Area:</span>
                  <span className="font-bold text-slate-850">{alertToAssignTeam.village}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Patients Affected:</span>
                  <span className="font-bold text-rose-600">{alertToAssignTeam.patientsAffected} Citizens</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450 block">
                    Select Response Unit
                  </label>
                  <select
                    value={assignTeamName}
                    onChange={(e) => setAssignTeamName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-purple-200"
                  >
                    <option value="District Epidemic Unit A">District Epidemic Unit A (Senior Officers)</option>
                    <option value="PHC Rapid Triage Team B">PHC Rapid Triage Team B (Bhander PHC)</option>
                    <option value="Seondha Emergency Sanitation Unit">Seondha Emergency Sanitation Unit</option>
                    <option value="Unao Water Safety & Audit Unit">Unao Water Safety & Audit Unit</option>
                    <option value="District Vaccine Cold Chain Response Force">District Vaccine Cold Chain Response Force</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAlertToAssignTeam(null)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleAssignTeamToAlert(alertToAssignTeam.id, assignTeamName);
                      setAlertToAssignTeam(null);
                    }}
                    className="w-1/2 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white transition-colors text-xs font-bold cursor-pointer text-center shadow-md shadow-purple-500/10"
                  >
                    Assign Responder Team
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
