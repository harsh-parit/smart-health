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
  RefreshCw
} from 'lucide-react';

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
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

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
    
    // Add custom local submission
    const newRecord = {
      id: `REC-${Date.now()}`,
      symptoms,
      duration,
      severity,
      bodyArea: bodyArea || 'N/A',
      additionalNotes: additionalNotes || 'None',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setSubmissions([newRecord, ...submissions]);
    setShowSuccessScreen(true);
  };

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

              <form onSubmit={handleContinue} className="bg-white border border-slate-100 shadow-lg rounded-[2.5rem] p-6 sm:p-8 space-y-6">
                
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
                    Continue
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
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-blue-200 transition-colors"
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
                        <h4 className="font-display font-bold text-slate-800 text-sm line-clamp-1">
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

        {/* Active Tab: Reports view */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {uploadedDocuments.length === 0 ? (
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
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base">My Health Locker</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Your uploaded prescriptions and reports</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsUploadingDocs(true);
                      setSelectedFile(null);
                      setUploadError(null);
                      setShowUploadSuccess(false);
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/40"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {uploadedDocuments.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-emerald-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 shrink-0">
                          {doc.objectUrl ? (
                            <Image className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <File className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-xs">{doc.name}</h4>
                          <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{doc.size} • {doc.date} at {doc.time}</span>
                        </div>
                      </div>
                      
                      {doc.objectUrl ? (
                        <div className="w-10 h-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
                          <img src={doc.objectUrl} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg border border-slate-100 bg-red-50/50 flex items-center justify-center text-red-500 shrink-0">
                          <span className="text-[9px] font-bold uppercase">PDF</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
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
