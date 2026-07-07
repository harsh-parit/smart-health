import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Activity, 
  FileText, 
  Brain, 
  Megaphone, 
  HelpCircle, 
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DistrictIntelligenceMetrics } from '../../types';

interface OperationalInsightCard {
  title: string;
  category: 'outbreak' | 'attention' | 'bottleneck' | 'workload' | 'campaign';
  description: string;
  severity: 'high' | 'medium' | 'low';
  recommendedActions: string[];
  targetedArea?: string;
  metricsReference?: string;
}

interface DhoAiInsightsPanelProps {
  liveMetrics: DistrictIntelligenceMetrics | null;
}

export default function DhoAiInsightsPanel({ liveMetrics }: DhoAiInsightsPanelProps) {
  const [insights, setInsights] = useState<OperationalInsightCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchAiInsights = async (force: boolean = false) => {
    // Prevent fetching if already loading
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // Structure the payload
      const payload = {
        metrics: liveMetrics ? {
          totalActiveCases: liveMetrics.totalActiveCases,
          highRiskCases: liveMetrics.highRiskCases,
          casesReviewedToday: liveMetrics.casesReviewedToday,
          pendingDoctorReviews: liveMetrics.pendingDoctorReviews,
          averageAiRiskScore: liveMetrics.averageAiRiskScore,
          referralCount: liveMetrics.referralCount,
          homeVisitsCompleted: liveMetrics.homeVisitsCompleted,
          diseaseTrends: liveMetrics.diseaseTrends.map(t => ({ name: t.name, count: t.count })),
          hotspots: liveMetrics.hotspots.map(h => ({
            village: h.village,
            taluk: h.taluk,
            caseCount: h.caseCount,
            highRiskCount: h.highRiskCount
          }))
        } : null,
        reports: liveMetrics?.reports?.map(r => ({
          patientInformation: {
            fullName: r.patientInformation?.fullName,
            village: r.patientInformation?.village,
            gender: r.patientInformation?.gender,
            age: r.patientInformation?.age
          },
          symptoms: r.symptoms,
          riskLevel: r.riskLevel,
          geminiAnalysis: {
            possibleHealthConcerns: r.geminiAnalysis?.possibleHealthConcerns
          }
        })) || []
      };

      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned error status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
        setLastRefreshed(new Date());
      } else {
        throw new Error("Received an invalid format for operational insights from Gemini.");
      }
    } catch (err: any) {
      console.error("Error loading AI insights:", err);
      setError(err.message || "Failed to load operational intelligence insights. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if metrics are available and we don't have insights yet
  useEffect(() => {
    if (liveMetrics && insights.length === 0 && !loading && !error) {
      fetchAiInsights();
    }
  }, [liveMetrics]);

  // Map categories to visual themes
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'outbreak':
        return {
          bg: 'bg-rose-50 border-rose-200/60 text-rose-800',
          darkBg: 'bg-rose-950/20 border-rose-800/30 text-rose-400',
          badgeBg: 'bg-rose-100 text-rose-700 border-rose-200/50',
          darkBadgeBg: 'bg-rose-900/50 text-rose-300 border-rose-800/40',
          icon: ShieldAlert,
          label: 'Outbreak Warning'
        };
      case 'attention':
        return {
          bg: 'bg-amber-50 border-amber-200/60 text-amber-800',
          darkBg: 'bg-amber-950/20 border-amber-800/30 text-amber-400',
          badgeBg: 'bg-amber-100 text-amber-700 border-amber-200/50',
          darkBadgeBg: 'bg-amber-900/50 text-amber-300 border-amber-800/40',
          icon: AlertTriangle,
          label: 'Immediate Attention'
        };
      case 'bottleneck':
        return {
          bg: 'bg-orange-50 border-orange-200/60 text-orange-800',
          darkBg: 'bg-orange-950/20 border-orange-800/30 text-orange-400',
          badgeBg: 'bg-orange-100 text-orange-700 border-orange-200/50',
          darkBadgeBg: 'bg-orange-900/50 text-orange-300 border-orange-800/40',
          icon: Clock,
          label: 'Referral Bottleneck'
        };
      case 'workload':
        return {
          bg: 'bg-blue-50 border-blue-200/60 text-blue-800',
          darkBg: 'bg-blue-950/20 border-blue-800/30 text-blue-400',
          badgeBg: 'bg-blue-100 text-blue-700 border-blue-200/50',
          darkBadgeBg: 'bg-blue-900/50 text-blue-300 border-blue-800/40',
          icon: Activity,
          label: 'PHC Workload Burden'
        };
      case 'campaign':
        return {
          bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-800',
          darkBg: 'bg-emerald-950/20 border-emerald-800/30 text-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200/50',
          darkBadgeBg: 'bg-emerald-900/50 text-emerald-300 border-emerald-800/40',
          icon: Megaphone,
          label: 'Awareness Campaign'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-800',
          darkBg: 'bg-slate-900/50 border-slate-800 text-slate-300',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          darkBadgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: FileText,
          label: 'General Insight'
        };
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/10 border border-rose-500/20 text-rose-600 font-bold';
      case 'medium':
        return 'bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold';
      default:
        return 'bg-slate-500/10 border border-slate-500/20 text-slate-600 font-bold';
    }
  };

  return (
    <div className="space-y-6" id="dho-ai-insights-panel">
      {/* Disclaimer Banner */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 text-orange-800 text-xs shadow-xs">
        <HelpCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-[13px] text-orange-900">Clinical Support & Safety Disclaimer</span>
          <p className="mt-0.5 text-orange-755 leading-relaxed">
            These AI-generated insights are designed solely to assist the District Health Officer (DHO) in operational planning, epidemiological triage, and resource allocation. They are generated automatically by a predictive clinical model analyzing localized village reports, and do not replace formal public health assessments, official medical diagnoses, or laboratory-verified clinical findings.
          </p>
        </div>
      </div>

      {/* Header and Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/60 p-6 rounded-[2rem] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>GEMINI INTEL HUB</span>
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-[11px] text-slate-500 font-mono">DATIA DISPATCH SERVICE</span>
          </div>
          <h2 className="text-2xl font-display font-black text-slate-900 mt-1.5">Epidemiological Operations Control</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            AI-generated tactical briefings mapping critical bottlenecks, workload patterns, and potential pathogen outbreaks.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-start">
          {lastRefreshed && (
            <span className="text-[10px] font-mono text-slate-400">
              Synced: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchAiInsights(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-slate-950 text-white rounded-full text-xs font-bold hover:bg-slate-900 active:scale-98 transition-all disabled:opacity-50 cursor-pointer shadow-xs shrink-0 select-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing Dataset...' : 'Refresh Intelligence'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading && insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/50 rounded-[2.5rem] space-y-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
            <Brain className="w-6 h-6 text-slate-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-bold text-slate-900">Synthesizing District Triage Stream</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs px-4">
              Analyzing village reports, mapping referral transfer times, and running geospatial clustering...
            </p>
          </div>
        </div>
      ) : error && insights.length === 0 ? (
        <div className="p-8 text-center bg-rose-50/50 border border-rose-100 rounded-[2rem] space-y-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl inline-block">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-bold text-rose-900">Operational Synthesis Halted</h4>
            <p className="text-xs text-rose-600 mt-1 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => fetchAiInsights(true)}
            className="px-5 py-2 bg-slate-950 text-white text-xs font-bold rounded-full hover:bg-slate-900 active:scale-97 transition-all cursor-pointer"
          >
            Retry Dataset Extraction
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map((insight, idx) => {
              const styles = getCategoryStyles(insight.category);
              const CategoryIcon = styles.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white border border-slate-200/60 rounded-[2.5rem] p-6.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden"
                >
                  {/* Subtle decorative background glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full ${insight.category === 'outbreak' ? 'bg-rose-500/5' : insight.category === 'attention' ? 'bg-amber-500/5' : insight.category === 'bottleneck' ? 'bg-orange-500/5' : insight.category === 'workload' ? 'bg-blue-500/5' : 'bg-emerald-500/5'} pointer-events-none`} />

                  {/* Top Bar of Card */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl border ${styles.darkBg || styles.bg}`}>
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {styles.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${getSeverityBadgeClass(insight.severity)}`}>
                          {insight.severity} Priority
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-[17px] font-display font-black text-slate-900 group-hover:text-slate-800 transition-colors">
                        {insight.title}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100/50 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase">
                        <Sparkles className="w-2.5 h-2.5 animate-pulse text-indigo-600" />
                        <span>AI-Generated Operational Insight</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1">
                      {insight.description}
                    </p>

                    {/* Context Specific Attributes */}
                    {(insight.targetedArea || insight.metricsReference) && (
                      <div className="grid grid-cols-2 gap-3 pt-2 pb-1 border-t border-slate-150/50">
                        {insight.targetedArea && (
                          <div>
                            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Primary Target</span>
                            <span className="text-[11px] font-semibold text-slate-800 font-sans block mt-0.5 truncate">
                              {insight.targetedArea}
                            </span>
                          </div>
                        )}
                        {insight.metricsReference && (
                          <div>
                            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Reference Metric</span>
                            <span className="text-[11px] font-semibold text-indigo-700 font-mono block mt-0.5 truncate">
                              {insight.metricsReference}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-4 space-y-2.5">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider block">Recommended Interventions</span>
                    <ul className="space-y-1.5">
                      {insight.recommendedActions.map((action, actionIdx) => (
                        <li key={actionIdx} className="flex gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-normal font-sans">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
