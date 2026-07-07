/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from 'firebase/auth';

export type UserRole = 'citizen' | 'asha' | 'doctor' | 'districtOfficer';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  village?: string;
  createdAt: any;
  lastLogin: any;
}

export interface PatientInformation {
  fullName: string;
  age: number;
  gender: string;
  village: string;
  district: string;
}

export interface MedicalHistory {
  chronicDiseases: string[];
  medications: string[];
  allergies: string[];
}

export interface SymptomAnalysisRequest {
  patientInformation: PatientInformation;
  symptoms: string[];
  medicalHistory: MedicalHistory;
  pregnancyStatus?: string;
}

export interface SymptomAnalysisResponse {
  patientSummary: string;
  detectedSymptoms: string[];
  possibleHealthConcerns: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  recommendedAction: string;
  doctorSummary: string;
  medicalDisclaimer: string;
}

export interface SOAPNotesResponse {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface SavedReport {
  id?: string;
  reportId: string;
  patientId: string;
  patientInformation: PatientInformation;
  medicalHistory: MedicalHistory;
  symptoms: string;
  uploadedDocuments: { name: string; type: string; size: string; date: string }[];
  geminiAnalysis: SymptomAnalysisResponse;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  recommendedAction: string;
  doctorSummary: string;
  medicalDisclaimer: string;
  status: 'Pending Doctor Review' | 'Reviewed' | 'Completed';
  createdAt: any;
  updatedAt: any;
}

export interface OutbreakAlert {
  id?: string;
  alertId: string;
  village: string;
  district: string;
  diseaseCategory: string;
  numberOfCases: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  generatedAt: string;
  status: 'Active' | 'Assigned' | 'Resolved';
  recommendedAction: string;
  assignedTeam?: string;
  notes?: string;
  patientsAffected: number;
}

export interface DiseaseTrend {
  name: string;
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

export interface FeatureDetail {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  accentColor: string;
  bulletPoints: string[];
  techImpact: string;
}

export type ActiveModalType = 'symptom' | 'copilot' | 'dashboard' | 'get-started' | null;

export interface DemoEvent {
  id: string;
  type: 'citizen_created' | 'case_created' | 'consultation_completed' | 'visit_completed' | 'alert_triggered' | 'system';
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'info';
}
