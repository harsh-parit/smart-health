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
  Clock 
} from 'lucide-react';
import { Patient } from './DoctorDashboard';

interface PatientDetailsModalProps {
  patient: Patient | null;
  onClose: () => void;
  onStartConsultation?: (patient: Patient) => void;
}

export default function PatientDetailsModal({
  patient,
  onClose,
  onStartConsultation
}: PatientDetailsModalProps) {
  if (!patient) return null;

  const isHigh = patient.riskLevel === 'High Risk';
  const isMed = patient.riskLevel === 'Medium Risk';

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
        className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10 relative flex flex-col"
      >
        {/* Header (Sticky) */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-display font-extrabold text-sm border border-purple-100">
              {patient.name[0]}
            </div>
            <div>
              <h3 className="font-display font-black text-slate-900 text-sm">{patient.name}</h3>
              <p className="text-[11px] text-slate-400">Patient ID: {patient.id} • Checked In Today</p>
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
        <div className="p-6 space-y-6">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100/50 text-center">
            <div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Age</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block">{patient.age} Years</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Gender</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block">{patient.gender}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Village</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{patient.village}</span>
            </div>
          </div>

          {/* Core Reported Symptoms */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported Symptoms & Notes</span>
            </h4>
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {patient.symptoms.map((s, idx) => (
                  <span key={idx} className="text-[11px] font-semibold bg-white border border-slate-150 text-slate-700 px-2.5 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed pt-2 border-t border-slate-100">
                "{patient.notes || 'No triage notes specified.'}"
              </p>
            </div>
          </div>

          {/* Vitals Grid with Visual Alerts */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
              <span>Triage Vitals Check</span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* BP Card */}
              {(() => {
                const isBpHigh = patient.vitals.bpSystolic >= 140 || patient.vitals.bpDiastolic >= 90;
                return (
                  <div className={`p-3 rounded-xl border ${isBpHigh ? 'bg-rose-50/50 border-rose-100 text-rose-950' : 'bg-white border-slate-100'}`}>
                    <span className="text-[9px] font-mono text-slate-400 block">Blood Pressure</span>
                    <strong className={`text-xs font-extrabold mt-0.5 block ${isBpHigh ? 'text-rose-700' : 'text-slate-800'}`}>
                      {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic} mmHg
                    </strong>
                    <span className={`text-[8px] font-bold px-1 py-0.2 rounded mt-1.5 inline-block ${isBpHigh ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isBpHigh ? 'High Alert' : 'Normal'}
                    </span>
                  </div>
                );
              })()}

              {/* Blood Sugar Card */}
              {(() => {
                const isSugarHigh = patient.vitals.bloodSugar >= 140;
                return (
                  <div className={`p-3 rounded-xl border ${isSugarHigh ? 'bg-amber-50/50 border-amber-100 text-amber-950' : 'bg-white border-slate-100'}`}>
                    <span className="text-[9px] font-mono text-slate-400 block">Blood Sugar</span>
                    <strong className={`text-xs font-extrabold mt-0.5 block ${isSugarHigh ? 'text-amber-700' : 'text-slate-800'}`}>
                      {patient.vitals.bloodSugar} mg/dL
                    </strong>
                    <span className={`text-[8px] font-bold px-1 py-0.2 rounded mt-1.5 inline-block ${isSugarHigh ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isSugarHigh ? 'High Alert' : 'Normal'}
                    </span>
                  </div>
                );
              })()}

              {/* Temperature Card */}
              {(() => {
                const isFever = patient.vitals.temperature >= 100.0;
                return (
                  <div className={`p-3 rounded-xl border ${isFever ? 'bg-rose-50/50 border-rose-100 text-rose-950' : 'bg-white border-slate-100'}`}>
                    <span className="text-[9px] font-mono text-slate-400 block">Temperature</span>
                    <strong className={`text-xs font-extrabold mt-0.5 block ${isFever ? 'text-rose-700' : 'text-slate-800'}`}>
                      {patient.vitals.temperature}°F
                    </strong>
                    <span className={`text-[8px] font-bold px-1 py-0.2 rounded mt-1.5 inline-block ${isFever ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isFever ? 'Fever' : 'Normal'}
                    </span>
                  </div>
                );
              })()}

              {/* Pulse Card */}
              <div className="p-3 bg-white border border-slate-100 rounded-xl">
                <span className="text-[9px] font-mono text-slate-400 block">Pulse Rate</span>
                <strong className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                  {patient.vitals.pulse} BPM
                </strong>
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-500 mt-1.5 inline-block">
                  Normal
                </span>
              </div>

              {/* Weight Card */}
              <div className="p-3 bg-white border border-slate-100 rounded-xl">
                <span className="text-[9px] font-mono text-slate-400 block">Body Weight</span>
                <strong className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                  {patient.vitals.weight} kg
                </strong>
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-500 mt-1.5 inline-block">
                  Recorded
                </span>
              </div>

              {/* Risk Level Badge Card */}
              <div className="p-3 bg-white border border-slate-100 rounded-xl">
                <span className="text-[9px] font-mono text-slate-400 block">Risk Priority</span>
                <strong className={`text-xs font-extrabold mt-0.5 block ${isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {patient.riskLevel}
                </strong>
                <span className={`text-[8px] font-bold px-1 py-0.2 rounded mt-1.5 inline-block ${
                  isHigh ? 'bg-rose-50 text-rose-600' : isMed ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  Triage Status
                </span>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clipboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Patient Medical History</span>
            </h4>
            {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                <ul className="space-y-2">
                  {patient.medicalHistory.map((hist, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                      <span>{hist}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No historical systemic chronic conditions or allergies reported.</p>
            )}
          </div>

          {/* Completed Consultation Record details */}
          {patient.consultation ? (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Completed Consultation Record</span>
              </h4>
              
              <div className="bg-purple-50/20 border border-purple-100/40 rounded-2xl p-5 space-y-4">
                {/* Diagnosis */}
                <div>
                  <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">Diagnosis</span>
                  <strong className="text-sm font-display font-extrabold text-slate-800 block mt-0.5">
                    {patient.consultation.diagnosis}
                  </strong>
                </div>

                {/* Observations */}
                {patient.consultation.observations && (
                  <div>
                    <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">Clinical Observations</span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                      {patient.consultation.observations}
                    </p>
                  </div>
                )}

                {/* Prescription List */}
                {patient.consultation.prescription && patient.consultation.prescription.length > 0 && (
                  <div>
                    <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block mb-1.5">Prescribed Therapeutics</span>
                    <div className="bg-white border border-purple-100/25 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-purple-50/50 border-b border-purple-100/25 text-[9px] font-mono text-purple-500 uppercase font-bold">
                            <th className="px-3 py-1.5">Medicine</th>
                            <th className="px-3 py-1.5">Dosage</th>
                            <th className="px-3 py-1.5">Frequency</th>
                            <th className="px-3 py-1.5">Timing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {patient.consultation.prescription.map((m, idx) => (
                            <tr key={idx} className="text-xs text-slate-700 font-medium">
                              <td className="px-3 py-2 font-semibold text-slate-900">{m.name}</td>
                              <td className="px-3 py-2">{m.dosage}</td>
                              <td className="px-3 py-2 text-slate-600">{m.frequency}</td>
                              <td className="px-3 py-2 text-slate-500">{m.timing}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Advice */}
                {patient.consultation.advice && (
                  <div>
                    <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wider block">Clinical Advice & Warnings</span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {patient.consultation.advice}
                    </p>
                  </div>
                )}

                {/* Follow up date */}
                {patient.consultation.followUpDate && (
                  <div className="flex items-center gap-2 pt-2 border-t border-purple-100/20 text-xs">
                    <span className="text-[9px] font-mono text-purple-500 uppercase font-bold">Recommended Follow-up Date:</span>
                    <span className="font-bold text-slate-700">{patient.consultation.followUpDate}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 text-center py-4">
              <p className="text-xs text-slate-400 italic">No formal consultation logs or electronic medical prescriptions saved yet.</p>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all text-xs font-bold cursor-pointer"
          >
            Close Profile
          </button>

          {patient.status !== 'Completed' && onStartConsultation && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartConsultation(patient);
              }}
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-500/10"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>
                {patient.status === 'In Consultation' ? 'Resume Consultation' : 'Start Consultation'}
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
