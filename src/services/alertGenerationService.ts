/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, getCollectionName } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  setDoc,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { SavedReport } from './reportService';
import { classifyDiseaseCategory } from './districtAnalyticsService';

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

/**
 * Checks for clusters of HIGH risk reports from the same village within a time window.
 * If a new cluster is detected, it triggers/writes a new alert to Firestore.
 */
export async function evaluateReportsForAlerts(
  reports: SavedReport[],
  existingAlerts: OutbreakAlert[],
  timeWindowDays: number = 7,
  caseThreshold: number = 2
): Promise<void> {
  // 1. Group HIGH risk reports by village and disease category
  const now = Date.now();
  const timeLimitMs = timeWindowDays * 24 * 60 * 60 * 1000;

  // Filter for reports within the time window
  const activeHighRiskReports = reports.filter(r => {
    if (r.riskLevel !== 'HIGH') return false;
    
    const createdAtMs = r.createdAt?.seconds 
      ? r.createdAt.seconds * 1000 
      : new Date(r.createdAt || Date.now()).getTime();
      
    return (now - createdAtMs) <= timeLimitMs;
  });

  // Group by village + diseaseCategory
  const groups: { [key: string]: SavedReport[] } = {};
  activeHighRiskReports.forEach(r => {
    const village = r.patientInformation?.village || 'Unknown';
    const category = classifyDiseaseCategory(r.symptoms || '', r.geminiAnalysis?.doctorSummary || '');
    const key = `${village}_${category}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(r);
  });

  // 2. Evaluate each group
  for (const key of Object.keys(groups)) {
    const clusterReports = groups[key];
    if (clusterReports.length >= caseThreshold) {
      const sampleReport = clusterReports[0];
      const village = sampleReport.patientInformation?.village || 'Unknown';
      const district = sampleReport.patientInformation?.district || 'Datia';
      const category = classifyDiseaseCategory(sampleReport.symptoms || '', sampleReport.geminiAnalysis?.doctorSummary || '');

      // Check if an alert already exists for this village and disease category that is NOT resolved
      const duplicateAlert = existingAlerts.find(a => 
        a.village === village && 
        a.diseaseCategory === category && 
        a.status !== 'Resolved'
      );

      if (!duplicateAlert) {
        // Generate alert fields
        const alertId = `ALT-EW-${Math.floor(100000 + Math.random() * 900000)}`;
        const severity = clusterReports.length >= 4 ? 'critical' : 'high';
        
        let recommendedAction = `Dispatch Rapid Response Team immediately. Conduct vector/source control, verify community drinking reservoir, and set up temporary triage camp in ${village}.`;
        if (category === 'Respiratory Infection') {
          recommendedAction = `Distribute protective N95 masks, set up isolated triage tents in ${village}, and initiate random diagnostic sputum swab audits.`;
        } else if (category === 'Diabetes' || category === 'Hypertension') {
          recommendedAction = `Schedule community non-communicable disease (NCD) screening workshop in ${village} and verify continuous refill pipeline for essential medications.`;
        }

        const newAlert: Omit<OutbreakAlert, 'id'> = {
          alertId,
          village,
          district,
          diseaseCategory: category,
          numberOfCases: clusterReports.length,
          severity,
          generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: 'Active',
          recommendedAction,
          patientsAffected: clusterReports.length
        };

        try {
          // Write to Firestore 'alerts' collection
          const alertDocRef = doc(collection(db, getCollectionName('alerts')), alertId);
          await setDoc(alertDocRef, {
            ...newAlert,
            createdAt: serverTimestamp()
          });
          console.log(`[Early Warning Engine] New outbreak alert generated successfully for ${village} - ${category}`);
        } catch (error) {
          console.error("Failed to generate alert in Firestore:", error);
        }
      } else {
        // If the duplicate alert exists but has fewer cases than currently registered in this window, update the case count
        if (duplicateAlert.id && duplicateAlert.numberOfCases < clusterReports.length) {
          try {
            await updateDoc(doc(db, getCollectionName('alerts'), duplicateAlert.id), {
              numberOfCases: clusterReports.length,
              patientsAffected: clusterReports.length,
              updatedAt: serverTimestamp()
            });
            console.log(`[Early Warning Engine] Updated case count for active alert ${duplicateAlert.alertId} to ${clusterReports.length}`);
          } catch (error) {
            console.error("Failed to update case count on alert:", error);
          }
        }
      }
    }
  }
}
