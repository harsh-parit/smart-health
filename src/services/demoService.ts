import { collection, doc, setDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, getCollectionName } from '../lib/firebase';
import { SavedReport, DemoEvent } from '../types';

// Retrieve demo events from LocalStorage
export function getDemoEvents(): DemoEvent[] {
  const data = localStorage.getItem('sh_demo_timeline');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Add a new demo event to LocalStorage and notify subscribers
export function addDemoEvent(event: Omit<DemoEvent, 'id' | 'timestamp'>): void {
  const currentEvents = getDemoEvents();
  const newEvent: DemoEvent = {
    ...event,
    id: Math.random().toString(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  localStorage.setItem('sh_demo_timeline', JSON.stringify([newEvent, ...currentEvents].slice(0, 50)));
  window.dispatchEvent(new Event('sh_demo_timeline_updated'));
}

// Reset the event timeline
export function clearDemoEvents(): void {
  localStorage.removeItem('sh_demo_timeline');
  window.dispatchEvent(new Event('sh_demo_timeline_updated'));
}

// Villages to select from
const VILLAGES = ['Datia Central', 'Bhander', 'Indergarh', 'Seondha', 'Unao Village'];
const GENDERS = ['Male', 'Female'];

const CITIZEN_NAMES = [
  'Amit Patel', 'Pooja Sharma', 'Rajesh Jatav', 'Sushma Devi', 'Vikram Singh',
  'Karan Johar', 'Neha Gupta', 'Anil Mishra', 'Sunita Yadav', 'Vijay Kumar',
  'Ritu Rajput', 'Aarti Rathore', 'Jyoti Kushwah', 'Deepak Sahu', 'Sanjay Verma'
];

const LOW_RISK_SYMPTOMS = [
  { symptoms: 'Mild runny nose, occasional dry cough, no breathing difficulty.', summary: 'Common seasonal cold', concern: 'Mild Viral Rhinitis' },
  { symptoms: 'Slight muscle fatigue after farm work, minor tension headache.', summary: 'Physical exhaustion and dehydration', concern: 'Fatigue' },
  { symptoms: 'Minor throat irritation, sneezes, no active fever.', summary: 'Allergic rhinitis flareup', concern: 'Seasonal Allergy' }
];

const MEDIUM_RISK_SYMPTOMS = [
  { symptoms: 'Fasting glucose 255 mg/dL with recurrent nocturnal polyuria and dry mouth.', summary: 'Uncontrolled hyperglycemia clinical signal', concern: 'Type 2 Diabetes Mellitus' },
  { symptoms: 'Resting blood pressure 165/104 mmHg, mild chest pressure, throbbing headache.', summary: 'Stage 2 Hypertension crisis warning', concern: 'Hypertension' },
  { symptoms: 'Chronic dry wheeze, persistent morning cough, respiratory tightness.', summary: 'Acute respiratory irritation in COPD background', concern: 'COPD Exacerbation' }
];

const HIGH_RISK_SYMPTOMS = [
  { symptoms: 'High fever of 103.5F for 4 days, severe retro-orbital bone pain, multiple red rashes on trunk.', summary: 'Severe Dengue fever presenting with potential hemorrhage threat', concern: 'Dengue Outbreak Risk' },
  { symptoms: 'Sudden severe chills, extreme rigor shaking, high fever spike, severe vomiting.', summary: 'Malaria febrile paroxysm cluster', concern: 'Malaria Cluster' },
  { symptoms: 'Profuse watery rice-water diarrhea, rapid stomach cramps, severe skin turgor loss, dry lips.', summary: 'Severe dehydrating gastroenteritis signal representing Cholera hazard', concern: 'Gastroenteritis Outbreak' }
];

// Helper to generate a sequential report ID format: SHAI-2026-XXXXXX
function makeReportId(index: number): string {
  return `SHAI-2026-${String(index).padStart(6, '0')}`;
}

/**
 * 1. Generate Citizens (Populates simulated users and base records)
 */
export async function generateDemoCitizens(count: number = 10): Promise<void> {
  addDemoEvent({
    type: 'system',
    title: 'Generating Citizens',
    description: `Initiated generation of ${count} citizen records into the isolated database.`,
    severity: 'info'
  });

  for (let i = 0; i < count; i++) {
    const name = CITIZEN_NAMES[i % CITIZEN_NAMES.length];
    const age = Math.floor(Math.random() * 55) + 18;
    const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
    const village = VILLAGES[Math.floor(Math.random() * VILLAGES.length)];
    const uid = `demo-u-${Math.random().toString(36).substr(2, 9)}`;

    // Set User Profile in demo_users
    await setDoc(doc(db, getCollectionName('users'), uid), {
      uid,
      name,
      email: `${name.toLowerCase().replace(' ', '')}@demo.smarthealth.ai`,
      role: 'citizen',
      district: 'Datia',
      village,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });

    addDemoEvent({
      type: 'citizen_created',
      title: 'Citizen Registered',
      description: `${name} (${age}y, ${gender}) from ${village} onboarded successfully.`,
      severity: 'low'
    });
  }
}

/**
 * 2. Generate Risk Cases (High, Medium, Low)
 */
export async function generateDemoRiskCases(
  highCount: number = 5,
  mediumCount: number = 8,
  lowCount: number = 15
): Promise<void> {
  addDemoEvent({
    type: 'system',
    title: 'Injecting Clinical Triage',
    description: `Generating ${highCount} High, ${mediumCount} Medium, and ${lowCount} Low Risk active reports.`,
    severity: 'info'
  });

  let reportIdx = Math.floor(Math.random() * 900) + 100;

  // Generate Low Risk
  for (let i = 0; i < lowCount; i++) {
    const name = CITIZEN_NAMES[Math.floor(Math.random() * CITIZEN_NAMES.length)];
    const age = Math.floor(Math.random() * 50) + 18;
    const village = VILLAGES[Math.floor(Math.random() * VILLAGES.length)];
    const sObj = LOW_RISK_SYMPTOMS[i % LOW_RISK_SYMPTOMS.length];
    const reportId = makeReportId(reportIdx++);

    const report: SavedReport = {
      reportId,
      patientId: `demo-p-low-${i}`,
      patientInformation: {
        fullName: name,
        age,
        gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
        village,
        district: 'Datia'
      },
      medicalHistory: { chronicDiseases: [], medications: [], allergies: [] },
      symptoms: sObj.symptoms,
      uploadedDocuments: [],
      geminiAnalysis: {
        patientSummary: `${age}y patient presenting with ${sObj.summary.toLowerCase()}.`,
        riskLevel: 'LOW',
        confidence: 85,
        detectedSymptoms: [sObj.concern],
        possibleHealthConcerns: [sObj.concern],
        recommendedAction: 'Rest, routine monitoring.',
        doctorSummary: 'Stable case.',
        medicalDisclaimer: 'AI Triage evaluation only.'
      },
      riskLevel: 'LOW',
      confidence: 85,
      recommendedAction: 'Standard self-care advice.',
      doctorSummary: 'Outpatient management.',
      medicalDisclaimer: 'AI Triage evaluation.',
      status: 'Pending Doctor Review',
      createdAt: { seconds: (Date.now() - (i * 3600 * 1000)) / 1000 },
      updatedAt: { seconds: Date.now() / 1000 }
    };

    await setDoc(doc(db, getCollectionName('patientReports'), reportId), report);
    addDemoEvent({
      type: 'case_created',
      title: 'Low Risk Case Logged',
      description: `Report ${reportId}: ${name} (${village}) - ${sObj.concern}.`,
      severity: 'low'
    });
  }

  // Generate Medium Risk
  for (let i = 0; i < mediumCount; i++) {
    const name = CITIZEN_NAMES[Math.floor(Math.random() * CITIZEN_NAMES.length)];
    const age = Math.floor(Math.random() * 45) + 25;
    const village = VILLAGES[Math.floor(Math.random() * VILLAGES.length)];
    const sObj = MEDIUM_RISK_SYMPTOMS[i % MEDIUM_RISK_SYMPTOMS.length];
    const reportId = makeReportId(reportIdx++);

    const report: SavedReport = {
      reportId,
      patientId: `demo-p-med-${i}`,
      patientInformation: {
        fullName: name,
        age,
        gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
        village,
        district: 'Datia'
      },
      medicalHistory: {
        chronicDiseases: sObj.concern.includes('Diabetes') ? ['Type 2 Diabetes'] : sObj.concern.includes('Hypertension') ? ['Hypertension'] : ['None'],
        medications: [],
        allergies: []
      },
      symptoms: sObj.symptoms,
      uploadedDocuments: [],
      geminiAnalysis: {
        patientSummary: `${age}y presenting with symptoms indicative of chronic exacerbation.`,
        riskLevel: 'MEDIUM',
        confidence: 80,
        detectedSymptoms: [sObj.concern],
        possibleHealthConcerns: [sObj.concern],
        recommendedAction: 'Refer to PHC physician outpatient clinic.',
        doctorSummary: 'Requires chronic review.',
        medicalDisclaimer: 'AI Triage evaluation only.'
      },
      riskLevel: 'MEDIUM',
      confidence: 80,
      recommendedAction: 'PHC clinic consult recommended.',
      doctorSummary: 'Awaiting primary physical examination.',
      medicalDisclaimer: 'AI Triage evaluation.',
      status: 'Pending Doctor Review',
      createdAt: { seconds: (Date.now() - (i * 2 * 3600 * 1000)) / 1000 },
      updatedAt: { seconds: Date.now() / 1000 }
    };

    await setDoc(doc(db, getCollectionName('patientReports'), reportId), report);
    addDemoEvent({
      type: 'case_created',
      title: 'Medium Risk Case Logged',
      description: `Report ${reportId}: ${name} (${village}) flagged for ${sObj.concern}.`,
      severity: 'medium'
    });
  }

  // Generate High Risk
  for (let i = 0; i < highCount; i++) {
    const name = CITIZEN_NAMES[Math.floor(Math.random() * CITIZEN_NAMES.length)];
    const age = Math.floor(Math.random() * 55) + 20;
    const village = VILLAGES[Math.floor(Math.random() * VILLAGES.length)];
    const sObj = HIGH_RISK_SYMPTOMS[i % HIGH_RISK_SYMPTOMS.length];
    const reportId = makeReportId(reportIdx++);

    const report: SavedReport = {
      reportId,
      patientId: `demo-p-high-${i}`,
      patientInformation: {
        fullName: name,
        age,
        gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
        village,
        district: 'Datia'
      },
      medicalHistory: { chronicDiseases: [], medications: [], allergies: [] },
      symptoms: sObj.symptoms,
      uploadedDocuments: [],
      geminiAnalysis: {
        patientSummary: `CRITICAL: ${age}y displaying classic symptoms of ${sObj.summary.toLowerCase()}.`,
        riskLevel: 'HIGH',
        confidence: 92,
        detectedSymptoms: [sObj.concern],
        possibleHealthConcerns: [sObj.concern],
        recommendedAction: 'Dispatched emergency transport. Direct DHO alerts fired.',
        doctorSummary: 'Immediate physical inspection.',
        medicalDisclaimer: 'AI Triage evaluation only.'
      },
      riskLevel: 'HIGH',
      confidence: 92,
      recommendedAction: 'Urgent immediate clinical dispatch.',
      doctorSummary: 'Under crisis investigation.',
      medicalDisclaimer: 'AI Triage evaluation.',
      status: 'Pending Doctor Review',
      createdAt: { seconds: (Date.now() - (i * 1200 * 1000)) / 1000 },
      updatedAt: { seconds: Date.now() / 1000 }
    };

    await setDoc(doc(db, getCollectionName('patientReports'), reportId), report);
    addDemoEvent({
      type: 'case_created',
      title: 'HIGH RISK ALERT LOGGED',
      description: `Report ${reportId} for ${name} (${village}) classified as CRITICAL: ${sObj.concern}.`,
      severity: 'high'
    });
  }
}

/**
 * 3. Generate Doctor Consultations
 */
export async function generateDemoConsultations(count: number = 3): Promise<void> {
  for (let i = 0; i < count; i++) {
    const cid = `demo-c-${Math.floor(Math.random() * 8999) + 1000}`;
    const diagnosis = ['Stage 2 Hypertension', 'COPD Flare-up', 'Type 2 Diabetes Mellitus'][i % 3];
    const ref = ['Symptomatic treatment advised', 'Referred to District Specialist', 'Discharged with medication'][Math.floor(Math.random() * 3)];
    const times = ['10:15 AM', '11:45 AM', '02:30 PM', '04:10 PM'];

    await setDoc(doc(db, getCollectionName('consultations'), cid), {
      id: cid,
      diagnosis,
      completedAt: times[i % times.length],
      referredTo: ref,
      createdAt: serverTimestamp()
    });

    addDemoEvent({
      type: 'consultation_completed',
      title: 'Consultation Completed',
      description: `Doctor logged clinical diagnosis [${diagnosis}] for patient queue. Action: ${ref}.`,
      severity: 'low'
    });
  }
}

/**
 * 4. Generate Home Visits
 */
export async function generateDemoHomeVisits(count: number = 4): Promise<void> {
  const visitors = ['Amina Khatun', 'Gopal Sharma', 'Rajesh Kumar', 'Meera Devi', 'Sanjay Dutt'];
  for (let i = 0; i < count; i++) {
    const vid = `demo-v-${Math.floor(Math.random() * 8999) + 1000}`;
    const name = visitors[i % visitors.length];
    const village = VILLAGES[i % VILLAGES.length];
    const todayStr = new Date().toISOString().split('T')[0];

    await setDoc(doc(db, getCollectionName('homeVisits'), vid), {
      id: vid,
      patientName: name,
      village,
      visitDate: todayStr,
      status: 'Completed',
      createdAt: serverTimestamp()
    });

    addDemoEvent({
      type: 'visit_completed',
      title: 'ASHA Home Visit Logged',
      description: `ASHA completed a home wellness check for ${name} in ${village}.`,
      severity: 'low'
    });
  }
}

/**
 * 5. Generate District Alerts
 */
export async function generateDemoAlerts(count: number = 2): Promise<void> {
  const alertTriggers = [
    { category: 'Dengue', village: 'Bhander', patients: 5, action: 'ASHA dispatched to conduct source reduction and fogging immediately.' },
    { category: 'Gastroenteritis', village: 'Unao Village', patients: 3, action: 'Water chlorination drive initialized. Distributed ORS packets.' }
  ];

  for (let i = 0; i < Math.min(count, alertTriggers.length); i++) {
    const aid = `demo-a-${Math.floor(Math.random() * 8999) + 1000}`;
    const trigger = alertTriggers[i];

    await setDoc(doc(db, getCollectionName('alerts'), aid), {
      alertId: aid,
      title: `${trigger.category} Cluster Alert`,
      diseaseCategory: trigger.category,
      village: trigger.village,
      numberOfCases: trigger.patients,
      severity: 'HIGH',
      generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
      recommendedAction: trigger.action,
      patientsAffected: trigger.patients,
      createdAt: serverTimestamp()
    });

    addDemoEvent({
      type: 'alert_triggered',
      title: 'DISTRICT HEALTH ALERT',
      description: `Outbreak Detected in ${trigger.village}! ${trigger.patients} cases of suspected ${trigger.category}. Action: ${trigger.action}`,
      severity: 'high'
    });
  }
}

/**
 * Reset Demo Data
 */
export async function resetDemoData(): Promise<void> {
  addDemoEvent({
    type: 'system',
    title: 'Database Reset Initialized',
    description: 'Clearing all simulated sandbox records from the secure Firestore instance...',
    severity: 'info'
  });

  const collectionsToClear = ['patientReports', 'homeVisits', 'consultations', 'alerts', 'users'];
  for (const collName of collectionsToClear) {
    const collRef = collection(db, getCollectionName(collName));
    const snapshot = await getDocs(collRef);
    const deletePromises = snapshot.docs.map(docSnap => 
      deleteDoc(doc(db, getCollectionName(collName), docSnap.id))
    );
    await Promise.all(deletePromises);
  }

  addDemoEvent({
    type: 'system',
    title: 'Sandbox Reset Complete',
    description: 'All demo-specific documents have been successfully expunged. Falling back to base configurations.',
    severity: 'info'
  });
}

/**
 * Replay Demo Workflow
 * Sequentially triggers a realistic end-to-end presentation flow.
 */
export async function replayDemoWorkflow(onStep: (step: string) => void): Promise<void> {
  onStep('Clearing historical presentation state...');
  await resetDemoData();
  await new Promise(r => setTimeout(r, 1000));

  onStep('Step 1: Registering new active citizens...');
  await generateDemoCitizens(5);
  await new Promise(r => setTimeout(r, 1500));

  onStep('Step 2: Submitting symptomatic reports...');
  await generateDemoRiskCases(1, 1, 2);
  await new Promise(r => setTimeout(r, 1500));

  onStep('Step 3: ASHA home dispatches completed...');
  await generateDemoHomeVisits(2);
  await new Promise(r => setTimeout(r, 1500));

  onStep('Step 4: Regional outbreaks triggering alerts...');
  await generateDemoAlerts(1);
  await new Promise(r => setTimeout(r, 1000));

  onStep('Workflow Presentation Setup Complete!');
  addDemoEvent({
    type: 'system',
    title: 'Demo Workflow Setup Completed',
    description: 'All steps of the interactive presentation flow have been sequentialized.',
    severity: 'info'
  });
}

/**
 * Generate a single random health event (Simulated citizen triage report)
 */
export async function generateRandomHealthEvent(): Promise<void> {
  const name = CITIZEN_NAMES[Math.floor(Math.random() * CITIZEN_NAMES.length)];
  const age = Math.floor(Math.random() * 60) + 15;
  const village = VILLAGES[Math.floor(Math.random() * VILLAGES.length)];
  
  const riskType = Math.random();
  let symptoms, concern, severity: 'LOW' | 'MEDIUM' | 'HIGH';

  if (riskType < 0.5) {
    const s = LOW_RISK_SYMPTOMS[Math.floor(Math.random() * LOW_RISK_SYMPTOMS.length)];
    symptoms = s.symptoms;
    concern = s.concern;
    severity = 'LOW';
  } else if (riskType < 0.85) {
    const s = MEDIUM_RISK_SYMPTOMS[Math.floor(Math.random() * MEDIUM_RISK_SYMPTOMS.length)];
    symptoms = s.symptoms;
    concern = s.concern;
    severity = 'MEDIUM';
  } else {
    const s = HIGH_RISK_SYMPTOMS[Math.floor(Math.random() * HIGH_RISK_SYMPTOMS.length)];
    symptoms = s.symptoms;
    concern = s.concern;
    severity = 'HIGH';
  }

  const reportId = makeReportId(Math.floor(Math.random() * 89999) + 10000);
  const report: SavedReport = {
    reportId,
    patientId: `demo-rand-${Math.random().toString(36).substr(2, 5)}`,
    patientInformation: {
      fullName: name,
      age,
      gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
      village,
      district: 'Datia'
    },
    medicalHistory: { chronicDiseases: [], medications: [], allergies: [] },
    symptoms,
    uploadedDocuments: [],
    geminiAnalysis: {
      patientSummary: `Simulated event presenting with ${concern}.`,
      riskLevel: severity,
      confidence: 88,
      detectedSymptoms: [concern],
      possibleHealthConcerns: [concern],
      recommendedAction: severity === 'HIGH' ? 'Immediate dispatch.' : 'Standard review.',
      doctorSummary: 'Pending clinical verify.',
      medicalDisclaimer: 'AI Triage evaluation only.'
    },
    riskLevel: severity,
    confidence: 88,
    recommendedAction: severity === 'HIGH' ? 'Immediate clinical attention.' : 'Monitor locally.',
    doctorSummary: 'Unverified.',
    medicalDisclaimer: 'AI Triage evaluation.',
    status: 'Pending Doctor Review',
    createdAt: { seconds: Date.now() / 1000 },
    updatedAt: { seconds: Date.now() / 1000 }
  };

  await setDoc(doc(db, getCollectionName('patientReports'), reportId), report);
  
  addDemoEvent({
    type: 'case_created',
    title: `Random Triage: ${severity} RISK`,
    description: `${name} (${village}) reported symptoms. AI concern: ${concern}.`,
    severity: severity.toLowerCase() as any
  });
}

/**
 * Simulate Doctor completing a consultation
 * Finds one 'Pending Doctor Review' report and completes it, saving a consultation
 */
export async function simulateDoctorCompletion(): Promise<boolean> {
  const reportsRef = collection(db, getCollectionName('patientReports'));
  const snapshot = await getDocs(reportsRef);
  const pending = snapshot.docs
    .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as SavedReport))
    .filter(r => r.status === 'Pending Doctor Review');

  if (pending.length === 0) {
    return false;
  }

  // Pick the first pending report
  const targetReport = pending[0];
  const docId = targetReport.id || targetReport.reportId;

  // Complete the patient report status
  await setDoc(doc(db, getCollectionName('patientReports'), docId), {
    ...targetReport,
    status: 'Completed',
    doctorSummary: 'In-person outpatient clinical consult completed. Prescribed standard treatments.',
    updatedAt: { seconds: Date.now() / 1000 }
  });

  // Log consultation
  const cid = `demo-c-${Math.floor(Math.random() * 8999) + 1000}`;
  const diagnosis = targetReport.geminiAnalysis?.possibleHealthConcerns?.[0] || 'Seasonal Malady';
  await setDoc(doc(db, getCollectionName('consultations'), cid), {
    id: cid,
    diagnosis,
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    referredTo: 'Discharged with medication',
    createdAt: serverTimestamp()
  });

  addDemoEvent({
    type: 'consultation_completed',
    title: 'Consultation Completed',
    description: `Doctor successfully reviewed and resolved Report ${targetReport.reportId} for ${targetReport.patientInformation?.fullName}.`,
    severity: 'low'
  });

  return true;
}
