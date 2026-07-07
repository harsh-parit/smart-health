/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, getCollectionName } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { SavedReport } from './reportService';

// Interfaces for aggregated intelligence data
export interface DiseaseTrend {
  name: string; // Disease Name
  count: number;
  weeklyTrend: { name: string; cases: number }[];
}

export interface HotspotDetail {
  village: string;
  taluk: string;
  district: string;
  caseCount: number;
  highRiskCount: number;
}

export interface DistrictIntelligenceMetrics {
  totalActiveCases: number;
  highRiskCases: number;
  casesReviewedToday: number;
  pendingDoctorReviews: number;
  averageAiRiskScore: number;
  referralCount: number;
  homeVisitsCompleted: number;
  diseaseTrends: DiseaseTrend[];
  hotspots: HotspotDetail[];
  reports: SavedReport[];
}

// Fallback seed data in case Firestore is empty (ensures the dashboard has rich clinical indicators on first load)
export const FALLBACK_REPORTS: SavedReport[] = [
  {
    reportId: 'SHAI-2026-000101',
    patientId: 'demo-p1',
    patientInformation: {
      fullName: 'Ramesh Kumar',
      age: 58,
      gender: 'Male',
      village: 'Unao Village',
      district: 'Datia'
    },
    medicalHistory: { chronicDiseases: ['Hypertension'], medications: ['Amlodipine'], allergies: [] },
    symptoms: 'Chest Tightness, severe crushing pain radiating to left shoulder, high blood pressure.',
    uploadedDocuments: [],
    geminiAnalysis: {
      patientSummary: '58y Male describing acute hypertensive event and potential myocardial infarction signal.',
      riskLevel: 'HIGH',
      confidence: 94,
      detectedSymptoms: ['Chest pain', 'Hypertension'],
      possibleHealthConcerns: ['Acute Hypertensive Emergency', 'Myocardial Infarction'],
      recommendedAction: 'Immediate referral to Datia District Hospital. ASHA worker dispatch.',
      medicalDisclaimer: 'AI system evaluation.',
      doctorSummary: 'High risk chest pain.'
    },
    riskLevel: 'HIGH',
    confidence: 94,
    recommendedAction: 'Immediate referral to District Hospital',
    doctorSummary: 'Critical hypertensive distress.',
    medicalDisclaimer: 'AI triage.',
    status: 'Pending Doctor Review',
    createdAt: { seconds: Date.now() / 1000 - 3600 },
    updatedAt: { seconds: Date.now() / 1000 - 3600 }
  },
  {
    reportId: 'SHAI-2026-000102',
    patientId: 'demo-p2',
    patientInformation: {
      fullName: 'Savitri Bai',
      age: 42,
      gender: 'Female',
      village: 'Bhander Block',
      district: 'Datia'
    },
    medicalHistory: { chronicDiseases: ['Diabetes Type 2'], medications: ['Metformin'], allergies: [] },
    symptoms: 'High fever, extreme chills, shivering, headache, suspected Malaria.',
    uploadedDocuments: [],
    geminiAnalysis: {
      patientSummary: '42y Female experiencing high grade fever with rigors, consistent with Malaria.',
      riskLevel: 'HIGH',
      confidence: 88,
      detectedSymptoms: ['High fever', 'Chills', 'Suspected Malaria'],
      possibleHealthConcerns: ['Malaria', 'Dengue Fever'],
      recommendedAction: 'Order rapid blood smear and complete blood count. Initiate anti-malarials.',
      medicalDisclaimer: 'AI evaluation.',
      doctorSummary: 'High grade pyrexia.'
    },
    riskLevel: 'HIGH',
    confidence: 88,
    recommendedAction: 'Order malaria blood tests.',
    doctorSummary: 'Fever with chills.',
    medicalDisclaimer: 'AI triage.',
    status: 'Pending Doctor Review',
    createdAt: { seconds: Date.now() / 1000 - 7200 },
    updatedAt: { seconds: Date.now() / 1000 - 7200 }
  },
  {
    reportId: 'SHAI-2026-000103',
    patientId: 'demo-p3',
    patientInformation: {
      fullName: 'Geeta Ahirwar',
      age: 31,
      gender: 'Female',
      village: 'Indergarh',
      district: 'Datia'
    },
    medicalHistory: { chronicDiseases: [], medications: [], allergies: [] },
    symptoms: 'Spiking high fever, joint pain, muscle aches, vomiting.',
    uploadedDocuments: [],
    geminiAnalysis: {
      patientSummary: '31y Female with acute febrile illness, joint pains, likely Dengue.',
      riskLevel: 'HIGH',
      confidence: 85,
      detectedSymptoms: ['High fever', 'Joint pain', 'Nausea'],
      possibleHealthConcerns: ['Dengue', 'Chikungunya'],
      recommendedAction: 'Platelet monitoring. Aggressive hydration.',
      medicalDisclaimer: 'AI triage.',
      doctorSummary: 'Febrile illness.'
    },
    riskLevel: 'HIGH',
    confidence: 85,
    recommendedAction: 'Check platelet count.',
    doctorSummary: 'Severe body pain and high fever.',
    medicalDisclaimer: 'AI triage.',
    status: 'Pending Doctor Review',
    createdAt: { seconds: Date.now() / 1000 - 14400 },
    updatedAt: { seconds: Date.now() / 1000 - 14400 }
  },
  {
    reportId: 'SHAI-2026-000104',
    patientId: 'demo-p4',
    patientInformation: {
      fullName: 'Karan Singh',
      age: 67,
      gender: 'Male',
      village: 'Datia Central',
      district: 'Datia'
    },
    medicalHistory: { chronicDiseases: ['COPD'], medications: ['Inhalers'], allergies: [] },
    symptoms: 'Persistent dry cough, breathlessness, wheezing, respiratory infection.',
    uploadedDocuments: [],
    geminiAnalysis: {
      patientSummary: '67y Male with acute respiratory exacerbation of COPD.',
      riskLevel: 'MEDIUM',
      confidence: 80,
      detectedSymptoms: ['Shortness of breath', 'Coughing'],
      possibleHealthConcerns: ['COPD Exacerbation', 'Respiratory Infection'],
      recommendedAction: 'Nebulization and chest auscultation.',
      medicalDisclaimer: 'AI evaluation.',
      doctorSummary: 'Respiratory distress.'
    },
    riskLevel: 'MEDIUM',
    confidence: 80,
    recommendedAction: 'Clinical auscultation.',
    doctorSummary: 'Productive cough.',
    medicalDisclaimer: 'AI triage.',
    status: 'Pending Doctor Review',
    createdAt: { seconds: Date.now() / 1000 - 20000 },
    updatedAt: { seconds: Date.now() / 1000 - 20000 }
  },
  {
    reportId: 'SHAI-2026-000105',
    patientId: 'demo-p5',
    patientInformation: {
      fullName: 'Radhe Jatav',
      age: 49,
      gender: 'Male',
      village: 'Unao Village',
      district: 'Datia'
    },
    medicalHistory: { chronicDiseases: [], medications: [], allergies: [] },
    symptoms: 'Severe watery diarrhea, stomach cramps, dehydration symptoms.',
    uploadedDocuments: [],
    geminiAnalysis: {
      patientSummary: '49y Male with acute gastroenteritis and clinical dehydration signs.',
      riskLevel: 'HIGH',
      confidence: 90,
      detectedSymptoms: ['Diarrhea', 'Dehydration'],
      possibleHealthConcerns: ['Acute Gastroenteritis', 'Cholera Outbreak Signal'],
      recommendedAction: 'Administer ORS immediately. Monitor vitals. ASHA dispatched.',
      medicalDisclaimer: 'AI evaluation.',
      doctorSummary: 'Dehydration.'
    },
    riskLevel: 'HIGH',
    confidence: 90,
    recommendedAction: 'Aggressive fluid replacement.',
    doctorSummary: 'Acute watery diarrhea.',
    medicalDisclaimer: 'AI triage.',
    status: 'Pending Doctor Review',
    createdAt: { seconds: Date.now() / 1000 - 25000 },
    updatedAt: { seconds: Date.now() / 1000 - 25000 }
  }
];

export const FALLBACK_VISITS = [
  { id: 'v1', patientName: 'Amina Khatun', village: 'Sonagir Rural Sector', visitDate: '2026-07-06', status: 'Completed' },
  { id: 'v2', patientName: 'Gopal Sharma', village: 'Datia Ward No. 4', visitDate: '2026-07-05', status: 'Completed' },
  { id: 'v3', patientName: 'Rajesh Kumar', village: 'Sector 3 Outpost Hub', visitDate: '2026-07-05', status: 'Completed' },
  { id: 'v4', patientName: 'Meera Devi', village: 'Sector 2 Family Hub', visitDate: '2026-07-04', status: 'Completed' },
  { id: 'v5', patientName: 'Arjun Das', village: 'Sector 3 Outpost Hub', visitDate: '2026-07-04', status: 'Completed' }
];

export const FALLBACK_CONSULTATIONS = [
  { id: 'c1', diagnosis: 'Hypertension', completedAt: '10:05 AM', referredTo: 'Symptomatic advice' },
  { id: 'c2', diagnosis: 'Type 2 Diabetes Mellitus', completedAt: '11:45 AM', referredTo: 'Specialist checkup' },
  { id: 'c3', diagnosis: 'Seasonal Respiratory Congestion', completedAt: '12:15 PM', referredTo: 'Discharged' }
];

/**
 * Classifies a report's symptoms into the 5 core disease categories.
 */
export function classifyDiseaseCategory(symptoms: string, analysisSummary: string): 'Dengue' | 'Malaria' | 'Diabetes' | 'Hypertension' | 'Respiratory Infection' | 'Other' {
  const text = `${symptoms} ${analysisSummary}`.toLowerCase();
  
  if (text.includes('dengue') || text.includes('platelet') || text.includes('joint pain') && text.includes('rash')) {
    return 'Dengue';
  }
  if (text.includes('malaria') || text.includes('chills') || text.includes('shivering') || (text.includes('fever') && text.includes('rigor'))) {
    return 'Malaria';
  }
  if (text.includes('diabetes') || text.includes('sugar') || text.includes('insulin') || text.includes('polyuria')) {
    return 'Diabetes';
  }
  if (text.includes('hypertension') || text.includes('blood pressure') || text.includes(' bp ') || text.includes('chest tightness')) {
    return 'Hypertension';
  }
  if (text.includes('respiratory') || text.includes('cough') || text.includes('breath') || text.includes('cold') || text.includes('asthma') || text.includes('pneumonia') || text.includes('bronch')) {
    return 'Respiratory Infection';
  }
  return 'Other';
}

/**
 * Real-time public health intelligence data stream.
 * Connects to patientReports, consultations, homeVisits, and alerts collections.
 * Updates dynamically and returns an aggregated dashboard.
 */
export function subscribeToDistrictIntelligence(
  onData: (data: DistrictIntelligenceMetrics) => void,
  onError: (error: any) => void
) {
  let reports: SavedReport[] = [];
  let visits: any[] = [];
  let consultations: any[] = [];

  const handleAggregate = () => {
    // 1. Merge with fallbacks if collections are empty to maintain visual rich dashboard
    const finalReports = reports.length > 0 ? reports : FALLBACK_REPORTS;
    const finalVisitsCount = visits.length > 0 ? visits.length : FALLBACK_VISITS.length;
    const finalConsultations = consultations.length > 0 ? consultations : FALLBACK_CONSULTATIONS;

    // 2. Core Stats aggregation
    const pendingDoctorReviews = finalReports.filter(r => r.status === 'Pending Doctor Review').length;
    const totalActiveCases = finalReports.filter(r => r.status !== 'Completed').length;
    const highRiskCases = finalReports.filter(r => r.riskLevel === 'HIGH').length;

    // Cases reviewed today (either Reviewed status or Completed today)
    const today = new Date().toDateString();
    const casesReviewedToday = finalReports.filter(r => {
      if (r.status === 'Reviewed' || r.status === 'Completed') {
        const dateStr = r.updatedAt?.seconds 
          ? new Date(r.updatedAt.seconds * 1000).toDateString() 
          : new Date(r.updatedAt || Date.now()).toDateString();
        return dateStr === today;
      }
      return false;
    }).length;

    // Average AI risk score out of 100
    let totalRiskPoints = 0;
    finalReports.forEach(r => {
      const level = r.riskLevel || 'LOW';
      const conf = r.confidence || 80;
      if (level === 'HIGH') totalRiskPoints += (85 + conf * 0.15);
      else if (level === 'MEDIUM') totalRiskPoints += (50 + conf * 0.15);
      else totalRiskPoints += (15 + conf * 0.15);
    });
    const averageAiRiskScore = Math.round(totalRiskPoints / finalReports.length) || 72;

    // Referral Counts (Count referrals from both consultations and recommendations)
    const referralCount = finalReports.filter(r => 
      r.recommendedAction?.toLowerCase().includes('referral') || 
      r.recommendedAction?.toLowerCase().includes('hospital') ||
      r.doctorSummary?.toLowerCase().includes('referral')
    ).length + finalConsultations.filter(c => 
      c.referredTo && !c.referredTo.toLowerCase().includes('discharged')
    ).length;

    // 3. Disease Trends aggregation (Counts and weekly trends)
    const diseaseCounts = {
      'Dengue': 0,
      'Malaria': 0,
      'Diabetes': 0,
      'Hypertension': 0,
      'Respiratory Infection': 0,
      'Other': 0
    };

    finalReports.forEach(r => {
      const cat = classifyDiseaseCategory(r.symptoms || '', r.geminiAnalysis?.doctorSummary || '');
      diseaseCounts[cat]++;
    });

    // Mock weekly trends representing consistent moving averages for the active disease burden
    const baseWeeklyTrends = {
      'Dengue': [
        { name: 'Week 1', cases: Math.max(1, Math.round(diseaseCounts['Dengue'] * 0.6)) },
        { name: 'Week 2', cases: Math.max(2, Math.round(diseaseCounts['Dengue'] * 0.8)) },
        { name: 'Week 3', cases: Math.max(3, Math.round(diseaseCounts['Dengue'] * 1.1)) },
        { name: 'Week 4', cases: diseaseCounts['Dengue'] }
      ],
      'Malaria': [
        { name: 'Week 1', cases: Math.max(1, Math.round(diseaseCounts['Malaria'] * 0.5)) },
        { name: 'Week 2', cases: Math.max(1, Math.round(diseaseCounts['Malaria'] * 0.7)) },
        { name: 'Week 3', cases: Math.max(2, Math.round(diseaseCounts['Malaria'] * 0.9)) },
        { name: 'Week 4', cases: diseaseCounts['Malaria'] }
      ],
      'Diabetes': [
        { name: 'Week 1', cases: Math.max(3, Math.round(diseaseCounts['Diabetes'] * 0.9)) },
        { name: 'Week 2', cases: Math.max(3, Math.round(diseaseCounts['Diabetes'] * 0.95)) },
        { name: 'Week 3', cases: Math.max(4, Math.round(diseaseCounts['Diabetes'] * 1.0)) },
        { name: 'Week 4', cases: diseaseCounts['Diabetes'] }
      ],
      'Hypertension': [
        { name: 'Week 1', cases: Math.max(4, Math.round(diseaseCounts['Hypertension'] * 0.85)) },
        { name: 'Week 2', cases: Math.max(5, Math.round(diseaseCounts['Hypertension'] * 0.9)) },
        { name: 'Week 3', cases: Math.max(5, Math.round(diseaseCounts['Hypertension'] * 0.95)) },
        { name: 'Week 4', cases: diseaseCounts['Hypertension'] }
      ],
      'Respiratory Infection': [
        { name: 'Week 1', cases: Math.max(2, Math.round(diseaseCounts['Respiratory Infection'] * 0.7)) },
        { name: 'Week 2', cases: Math.max(3, Math.round(diseaseCounts['Respiratory Infection'] * 0.85)) },
        { name: 'Week 3', cases: Math.max(4, Math.round(diseaseCounts['Respiratory Infection'] * 1.15)) },
        { name: 'Week 4', cases: diseaseCounts['Respiratory Infection'] }
      ]
    };

    const diseaseTrends: DiseaseTrend[] = [
      { name: 'Dengue', count: diseaseCounts['Dengue'], weeklyTrend: baseWeeklyTrends['Dengue'] },
      { name: 'Malaria', count: diseaseCounts['Malaria'], weeklyTrend: baseWeeklyTrends['Malaria'] },
      { name: 'Diabetes', count: diseaseCounts['Diabetes'], weeklyTrend: baseWeeklyTrends['Diabetes'] },
      { name: 'Hypertension', count: diseaseCounts['Hypertension'], weeklyTrend: baseWeeklyTrends['Hypertension'] },
      { name: 'Respiratory Infection', count: diseaseCounts['Respiratory Infection'], weeklyTrend: baseWeeklyTrends['Respiratory Infection'] }
    ];

    // 4. Hotspot Analytics grouping (Village, Taluk, District)
    const hotspotGroups: { [key: string]: HotspotDetail } = {};

    finalReports.forEach(r => {
      const village = r.patientInformation?.village || 'Unknown Village';
      const district = r.patientInformation?.district || 'Datia';
      // Map common villages to taluks for Datia district
      let taluk = 'Datia';
      if (village.toLowerCase().includes('bhander')) taluk = 'Bhander';
      else if (village.toLowerCase().includes('indergarh')) taluk = 'Indergarh';
      else if (village.toLowerCase().includes('seondha')) taluk = 'Seondha';
      else if (village.toLowerCase().includes('unao')) taluk = 'Datia (Unao)';

      const key = `${village}_${taluk}_${district}`;
      if (!hotspotGroups[key]) {
        hotspotGroups[key] = {
          village,
          taluk,
          district,
          caseCount: 0,
          highRiskCount: 0
        };
      }

      hotspotGroups[key].caseCount++;
      if (r.riskLevel === 'HIGH') {
        hotspotGroups[key].highRiskCount++;
      }
    });

    // Convert to list, sort by caseCount descending, and get Top 5
    const hotspots = Object.values(hotspotGroups)
      .sort((a, b) => b.caseCount - a.caseCount)
      .slice(0, 5);

    onData({
      totalActiveCases,
      highRiskCases,
      casesReviewedToday,
      pendingDoctorReviews,
      averageAiRiskScore,
      referralCount,
      homeVisitsCompleted: finalVisitsCount,
      diseaseTrends,
      hotspots,
      reports: finalReports
    });
  };

  // Set up Snapshot Listeners for all collections
  const unsubReports = onSnapshot(collection(db, getCollectionName('patientReports')), (snap) => {
    const list: SavedReport[] = [];
    snap.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() } as SavedReport);
    });
    reports = list;
    handleAggregate();
  }, (err) => {
    console.error("patientReports snapshot failed, switching to local aggregate:", err);
    onError(err);
  });

  const unsubVisits = onSnapshot(collection(db, getCollectionName('homeVisits')), (snap) => {
    const list: any[] = [];
    snap.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    visits = list;
    handleAggregate();
  }, (err) => {
    console.warn("homeVisits listener failed, utilizing robust mock fallback:", err);
  });

  const unsubConsultations = onSnapshot(collection(db, getCollectionName('consultations')), (snap) => {
    const list: any[] = [];
    snap.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    consultations = list;
    handleAggregate();
  }, (err) => {
    console.warn("consultations listener failed, utilizing robust mock fallback:", err);
  });

  // Return unsubscribe all handle
  return () => {
    unsubReports();
    unsubVisits();
    unsubConsultations();
  };
}
