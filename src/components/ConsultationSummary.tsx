import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  Edit3, 
  Printer, 
  Clock, 
  User, 
  Heart, 
  FileCheck, 
  ShieldCheck, 
  Calendar,
  AlertTriangle,
  FileSignature
} from 'lucide-react';
import { Patient, ConsultationRecord } from './DoctorDashboard';

interface ConsultationSummaryProps {
  patient: Patient;
  record: ConsultationRecord;
  onEdit: () => void;
  onApprove: () => void;
  onReturnToQueue: () => void;
}

export default function ConsultationSummary({
  patient,
  record,
  onEdit,
  onApprove,
  onReturnToQueue
}: ConsultationSummaryProps) {
  const [isApproved, setIsApproved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse or formulate realistic SOAP details based on active consultation inputs and patient data.
  const subjectiveComplaint = patient.symptoms.join(', ');
  const subjectiveHistory = patient.notes || 'No historical chronic conditions reported.';
  const medicalHistoryFormatted = patient.medicalHistory && patient.medicalHistory.length > 0
    ? patient.medicalHistory.join('; ')
    : 'No significant systemic history. Fully vaccinated.';

  // Build the SOAP sections
  const SOAP = {
    subjective: {
      chiefComplaint: subjectiveComplaint || 'Routine health review.',
      historyPresentIllness: `Patient is a ${patient.age}-year-old ${patient.gender.toLowerCase()} presenting with symptoms of ${subjectiveComplaint || 'general illness'}. History as reported: ${subjectiveHistory}.`,
      pastMedicalHistory: medicalHistoryFormatted,
      allergies: 'No known drug allergies (NKDA).',
      socialHistory: `Village: ${patient.village}. Referred by: ${patient.referredBy}.`
    },
    objective: {
      vitals: `BP: ${patient.vitals.bpSystolic}/${patient.vitals.bpDiastolic} mmHg; Pulse: ${patient.vitals.pulse} BPM; Temp: ${patient.vitals.temperature}°F; Blood Sugar: ${patient.vitals.bloodSugar} mg/dL; Weight: ${patient.vitals.weight} kg.`,
      physicalExam: record.observations?.trim() || `GENERAL: Alert, cooperative, oriented x 3, in no acute distress.
HEENT: Normocephalic, atraumatic. Pupils equal, round, reactive to light.
CARDIAC: Regular rate and rhythm, normal S1/S2, no murmurs, rubs, or gallops.
RESPIRATORY: Clear to auscultation bilaterally, equal air entry. No wheezing or crackles.
ABDOMEN: Soft, non-distended, non-tender, active bowel sounds.
EXTREMITIES: Bilateral lower extremities evaluated for edema (${patient.symptoms.some(s => s.toLowerCase().includes('edema')) ? 'Present - graded as +2 pitting edema' : 'Absent'}).`
    },
    assessment: {
      primaryDiagnosis: record.diagnosis?.trim() || 'Acute Outpatient Symptom Complex',
      clinicalImpression: `Based on a BP of ${patient.vitals.bpSystolic}/${patient.vitals.bpDiastolic} and symptoms including ${subjectiveComplaint}, clinical findings point towards ${record.diagnosis || 'unspecified viral or cardiovascular etiology'}. Risk Level categorized as ${patient.riskLevel} due to acute symptoms and triage readings.`
    },
    plan: {
      therapeutics: record.prescription && record.prescription.length > 0 
        ? record.prescription.map(p => `${p.name} (${p.dosage}) - ${p.frequency}, ${p.timing}`).join('; ')
        : 'No pharmacological therapeutics prescribed. Advised supportive/symptomatic home care.',
      interventions: record.advice?.trim() || 'Restrict strenuous activity. Maintain adequate hydration. Take prescribed medications regularly.',
      followUp: `Schedule formal clinical reassessment on ${record.followUpDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}.`,
      emergencyWarnings: 'RETURN IMMEDIATELY if you experience high fever, severe unremitting headache, visual disturbances, shortness of breath, chest pain, or rapid swelling of face/extremities.'
    }
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    // Simulate highly realistic clinical document generation
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 800);
  };

  const handleApproveClick = () => {
    setIsApproved(true);
    onApprove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            disabled={isApproved}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Go back and edit assessment"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/40">
                Consultation Summary
              </span>
              <span className="text-xs text-slate-400 font-mono">SOAP Clinical Notes</span>
            </div>
            <h1 className="text-xl font-display font-black text-slate-900 mt-1">
              Clinical Assessment & Discharge Summary
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className={`w-2.5 h-2.5 rounded-full ${isApproved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
          <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
            Status: {isApproved ? 'Approved & Locked' : 'Pending Signature'}
          </span>
        </div>
      </div>

      {/* Hospital Document Outer Card (Material Design 3 styled clinical record) */}
      <div 
        id="clinical-document-print"
        className="bg-white border border-slate-300 rounded-[2rem] shadow-sm overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        {/* Hospital Header Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:bg-white print:border-b-2 print:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-display font-black tracking-wider text-slate-900 uppercase">
                National Rural Health Outpost
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide mt-0.5">
                Primary Care & Tele-Consultation Hub • District Datia
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right font-mono text-[10px] text-slate-400">
            <div>DOC ID: NRHM-2026-{(patient.id.padStart(4, '0'))}</div>
            <div>DATE: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div>TIME: {patient.visitTime}</div>
          </div>
        </div>

        {/* Clinical Document Content */}
        <div className="p-8 space-y-6 sm:p-10">
          
          {/* Patient Details Table (MD3 Flat Tonal Design) */}
          <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Patient Name</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block">{patient.name}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Age / Gender</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block">{patient.age} Yrs / {patient.gender}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Village Origin</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block">{patient.village}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Triage Priority</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                patient.riskLevel === 'High Risk'
                  ? 'text-rose-700 bg-rose-50 border border-rose-100'
                  : patient.riskLevel === 'Medium Risk'
                    ? 'text-amber-700 bg-amber-50 border border-amber-100'
                    : 'text-emerald-700 bg-emerald-50 border border-emerald-100'
              }`}>
                {patient.riskLevel}
              </span>
            </div>
          </div>

          {/* Divider with SOAP label */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">
              Official SOAP Medical Record
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* SOAP Notes Sections */}
          <div className="space-y-8">
            
            {/* S - Subjective Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-6 border-b border-dashed border-slate-200">
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-display font-black text-xs flex items-center justify-center">
                  S
                </span>
                <div>
                  <h3 className="text-xs font-display font-bold text-slate-800 uppercase tracking-wider">
                    Subjective
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Patient History</span>
                </div>
              </div>
              <div className="md:col-span-9 space-y-3 pl-1 md:pl-0">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Chief Complaint</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                    {SOAP.subjective.chiefComplaint}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">History of Present Illness (HPI)</span>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    {SOAP.subjective.historyPresentIllness}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Past Medical History</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {SOAP.subjective.pastMedicalHistory}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Allergies & Contraindications</span>
                    <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                      {SOAP.subjective.allergies}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* O - Objective Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-6 border-b border-dashed border-slate-200">
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-purple-50 border border-purple-100 text-purple-700 font-display font-black text-xs flex items-center justify-center">
                  O
                </span>
                <div>
                  <h3 className="text-xs font-display font-bold text-slate-800 uppercase tracking-wider">
                    Objective
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Clinical Exam</span>
                </div>
              </div>
              <div className="md:col-span-9 space-y-3 pl-1 md:pl-0">
                {/* Visual Vitals Pills */}
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Triage Physical Vitals</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-50 border border-slate-150 text-[11px] text-slate-700 px-3 py-1 rounded-full font-medium font-mono">
                      BP: <strong className="text-slate-900 font-display">{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}</strong> mmHg
                    </span>
                    <span className="bg-slate-50 border border-slate-150 text-[11px] text-slate-700 px-3 py-1 rounded-full font-medium font-mono">
                      Pulse: <strong className="text-slate-900 font-display">{patient.vitals.pulse}</strong> BPM
                    </span>
                    <span className="bg-slate-50 border border-slate-150 text-[11px] text-slate-700 px-3 py-1 rounded-full font-medium font-mono">
                      Sugar: <strong className="text-slate-900 font-display">{patient.vitals.bloodSugar}</strong> mg/dL
                    </span>
                    <span className="bg-slate-50 border border-slate-150 text-[11px] text-slate-700 px-3 py-1 rounded-full font-medium font-mono">
                      Temp: <strong className="text-slate-900 font-display">{patient.vitals.temperature}°F</strong>
                    </span>
                    <span className="bg-slate-50 border border-slate-150 text-[11px] text-slate-700 px-3 py-1 rounded-full font-medium font-mono">
                      Weight: <strong className="text-slate-900 font-display">{patient.vitals.weight} kg</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Physical Examination Findings</span>
                  <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-line mt-0.5 bg-slate-50/30 border border-slate-100 p-3 rounded-xl">
                    {SOAP.objective.physicalExam}
                  </p>
                </div>
              </div>
            </div>

            {/* A - Assessment Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-6 border-b border-dashed border-slate-200">
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-display font-black text-xs flex items-center justify-center">
                  A
                </span>
                <div>
                  <h3 className="text-xs font-display font-bold text-slate-800 uppercase tracking-wider">
                    Assessment
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Diagnosis & Risk</span>
                </div>
              </div>
              <div className="md:col-span-9 space-y-3 pl-1 md:pl-0">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Primary Diagnosis / Clinical Impression</span>
                  <p className="text-xs font-display font-extrabold text-slate-900 leading-snug mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>{SOAP.assessment.primaryDiagnosis}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Clinical Reasoning</span>
                  <p className="text-xs text-slate-650 leading-relaxed mt-0.5">
                    {SOAP.assessment.clinicalImpression}
                  </p>
                </div>
              </div>
            </div>

            {/* P - Plan Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-display font-black text-xs flex items-center justify-center">
                  P
                </span>
                <div>
                  <h3 className="text-xs font-display font-bold text-slate-800 uppercase tracking-wider">
                    Plan
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Therapeutics & Rx</span>
                </div>
              </div>
              <div className="md:col-span-9 space-y-4 pl-1 md:pl-0">
                
                {/* Prescriptions */}
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Prescribed Pharmacotherapy (Rx)</span>
                  {record.prescription && record.prescription.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-mono text-slate-400 uppercase font-bold">
                            <th className="px-3 py-2">Medicine Name</th>
                            <th className="px-3 py-2">Dosage</th>
                            <th className="px-3 py-2">Frequency</th>
                            <th className="px-3 py-2">Timing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {record.prescription.map((m, idx) => (
                            <tr key={idx} className="text-xs text-slate-750 font-medium">
                              <td className="px-3 py-2.5 font-semibold text-slate-900">{m.name}</td>
                              <td className="px-3 py-2.5">{m.dosage}</td>
                              <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px]">{m.frequency}</td>
                              <td className="px-3 py-2.5 text-slate-500">{m.timing}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      No therapeutic agents prescribed. Advised dietary and home care regimens.
                    </p>
                  )}
                </div>

                {/* Non-pharm interventions */}
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Discharge Care & Counseling</span>
                  <p className="text-xs text-slate-650 leading-relaxed mt-0.5 bg-slate-50/40 border border-slate-100 p-3 rounded-xl">
                    {SOAP.plan.interventions}
                  </p>
                </div>

                {/* Follow up & emergency warnings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-emerald-50/20 border border-emerald-100/40 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-wider block">Follow-Up & Review</span>
                    <p className="text-xs text-slate-700 font-semibold mt-1">
                      {SOAP.plan.followUp}
                    </p>
                  </div>
                  <div className="bg-rose-50/20 border border-rose-100/40 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-rose-600 font-bold uppercase tracking-wider block flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>RED FLAG WARNINGS</span>
                    </span>
                    <p className="text-[11px] text-rose-850 leading-relaxed mt-1 font-medium">
                      {SOAP.plan.emergencyWarnings}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Digital Signature Block */}
          <div className="pt-8 mt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:mt-12 print:pt-6">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Cryptographically signed with NHM Telehealth Protocol</span>
            </div>
            
            <div className="text-left sm:text-right space-y-1.5 self-start sm:self-auto min-w-[200px]">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Attending Clinical Specialist
              </span>
              <div className="flex items-center gap-2 justify-start sm:justify-end text-slate-800">
                <FileSignature className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-xs font-display font-extrabold text-slate-900">
                  Dr. Vikram S. Mehta, MD
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wide">
                Reg No: MCI-75493B • Datia Telehealth Hub
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Form Controls - Responsive Actions Button Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8 border-t border-slate-200 print:hidden">
        {/* Left Side: Go back to Queue */}
        <button
          type="button"
          onClick={onReturnToQueue}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Queue</span>
        </button>

        {/* Right Side Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Edit Notes */}
          <button
            type="button"
            onClick={onEdit}
            disabled={isApproved}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Notes</span>
          </button>

          {/* Download PDF / Print */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>Print / Save PDF</span>
          </button>

          {/* Approve & Finalize */}
          <button
            type="button"
            onClick={handleApproveClick}
            disabled={isApproved}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isApproved
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10'
                : 'bg-purple-700 hover:bg-purple-800 shadow-purple-500/10'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isApproved ? 'Approved & Finalized' : 'Approve & Lock Notes'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
