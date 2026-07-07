import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  HeartPulse, 
  Clipboard, 
  FileText, 
  Pill, 
  Plus, 
  Trash2, 
  Send, 
  Clock, 
  Check,
  Sparkles,
  AlertCircle,
  FileDown,
  Activity,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { Patient, ConsultationRecord, PrescriptionItem } from './DoctorDashboard';
import { SavedReport } from '../services/reportService';
import { generateSOAPNotes } from '../services/geminiService';

interface ConsultationWorkspaceProps {
  patient: Patient;
  report?: SavedReport | null;
  onCancel: () => void;
  onSaveDraft: (record: ConsultationRecord) => void;
  onComplete: (record: ConsultationRecord) => void;
}

export default function ConsultationWorkspace({
  patient,
  report,
  onCancel,
  onSaveDraft,
  onComplete
}: ConsultationWorkspaceProps) {
  // Assessment Form States
  const [diagnosis, setDiagnosis] = useState(patient.consultation?.diagnosis || patient.consultation?.clinicalNotes || '');
  const [observations, setObservations] = useState(patient.consultation?.observations || patient.consultation?.clinicalNotes || '');
  const [advice, setAdvice] = useState(patient.consultation?.advice || patient.consultation?.referredTo || '');
  const [followUpDate, setFollowUpDate] = useState(
    patient.consultation?.followUpDate || 
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Editable Vitals States (Doctor can enter BP, Pulse, Sugar, Temp, Weight, Oxygen Saturation)
  const [bpSystolic, setBpSystolic] = useState(patient.vitals?.bpSystolic?.toString() || '120');
  const [bpDiastolic, setBpDiastolic] = useState(patient.vitals?.bpDiastolic?.toString() || '80');
  const [temperature, setTemperature] = useState(patient.vitals?.temperature?.toString() || '98.6');
  const [pulse, setPulse] = useState(patient.vitals?.pulse?.toString() || '72');
  const [weight, setWeight] = useState(patient.vitals?.weight?.toString() || '60');
  const [bloodSugar, setBloodSugar] = useState(patient.vitals?.bloodSugar?.toString() || '100');
  const [oxygenSaturation, setOxygenSaturation] = useState('98');

  // Referral states
  const [referralRequired, setReferralRequired] = useState(patient.consultation?.referral?.required || false);
  const [referralReason, setReferralReason] = useState(patient.consultation?.referral?.reason || '');

  // AI SOAP Note States
  const [isGeneratingSOAP, setIsGeneratingSOAP] = useState(false);
  const [soapSubjective, setSoapSubjective] = useState(patient.consultation?.soapNotes?.subjective || '');
  const [soapObjective, setSoapObjective] = useState(patient.consultation?.soapNotes?.objective || '');
  const [soapAssessment, setSoapAssessment] = useState(patient.consultation?.soapNotes?.assessment || '');
  const [soapPlan, setSoapPlan] = useState(patient.consultation?.soapNotes?.plan || '');
  const [soapError, setSoapError] = useState<string | null>(null);

  // Prescription Builder States
  const [prescriptionList, setPrescriptionList] = useState<PrescriptionItem[]>(patient.consultation?.prescription || []);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedFrequency, setNewMedFrequency] = useState('Twice daily (BD)');
  const [newMedTiming, setNewMedTiming] = useState('After meals (PC)');

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

  const handleGenerateSOAP = async () => {
    setIsGeneratingSOAP(true);
    setSoapError(null);
    try {
      const requestPayload = {
        patientInformation: report?.patientInformation || {
          fullName: patient.name,
          age: patient.age,
          gender: patient.gender,
          village: patient.village,
          district: 'Rural Outpost'
        },
        symptoms: report?.geminiAnalysis?.detectedSymptoms || patient.symptoms,
        medicalHistory: report?.medicalHistory || {
          chronicDiseases: patient.medicalHistory?.filter(h => !h.includes('Allergies') && !h.includes('Medications')) || [],
          medications: [],
          allergies: []
        },
        vitals: {
          bpSystolic: parseInt(bpSystolic) || 120,
          bpDiastolic: parseInt(bpDiastolic) || 80,
          pulse: parseInt(pulse) || 72,
          temperature: parseFloat(temperature) || 98.6,
          weight: parseInt(weight) || 60,
          oxygenSaturation: parseInt(oxygenSaturation) || 98
        },
        clinicalObservations: observations
      };

      const result = await generateSOAPNotes(requestPayload);
      setSoapSubjective(result.subjective);
      setSoapObjective(result.objective);
      setSoapAssessment(result.assessment);
      setSoapPlan(result.plan);
    } catch (err: any) {
      console.error("SOAP Note Generation Error:", err);
      setSoapError(err.message || "An unexpected error occurred during SOAP note generation.");
    } finally {
      setIsGeneratingSOAP(false);
    }
  };

  const handleSaveDraftClick = () => {
    const record: ConsultationRecord = {
      diagnosis: diagnosis.trim(),
      observations: observations.trim(),
      prescription: prescriptionList,
      advice: advice.trim(),
      followUpDate: followUpDate,
      clinicalNotes: diagnosis.trim() || observations.trim() || 'Draft consultation',
      referredTo: referralRequired ? referralReason.trim() || advice.trim() : advice.trim() || 'Discharged with symptomatic advice',
      completedAt: 'Draft',
      soapNotes: {
        subjective: soapSubjective,
        objective: soapObjective,
        assessment: soapAssessment,
        plan: soapPlan
      },
      vitals: {
        bpSystolic: parseInt(bpSystolic) || 120,
        bpDiastolic: parseInt(bpDiastolic) || 80,
        pulse: parseInt(pulse) || 72,
        temperature: parseFloat(temperature) || 98.6,
        weight: parseInt(weight) || 60,
        oxygenSaturation: parseInt(oxygenSaturation) || 98
      },
      referral: {
        required: referralRequired,
        reason: referralReason
      }
    };
    onSaveDraft(record);
  };

  const handleCompleteClick = () => {
    if (!diagnosis.trim()) {
      alert("Please enter a Diagnosis / Clinical Impression before completing the consultation.");
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
      referredTo: referralRequired ? referralReason.trim() || advice.trim() : advice.trim() || 'Discharged with symptomatic advice.',
      completedAt: timeStr,
      soapNotes: {
        subjective: soapSubjective,
        objective: soapObjective,
        assessment: soapAssessment,
        plan: soapPlan
      },
      vitals: {
        bpSystolic: parseInt(bpSystolic) || 120,
        bpDiastolic: parseInt(bpDiastolic) || 80,
        pulse: parseInt(pulse) || 72,
        temperature: parseFloat(temperature) || 98.6,
        weight: parseInt(weight) || 60,
        oxygenSaturation: parseInt(oxygenSaturation) || 98
      },
      referral: {
        required: referralRequired,
        reason: referralReason
      }
    };
    onComplete(record);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100/40">
                Consultation Workspace
              </span>
              <span className="text-xs text-slate-400 font-mono">Patient ID: {patient.id}</span>
            </div>
            <h1 className="text-xl font-display font-black text-slate-900 mt-1">
              Active Medical Assessment
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping inline-block" />
          <span className="text-xs font-mono font-bold text-purple-700 uppercase tracking-wider">
            Clinical Check-In • {patient.visitTime}
          </span>
        </div>
      </div>

      {/* Two-Column Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Demographic info, vitals, symptoms, medical history, Gemini analysis, and uploaded documents */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Outlined Demographics Card */}
          <div className="bg-white border border-slate-150 rounded-[2rem] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-display font-bold text-lg border border-purple-100">
                {patient.name[0]}
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                patient.riskLevel === 'High Risk'
                  ? 'text-rose-600 bg-rose-50 border border-rose-100/40 animate-pulse'
                  : patient.riskLevel === 'Medium Risk'
                    ? 'text-amber-600 bg-amber-50 border border-amber-100/40'
                    : 'text-emerald-600 bg-emerald-50 border border-emerald-100/40'
              }`}>
                {patient.riskLevel} Priority
              </span>
            </div>

            <div>
              <h2 className="text-lg font-display font-extrabold text-slate-900">
                {patient.name}
              </h2>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2.5 text-xs text-slate-500">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Age / Gender</span>
                  <span className="font-semibold text-slate-800">{patient.age} Yrs / {patient.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Village Origin</span>
                  <span className="font-semibold text-slate-800">{patient.village}</span>
                </div>
                {report?.patientInformation?.district && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">District</span>
                    <span className="font-semibold text-slate-800">{report.patientInformation.district}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Referred By</span>
                  <span className="font-semibold text-slate-800">{patient.referredBy}</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 space-y-1">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">ASHA Case Notes</span>
              <p className="text-xs text-slate-650 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{patient.notes || 'No standard notes reported.'}"
              </p>
            </div>
          </div>

          {/* Reported Symptoms */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported Symptoms</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {report?.geminiAnalysis?.detectedSymptoms && report.geminiAnalysis.detectedSymptoms.length > 0 ? (
                report.geminiAnalysis.detectedSymptoms.map((symptom, idx) => (
                  <span key={idx} className="text-xs bg-slate-50 text-slate-700 border border-slate-150 px-3 py-1 rounded-full font-medium">
                    {symptom}
                  </span>
                ))
              ) : (
                patient.symptoms.map((symptom, idx) => (
                  <span key={idx} className="text-xs bg-slate-50 text-slate-700 border border-slate-150 px-3 py-1 rounded-full font-medium">
                    {symptom}
                  </span>
                ))
              )}
            </div>
            {report?.symptoms && (
              <p className="text-xs text-slate-500 mt-2 leading-relaxed pl-1">
                <strong className="text-slate-650 block text-[10px] uppercase font-mono tracking-wider">Symptoms Details:</strong>
                {report.symptoms}
              </p>
            )}
          </div>

          {/* Patient Medical History */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clipboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Patient Medical History</span>
            </h3>
            <div className="space-y-3">
              {report?.medicalHistory ? (
                <div className="space-y-3 text-xs text-slate-650">
                  {report.medicalHistory.chronicDiseases && report.medicalHistory.chronicDiseases.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">Chronic Conditions</span>
                      <p className="text-slate-800 font-semibold mt-0.5">{report.medicalHistory.chronicDiseases.join(', ')}</p>
                    </div>
                  )}
                  {report.medicalHistory.medications && report.medicalHistory.medications.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">Current Medications</span>
                      <p className="text-slate-800 font-semibold mt-0.5">{report.medicalHistory.medications.join(', ')}</p>
                    </div>
                  )}
                  {report.medicalHistory.allergies && report.medicalHistory.allergies.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase tracking-wider">Known Allergies</span>
                      <p className="text-rose-700 font-semibold mt-0.5">{report.medicalHistory.allergies.join(', ')}</p>
                    </div>
                  )}
                </div>
              ) : patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                <ul className="space-y-2.5">
                  {patient.medicalHistory.map((history, idx) => (
                    <li key={idx} className="text-xs text-slate-650 flex items-start gap-2.5 leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                      <span>{history}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No historical systemic chronic conditions or drug allergy contraindications reported by ASHA triage.</p>
              )}
            </div>
          </div>

          {/* Gemini AI Analysis Card (If available on report) */}
          {report?.geminiAnalysis && (
            <div className="bg-purple-950 text-purple-100 border border-purple-800 rounded-[2rem] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-purple-300">
                    Gemini Clinical Triage
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-purple-400 block uppercase">AI Confidence</span>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    {(() => {
                      const conf = report.geminiAnalysis.confidence || 0;
                      const val = conf > 1 ? conf : conf * 100;
                      return `${val.toFixed(0)}%`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="w-full bg-purple-900/60 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-400 h-full rounded-full"
                  style={{
                    width: (() => {
                      const conf = report.geminiAnalysis.confidence || 0;
                      const val = conf > 1 ? conf : conf * 100;
                      return `${val}%`;
                    })()
                  }}
                />
              </div>

              {/* Potential Health Concerns */}
              {report.geminiAnalysis.possibleHealthConcerns && report.geminiAnalysis.possibleHealthConcerns.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider block">Differential Screen Concerns</span>
                  <ul className="space-y-1.5">
                    {report.geminiAnalysis.possibleHealthConcerns.map((concern, idx) => (
                      <li key={idx} className="text-xs text-purple-100 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Priority Reasoning */}
              {report.geminiAnalysis.doctorSummary && (
                <div className="pt-3 border-t border-purple-800 space-y-1">
                  <span className="text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider block">AI Doctor Summary</span>
                  <p className="text-xs text-purple-200 leading-relaxed italic">
                    "{report.geminiAnalysis.doctorSummary}"
                  </p>
                </div>
              )}

              {/* Recommended Action */}
              {report.geminiAnalysis.recommendedAction && (
                <div className="bg-purple-900/40 p-3 rounded-xl border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
                  <strong className="text-purple-300 block font-mono text-[10px] uppercase tracking-wider mb-0.5">Recommended Clinical Response:</strong>
                  {report.geminiAnalysis.recommendedAction}
                </div>
              )}
            </div>
          )}

          {/* Uploaded Documents */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Uploaded Documents</span>
            </h4>
            {report?.uploadedDocuments && report.uploadedDocuments.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5">
                {report.uploadedDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{doc.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{doc.size || 'Unknown size'}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => alert(`Downloading "${doc.name}" is simulated.`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-750 hover:bg-slate-200/50 transition-colors cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No secondary medical reports or diagnostic uploads provided.</p>
            )}
          </div>

        </div>

        {/* Right Panel: Doctor Assessment Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-150 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <FileText className="w-4 h-4 text-purple-600" />
              <h2 className="font-display font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                Clinical Assessment Form
              </h2>
            </div>

            {/* Diagnosis Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Diagnosis / Clinical Impression <span className="text-rose-500">*</span></span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Required</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gestational Hypertension / Uncontrolled Type 2 Diabetes"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 font-medium transition-all"
              />
            </div>

            {/* Observations Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Clinical Observations / Physical Exam Findings
              </label>
              <textarea
                rows={4}
                placeholder="Describe active clinical signs, cardiopulmonary exam findings, fetal heart rate checks, edema grading, etc."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed transition-all"
              />
            </div>

            {/* Editable Doctor Vitals Re-entry */}
            <div className="space-y-3.5 pt-4 border-t border-slate-50">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-500" />
                <span>Active Clinical Evaluation Vitals</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* BP Systolic */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-xl px-3 py-2 text-xs outline-none text-slate-850 font-semibold"
                  />
                </div>
                {/* BP Diastolic */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-xl px-3 py-2 text-xs outline-none text-slate-850 font-semibold"
                  />
                </div>
                {/* Pulse */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Pulse Rate (BPM)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-xl px-3 py-2 text-xs outline-none text-slate-850 font-semibold"
                  />
                </div>
                {/* Temperature */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-xl px-3 py-2 text-xs outline-none text-slate-850 font-semibold"
                  />
                </div>
                {/* Weight */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Body Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-xl px-3 py-2 text-xs outline-none text-slate-850 font-semibold"
                  />
                </div>
                {/* Oxygen Saturation */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Oxygen Sat. (%)</label>
                  <input
                    type="number"
                    value={oxygenSaturation}
                    onChange={(e) => setOxygenSaturation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-xl px-3 py-2 text-xs outline-none text-slate-850 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* AI SOAP Section */}
            <div className="space-y-4 pt-4 border-t border-slate-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/40 p-4 rounded-2xl border border-purple-100">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-bold text-slate-800">Gemini Clinical Scribe</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                      Auto-generate a draft SOAP (Subjective, Objective, Assessment, Plan) note. AI-generated notes must be reviewed and edited.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isGeneratingSOAP}
                  onClick={handleGenerateSOAP}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 transition-colors cursor-pointer shadow-sm shrink-0 flex items-center justify-center gap-1.5"
                >
                  {isGeneratingSOAP ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Scribe...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate SOAP Notes</span>
                    </>
                  )}
                </button>
              </div>

              {soapError && (
                <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-[11px] leading-relaxed flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{soapError}</span>
                </div>
              )}

              {/* If soap notes have been generated or are being edited, display them */}
              {(soapSubjective || soapObjective || soapAssessment || soapPlan) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold inline-block">
                    SOAP Scribe Notes (Editable Review)
                  </span>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Subjective Text Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px]">S</span>
                        <span>Subjective Note</span>
                      </label>
                      <textarea
                        rows={3}
                        value={soapSubjective}
                        onChange={(e) => setSoapSubjective(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed font-medium"
                      />
                    </div>

                    {/* Objective Text Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-[10px]">O</span>
                        <span>Objective Note</span>
                      </label>
                      <textarea
                        rows={3}
                        value={soapObjective}
                        onChange={(e) => setSoapObjective(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed font-medium"
                      />
                    </div>

                    {/* Assessment Text Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px]">A</span>
                        <span>Assessment Note (No definitive diagnoses)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={soapAssessment}
                        onChange={(e) => setSoapAssessment(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed font-medium"
                      />
                    </div>

                    {/* Plan Text Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px]">P</span>
                        <span>Plan Note (No specific Rx)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={soapPlan}
                        onChange={(e) => setSoapPlan(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed font-medium"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Prescription Builder */}
            <div className="space-y-3 pt-2 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-purple-500" />
                  <span>Therapeutics & Rx Prescription</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{prescriptionList.length} medications added</span>
              </div>

              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Medicine Name Input */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tab. Methyldopa 250mg, Tab. Metformin 500mg, Paracetamol"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-xl px-3 py-2 text-xs outline-none text-slate-850 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>

                  {/* Dosage Select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Dosage</label>
                    <select
                      value={newMedDosage}
                      onChange={(e) => setNewMedDosage(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none text-slate-700 font-medium"
                    >
                      <option value="1 tablet">1 tablet</option>
                      <option value="2 tablets">2 tablets</option>
                      <option value="1/2 tablet">1/2 tablet</option>
                      <option value="1 capsule">1 capsule</option>
                      <option value="5 ml">5 ml</option>
                      <option value="10 ml">10 ml</option>
                      <option value="2 drops">2 drops</option>
                      <option value="1 injection">1 injection</option>
                    </select>
                  </div>

                  {/* Frequency Select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Frequency</label>
                    <select
                      value={newMedFrequency}
                      onChange={(e) => setNewMedFrequency(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none text-slate-700 font-medium"
                    >
                      <option value="Once daily (OD)">Once daily (OD)</option>
                      <option value="Twice daily (BD)">Twice daily (BD)</option>
                      <option value="Three times daily (TDS)">Three times daily (TDS)</option>
                      <option value="Four times daily (QDS)">Four times daily (QDS)</option>
                      <option value="As needed (PRN)">As needed (PRN)</option>
                      <option value="At bedtime (HS)">At bedtime (HS)</option>
                    </select>
                  </div>

                  {/* Timing Select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Timing</label>
                    <select
                      value={newMedTiming}
                      onChange={(e) => setNewMedTiming(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none text-slate-700 font-medium"
                    >
                      <option value="After meals (PC)">After meals (PC)</option>
                      <option value="Before meals (AC)">Before meals (AC)</option>
                      <option value="With meals (CC)">With meals (CC)</option>
                      <option value="At bedtime (HS)">At bedtime (HS)</option>
                      <option value="Empty stomach">Empty stomach</option>
                    </select>
                  </div>

                  {/* Add Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Medication</span>
                    </button>
                  </div>
                </div>

                {/* List of currently added prescriptions */}
                {prescriptionList.length > 0 ? (
                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden mt-2">
                    <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-100 px-3 py-2 text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                      <span className="col-span-4">Medicine</span>
                      <span className="col-span-2">Dosage</span>
                      <span className="col-span-3">Frequency</span>
                      <span className="col-span-2">Timing</span>
                      <span className="col-span-1 text-center">Action</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {prescriptionList.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 px-3 py-2.5 items-center text-xs text-slate-700 font-medium">
                          <span className="col-span-4 text-slate-900 font-semibold truncate pr-1">{item.name}</span>
                          <span className="col-span-2 truncate">{item.dosage}</span>
                          <span className="col-span-3 truncate text-slate-600">{item.frequency}</span>
                          <span className="col-span-2 truncate text-slate-500">{item.timing}</span>
                          <span className="col-span-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveMedication(index)}
                              className="p-1 rounded-md hover:bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-center">
                    <Pill className="w-6 h-6 text-slate-300 mb-1.5" />
                    <span className="text-[11px] font-bold text-slate-600">No medications prescribed yet</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Use the medication controls above to construct prescriptions.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Advice / Referrals Field */}
            <div className="space-y-1.5 pt-2 border-t border-slate-50">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-purple-500" />
                <span>Advice & Post-Care Warnings</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Restrict dietary sodium. Warm saline compress. Return immediately if swelling spikes or vision shifts."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed transition-all"
              />
            </div>

            {/* Refer Option Field */}
            <div className="space-y-3 pt-3 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="referralRequired"
                  checked={referralRequired}
                  onChange={(e) => setReferralRequired(e.target.checked)}
                  className="w-4 h-4 text-purple-650 bg-slate-50 border-slate-200 rounded focus:ring-purple-400/30 cursor-pointer"
                />
                <label htmlFor="referralRequired" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 select-none">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>Refer Patient to Specialist / District Hospital</span>
                </label>
              </div>

              {referralRequired && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5 pl-6"
                >
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Referral Reason & Destination Hospital</label>
                  <textarea
                    rows={2}
                    required={referralRequired}
                    placeholder="e.g. Refer to District Hospital for specialist Gynaecological check and fetal monitoring due to gestational hypertension."
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed transition-all font-medium"
                  />
                </motion.div>
              )}
            </div>

            {/* Follow-up Date Field */}
            <div className="space-y-1.5 pt-2 border-t border-slate-50">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>Recommended Follow-Up Date</span>
              </label>
              <div>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-700 transition-all font-medium"
                />
              </div>
            </div>

            {/* Actions Button Row */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Cancel consultation? Any unsaved assessments will be lost.")) {
                    onCancel();
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveDraftClick}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold cursor-pointer"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleCompleteClick}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white transition-colors text-xs font-bold cursor-pointer shadow-md shadow-purple-500/10 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Complete Consultation</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
