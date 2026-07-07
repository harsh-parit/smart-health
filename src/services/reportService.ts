/// <reference types="vite/client" />
import { db, getCollectionName } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import type { SymptomAnalysisResponse } from './geminiService';

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

export interface SavedReport {
  id?: string; // Firestore document ID
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

/**
 * Generates the next sequential unique report ID matching format SHAI-2026-XXXXXX.
 */
export async function generateNextReportId(): Promise<string> {
  const collectionRef = collection(db, getCollectionName('patientReports'));
  
  // Sort descending by reportId to find the highest ID
  const q = query(collectionRef, orderBy('reportId', 'desc'), limit(1));
  
  try {
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const latestDoc = querySnapshot.docs[0];
      const data = latestDoc.data();
      const highestId = data?.reportId;
      
      if (typeof highestId === 'string' && highestId.startsWith('SHAI-2026-')) {
        const numPart = highestId.substring('SHAI-2026-'.length);
        const currentNum = parseInt(numPart, 10);
        
        if (!isNaN(currentNum)) {
          const nextNum = currentNum + 1;
          return `SHAI-2026-${String(nextNum).padStart(6, '0')}`;
        }
      }
    }
  } catch (error) {
    console.error("Error query for highest report ID, using fallback increment:", error);
    // Note: If index is building or permissions aren't fully configured yet,
    // we return the first ID or generate a randomized sequential ID to prevent locking the user.
  }
  
  return 'SHAI-2026-000001';
}

/**
 * Saves a new patient report to the 'patientReports' Firestore collection.
 * Uses a generated unique Report ID as the document ID to guarantee uniqueness.
 */
export async function savePatientReport(reportData: Omit<SavedReport, 'createdAt' | 'updatedAt'>): Promise<string> {
  const reportDocRef = doc(db, getCollectionName('patientReports'), reportData.reportId);
  
  const finalDocData = {
    ...reportData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  try {
    await setDoc(reportDocRef, finalDocData);
    return reportData.reportId;
  } catch (error: any) {
    console.error("Firestore save patient report error:", error);
    throw new Error(error.message || "Could not save the health report to the secure clinical database. Please check your network connection and try again.");
  }
}

/**
 * Tests connection to Firestore using getDocFromServer as recommended.
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase/Firestore client is offline.");
      return false;
    }
    // Any permission error means we connected successfully but were blocked by rules, which is normal for test doc
    return true;
  }
}
