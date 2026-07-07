/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedReport } from '../types';

export const VILLAGES = ['Datia Central', 'Bhander', 'Indergarh', 'Seondha', 'Unao Village'];

export const GENDERS = ['Male', 'Female'];

export const CITIZEN_NAMES = [
  'Amit Patel', 'Pooja Sharma', 'Rajesh Jatav', 'Sushma Devi', 'Vikram Singh',
  'Karan Johar', 'Neha Gupta', 'Anil Mishra', 'Sunita Yadav', 'Vijay Kumar',
  'Ritu Rajput', 'Aarti Rathore', 'Jyoti Kushwah', 'Deepak Sahu', 'Sanjay Verma'
];

export const LOW_RISK_SYMPTOMS = [
  { symptoms: 'Mild runny nose, occasional dry cough, no breathing difficulty.', summary: 'Common seasonal cold', concern: 'Mild Viral Rhinitis' },
  { symptoms: 'Slight muscle fatigue after farm work, minor tension headache.', summary: 'Physical exhaustion and dehydration', concern: 'Fatigue' },
  { symptoms: 'Minor throat irritation, sneezes, no active fever.', summary: 'Allergic rhinitis flareup', concern: 'Seasonal Allergy' }
];

export const MEDIUM_RISK_SYMPTOMS = [
  { symptoms: 'Fasting glucose 255 mg/dL with recurrent nocturnal polyuria and dry mouth.', summary: 'Uncontrolled hyperglycemia clinical signal', concern: 'Type 2 Diabetes Mellitus' },
  { symptoms: 'Resting blood pressure 165/104 mmHg, mild chest pressure, throbbing headache.', summary: 'Stage 2 Hypertension crisis warning', concern: 'Hypertension' },
  { symptoms: 'Chronic dry wheeze, persistent morning cough, respiratory tightness.', summary: 'Acute respiratory irritation in COPD background', concern: 'COPD Exacerbation' }
];

export const HIGH_RISK_SYMPTOMS = [
  { symptoms: 'High fever of 103.5F for 4 days, severe retro-orbital bone pain, multiple red rashes on trunk.', summary: 'Severe Dengue fever presenting with potential hemorrhage threat', concern: 'Dengue Outbreak Risk' },
  { symptoms: 'Sudden severe chills, extreme rigor shaking, high fever spike, severe vomiting.', summary: 'Malaria febrile paroxysm cluster', concern: 'Malaria Cluster' },
  { symptoms: 'Profuse watery rice-water diarrhea, rapid stomach cramps, severe skin turgor loss, dry lips.', summary: 'Severe dehydrating gastroenteritis signal representing Cholera hazard', concern: 'Gastroenteritis Outbreak' }
];

export const SYSTEM_INSTRUCTION = `You are an advanced clinical triage AI assistant designed for rural healthcare centers. 
Your role is to analyze patient symptoms and medical history to assist citizens, community health workers (ASHAs), and clinical doctors with triage.

CRITICAL MEDICAL & SAFETY CONSTRAINTS:
1. You MUST NEVER diagnose any specific disease. Instead, identify general "possible health concerns" or "physiological systems affected".
2. You MUST NEVER prescribe specific medications or dosages.
3. You MUST NEVER replace a professional clinical evaluation.
4. You MUST always include a clear, professional medical disclaimer stating that this is an AI triage analysis and the patient must consult a healthcare professional.

Your task is to analyze the provided SymptomAnalysisRequest and produce a highly structured, accurate SymptomAnalysisResponse in JSON format adhering strictly to the responseSchema.`;

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
      possibleHealthConcerns: ['Acute Hypertensive Emergency', 'Myocardial Infar infarction'],
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
