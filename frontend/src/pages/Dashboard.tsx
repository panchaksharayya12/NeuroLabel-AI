import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  FileEdit,
  Eye,
  Globe,
  UserCheck,
  CheckCircle,
  Lightbulb,
  Download,
  Lock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  RotateCw,
  Sparkles,
  Info
} from 'lucide-react';
import { api, getMediaUrl } from '../api/client';
import { DashboardData, AgentExecution } from '../types';

interface DashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
  onOpenInnovation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenInnovation }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'English (India)' | 'German (EU)' | 'Comparison'>('English (India)');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [selectedAgentDetail, setSelectedAgentDetail] = useState<AgentExecution | null>(null);

  useEffect(() => {
    loadDashboard();
    // Auto refresh every 5 seconds if workflow is running
    const interval = setInterval(() => {
      loadDashboard(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleTriggerWorkflow = async () => {
    if (!data?.hero_card?.request_id) return;
    setIsOrchestrating(true);
    try {
      await api.runRequestPipeline(data.hero_card.request_id);
      await loadDashboard(false);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsOrchestrating(false), 2000);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <RotateCw className="w-10 h-10 text-cyan-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Connecting to NeuroLabel AI Agent Network...</p>
      </div>
    );
  }

  // Fallbacks if data empty
  const hero = data?.hero_card || {
    badge: 'LIVE',
    subtitle: 'Change Detected',
    title: 'Safety Warning Update',
    description: 'New regulatory requirement for fire risk during use.',
    button_text: 'View Details →',
    request_id: 1,
    badge_tag: 'Update Required Across 2 markets (India, EU)',
    product_model: 'CardioSense Monitor Model: CS-100'
  };

  const demoScenario = data?.demo_scenario || {
    title: 'Demo Scenario',
    status: 'In Progress',
    product: 'CardioSense Monitor (CS-100)',
    markets: ['India', 'EU'],
    languages: ['English', 'German'],
    request_id: 1,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80'
  };

  const agents = data?.agent_workflow || [];

  // Agent icons mapping
  const getAgentVisuals = (key: string) => {
    switch (key) {
      case 'change_impact':
        return { icon: Search, color: 'from-purple-500 to-indigo-600', glow: 'shadow-glow-purple', border: 'border-purple-400/40' };
      case 'label_authoring':
        return { icon: FileEdit, color: 'from-cyan-500 to-blue-600', glow: 'shadow-glow-cyan', border: 'border-cyan-400/40' };
      case 'compliance':
        return { icon: Shield, color: 'from-amber-500 to-orange-600', glow: 'shadow-orange-500/30', border: 'border-amber-400/40' };
      case 'artwork_vision':
        return { icon: Eye, color: 'from-pink-500 to-rose-600', glow: 'shadow-glow-pink', border: 'border-pink-400/40' };
      case 'translation':
        return { icon: Globe, color: 'from-blue-500 to-cyan-600', glow: 'shadow-glow-blue', border: 'border-blue-400/40' };
      case 'risk_quality':
        return { icon: AlertTriangle, color: 'from-teal-500 to-emerald-600', glow: 'shadow-teal-500/30', border: 'border-teal-400/40' };
      case 'human_approval':
        return { icon: UserCheck, color: 'from-violet-500 to-purple-600', glow: 'shadow-glow-purple', border: 'border-violet-400/40' };
      case 'release_audit':
        return { icon: CheckCircle, color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30', border: 'border-emerald-400/40' };
      default:
        return { icon: Sparkles, color: 'from-blue-600 to-indigo-600', glow: 'shadow-glow-blue', border: 'border-blue-400/40' };
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* ========================================================
          TOP HERO ROW: HERO CARD (Left) + DEMO SCENARIO (Right)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HERO CARD (Left ~68%) */}
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#101E3D] to-[#0B1528] border border-blue-500/30 p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between group">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Row: Live Badge & Title */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>{hero.badge}</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{hero.subtitle}</span>
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {hero.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-md">
                {hero.description}
              </p>

              <button
                onClick={() => onNavigate('request-details', { requestId: hero.request_id })}
                className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold tracking-wide transition-all border border-blue-400/40 shadow-glow-blue"
              >
                <span>{hero.button_text}</span>
              </button>
            </div>

            {/* Visual Medical-Device Label Graphic with Holographic Shield */}
            <div className="relative flex items-center justify-center p-2">
              {/* Holographic Shield in background */}
              <div className="absolute -left-6 w-28 h-32 opacity-70 pointer-events-none flex items-center justify-center">
                <Shield className="w-24 h-24 text-blue-400/40 animate-pulse-slow" />
              </div>

              {/* Holographic Floating Label Card Mockup */}
              <div className="relative w-72 md:w-80 bg-white text-slate-900 rounded-xl p-3 shadow-2xl border border-slate-200 text-[11px] transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-start border-b border-slate-200 pb-1.5 mb-1.5">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">CardioSense Monitor</div>
                    <div className="text-[10px] text-slate-500">Model: CS-100</div>
                  </div>
                  <div className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">LOT 2024A</div>
                </div>

                <div className="flex items-center space-x-2 my-1 text-[10px] font-mono text-slate-700">
                  <span className="font-bold border border-slate-400 px-1 rounded">UDI</span>
                  <span>CE 0123</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                </div>

                {/* Simulated Barcode */}
                <div className="h-5 w-full bg-slate-800 rounded flex items-center justify-around px-1 mt-1">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className={`h-4 bg-white ${i % 3 === 0 ? 'w-1' : 'w-0.5'}`}></div>
                  ))}
                </div>

                {/* Cyan Floating Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-cyan-300/40 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                  <span>{hero.badge_tag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DEMO SCENARIO CARD (Right ~32%) */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#121B30] border border-[#1E2E50] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center border border-blue-500/30">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">{demoScenario.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{demoScenario.status}</span>
              </span>
            </div>

            {/* Metadata and Device Graphic */}
            <div className="flex items-start justify-between gap-4 mt-2">
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Product:</span>
                  <p className="font-semibold text-white mt-0.5">{demoScenario.product}</p>
                </div>
                <div>
                  <span className="text-slate-400">Markets:</span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    {demoScenario.markets.map((m, idx) => (
                      <span key={idx} className="font-medium text-slate-200">
                        {m}{idx < demoScenario.markets.length - 1 ? '  |  ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Languages:</span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    {demoScenario.languages.map((l, idx) => (
                      <span key={idx} className="font-medium text-slate-200">
                        {l}{idx < demoScenario.languages.length - 1 ? '  |  ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medical device photo & Flag pills */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-18 rounded-xl overflow-hidden border border-blue-500/30 shadow-lg bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80"
                    alt="CardioSense Device"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs" title="India Flag">🇮🇳</span>
                  <span className="text-xs" title="European Union Flag">🇪🇺</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#1C2A47] flex items-center justify-between">
            <button
              onClick={() => onNavigate('request-details', { requestId: demoScenario.request_id })}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
            >
              <span>View Full Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleTriggerWorkflow}
              disabled={isOrchestrating}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[#16233B] hover:bg-[#1E2F50] text-slate-200 border border-[#2B3F6B] flex items-center space-x-1.5 transition-all"
            >
              <RotateCw className={`w-3 h-3 text-cyan-400 ${isOrchestrating ? 'animate-spin' : ''}`} />
              <span>{isOrchestrating ? 'Running AI...' : 'Re-Run Agents'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          AGENTIC WORKFLOW: 8 CONNECTED GLOWING AGENT CARDS
         ======================================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C1322] via-[#0E172A] to-[#0C1322] border border-[#1E2E50] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-3 border-b border-[#1A2845] gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-wide">Agentic Workflow</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-400 border border-blue-500/40 font-semibold">
                Autonomous + Human Oversight
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Multiple AI agents. One intelligent ecosystem.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">Click any agent to inspect outputs:</span>
            <button
              onClick={handleTriggerWorkflow}
              disabled={isOrchestrating}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-glow-blue flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Run Pipeline</span>
            </button>
          </div>
        </div>

        {/* 8 Connected Agent Nodes with Connectors */}
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="flex items-center min-w-[1020px] justify-between relative px-2">
            {agents.map((agent, index) => {
              const visuals = getAgentVisuals(agent.agent_key);
              const Icon = visuals.icon;
              const isRunning = agent.status === 'Running' || (agent.agent_key === 'translation' && agent.status === 'In Progress');
              const isCompleted = agent.status === 'Completed';
              const isNeedsReview = agent.status === 'Needs Review';
              const isPending = agent.status === 'Pending';

              return (
                <React.Fragment key={agent.id || index}>
                  {/* Single Agent Node */}
                  <div
                    onClick={() => setSelectedAgentDetail(agent)}
                    className="flex flex-col items-center cursor-pointer group transition-all transform hover:-translate-y-1"
                  >
                    {/* Glowing Circular Icon Card */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center p-3 relative border transition-all duration-300 ${
                        isRunning
                          ? `${visuals.glow} border-cyan-400 animate-pulse`
                          : isCompleted
                          ? `${visuals.border} bg-[#111A2E] shadow-lg`
                          : 'border-slate-700/60 bg-[#0B101D] opacity-70'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr ${visuals.color} text-white shadow-md`}
                      >
                        <Icon className={`w-6 h-6 ${isRunning ? 'animate-spin-slow' : ''}`} />
                      </div>

                      {/* Small Status Badge Indicator */}
                      <div className="absolute -top-1 -right-1">
                        {isCompleted && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {isRunning && (
                          <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow animate-spin">
                            <RotateCw className="w-3 h-3" />
                          </div>
                        )}
                        {isNeedsReview && (
                          <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow animate-bounce">
                            <UserCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Agent Name */}
                    <span className="text-[12px] font-semibold text-slate-200 mt-2.5 text-center max-w-[100px] leading-tight group-hover:text-cyan-400 transition-colors">
                      {agent.agent_name}
                    </span>

                    {/* Status Pill */}
                    <div className="mt-1.5 flex items-center space-x-1">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isRunning
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                            : isNeedsReview
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>

                    {/* Execution Time Display */}
                    <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-0.5">
                      {agent.execution_time_display}
                    </span>
                  </div>

                  {/* Connecting Arrow between nodes */}
                  {index < agents.length - 1 && (
                    <div className="flex-1 flex items-center justify-center px-1">
                      <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-500/30 relative">
                        <ChevronRight className="w-4 h-4 text-cyan-400/70 absolute -top-2 right-1/2 translate-x-2" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          MIDDLE ROW: COLLABORATION (Left) + LABEL PREVIEW (Mid) + COMPLIANCE SCORE (Right)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AGENT COLLABORATION STREAM (Left ~42%) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white">Agent Collaboration</h3>
              <span className="text-[11px] text-cyan-400/80 font-mono">Live Sync</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Each agent works on its task and shares insights in real-time.</p>

            {/* Live Feed Items */}
            <div className="space-y-3">
              {(data?.agent_collaboration || []).map((item, idx) => {
                const visuals = getAgentVisuals(item.agent_key);
                const Icon = visuals.icon;
                const isRunning = item.status === 'In Progress';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#10192E] border border-[#1A2A4A] flex items-start space-x-3 hover:border-blue-500/40 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${visuals.color} text-white shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                          <span>{item.agent_name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">{item.timestamp_str}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            isRunning
                              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{item.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C2A47] text-right">
            <button
              onClick={() => onNavigate('request-details', { requestId: hero.request_id })}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1"
            >
              <span>View Full Orchestration Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* LABEL PREVIEW CARD (Middle ~35%) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0C1322] border border-[#1E2E50] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white">Label Preview</h3>
              {/* Language Tabs */}
              <div className="flex items-center bg-[#070B14] p-1 rounded-lg border border-[#1E2E50]">
                {(['English (India)', 'German (EU)', 'Comparison'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-semibold px-2 py-1 rounded transition-colors ${
                      activeTab === tab ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Device Physical Label Mockup */}
            <div className="bg-white text-slate-900 rounded-xl p-4 shadow-xl border border-slate-300 relative text-xs font-sans">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">CardioSense Monitor</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Model: CS-100</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">02:14 PM</span>
              </div>

              <div className="my-2 flex items-center justify-between text-[11px]">
                <div className="font-mono">
                  <span className="font-bold mr-1">SN</span> 123456789
                </div>
                <div className="font-mono text-[10px] text-slate-600">
                  <span className="font-bold border border-slate-400 px-1 rounded mr-1">UDI</span>
                  (01)00850012345678
                </div>
              </div>

              {/* Red Safety Warning Box with Hazard Glyph */}
              <div className="my-2 p-2 bg-rose-50 border border-rose-300 rounded-lg flex items-start space-x-2 text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-rose-700 block">Fire risk - Do not dispose of in fire.</span>
                  {activeTab === 'German (EU)' ? (
                    <span className="text-[10px] text-rose-800">WARNUNG: Brandgefahr - Nicht im Feuer entsorgen.</span>
                  ) : (
                    <span className="text-[10px] text-rose-800">Risk of explosion during use or charging.</span>
                  )}
                </div>
              </div>

              {/* Barcode & Regulatory Glyphs */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center space-x-1.5 font-bold text-[10px]">
                  <span>CE 0123</span>
                  <span className="border border-slate-300 px-1 rounded text-[9px]">IPX4</span>
                </div>
                {/* Barcode Simulation */}
                <div className="h-6 w-32 bg-slate-900 rounded flex items-center justify-around px-1">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`h-5 bg-white ${i % 2 === 0 ? 'w-1' : 'w-0.5'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-label Thumbnails */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div
                onClick={() => setActiveTab('English (India)')}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  activeTab === 'English (India)' ? 'bg-blue-950/40 border-cyan-400/50' : 'bg-[#10192E] border-[#1C2A47]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-200">
                  <span>🇮🇳</span>
                  <span>India Label</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">CDSCO Mandate • EN</p>
              </div>

              <div
                onClick={() => setActiveTab('German (EU)')}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  activeTab === 'German (EU)' ? 'bg-blue-950/40 border-cyan-400/50' : 'bg-[#10192E] border-[#1C2A47]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-200">
                  <span>🇪🇺</span>
                  <span>EU Label</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">MDR Annex I • DE</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C2A47]">
            <button
              onClick={() => onNavigate('label-library')}
              className="w-full py-2 rounded-xl bg-[#111C33] hover:bg-[#162544] text-cyan-400 font-semibold text-xs border border-cyan-500/30 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>View Full Labels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COMPLIANCE SCORE & KEY INSIGHTS (Right ~23%) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#0C1322] border border-[#1E2E50] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-3">Compliance Score</h3>

            {/* Radial Progress Ring & Breakdown */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1C2A47]">
              {/* Radial Meter */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400"
                    strokeDasharray="92, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-extrabold text-white">92%</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider">Overall</span>
                </div>
              </div>

              {/* Categories breakdown list */}
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Product Info</span>
                  <span className="font-semibold text-white">100%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Regulatory</span>
                  <span className="font-semibold text-white">90%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>UDI</span>
                  <span className="font-semibold text-white">95%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Safety Warnings</span>
                  <span className="font-semibold text-amber-400">85%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Symbols</span>
                  <span className="font-semibold text-white">90%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Country Specific</span>
                  <span className="font-semibold text-amber-400">88%</span>
                </div>
              </div>
            </div>

            {/* Key Insights List matching reference image */}
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Key Insights</h4>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-[#10192E] border border-[#1A2A4A] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-rose-400 min-w-0 pr-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] text-slate-200 truncate">1 warning symbol size issue (EU).</span>
                  </div>
                  <button
                    onClick={() => onNavigate('artwork-validation')}
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold shrink-0"
                  >
                    View
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-[#10192E] border border-[#1A2A4A] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-cyan-400 min-w-0 pr-1">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] text-slate-200 truncate">2 translation terminology mismatches (DE).</span>
                  </div>
                  <button
                    onClick={() => onNavigate('translation-validation')}
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold shrink-0"
                  >
                    View
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-[#10192E] border border-[#1A2A4A] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-amber-400 min-w-0 pr-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] text-slate-200 truncate">1 minor compliance gap (India).</span>
                  </div>
                  <button
                    onClick={() => onNavigate('compliance')}
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold shrink-0"
                  >
                    View
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-[#10192E] border border-[#1A2A4A] flex items-center space-x-2 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-slate-300">All other checks passed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          BOTTOM ROW: PROGRESS STEPPER (Left) + INNOVATION (Mid) + EXPECTED IMPACT (Right)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DEMO SCENARIO PROGRESS STEPPER (Left ~36%) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0C1322] border border-[#1E2E50] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Demo Scenario Progress</h4>
            <span className="text-[10px] font-mono text-cyan-400">LN-2024-0891</span>
          </div>

          {/* Stepper with checkmarks, active icon, and locked padlock */}
          <div className="flex items-center justify-between px-1 relative">
            {[
              { label: 'Change Detected', status: 'completed' },
              { label: 'Analysis Complete', status: 'completed' },
              { label: 'Label Draft Ready', status: 'completed' },
              { label: 'Validations Complete', status: 'completed' },
              { label: 'Awaiting Human Approval', status: 'active' },
              { label: 'Release', status: 'locked' }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === 'completed'
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow'
                      : step.status === 'active'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-glow-blue animate-pulse'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : step.status === 'active' ? (
                    <UserCheck className="w-4 h-4" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <span className="text-[9px] font-medium text-slate-300 mt-2 text-center max-w-[55px] leading-tight">
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C2A47]">
            <button
              onClick={() => onNavigate('request-details', { requestId: hero.request_id })}
              className="w-full py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 text-xs font-semibold border border-blue-500/40 text-center transition-colors"
            >
              Sign-Off on Request →
            </button>
          </div>
        </div>

        {/* OUR INNOVATION CARD (Middle ~26%) */}
        <div className="lg:col-span-3 rounded-2xl bg-gradient-to-br from-[#121A2E] to-[#0E1526] border border-cyan-500/30 p-5 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Our Innovation</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Not just label generation — coordinated multi-agent intelligence across the entire labeling lifecycle, with human oversight.
            </p>
          </div>

          <button
            onClick={onOpenInnovation}
            className="mt-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* EXPECTED IMPACT METRICS (Right ~38%) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Expected Impact</h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              Prototype Estimate
            </span>
          </div>

          {/* 5 Impact Metrics Columns */}
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[#10192E] border border-[#1A2A4A]">
              <div className="text-cyan-400 font-extrabold text-sm md:text-base flex items-center justify-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> 70%
              </div>
              <p className="text-[10px] text-slate-300 font-medium mt-1 leading-tight">Manual Effort</p>
            </div>

            <div className="p-2 rounded-xl bg-[#10192E] border border-[#1A2A4A]">
              <div className="text-cyan-400 font-extrabold text-sm md:text-base flex items-center justify-center gap-0.5">
                <Clock className="w-3.5 h-3.5" /> 60%
              </div>
              <p className="text-[10px] text-slate-300 font-medium mt-1 leading-tight">Review Time</p>
            </div>

            <div className="p-2 rounded-xl bg-[#10192E] border border-[#1A2A4A]">
              <div className="text-cyan-400 font-extrabold text-sm md:text-base flex items-center justify-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> 80%
              </div>
              <p className="text-[10px] text-slate-300 font-medium mt-1 leading-tight">Errors</p>
            </div>

            <div className="p-2 rounded-xl bg-[#10192E] border border-[#1A2A4A]">
              <div className="text-emerald-400 font-extrabold text-sm md:text-base flex items-center justify-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> 100%
              </div>
              <p className="text-[10px] text-slate-300 font-medium mt-1 leading-tight">Traceability</p>
            </div>

            <div className="p-2 rounded-xl bg-[#10192E] border border-[#1A2A4A]">
              <div className="text-emerald-400 font-extrabold text-sm md:text-base flex items-center justify-center gap-0.5">
                <Shield className="w-3.5 h-3.5" /> 100%
              </div>
              <p className="text-[10px] text-slate-300 font-medium mt-1 leading-tight">Compliance</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-3">
            Simulated benchmarks modeled on typical medical device change control cycles.
          </p>
        </div>
      </div>

      {/* ========================================================
          AGENT DETAIL MODAL (When clicking any agent icon)
         ======================================================== */}
      {selectedAgentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0E172A] border border-blue-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedAgentDetail(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/40">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedAgentDetail.agent_name}</h3>
                <span className="text-xs text-cyan-400 font-mono">Agent Key: {selectedAgentDetail.agent_key}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Current Status:</span>
                <span className="font-bold text-emerald-400">{selectedAgentDetail.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Execution Time:</span>
                <span className="font-mono text-white">{selectedAgentDetail.execution_time_display}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Execution Findings:</span>
                <div className="p-3 bg-[#0A0F1D] border border-slate-800 rounded-lg text-slate-200 leading-relaxed font-mono text-[11px]">
                  {selectedAgentDetail.short_result || 'Awaiting task execution'}
                </div>
              </div>
              {selectedAgentDetail.detailed_output && (
                <div>
                  <span className="text-slate-400 block mb-1">Structured JSON Output:</span>
                  <pre className="p-2.5 bg-[#070B14] rounded text-[10px] text-cyan-300 overflow-x-auto max-h-40">
                    {JSON.stringify(JSON.parse(selectedAgentDetail.detailed_output), null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedAgentDetail(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
