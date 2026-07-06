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
  Check 
} from 'lucide-react';
import { Patient, ConsultationRecord, PrescriptionItem } from './DoctorDashboard';

interface ConsultationWorkspaceProps {
  patient: Patient;
  onCancel: () => void;
  onSaveDraft: (record: ConsultationRecord) => void;
  onComplete: (record: ConsultationRecord) => void;
}

export default function ConsultationWorkspace({
  patient,
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

  const handleSaveDraftClick = () => {
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
      referredTo: advice.trim() || 'Discharged with symptomatic advice.',
      completedAt: timeStr
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
        
        {/* Left Panel: Demographic info, vitals, symptoms, medical history */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Outlined Demographics Card */}
          <div className="bg-white border border-slate-150 rounded-[2rem] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-display font-bold text-lg border border-purple-100">
                {patient.name[0]}
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                patient.riskLevel === 'High Risk'
                  ? 'text-rose-600 bg-rose-50 border border-rose-100/40'
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
              <p className="text-xs text-slate-500 mt-0.5">
                Age: <span className="font-semibold text-slate-700">{patient.age}</span> • Gender: <span className="font-semibold text-slate-700">{patient.gender}</span> • Village: <span className="font-semibold text-slate-700">{patient.village}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Referred by: <span className="font-semibold text-slate-700">{patient.referredBy}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-50 space-y-1">
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">ASHA Intake Assessment</span>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "{patient.notes}"
              </p>
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported Symptoms</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {patient.symptoms.map((symptom, idx) => (
                <span key={idx} className="text-xs bg-slate-50 text-slate-700 border border-slate-150 px-3 py-1 rounded-full font-medium">
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Triage Vitals Check */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-2">
              <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
              <span>Triage Vitals Check</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {/* BP Vital Card */}
              {(() => {
                const isBpHigh = patient.vitals.bpSystolic >= 140 || patient.vitals.bpDiastolic >= 90;
                return (
                  <div className={`p-4 rounded-2xl border transition-all ${isBpHigh ? 'bg-rose-50/50 border-rose-150 text-rose-950' : 'bg-white border-slate-100'}`}>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Blood Pressure</span>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className={`text-base font-display font-extrabold ${isBpHigh ? 'text-rose-700' : 'text-slate-800'}`}>
                        {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">mmHg</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-2 ${
                      isBpHigh ? 'bg-rose-100 text-rose-700 border border-rose-200/50' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isBpHigh ? 'Elevated (Alert)' : 'Normal'}
                    </span>
                  </div>
                );
              })()}

              {/* Blood Sugar vital Card */}
              {(() => {
                const isSugarHigh = patient.vitals.bloodSugar >= 140;
                return (
                  <div className={`p-4 rounded-2xl border transition-all ${isSugarHigh ? 'bg-amber-50/50 border-amber-150 text-amber-950' : 'bg-white border-slate-100'}`}>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Random Sugar</span>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className={`text-base font-display font-extrabold ${isSugarHigh ? 'text-amber-700' : 'text-slate-800'}`}>
                        {patient.vitals.bloodSugar}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">mg/dL</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-2 ${
                      isSugarHigh ? 'bg-amber-100 text-amber-700 border border-amber-200/50' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isSugarHigh ? 'High (Alert)' : 'Normal'}
                    </span>
                  </div>
                );
              })()}

              {/* Temperature Vital Card */}
              {(() => {
                const isFever = patient.vitals.temperature >= 100.0;
                return (
                  <div className={`p-4 rounded-2xl border transition-all ${isFever ? 'bg-rose-50/50 border-rose-150 text-rose-950' : 'bg-white border-slate-100'}`}>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Temperature</span>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className={`text-base font-display font-extrabold ${isFever ? 'text-rose-700' : 'text-slate-800'}`}>
                        {patient.vitals.temperature}°F
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-2 ${
                      isFever ? 'bg-rose-100 text-rose-700 border border-rose-200/50' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isFever ? 'Fever peak' : 'Normal'}
                    </span>
                  </div>
                );
              })()}

              {/* Pulse Vital Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Pulse Rate</span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-base font-display font-extrabold text-slate-800">
                    {patient.vitals.pulse}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">BPM</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 inline-block mt-2">
                  Normal Range
                </span>
              </div>

              {/* Weight Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 col-span-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Body Weight</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-base font-display font-extrabold text-slate-800">
                        {patient.vitals.weight}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">kg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Triage Check</span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">Completed Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Medical History */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clipboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Patient Medical History</span>
            </h3>
            {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
              <ul className="space-y-2.5">
                {patient.medicalHistory.map((history, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2.5 leading-normal">
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
                <span>Advice, Post-Care Warnings, or PHC Referrals</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Refer to District Hospital for specialist Gynaecological check. Restrict dietary sodium. Warm saline compress. Return immediately if swelling spikes or vision shifts."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 rounded-xl px-4 py-3 text-xs outline-none text-slate-850 placeholder-slate-400 leading-relaxed transition-all"
              />
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
