/// <reference types="vite/client" />
import { GoogleGenAI, Type } from '@google/genai';

/**
 * Basic patient demographic and location information.
 */
export interface PatientInformation {
  fullName: string;
  age: number;
  gender: string;
  village: string;
  district: string;
}

/**
 * Relevant patient clinical and medical background.
 */
export interface MedicalHistory {
  chronicDiseases: string[];
  medications: string[];
  allergies: string[];
}

/**
 * Payload required to request a clinical symptom analysis and triage.
 */
export interface SymptomAnalysisRequest {
  patientInformation: PatientInformation;
  symptoms: string[];
  medicalHistory: MedicalHistory;
  pregnancyStatus?: string;
}

/**
 * Structured response returned by the clinical symptom triage analysis.
 */
export interface SymptomAnalysisResponse {
  patientSummary: string;
  detectedSymptoms: string[];
  possibleHealthConcerns: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number; // Percentage score (0 - 100)
  recommendedAction: string;
  doctorSummary: string;
  medicalDisclaimer: string;
}

/**
 * Helper to fetch the Gemini API key from standard Vite and Node environments.
 */
const getApiKey = (): string => {
  const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY as string) ||
    ((import.meta.env as any)?.GEMINI_API_KEY as string) ||
    (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '');
    
  return apiKey || '';
};

/**
 * Clinical system instructions that define the behavioral constraints and safety guidelines.
 */
const SYSTEM_INSTRUCTION = `You are an advanced clinical triage AI assistant designed for rural healthcare centers. 
Your role is to analyze patient symptoms and medical history to assist citizens, community health workers (ASHAs), and clinical doctors with triage.

CRITICAL MEDICAL & SAFETY CONSTRAINTS:
1. You MUST NEVER diagnose any specific disease. Instead, identify general "possible health concerns" or "physiological systems affected".
2. You MUST NEVER prescribe specific medications or dosages.
3. You MUST NEVER replace a professional clinical evaluation.
4. You MUST always include a clear, professional medical disclaimer stating that this is an AI triage analysis and the patient must consult a healthcare professional.

Your task is to analyze the provided SymptomAnalysisRequest and produce a highly structured, accurate SymptomAnalysisResponse in JSON format adhering strictly to the responseSchema.`;

/**
 * Reusable prompt template designed to structure symptom analysis inputs.
 */
const PROMPT_TEMPLATE = (request: SymptomAnalysisRequest): string => {
  return `Please perform triage and symptom analysis based on the following patient data:

PATIENT INFORMATION:
- Name: ${request.patientInformation.fullName}
- Age: ${request.patientInformation.age}
- Gender: ${request.patientInformation.gender}
- Location: Village: ${request.patientInformation.village}, District: ${request.patientInformation.district}
${request.pregnancyStatus ? `- Pregnancy Status: ${request.pregnancyStatus}\n` : ''}

SYMPTOMS:
${request.symptoms.map(s => `- ${s}`).join('\n')}

MEDICAL HISTORY:
- Chronic Diseases: ${request.medicalHistory.chronicDiseases.join(', ') || 'None reported'}
- Current Medications: ${request.medicalHistory.medications.join(', ') || 'None reported'}
- Allergies: ${request.medicalHistory.allergies.join(', ') || 'None reported'}

Instructions:
1. Generate a concise, empathetic, patient-facing 'patientSummary' summarizing their current presentation.
2. Extract the key 'detectedSymptoms' from the unstructured list or description.
3. Identify 'possibleHealthConcerns' (do not diagnose specific diseases, frame them as general system concerns or differential possibilities to discuss with a provider).
4. Assign a 'riskLevel' of 'LOW', 'MEDIUM', or 'HIGH' based on clinical red flags in symptoms (e.g., chest pain, shortness of breath, high fever, pregnancy complications are HIGH risk).
5. State your 'confidence' score (0 to 100) based on clarity of symptom reports and history details.
6. Provide clear, actionable 'recommendedAction' for next steps (e.g. routine clinical visit, urgent ASHA follow up, or immediate emergency room referral).
7. Generate a professional clinical 'doctorSummary' optimized for medical handoffs (SBAR-like clinical synthesis).
8. Formulate a prominent 'medicalDisclaimer' that emphasizes this is an automated triage tool and not a replacement for a clinical diagnosis.`;
};

/**
 * Structured response schema for the Gemini model to output JSON.
 */
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    patientSummary: {
      type: Type.STRING,
      description: "A patient-facing empathetic summary of the reported symptoms and current presentation.",
    },
    detectedSymptoms: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "List of clinical symptoms extracted and identified from the request.",
    },
    possibleHealthConcerns: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "General physiological systems or possible categories of concern to discuss with a medical provider. No direct definitive diagnosis of diseases.",
    },
    riskLevel: {
      type: Type.STRING,
      description: "Low, Medium, or High triage priority based on symptom severity and red flags. Must be one of LOW, MEDIUM, or HIGH.",
    },
    confidence: {
      type: Type.INTEGER,
      description: "A confidence percentage score from 0 to 100 regarding the quality and completeness of the data provided.",
    },
    recommendedAction: {
      type: Type.STRING,
      description: "Actionable, clear next steps for the patient (e.g. check in with ASHA worker, visit primary clinic, or proceed to nearest hospital emergency room).",
    },
    doctorSummary: {
      type: Type.STRING,
      description: "A professional, concise medical synthesis of the case designed for clinical handoff.",
    },
    medicalDisclaimer: {
      type: Type.STRING,
      description: "A clear, standard medical disclaimer stating that this tool does not diagnose, prescribe, or replace professional care.",
    },
  },
  required: [
    "patientSummary",
    "detectedSymptoms",
    "possibleHealthConcerns",
    "riskLevel",
    "confidence",
    "recommendedAction",
    "doctorSummary",
    "medicalDisclaimer",
  ],
};

/**
 * Reusable clinical symptom analysis and triage function.
 * Utilizes the modern Google GenAI SDK to obtain structured JSON triage summaries.
 * 
 * @param request Clinical and demographic data for the patient being triaged.
 * @returns A promise resolving to a structured SymptomAnalysisResponse.
 * @throws Meaningful descriptive errors on API timeouts, invalid credentials, rate limiting, or network failures.
 */
export async function analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please define the VITE_GEMINI_API_KEY environment variable in your .env or configure GEMINI_API_KEY in AI Studio Secrets."
    );
  }

  // Initialize the SDK lazily so that it does not error during module load if key is empty
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Setup abort controller for client-side timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: PROMPT_TEMPLATE(request),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature ensures consistent and reliable triage recommendations
      },
    });

    clearTimeout(timeoutId);

    if (!response || !response.text) {
      throw new Error("Received empty response from the Gemini AI model.");
    }

    try {
      const parsedData = JSON.parse(response.text.trim());
      
      // Ensure riskLevel is properly formatted and normalized
      if (parsedData.riskLevel) {
        const normalizedRisk = parsedData.riskLevel.toUpperCase();
        if (['LOW', 'MEDIUM', 'HIGH'].includes(normalizedRisk)) {
          parsedData.riskLevel = normalizedRisk;
        } else {
          parsedData.riskLevel = 'MEDIUM'; // Fallback safe triage level
        }
      }

      // Validate required fields are present in response JSON
      const requiredFields = [
        'patientSummary',
        'detectedSymptoms',
        'possibleHealthConcerns',
        'riskLevel',
        'confidence',
        'recommendedAction',
        'doctorSummary',
        'medicalDisclaimer'
      ];
      
      const missingFields = requiredFields.filter(field => !(field in parsedData));
      if (missingFields.length > 0) {
        throw new Error(`The AI response was missing required fields: ${missingFields.join(', ')}`);
      }

      return parsedData as SymptomAnalysisResponse;
    } catch (parseError: any) {
      throw new Error(`Failed to parse AI response into a valid SymptomAnalysisResponse: ${parseError.message}`);
    }

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle abort / timeout
    if (error.name === 'AbortError') {
      throw new Error("The request to the Gemini API timed out after 15 seconds. Please try again.");
    }

    // Inspect error message to construct friendly, informative developer/user alerts
    const errorMessage = error.message || String(error);
    
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      throw new Error("Gemini API rate limit exceeded. Please wait a moment before trying again.");
    }

    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('invalid api key') || errorMessage.includes('403')) {
      throw new Error("Invalid Gemini API Key. Please verify your credentials in AI Studio Secrets.");
    }

    if (errorMessage.includes('fetch failed') || errorMessage.includes('NetworkError') || errorMessage.includes('ENOTFOUND')) {
      throw new Error("Network connection failure. Please check your internet connectivity and try again.");
    }

    // Default error propagation
    throw new Error(`Gemini AI Service Error: ${errorMessage}`);
  }
}

/**
 * Structured SOAP response returned by the documentation assistant.
 */
export interface SOAPNotesResponse {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const soapResponseSchema = {
  type: Type.OBJECT,
  properties: {
    subjective: {
      type: Type.STRING,
      description: "Subjective section: Includes chief complaints, history of present illness (HPI), past medical history, medications, allergies, and social history.",
    },
    objective: {
      type: Type.STRING,
      description: "Objective section: Records vital signs (BP, Temp, Pulse, Weight, SpO2) and summarizes the clinical observations or physical examination findings.",
    },
    assessment: {
      type: Type.STRING,
      description: "Assessment section: Triage analysis, physiological system concerns, or differential differential categories. MUST NOT give a definitive diagnosis.",
    },
    plan: {
      type: Type.STRING,
      description: "Plan section: Diagnostic recommendations, non-pharmacological care advice, follow-up instructions, and emergency warnings. MUST NOT prescribe specific medicines.",
    },
  },
  required: ["subjective", "objective", "assessment", "plan"],
};

const SOAP_PROMPT_TEMPLATE = (request: any): string => {
  return `You are a clinical documentation assistant. Generate a highly professional SOAP note (Subjective, Objective, Assessment, Plan) based on the following patient clinical information:

PATIENT INFORMATION:
- Name: ${request.patientInformation.fullName}
- Age: ${request.patientInformation.age}
- Gender: ${request.patientInformation.gender}
- Location: Village: ${request.patientInformation.village}, District: ${request.patientInformation.district}

SYMPTOMS / INTAKE COMPLAINT:
${request.symptoms.map((s: string) => `- ${s}`).join('\n')}

MEDICAL HISTORY:
- Chronic Diseases: ${request.medicalHistory.chronicDiseases?.join(', ') || 'None reported'}
- Current Medications: ${request.medicalHistory.medications?.join(', ') || 'None reported'}
- Allergies: ${request.medicalHistory.allergies?.join(', ') || 'None reported'}

VITALS ENTERED:
- Blood Pressure: ${request.vitals.bpSystolic}/${request.vitals.bpDiastolic} mmHg
- Temperature: ${request.vitals.temperature} °F
- Pulse: ${request.vitals.pulse} BPM
- Weight: ${request.vitals.weight} kg
- Oxygen Saturation (SpO2): ${request.vitals.oxygenSaturation} %

CLINICAL OBSERVATIONS:
"${request.clinicalObservations || 'None provided.'}"

CRITICAL CLINICAL & SAFETY CONSTRAINTS:
1. You are assisting with CLINICAL DOCUMENTATION ONLY.
2. DO NOT make a definitive diagnosis. Frame the "Assessment" as general physiological concerns, differential categories, or systems affected (e.g. 'Cardiovascular / Hypertension concern' or 'Pregnancy-related symptoms to monitor').
3. DO NOT prescribe specific medications, dosages, or drug instructions. Focus on general therapeutics, non-pharmacological advice, education, follow-up, and red-flag emergency symptoms in the "Plan".
4. Ensure the output is concise, structured, professional, and useful for medical professionals.`;
};

/**
 * Generates SOAP Notes based on patient info, symptoms, vitals, history, and observations.
 */
export async function generateSOAPNotes(request: {
  patientInformation: PatientInformation;
  symptoms: string[];
  medicalHistory: MedicalHistory;
  vitals: {
    bpSystolic: number;
    bpDiastolic: number;
    pulse: number;
    temperature: number;
    weight: number;
    oxygenSaturation: number;
  };
  clinicalObservations: string;
}): Promise<SOAPNotesResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please define the VITE_GEMINI_API_KEY environment variable in your .env or configure GEMINI_API_KEY in AI Studio Secrets."
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: SOAP_PROMPT_TEMPLATE(request),
      config: {
        systemInstruction: "You are an expert clinical scribe. Format documentation neatly in standard medical format. Adhere strictly to the safety guidelines.",
        responseMimeType: 'application/json',
        responseSchema: soapResponseSchema,
        temperature: 0.2,
      },
    });

    clearTimeout(timeoutId);

    if (!response || !response.text) {
      throw new Error("Received empty response from the Gemini AI model.");
    }

    try {
      return JSON.parse(response.text.trim()) as SOAPNotesResponse;
    } catch (parseError: any) {
      throw new Error(`Failed to parse AI response into a valid SOAPNotesResponse: ${parseError.message}`);
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("The request to the Gemini API timed out after 15 seconds. Please try again.");
    }
    throw new Error(`Gemini SOAP Note Generation Error: ${error.message || String(error)}`);
  }
}

