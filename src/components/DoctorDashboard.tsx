/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ConsultationWorkspace from './ConsultationWorkspace';
import PatientDetailsModal from './PatientDetailsModal';
import ConsultationSummary from './ConsultationSummary';
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
  X,
  AlertTriangle,
  Clock,
  MapPin,
  Check,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  HeartPulse
} from 'lucide-react';

export interface PrescriptionItem {
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
}

export interface ConsultationRecord {
  clinicalNotes: string;
  diagnosis?: string;
  observations?: string;
  prescription: PrescriptionItem[];
  referredTo: string;
  advice?: string;
  followUpDate?: string;
  completedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  village: string;
  referredBy: string;
  visitTime: string;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
  status: 'Waiting' | 'In Consultation' | 'Completed';
  vitals: {
    bpSystolic: number;
    bpDiastolic: number;
    pulse: number;
    temperature: number;
    bloodSugar: number;
    weight: number;
  };
  symptoms: string[];
  notes: string;
  medicalHistory?: string[];
  consultation?: ConsultationRecord;
}

const initialPatientsList: Patient[] = [
  {
    id: '1',
    name: 'Amina Khatun',
    age: 24,
    gender: 'Female',
    village: 'Sonagir Rural Sector',
    referredBy: 'Savitri Devi (ASHA)',
    visitTime: '10:30 AM',
    riskLevel: 'High Risk',
    status: 'Waiting',
    vitals: {
      bpSystolic: 155,
      bpDiastolic: 100,
      pulse: 92,
      temperature: 98.8,
      bloodSugar: 145,
      weight: 58,
    },
    symptoms: ['Severe bilateral pedal edema', 'Frequent frontal headache', 'Mild blurred vision'],
    notes: '28 weeks gestational timeline. ASHA reports elevated home BP levels. Pre-eclampsia screening required.',
    medicalHistory: [
      'G1P0 (Primigravida), 28 Weeks Gestation',
      'No history of pre-existing essential hypertension',
      'Family history of pregnancy-induced hypertension (mother)',
      'No known drug allergies (NKDA)'
    ]
  },
  {
    id: '2',
    name: 'Gopal Sharma',
    age: 52,
    gender: 'Male',
    village: 'Datia Ward No. 4',
    referredBy: 'Self-Referral',
    visitTime: '11:15 AM',
    riskLevel: 'Medium Risk',
    status: 'In Consultation',
    vitals: {
      bpSystolic: 138,
      bpDiastolic: 88,
      pulse: 82,
      temperature: 99.1,
      bloodSugar: 240,
      weight: 71,
    },
    symptoms: ['Chronic non-healing plantar ulcer', 'Polydipsia', 'Generalized fatigue'],
    notes: 'Patient requests review of plantar ulcer on left heel. Blood glucose control assessment and insulin dosage adjustment.',
    medicalHistory: [
      'Type 2 Diabetes Mellitus diagnosed in 2018',
      'Diabetic peripheral neuropathy with distal sensory loss',
      'Mild osteoarthritis of bilateral knees',
      'History of poor glycaemic control (HbA1c ~8.9%)'
    ],
    consultation: {
      clinicalNotes: 'Uncontrolled diabetes with active plantar ulcer',
      diagnosis: 'Type 2 Diabetes Mellitus with neuropathic plantar ulcer',
      observations: 'Active plantar ulcer on left metatarsal head, 2cm x 1.5cm, granular bed, no active purulent discharge or bone exposure. BP slightly elevated.',
      prescription: [
        { name: 'Metformin 1000mg', dosage: '1 tablet', frequency: 'Twice daily (BD)', timing: 'With meals (CC)' },
        { name: 'Pregabalin 75mg', dosage: '1 capsule', frequency: 'Once daily (OD)', timing: 'At bedtime (HS)' }
      ],
      referredTo: 'Advised daily wound dressing and diabetes specialist consult',
      advice: 'Daily wound dressing with sterile saline. Strict offloading of left foot. Restrict simple carbohydrates.',
      followUpDate: '2026-07-13',
      completedAt: 'Draft'
    }
  },
  {
    id: '3',
    name: 'Arjun Das',
    age: 38,
    gender: 'Male',
    village: 'Sector 3 Outpost Hub',
    referredBy: 'Savitri Devi (ASHA)',
    visitTime: '09:45 AM',
    riskLevel: 'Low Risk',
    status: 'Completed',
    vitals: {
      bpSystolic: 120,
      bpDiastolic: 80,
      pulse: 72,
      temperature: 98.6,
      bloodSugar: 110,
      weight: 65,
    },
    symptoms: ['Sore throat', 'Rhinorrhea', 'Dry cough'],
    notes: 'Presented with seasonal flu symptoms for 3 days. No underlying comorbidities.',
    medicalHistory: [
      'Seasonal allergic rhinitis since childhood',
      'No history of major surgical interventions',
      'No chronic metabolic or cardiovascular ailments',
      'Fully vaccinated for Covid-19 and influenza'
    ],
    consultation: {
      clinicalNotes: 'Upper respiratory congestion. Chest clear to auscultation, no adventitious sounds. Throat shows mild erythema but no active exudates.',
      diagnosis: 'Acute Viral Pharyngitis / Seasonal Rhinitis',
      observations: 'Mild pharyngeal erythema. Bilateral air entry equal with no wheezing or crepitations. Heart sounds normal.',
      prescription: [
        { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily (OD)', timing: 'At bedtime (HS)' },
        { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'As needed (PRN)', timing: 'After meals (PC)' }
      ],
      referredTo: 'Discharged with symptomatic advice',
      advice: 'Warm water gargles 3-4 times a day. Steam inhalation at bedtime. Keep hydrated. Return if fever persists > 3 days.',
      followUpDate: '2026-07-10',
      completedAt: '10:05 AM'
    }
  },
  {
    id: '4',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    village: 'Sector 3 Outpost Hub',
    referredBy: 'Savitri Devi (ASHA)',
    visitTime: '11:45 AM',
    riskLevel: 'High Risk',
    status: 'Waiting',
    vitals: {
      bpSystolic: 142,
      bpDiastolic: 90,
      pulse: 104,
      temperature: 101.2,
      bloodSugar: 162,
      weight: 68,
    },
    symptoms: ['Surgical wound erythema', 'High-grade fever peaks', 'Rigor and chills'],
    notes: 'Outpatient clinical follow-up for infected suture. Wound dressing evaluation and antibiotic initiation.',
    medicalHistory: [
      'Laparoscopic Appendectomy completed 12 days ago at district referral center',
      'Essential Hypertension controlled on Telmisartan 40mg daily',
      'No history of drug allergies',
      'Moderate tobacco chewing history (stopped recently)'
    ]
  },
  {
    id: '5',
    name: 'Meera Devi',
    age: 28,
    gender: 'Female',
    village: 'Sector 2 Family Hub',
    referredBy: 'Savitri Devi (ASHA)',
    visitTime: '12:15 PM',
    riskLevel: 'Medium Risk',
    status: 'Waiting',
    vitals: {
      bpSystolic: 135,
      bpDiastolic: 85,
      pulse: 80,
      temperature: 98.4,
      bloodSugar: 118,
      weight: 62,
    },
    symptoms: ['Mild lower back ache', 'Occasional morning dizziness'],
    notes: 'Maternal ANC follow-up check. 26 weeks pregnant. Normal fetal movements reported. Screening for maternal anaemia.',
    medicalHistory: [
      'G2P1, 26 Weeks Gestation',
      'Prior uncomplicated spontaneous vaginal delivery (FT-NVD) in 2022',
      'History of mild gestational iron deficiency anaemia',
      'Regular maternal supplement intake'
    ]
  },
  {
    id: '6',
    name: 'Kiran Yadav',
    age: 31,
    gender: 'Female',
    village: 'Sonagir Rural Sector',
    referredBy: 'Self-Referral',
    visitTime: '01:00 PM',
    riskLevel: 'Low Risk',
    status: 'Waiting',
    vitals: {
      bpSystolic: 118,
      bpDiastolic: 76,
      pulse: 75,
      temperature: 98.2,
      bloodSugar: 95,
      weight: 54,
    },
    symptoms: ['Postpartum fatigue', 'Mild sleep disturbance'],
    notes: 'Routine 6-week postpartum evaluation. Lactating mother. Advised on calcium and iron supplement compliance.',
    medicalHistory: [
      'G3P2, Normal Term Delivery 6 weeks ago',
      'Exclusive breastfeeding mother',
      'Bilateral tubal ligation completed postpartum',
      'No previous endocrine or metabolic abnormalities'
    ]
  }
];

interface DoctorDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function DoctorDashboard({ onBackToRoles, onLogout }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'queue' | 'records'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [patients, setPatients] = useState<Patient[]>(initialPatientsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High Risk' | 'Medium Risk' | 'Low Risk'>('All');
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);
  const [activeConsultation, setActiveConsultation] = useState<Patient | null>(null);
  const [activeSummaryPatient, setActiveSummaryPatient] = useState<Patient | null>(null);
  const [activeSummaryRecord, setActiveSummaryRecord] = useState<ConsultationRecord | null>(null);

  // Consultation Builder Form States
  const [diagnosis, setDiagnosis] = useState('');
  const [observations, setObservations] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [referredTo, setReferredTo] = useState('Discharged with symptomatic advice');
  const [prescriptionList, setPrescriptionList] = useState<PrescriptionItem[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedFrequency, setNewMedFrequency] = useState('Twice daily (BD)');
  const [newMedTiming, setNewMedTiming] = useState('After meals (PC)');
  const [successToast, setSuccessToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const handleStartConsultation = (patient: Patient) => {
    setActiveConsultation(patient);
    // Update patient status to 'In Consultation' locally if not already Completed/In Consult
    setPatients(prev => prev.map(p => {
      if (p.id === patient.id && p.status !== 'Completed') {
        return { ...p, status: 'In Consultation' };
      }
      return p;
    }));
    
    // Prepopulate form if existing consultation data
    if (patient.consultation) {
      setDiagnosis(patient.consultation.diagnosis || patient.consultation.clinicalNotes || '');
      setObservations(patient.consultation.observations || patient.consultation.clinicalNotes || '');
      setAdvice(patient.consultation.advice || patient.consultation.referredTo || '');
      setFollowUpDate(patient.consultation.followUpDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setClinicalNotes(patient.consultation.clinicalNotes);
      setReferredTo(patient.consultation.referredTo);
      setPrescriptionList(patient.consultation.prescription);
    } else {
      setDiagnosis('');
      setObservations('');
      setAdvice('');
      setFollowUpDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setClinicalNotes('');
      setReferredTo('Discharged with symptomatic advice');
      setPrescriptionList([]);
    }
    setNewMedName('');
    setNewMedDosage('1 tablet');
    setNewMedFrequency('Twice daily (BD)');
    setNewMedTiming('After meals (PC)');
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    const item: PrescriptionItem = {
      name: newMedName.trim(),
      dosage: newMedDosage,
      frequency: newMedFrequency,
      timing: newMedTiming
    };
    setPrescriptionList(prev => [...prev, item]);
    setNewMedName('');
  };

  const handleRemoveMedication = (index: number) => {
    setPrescriptionList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    if (!activeConsultation) return;
    
    const record: ConsultationRecord = {
      diagnosis: diagnosis.trim(),
      observations: observations.trim(),
      prescription: prescriptionList,
      advice: advice.trim(),
      followUpDate: followUpDate,
      clinicalNotes: diagnosis.trim() || observations.trim() || 'Draft consultation',
      referredTo: advice.trim() || 'Discharged with symptomatic advice',
      completedAt: 'Draft'
    };

    setPatients(prev => prev.map(p => {
      if (p.id === activeConsultation.id) {
        return {
          ...p,
          status: 'In Consultation',
          consultation: record
        };
      }
      return p;
    }));

    setSuccessToast({
      show: true,
      message: `Draft consultation saved successfully for ${activeConsultation.name}.`
    });

    setActiveConsultation(null);
  };

  const handleCompleteConsultation = () => {
    if (!activeConsultation) return;
    
    if (!diagnosis.trim()) {
      alert("Please enter a Diagnosis before completing the consultation.");
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const record: ConsultationRecord = {
      diagnosis: diagnosis.trim(),
      observations: observations.trim() || 'Routine outpatient observations.',
      prescription: prescriptionList,
      advice: advice.trim() || 'Discharged with symptomatic advice.',
      followUpDate: followUpDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clinicalNotes: diagnosis.trim(),
      referredTo: advice.trim() || 'Discharged with symptomatic advice.',
      completedAt: timeStr
    };

    setPatients(prev => prev.map(p => {
      if (p.id === activeConsultation.id) {
        return {
          ...p,
          status: 'Completed',
          consultation: record
        };
      }
      return p;
    }));

    // Synchronize open details if any
    if (selectedPatientDetails && selectedPatientDetails.id === activeConsultation.id) {
      setSelectedPatientDetails(prev => prev ? { ...prev, status: 'Completed', consultation: record } : null);
    }

    setSuccessToast({
      show: true,
      message: `Consultation completed and electronic medical records locked for ${activeConsultation.name}.`
    });

    setActiveConsultation(null);
  };

  const handleSaveConsultation = () => {
    handleCompleteConsultation();
  };

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
          onClick={() => {
            if (activeConsultation) {
              if (confirm("You have an active consultation in progress. Leaving now will discard unsaved clinical findings. Proceed anyway?")) {
                setActiveConsultation(null);
                onBackToRoles();
              }
            } else {
              onBackToRoles();
            }
          }}
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
                    if (activeConsultation) {
                      if (confirm("You have an active consultation in progress. Leaving now will discard unsaved clinical findings. Proceed anyway?")) {
                        setActiveConsultation(null);
                        setActiveSummaryPatient(null);
                        setActiveSummaryRecord(null);
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }
                    } else {
                      setActiveSummaryPatient(null);
                      setActiveSummaryRecord(null);
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }
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
            onClick={() => {
              if (activeConsultation) {
                if (confirm("You have an active consultation in progress. Leaving now will discard unsaved clinical findings. Proceed anyway?")) {
                  setActiveConsultation(null);
                  setActiveSummaryPatient(null);
                  setActiveSummaryRecord(null);
                  onBackToRoles();
                }
              } else {
                setActiveSummaryPatient(null);
                setActiveSummaryRecord(null);
                onBackToRoles();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-transparent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Switch Role</span>
          </button>
          <button
            onClick={() => {
              if (activeConsultation) {
                if (confirm("You have an active consultation in progress. Leaving now will discard unsaved clinical findings. Proceed anyway?")) {
                  setActiveConsultation(null);
                  setActiveSummaryPatient(null);
                  setActiveSummaryRecord(null);
                  onLogout();
                }
              } else {
                setActiveSummaryPatient(null);
                setActiveSummaryRecord(null);
                onLogout();
              }
            }}
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
        
        {activeSummaryPatient && activeSummaryRecord ? (
          <ConsultationSummary
            patient={activeSummaryPatient}
            record={activeSummaryRecord}
            onEdit={() => {
              // Go back to consultation workspace
              setActiveConsultation(activeSummaryPatient);
              // Prepopulate the form fields if needed (these are reactive in ConsultationWorkspace to patient.consultation or custom passed state)
              setActiveSummaryPatient(null);
              setActiveSummaryRecord(null);
            }}
            onApprove={() => {
              // Lock / Approve record
              setPatients(prev => prev.map(p => {
                if (p.id === activeSummaryPatient.id) {
                  return { ...p, status: 'Completed', consultation: activeSummaryRecord };
                }
                return p;
              }));
              setSuccessToast({
                show: true,
                message: `SOAP clinical record approved and cryptographically signed for ${activeSummaryPatient.name}.`
              });
            }}
            onReturnToQueue={() => {
              setActiveSummaryPatient(null);
              setActiveSummaryRecord(null);
              setActiveTab('queue');
            }}
          />
        ) : activeConsultation ? (
          <ConsultationWorkspace
            patient={activeConsultation}
            onCancel={() => setActiveConsultation(null)}
            onSaveDraft={(record) => {
              setPatients(prev => prev.map(p => {
                if (p.id === activeConsultation.id) {
                  return { ...p, status: 'In Consultation', consultation: record };
                }
                return p;
              }));
              setSuccessToast({
                show: true,
                message: `Draft consultation saved successfully for ${activeConsultation.name}.`
              });
              setActiveConsultation(null);
            }}
            onComplete={(record) => {
              setPatients(prev => prev.map(p => {
                if (p.id === activeConsultation.id) {
                  return { ...p, status: 'Completed', consultation: record };
                }
                return p;
              }));
              if (selectedPatientDetails && selectedPatientDetails.id === activeConsultation.id) {
                setSelectedPatientDetails(prev => prev ? { ...prev, status: 'Completed', consultation: record } : null);
              }
              
              // Transition to Consultation Summary page
              setActiveSummaryPatient(activeConsultation);
              setActiveSummaryRecord(record);
              setActiveConsultation(null);
            }}
          />
        ) : (
          <>
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
                {patients.slice(0, 3).map((patient, index) => {
                  const isHigh = patient.riskLevel === 'High Risk';
                  const isMed = patient.riskLevel === 'Medium Risk';

                  return (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatientDetails(patient)}
                      className="bg-slate-50/60 border border-slate-100/50 hover:border-purple-300 hover:bg-white hover:shadow-md rounded-2xl p-5 space-y-3 relative group transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                            isHigh 
                              ? 'text-rose-600 bg-rose-50 border border-rose-100/40' 
                              : isMed 
                                ? 'text-amber-600 bg-amber-50 border border-amber-100/40' 
                                : 'text-emerald-600 bg-emerald-50 border border-emerald-100/40'
                          }`}>
                            {patient.riskLevel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">#0{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">
                            {patient.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{patient.notes}</p>
                        </div>
                      </div>
                      <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[110px]">Ref: {patient.referredBy}</span>
                        <span className="font-semibold text-slate-700 whitespace-nowrap">{patient.visitTime}</span>
                      </div>
                    </div>
                  );
                })}
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
                Recent Patients (Completed)
              </h2>

              {patients.filter(p => p.status === 'Completed').length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patients.filter(p => p.status === 'Completed').map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPatientDetails(p)}
                      className="bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-display font-bold text-xs">
                          {p.name[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                          <p className="text-[10px] text-slate-400">
                            {p.age}y / {p.gender} • Completed at {p.consultation?.completedAt || 'Recently'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        Discharged
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
            {/* Page Header */}
            <div>
              <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-widest font-bold inline-block border border-purple-100">
                Outpatient Clinical Queue
              </span>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-950 tracking-tight mt-1.5">
                Active Patient Queue
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Monitor triage arrivals, start telemedicine consultations, and record electronic prescriptions for regional citizens.
              </p>
            </div>

            {/* Stats Summary Strips (M3 Style Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  Total Roster
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-display font-black text-slate-900">
                    {patients.length}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">citizens</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
                <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider block">
                  Waiting
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-display font-black text-amber-600">
                    {patients.filter(p => p.status === 'Waiting').length}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-500">pending</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
                <span className="text-[10px] font-mono text-purple-600 font-bold uppercase tracking-wider block">
                  In Consult
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-display font-black text-purple-600">
                    {patients.filter(p => p.status === 'In Consultation').length}
                  </span>
                  <span className="text-[10px] font-semibold text-purple-500">active</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider block">
                  Completed
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-display font-black text-emerald-600">
                    {patients.filter(p => p.status === 'Completed').length}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-500">discharged</span>
                </div>
              </div>
            </div>

            {/* M3 Search and Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search input with left icon */}
              <div className="flex-1 flex items-center gap-3 bg-white border border-slate-150 px-4 py-3 rounded-2xl shadow-xs transition-all focus-within:border-purple-400 focus-within:shadow-md">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search patient queue by name, village, or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs outline-none w-full text-slate-700 placeholder-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Filter Chips Container */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <button
                  onClick={() => setRiskFilter('All')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    riskFilter === 'All'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Patients</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${riskFilter === 'All' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {patients.length}
                  </span>
                </button>

                <button
                  onClick={() => setRiskFilter('High Risk')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    riskFilter === 'High Risk'
                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-rose-600 hover:bg-rose-50/50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>High Risk</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${riskFilter === 'High Risk' ? 'bg-white/25 text-white' : 'bg-rose-50 text-rose-600'}`}>
                    {patients.filter(p => p.riskLevel === 'High Risk').length}
                  </span>
                </button>

                <button
                  onClick={() => setRiskFilter('Medium Risk')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    riskFilter === 'Medium Risk'
                      ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-amber-600 hover:bg-amber-50/50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Medium Risk</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${riskFilter === 'Medium Risk' ? 'bg-white/25 text-white' : 'bg-amber-50 text-amber-600'}`}>
                    {patients.filter(p => p.riskLevel === 'Medium Risk').length}
                  </span>
                </button>

                <button
                  onClick={() => setRiskFilter('Low Risk')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    riskFilter === 'Low Risk'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Low Risk</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${riskFilter === 'Low Risk' ? 'bg-white/25 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                    {patients.filter(p => p.riskLevel === 'Low Risk').length}
                  </span>
                </button>
              </div>
            </div>

            {/* Patient Cards List */}
            <div className="space-y-4">
              {(() => {
                const filtered = patients.filter(patient => {
                  const matchSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      patient.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      patient.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
                  const matchFilter = riskFilter === 'All' || patient.riskLevel === riskFilter;
                  return matchSearch && matchFilter;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                      <Users className="w-12 h-12 text-slate-300 mb-3" />
                      <h3 className="font-display font-bold text-slate-700 text-sm">No patients found</h3>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">
                        Try modifying your active query or resetting the risk priority filters to explore other citizens in the clinical queue.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((patient) => {
                      const isHigh = patient.riskLevel === 'High Risk';
                      const isMed = patient.riskLevel === 'Medium Risk';

                      return (
                        <div
                          key={patient.id}
                          className={`bg-white border rounded-[2rem] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                            patient.status === 'In Consultation'
                              ? 'border-purple-400 ring-2 ring-purple-500/15'
                              : 'border-slate-100'
                          }`}
                        >
                          {/* Card Header Info */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                                  isHigh
                                    ? 'text-rose-600 bg-rose-50 border border-rose-100/40'
                                    : isMed
                                      ? 'text-amber-600 bg-amber-50 border border-amber-100/40'
                                      : 'text-emerald-600 bg-emerald-50 border border-emerald-100/40'
                                }`}>
                                  {patient.riskLevel}
                                </span>
                              </div>

                              {/* Status Indicator */}
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                patient.status === 'Completed'
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                  : patient.status === 'In Consultation'
                                    ? 'bg-purple-50 border-purple-100 text-purple-700 animate-pulse font-extrabold'
                                    : 'bg-slate-50 border-slate-150 text-slate-500'
                              }`}>
                                {patient.status === 'In Consultation' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping inline-block" />
                                )}
                                {patient.status}
                              </span>
                            </div>

                            {/* Demographics */}
                            <div>
                              <h3 className="font-display font-bold text-slate-900 text-base">
                                {patient.name}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Age: <span className="font-medium text-slate-700">{patient.age}</span> • Gender: <span className="font-medium text-slate-700">{patient.gender}</span>
                              </p>
                            </div>

                            {/* Village, Referred by, Visit Time details */}
                            <div className="grid grid-cols-1 gap-2 pt-1 pb-2 border-y border-slate-50 text-[11px] text-slate-500">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">Village: <strong className="text-slate-700 font-medium">{patient.village}</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">Referred By: <strong className="text-slate-700 font-medium">{patient.referredBy}</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Check-In Time: <strong className="text-slate-700 font-medium">{patient.visitTime}</strong></span>
                              </div>
                            </div>

                            {/* Reported symptoms capsules */}
                            <div className="flex flex-wrap gap-1.5">
                              {patient.symptoms.map((symptom, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded-lg">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Card Action Controls */}
                          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-50">
                            <button
                              onClick={() => setSelectedPatientDetails(patient)}
                              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer border border-transparent"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>

                            {patient.status === 'Completed' ? (
                              <button
                                onClick={() => {
                                  if (patient.consultation) {
                                    setActiveSummaryPatient(patient);
                                    setActiveSummaryRecord(patient.consultation);
                                  } else {
                                    setSelectedPatientDetails(patient);
                                  }
                                }}
                                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Completed</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartConsultation(patient)}
                                className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-xs ${
                                  patient.status === 'In Consultation'
                                    ? 'bg-purple-700 hover:bg-purple-800 animate-pulse'
                                    : 'bg-slate-900 hover:bg-slate-800'
                                }`}
                              >
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>
                                  {patient.status === 'In Consultation' ? 'Resume Consult' : 'Start Consult'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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
            {/* Records Page Header */}
            <div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest font-bold inline-block border border-emerald-100">
                EHR Ledger Console
              </span>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-950 tracking-tight mt-1.5">
                Electronic Health Records
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Access stored diagnostic details, prescriptions, and historical referral logs completed during active clinical sessions.
              </p>
            </div>

            {/* List of Patient Records */}
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">
                  Patient Health Records
                </span>
                <span className="text-[10px] text-slate-400">Showing active cases</span>
              </div>

              <div className="divide-y divide-slate-150">
                {patients.map((patient) => (
                  <div key={patient.id} className="p-6 hover:bg-slate-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-slate-900 text-sm">
                          {patient.name}
                        </h4>
                        <span className={`text-[8px] font-mono font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                          patient.riskLevel === 'High Risk'
                            ? 'text-rose-600 bg-rose-50'
                            : patient.riskLevel === 'Medium Risk'
                              ? 'text-amber-600 bg-amber-50'
                              : 'text-emerald-600 bg-emerald-50'
                        }`}>
                          {patient.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {patient.age}y / {patient.gender} • Village: <span className="font-medium text-slate-700">{patient.village}</span>
                      </p>
                      
                      {patient.consultation ? (
                        <p className="text-[11px] text-slate-600 italic line-clamp-1 mt-1">
                          Findings: "{patient.consultation.clinicalNotes}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic mt-1">
                          No active consultation recorded for this patient.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {patient.status === 'Completed' ? (
                        <div className="text-right hidden md:block">
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg block">
                            Discharged
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            at {patient.consultation?.completedAt}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-lg block hidden md:block">
                          {patient.status}
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (patient.status === 'Completed' && patient.consultation) {
                            setActiveSummaryPatient(patient);
                            setActiveSummaryRecord(patient.consultation);
                          } else {
                            setSelectedPatientDetails(patient);
                          }
                        }}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shrink-0"
                      >
                        {patient.status === 'Completed' ? 'View Record' : 'View Vitals'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

          </>
        )}

      </main>

      {/* Success Notification Toast */}
      <AnimatePresence>
        {successToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold leading-normal">{successToast.message}</p>
            </div>
            <button
              onClick={() => setSuccessToast({ show: false, message: '' })}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {selectedPatientDetails && (
          <PatientDetailsModal
            patient={selectedPatientDetails}
            onClose={() => setSelectedPatientDetails(null)}
            onStartConsultation={(p) => handleStartConsultation(p)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
