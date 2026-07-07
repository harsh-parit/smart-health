import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  HeartPulse, 
  Clipboard, 
  AlertTriangle, 
  FileText, 
  Stethoscope, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileDown,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { SavedReport } from '../services/reportService';

interface PatientDetailsModalProps {
  report: SavedReport | null;
  onClose: () => void;
  onStartConsultation: (report: SavedReport) => void;
  onRejectReport: (report: SavedReport) => void;
  isRejecting?: boolean;
}

export default function PatientDetailsModal({
  report,
  onClose,
  onStartConsultation,
  onRejectReport,
  isRejecting = false
}: PatientDetailsModalProps) {
  if (!report) return null;

  const isHigh = report.riskLevel === 'HIGH' || report.geminiAnalysis?.riskLevel === 'HIGH';
  const isMed = report.riskLevel === 'MEDIUM' || report.geminiAnalysis?.riskLevel === 'MEDIUM';

  // Format submission time nicely
  let submissionTimeStr = 'Unknown Time';
  if (report.createdAt) {
    try {
      const date = report.createdAt.toDate ? report.createdAt.toDate() : new Date(report.createdAt);
      submissionTimeStr = date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      submissionTimeStr = String(report.createdAt);
    }
  }

  const handleRejectClick = () => {
    if (window.confirm(`Are you sure you want to reject report ${report.reportId} for patient ${report.patientInformation?.fullName || 'Unknown'}? This action cannot be undone.`)) {
      onRejectReport(report);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
      />
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10 relative flex flex-col"
      >
        {/* Header (Sticky) */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-display font-extrabold text-sm border border-purple-100">
              {(report.patientInformation?.fullName || 'P')[0]}
            </div>
            <div>
              <h3 className="font-display font-black text-slate-900 text-sm">
                {report.patientInformation?.fullName || 'Unknown Patient'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Report ID: <span className="font-mono text-slate-600 font-bold">{report.reportId}</span> • Submitted: {submissionTimeStr}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* 1. Patient Information (Quick Demographics) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Patient Information</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {report.patientInformation?.fullName || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Age & Gender</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {report.patientInformation?.age || 'Unknown'} Y / {report.patientInformation?.gender || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Village</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                  {report.patientInformation?.village || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">District</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                  {report.patientInformation?.district || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Medical History */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clipboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Patient Medical History</span>
            </h4>
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/80 space-y-3">
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Chronic Diseases</span>
                {report.medicalHistory?.chronicDiseases && report.medicalHistory.chronicDiseases.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {report.medicalHistory.chronicDiseases.map((d, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg">
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic mt-1 block">None declared.</span>
                )}
              </div>
              
              <div className="border-t border-slate-200/50 pt-2.5">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Current Medications</span>
                {report.medicalHistory?.medications && report.medicalHistory.medications.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {report.medicalHistory.medications.map((m, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg">
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic mt-1 block">None declared.</span>
                )}
              </div>

              <div className="border-t border-slate-200/50 pt-2.5">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Drug & Food Allergies</span>
                {report.medicalHistory?.allergies && report.medicalHistory.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {report.medicalHistory.allergies.map((a, i) => (
                      <span key={i} className="text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 px-2.5 py-0.5 rounded-lg">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic mt-1 block">No known drug or food allergies (NKDA).</span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Symptoms (Reported raw text) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported Symptoms Description</span>
            </h4>
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-700 leading-relaxed italic whitespace-pre-line">
                "{report.symptoms || 'No additional symptom details provided.'}"
              </p>
            </div>
          </div>

          {/* 4. Uploaded Documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Uploaded Documents</span>
            </h4>
            {report.uploadedDocuments && report.uploadedDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.uploadedDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{doc.size || 'Unknown size'}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => alert(`Downloading "${doc.name}" is simulated.`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-750 hover:bg-slate-200/50 transition-colors"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-center text-xs text-slate-400 italic">
                No diagnostic records, lab sheets, or photos uploaded.
              </div>
            )}
          </div>

          {/* 5. Gemini Analysis */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>Gemini Clinical Triage Analysis</span>
            </h4>
            <div className="bg-purple-50/20 border border-purple-100/50 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">Triage Risk Level</span>
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg inline-block mt-1 ${
                    isHigh
                      ? 'text-rose-700 bg-rose-50 border border-rose-100'
                      : isMed
                        ? 'text-amber-700 bg-amber-50 border border-amber-100'
                        : 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                  }`}>
                    {report.riskLevel || report.geminiAnalysis?.riskLevel || 'LOW'} RISK
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">AI Confidence Score</span>
                  <span className="text-sm font-display font-black text-slate-800 mt-1 block">
                    {report.confidence || report.geminiAnalysis?.confidence || 0}%
                  </span>
                </div>
              </div>

              {/* Confidence Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/30">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${report.confidence || report.geminiAnalysis?.confidence || 0}%` }} 
                  />
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">Detected Symptoms</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {report.geminiAnalysis?.detectedSymptoms && report.geminiAnalysis.detectedSymptoms.length > 0 ? (
                    report.geminiAnalysis.detectedSymptoms.map((s, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white border border-purple-100/30 text-purple-700 px-2.5 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No extracted symptoms.</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">Possible Health Concerns</span>
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 mt-1.5 font-medium">
                  {report.geminiAnalysis?.possibleHealthConcerns && report.geminiAnalysis.possibleHealthConcerns.length > 0 ? (
                    report.geminiAnalysis.possibleHealthConcerns.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))
                  ) : (
                    <li>General health check recommended.</li>
                  )}
                </ul>
              </div>

              <div>
                <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">AI Recommended Action</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1">
                  {report.recommendedAction || report.geminiAnalysis?.recommendedAction || 'General clinical review is recommended.'}
                </p>
              </div>

              <div className="bg-white border border-purple-100/25 rounded-xl p-4 space-y-1">
                <span className="text-[9px] font-mono text-purple-500 font-bold uppercase tracking-wider block">Clinical Safety Disclaimer</span>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">
                  "{report.medicalDisclaimer || report.geminiAnalysis?.medicalDisclaimer || 'This is an AI-powered triage analysis designed to support clinical staff. It does not replace independent professional medical judgment.'}"
                </p>
              </div>
            </div>
          </div>

          {/* 6. Doctor Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>Gemini AI Doctor Summary</span>
            </h4>
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5">
              <p className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-line">
                {report.doctorSummary || report.geminiAnalysis?.doctorSummary || 'No clinician-specific summary compiled.'}
              </p>
            </div>
          </div>

          {/* 7. Current Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Report Status</span>
            </h4>
            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-800 text-xs font-semibold">
              <Clock className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              <span>This report is currently <strong className="font-bold">{report.status || 'Pending Doctor Review'}</strong> and visible in your clinical queue.</span>
            </div>
          </div>

        </div>

        {/* Action Buttons Footer (Sticky) */}
        <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 sticky bottom-0 rounded-b-[2.5rem]">
          {/* Reject button on left */}
          <button
            type="button"
            disabled={isRejecting}
            onClick={handleRejectClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{isRejecting ? 'Rejecting...' : 'Reject Report'}</span>
          </button>

          {/* Close/Return and Start Consult on right */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Return</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onStartConsultation(report);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/10"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Start Consultation</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
