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
  AlertCircle,
  File,
  Image,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2 as Share,
  Save
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { analyzeSymptoms } from '../../services/geminiService';
import type { SymptomAnalysisResponse } from '../../types';
import { generateNextReportId, savePatientReport } from '../../services/reportService';

interface CitizenDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function CitizenDashboard({ onBackToRoles, onLogout }: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'reports' | 'profile'>('home');
  const [reportedSymptom, setReportedSymptom] = useState(false);
  
  // Symptom Report state variables
  const [isReportingSymptoms, setIsReportingSymptoms] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [bodyArea, setBodyArea] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [errors, setErrors] = useState<{ symptoms?: string; duration?: string; severity?: string }>({});
  // Pre-populate with high quality sample reports representing citizen submissions
  const [submissions, setSubmissions] = useState<any[]>([
    {
      id: 'RP-8120',
      symptoms: 'Severe migraine headache with acute nausea and extreme sensitivity to light. Pain is throbbing and focused on the left temple area.',
      duration: '1–3 Days',
      severity: 'High',
      bodyArea: 'Head / Mind',
      additionalNotes: 'Have a history of seasonal migraines but this is significantly more severe. Regular painkillers are not helping.',
      date: 'Jul 4, 2026',
      time: '09:45 AM',
      status: 'Reviewed',
      doctorNotes: 'Patient describes acute unilateral throbbing headache consistent with severe migraine with aura. Administered local clinical pain alleviation guidelines. Suggested keeping a dark-room rest schedule and monitoring blood pressure. ASHA worker to follow up in 24 hours.',
      patientSummary: 'Male, 29 Years • Sector 3 Rural Outpost',
      documents: [
        { name: 'Asha_Initial_Vitals_Log.pdf', type: 'application/pdf', size: '1.2 MB', date: 'Jul 4, 2026' }
      ],
      timeline: [
        { label: 'Symptom Report Submitted', date: 'Jul 4, 2026', time: '09:45 AM', active: true, desc: 'Citizen registered acute symptoms' },
        { label: 'Assigned to Community Health Worker', date: 'Jul 4, 2026', time: '10:15 AM', active: true, desc: 'ASHA worker dispatched for vitals verification' },
        { label: 'Reviewed by District Medical Officer', date: 'Jul 4, 2026', time: '02:30 PM', active: true, desc: 'Dr. Anita Roy approved standard migraine care protocol' }
      ]
    },
    {
      id: 'RP-7901',
      symptoms: 'Persistent dry cough with mild chest tightness and low-grade fever in the evenings.',
      duration: '1 Week',
      severity: 'Medium',
      bodyArea: 'Chest / Respiratory',
      additionalNotes: 'No known allergies. Cough is worse at night when lying down.',
      date: 'Jun 28, 2026',
      time: '04:15 PM',
      status: 'Completed',
      doctorNotes: 'Mild broncho-spasm suspected. Standard allergy relief and bronchodilator prescription shared. Patient reports full symptom resolution upon follow-up.',
      patientSummary: 'Male, 29 Years • Sector 3 Rural Outpost',
      documents: [
        { name: 'Prescription_Jun28.png', type: 'image/png', size: '2.4 MB', date: 'Jun 28, 2026' }
      ],
      timeline: [
        { label: 'Symptom Report Submitted', date: 'Jun 28, 2026', time: '04:15 PM', active: true, desc: 'Dry cough symptoms registered' },
        { label: 'ASHA Home Consultation Scheduled', date: 'Jun 29, 2026', time: '10:00 AM', active: true, desc: 'ASHA worker completed clinical vitals collection' },
        { label: 'Care Plan Completed', date: 'Jun 30, 2026', time: '05:00 PM', active: true, desc: 'Full recovery reported by patient' }
      ]
    },
    {
      id: 'RP-6542',
      symptoms: 'Slight skin irritation, redness and itching around the forearm area after agricultural farm work.',
      duration: 'Today',
      severity: 'Low',
      bodyArea: 'Skin / External',
      additionalNotes: 'No previous skin allergies. May have touched wild grass.',
      date: 'May 15, 2026',
      time: '11:20 AM',
      status: 'Completed',
      doctorNotes: 'Contact dermatitis suspected. Prescribed topical soothing calamine lotion. Recommended avoiding direct exposure to field grass without protective sleeves.',
      patientSummary: 'Male, 29 Years • Sector 3 Rural Outpost',
      documents: [],
      timeline: [
        { label: 'Symptom Report Submitted', date: 'May 15, 2026', time: '11:20 AM', active: true, desc: 'Skin irritation logged' },
        { label: 'Prescription Issued', date: 'May 15, 2026', time: '12:30 PM', active: true, desc: 'District clinic issued dermatitis care lotion' }
      ]
    }
  ]);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Gemini AI Symptom Triage Integration States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<SymptomAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showReportPage, setShowReportPage] = useState(false);

  // Firestore Save Report States
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedReportInfo, setSavedReportInfo] = useState<{ reportId: string; submissionTime: string; status: string } | null>(null);

  const handleSaveReport = async () => {
    if (!aiReport) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      // Step 1: Generate a unique sequential Report ID
      const nextReportId = await generateNextReportId();
      const patientId = auth.currentUser?.uid || 'guest-patient';

      // Construct file/document payload if file exists
      const docPayload = selectedFile ? [{
        name: selectedFile.name,
        type: selectedFile.type || 'Document',
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }] : [];

      const reportPayload = {
        reportId: nextReportId,
        patientId,
        patientInformation: {
          fullName: "Harsh Parit",
          age: 29,
          gender: "Male",
          village: "Sector 3",
          district: "Rural Outpost"
        },
        medicalHistory: {
          chronicDiseases: [],
          medications: [],
          allergies: []
        },
        symptoms,
        uploadedDocuments: docPayload,
        geminiAnalysis: aiReport,
        riskLevel: aiReport.riskLevel,
        confidence: aiReport.confidence,
        recommendedAction: aiReport.recommendedAction,
        doctorSummary: aiReport.doctorSummary,
        medicalDisclaimer: aiReport.medicalDisclaimer,
        status: 'Pending Doctor Review' as const
      };

      // Step 2: Save the report inside Firestore under patientReports collection
      await savePatientReport(reportPayload);

      // Successfully saved! Let's update submissions to include this new saved report so they see it in their dashboard.
      const localRecord = {
        id: nextReportId,
        symptoms,
        duration,
        severity,
        bodyArea: bodyArea || 'General',
        additionalNotes: additionalNotes || 'None',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        doctorNotes: 'Awaiting clinical review from the community health team. An ASHA worker will verify your vitals shortly.',
        patientSummary: 'Male, 29 Years • Sector 3 Rural Outpost',
        documents: docPayload,
        timeline: [
          { label: 'Symptom Report Submitted', date: 'Today', time: 'Just now', active: true, desc: 'Citizen registered symptoms online' },
          { label: 'AI Symptom Triage Completed', date: 'Today', time: 'Just now', active: true, desc: 'Gemini AI generated clinical handoff report' },
          { label: 'Awaiting District Medical Officer Review', date: 'Pending', time: '', active: false, desc: 'Assigned to Sector 3 Medical Hub for validation' }
        ],
        aiReport
      };

      setSubmissions(prev => [localRecord, ...prev]);

      // Set saved info for displaying the success screen
      setSavedReportInfo({
        reportId: nextReportId,
        submissionTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Pending Doctor Review'
      });
    } catch (err: any) {
      console.error("Firestore Save Error:", err);
      setSaveError(err.message || "We encountered an issue saving your health assessment report. Please click 'Save Report' again.");
    } finally {
      setIsSaving(false);
    }
  };

  const runSymptomAnalysis = async () => {
    // Step 1: Validate all required fields
    const newErrors: { symptoms?: string; duration?: string; severity?: string } = {};
    if (!symptoms.trim()) {
      newErrors.symptoms = 'Symptoms description is required.';
    }
    if (!duration) {
      newErrors.duration = 'Please select the duration.';
    }
    if (!severity) {
      newErrors.severity = 'Please select a severity level.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiReport(null);

    try {
      // Step 2 & 3: Call analyzeSymptoms()
      const requestData = {
        patientInformation: {
          fullName: "Harsh Parit",
          age: 29,
          gender: "Male",
          village: "Sector 3",
          district: "Rural Outpost"
        },
        symptoms: [
          symptoms,
          `Duration: ${duration}`,
          bodyArea ? `Body Area: ${bodyArea}` : "",
          additionalNotes ? `Additional Notes: ${additionalNotes}` : ""
        ].filter(Boolean),
        medicalHistory: {
          chronicDiseases: [],
          medications: [],
          allergies: []
        }
      };

      const result = await analyzeSymptoms(requestData);
      
      setAiReport(result);
      setShowReportPage(true);

      // Save to recent submissions so it's listed in the portal
      const newRecord = {
        id: `RP-${Math.floor(1000 + Math.random() * 9000)}`,
        symptoms,
        duration,
        severity,
        bodyArea: bodyArea || 'General',
        additionalNotes: additionalNotes || 'None',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Reviewed',
        doctorNotes: result.doctorSummary,
        patientSummary: 'Male, 29 Years • Sector 3 Rural Outpost',
        documents: selectedFile ? [{ name: selectedFile.name, type: selectedFile.type || 'Document', size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB', date: 'Today' }] : [],
        timeline: [
          { label: 'Symptom Report Submitted', date: 'Today', time: 'Just now', active: true, desc: 'Citizen registered symptoms online' },
          { label: 'AI Symptom Triage Completed', date: 'Today', time: 'Just now', active: true, desc: 'Gemini AI generated clinical handoff report' },
          { label: 'Awaiting District Medical Officer Review', date: 'Pending', time: '', active: false, desc: 'Assigned to Sector 3 Medical Hub for validation' }
        ],
        aiReport: result
      };

      setSubmissions(prev => [newRecord, ...prev]);
    } catch (err: any) {
      console.error("AI Analysis failed:", err);
      setAnalysisError(err.message || "We couldn't analyze your symptoms right now.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Search, filter, and selected report views
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<'Newest' | 'Oldest' | 'High' | 'Medium' | 'Low'>('Newest');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Document Upload state variables
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    const isValidType = validTypes.includes(file.type) || validExtensions.includes(fileExtension);
    if (!isValidType) {
      setUploadError('Unsupported file format. Please upload JPG, PNG, or PDF.');
      return;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      setUploadError('File size exceeds the 10 MB limit (Max 10MB).');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { symptoms?: string; duration?: string; severity?: string } = {};
    if (!symptoms.trim()) {
      newErrors.symptoms = 'Symptoms description is required.';
    }
    if (!duration) {
      newErrors.duration = 'Please select the duration.';
    }
    if (!severity) {
      newErrors.severity = 'Please select a severity level.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    // Add custom local submission with full report fields
    const newRecord = {
      id: `RP-${Math.floor(1000 + Math.random() * 9000)}`,
      symptoms,
      duration,
      severity,
      bodyArea: bodyArea || 'General',
      additionalNotes: additionalNotes || 'None',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      doctorNotes: 'Awaiting clinical review from the community health team. An ASHA worker will verify your vitals shortly.',
      patientSummary: 'Male, 29 Years • Sector 3 Rural Outpost',
      documents: selectedFile ? [{ name: selectedFile.name, type: selectedFile.type || 'Document', size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB', date: 'Today' }] : [],
      timeline: [
        { label: 'Symptom Report Submitted', date: 'Today', time: 'Just now', active: true, desc: 'Citizen registered symptoms online' },
        { label: 'Awaiting Triage Allocation', date: 'Pending', time: '', active: false, desc: 'System is assigning an available community worker' }
      ]
    };

    setSubmissions([newRecord, ...submissions]);
    setShowSuccessScreen(true);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative soft glowing elements to make it beautiful */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-8 text-center space-y-8 relative z-10">
          {/* Animated Spinner with Progress Circle */}
          <div className="relative w-24 h-24 mx-auto">
            {/* Outer spinning dash-ring */}
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            {/* Pulsating heart / medical icon inside */}
            <div className="absolute inset-2 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
              Analyzing your health information...
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
              Our secure clinical triage engine is assessing your symptoms, estimating priority, and preparing a medical handoff report for your healthcare team.
            </p>
          </div>

          {/* Progress bar simulation for realistic visual pacing */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 12, ease: "easeInOut" }}
                className="bg-blue-600 h-full rounded-full"
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase animate-pulse">
              Clinical Assessment in Progress
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (analysisError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-50/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-8 text-center space-y-6 relative z-10">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-xs">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-display font-extrabold text-slate-950 tracking-tight">
              We couldn't analyze your symptoms right now.
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
              {analysisError}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left text-[11px] text-slate-400 font-mono">
            <span className="font-bold text-slate-500 block mb-1">SYSTEM REPORT LOG:</span>
            <span>Error Status: TRIAGE_API_FAIL | Connection Timeout or Key Configuration Mismatch</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={runSymptomAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAnalysisError(null);
                setIsReportingSymptoms(false);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 font-semibold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (savedReportInfo) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between pb-24 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-8 text-center space-y-8 relative z-10"
          >
            {/* Success Icon Animation */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                Health Report Successfully Submitted
              </h1>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Your symptom assessment and triage report have been securely saved and synchronized to the clinical Firestore database.
              </p>
            </div>

            {/* Structured Report Metadata Display */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-left text-xs font-semibold">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                <span className="text-slate-400">Report ID</span>
                <span className="font-mono text-slate-800 font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100/50">
                  {savedReportInfo.reportId}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                <span className="text-slate-400">Submission Time</span>
                <span className="text-slate-700 font-semibold">{savedReportInfo.submissionTime}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Current Status</span>
                <span className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                  {savedReportInfo.status}
                </span>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  // Return Home: reset states and go to home tab
                  setSavedReportInfo(null);
                  setShowReportPage(false);
                  setIsReportingSymptoms(false);
                  setSymptoms('');
                  setDuration('');
                  setSeverity('');
                  setBodyArea('');
                  setAdditionalNotes('');
                  setActiveTab('home');
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                <span>Return Home</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  // View My Reports: reset states and go to reports tab
                  setSavedReportInfo(null);
                  setShowReportPage(false);
                  setIsReportingSymptoms(false);
                  setSymptoms('');
                  setDuration('');
                  setSeverity('');
                  setBodyArea('');
                  setAdditionalNotes('');
                  setActiveTab('reports');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View My Reports</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showReportPage && aiReport) {
    const riskColor = aiReport.riskLevel === 'HIGH' 
      ? 'text-rose-700 bg-rose-50 border-rose-200' 
      : aiReport.riskLevel === 'MEDIUM' 
        ? 'text-amber-700 bg-amber-50 border-amber-200' 
        : 'text-emerald-700 bg-emerald-50 border-emerald-200';

    const riskBadge = aiReport.riskLevel === 'HIGH' ? 'bg-rose-500' : aiReport.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500';

    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between pb-24 relative overflow-hidden">
        {/* Background ambient decorative orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                setShowReportPage(false);
                setIsReportingSymptoms(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-100/80 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              AI CLINICAL REPORT
            </span>
          </div>
        </header>

        {/* Report Content */}
        <main className="max-w-2xl mx-auto w-full px-6 py-8 flex-1 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title & Introduction */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Activity className="w-3 h-3 animate-pulse" />
                Triage Assessment Complete
              </div>
              <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">
                Health Assessment Report
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-medium">
                This report represents an automated triage assessment prepared using generative artificial intelligence to guide physical consultation.
              </p>
            </div>

            {/* Core Card */}
            <div className="bg-white border border-slate-100 shadow-lg rounded-[2.5rem] p-6 sm:p-8 space-y-6">
              
              {/* Triage Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
                {/* Risk Level */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 flex flex-col justify-between space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Risk Level / Urgency</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${riskBadge} animate-pulse`} />
                    <span className={`px-2.5 py-1 text-xs font-bold font-mono uppercase tracking-wide rounded-md border ${riskColor}`}>
                      {aiReport.riskLevel} RISK
                    </span>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 flex flex-col justify-between space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Confidence Score</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{aiReport.confidence}%</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${aiReport.confidence}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Summary Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Patient Summary</h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 text-xs font-semibold text-slate-700 leading-relaxed">
                  {aiReport.patientSummary}
                </div>
              </div>

              {/* Detected Symptoms Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Detected Symptoms</h3>
                <div className="flex flex-wrap gap-1.5">
                  {aiReport.detectedSymptoms.map((symptom, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-50/50 text-blue-700 border border-blue-100/60 rounded-xl flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Possible Health Concerns Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Possible Health Concerns</h3>
                <div className="space-y-2">
                  {aiReport.possibleHealthConcerns.map((concern, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700 leading-relaxed"
                    >
                      <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{concern}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Steps Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Recommended Next Steps</h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 text-xs text-slate-700 leading-relaxed font-semibold">
                  {aiReport.recommendedAction}
                </div>
              </div>

              {/* Doctor Handoff Summary Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Doctor Handoff Summary (Clinical Synthesis)</h3>
                <div className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/40 text-xs text-slate-800 leading-relaxed font-semibold italic">
                  {aiReport.doctorSummary}
                </div>
              </div>

              {/* Medical Disclaimer Section */}
              <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-100/60 text-[10px] text-amber-800 leading-relaxed font-semibold space-y-1">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Medical Disclaimer
                </div>
                <p>{aiReport.medicalDisclaimer}</p>
              </div>

            </div>

            {/* Actions Grid */}
            {saveError && (
              <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-700 font-semibold flex items-start gap-2.5 leading-relaxed shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500 animate-pulse" />
                <div className="space-y-1 text-left">
                  <p className="font-bold text-rose-800">Saving Failed</p>
                  <p>{saveError}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My AI Triage Report',
                      text: aiReport.patientSummary,
                    }).catch(console.error);
                  } else {
                    alert("Copyable Share Link: " + window.location.href);
                  }
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Share className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Report</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveReport}
                className={`font-bold py-3 px-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                  isSaving
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Report</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowReportPage(false);
                  setIsReportingSymptoms(false);
                  // Reset form fields
                  setSymptoms('');
                  setDuration('');
                  setSeverity('');
                  setBodyArea('');
                  setAdditionalNotes('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (isReportingSymptoms) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between pb-12 relative overflow-hidden">
        {/* Orbs background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Back Button */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                setIsReportingSymptoms(false);
                setShowSuccessScreen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-100/80 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              Patient Intake
            </span>
          </div>
        </header>

        {/* Form or Success State content */}
        <main className="max-w-xl mx-auto w-full px-6 py-8 flex-1 relative z-10 flex flex-col justify-center">
          {showSuccessScreen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-8 space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-display font-extrabold text-slate-950 tracking-tight">
                  Report Symptoms Logged
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Your symptoms have been logged successfully. They will appear under your recent activity for easy tracking during your next medical consultation.
                </p>
              </div>

              {/* Summary card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Recorded Summary</span>
                  <span className="text-[10px] font-mono text-slate-400">Local ID: SH-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Symptoms Description</span>
                    <p className="text-slate-800 font-semibold">{symptoms}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block font-medium">Duration</span>
                      <p className="text-slate-800 font-semibold">{duration}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Severity</span>
                      <span className={`inline-block font-mono font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 mt-0.5 rounded border ${
                        severity === 'High' ? 'text-rose-600 bg-rose-50 border-rose-100/40' :
                        severity === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100/40' :
                        'text-emerald-600 bg-emerald-50 border-emerald-100/40'
                      }`}>
                        {severity}
                      </span>
                    </div>
                  </div>
                  {bodyArea && (
                    <div>
                      <span className="text-slate-400 block font-medium">Body Area</span>
                      <p className="text-slate-800 font-semibold">{bodyArea}</p>
                    </div>
                  )}
                  {additionalNotes && (
                    <div>
                      <span className="text-slate-400 block font-medium">Additional Notes</span>
                      <p className="text-slate-800 font-semibold line-clamp-2">{additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsReportingSymptoms(false);
                  setShowSuccessScreen(false);
                  // Reset form fields
                  setSymptoms('');
                  setDuration('');
                  setSeverity('');
                  setBodyArea('');
                  setAdditionalNotes('');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl text-xs hover:shadow-lg transition-all cursor-pointer"
              >
                Go back to Dashboard
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">
                  Report Symptoms
                </h1>
                <p className="text-sm text-slate-500">
                  Tell us how you're feeling.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); runSymptomAnalysis(); }} className="bg-white border border-slate-100 shadow-lg rounded-[2.5rem] p-6 sm:p-8 space-y-6">
                
                {/* Symptoms Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase tracking-wider">
                    Symptoms <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => {
                      setSymptoms(e.target.value);
                      if (errors.symptoms) {
                        setErrors(prev => ({ ...prev, symptoms: undefined }));
                      }
                    }}
                    placeholder="Describe how you are feeling, any pain, discomfort, or physical changes..."
                    rows={4}
                    className={`w-full bg-white border ${
                      errors.symptoms ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500 shadow-xs' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                    } focus:ring-4 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400`}
                  />
                  {errors.symptoms && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.symptoms}
                    </p>
                  )}
                </div>

                {/* Duration & Body Area Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Duration Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase tracking-wider">
                      Duration <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={duration}
                        onChange={(e) => {
                          setDuration(e.target.value);
                          if (errors.duration) {
                            setErrors(prev => ({ ...prev, duration: undefined }));
                          }
                        }}
                        className={`w-full bg-white border ${
                          errors.duration ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
                        } focus:ring-4 rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer`}
                      >
                        <option value="">Select Duration</option>
                        <option value="Today">Today</option>
                        <option value="1–3 Days">1–3 Days</option>
                        <option value="1 Week">1 Week</option>
                        <option value="More than 1 Week">More than 1 Week</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                    {errors.duration && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.duration}
                      </p>
                    )}
                  </div>

                  {/* Body Area Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase tracking-wider">
                      Body Area <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <select
                        value={bodyArea}
                        onChange={(e) => setBodyArea(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-blue-100 focus:ring-4 rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select affected area...</option>
                        <option value="Head">Head / Mind</option>
                        <option value="Neck">Neck / Throat</option>
                        <option value="Chest">Chest / Respiratory</option>
                        <option value="Abdomen">Abdomen / Digestive</option>
                        <option value="Back">Back / Spine</option>
                        <option value="Arms">Arms / Hands</option>
                        <option value="Legs">Legs / Feet</option>
                        <option value="Skin">Skin / External</option>
                        <option value="General">General / Multiple Areas</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Severity Choice */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase tracking-wider">
                    Severity <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Low', label: 'Low', bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-100 text-emerald-700', activeBg: 'bg-emerald-600 border-emerald-600 text-white' },
                      { id: 'Medium', label: 'Medium', bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-100 text-amber-700', activeBg: 'bg-amber-500 border-amber-500 text-white' },
                      { id: 'High', label: 'High', bg: 'bg-rose-50 hover:bg-rose-100/70 border-rose-100 text-rose-700', activeBg: 'bg-rose-600 border-rose-600 text-white' }
                    ].map((option) => {
                      const isActive = severity === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSeverity(option.id);
                            if (errors.severity) {
                              setErrors(prev => ({ ...prev, severity: undefined }));
                            }
                          }}
                          className={`py-3 px-2 sm:px-4 rounded-xl border text-xs font-bold tracking-wide transition-all cursor-pointer ${
                            isActive 
                              ? `${option.activeBg} shadow-sm scale-[1.02]` 
                              : `${option.bg} border-transparent`
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.severity && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.severity}
                    </p>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase tracking-wider">
                    Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any history of similar symptoms, allergies, or medications being taken..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-blue-100 focus:ring-4 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReportingSymptoms(false);
                      // Clear fields
                      setSymptoms('');
                      setDuration('');
                      setSeverity('');
                      setBodyArea('');
                      setAdditionalNotes('');
                    }}
                    className="px-5 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs hover:shadow-lg hover:shadow-blue-500/10 active:scale-98 transition-all cursor-pointer"
                  >
                    Analyze Symptoms
                  </button>
                </div>

              </form>
            </motion.div>
          )}
        </main>
      </div>
    );
  }

  const handleDocContinue = () => {
    if (selectedFile) {
      const newDoc = {
        id: `DOC-${Date.now()}`,
        name: selectedFile.name,
        type: selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'Document'),
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isPdf: selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf'),
        objectUrl: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null
      };
      setUploadedDocuments([newDoc, ...uploadedDocuments]);
      setShowUploadSuccess(true);
    } else {
      setIsUploadingDocs(false);
    }
  };

  if (isUploadingDocs) {
    const isImage = selectedFile && (selectedFile.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(selectedFile.name));
    const fileSizeMB = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0';
    
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between pb-12 relative overflow-hidden">
        {/* Background ambient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Back Button */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                setIsUploadingDocs(false);
                setSelectedFile(null);
                setUploadError(null);
                setShowUploadSuccess(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-100/80 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              Health Locker
            </span>
          </div>
        </header>

        {/* Form or Success State content */}
        <main className="max-w-xl mx-auto w-full px-6 py-8 flex-1 relative z-10 flex flex-col justify-center">
          {showUploadSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-8 space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-display font-extrabold text-slate-950 tracking-tight">
                  Document Uploaded Successfully
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Your medical document has been organized inside your clinical health locker profile and is ready for clinical evaluation.
                </p>
              </div>

              {/* Uploaded File Details Summary Card */}
              {selectedFile && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-emerald-500 shrink-0">
                    {isImage ? (
                      <Image className="w-6 h-6" />
                    ) : (
                      <File className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{fileSizeMB} MB • {selectedFile.type || 'Document'}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setIsUploadingDocs(false);
                  setSelectedFile(null);
                  setUploadError(null);
                  setShowUploadSuccess(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl text-xs hover:shadow-lg transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">
                  Upload Medical Documents
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Upload prescriptions or reports to keep your health records organized.
                </p>
              </div>

              <div className="bg-white border border-slate-100 shadow-lg rounded-[2.5rem] p-6 sm:p-8 space-y-6">
                
                {/* File Upload Zone */}
                <input
                  type="file"
                  id="file-upload"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      validateAndSetFile(e.target.files[0]);
                    }
                  }}
                />

                {!selectedFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        validateAndSetFile(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-[2rem] p-8 text-center transition-all flex flex-col items-center justify-center min-h-[220px] ${
                      isDragging 
                        ? 'border-emerald-500 bg-emerald-50/30 shadow-inner' 
                        : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
                      <Upload className="w-5 h-5" />
                    </div>

                    <p className="text-sm font-bold text-slate-800">
                      Drag and drop your file here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      or click the button below to browse your storage.
                    </p>

                    <button
                      type="button"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="mt-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                    >
                      Browse Files
                    </button>

                    <div className="mt-6 space-y-1 text-[10px] text-slate-400 leading-normal">
                      <p className="font-semibold text-slate-500">Supported Formats:</p>
                      <p>• Prescription Image (JPG, PNG)</p>
                      <p>• Medical Reports (PDF)</p>
                      <p>• Lab Reports (PDF, JPG, PNG)</p>
                      <p className="font-semibold text-slate-500 mt-2">Maximum File Size: 10 MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Selected File Details & Preview */}
                    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-emerald-500 shrink-0 shadow-xs">
                            {isImage ? (
                              <Image className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <File className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate max-w-[220px] sm:max-w-[320px]">
                              {selectedFile.name}
                            </h4>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase">
                              {selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'unknown')}
                            </p>
                            <p className="text-[10px] font-mono text-slate-500 font-semibold">
                              {fileSizeMB} MB
                            </p>
                          </div>
                        </div>

                        {/* Quick actions for file */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            title="Replace File"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            title="Remove File"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Preview zone if image */}
                      {isImage && (
                        <div className="border border-slate-100 bg-white rounded-xl overflow-hidden max-h-[220px] flex items-center justify-center relative p-2">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Prescription preview"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="max-h-[200px] object-contain rounded-lg"
                          />
                        </div>
                      )}

                      {/* PDF design element if PDF */}
                      {!isImage && (
                        <div className="border border-slate-100 bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 bg-red-50 text-red-500 border border-red-100 rounded-xl flex items-center justify-center mb-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-slate-700">Adobe PDF Document</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Secure Document Sandbox</span>
                        </div>
                      )}
                    </div>

                    {/* Replace / Remove button actions explicitly placed below as per specifications */}
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-100 rounded-xl transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Replace File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove File</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Validation/Upload error */}
                {uploadError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1.5 bg-rose-50 border border-rose-100/40 p-3 rounded-xl">
                    <AlertCircle className="w-4 h-4" />
                    {uploadError}
                  </p>
                )}

                {/* Document is optional note */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-700 block mb-1">Note:</span>
                  "Uploading documents is optional. You can continue without uploading any files."
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadingDocs(false);
                      setSelectedFile(null);
                      setUploadError(null);
                      setShowUploadSuccess(false);
                    }}
                    className="px-5 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDocContinue}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs hover:shadow-lg hover:shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer"
                  >
                    Continue
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </main>
      </div>
    );
  }

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
                  onClick={() => {
                    setIsReportingSymptoms(true);
                    setShowSuccessScreen(false);
                    setErrors({});
                  }}
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
                  onClick={() => {
                    setIsUploadingDocs(true);
                    setSelectedFile(null);
                    setUploadError(null);
                    setShowUploadSuccess(false);
                  }}
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

              {submissions.length === 0 ? (
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
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setSelectedReportId(sub.id);
                        setActiveTab('reports');
                      }}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            sub.severity === 'High' ? 'text-rose-600 bg-rose-50 border-rose-100/40' :
                            sub.severity === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100/40' :
                            'text-emerald-600 bg-emerald-50 border-emerald-100/40'
                          }`}>
                            {sub.severity} Severity
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Duration: {sub.duration}</span>
                          <span className="text-[10px] font-mono text-slate-400">•</span>
                          <span className="text-[10px] font-mono text-slate-400">Body Area: {sub.bodyArea}</span>
                        </div>
                        <h4 className="font-display font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {sub.symptoms}
                        </h4>
                        {sub.additionalNotes && sub.additionalNotes !== 'None' && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                            "{sub.additionalNotes}"
                          </p>
                        )}
                      </div>
                      <div className="text-right sm:border-l sm:border-slate-100 sm:pl-5 flex sm:flex-col justify-between sm:justify-center shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 block font-semibold">{sub.date}</span>
                        <span className="text-[10px] font-mono text-slate-400 block">{sub.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Active Tab: Reports view - My Health Reports */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            {selectedReportId ? (
              // REPORT DETAIL VIEW
              (() => {
                const report = submissions.find(r => r.id === selectedReportId);
                if (!report) {
                  return (
                    <div className="text-center py-10">
                      <p className="text-xs text-slate-500">Report not found.</p>
                      <button onClick={() => setSelectedReportId(null)} className="mt-4 text-xs font-bold text-blue-600">Back to List</button>
                    </div>
                  );
                }
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* Header with back to list button */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <button
                        onClick={() => setSelectedReportId(null)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-100/80 shadow-xs cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Reports</span>
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        Report ID: {report.id}
                      </span>
                    </div>

                    {/* Report ID and Date Header */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-4">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Submission Date</span>
                          <div className="flex items-center gap-1.5 text-slate-800">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold">{report.date} at {report.time}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Status</span>
                          <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${
                            report.status === 'Completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                            report.status === 'Reviewed' ? 'text-blue-700 bg-blue-50 border-blue-100' :
                            'text-amber-700 bg-amber-50 border-amber-100'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>

                      {/* Patient Summary */}
                      <div className="pt-4 border-t border-slate-50 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Patient Summary</span>
                        <p className="text-xs font-semibold text-slate-700">{report.patientSummary || 'Male, 29 Years • Sector 3 Rural Outpost'}</p>
                      </div>
                    </div>

                    {/* Symptoms details */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Activity className="w-4 h-4" />
                        </div>
                        <h3 className="font-display font-extrabold text-slate-900 text-sm">Symptoms Description</h3>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {report.symptoms}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[9px] font-mono text-slate-400 block uppercase">Duration</span>
                            <span className="text-xs font-bold text-slate-700 mt-0.5 block">{report.duration}</span>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[9px] font-mono text-slate-400 block uppercase">Body Area</span>
                            <span className="text-xs font-bold text-slate-700 mt-0.5 block">{report.bodyArea}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <span className="text-[9px] font-mono text-slate-400 block uppercase">Severity Level (Risk)</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`w-2 h-2 rounded-full ${
                              report.severity === 'High' ? 'bg-rose-500 animate-pulse' :
                              report.severity === 'Medium' ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              report.severity === 'High' ? 'text-rose-600' :
                              report.severity === 'Medium' ? 'text-amber-600' :
                              'text-emerald-600'
                            }`}>
                              {report.severity} Severity
                            </span>
                          </div>
                        </div>

                        {report.additionalNotes && report.additionalNotes !== 'None' && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[9px] font-mono text-slate-400 block uppercase">Additional Notes</span>
                            <p className="text-xs text-slate-600 mt-0.5 italic">"{report.additionalNotes}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Documents section */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </div>
                        <h3 className="font-display font-extrabold text-slate-900 text-sm">Uploaded Documents</h3>
                      </div>
                      
                      {(!report.documents || report.documents.length === 0) ? (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center">
                          <p className="text-[11px] text-slate-400">No documents attached to this report.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {report.documents.map((doc: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 bg-white border border-slate-200/60 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                                  {doc.name.endsWith('.pdf') ? (
                                    <File className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <Image className="w-4 h-4 text-emerald-500" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-[11px] font-bold text-slate-800 truncate max-w-[180px] sm:max-w-xs">{doc.name}</h4>
                                  <p className="text-[9px] text-slate-400">{doc.size || 'Size Unknown'}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">{doc.date}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                     {/* Doctor Notes */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <h3 className="font-display font-extrabold text-slate-900 text-sm">Doctor & Clinical Notes</h3>
                      </div>
                      <div className="bg-purple-50/20 border border-purple-100/40 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed font-medium">
                        {report.doctorNotes || 'No physician evaluation records have been submitted for this intake. A District Health Officer will provide notes following triage validation.'}
                      </div>
                    </div>

                    {/* AI Assessment Report inside details view if available */}
                    {report.aiReport && (
                      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Activity className="w-4 h-4 animate-pulse" />
                          </div>
                          <h3 className="font-display font-extrabold text-slate-900 text-sm">AI Clinical Assessment</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">AI Risk Urgency</span>
                              <span className={`text-xs font-bold uppercase tracking-wider mt-1 inline-block ${
                                report.aiReport.riskLevel === 'HIGH' ? 'text-rose-600' :
                                report.aiReport.riskLevel === 'MEDIUM' ? 'text-amber-600' :
                                'text-emerald-600'
                              }`}>
                                {report.aiReport.riskLevel}
                              </span>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Confidence</span>
                              <span className="text-xs font-bold text-slate-700 mt-1 block">{report.aiReport.confidence}%</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Patient Summary</span>
                            <p className="text-xs text-slate-700 font-semibold">{report.aiReport.patientSummary}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Detected Symptoms</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {report.aiReport.detectedSymptoms.map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-lg">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Possible Health Concerns</span>
                            <ul className="list-disc pl-4 text-xs text-slate-600 font-medium space-y-1">
                              {report.aiReport.possibleHealthConcerns.map((c: string, idx: number) => (
                                <li key={idx}>{c}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Recommended Next Steps</span>
                            <p className="text-xs text-slate-700 font-semibold leading-relaxed">{report.aiReport.recommendedAction}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Clinical Triage Summary (For Doctor)</span>
                            <p className="text-xs text-slate-700 bg-indigo-50/20 border border-indigo-100/30 rounded-xl p-3 leading-relaxed italic font-semibold">{report.aiReport.doctorSummary}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Report timeline */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <h3 className="font-display font-extrabold text-slate-900 text-sm">Consultation Timeline</h3>
                      </div>
                      
                      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {report.timeline ? report.timeline.map((step: any, idx: number) => (
                          <div key={idx} className="relative">
                            {/* Dot indicator */}
                            <span className={`absolute -left-[21px] top-1 w-[11px] h-[11px] rounded-full border-2 ${
                              step.active 
                                ? 'bg-emerald-500 border-emerald-100' 
                                : 'bg-slate-200 border-white shadow-xs'
                            }`} />
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className={`text-xs font-bold ${step.active ? 'text-slate-800' : 'text-slate-400 font-normal'}`}>
                                  {step.label}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">{step.date} {step.time}</span>
                              </div>
                              {step.desc && (
                                <p className="text-[11px] text-slate-400 leading-normal">{step.desc}</p>
                              )}
                            </div>
                          </div>
                        )) : (
                          <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-[11px] h-[11px] rounded-full border-2 bg-emerald-500 border-emerald-100" />
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-800">Symptom Report Submitted</span>
                              <p className="text-[10px] text-slate-400">{report.date} {report.time}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedReportId(null)}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 px-6 rounded-xl text-xs shadow-sm transition-all text-center block cursor-pointer"
                    >
                      Back to Reports List
                    </button>
                  </motion.div>
                );
              })()
            ) : (
              // REPORTS LIST VIEW
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight">
                      My Health Reports
                    </h1>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Secure registry of symptom reviews and medical triages
                    </p>
                  </div>
                  
                  {/* Quick report button */}
                  <button
                    onClick={() => {
                      setIsReportingSymptoms(true);
                      setShowSuccessScreen(false);
                      setErrors({});
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer bg-blue-50 px-3 py-2 rounded-xl border border-blue-100/40 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Report</span>
                  </button>
                </div>

                {/* Search Bar & Filters Section */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
                  {/* Search bar input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search reports by ID or symptoms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-100 focus:border-blue-500 focus:ring-blue-100 focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Filter chips header */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Filter Reports
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'Newest', label: 'Newest First' },
                        { id: 'Oldest', label: 'Oldest First' },
                        { id: 'High', label: 'High Risk' },
                        { id: 'Medium', label: 'Medium Risk' },
                        { id: 'Low', label: 'Low Risk' }
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          onClick={() => setFilterOption(chip.id as any)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide border transition-all cursor-pointer ${
                            filterOption === chip.id
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                              : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Report Cards Grid */}
                {(() => {
                  // Apply search and severity filter
                  let list = [...submissions].filter(sub => {
                    const matchesSearch = 
                      sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      sub.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    if (filterOption === 'High') return matchesSearch && sub.severity === 'High';
                    if (filterOption === 'Medium') return matchesSearch && sub.severity === 'Medium';
                    if (filterOption === 'Low') return matchesSearch && sub.severity === 'Low';
                    
                    return matchesSearch;
                  });

                  // Apply sort order
                  if (filterOption === 'Oldest') {
                    // Oldest first means reverse of newest first
                    list.reverse();
                  }

                  if (list.length === 0) {
                    return (
                      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
                          <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-slate-700 text-sm">
                          No reports available yet.
                        </h3>
                        <p className="text-xs text-slate-400 max-w-xs mt-1 leading-normal mb-6">
                          {searchTerm 
                            ? "No reports match your active search filter. Try clearing your keywords." 
                            : "There are no medical evaluations, health risk assessments, or clinical consultation reports filed to your identifier."}
                        </p>
                        <button
                          onClick={() => {
                            setIsReportingSymptoms(true);
                            setShowSuccessScreen(false);
                            setErrors({});
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-xs hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Report Symptoms</span>
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 gap-4">
                      {list.map((report) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setSelectedReportId(report.id)}
                          className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group space-y-3"
                        >
                          {/* Card top bar with ID, Date, and Risk Badge */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-md">
                                {report.id}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {report.date}
                              </span>
                            </div>

                            {/* Risk Badge */}
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              report.severity === 'High' ? 'text-rose-600 bg-rose-50 border-rose-100/40' :
                              report.severity === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100/40' :
                              'text-emerald-600 bg-emerald-50 border-emerald-100/40'
                            }`}>
                              {report.severity} Severity (Risk)
                            </span>
                          </div>

                          {/* Symptoms Summary */}
                          <div className="space-y-1">
                            <h4 className="font-display font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {report.symptoms}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              Duration: {report.duration} • Area: {report.bodyArea || 'General'}
                            </p>
                          </div>

                          {/* Card Bottom: Status & Action indicator */}
                          <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                report.status === 'Completed' ? 'bg-emerald-500' :
                                report.status === 'Reviewed' ? 'bg-blue-500' :
                                'bg-amber-500'
                              }`} />
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                                {report.status || 'Pending'}
                              </span>
                            </div>
                            
                            <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
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
