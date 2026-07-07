import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI lazily
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in process.env. Falling back to unauthenticated mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Define response schema for AI insights
const insightsResponseSchema = {
  type: Type.OBJECT,
  properties: {
    insights: {
      type: Type.ARRAY,
      description: "List of custom AI-generated operational insights for the District Health Officer.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Concise title describing the operational insight (e.g., 'AWD Cluster Warning', 'Bhander Block Referrals Alert')."
          },
          category: {
            type: Type.STRING,
            description: "Category of the insight. MUST be one of: 'outbreak', 'attention', 'bottleneck', 'workload', 'campaign'."
          },
          description: {
            type: Type.STRING,
            description: "Clear and specific description summarizing the finding, referencing exact metrics or villages/PHCs involved."
          },
          severity: {
            type: Type.STRING,
            description: "Severity level of this insight. MUST be one of: 'high', 'medium', 'low'."
          },
          recommendedActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 highly actionable operational recommendations for ASHAs, PHC medical officers, or District teams."
          },
          targetedArea: {
            type: Type.STRING,
            description: "Name of the village or PHC primarily affected (e.g. 'Unao Village', 'Bhander PHC')."
          },
          metricsReference: {
            type: Type.STRING,
            description: "A summary statistic from the data justifying this finding (e.g. '5 active high-risk reports', 'AWD cases increased by 40%')."
          }
        },
        required: ["title", "category", "description", "severity", "recommendedActions"]
      }
    }
  },
  required: ["insights"]
};

// System instruction for the Chief Epidemiologist AI
const SYSTEM_INSTRUCTION = `You are an expert Chief Epidemiologist and Health Operations Specialist assisting the District Health Officer (DHO) of Datia District.
Analyze the provided district healthcare metrics, disease trends, geographic hotspots, and recent patient clinical summaries to generate concise, highly actionable operational insights.

Your generated insights must cover exactly:
1. Possible disease outbreak trends (identify rising cases, suspect pathogen patterns, or local clustering).
2. Villages requiring immediate attention (identify villages with elevated risk, high case numbers, or critical alerts).
3. Referral bottlenecks (identify points where patients are being escalated/referred heavily, or potential hospital transfer delays).
4. PHCs with increased workload (identify PHCs experiencing heavy clinical review burdens or spikes in active monitoring).
5. Suggested awareness campaigns (propose direct community education or targeted preventative interventions based on the active pathogens or risk factors).

CRITICAL GUIDELINES:
- Ensure all insights are completely concise, specific, and grounded in the actual provided data.
- Avoid generic descriptions. Name actual villages (e.g. Unao Village, Bhander Block, Indergarh, Seondha) or PHCs and mention specific figures or symptom combinations from the data.
- State precise recommended actions that are logistically feasible for district rapid response units and community workers (ASHAs).
- Frame insights professionally and objectively.`;

// API Endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// API Endpoint: Generate operational insights
app.post('/api/gemini/insights', async (req, res) => {
  try {
    const { metrics, reports } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "Missing API Key",
        message: "Gemini API key is not configured on the server. Please verify environment settings."
      });
    }

    // Format the prompt with aggregated metrics and reports
    const formattedPrompt = `Please analyze the following real-time district-level dataset and produce structured operational insights:

AGGREGATED DISTRICT METRICS:
- Total Active Cases: ${metrics?.totalActiveCases ?? 0}
- High-Risk Cases: ${metrics?.highRiskCases ?? 0}
- Reviewed Today: ${metrics?.casesReviewedToday ?? 0}
- Pending Clinician Review: ${metrics?.pendingDoctorReviews ?? 0}
- Average AI Risk Score: ${metrics?.averageAiRiskScore ?? 0}%
- Total Referral Count: ${metrics?.referralCount ?? 0}
- Home Visits Completed: ${metrics?.homeVisitsCompleted ?? 0}

DISEASE DISTRIBUTION & TRENDS:
${metrics?.diseaseTrends?.map((t: any) => `- ${t.name}: ${t.count} active cases`).join('\n') || 'None reported'}

GEOGRAPHIC OUTBREAK HOTSPOTS:
${metrics?.hotspots?.map((h: any) => `- Village: ${h.village}, Block/Taluk: ${h.taluk}, Total Cases: ${h.caseCount}, High-Risk: ${h.highRiskCount}`).join('\n') || 'None reported'}

RECENT PATIENT CLINICAL SUMMARIES:
${reports?.slice(0, 15).map((r: any) => {
  const patientName = r.patientInformation?.fullName || 'Anonymous';
  const village = r.patientInformation?.village || 'Unknown';
  const symptoms = r.symptoms || 'None reported';
  const risk = r.riskLevel || 'LOW';
  const diagnosis = r.geminiAnalysis?.possibleHealthConcerns?.join(', ') || 'N/A';
  return `- Patient ${patientName} (${village}): Symptoms: [${symptoms}], Risk: ${risk}, Possible Concerns: [${diagnosis}]`;
}).join('\n') || 'No recent case logs available.'}

Instructions:
1. Examine these data points for anomalies, localized outbreaks, high workload indicators, and referral patterns.
2. Produce a high-quality JSON object matching the requested schema with 5 concise, actionable insight cards (one corresponding to each operational category: outbreak, attention, bottleneck, workload, campaign).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: insightsResponseSchema,
        temperature: 0.2,
      },
    });

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsedResponse = JSON.parse(response.text.trim());
    res.json(parsedResponse);
  } catch (error: any) {
    console.error("Gemini Insights generation error:", error);
    res.status(500).json({
      error: "Insights Generation Failed",
      message: error.message || "An unexpected error occurred while communicating with Gemini."
    });
  }
});

// Start Server Setup (Vite integration)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Health AI Server] running on http://localhost:${PORT} under ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
