/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { analyzeSymptoms as runAnalyzeSymptoms, generateSOAPNotes as runGenerateSOAPNotes } from '../services/geminiService';
import { SymptomAnalysisRequest, SymptomAnalysisResponse, SOAPNotesResponse } from '../types';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSymptoms = async (request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await runAnalyzeSymptoms(request);
      return response;
    } catch (err: any) {
      const msg = err.message || 'Error occurred during AI symptom analysis';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateSOAPNotes = async (request: {
    patientInformation: any;
    symptoms: string[];
    medicalHistory: any;
    vitals: any;
    clinicalObservations: string;
  }): Promise<SOAPNotesResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await runGenerateSOAPNotes(request);
      return response;
    } catch (err: any) {
      const msg = err.message || 'Error occurred during SOAP notes generation';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeSymptoms,
    generateSOAPNotes,
    loading,
    error,
    clearError: () => setError(null)
  };
}
