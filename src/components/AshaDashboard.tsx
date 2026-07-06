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
  X,
  User,
  Phone,
  Shield,
  HeartPulse,
  AlertCircle,
  Check,
  PlusCircle,
  Sparkles,
  Thermometer,
  Activity,
  Scale,
  Droplet,
  Calendar,
  FileText,
  Pill
} from 'lucide-react';

interface AshaDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function AshaDashboard({ onBackToRoles, onLogout }: AshaDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'patients' | 'tasks' | 'risk'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Patient Registration UI states
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    abhaId: '',
    village: '',
    gramPanchayat: '',
    district: '',
    state: '',
    pinCode: '',
    pregnant: 'No' as 'Yes' | 'No',
    chronicDiseases: '',
    allergies: '',
    emergencyContact: ''
  });

  // Home Visit UI states
  const [isHomeVisiting, setIsHomeVisiting] = useState(false);
  const [homeVisitSuccess, setHomeVisitSuccess] = useState(false);
  const [homeVisitFormErrors, setHomeVisitFormErrors] = useState<Record<string, string>>({});
  
  const [homeVisitData, setHomeVisitData] = useState({
    patientId: '',
    visitDate: '',
    visitTime: '',
    bpSystolic: '',
    bpDiastolic: '',
    weight: '',
    temperature: '',
    pulse: '',
    bloodSugar: '',
    notes: '',
    medicationCompliance: 'Yes' as 'Yes' | 'No',
    nextVisitDate: ''
  });

  const [defaultPatients, setDefaultPatients] = useState([
    { 
      id: '1', 
      name: 'Meera Devi', 
      age: 28, 
      gender: 'Female', 
      village: 'Sector 2, Family Hub',
      abhaId: 'ABHA-92-4910-2384',
      mobileNumber: '9876543210',
      pregnant: 'Yes' as 'Yes' | 'No',
      pregnancyDetails: '24 weeks gestation, Trimester 2',
      chronicDiseases: 'None reported',
      allergies: 'None reported',
      notes: 'G1P0, routine prenatal care. Complains of mild foot swelling and occasional headaches.',
      symptoms: ['Mild Swelling', 'Mild Headache'],
      vitals: {
        bpSystolic: '142',
        bpDiastolic: '92',
        temperature: '98.4',
        pulse: '82',
        bloodSugar: '115',
        weight: '64.2'
      },
      checklist: {
        highFever: false,
        breathingDifficulty: false,
        chestPain: false,
        severeHeadache: true,
        swelling: true,
        bleeding: false,
        dehydration: false,
      }
    },
    { 
      id: '2', 
      name: 'Rajesh Kumar', 
      age: 45, 
      gender: 'Male', 
      village: 'Sector 3, Outer Border',
      abhaId: 'ABHA-15-8932-5012',
      mobileNumber: '9123456780',
      pregnant: 'No' as 'Yes' | 'No',
      pregnancyDetails: '',
      chronicDiseases: 'Hypertension',
      allergies: 'Penicillin',
      notes: 'Post-operative recovery. Complains of sudden severe chest discomfort and breathlessness.',
      symptoms: ['Chest Pain', 'Shortness of Breath', 'Cold Sweats'],
      vitals: {
        bpSystolic: '165',
        bpDiastolic: '105',
        temperature: '101.2',
        pulse: '105',
        bloodSugar: '180',
        weight: '78.5'
      },
      checklist: {
        highFever: true,
        breathingDifficulty: true,
        chestPain: true,
        severeHeadache: false,
        swelling: false,
        bleeding: false,
        dehydration: false,
      }
    },
    { 
      id: '3', 
      name: 'Sita Devi', 
      age: 22, 
      gender: 'Female', 
      village: 'Sector 2, Health Camp',
      abhaId: 'ABHA-72-3041-9876',
      mobileNumber: '8765432109',
      pregnant: 'No' as 'Yes' | 'No',
      pregnancyDetails: 'Lactating mother (3 months postpartum)',
      chronicDiseases: 'None reported',
      allergies: 'Sulfa drugs',
      notes: 'Presents with high grade fever, extreme thirst, dry mouth, and lethargy.',
      symptoms: ['High Fever', 'Extreme Thirst', 'Dry Mouth', 'Chills'],
      vitals: {
        bpSystolic: '102',
        bpDiastolic: '62',
        temperature: '103.1',
        pulse: '98',
        bloodSugar: '85',
        weight: '51.0'
      },
      checklist: {
        highFever: true,
        breathingDifficulty: false,
        chestPain: false,
        severeHeadache: false,
        swelling: false,
        bleeding: false,
        dehydration: true,
      }
    },
    { 
      id: '4', 
      name: 'Karan Singh', 
      age: 34, 
      gender: 'Male', 
      village: 'Sector 1, Main Road',
      abhaId: 'ABHA-44-2390-1122',
      mobileNumber: '7654321098',
      pregnant: 'No' as 'Yes' | 'No',
      pregnancyDetails: '',
      chronicDiseases: 'Asthma (Controlled)',
      allergies: 'Dust, Pollen',
      notes: 'Regular check-up. General wellness visit.',
      symptoms: ['None'],
      vitals: {
        bpSystolic: '118',
        bpDiastolic: '78',
        temperature: '98.6',
        pulse: '68',
        bloodSugar: '95',
        weight: '70.4'
      },
      checklist: {
        highFever: false,
        breathingDifficulty: false,
        chestPain: false,
        severeHeadache: false,
        swelling: false,
        bleeding: false,
        dehydration: false,
      }
    },
    { 
      id: '5', 
      name: 'Anjali Sharma', 
      age: 30, 
      gender: 'Female', 
      village: 'Sector 4, Riverbank',
      abhaId: 'ABHA-88-1290-7764',
      mobileNumber: '9988776655',
      pregnant: 'Yes' as 'Yes' | 'No',
      pregnancyDetails: '12 weeks gestation, Trimester 1',
      chronicDiseases: 'None reported',
      allergies: 'None reported',
      notes: 'Initial check-up, mild morning sickness.',
      symptoms: ['Mild Nausea'],
      vitals: {
        bpSystolic: '110',
        bpDiastolic: '70',
        temperature: '98.2',
        pulse: '74',
        bloodSugar: '90',
        weight: '58.0'
      },
      checklist: {
        highFever: false,
        breathingDifficulty: false,
        chestPain: false,
        severeHeadache: false,
        swelling: false,
        bleeding: false,
        dehydration: false,
      }
    }
  ]);

  // Risk Verification UI states
  const [isRiskVerifying, setIsRiskVerifying] = useState(false);
  const [selectedVerifyPatientId, setSelectedVerifyPatientId] = useState<string>('');
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [verifySuccessMessage, setVerifySuccessMessage] = useState('');
  const [verifyActionTaken, setVerifyActionTaken] = useState<'Normal' | 'PHC' | 'Doctor' | null>(null);
  const [phcSelection, setPhcSelection] = useState('Datia District PHC');
  const [doctorRequestNotes, setDoctorRequestNotes] = useState('');
  const [phcUrgency, setPhcUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  const [doctorSpecialty, setDoctorSpecialty] = useState('General Medicine');
  const [doctorUrgency, setDoctorUrgency] = useState('Standard');
  const [referralId, setReferralId] = useState('');
  const [consultId, setConsultId] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');

  // Active checklist for the verifying patient
  const [riskChecklist, setRiskChecklist] = useState({
    highFever: false,
    breathingDifficulty: false,
    chestPain: false,
    severeHeadache: false,
    swelling: false,
    bleeding: false,
    dehydration: false,
  });

  // Dynamic values during evaluation
  const [verifyVitals, setVerifyVitals] = useState({
    bpSystolic: '',
    bpDiastolic: '',
    temperature: '',
    pulse: '',
    bloodSugar: '',
    weight: ''
  });

  const [verifySymptoms, setVerifySymptoms] = useState<string[]>([]);

  // Open Verify Risk flow preloading specific patient
  const startRiskVerification = (patientId: string) => {
    const patient = defaultPatients.find(p => p.id === patientId);
    if (patient) {
      setSelectedVerifyPatientId(patientId);
      setRiskChecklist({
        highFever: patient.checklist?.highFever || false,
        breathingDifficulty: patient.checklist?.breathingDifficulty || false,
        chestPain: patient.checklist?.chestPain || false,
        severeHeadache: patient.checklist?.severeHeadache || false,
        swelling: patient.checklist?.swelling || false,
        bleeding: patient.checklist?.bleeding || false,
        dehydration: patient.checklist?.dehydration || false,
      });
      setVerifyVitals({
        bpSystolic: patient.vitals?.bpSystolic || '',
        bpDiastolic: patient.vitals?.bpDiastolic || '',
        temperature: patient.vitals?.temperature || '',
        pulse: patient.vitals?.pulse || '',
        bloodSugar: patient.vitals?.bloodSugar || '',
        weight: patient.vitals?.weight || ''
      });
      setVerifySymptoms(patient.symptoms || []);
      setIsRiskVerifying(true);
      setVerifySuccess(false);
      setVerifyActionTaken(null);
    }
  };

  // Derived calculation for current patient risk level
  const getCurrentRisk = () => {
    let checkedCount = Object.values(riskChecklist).filter(Boolean).length;
    let systolic = parseInt(verifyVitals.bpSystolic) || 0;
    let diastolic = parseInt(verifyVitals.bpDiastolic) || 0;
    let temp = parseFloat(verifyVitals.temperature) || 0;

    // Check high priority conditions for HIGH risk
    if (
      riskChecklist.bleeding ||
      riskChecklist.chestPain ||
      riskChecklist.breathingDifficulty ||
      systolic >= 160 ||
      diastolic >= 110
    ) {
      return { level: 'HIGH', score: checkedCount + 3 };
    }

    // Check medium priority conditions for MEDIUM risk
    if (
      riskChecklist.severeHeadache ||
      riskChecklist.swelling ||
      riskChecklist.highFever ||
      riskChecklist.dehydration ||
      checkedCount > 1 ||
      systolic >= 140 ||
      diastolic >= 90 ||
      temp >= 100.5
    ) {
      return { level: 'MEDIUM', score: checkedCount + 1 };
    }

    return { level: 'LOW', score: checkedCount };
  };

  const currentRisk = getCurrentRisk();

  const handleMarkNormal = () => {
    const patient = defaultPatients.find(p => p.id === selectedVerifyPatientId);
    if (!patient) return;
    
    // Update local state for patient status
    setVerifyActionTaken('Normal');
    setVerifySuccessMessage(`Patient ${patient.name} has been certified stable. All vital signs are stored, and follow-up alerts are registered.`);
    setVerifySuccess(true);
  };

  const handleReferPHC = () => {
    const patient = defaultPatients.find(p => p.id === selectedVerifyPatientId);
    if (!patient) return;

    // Generate unique ticket number
    const uniqueRefId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferralId(uniqueRefId);
    setVerifyActionTaken('PHC');
    setVerifySuccess(true);
  };

  const handleDoctorRequest = () => {
    const patient = defaultPatients.find(p => p.id === selectedVerifyPatientId);
    if (!patient) return;

    // Generate consult ID
    const uniqueConsultId = `TEL-${Math.floor(100000 + Math.random() * 900000)}`;
    setConsultId(uniqueConsultId);
    setVerifyActionTaken('Doctor');
    setVerifySuccess(true);
  };

  const [homeVisitHistory, setHomeVisitHistory] = useState([
    {
      id: 'v1',
      patientName: 'Meera Devi',
      visitDate: '2026-07-05',
      visitTime: '09:30',
      bloodPressure: '120/80',
      weight: '54',
      temperature: '98.6',
      pulse: '72',
      bloodSugar: '110',
      notes: 'Patient feels healthy. Followed up on pregnancy exercises and prenatal vitamins.',
      medicationCompliance: 'Yes',
      nextVisitDate: '2026-07-12'
    },
    {
      id: 'v2',
      patientName: 'Rajesh Kumar',
      visitDate: '2026-07-04',
      visitTime: '11:45',
      bloodPressure: '135/85',
      weight: '70',
      temperature: '99.1',
      pulse: '80',
      bloodSugar: '145',
      notes: 'Post-op wound dressing checked and cleaned. Slight redness but healing well.',
      medicationCompliance: 'Yes',
      nextVisitDate: '2026-07-11'
    }
  ]);

  const navigationItems = [
    { id: 'home' as const, label: 'Dashboard Hub', icon: ClipboardList },
    { id: 'patients' as const, label: 'Patient Register', icon: Users },
    { id: 'risk' as const, label: 'Verify Risk', icon: Shield },
    { id: 'tasks' as const, label: 'Task List', icon: FileCheck },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    
    if (!formData.age.trim()) {
      errors.age = 'Age is required';
    } else {
      const parsedAge = Number(formData.age);
      if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 125) {
        errors.age = 'Enter a valid age (1-125)';
      }
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.village.trim()) {
      errors.village = 'Village is required';
    }

    if (!formData.gramPanchayat.trim()) {
      errors.gramPanchayat = 'Gram Panchayat is required';
    }

    if (!formData.district.trim()) {
      errors.district = 'District is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.pinCode.trim()) {
      errors.pinCode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      errors.pinCode = 'Enter a valid 6-digit PIN code';
    }

    if (!formData.emergencyContact.trim()) {
      errors.emergencyContact = 'Emergency Contact is required';
    } else if (!/^\d{10}$/.test(formData.emergencyContact.trim())) {
      errors.emergencyContact = 'Enter a valid 10-digit emergency contact number';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to first error field
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Success!
    const newPatient = {
      id: String(defaultPatients.length + 1),
      name: formData.fullName,
      age: Number(formData.age),
      gender: formData.gender as 'Female' | 'Male',
      village: formData.village,
      abhaId: formData.abhaId || `ABHA-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      mobileNumber: formData.mobileNumber,
      pregnant: formData.pregnant as 'Yes' | 'No',
      pregnancyDetails: formData.pregnant === 'Yes' ? 'G1P0 Antenatal care record' : '',
      chronicDiseases: formData.chronicDiseases || 'None reported',
      allergies: formData.allergies || 'None reported',
      notes: 'Newly registered community patient outreach file.',
      symptoms: [] as string[],
      vitals: {
        bpSystolic: '120',
        bpDiastolic: '80',
        temperature: '98.6',
        pulse: '72',
        bloodSugar: '90',
        weight: '60'
      },
      checklist: {
        highFever: false,
        breathingDifficulty: false,
        chestPain: false,
        severeHeadache: false,
        swelling: false,
        bleeding: false,
        dehydration: false,
      }
    };
    setDefaultPatients([...defaultPatients, newPatient]);
    setRegistrationSuccess(true);
    setFormErrors({});
  };

  const handleSaveHomeVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!homeVisitData.patientId) {
      errors.patientId = 'Please select a patient';
    }
    if (!homeVisitData.visitDate) {
      errors.visitDate = 'Visit date is required';
    }
    if (!homeVisitData.visitTime) {
      errors.visitTime = 'Visit time is required';
    }
    
    if (!homeVisitData.bpSystolic.trim()) {
      errors.bpSystolic = 'Systolic BP is required';
    } else {
      const sys = Number(homeVisitData.bpSystolic);
      if (isNaN(sys) || sys < 70 || sys > 250) {
        errors.bpSystolic = 'Enter valid Systolic BP (70-250)';
      }
    }
    
    if (!homeVisitData.bpDiastolic.trim()) {
      errors.bpDiastolic = 'Diastolic BP is required';
    } else {
      const dia = Number(homeVisitData.bpDiastolic);
      if (isNaN(dia) || dia < 40 || dia > 150) {
        errors.bpDiastolic = 'Enter valid Diastolic BP (40-150)';
      }
    }

    if (!homeVisitData.weight.trim()) {
      errors.weight = 'Weight is required';
    } else {
      const wt = Number(homeVisitData.weight);
      if (isNaN(wt) || wt <= 1 || wt > 250) {
        errors.weight = 'Enter valid Weight (1-250 kg)';
      }
    }

    if (!homeVisitData.temperature.trim()) {
      errors.temperature = 'Temperature is required';
    } else {
      const temp = Number(homeVisitData.temperature);
      if (isNaN(temp) || temp < 90 || temp > 110) {
        errors.temperature = 'Enter valid Temperature (90-110 °F)';
      }
    }

    if (!homeVisitData.pulse.trim()) {
      errors.pulse = 'Pulse rate is required';
    } else {
      const pls = Number(homeVisitData.pulse);
      if (isNaN(pls) || pls < 30 || pls > 220) {
        errors.pulse = 'Enter valid Pulse rate (30-220 bpm)';
      }
    }

    if (!homeVisitData.bloodSugar.trim()) {
      errors.bloodSugar = 'Blood sugar is required';
    } else {
      const bs = Number(homeVisitData.bloodSugar);
      if (isNaN(bs) || bs < 30 || bs > 600) {
        errors.bloodSugar = 'Enter valid Blood Sugar (30-600 mg/dL)';
      }
    }

    if (!homeVisitData.nextVisitDate) {
      errors.nextVisitDate = 'Next visit date is required';
    }

    if (Object.keys(errors).length > 0) {
      setHomeVisitFormErrors(errors);
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(`visit_${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Success! Save the record to local list
    const patientObj = defaultPatients.find(p => p.id === homeVisitData.patientId);
    const newVisit = {
      id: `v_${Date.now()}`,
      patientName: patientObj ? patientObj.name : 'Unknown Patient',
      visitDate: homeVisitData.visitDate,
      visitTime: homeVisitData.visitTime,
      bloodPressure: `${homeVisitData.bpSystolic}/${homeVisitData.bpDiastolic}`,
      weight: homeVisitData.weight,
      temperature: homeVisitData.temperature,
      pulse: homeVisitData.pulse,
      bloodSugar: homeVisitData.bloodSugar,
      notes: homeVisitData.notes || 'No additional notes logged.',
      medicationCompliance: homeVisitData.medicationCompliance,
      nextVisitDate: homeVisitData.nextVisitDate
    };

    setHomeVisitHistory([newVisit, ...homeVisitHistory]);
    setHomeVisitSuccess(true);
    setHomeVisitFormErrors({});
  };

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
                    setIsRegistering(false);
                    setRegistrationSuccess(false);
                    setFormErrors({});
                    setIsHomeVisiting(false);
                    setHomeVisitSuccess(false);
                    setHomeVisitFormErrors({});
                    if (item.id === 'risk') {
                      startRiskVerification('1'); // Preload first patient
                    } else {
                      setIsRiskVerifying(false);
                    }
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
        {isRiskVerifying ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 animate-fade-in text-slate-800"
          >
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRiskVerifying(false);
                    setActiveTab('home');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 shadow-xs cursor-pointer mb-2 w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                  <Shield className="w-6 h-6 text-emerald-600 animate-pulse" />
                  Verify Clinical Risk & Triage
                </h1>
                <p className="text-xs text-slate-400">
                  Perform real-time clinical risk audit, evaluate dangerous symptoms, and register routing instructions.
                </p>
              </div>
            </div>

            {/* Success and Receipt Views */}
            {verifySuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-10 shadow-xl relative overflow-hidden"
              >
                {/* Decorative backgrounds based on action */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-emerald-50/10 to-transparent pointer-events-none" />
                
                {verifyActionTaken === 'Normal' && (
                  <div className="space-y-6 text-center max-w-xl mx-auto py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-display font-bold text-slate-900">Clinical Risk Verified: Stable</h2>
                      <p className="text-xs text-slate-400">{verifySuccessMessage}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs space-y-3 leading-relaxed">
                      <p className="font-semibold text-slate-700">Recommended Community Follow-up Actions:</p>
                      <ul className="list-disc list-inside space-y-1.5 text-slate-500 font-medium">
                        <li>Encourage patient to maintain current hydration levels and sleep schedule.</li>
                        <li>Verify medication compliance of baseline supplements (iron, calcium) next week.</li>
                        <li>Counsel patient to immediately contact the local ASHA worker if any danger symptoms appear.</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setIsRiskVerifying(false);
                        setActiveTab('home');
                      }}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-sm cursor-pointer mt-4"
                    >
                      Return to Dashboard Hub
                    </button>
                  </div>
                )}

                {verifyActionTaken === 'PHC' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-orange-600 uppercase tracking-wider bg-orange-50/85 px-2 py-0.5 rounded-md">
                          {phcUrgency} Referral Generated
                        </span>
                        <h2 className="text-base font-display font-extrabold text-slate-900">PHC Referral Receipt</h2>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-normal">
                      The clinical risk referral has been securely processed and logged in the district registry. Please print or present this ticket to the Primary Health Centre triage officer upon arrival.
                    </p>

                    {/* Referral Ticket Styling */}
                    <div className="border border-slate-200/80 rounded-[1.5rem] bg-linear-to-b from-slate-50 to-white overflow-hidden shadow-xs relative">
                      {/* Ticket Cutout Dots */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-100 border-r border-slate-200 rounded-r-full" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-100 border-l border-slate-200 rounded-l-full" />
                      
                      {/* Ticket Header */}
                      <div className="bg-slate-100/70 border-b border-dashed border-slate-200 p-5 flex flex-col sm:flex-row sm:justify-between gap-2.5">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Referral ID</span>
                          <span className="font-mono text-xs font-bold text-slate-800">{referralId}</span>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Referral Date & Time</span>
                          <span className="font-mono text-xs font-semibold text-slate-600">{new Date().toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Ticket Body */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Patient Details</span>
                          <p className="font-bold text-slate-800 text-sm">{defaultPatients.find(p => p.id === selectedVerifyPatientId)?.name}</p>
                          <p className="text-slate-500 font-medium">
                            {defaultPatients.find(p => p.id === selectedVerifyPatientId)?.gender}, {defaultPatients.find(p => p.id === selectedVerifyPatientId)?.age} Years
                          </p>
                          <p className="text-slate-400 font-mono text-[10px]">
                            ABHA: {defaultPatients.find(p => p.id === selectedVerifyPatientId)?.abhaId}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Destination Facility</span>
                          <p className="font-bold text-slate-800">{phcSelection}</p>
                          <p className="text-slate-500 font-medium">Community Care Triage Department</p>
                        </div>

                        <div className="space-y-1 md:col-span-2 border-t border-slate-100 pt-4">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Urgent Danger Symptoms Checked</span>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {Object.entries(riskChecklist).filter(([_, checked]) => checked).map(([key, _]) => (
                              <span key={key} className="bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-bold px-2.5 py-0.5 rounded-lg capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            ))}
                            {Object.entries(riskChecklist).filter(([_, checked]) => checked).length === 0 && (
                              <span className="text-slate-400 italic">No checklist items checked. Referred based on clinical vitals.</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 md:col-span-2 border-t border-slate-100 pt-4">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Triage Recorded Vitals</span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-1.5 font-mono text-[11px] text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div>BP: <strong className="text-slate-800">{verifyVitals.bpSystolic}/{verifyVitals.bpDiastolic}</strong></div>
                            <div>Pulse: <strong className="text-slate-800">{verifyVitals.pulse} bpm</strong></div>
                            <div>Temp: <strong className="text-slate-800">{verifyVitals.temperature} °F</strong></div>
                            <div>Sugar: <strong className="text-slate-800">{verifyVitals.bloodSugar} mg/dL</strong></div>
                            <div>Weight: <strong className="text-slate-800">{verifyVitals.weight} kg</strong></div>
                          </div>
                        </div>

                        <div className="space-y-1 md:col-span-2 border-t border-slate-100 pt-4">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">ASHA Triage Notes</span>
                          <p className="text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 leading-relaxed font-medium">
                            {doctorRequestNotes || 'No custom notes provided. Routine PHC referral generated.'}
                          </p>
                        </div>
                      </div>

                      {/* Barcode Mock */}
                      <div className="bg-slate-100/50 border-t border-slate-100 p-5 flex flex-col items-center justify-center text-center">
                        <div className="font-mono text-[9px] text-slate-400 tracking-[0.25em] flex flex-col items-center gap-1">
                          <div className="w-48 h-8 bg-repeating-linear-stripes border border-slate-200" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #1e293b, #1e293b 2px, transparent 2px, transparent 6px)' }} />
                          <span>* {referralId} *</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer text-center"
                      >
                        Print Referral Slip
                      </button>
                      <button
                        onClick={() => {
                          setIsRiskVerifying(false);
                          setActiveTab('home');
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer text-center"
                      >
                        Return to Hub
                      </button>
                    </div>
                  </div>
                )}

                {verifyActionTaken === 'Doctor' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <Clock className="w-6 h-6 animate-spin-slow" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-purple-600 uppercase tracking-wider bg-purple-50/85 px-2 py-0.5 rounded-md">
                          Telemedicine Dispatch Complete
                        </span>
                        <h2 className="text-base font-display font-extrabold text-slate-900">Tele-Consultation Request</h2>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-normal">
                      The request for virtual consultation has been queued in the district clinical routing portal. The designated duty medical officer will call your device within the specified window.
                    </p>

                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-xs space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Request ID</span>
                          <span className="font-mono text-xs font-bold text-slate-800">{consultId}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Queue Priority</span>
                          <span className="text-xs font-extrabold text-purple-600 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                            Active (Queue Position #2)
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Specialty</span>
                          <span className="text-xs font-bold text-slate-700">{doctorSpecialty}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Estd. Callback</span>
                          <span className="text-xs font-bold text-slate-700">15-20 minutes</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/50 pt-3">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Triage Diagnostics Passed</span>
                        <p className="text-slate-600 font-medium mt-1 leading-relaxed">
                          Patient {defaultPatients.find(p => p.id === selectedVerifyPatientId)?.name} presented with symptoms and vital logs BP {verifyVitals.bpSystolic}/{verifyVitals.bpDiastolic}, Temp {verifyVitals.temperature} °F. Notes transmitted.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsRiskVerifying(false);
                        setActiveTab('home');
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer text-center"
                    >
                      Return to Dashboard Hub
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Core Risk Verification Hub */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Patient Profile & Clinical details column (Left) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Active Patient Selector */}
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-1">
                        Triage Patient Profile
                      </label>
                      <select
                        value={selectedVerifyPatientId}
                        onChange={(e) => startRiskVerification(e.target.value)}
                        className="bg-slate-50 border border-slate-150 focus:border-emerald-500 focus:ring-emerald-100 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none text-slate-800 w-full"
                      >
                        <option value="">-- Choose Patient --</option>
                        {defaultPatients.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (Age: {p.age}, {p.gender})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedVerifyPatientId ? (
                    (() => {
                      const patient = defaultPatients.find(p => p.id === selectedVerifyPatientId);
                      if (!patient) return null;
                      return (
                        <>
                          {/* Patient Summary Card */}
                          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-slate-50 to-transparent pointer-events-none" />
                            
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/50 text-slate-600 flex items-center justify-center font-display font-black text-lg shadow-inner">
                                {patient.name.charAt(0)}
                              </div>
                              <div className="space-y-1">
                                <h2 className="text-lg font-display font-bold text-slate-900 leading-tight">{patient.name}</h2>
                                <p className="text-xs text-slate-400 font-mono">ID: {patient.abhaId}</p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                    {patient.gender} • {patient.age} Yrs
                                  </span>
                                  <span className="bg-blue-50/70 border border-blue-100/50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {patient.village}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-xs font-medium">
                              <div>
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Contact Number</span>
                                <span className="text-slate-700 font-bold block pt-0.5">{patient.mobileNumber}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">ABHA Registered status</span>
                                <span className="text-emerald-600 font-bold block pt-0.5 flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  KYC Complete
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pregnancy Status Card (Conditional) */}
                          {patient.pregnant === 'Yes' && (
                            <div className="bg-rose-50/50 border border-rose-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/70 rounded-full blur-xl pointer-events-none" />
                              <div className="flex items-center gap-2.5">
                                <span className="p-1 rounded-lg bg-rose-100 text-rose-600">
                                  <Sparkles className="w-4 h-4 animate-pulse" />
                                </span>
                                <h3 className="font-display font-extrabold text-rose-950 text-sm">Active Pregnancy Status</h3>
                              </div>
                              <div className="text-xs leading-relaxed font-semibold text-rose-800 space-y-1">
                                <p>Gestation Timeline: <strong className="text-rose-950 font-extrabold">{patient.pregnancyDetails || 'Weeks unspecified'}</strong></p>
                                <p className="text-rose-600/90 font-medium">Weekly pre-eclampsia screening, iron folic acid compliance audits, and fetal activity mapping are mandatory at this stage.</p>
                              </div>
                            </div>
                          )}

                          {/* Symptoms & Medical History */}
                          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-5">
                            <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <h3 className="font-display font-extrabold text-slate-900 text-sm">Symptoms & History</h3>
                            </div>

                            <div className="space-y-4 text-xs">
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Current Presentation Symptoms</span>
                                <div className="flex flex-wrap gap-2">
                                  {verifySymptoms.map((sym, i) => (
                                    <span key={i} className="bg-slate-100/80 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200/30">
                                      {sym}
                                    </span>
                                  ))}
                                  {verifySymptoms.length === 0 && (
                                    <span className="text-slate-400 italic">No diagnostic active symptoms reported.</span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3.5">
                                <div>
                                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Chronic Illness History</span>
                                  <span className="text-slate-700 font-bold block pt-0.5">{patient.chronicDiseases || 'None'}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Known Medical Allergies</span>
                                  <span className="text-rose-600 font-bold block pt-0.5">{patient.allergies || 'None'}</span>
                                </div>
                              </div>

                              <div className="border-t border-slate-100 pt-3.5 space-y-1">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Clinical Record Intake Notes</span>
                                <p className="text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                                  {patient.notes}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Editable Vitals Dashboard */}
                          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                              <div className="flex items-center gap-2.5">
                                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                                <h3 className="font-display font-extrabold text-slate-900 text-sm">Vitals Registry</h3>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 uppercase tracking-wider">
                                Interactive Fields
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-normal pl-1 mb-2">
                              Verify or adjust the client's current vitals below. Changes dynamically recalculate client clinical triage metrics immediately.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {/* BP Systolic */}
                              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 focus-within:ring-4 focus-within:ring-emerald-50 focus-within:bg-white focus-within:border-emerald-300 transition-all">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">BP Systolic (mmHg)</label>
                                <input
                                  type="text"
                                  value={verifyVitals.bpSystolic}
                                  onChange={(e) => setVerifyVitals({ ...verifyVitals, bpSystolic: e.target.value.replace(/\D/g, '') })}
                                  className="w-full bg-transparent border-none text-base font-display font-extrabold text-slate-800 focus:outline-none p-0"
                                />
                              </div>

                              {/* BP Diastolic */}
                              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 focus-within:ring-4 focus-within:ring-emerald-50 focus-within:bg-white focus-within:border-emerald-300 transition-all">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">BP Diastolic (mmHg)</label>
                                <input
                                  type="text"
                                  value={verifyVitals.bpDiastolic}
                                  onChange={(e) => setVerifyVitals({ ...verifyVitals, bpDiastolic: e.target.value.replace(/\D/g, '') })}
                                  className="w-full bg-transparent border-none text-base font-display font-extrabold text-slate-800 focus:outline-none p-0"
                                />
                              </div>

                              {/* Pulse Rate */}
                              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 focus-within:ring-4 focus-within:ring-emerald-50 focus-within:bg-white focus-within:border-emerald-300 transition-all">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">Pulse Rate (bpm)</label>
                                <input
                                  type="text"
                                  value={verifyVitals.pulse}
                                  onChange={(e) => setVerifyVitals({ ...verifyVitals, pulse: e.target.value.replace(/\D/g, '') })}
                                  className="w-full bg-transparent border-none text-base font-display font-extrabold text-slate-800 focus:outline-none p-0"
                                />
                              </div>

                              {/* Temperature */}
                              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 focus-within:ring-4 focus-within:ring-emerald-50 focus-within:bg-white focus-within:border-emerald-300 transition-all">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">Temperature (°F)</label>
                                <input
                                  type="text"
                                  value={verifyVitals.temperature}
                                  onChange={(e) => setVerifyVitals({ ...verifyVitals, temperature: e.target.value })}
                                  className="w-full bg-transparent border-none text-base font-display font-extrabold text-slate-800 focus:outline-none p-0"
                                />
                              </div>

                              {/* Blood Sugar */}
                              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 focus-within:ring-4 focus-within:ring-emerald-50 focus-within:bg-white focus-within:border-emerald-300 transition-all">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">Blood Sugar (mg/dL)</label>
                                <input
                                  type="text"
                                  value={verifyVitals.bloodSugar}
                                  onChange={(e) => setVerifyVitals({ ...verifyVitals, bloodSugar: e.target.value.replace(/\D/g, '') })}
                                  className="w-full bg-transparent border-none text-base font-display font-extrabold text-slate-800 focus:outline-none p-0"
                                />
                              </div>

                              {/* Weight */}
                              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 focus-within:ring-4 focus-within:ring-emerald-50 focus-within:bg-white focus-within:border-emerald-300 transition-all">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</label>
                                <input
                                  type="text"
                                  value={verifyVitals.weight}
                                  onChange={(e) => setVerifyVitals({ ...verifyVitals, weight: e.target.value })}
                                  className="w-full bg-transparent border-none text-base font-display font-extrabold text-slate-800 focus:outline-none p-0"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                      <Users className="w-12 h-12 text-slate-300 mb-3" />
                      <h3 className="font-display font-bold text-slate-700 text-sm">No Patient Selected</h3>
                      <p className="text-xs text-slate-400 max-w-xs mt-1 leading-normal">
                        Choose a patient profile from the triage dropdown above to inspect baseline data, check indicators, and run risk assessment.
                      </p>
                    </div>
                  )}
                </div>

                {/* Risk Checklist, Badge, & Action buttons column (Right) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {selectedVerifyPatientId && (
                    <>
                      {/* Risk Triage Level Card */}
                      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-slate-50 to-transparent pointer-events-none" />
                        
                        <div className="space-y-1 pb-3 border-b border-slate-50">
                          <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Triage Clinical Evaluation</label>
                          <h3 className="font-display font-extrabold text-slate-950 text-sm">Calculated Risk Score</h3>
                        </div>

                        {/* HIGH / MEDIUM / LOW Badge Container */}
                        <div className="flex flex-col items-center justify-center py-6 px-4 rounded-3xl border text-center transition-all">
                          {currentRisk.level === 'HIGH' && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl p-6 w-full space-y-3 shadow-xs">
                              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto animate-ping-slow">
                                <AlertTriangle className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase font-bold text-rose-500 tracking-wider">Triage Grade</span>
                                <h4 className="text-2xl font-display font-black tracking-tight text-rose-900">HIGH RISK</h4>
                                <p className="text-[10.5px] font-medium text-rose-700 max-w-xs mx-auto leading-normal">
                                  Patient has life-threatening clinical signals. Immediate referral to community health center or PHC emergency response recommended.
                                </p>
                              </div>
                            </div>
                          )}

                          {currentRisk.level === 'MEDIUM' && (
                            <div className="bg-amber-50/75 border border-amber-200 text-amber-800 rounded-3xl p-6 w-full space-y-3 shadow-xs">
                              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-pulse">
                                <AlertTriangle className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase font-bold text-amber-500 tracking-wider">Triage Grade</span>
                                <h4 className="text-2xl font-display font-black tracking-tight text-amber-900">MEDIUM RISK</h4>
                                <p className="text-[10.5px] font-medium text-amber-700 max-w-xs mx-auto leading-normal">
                                  Active alerts detected. Request doctor telehealth review and schedule follow-up outreach audit within 48 hours.
                                </p>
                              </div>
                            </div>
                          )}

                          {currentRisk.level === 'LOW' && (
                            <div className="bg-emerald-50/75 border border-emerald-200 text-emerald-800 rounded-3xl p-6 w-full space-y-3 shadow-xs">
                              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase font-bold text-emerald-500 tracking-wider">Triage Grade</span>
                                <h4 className="text-2xl font-display font-black tracking-tight text-emerald-900 font-extrabold">LOW RISK</h4>
                                <p className="text-[10.5px] font-medium text-emerald-700 max-w-xs mx-auto leading-normal">
                                  Patient vitals stable. No immediate danger signs detected. Log as normal and follow routine maternal/general care guidelines.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Risk Checklist */}
                      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-5">
                        <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
                          <CheckCircle className="w-4 h-4 text-slate-400" />
                          <h3 className="font-display font-extrabold text-slate-900 text-sm">Danger Signs Checklist</h3>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-normal pl-1 mb-2">
                          Audit and check any active danger signs observed during triage or reported by the patient.
                        </p>

                        <div className="space-y-3">
                          {[
                            { key: 'highFever', label: 'High Fever', desc: 'Oral temperature >= 101°F with chills' },
                            { key: 'breathingDifficulty', label: 'Breathing Difficulty', desc: 'Shortness of breath / rapid respiration' },
                            { key: 'chestPain', label: 'Chest Pain', desc: 'Sudden tight crushing pain / discomfort' },
                            { key: 'severeHeadache', label: 'Severe Headache', desc: 'Intense persistent migraine or headache' },
                            { key: 'swelling', label: 'Swelling', desc: 'Rapid swelling of face, feet, or hands' },
                            { key: 'bleeding', label: 'Bleeding', desc: 'Any unusual active vaginal bleeding or discharge' },
                            { key: 'dehydration', label: 'Dehydration', desc: 'Extreme thirst, dry mouth, or dark urine' },
                          ].map(({ key, label, desc }) => {
                            const isChecked = riskChecklist[key as keyof typeof riskChecklist];
                            return (
                              <label
                                key={key}
                                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                                  isChecked
                                    ? 'bg-rose-50/30 border-rose-200/80 shadow-xs'
                                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => setRiskChecklist({
                                    ...riskChecklist,
                                    [key]: !isChecked
                                  })}
                                  className="mt-1 h-4 w-4 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                />
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-800 block leading-tight">{label}</span>
                                  <span className="text-[10px] text-slate-400 font-medium block leading-normal">{desc}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Triggers Forms / Menus */}
                      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <h3 className="font-display font-extrabold text-slate-900 text-sm">Dispositions & Actions</h3>
                        </div>

                        {/* Standard Buttons */}
                        <div className="space-y-3.5">
                          {/* MARK AS NORMAL BUTTON */}
                          <button
                            type="button"
                            onClick={handleMarkNormal}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>Mark as Normal / Stable</span>
                          </button>

                          {/* PHC REFERRAL EXPANDABLE TRIGGER */}
                          <div className="border border-slate-150 rounded-2xl p-4 space-y-4 bg-slate-50/50">
                            <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 pl-0.5">
                              <MapPin className="w-4 h-4 text-orange-500" />
                              PHC Referral Routing
                            </h4>
                            
                            <div className="space-y-3 text-xs">
                              <div className="space-y-1">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-0.5">Primary Health Centre</label>
                                <select
                                  value={phcSelection}
                                  onChange={(e) => setPhcSelection(e.target.value)}
                                  className="w-full bg-white border border-slate-150 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                                >
                                  <option value="Datia District PHC">Datia District Primary Health Centre</option>
                                  <option value="Sonagir Community Health Center">Sonagir Community Health Center</option>
                                  <option value="Gwalior Civil Hospital">Gwalior Civil Hospital (Emergency Ward)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-0.5">Referral Urgency</label>
                                <div className="flex gap-2 font-bold">
                                  {['Routine', 'Urgent', 'Emergency'].map((urg) => (
                                    <button
                                      type="button"
                                      key={urg}
                                      onClick={() => setPhcUrgency(urg as any)}
                                      className={`flex-1 py-1.5 rounded-lg text-[9px] text-center border cursor-pointer transition-all ${
                                        phcUrgency === urg
                                          ? urg === 'Emergency'
                                            ? 'bg-rose-50 border-rose-500 text-rose-700'
                                            : urg === 'Urgent'
                                              ? 'bg-amber-50 border-amber-500 text-amber-700'
                                              : 'bg-slate-800 border-slate-800 text-white'
                                          : 'bg-white hover:bg-slate-100 border-slate-150 text-slate-500'
                                      }`}
                                    >
                                      {urg}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-0.5">Referral Clinical Notes</label>
                                <textarea
                                  placeholder="Provide clinical reasons, vitals context, and instructions given to patient..."
                                  value={doctorRequestNotes}
                                  onChange={(e) => setDoctorRequestNotes(e.target.value)}
                                  rows={2}
                                  className="w-full bg-white border border-slate-150 rounded-xl px-3 py-2 text-xs font-medium outline-none resize-none"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={handleReferPHC}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Compile & Refer to PHC</span>
                              </button>
                            </div>
                          </div>

                          {/* DOCTOR TELECONSULTATION TRIGGER */}
                          <div className="border border-slate-150 rounded-2xl p-4 space-y-4 bg-slate-50/50">
                            <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 pl-0.5">
                              <Bell className="w-4 h-4 text-purple-500" />
                              Virtual Doctor Consult
                            </h4>

                            <div className="space-y-3 text-xs">
                              <div className="space-y-1">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-0.5">Requested Specialty</label>
                                <select
                                  value={doctorSpecialty}
                                  onChange={(e) => setDoctorSpecialty(e.target.value)}
                                  className="w-full bg-white border border-slate-150 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                                >
                                  <option value="General Medicine">General Medicine Consultant</option>
                                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology (OB/GYN)</option>
                                  <option value="Pediatrics">Pediatrician / Child Care</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-0.5">Telemedicine Priority</label>
                                <div className="flex gap-2 font-bold">
                                  {['Standard', 'Urgent Call'].map((pri) => (
                                    <button
                                      type="button"
                                      key={pri}
                                      onClick={() => setDoctorUrgency(pri)}
                                      className={`flex-1 py-1.5 rounded-lg text-[9px] text-center border cursor-pointer transition-all ${
                                        doctorUrgency === pri
                                          ? pri === 'Urgent Call'
                                            ? 'bg-purple-50 border-purple-500 text-purple-700 animate-pulse'
                                            : 'bg-slate-800 border-slate-800 text-white'
                                          : 'bg-white hover:bg-slate-100 border-slate-150 text-slate-500'
                                      }`}
                                    >
                                      {pri}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleDoctorRequest}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Activity className="w-3.5 h-3.5 animate-pulse" />
                                <span>Request Doctor Telehealth Review</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ) : isHomeVisiting ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 animate-fade-in"
          >
            {/* Patient Home Visit Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 pb-5 gap-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsHomeVisiting(false);
                    setHomeVisitSuccess(false);
                    setHomeVisitFormErrors({});
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 shadow-xs cursor-pointer mb-2 w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 text-blue-605 animate-pulse" />
                  Record Home Visit
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Record patient metrics, vital statistics, and medication compliance during active community visits
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-100/60 border border-slate-200/40 px-3 py-2 rounded-xl h-fit">
                <Shield className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>MD3 Secure Intake</span>
              </div>
            </div>

            {homeVisitSuccess ? (
              /* Success View */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 max-w-2xl mx-auto text-center shadow-sm relative overflow-hidden space-y-8 animate-fade-in"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-50/40 rounded-full blur-2xl pointer-events-none" />
                
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-650 flex items-center justify-center border border-blue-100/60 shadow-inner">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-display font-extrabold text-slate-900">Home Visit Saved Successfully!</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal font-semibold">
                    The visit metrics have been safely entered into your local health register. Synchronisation will occur automatically when online.
                  </p>
                </div>

                {/* Detail Summary Card */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-inner">
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Patient Name</span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {defaultPatients.find(p => p.id === homeVisitData.patientId)?.name || 'Patient'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Visit Date & Time</span>
                    <span className="text-xs font-extrabold text-slate-800">{homeVisitData.visitDate} • {homeVisitData.visitTime}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Blood Pressure</span>
                    <span className="text-xs font-extrabold text-slate-800">{homeVisitData.bpSystolic}/{homeVisitData.bpDiastolic} mmHg</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Weight & Temp</span>
                    <span className="text-xs font-extrabold text-slate-800">{homeVisitData.weight} kg • {homeVisitData.temperature} °F</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Pulse & Blood Sugar</span>
                    <span className="text-xs font-extrabold text-slate-800">{homeVisitData.pulse} bpm • {homeVisitData.bloodSugar} mg/dL</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Medication Compliance</span>
                    <span className={`text-xs font-extrabold ${homeVisitData.medicationCompliance === 'Yes' ? 'text-emerald-650' : 'text-rose-600'}`}>
                      {homeVisitData.medicationCompliance}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Next Planned Visit</span>
                    <span className="text-xs font-extrabold text-slate-800">{homeVisitData.nextVisitDate}</span>
                  </div>
                  {homeVisitData.notes && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Clinical Notes</span>
                      <p className="text-xs text-slate-600 italic bg-white p-2.5 border border-slate-100 rounded-xl leading-relaxed">
                        {homeVisitData.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setHomeVisitSuccess(false);
                      setHomeVisitData({
                        patientId: '',
                        visitDate: '',
                        visitTime: '',
                        bpSystolic: '',
                        bpDiastolic: '',
                        weight: '',
                        temperature: '',
                        pulse: '',
                        bloodSugar: '',
                        notes: '',
                        medicationCompliance: 'Yes',
                        nextVisitDate: ''
                      });
                      setHomeVisitFormErrors({});
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/10"
                  >
                    <HeartPulse className="w-4 h-4" />
                    <span>Log Another Visit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHomeVisiting(false);
                      setHomeVisitSuccess(false);
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Home Visit Form View */
              <form onSubmit={handleSaveHomeVisit} className="space-y-8 max-w-3xl mx-auto">
                
                {/* PATIENT & SCHEDULE SECTIONS */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-blue-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Patient & Schedule Details</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Clinical Identification & Timings</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Patient Selection */}
                    <div className="space-y-1.5 md:col-span-1" id="visit_patientId">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-505" />
                        <span>Select Patient <span className="text-rose-500">*</span></span>
                      </label>
                      <select
                        value={homeVisitData.patientId}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, patientId: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.patientId ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all cursor-pointer`}
                      >
                        <option value="">-- Select Patient --</option>
                        {defaultPatients.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.gender}, {p.age} yrs)
                          </option>
                        ))}
                      </select>
                      {homeVisitFormErrors.patientId && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.patientId}</span>
                        </p>
                      )}
                    </div>

                    {/* Visit Date */}
                    <div className="space-y-1.5" id="visit_visitDate">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-505" />
                        <span>Visit Date <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="date"
                        value={homeVisitData.visitDate}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, visitDate: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.visitDate ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all`}
                      />
                      {homeVisitFormErrors.visitDate && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.visitDate}</span>
                        </p>
                      )}
                    </div>

                    {/* Visit Time */}
                    <div className="space-y-1.5" id="visit_visitTime">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-505" />
                        <span>Visit Time <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="time"
                        value={homeVisitData.visitTime}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, visitTime: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.visitTime ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all`}
                      />
                      {homeVisitFormErrors.visitTime && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.visitTime}</span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* CLINICAL VITAL SIGNS SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-rose-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-650 flex items-center justify-center shadow-inner">
                      <HeartPulse className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Clinical Vital Signs</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Patient health metrics & physiological logs</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Blood Pressure Input */}
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 space-y-3 md:col-span-2">
                      <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>Blood Pressure (mmHg) <span className="text-rose-500">*</span></span>
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        <div id="visit_bpSystolic">
                          <label className="block text-[9px] text-slate-400 font-bold font-mono uppercase mb-1">Systolic (Upper)</label>
                          <input
                            type="number"
                            placeholder="e.g. 120"
                            value={homeVisitData.bpSystolic}
                            onChange={(e) => setHomeVisitData({ ...homeVisitData, bpSystolic: e.target.value })}
                            className={`w-full px-4 py-2.5 bg-white border ${
                              homeVisitFormErrors.bpSystolic ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                            } rounded-xl text-xs font-semibold outline-none transition-all`}
                          />
                          {homeVisitFormErrors.bpSystolic && (
                            <p className="text-[9px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{homeVisitFormErrors.bpSystolic}</span>
                            </p>
                          )}
                        </div>
                        <div id="visit_bpDiastolic">
                          <label className="block text-[9px] text-slate-400 font-bold font-mono uppercase mb-1">Diastolic (Lower)</label>
                          <input
                            type="number"
                            placeholder="e.g. 80"
                            value={homeVisitData.bpDiastolic}
                            onChange={(e) => setHomeVisitData({ ...homeVisitData, bpDiastolic: e.target.value })}
                            className={`w-full px-4 py-2.5 bg-white border ${
                              homeVisitFormErrors.bpDiastolic ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                            } rounded-xl text-xs font-semibold outline-none transition-all`}
                          />
                          {homeVisitFormErrors.bpDiastolic && (
                            <p className="text-[9px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{homeVisitFormErrors.bpDiastolic}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-1.5" id="visit_weight">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-blue-505" />
                        <span>Weight (kg) <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 62.5"
                        value={homeVisitData.weight}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, weight: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.weight ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all`}
                      />
                      {homeVisitFormErrors.weight && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.weight}</span>
                        </p>
                      )}
                    </div>

                    {/* Temperature */}
                    <div className="space-y-1.5" id="visit_temperature">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                        <span>Body Temperature (°F) <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 98.6"
                        value={homeVisitData.temperature}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, temperature: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.temperature ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all`}
                      />
                      {homeVisitFormErrors.temperature && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.temperature}</span>
                        </p>
                      )}
                    </div>

                    {/* Pulse Rate */}
                    <div className="space-y-1.5" id="visit_pulse">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-rose-505" />
                        <span>Pulse Rate (BPM) <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 72"
                        value={homeVisitData.pulse}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, pulse: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.pulse ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all`}
                      />
                      {homeVisitFormErrors.pulse && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.pulse}</span>
                        </p>
                      )}
                    </div>

                    {/* Blood Sugar */}
                    <div className="space-y-1.5" id="visit_bloodSugar">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5 text-red-500" />
                        <span>Blood Sugar (mg/dL) <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 110"
                        value={homeVisitData.bloodSugar}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, bloodSugar: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.bloodSugar ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all`}
                      />
                      {homeVisitFormErrors.bloodSugar && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.bloodSugar}</span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* COMPLIANCE & FOLLOW-UP PLAN SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-emerald-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                      <Pill className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Medication Compliance & Schedule</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Patient drug intake and future outreach</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Medication Compliance Option */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span>Medication Compliance <span className="text-rose-500">*</span></span>
                      </label>
                      <p className="text-slate-400 text-[11px] font-semibold leading-normal">
                        Is the patient taking prescribed medications regularly?
                      </p>
                      <div className="flex gap-2.5 max-w-xs pt-1">
                        {['No', 'Yes'].map((option) => {
                          const isSelected = homeVisitData.medicationCompliance === option;
                          return (
                            <button
                              type="button"
                              key={option}
                              onClick={() => setHomeVisitData({ ...homeVisitData, medicationCompliance: option as 'Yes' | 'No' })}
                              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? option === 'Yes'
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs ring-4 ring-emerald-500/5 font-extrabold'
                                    : 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs ring-4 ring-rose-500/5 font-extrabold'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Next Scheduled Visit Date */}
                    <div className="space-y-1.5" id="visit_nextVisitDate">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-505" />
                        <span>Next Scheduled Visit Date <span className="text-rose-500">*</span></span>
                      </label>
                      <input
                        type="date"
                        value={homeVisitData.nextVisitDate}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, nextVisitDate: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          homeVisitFormErrors.nextVisitDate ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all`}
                      />
                      {homeVisitFormErrors.nextVisitDate && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{homeVisitFormErrors.nextVisitDate}</span>
                        </p>
                      )}
                    </div>

                    {/* Notes & Observations */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-blue-505" />
                        <span>Notes & Observations <span className="text-slate-400 lowercase italic font-normal">(Optional)</span></span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter clinical observations, general advice, or specific health requests..."
                        value={homeVisitData.notes}
                        onChange={(e) => setHomeVisitData({ ...homeVisitData, notes: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-150 focus:border-blue-500 focus:ring-blue-100 focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 leading-normal resize-none"
                      />
                    </div>

                  </div>
                </div>

                {/* SAVE AND CANCEL BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/10 hover:shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Visit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHomeVisiting(false);
                      setHomeVisitSuccess(false);
                      setHomeVisitFormErrors({});
                    }}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>

              </form>
            )}

            {/* HISTORICAL LEDGER FOR COMPLETED SESSIONS */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden mt-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-slate-100/40 to-transparent rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shadow-inner">
                    <ClipboardList className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-slate-900 text-sm">Outreach Log History</h2>
                    <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Historical records for this session</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl">
                  {homeVisitHistory.length} Registered Logs
                </span>
              </div>

              <div className="space-y-4">
                {homeVisitHistory.map((visit) => {
                  const isHighBP = (() => {
                    const parts = visit.bloodPressure.split('/');
                    if (parts.length === 2) {
                      const sys = parseInt(parts[0], 10);
                      const dia = parseInt(parts[1], 10);
                      return sys >= 140 || dia >= 90;
                    }
                    return false;
                  })();

                  const isHighSugar = parseInt(visit.bloodSugar, 10) >= 140;
                  const isFever = parseFloat(visit.temperature) >= 100.4;

                  return (
                    <div key={visit.id} className="border border-slate-100 hover:border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 hover:shadow-xs transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-display font-extrabold text-sm border border-blue-100/40">
                            {visit.patientName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-display font-extrabold text-slate-800 text-sm">{visit.patientName}</h3>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Visited: {visit.visitDate} @ {visit.visitTime}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {isHighBP && (
                            <span className="text-[8px] font-mono font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> High BP
                            </span>
                          )}
                          {isHighSugar && (
                            <span className="text-[8px] font-mono font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> High Sugar
                            </span>
                          )}
                          {isFever && (
                            <span className="text-[8px] font-mono font-bold bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Fever
                            </span>
                          )}
                          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                            visit.medicationCompliance === 'Yes' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            Compliance: {visit.medicationCompliance}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-[11px] font-mono font-bold text-slate-500 border-t border-slate-200/50">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">BP</span>
                          <span className="text-slate-800">{visit.bloodPressure} mmHg</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Weight</span>
                          <span className="text-slate-800">{visit.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Temp</span>
                          <span className="text-slate-800">{visit.temperature} °F</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Pulse</span>
                          <span className="text-slate-800">{visit.pulse} bpm</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Blood Sugar</span>
                          <span className="text-slate-800">{visit.bloodSugar} mg/dL</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 p-3 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Notes & Observations</span>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          {visit.notes}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold font-mono pt-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Next Scheduled outreach: <span className="text-purple-600 font-extrabold">{visit.nextVisitDate}</span></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        ) : isRegistering ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Patient Registration Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 pb-5 gap-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setRegistrationSuccess(false);
                    setFormErrors({});
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 shadow-xs cursor-pointer mb-2 w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-emerald-600" />
                  Patient Registration
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Register a new community member in the outreach health network
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-100/60 border border-slate-200/40 px-3 py-2 rounded-xl h-fit">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secure Local Intake</span>
              </div>
            </div>

            {registrationSuccess ? (
              /* Success View */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 max-w-2xl mx-auto text-center shadow-sm relative overflow-hidden space-y-8"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-50/40 rounded-full blur-2xl pointer-events-none" />
                
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center border border-emerald-100/60 shadow-inner">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-display font-extrabold text-slate-900">Patient Registered Successfully!</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                    Intake record successfully created and validated for local registry. Real-time synchronisation is currently simulated.
                  </p>
                </div>

                {/* Detail Summary Card */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-inner">
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Full Name</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Age & Gender</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.age} Years • {formData.gender}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mobile Number</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.mobileNumber}</span>
                  </div>
                  {formData.abhaId && (
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ABHA ID</span>
                      <span className="text-xs font-mono font-bold text-slate-800">{formData.abhaId}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Location</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.village}, {formData.gramPanchayat}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Pregnant</span>
                    <span className={`text-xs font-extrabold ${formData.pregnant === 'Yes' ? 'text-rose-600' : 'text-slate-600'}`}>
                      {formData.pregnant}
                    </span>
                  </div>
                  {formData.chronicDiseases && (
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Chronic Diseases</span>
                      <span className="text-xs font-extrabold text-slate-800 truncate max-w-[200px]">{formData.chronicDiseases}</span>
                    </div>
                  )}
                  {formData.allergies && (
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Allergies</span>
                      <span className="text-xs font-extrabold text-slate-800 truncate max-w-[200px]">{formData.allergies}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Emergency Contact</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.emergencyContact}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationSuccess(false);
                      setFormData({
                        fullName: '',
                        age: '',
                        gender: '',
                        mobileNumber: '',
                        abhaId: '',
                        village: '',
                        gramPanchayat: '',
                        district: '',
                        state: '',
                        pinCode: '',
                        pregnant: 'No',
                        chronicDiseases: '',
                        allergies: '',
                        emergencyContact: ''
                      });
                      setFormErrors({});
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/10"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register Another</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setRegistrationSuccess(false);
                      setActiveTab('patients');
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Users className="w-4 h-4" />
                    <span>Go to Register</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Registration Form View */
              <form onSubmit={handleSave} className="space-y-8 max-w-3xl mx-auto">
                
                {/* PERSONAL DETAILS SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-blue-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Personal Details</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Demographic Information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5" id="fullName">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Laxmi Bai"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.fullName ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5" id="age">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Age <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="125"
                        placeholder="e.g. 28"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.age ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.age && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.age}</span>
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5 md:col-span-2" id="gender">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2.5">
                        {['Female', 'Male', 'Other'].map((g) => {
                          const isSelected = formData.gender === g;
                          return (
                            <button
                              type="button"
                              key={g}
                              onClick={() => setFormData({ ...formData, gender: g })}
                              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-4 ring-blue-500/5 font-extrabold'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              {g}
                            </button>
                          );
                        })}
                      </div>
                      {formErrors.gender && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.gender}</span>
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5" id="mobileNumber">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-mono font-extrabold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${
                            formErrors.mobileNumber ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                          } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                        />
                      </div>
                      {formErrors.mobileNumber && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.mobileNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* ABHA ID (Optional) */}
                    <div className="space-y-1.5" id="abhaId">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>ABHA ID <span className="text-slate-400 lowercase italic font-normal">(Optional)</span></span>
                        <span className="text-[8px] tracking-normal text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-mono">
                          <Sparkles className="w-2.5 h-2.5" />
                          ABHA Card ID
                        </span>
                      </label>
                      <input
                        type="text"
                        maxLength={17}
                        placeholder="XX-XXXX-XXXX-XXXX"
                        value={formData.abhaId}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
                          if (val.length > 2 && val.length <= 6) {
                            val = `${val.slice(0, 2)}-${val.slice(2)}`;
                          } else if (val.length > 6 && val.length <= 10) {
                            val = `${val.slice(0, 2)}-${val.slice(2, 6)}-${val.slice(6)}`;
                          } else if (val.length > 10) {
                            val = `${val.slice(0, 2)}-${val.slice(2, 6)}-${val.slice(6, 10)}-${val.slice(10, 14)}`;
                          }
                          setFormData({ ...formData, abhaId: val });
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-150 focus:border-emerald-500 focus:ring-emerald-100 focus:bg-white focus:ring-4 rounded-xl text-xs font-mono font-semibold outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                  </div>
                </div>

                {/* ADDRESS SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-teal-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Residential Address</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Locality details within Outpost</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Village */}
                    <div className="space-y-1.5" id="village">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Village <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sonagir"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.village ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.village && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.village}</span>
                        </p>
                      )}
                    </div>

                    {/* Gram Panchayat */}
                    <div className="space-y-1.5" id="gramPanchayat">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Gram Panchayat <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sonagir G.P."
                        value={formData.gramPanchayat}
                        onChange={(e) => setFormData({ ...formData, gramPanchayat: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.gramPanchayat ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.gramPanchayat && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.gramPanchayat}</span>
                        </p>
                      )}
                    </div>

                    {/* District */}
                    <div className="space-y-1.5" id="district">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        District <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Datia"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.district ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.district && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.district}</span>
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5" id="state">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Madhya Pradesh"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.state ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.state && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.state}</span>
                        </p>
                      )}
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1.5" id="pinCode">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        PIN Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit PIN code"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.pinCode ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.pinCode && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.pinCode}</span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* HEALTH DETAILS SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-rose-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Health Details</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Clinical risks and indicators</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Pregnant Yes / No */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Is the patient currently pregnant? <span className="text-rose-500">*</span></span>
                        {formData.pregnant === 'Yes' && (
                          <span className="text-[8px] tracking-normal text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded animate-pulse">
                            Antenatal Care Needed
                          </span>
                        )}
                      </label>
                      <div className="flex gap-2.5 max-w-xs">
                        {['No', 'Yes'].map((p) => {
                          const isSelected = formData.pregnant === p;
                          return (
                            <button
                              type="button"
                              key={p}
                              onClick={() => setFormData({ ...formData, pregnant: p as 'Yes' | 'No' })}
                              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? p === 'Yes'
                                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs ring-4 ring-rose-500/5 font-extrabold'
                                    : 'bg-slate-800 border-slate-800 text-white shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chronic Diseases */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Chronic Diseases <span className="text-slate-400 lowercase italic font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hypertension, Diabetes, Thyroid"
                        value={formData.chronicDiseases}
                        onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-150 focus:border-emerald-500 focus:ring-emerald-100 focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Allergies */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Allergies <span className="text-slate-400 lowercase italic font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-150 focus:border-emerald-500 focus:ring-emerald-100 focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-1.5 md:col-span-2" id="emergencyContact">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Emergency Contact Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-mono font-extrabold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit emergency phone number"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value.replace(/\D/g, '') })}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${
                            formErrors.emergencyContact ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                          } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                        />
                      </div>
                      {formErrors.emergencyContact && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.emergencyContact}</span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* BUTTONS: SAVE & CANCEL */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/10 hover:shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Registration</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setRegistrationSuccess(false);
                      setFormErrors({});
                    }}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>

              </form>
            )}
          </motion.div>
        ) : (
          /* Normal Dashboard Views */
          <>
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
                    {/* Visit 1: Meera Devi */}
                    <div className="bg-slate-50/60 border border-slate-100/50 hover:border-emerald-100 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                            Visit 1 • 09:30 AM
                          </span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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
                      
                      <button
                        onClick={() => {
                          setHomeVisitData({
                            patientId: '1', // Meera Devi ID
                            visitDate: new Date().toISOString().split('T')[0],
                            visitTime: '09:30',
                            bpSystolic: '',
                            bpDiastolic: '',
                            weight: '',
                            temperature: '',
                            pulse: '',
                            bloodSugar: '',
                            notes: '',
                            medicationCompliance: 'Yes',
                            nextVisitDate: ''
                          });
                          setIsHomeVisiting(true);
                          setHomeVisitSuccess(false);
                          setHomeVisitFormErrors({});
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Log Home Visit</span>
                      </button>
                    </div>

                    {/* Visit 2: Rajesh Kumar */}
                    <div className="bg-slate-50/60 border border-slate-100/50 hover:border-amber-100 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
                      <div className="space-y-3">
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

                      <button
                        onClick={() => {
                          setHomeVisitData({
                            patientId: '2', // Rajesh Kumar ID
                            visitDate: new Date().toISOString().split('T')[0],
                            visitTime: '11:45',
                            bpSystolic: '',
                            bpDiastolic: '',
                            weight: '',
                            temperature: '',
                            pulse: '',
                            bloodSugar: '',
                            notes: '',
                            medicationCompliance: 'Yes',
                            nextVisitDate: ''
                          });
                          setIsHomeVisiting(true);
                          setHomeVisitSuccess(false);
                          setHomeVisitFormErrors({});
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Log Home Visit</span>
                      </button>
                    </div>

                    {/* Visit 3: Sita Devi */}
                    <div className="bg-slate-50/60 border border-slate-100/50 hover:border-emerald-100 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
                      <div className="space-y-3">
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

                      <button
                        onClick={() => {
                          setHomeVisitData({
                            patientId: '3', // Sita Devi ID
                            visitDate: new Date().toISOString().split('T')[0],
                            visitTime: '14:00',
                            bpSystolic: '',
                            bpDiastolic: '',
                            weight: '',
                            temperature: '',
                            pulse: '',
                            bloodSugar: '',
                            notes: '',
                            medicationCompliance: 'Yes',
                            nextVisitDate: ''
                          });
                          setIsHomeVisiting(true);
                          setHomeVisitSuccess(false);
                          setHomeVisitFormErrors({});
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Log Home Visit</span>
                      </button>
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
                      onClick={() => {
                        setIsRegistering(true);
                        setRegistrationSuccess(false);
                        setFormErrors({});
                        setFormData({
                          fullName: '',
                          age: '',
                          gender: '',
                          mobileNumber: '',
                          abhaId: '',
                          village: '',
                          gramPanchayat: '',
                          district: '',
                          state: '',
                          pinCode: '',
                          pregnant: 'No',
                          chronicDiseases: '',
                          allergies: '',
                          emergencyContact: ''
                        });
                      }}
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
                      onClick={() => {
                        setHomeVisitData({
                          patientId: '',
                          visitDate: new Date().toISOString().split('T')[0],
                          visitTime: new Date().toTimeString().slice(0, 5),
                          bpSystolic: '',
                          bpDiastolic: '',
                          weight: '',
                          temperature: '',
                          pulse: '',
                          bloodSugar: '',
                          notes: '',
                          medicationCompliance: 'Yes',
                          nextVisitDate: ''
                        });
                        setIsHomeVisiting(true);
                        setHomeVisitSuccess(false);
                        setHomeVisitFormErrors({});
                      }}
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
                      onClick={() => {
                        setActiveTab('risk');
                        startRiskVerification('2'); // Preloads high-risk Rajesh Kumar
                      }}
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
                      onClick={() => {
                        setActiveTab('risk');
                        startRiskVerification('1'); // Preloads Meera Devi for maternal audit
                      }}
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

                {/* Today's Tasks (Active Clinical Triage Queue) */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                    Today's Tasks
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Task 1: Rajesh Kumar */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:border-rose-100 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg">
                            Urgent Risk Triage
                          </span>
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-slate-800 text-sm">Verify Rajesh Kumar</h3>
                          <p className="text-xs text-slate-400 mt-1 leading-normal font-medium">
                            Clinical follow-up for wound redness and fever peaks (101°F) reported during recent outpatient logging.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Sector 3 Outpost</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('risk');
                          startRiskVerification('2'); // Preloads Rajesh Kumar
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Assess & Verify Risk</span>
                      </button>
                    </div>

                    {/* Task 2: Meera Devi */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:border-amber-100 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg">
                            Routine Maternal Audit
                          </span>
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-slate-800 text-sm">Verify Meera Devi</h3>
                          <p className="text-xs text-slate-400 mt-1 leading-normal font-medium">
                            Bi-weekly antenatal care risk compliance verification and pre-eclampsia screening protocol.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Sector 2 Family Hub</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('risk');
                          startRiskVerification('1'); // Preloads Meera Devi
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Assess & Verify Risk</span>
                      </button>
                    </div>
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
                {/* Active Search Input bar */}
                <div className="flex items-center gap-4 bg-white border border-slate-100 px-4 py-3 rounded-2xl shadow-xs">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search registered patients by name, village, or ABHA ID..."
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-xs outline-none w-full text-slate-750 font-semibold"
                  />
                  {patientSearchTerm && (
                    <button onClick={() => setPatientSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Patient Directory Grid */}
                {(() => {
                  const filtered = defaultPatients.filter(p => 
                    p.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
                    p.village.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
                    p.abhaId.toLowerCase().includes(patientSearchTerm.toLowerCase())
                  );

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[220px]">
                        <Search className="w-10 h-10 text-slate-300 mb-2" />
                        <h3 className="font-display font-bold text-slate-750 text-xs">No matching patient records</h3>
                        <p className="text-[11px] text-slate-400 mt-1">Try searching with a different name, district, or health ID.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-slate-750">
                      {filtered.map(patient => (
                        <div key={patient.id} className="bg-white border border-slate-100 hover:border-emerald-100 rounded-[1.5rem] p-5 shadow-xs flex flex-col justify-between gap-4 transition-all group">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                {patient.abhaId}
                              </span>
                              {patient.pregnant === 'Yes' && (
                                <span className="text-[8px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded">
                                  Pregnant
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-display font-extrabold text-slate-850 text-sm group-hover:text-emerald-700 transition-colors">{patient.name}</h4>
                              <p className="text-xs text-slate-500">{patient.gender} • {patient.age} Yrs</p>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{patient.village}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 border-t border-slate-50 pt-3">
                            <button
                              onClick={() => {
                                setActiveTab('risk');
                                startRiskVerification(patient.id);
                              }}
                              className="flex-1 bg-slate-850 hover:bg-slate-900 text-white font-bold py-2 px-3 rounded-xl text-[10.5px] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                            >
                              <Shield className="w-3.5 h-3.5" />
                              <span>Verify Risk</span>
                            </button>
                            <button
                              onClick={() => {
                                setHomeVisitData({
                                  patientId: patient.id,
                                  visitDate: new Date().toISOString().split('T')[0],
                                  visitTime: new Date().toTimeString().slice(0, 5),
                                  bpSystolic: patient.vitals?.bpSystolic || '',
                                  bpDiastolic: patient.vitals?.bpDiastolic || '',
                                  weight: patient.vitals?.weight || '',
                                  temperature: patient.vitals?.temperature || '',
                                  pulse: patient.vitals?.pulse || '',
                                  bloodSugar: patient.vitals?.bloodSugar || '',
                                  notes: '',
                                  medicationCompliance: 'Yes',
                                  nextVisitDate: ''
                                });
                                setIsHomeVisiting(true);
                                setHomeVisitSuccess(false);
                                setHomeVisitFormErrors({});
                              }}
                              className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 text-emerald-700 font-bold py-2 px-3 rounded-xl text-[10.5px] transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Home Visit</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <div className="flex justify-center border-t border-slate-100 pt-6">
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setRegistrationSuccess(false);
                      setFormErrors({});
                      setFormData({
                        fullName: '',
                        age: '',
                        gender: '',
                        mobileNumber: '',
                        abhaId: '',
                        village: '',
                        gramPanchayat: '',
                        district: '',
                        state: '',
                        pinCode: '',
                        pregnant: 'No',
                        chronicDiseases: '',
                        allergies: '',
                        emergencyContact: ''
                      });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 hover:shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register New Patient</span>
                  </button>
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
          </>
        )}
      </main>
    </div>
  );
}
