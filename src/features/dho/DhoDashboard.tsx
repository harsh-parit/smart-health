/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { db, getCollectionName } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { subscribeToDistrictIntelligence, classifyDiseaseCategory } from '../../services/districtAnalyticsService';
import { evaluateReportsForAlerts } from '../../services/alertGenerationService';
import { DistrictIntelligenceMetrics } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import DhoAiInsightsPanel from './DhoAiInsightsPanel';
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
  Briefcase,
  Baby,
  Award,
  Pill,
  Sparkles
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
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'alerts' | 'inventory' | 'reports' | 'ai-insights'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Advanced Health Analytics Dashboard state
  const [analyticsTimeFilter, setAnalyticsTimeFilter] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [analyticsBlockFilter, setAnalyticsBlockFilter] = useState<'All' | 'Datia' | 'Bhander' | 'Indergarh' | 'Seondha'>('All');
  const [activeAnalyticsSection, setActiveAnalyticsSection] = useState<'all' | 'disease' | 'referrals' | 'maternal' | 'child' | 'medicine' | 'phc'>('all');

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

  // Real-time Public Health Intelligence States
  const [liveMetrics, setLiveMetrics] = useState<DistrictIntelligenceMetrics | null>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(true);
  const [intelligenceError, setIntelligenceError] = useState<string | null>(null);
  const [timeWindowDays, setTimeWindowDays] = useState(7);
  const [caseThreshold, setCaseThreshold] = useState(2);

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

  // 1. Subscribe to Live District Intelligence & Outbreak Alerts in real-time
  useEffect(() => {
    setIntelligenceLoading(true);
    setIntelligenceError(null);

    // Subscribe to aggregated metrics computed from Firestore patientReports, consultations, and homeVisits
    const unsubscribeMetrics = subscribeToDistrictIntelligence(
      (data) => {
        setLiveMetrics(data);
        setIntelligenceLoading(false);
      },
      (err) => {
        console.error("Failed to load live district intelligence:", err);
        setIntelligenceError("Live stream paused. Connecting via resilient offline sync...");
        setIntelligenceLoading(false);
      }
    );

    // Subscribe to the real-time 'alerts' collection in Firestore
    const alertsQuery = query(collection(db, getCollectionName('alerts')), orderBy('generatedAt', 'desc'));
    const unsubscribeAlerts = onSnapshot(alertsQuery, (snap) => {
      const alertList: any[] = [];
      snap.forEach(docSnap => {
        alertList.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Map Firestore alert documents to the HealthAlert structure expected by the dashboard
      const mappedAlerts = alertList.map(a => ({
        id: a.id || a.alertId || Math.random().toString(),
        title: a.title || `${a.diseaseCategory} Outbreak Warning`,
        description: a.recommendedAction || a.description || 'Elevated risk detected. Action recommended.',
        severity: (a.severity || 'high').toLowerCase() as any,
        category: a.diseaseCategory,
        timestamp: a.generatedAt || 'Just now',
        acknowledged: a.status === 'Resolved',
        village: a.village,
        patientsAffected: a.numberOfCases || a.patientsAffected || 0,
        status: a.status || 'Active',
        assignedTeam: a.assignedTeam,
        recommendedAction: a.recommendedAction
      }));

      setAlerts(mappedAlerts);
    }, (err) => {
      console.warn("Failed to subscribe to alerts collection in Firestore:", err);
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeAlerts();
    };
  }, []);

  // 2. Run the Early Warning Engine whenever live reports or alerts update
  useEffect(() => {
    if (liveMetrics && liveMetrics.reports && liveMetrics.reports.length > 0) {
      // Map alerts back to the OutbreakAlert interface for evaluation
      const rawAlerts = alerts.map(a => ({
        alertId: a.id,
        village: a.village,
        district: 'Datia',
        diseaseCategory: a.category,
        numberOfCases: a.patientsAffected,
        severity: a.severity,
        generatedAt: a.timestamp,
        status: a.status,
        recommendedAction: a.description,
        assignedTeam: a.assignedTeam
      }));

      // Execute Early Warning Engine checks
      evaluateReportsForAlerts(liveMetrics.reports, rawAlerts, timeWindowDays, caseThreshold)
        .catch(err => console.error("Error executing outbreak evaluation:", err));
    }
  }, [liveMetrics, alerts, timeWindowDays, caseThreshold]);

  // 3. Keep highRiskPatients synced with live high-risk clinical reports
  useEffect(() => {
    if (liveMetrics && liveMetrics.reports && liveMetrics.reports.length > 0) {
      const liveHighRisk = liveMetrics.reports
        .filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'MEDIUM')
        .map(r => {
          const bpSystolic = r.geminiAnalysis?.detectedSymptoms?.includes('bp') ? 148 : 122;
          const bpDiastolic = r.geminiAnalysis?.detectedSymptoms?.includes('bp') ? 96 : 82;
          return {
            id: r.id || r.reportId || Math.random().toString(),
            name: r.patientInformation?.fullName || 'Anonymous Citizen',
            age: r.patientInformation?.age || 35,
            gender: r.patientInformation?.gender || 'Male',
            village: r.patientInformation?.village || 'Unao Village',
            symptoms: r.geminiAnalysis?.detectedSymptoms || [r.symptoms || 'Fever'],
            vitals: {
              bp: `${bpSystolic}/${bpDiastolic}`,
              pulse: 88,
              bloodSugar: 135,
              temp: r.geminiAnalysis?.detectedSymptoms?.includes('fever') ? 101.8 : 98.6
            },
            riskScore: r.riskLevel === 'HIGH' ? 92 : 68,
            status: r.riskLevel === 'HIGH' ? 'Critical' as const : 'Warning' as const,
            flowStatus: r.status === 'Completed' ? 'Resolved' as const : (r.status === 'Reviewed' ? 'Specialist Assigned' as const : 'Pending ASHA' as const),
            reportedDate: r.createdAt?.seconds 
              ? new Date(r.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) 
              : 'Today, 09:12 AM'
          };
        });

      if (liveHighRisk.length > 0) {
        setHighRiskPatients(liveHighRisk);
      }
    }
  }, [liveMetrics]);

  // Dynamic Multi-Dimensional Health Analytics Dataset Generator (No Firebase/AI) - Memoized for Performance
  const rawAd = useMemo(() => {
    const multiplier = analyticsBlockFilter === 'All' ? 1.0 :
                       analyticsBlockFilter === 'Datia' ? 0.38 :
                       analyticsBlockFilter === 'Bhander' ? 0.21 :
                       analyticsBlockFilter === 'Indergarh' ? 0.24 : 0.17;
    
    const scale = (val: number) => Math.max(1, Math.round(val * multiplier));

    if (analyticsTimeFilter === 'weekly') {
      return {
        summaryCards: [
          { title: 'Disease Burden', value: `${scale(312)} Cases`, subtext: 'Total Active Syndromic cases', change: '-4.2%', isPositive: true, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', section: 'disease' as const },
          { title: 'Referral Flow Rate', value: '18.2%', subtext: `${scale(44)} escalations routed`, change: '+1.5%', isPositive: false, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', section: 'referrals' as const },
          { title: 'Maternal Vigilance', value: `${scale(28)} Mothers`, subtext: 'High-risk trimesters active', change: '-3 cases', isPositive: true, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', section: 'maternal' as const },
          { title: 'Child Immunization', value: '92.4%', subtext: `${scale(145)} infants monitored`, change: '+0.8%', isPositive: true, icon: Baby, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', section: 'child' as const },
          { title: 'Medicine Replenish', value: `${scale(2)} Items Low`, subtext: 'Essential drugs below safety', change: '0 Change', isPositive: true, icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', section: 'medicine' as const },
          { title: 'PHC Action Velocity', value: '12.4m Avg', subtext: 'Median emergency dispatch speed', change: '-2.1m (Faster)', isPositive: true, icon: Award, color: 'text-cyan-600', bg: 'bg-cyan-50/50', border: 'border-cyan-100', section: 'phc' as const },
        ],
        diseasePieData: [
          { name: 'Hypertension', value: scale(92), color: '#3B82F6' },
          { name: 'Diabetes Type 2', value: scale(65), color: '#8B5CF6' },
          { name: 'Gastroenteritis', value: scale(45), color: '#F59E0B' },
          { name: 'Respiratory Inf.', value: scale(58), color: '#10B981' },
          { name: 'Malaria & Fevers', value: scale(25), color: '#EF4444' },
        ],
        diseaseTrendData: [
          { name: 'Mon', Infectious: scale(12), NonInfectious: scale(32), Chronic: scale(45) },
          { name: 'Tue', Infectious: scale(15), NonInfectious: scale(35), Chronic: scale(48) },
          { name: 'Wed', Infectious: scale(18), NonInfectious: scale(30), Chronic: scale(50) },
          { name: 'Thu', Infectious: scale(14), NonInfectious: scale(38), Chronic: scale(46) },
          { name: 'Fri', Infectious: scale(22), NonInfectious: scale(42), Chronic: scale(52) },
          { name: 'Sat', Infectious: scale(25), NonInfectious: scale(40), Chronic: scale(55) },
          { name: 'Sun', Infectious: scale(20), NonInfectious: scale(36), Chronic: scale(49) },
        ],
        referralFlowData: [
          { name: 'Mon', ASHA: scale(15), PHC: scale(12), District: scale(8) },
          { name: 'Tue', ASHA: scale(18), PHC: scale(14), District: scale(9) },
          { name: 'Wed', ASHA: scale(12), PHC: scale(10), District: scale(6) },
          { name: 'Thu', ASHA: scale(16), PHC: scale(13), District: scale(8) },
          { name: 'Fri', ASHA: scale(22), PHC: scale(18), District: scale(11) },
          { name: 'Sat', ASHA: scale(24), PHC: scale(20), District: scale(13) },
          { name: 'Sun', ASHA: scale(19), PHC: scale(15), District: scale(10) },
        ],
        referralReasons: [
          { reason: 'Cardio-Respiratory', percentage: 35, count: scale(28), status: 'critical' as const },
          { reason: 'Maternal Distress', percentage: 28, count: scale(22), status: 'high' as const },
          { reason: 'Severe Dehydration', percentage: 20, count: scale(16), status: 'high' as const },
          { reason: 'Pediatric Infection', percentage: 17, count: scale(14), status: 'medium' as const },
        ],
        maternalHealthData: [
          { name: 'Mon', ANC1: scale(15), ANC4: scale(10), Institutional: scale(8), Home: scale(1) },
          { name: 'Tue', ANC1: scale(18), ANC4: scale(12), Institutional: scale(9), Home: scale(2) },
          { name: 'Wed', ANC1: scale(12), ANC4: scale(8), Institutional: scale(6), Home: scale(1) },
          { name: 'Thu', ANC1: scale(16), ANC4: scale(11), Institutional: scale(8), Home: scale(1) },
          { name: 'Fri', ANC1: scale(22), ANC4: scale(15), Institutional: scale(11), Home: scale(2) },
          { name: 'Sat', ANC1: scale(24), ANC4: scale(17), Institutional: scale(13), Home: scale(2) },
          { name: 'Sun', ANC1: scale(19), ANC4: scale(13), Institutional: scale(10), Home: scale(1) },
        ],
        maternalRiskFactors: [
          { name: 'Severe Anemia (Hb < 8)', cases: scale(14), rate: '32.4%', severity: 'Critical' },
          { name: 'Gestational Diabetes', cases: scale(8), rate: '13.8%', severity: 'Medium' },
          { name: 'Pre-eclampsia (BP > 140/90)', cases: scale(11), rate: '11.5%', severity: 'Critical' },
          { name: 'Multiple Gestation', cases: scale(3), rate: '3.8%', severity: 'Medium' },
        ],
        childHealthData: [
          { name: 'Mon', FullyVaccinated: scale(32), SAM: scale(4), MAM: scale(12) },
          { name: 'Tue', FullyVaccinated: scale(35), SAM: scale(5), MAM: scale(14) },
          { name: 'Wed', FullyVaccinated: scale(30), SAM: scale(4), MAM: scale(11) },
          { name: 'Thu', FullyVaccinated: scale(38), SAM: scale(3), MAM: scale(13) },
          { name: 'Fri', FullyVaccinated: scale(42), SAM: scale(5), MAM: scale(16) },
          { name: 'Sat', FullyVaccinated: scale(40), SAM: scale(4), MAM: scale(15) },
          { name: 'Sun', FullyVaccinated: scale(36), SAM: scale(3), MAM: scale(12) },
        ],
        childImmunizationBreakdown: [
          { name: 'Mon', BCG: scale(12), OPV3: scale(10), Pentavalent3: scale(8), MR1: scale(6) },
          { name: 'Tue', BCG: scale(14), OPV3: scale(12), Pentavalent3: scale(9), MR1: scale(7) },
          { name: 'Wed', BCG: scale(11), OPV3: scale(9), Pentavalent3: scale(7), MR1: scale(5) },
          { name: 'Thu', BCG: scale(15), OPV3: scale(13), Pentavalent3: scale(10), MR1: scale(8) },
          { name: 'Fri', BCG: scale(17), OPV3: scale(15), Pentavalent3: scale(12), MR1: scale(10) },
          { name: 'Sat', BCG: scale(16), OPV3: scale(14), Pentavalent3: scale(11), MR1: scale(9) },
          { name: 'Sun', BCG: scale(14), OPV3: scale(12), Pentavalent3: scale(9), MR1: scale(7) },
        ],
        medicineUsageData: [
          { name: 'Paracetamol', Consumed: scale(1200), StockLevel: scale(14200) },
          { name: 'Amoxicillin', Consumed: scale(850), StockLevel: scale(1200) },
          { name: 'Metformin', Consumed: scale(950), StockLevel: scale(8500) },
          { name: 'ORS Packets', Consumed: scale(1400), StockLevel: scale(4500) },
          { name: 'MR Vaccine', Consumed: scale(180), StockLevel: scale(620) },
        ],
        medicineStockoutRisk: [
          { name: 'Amoxicillin 250mg', stock: scale(1200), minNeeded: scale(4000), daysLeft: 4, risk: 'High' as const },
          { name: 'Measles-Rubella Vaccine', stock: scale(80), minNeeded: scale(500), daysLeft: 5, risk: 'High' as const },
          { name: 'Insulin Glargine 100 IU', stock: scale(45), minNeeded: scale(200), daysLeft: 7, risk: 'High' as const },
          { name: 'Amlodipine 5mg', stock: scale(3200), minNeeded: scale(3000), daysLeft: 15, risk: 'Medium' as const },
        ],
        phcPerformanceData: [
          { name: 'Datia Central PHC', consultations: scale(450), responseTime: '8.5m', satisfaction: 94, drugsAvailability: 92, maternalReferrals: scale(12), immunizationRate: 94, rating: 4.8 },
          { name: 'Bhander PHC', consultations: scale(280), responseTime: '12.4m', satisfaction: 89, drugsAvailability: 81, maternalReferrals: scale(8), immunizationRate: 91, rating: 4.3 },
          { name: 'Indergarh PHC', consultations: scale(320), responseTime: '14.1m', satisfaction: 87, drugsAvailability: 83, maternalReferrals: scale(11), immunizationRate: 88, rating: 4.1 },
          { name: 'Seondha PHC', consultations: scale(220), responseTime: '16.8m', satisfaction: 86, drugsAvailability: 78, maternalReferrals: scale(6), immunizationRate: 86, rating: 3.9 },
          { name: 'Unao PHC', consultations: scale(190), responseTime: '10.2m', satisfaction: 92, drugsAvailability: 88, maternalReferrals: scale(5), immunizationRate: 92, rating: 4.6 },
        ]
      };
    } else if (analyticsTimeFilter === 'monthly') {
      return {
        summaryCards: [
          { title: 'Disease Burden', value: `${scale(1482)} Cases`, subtext: 'Total Active Syndromic cases', change: '-1.8%', isPositive: true, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', section: 'disease' as const },
          { title: 'Referral Flow Rate', value: '16.4%', subtext: `${scale(195)} escalations routed`, change: '-0.5%', isPositive: true, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', section: 'referrals' as const },
          { title: 'Maternal Vigilance', value: `${scale(98)} Mothers`, subtext: 'High-risk trimesters active', change: '-12 cases', isPositive: true, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', section: 'maternal' as const },
          { title: 'Child Immunization', value: '91.2%', subtext: `${scale(580)} infants monitored`, change: '+1.4%', isPositive: true, icon: Baby, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', section: 'child' as const },
          { title: 'Medicine Replenish', value: `${scale(3)} Items Low`, subtext: 'Essential drugs below safety', change: '+1 Item Low', isPositive: false, icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', section: 'medicine' as const },
          { title: 'PHC Action Velocity', value: '13.5m Avg', subtext: 'Median emergency dispatch speed', change: '-1.4m (Faster)', isPositive: true, icon: Award, color: 'text-cyan-600', bg: 'bg-cyan-50/50', border: 'border-cyan-100', section: 'phc' as const },
        ],
        diseasePieData: [
          { name: 'Hypertension', value: scale(412), color: '#3B82F6' },
          { name: 'Diabetes Type 2', value: scale(298), color: '#8B5CF6' },
          { name: 'Gastroenteritis', value: scale(189), color: '#F59E0B' },
          { name: 'Respiratory Inf.', value: scale(245), color: '#10B981' },
          { name: 'Malaria & Fevers', value: scale(115), color: '#EF4444' },
        ],
        diseaseTrendData: [
          { name: 'Week 1', Infectious: scale(45), NonInfectious: scale(142), Chronic: scale(180) },
          { name: 'Week 2', Infectious: scale(52), NonInfectious: scale(155), Chronic: scale(192) },
          { name: 'Week 3', Infectious: scale(64), NonInfectious: scale(138), Chronic: scale(204) },
          { name: 'Week 4', Infectious: scale(58), NonInfectious: scale(162), Chronic: scale(188) },
        ],
        referralFlowData: [
          { name: 'Week 1', ASHA: scale(62), PHC: scale(48), District: scale(32) },
          { name: 'Week 2', ASHA: scale(75), PHC: scale(58), District: scale(38) },
          { name: 'Week 3', ASHA: scale(88), PHC: scale(69), District: scale(46) },
          { name: 'Week 4', ASHA: scale(70), PHC: scale(54), District: scale(35) },
        ],
        referralReasons: [
          { reason: 'Cardio-Respiratory', percentage: 38, count: scale(114), status: 'critical' as const },
          { reason: 'Maternal Distress', percentage: 26, count: scale(78), status: 'high' as const },
          { reason: 'Severe Dehydration', percentage: 18, count: scale(54), status: 'high' as const },
          { reason: 'Pediatric Infection', percentage: 18, count: scale(54), status: 'medium' as const },
        ],
        maternalHealthData: [
          { name: 'Week 1', ANC1: scale(95), ANC4: scale(72), Institutional: scale(58), Home: scale(10) },
          { name: 'Week 2', ANC1: scale(110), ANC4: scale(84), Institutional: scale(68), Home: scale(12) },
          { name: 'Week 3', ANC1: scale(125), ANC4: scale(96), Institutional: scale(79), Home: scale(14) },
          { name: 'Week 4', ANC1: scale(105), ANC4: scale(80), Institutional: scale(65), Home: scale(11) },
        ],
        maternalRiskFactors: [
          { name: 'Severe Anemia (Hb < 8)', cases: scale(54), rate: '31.5%', severity: 'Critical' },
          { name: 'Gestational Diabetes', cases: scale(32), rate: '13.9%', severity: 'Medium' },
          { name: 'Pre-eclampsia (BP > 140/90)', cases: scale(28), rate: '11.8%', severity: 'Critical' },
          { name: 'Multiple Gestation', cases: scale(9), rate: '3.9%', severity: 'Medium' },
        ],
        childHealthData: [
          { name: 'Week 1', FullyVaccinated: scale(120), SAM: scale(16), MAM: scale(48) },
          { name: 'Week 2', FullyVaccinated: scale(135), SAM: scale(18), MAM: scale(55) },
          { name: 'Week 3', FullyVaccinated: scale(150), SAM: scale(22), MAM: scale(62) },
          { name: 'Week 4', FullyVaccinated: scale(130), SAM: scale(15), MAM: scale(50) },
        ],
        childImmunizationBreakdown: [
          { name: 'Week 1', BCG: scale(48), OPV3: scale(40), Pentavalent3: scale(32), MR1: scale(25) },
          { name: 'Week 2', BCG: scale(55), OPV3: scale(46), Pentavalent3: scale(38), MR1: scale(30) },
          { name: 'Week 3', BCG: scale(62), OPV3: scale(52), Pentavalent3: scale(44), MR1: scale(35) },
          { name: 'Week 4', BCG: scale(52), OPV3: scale(44), Pentavalent3: scale(36), MR1: scale(28) },
        ],
        medicineUsageData: [
          { name: 'Paracetamol', Consumed: scale(5200), StockLevel: scale(14200) },
          { name: 'Amoxicillin', Consumed: scale(3400), StockLevel: scale(1200) },
          { name: 'Metformin', Consumed: scale(3900), StockLevel: scale(8500) },
          { name: 'ORS Packets', Consumed: scale(5800), StockLevel: scale(4500) },
          { name: 'MR Vaccine', Consumed: scale(780), StockLevel: scale(620) },
        ],
        medicineStockoutRisk: [
          { name: 'Amoxicillin 250mg', stock: scale(1200), minNeeded: scale(4000), daysLeft: 4, risk: 'High' as const },
          { name: 'Measles-Rubella Vaccine', stock: scale(80), minNeeded: scale(500), daysLeft: 5, risk: 'High' as const },
          { name: 'Insulin Glargine 100 IU', stock: scale(45), minNeeded: scale(200), daysLeft: 7, risk: 'High' as const },
          { name: 'Amlodipine 5mg', stock: scale(3200), minNeeded: scale(3000), daysLeft: 15, risk: 'Medium' as const },
        ],
        phcPerformanceData: [
          { name: 'Datia Central PHC', consultations: scale(1800), responseTime: '8.5m', satisfaction: 94, drugsAvailability: 92, maternalReferrals: scale(45), immunizationRate: 94, rating: 4.8 },
          { name: 'Bhander PHC', consultations: scale(1120), responseTime: '12.4m', satisfaction: 89, drugsAvailability: 81, maternalReferrals: scale(32), immunizationRate: 91, rating: 4.3 },
          { name: 'Indergarh PHC', consultations: scale(1250), responseTime: '14.1m', satisfaction: 87, drugsAvailability: 83, maternalReferrals: scale(38), immunizationRate: 88, rating: 4.1 },
          { name: 'Seondha PHC', consultations: scale(880), responseTime: '16.8m', satisfaction: 86, drugsAvailability: 78, maternalReferrals: scale(22), immunizationRate: 86, rating: 3.9 },
          { name: 'Unao PHC', consultations: scale(750), responseTime: '10.2m', satisfaction: 92, drugsAvailability: 88, maternalReferrals: scale(18), immunizationRate: 92, rating: 4.6 },
        ]
      };
    } else {
      return {
        summaryCards: [
          { title: 'Disease Burden', value: `${scale(18542)} Cases`, subtext: 'Total Active Syndromic cases', change: '+3.1%', isPositive: false, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', section: 'disease' as const },
          { title: 'Referral Flow Rate', value: '14.8%', subtext: `${scale(2145)} escalations routed`, change: '-1.2%', isPositive: true, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', section: 'referrals' as const },
          { title: 'Maternal Vigilance', value: `${scale(1120)} Mothers`, subtext: 'High-risk trimesters active', change: '-140 cases', isPositive: true, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', section: 'maternal' as const },
          { title: 'Child Immunization', value: '93.8%', subtext: `${scale(6900)} infants monitored`, change: '+2.1%', isPositive: true, icon: Baby, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', section: 'child' as const },
          { title: 'Medicine Replenish', value: `${scale(0)} Items Low`, subtext: 'Essential drugs below safety', change: '-3 Items Low', isPositive: true, icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', section: 'medicine' as const },
          { title: 'PHC Action Velocity', value: '11.8m Avg', subtext: 'Median emergency dispatch speed', change: '-2.4m (Faster)', isPositive: true, icon: Award, color: 'text-cyan-600', bg: 'bg-cyan-50/50', border: 'border-cyan-100', section: 'phc' as const },
        ],
        diseasePieData: [
          { name: 'Hypertension', value: scale(4850), color: '#3B82F6' },
          { name: 'Diabetes Type 2', value: scale(3240), color: '#8B5CF6' },
          { name: 'Gastroenteritis', value: scale(1890), color: '#F59E0B' },
          { name: 'Respiratory Inf.', value: scale(2840), color: '#10B981' },
          { name: 'Malaria & Fevers', value: scale(1250), color: '#EF4444' },
        ],
        diseaseTrendData: [
          { name: 'Jan-Feb', Infectious: scale(420), NonInfectious: scale(1520), Chronic: scale(2100) },
          { name: 'Mar-Apr', Infectious: scale(480), NonInfectious: scale(1640), Chronic: scale(2240) },
          { name: 'May-Jun', Infectious: scale(650), NonInfectious: scale(1480), Chronic: scale(2180) },
          { name: 'Jul-Aug', Infectious: scale(720), NonInfectious: scale(1550), Chronic: scale(2300) },
          { name: 'Sep-Oct', Infectious: scale(510), NonInfectious: scale(1720), Chronic: scale(2450) },
          { name: 'Nov-Dec', Infectious: scale(460), NonInfectious: scale(1680), Chronic: scale(2380) },
        ],
        referralFlowData: [
          { name: 'Jan-Feb', ASHA: scale(650), PHC: scale(510), District: scale(340) },
          { name: 'Mar-Apr', ASHA: scale(720), PHC: scale(570), District: scale(380) },
          { name: 'May-Jun', ASHA: scale(810), PHC: scale(640), District: scale(430) },
          { name: 'Jul-Aug', ASHA: scale(880), PHC: scale(700), District: scale(480) },
          { name: 'Sep-Oct', ASHA: scale(740), PHC: scale(580), District: scale(390) },
          { name: 'Nov-Dec', ASHA: scale(690), PHC: scale(540), District: scale(360) },
        ],
        referralReasons: [
          { reason: 'Cardio-Respiratory', percentage: 36, count: scale(1220), status: 'critical' as const },
          { reason: 'Maternal Distress', percentage: 25, count: scale(840), status: 'high' as const },
          { reason: 'Severe Dehydration', percentage: 20, count: scale(680), status: 'high' as const },
          { reason: 'Pediatric Infection', percentage: 19, count: scale(640), status: 'medium' as const },
        ],
        maternalHealthData: [
          { name: 'Jan-Feb', ANC1: scale(980), ANC4: scale(780), Institutional: scale(640), Home: scale(110) },
          { name: 'Mar-Apr', ANC1: scale(1050), ANC4: scale(840), Institutional: scale(690), Home: scale(120) },
          { name: 'May-Jun', ANC1: scale(1200), ANC4: scale(950), Institutional: scale(790), Home: scale(140) },
          { name: 'Jul-Aug', ANC1: scale(1310), ANC4: scale(1020), Institutional: scale(860), Home: scale(130) },
          { name: 'Sep-Oct', ANC1: scale(1150), ANC4: scale(910), Institutional: scale(760), Home: scale(120) },
          { name: 'Nov-Dec', ANC1: scale(1080), ANC4: scale(860), Institutional: scale(710), Home: scale(110) },
        ],
        maternalRiskFactors: [
          { name: 'Severe Anemia (Hb < 8)', cases: scale(420), rate: '30.4%', severity: 'Critical' },
          { name: 'Gestational Diabetes', cases: scale(210), rate: '13.8%', severity: 'Medium' },
          { name: 'Pre-eclampsia (BP > 140/90)', cases: scale(190), rate: '11.3%', severity: 'Critical' },
          { name: 'Multiple Gestation', cases: scale(60), rate: '3.9%', severity: 'Medium' },
        ],
        childHealthData: [
          { name: 'Jan-Feb', FullyVaccinated: scale(1150), SAM: scale(160), MAM: scale(490) },
          { name: 'Mar-Apr', FullyVaccinated: scale(1220), SAM: scale(180), MAM: scale(530) },
          { name: 'May-Jun', FullyVaccinated: scale(1340), SAM: scale(210), MAM: scale(620) },
          { name: 'Jul-Aug', FullyVaccinated: scale(1480), SAM: scale(190), MAM: scale(580) },
          { name: 'Sep-Oct', FullyVaccinated: scale(1290), SAM: scale(170), MAM: scale(510) },
          { name: 'Nov-Dec', FullyVaccinated: scale(1210), SAM: scale(150), MAM: scale(460) },
        ],
        childImmunizationBreakdown: [
          { name: 'Jan-Feb', BCG: scale(490), OPV3: scale(410), Pentavalent3: scale(330), MR1: scale(260) },
          { name: 'Mar-Apr', BCG: scale(530), OPV3: scale(450), Pentavalent3: scale(370), MR1: scale(290) },
          { name: 'May-Jun', BCG: scale(610), OPV3: scale(520), Pentavalent3: scale(430), MR1: scale(350) },
          { name: 'Jul-Aug', BCG: scale(640), OPV3: scale(550), Pentavalent3: scale(460), MR1: scale(380) },
          { name: 'Sep-Oct', BCG: scale(540), OPV3: scale(460), Pentavalent3: scale(380), MR1: scale(310) },
          { name: 'Nov-Dec', BCG: scale(500), OPV3: scale(420), Pentavalent3: scale(340), MR1: scale(280) },
        ],
        medicineUsageData: [
          { name: 'Paracetamol', Consumed: scale(58000), StockLevel: scale(14200) },
          { name: 'Amoxicillin', Consumed: scale(39000), StockLevel: scale(1200) },
          { name: 'Metformin', Consumed: scale(44000), StockLevel: scale(8500) },
          { name: 'ORS Packets', Consumed: scale(61000), StockLevel: scale(4500) },
          { name: 'MR Vaccine', Consumed: scale(8900), StockLevel: scale(620) },
        ],
        medicineStockoutRisk: [
          { name: 'Amoxicillin 250mg', stock: scale(1200), minNeeded: scale(4000), daysLeft: 4, risk: 'High' as const },
          { name: 'Measles-Rubella Vaccine', stock: scale(80), minNeeded: scale(500), daysLeft: 5, risk: 'High' as const },
          { name: 'Insulin Glargine 100 IU', stock: scale(45), minNeeded: scale(200), daysLeft: 7, risk: 'High' as const },
          { name: 'Amlodipine 5mg', stock: scale(3200), minNeeded: scale(3000), daysLeft: 15, risk: 'Medium' as const },
        ],
        phcPerformanceData: [
          { name: 'Datia Central PHC', consultations: scale(21000), responseTime: '8.5m', satisfaction: 94, drugsAvailability: 92, maternalReferrals: scale(450), immunizationRate: 94, rating: 4.8 },
          { name: 'Bhander PHC', consultations: scale(13800), responseTime: '12.4m', satisfaction: 89, drugsAvailability: 81, maternalReferrals: scale(320), immunizationRate: 91, rating: 4.3 },
          { name: 'Indergarh PHC', consultations: scale(14900), responseTime: '14.1m', satisfaction: 87, drugsAvailability: 83, maternalReferrals: scale(380), immunizationRate: 88, rating: 4.1 },
          { name: 'Seondha PHC', consultations: scale(10200), responseTime: '16.8m', satisfaction: 86, drugsAvailability: 78, maternalReferrals: scale(220), immunizationRate: 86, rating: 3.9 },
          { name: 'Unao PHC', consultations: scale(9100), responseTime: '10.2m', satisfaction: 92, drugsAvailability: 88, maternalReferrals: scale(180), immunizationRate: 92, rating: 4.6 },
        ]
      };
    }
  }, [analyticsBlockFilter, analyticsTimeFilter]);

  const ad = useMemo(() => {
    if (!liveMetrics) return rawAd;
    
    // Map colors to categories
    const categoryColors: Record<string, string> = {
      'Hypertension': '#3B82F6',
      'Diabetes': '#8B5CF6',
      'Dengue': '#EF4444',
      'Malaria': '#F59E0B',
      'Respiratory Infection': '#10B981'
    };
    
    const liveDiseasePieData = liveMetrics.diseaseTrends.map(t => ({
      name: t.name,
      value: t.count,
      color: categoryColors[t.name] || '#64748B'
    }));

    // Override only what's needed!
    return {
      ...rawAd,
      summaryCards: rawAd.summaryCards.map((card) => {
        if (card.section === 'disease') {
          return {
            ...card,
            value: `${liveMetrics.diseaseTrends.reduce((sum, t) => sum + t.count, 0)} Cases`,
            subtext: `${liveMetrics.diseaseTrends.length} active classifications detected`
          };
        }
        if (card.section === 'referrals') {
          return {
            ...card,
            value: `${liveMetrics.referralCount} Escalations`,
            subtext: `Total routed pathways`
          };
        }
        return card;
      }),
      diseasePieData: liveDiseasePieData.length > 0 ? liveDiseasePieData : rawAd.diseasePieData
    };
  }, [rawAd, liveMetrics]);

  // Memoized lists to prevent heavy calculations on every keystroke/render
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alertItem => {
      const matchesSearch = 
        alertItem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        alertItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alertItem.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alertItem.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = 
        riskFilter === 'All' || 
        alertItem.severity.toLowerCase() === riskFilter.toLowerCase();
      return matchesSearch && matchesRisk;
    });
  }, [alerts, searchQuery, riskFilter]);

  const filteredHighRiskPatients = useMemo(() => {
    return highRiskPatients.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.village.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'All' || p.status === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [highRiskPatients, searchQuery, riskFilter]);

  const filteredMedicineInventory = useMemo(() => {
    return medicineInventory.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [medicineInventory, searchQuery, categoryFilter]);

  // Calculated Stats dynamically derived from real state!
  const statTotalPatients = liveMetrics ? liveMetrics.reports.length : 1482;
  const statTodayCases = liveMetrics ? liveMetrics.casesReviewedToday + liveMetrics.pendingDoctorReviews : 182;
  const statHighRiskCases = liveMetrics ? liveMetrics.highRiskCases : highRiskPatients.filter(p => p.flowStatus !== 'Resolved').length;
  const statPendingReviews = liveMetrics ? liveMetrics.pendingDoctorReviews : 18;
  const statMedicineAvailability = `${Math.round((medicineInventory.filter(m => m.status === 'Optimal').length / medicineInventory.length) * 100)}%`;

  // Navigation Items matching DHO Sidebar
  const navigationItems = [
    { id: 'overview' as const, label: 'District Commander', icon: Landmark },
    { id: 'analytics' as const, label: 'Epidemiology Analytics', icon: BarChart3 },
    { id: 'alerts' as const, label: 'High Risk Alert Core', icon: ShieldAlert },
    { id: 'inventory' as const, label: 'Medicine stockpile', icon: Package },
    { id: 'reports' as const, label: 'Report Generator', icon: FileText },
    { id: 'ai-insights' as const, label: 'AI Operational Insights', icon: Sparkles },
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
            {/* Real-time Public Health Intelligence Telemetry Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-600/10 text-orange-500 rounded-2xl border border-orange-500/10">
                    <TrendingUp className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-black text-white">Public Health Intelligence Center</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">Live Regional Command Telemetry</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-black text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span>● LIVE Snapshots Synchronized</span>
                </div>
              </div>

              {/* Grid of 7 Live Aggregated Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {/* 1. Total Active Cases */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-slate-400 block leading-tight">Total Active Cases</span>
                  <div>
                    <span className="text-2xl font-display font-black text-slate-100 block">{liveMetrics?.totalActiveCases ?? 0}</span>
                    <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">Active monitoring</span>
                  </div>
                </div>

                {/* 2. High Risk Cases */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-rose-400 block leading-tight">High Risk Cases</span>
                  <div>
                    <span className="text-2xl font-display font-black text-rose-500 block">{liveMetrics?.highRiskCases ?? 0}</span>
                    <span className="text-[9px] text-rose-400 font-bold block mt-0.5">Critical response</span>
                  </div>
                </div>

                {/* 3. Cases Reviewed Today */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-slate-400 block leading-tight">Reviewed Today</span>
                  <div>
                    <span className="text-2xl font-display font-black text-slate-100 block">{liveMetrics?.casesReviewedToday ?? 0}</span>
                    <span className="text-[9px] text-emerald-500 font-semibold block mt-0.5">✓ Logs completed</span>
                  </div>
                </div>

                {/* 4. Pending Doctor Reviews */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-400 block leading-tight">Pending Reviews</span>
                  <div>
                    <span className="text-2xl font-display font-black text-amber-500 block">{liveMetrics?.pendingDoctorReviews ?? 0}</span>
                    <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">Awaiting clinician</span>
                  </div>
                </div>

                {/* 5. Average AI Risk Score */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-purple-400 block leading-tight">Avg AI Risk Score</span>
                  <div>
                    <span className="text-2xl font-display font-black text-purple-500 block">{liveMetrics?.averageAiRiskScore ?? 0}%</span>
                    <span className="text-[9px] text-purple-400 font-semibold block mt-0.5">Gemini Triage</span>
                  </div>
                </div>

                {/* 6. Referral Count */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-blue-400 block leading-tight">Referral Count</span>
                  <div>
                    <span className="text-2xl font-display font-black text-blue-400 block">{liveMetrics?.referralCount ?? 0}</span>
                    <span className="text-[9px] text-blue-400 font-semibold block mt-0.5">Escalated flow</span>
                  </div>
                </div>

                {/* 7. Home Visits Completed */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-400 block leading-tight">Visits Completed</span>
                  <div>
                    <span className="text-2xl font-display font-black text-emerald-500 block">{liveMetrics?.homeVisitsCompleted ?? 0}</span>
                    <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">ASHA Field checkups</span>
                  </div>
                </div>
              </div>

              {/* Time window configurator inside telemetry header */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1.5 font-mono border-t border-slate-800/60 flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>Early Warning Threshold Window:</span>
                  <strong className="text-slate-200">{timeWindowDays} days</strong>
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span>Window:</span>
                    <select 
                      value={timeWindowDays} 
                      onChange={(e) => setTimeWindowDays(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-[11px] rounded px-2 py-0.5 focus:outline-none cursor-pointer"
                    >
                      <option value={3}>3 Days</option>
                      <option value={7}>7 Days (Standard)</option>
                      <option value={14}>14 Days</option>
                      <option value={30}>30 Days (Extended)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Threshold:</span>
                    <select 
                      value={caseThreshold} 
                      onChange={(e) => setCaseThreshold(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-[11px] rounded px-2 py-0.5 focus:outline-none cursor-pointer"
                    >
                      <option value={2}>2 Cases (Sensitive)</option>
                      <option value={3}>3 Cases</option>
                      <option value={4}>4 Cases (Conservative)</option>
                    </select>
                  </div>
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

                {/* District Outbreak Hotspots (Top 5 Villages) Card */}
                <div className="bg-white border border-orange-100/30 rounded-[2rem] p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-orange-650 block">Spatial Epidemiology</span>
                      <h4 className="text-base font-display font-black text-slate-900 mt-0.5">Top 5 Outbreak Hotspots (Geographic Cases)</h4>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live Clusters
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {liveMetrics?.hotspots && liveMetrics.hotspots.length > 0 ? (
                      liveMetrics.hotspots.slice(0, 5).map((hotspot, idx) => {
                        const scorePct = Math.min(100, Math.round((hotspot.caseCount / Math.max(1, liveMetrics.hotspots[0].caseCount)) * 100));
                        return (
                          <div key={idx} className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 rounded-2xl p-4 transition-all flex flex-col justify-between group relative overflow-hidden h-32">
                            <div>
                              <span className="text-[8px] font-mono font-bold uppercase text-slate-400 block tracking-wider leading-none">Rank #{idx + 1}</span>
                              <span className="font-display font-black text-slate-900 text-sm mt-1.5 block truncate group-hover:text-orange-700 transition-colors">
                                {hotspot.village}
                              </span>
                              <span className="text-[9px] font-mono text-slate-450 block mt-0.5 truncate">{hotspot.taluk}, Datia</span>
                            </div>

                            <div className="mt-3">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-650">
                                <span>{hotspot.caseCount} Cases</span>
                                {hotspot.highRiskCount > 0 && (
                                  <span className="text-rose-600 flex items-center gap-0.5 font-black text-[9px] bg-rose-50 border border-rose-100/50 px-1 rounded animate-pulse">
                                    <AlertTriangle className="w-2.5 h-2.5" />
                                    <span>{hotspot.highRiskCount} Risk</span>
                                  </span>
                                )}
                              </div>
                              {/* Custom progress bar */}
                              <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                                <div className="bg-orange-600 h-full rounded-full transition-all duration-500" style={{ width: `${scorePct}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-5 text-center text-xs text-slate-400 py-10">
                        No geographic hotspots computed. Log patient reports to trigger live spatial analysis.
                      </div>
                    )}
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
            {/* MD3 Command Center Header */}
            <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-xs flex flex-col xl:flex-row items-stretch justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  National Health Mission Telemetry Grid
                </span>
                <h2 className="text-2xl font-display font-black text-slate-900 leading-tight">
                  District Clinical Health Analytics Command
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Real-time syndromic, logistical, and maternal-child health metrics synthesized directly from local Primary Health Centers (PHCs) and active ASHA field kits.
                </p>
              </div>

              {/* Responsive MD3 Filter Actions bar */}
              <div className="flex flex-wrap items-center gap-4 self-center xl:self-end">
                {/* Block Territory Selection */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Territory Filter</span>
                  <div className="relative">
                    <Filter className="w-3.5 h-3.5 text-indigo-500 absolute left-3 top-2.5" />
                    <select
                      value={analyticsBlockFilter}
                      onChange={(e) => setAnalyticsBlockFilter(e.target.value as any)}
                      className="pl-8 pr-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="All">All Blocks (Datia, Bhander, Indergarh, Seondha)</option>
                      <option value="Datia">Datia Block Only</option>
                      <option value="Bhander">Bhander Block Only</option>
                      <option value="Indergarh">Indergarh Block Only</option>
                      <option value="Seondha">Seondha Block Only</option>
                    </select>
                  </div>
                </div>

                {/* Time Filter Tabs */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Time Interval</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {(['weekly', 'monthly', 'yearly'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setAnalyticsTimeFilter(t)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wide transition-all ${
                          analyticsTimeFilter === t
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-section Navigation Focus Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
              <button
                onClick={() => setActiveAnalyticsSection('all')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeAnalyticsSection === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4" />
                All Sections Dashboard
              </button>
              <button
                onClick={() => setActiveAnalyticsSection('disease')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeAnalyticsSection === 'disease'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-4 h-4" />
                Disease Distribution
              </button>
              <button
                onClick={() => setActiveAnalyticsSection('referrals')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeAnalyticsSection === 'referrals'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-4 h-4" />
                Referral Analytics
              </button>
              <button
                onClick={() => setActiveAnalyticsSection('maternal')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeAnalyticsSection === 'maternal'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className="w-4 h-4" />
                Maternal Health
              </button>
              <button
                onClick={() => setActiveAnalyticsSection('child')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeAnalyticsSection === 'child'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Baby className="w-4 h-4" />
                Child Health
              </button>
              <button
                onClick={() => setActiveAnalyticsSection('medicine')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeAnalyticsSection === 'medicine'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Pill className="w-4 h-4" />
                Medicine Stockpile
              </button>
              <button
                onClick={() => setActiveAnalyticsSection('phc')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  activeAnalyticsSection === 'phc'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4" />
                PHC Performance
              </button>
            </div>

            {/* Professional Analytics Core KPI Scorecard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {ad.summaryCards.map((card, idx) => {
                const IconComp = card.icon;
                const isSelected = activeAnalyticsSection === card.section;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => setActiveAnalyticsSection(card.section)}
                    className={`bg-white border ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    } rounded-3xl p-4 cursor-pointer transition-all flex flex-col justify-between h-40`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          card.isPositive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {card.change}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-450 block tracking-wider">
                        {card.title}
                      </span>
                      <span className="text-lg font-display font-black text-slate-900 mt-0.5 block truncate">
                        {card.value}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 truncate mt-1 leading-none">
                      {card.subtext}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* DYNAMIC VIEW CONTAINER */}
            <div className="space-y-8">
              {/* 1. Disease Distribution Section */}
              {(activeAnalyticsSection === 'all' || activeAnalyticsSection === 'disease') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-black text-slate-900">Disease Burden & Outbreak Sentinel</h3>
                        <p className="text-xs text-slate-450 font-mono uppercase font-bold">Health Section I &bull; Diagnostic Distribution</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                      Tracking {ad.diseasePieData.reduce((acc, curr) => acc + curr.value, 0)} Active Diagnoses
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Pie Chart */}
                    <div className="lg:col-span-5 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Condition Prevalence</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Primary Disease Burden Allocation</span>
                      </div>
                      <div className="h-60 w-full flex items-center justify-center my-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={ad.diseasePieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {ad.diseasePieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }}
                              formatter={(value) => [`${value} cases`, 'Prevalence']}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-600 font-bold border-t border-slate-50 pt-3">
                        {ad.diseasePieData.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="truncate">{item.name}</span>
                            <span className="text-slate-400 font-mono text-[10px] ml-auto">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trend Line Chart */}
                    <div className="lg:col-span-7 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Pathogen & Chronic Vectors</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Clinical Classification Trends Over Time</span>
                      </div>
                      <div className="h-64 w-full my-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ad.diseaseTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorInfectious" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorNonInfectious" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorChronic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Area type="monotone" dataKey="Infectious" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInfectious)" name="Active Outbreaks / Infectious" />
                            <Area type="monotone" dataKey="NonInfectious" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNonInfectious)" name="Non-Communicable" />
                            <Area type="monotone" dataKey="Chronic" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorChronic)" name="Geriatric Chronic Support" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[11px] text-slate-450 italic text-center border-t border-slate-50 pt-2 leading-none">
                        Syndromic reporting alerts are cross-referenced with medical labs and telemedicine signs automatically.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. Referral Analytics Section */}
              {(activeAnalyticsSection === 'all' || activeAnalyticsSection === 'referrals') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-black text-slate-900">Referral Pathways & Clinical Transit Funnel</h3>
                        <p className="text-xs text-slate-450 font-mono uppercase font-bold">Health Section II &bull; Referral Funnel Optimization</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-xl border border-amber-100">
                      ASHA &rarr; PHC &rarr; District Hospital Pathway Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Funnel chart using Bar Chart */}
                    <div className="lg:col-span-7 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Pathway Transition Volume</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Triage Stage Conversions & Leakage Ratios</span>
                      </div>
                      <div className="h-64 w-full my-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ad.referralFlowData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="ASHA" fill="#EAB308" name="ASHA Identified Flags" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="PHC" fill="#A855F7" name="PHC Audited Referrals" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="District" fill="#F43F5E" name="District Admitted / Intervened" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[11px] text-slate-450 italic text-center border-t border-slate-50 pt-2 leading-none">
                        Conversion efficiency target is set at &gt;85% triage completion under 60 minutes.
                      </p>
                    </div>

                    {/* Referral Indications breakdown */}
                    <div className="lg:col-span-5 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Emergency Trigger Reasons</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Clinical Referral Causes Profile</span>
                      </div>
                      
                      <div className="space-y-3 flex-1 justify-center flex flex-col">
                        {ad.referralReasons.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-700">{item.reason}</span>
                              <span className="text-slate-400 font-mono">{item.count} cases ({item.percentage}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.status === 'critical'
                                    ? 'bg-rose-500'
                                    : item.status === 'high'
                                    ? 'bg-amber-500'
                                    : 'bg-indigo-500'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-amber-50/50 border border-amber-100/50 p-3 rounded-2xl text-[10.5px] text-slate-600 leading-relaxed">
                        <strong>Triage Insight:</strong> Cardio-Respiratory distress referrals have escalated by 4% in geriatric groups over high temperature block territory readings.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. Maternal Health Section */}
              {(activeAnalyticsSection === 'all' || activeAnalyticsSection === 'maternal') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-black text-slate-900">Maternal Health Tracking & ANC Coverage</h3>
                        <p className="text-xs text-slate-450 font-mono uppercase font-bold">Health Section III &bull; High Risk Pregnancy (HRP) Vigilance</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        showToastMessage('Urgent maternal monitoring team dispatched to high-risk pre-eclampsia mother in Unao village!');
                      }}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Trigger Maternal ASHA Dispatch
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Antenatal Care enrollment metrics */}
                    <div className="lg:col-span-7 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Vigilance Timeline</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">ANC Trimester Registrations vs Institutional Delivery Outcomes</span>
                      </div>
                      <div className="h-64 w-full my-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ad.maternalHealthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorANC1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorANC4" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorInst" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Area type="monotone" dataKey="ANC1" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#colorANC1)" name="1st Trimester ANC Checks" />
                            <Area type="monotone" dataKey="ANC4" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorANC4)" name="Completed 4x ANC Audits" />
                            <Area type="monotone" dataKey="Institutional" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorInst)" name="PHC Institutional Deliveries" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Maternal High Risk Profile Table */}
                    <div className="lg:col-span-5 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">High Risk Registry</h4>
                          <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Active High Risk Pregnancies (HRP) Matrix</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {ad.maternalRiskFactors.map((hrp, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                              <div>
                                <span className="font-bold text-slate-800 block">{hrp.name}</span>
                                <span className="text-[10px] font-mono text-slate-450">District prevalence rate: {hrp.rate}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-black text-slate-800 block">{hrp.cases} Cases</span>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    hrp.severity === 'Critical'
                                      ? 'bg-rose-50 text-rose-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}
                                >
                                  {hrp.severity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-[10.5px] text-slate-500 font-mono flex items-center gap-2 mt-4">
                        <Clock className="w-4 h-4 text-rose-500" />
                        Live clinical audit synced 14 mins ago.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 4. Child Health Section */}
              {(activeAnalyticsSection === 'all' || activeAnalyticsSection === 'child') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Baby className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-black text-slate-900">Child Welfare & Immunization Coverage</h3>
                        <p className="text-xs text-slate-450 font-mono uppercase font-bold">Health Section IV &bull; Malnutrition (SAM/MAM) Monitoring</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Vaccine Coverage: {analyticsTimeFilter === 'weekly' ? '92.4%' : '91.2%'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Vaccine Immunization breakdown */}
                    <div className="lg:col-span-6 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Vaccination Benchmarks</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Antigen Coverage Progression by Cohort</span>
                      </div>
                      <div className="h-64 w-full my-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ad.childImmunizationBreakdown} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="BCG" fill="#3B82F6" name="BCG (Birth)" stackId="a" />
                            <Bar dataKey="OPV3" fill="#10B981" name="OPV 3rd Dose" stackId="a" />
                            <Bar dataKey="Pentavalent3" fill="#EAB308" name="Penta 3rd" stackId="a" />
                            <Bar dataKey="MR1" fill="#F43F5E" name="Measles/Rubella 1st" stackId="a" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pediatric Malnutrition Trends */}
                    <div className="lg:col-span-6 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Malnutrition Registry</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">SAM & MAM Pediatric Nutritional Index Trends</span>
                      </div>
                      <div className="h-64 w-full my-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ad.childHealthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Area type="monotone" dataKey="FullyVaccinated" stroke="#059669" strokeWidth={2.5} fillOpacity={0.08} fill="#059669" name="Vaccination Compliant Cohort" />
                            <Area type="monotone" dataKey="SAM" stroke="#E11D48" strokeWidth={2.5} fillOpacity={0.08} fill="#E11D48" name="SAM (Severe Acute Malnutrition)" />
                            <Area type="monotone" dataKey="MAM" stroke="#D97706" strokeWidth={2.5} fillOpacity={0.08} fill="#D97706" name="MAM (Moderate Acute Malnutrition)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 5. Medicine Stockpile Usage Section */}
              {(activeAnalyticsSection === 'all' || activeAnalyticsSection === 'medicine') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-black text-slate-900">Medicine Stockpile Consumables & Stockout Hazards</h3>
                        <p className="text-xs text-slate-450 font-mono uppercase font-bold">Health Section V &bull; Pharmacy Logistics Audit</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        showToastMessage('Emergency dispatch of 5,000 tablets of Amoxicillin 250mg initiated to Seondha PHC Depot!');
                      }}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Approve Emergency Drug Dispatch
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Consumed vs Stock level Bar Chart */}
                    <div className="lg:col-span-7 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Consumption Profile</h4>
                        <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Drug Quantities Consumed vs Central Warehouses Reserve</span>
                      </div>
                      <div className="h-64 w-full my-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ad.medicineUsageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                            <ChartTooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="Consumed" fill="#8B5CF6" name="Total Units Consumed" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="StockLevel" fill="#C084FC" name="Stockpile On-Hand" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Stockout Hazards list */}
                    <div className="lg:col-span-5 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Depot Stock Alerts</h4>
                          <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">Critical Supply Disruption Warning List</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {ad.medicineStockoutRisk.map((med, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                              <div>
                                <span className="font-bold text-slate-800 block">{med.name}</span>
                                <span className="text-[10px] font-mono text-slate-450">Stock: {med.stock} / Safety Threshold: {med.minNeeded}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-rose-600 block">{med.daysLeft} days remaining</span>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    med.risk === 'High'
                                      ? 'bg-rose-50 text-rose-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}
                                >
                                  {med.risk} Risk
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-2xl text-[10.5px] text-purple-700 flex items-center gap-2 mt-4 font-bold">
                        <Truck className="w-4 h-4" />
                        Vaccines and hormones require refrigerated cold-chains.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 6. PHC Performance Section */}
              {(activeAnalyticsSection === 'all' || activeAnalyticsSection === 'phc') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-xs space-y-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-black text-slate-900">PHC Performance & Quality Benchmarks</h3>
                        <p className="text-xs text-slate-450 font-mono uppercase font-bold">Health Section VI &bull; Regional Clinical Operations Index</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        showToastMessage('Live PHC clinic registries synchronized successfully! Benchmarks updated.');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-index All Facilities
                    </button>
                  </div>

                  {/* Leaderboard Table representing absolute realism */}
                  <div className="border border-slate-100 rounded-3xl overflow-hidden bg-white">
                    <div className="p-5 border-b border-slate-100">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">PHC Operational Performance Scoreboard</h4>
                      <span className="text-sm font-display font-bold text-slate-800 block mt-0.5">District Quality Indicators Comparison Matrix</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                            <th className="py-3.5 px-5">Facility / PHC</th>
                            <th className="py-3.5 px-4 text-center">Consultations</th>
                            <th className="py-3.5 px-4 text-center">Response Speed</th>
                            <th className="py-3.5 px-4 text-center">Patient Rating</th>
                            <th className="py-3.5 px-4 text-center">Drug Availability</th>
                            <th className="py-3.5 px-4 text-center">Maternal Esc.</th>
                            <th className="py-3.5 px-4 text-center">Immunization %</th>
                            <th className="py-3.5 px-5 text-right">Score Card</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {ad.phcPerformanceData.map((phc, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 font-bold font-mono text-[10px] text-slate-500 flex items-center justify-center border border-slate-200">
                                    0{idx + 1}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-800 block">{phc.name}</span>
                                    <span className="text-[10px] text-slate-400">District Territory Region</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                                {phc.consultations}
                              </td>
                              <td className="py-4 px-4 text-center font-mono">
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                                  {phc.responseTime}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="text-amber-500 font-bold font-mono">&#9733; {phc.rating}</span>
                                <span className="text-slate-450 text-[10px]"> ({phc.satisfaction}%)</span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        phc.drugsAvailability > 90 ? 'bg-emerald-500' : 'bg-amber-500'
                                      }`}
                                      style={{ width: `${phc.drugsAvailability}%` }}
                                    />
                                  </div>
                                  <span className="font-mono text-[10px] font-bold">{phc.drugsAvailability}%</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center font-mono font-bold text-slate-600">
                                {phc.maternalReferrals}
                              </td>
                              <td className="py-4 px-4 text-center font-mono font-bold text-emerald-600">
                                {phc.immunizationRate}%
                              </td>
                              <td className="py-4 px-5 text-right">
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                                  EXCELLENT
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
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
                  {filteredAlerts.map((alertItem) => {
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

                  {filteredAlerts.length === 0 && (
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
                        {filteredHighRiskPatients.map((p) => (
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
                        {filteredHighRiskPatients.length === 0 && (
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
                    {filteredMedicineInventory.map((m) => (
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

        {/* 6. AI Operational Insights Tab */}
        {activeTab === 'ai-insights' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DhoAiInsightsPanel liveMetrics={liveMetrics} />
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
