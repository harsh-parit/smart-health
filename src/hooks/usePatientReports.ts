/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { db, getCollectionName } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { generateNextReportId, savePatientReport } from '../services/reportService';
import { SavedReport } from '../types';

export function usePatientReports() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const path = getCollectionName('patientReports');
    const unsub = onSnapshot(collection(db, path), (snap) => {
      const list: SavedReport[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as SavedReport);
      });
      setReports(list);
      setLoading(false);
    }, (err) => {
      console.error("Failed to subscribe to patient reports:", err);
      setError("Failed to stream patient reports");
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const createReport = async (reportData: Omit<SavedReport, 'createdAt' | 'updatedAt'>): Promise<string> => {
    setError(null);
    try {
      const reportId = await savePatientReport(reportData);
      return reportId;
    } catch (err: any) {
      setError(err.message || 'Failed to save patient report');
      throw err;
    }
  };

  const getNextId = async (): Promise<string> => {
    return generateNextReportId();
  };

  const updateReportStatus = async (reportId: string, status: SavedReport['status'], doctorSummary?: string) => {
    try {
      const docRef = doc(db, getCollectionName('patientReports'), reportId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      if (doctorSummary !== undefined) {
        updateData.doctorSummary = doctorSummary;
      }
      await updateDoc(docRef, updateData);
    } catch (err: any) {
      console.error("Failed to update report status:", err);
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    createReport,
    getNextId,
    updateReportStatus
  };
}
