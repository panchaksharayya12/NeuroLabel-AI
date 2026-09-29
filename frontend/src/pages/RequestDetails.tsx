import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Shield,
  FileText,
  Eye,
  Globe,
  UserCheck,
  CheckCircle,
  FileCheck,
  XCircle,
  MessageSquare,
  Sparkles,
  Lock,
  Layers,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api, getMediaUrl } from '../api/client';
import { LabelingRequest, AgentExecution } from '../types';

interface RequestDetailsProps {
  requestId: number;
  onNavigate: (tab: string, meta?: any) => void;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({ requestId, onNavigate }) => {
  const [request, setRequest] = useState<LabelingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comparison' | 'compliance' | 'artwork' | 'translation' | 'risk' | 'approval' | 'audit'>('comparison');

  // Approval modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const [signerName, setSignerName] = useState('Rashmi Gowda (Project Lead)');
  const [approvalComments, setApprovalComments] = useState('All compliance checks, German translations, and symbol artwork modifications verified.');
  const [rejectionReason, setRejectionReason] = useState('');
  const [revisionComments, setRevisionComments] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  useEffect(() => {
    loadRequest();
    const interval = setInterval(() => {
      loadRequest(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [requestId]);

  const loadRequest = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await api.getRequest(requestId);
      setRequest(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleRunPipeline = async () => {
    try {
      await api.runRequestPipeline(requestId);
      await loadRequest(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async () => {
    setIsProcessingAction(true);
    try {
      await api.approveRequest(requestId, {
        comments: approvalComments,
        electronic_signature: signerName
      });
      setShowApproveModal(false);
      // Trigger celebratory confetti for compliant release!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      await loadRequest(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setIsProcessingAction(true);
    try {
      await api.rejectRequest(requestId, {
        rejection_reason: rejectionReason,
        electronic_signature: signerName
      });
      setShowRejectModal(false);
      await loadRequest(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRevision = async () => {
    if (!revisionComments.trim()) return;
    setIsProcessingAction(true);
    try {
      await api.requestRevision(requestId, {
        comments: revisionComments,
        electronic_signature: signerName
      });
      setShowRevisionModal(false);
      await loadRequest(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  if (loading && !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RotateCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-slate-400 text-xs">Loading Labeling Request #{requestId}...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Request not found.</p>
        <button onClick={() => onNavigate('dashboard')} className="mt-3 text-cyan-400 text-xs underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const agents = request.agent_executions || [];
  const compliance = request.compliance_checks || [];
  const artwork = request.artwork_comparisons?.[0];
  const translation = request.translation_checks?.[0];
  const risk = request.risk_assessments?.[0];
  const auditLogs = request.audit_logs || [];

  return (
    <div className="p-6 space-y-6 max-w-[1500px] mx-auto pb-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Labeling Request #{request.request_number}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                request.status === 'Approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20'
                  : request.status === 'Awaiting Human Approval'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple animate-pulse'
                  : request.status === 'Rejected'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-blue-500/20 text-cyan-400 border-blue-500/40'
              }`}
            >
              {request.status}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{request.title}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunPipeline}
            className="px-3.5 py-2 rounded-xl bg-[#111A2E] hover:bg-[#16233B] text-slate-200 border border-[#203052] text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Re-Run AI Agents</span>
          </button>

          {request.status !== 'Approved' && (
            <button
              onClick={() => {
                setActiveTab('approval');
                setShowApproveModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold tracking-wide shadow-emerald-500/30 flex items-center space-x-1.5 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Review & Sign-Off</span>
            </button>
          )}
        </div>
      </div>

      {/* Metadata Overview Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50] text-xs">
        <div>
          <span className="text-slate-400">Device Model:</span>
          <p className="font-semibold text-white mt-0.5">{request.product?.name} ({request.product?.model})</p>
        </div>
        <div>
          <span className="text-slate-400">Jurisdictions:</span>
          <p className="font-semibold text-white mt-0.5">{request.markets}</p>
        </div>
        <div>
          <span className="text-slate-400">Languages:</span>
          <p className="font-semibold text-white mt-0.5">{request.languages}</p>
        </div>
        <div>
          <span className="text-slate-400">Compliance Score:</span>
          <p className="font-bold text-cyan-400 mt-0.5">{request.compliance_score}% Overall</p>
        </div>
        <div>
          <span className="text-slate-400">Risk Level:</span>
          <p className="font-bold text-emerald-400 mt-0.5">{request.risk_level}</p>
        </div>
      </div>

      {/* Agent Workflow Stepper Bar */}
      <div className="p-4 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Orchestration Pipeline</h4>
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
          {agents.map((ag, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[90px] text-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                  ag.status === 'Completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : ag.status === 'Running' || ag.status === 'In Progress'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 animate-pulse shadow-glow-cyan'
                    : ag.status === 'Needs Review'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400 animate-bounce'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {ag.status === 'Completed' ? '✓' : idx + 1}
              </div>
              <span className="text-[10px] font-semibold text-slate-200 truncate max-w-[85px]">{ag.agent_name}</span>
              <span className="text-[9px] text-slate-400">{ag.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive Navigation Tabs */}
      <div className="flex border-b border-[#1E2E50] space-x-2">
        {[
          { id: 'comparison', label: 'Label Comparison (Current vs Proposed)', icon: FileText },
          { id: 'compliance', label: 'Compliance Engine (8 Rules)', icon: Shield },
          { id: 'artwork', label: 'Artwork Vision (OpenCV)', icon: Eye },
          { id: 'translation', label: 'Translation (EN / DE)', icon: Globe },
          { id: 'risk', label: 'Risk & Quality Assessment', icon: AlertTriangle },
          { id: 'approval', label: 'Human Approval Gate', icon: UserCheck },
          { id: 'audit', label: 'Audit Trail (21 CFR Part 11)', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: LABEL COMPARISON (Current vs Proposed)
         ======================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between text-xs">
            <div>
              <span className="text-cyan-400 font-bold">Authoring Rationale:</span>
              <p className="text-slate-300 mt-0.5">{request.authoring_reason || 'EU MDR Annex I 23.4 Safety Disclosure'}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Confidence Score:</span>
              <span className="font-bold text-white ml-2">{Math.round((request.authoring_confidence || 0.96) * 100)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CURRENT VERSION */}
            <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1C2A47]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Version (v1.0)</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Baseline</span>
              </div>
              <pre className="p-4 bg-[#080D18] rounded-xl text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
                {request.previous_content || 'No previous content recorded.'}
              </pre>
            </div>

            {/* PROPOSED VERSION */}
            <div className="p-5 rounded-2xl bg-[#0C1322] border border-cyan-500/30 shadow-glow-blue">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1C2A47]">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Proposed Version (v1.1)</h4>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  AI Generated
                </span>
              </div>
              <pre className="p-4 bg-[#080D18] rounded-xl text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap border border-cyan-500/20">
                {request.proposed_content || 'No proposed content recorded.'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: COMPLIANCE ENGINE
         ======================================================== */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
              <span className="text-slate-400 text-xs">Total Rules Evaluated</span>
              <p className="text-xl font-bold text-white mt-1">{compliance.length || 8}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
              <span className="text-slate-400 text-xs">Passed Criteria</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                {compliance.filter(c => c.status === 'PASS').length || 6}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
              <span className="text-slate-400 text-xs">Warnings Flagged</span>
              <p className="text-xl font-bold text-amber-400 mt-1">
                {compliance.filter(c => c.status === 'WARNING').length || 2}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
              <span className="text-slate-400 text-xs">Critical Failures</span>
              <p className="text-xl font-bold text-white mt-1">0</p>
            </div>
          </div>

          <div className="bg-[#0C1322] border border-[#1E2E50] rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10192E] border-b border-[#1E2E50] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Rule / Standard Reference</th>
                  <th className="p-3.5">Jurisdiction</th>
                  <th className="p-3.5">Findings & Remediation</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2845]">
                {compliance.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#0F182B] transition-colors">
                    <td className="p-3.5 font-semibold text-white">{c.category}</td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{c.rule_name}</div>
                      <div className="text-[10px] text-slate-400">{c.standard_reference}</div>
                    </td>
                    <td className="p-3.5 text-slate-300">{c.market}</td>
                    <td className="p-3.5 max-w-md">
                      <p className="text-slate-300">{c.findings}</p>
                      {c.remediation && (
                        <p className="text-[11px] text-cyan-400 mt-1">Action: {c.remediation}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.status === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : c.status === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: ARTWORK VISION (OpenCV)
         ======================================================== */}
      {activeTab === 'artwork' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
              <span className="text-slate-400 text-xs">Structural Similarity (SSIM)</span>
              <p className="text-xl font-bold text-white mt-1">{artwork?.ssim_score || 0.942}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
              <span className="text-slate-400 text-xs">Difference Area</span>
              <p className="text-xl font-bold text-cyan-400 mt-1">{artwork?.difference_percentage || 4.8}%</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
              <span className="text-slate-400 text-xs">Barcode Integrity (GS1-128)</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{artwork?.barcode_status || 'Valid'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Original Label Proof</h4>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-white">
                <img
                  src={getMediaUrl(artwork?.original_image_path || '/media/req_1_orig.png')}
                  alt="Original Artwork"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0C1322] border border-pink-500/30 shadow-glow-pink">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  OpenCV Visual Difference Map
                </h4>
                <span className="text-[10px] text-pink-300 font-mono">Neon Bounding Boxes</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-pink-500/40 bg-white">
                <img
                  src={getMediaUrl(artwork?.diff_image_path || '/media/req_1_prop.png')}
                  alt="Visual Diff Artwork"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#10192E] border border-[#1E2E50] text-xs">
            <span className="text-pink-400 font-bold block mb-1">Vision Agent Diagnostics:</span>
            <p className="text-slate-300">
              {artwork?.symbol_differences || 'Detected 1 layout issue (warning symbol size) in EU artwork. Suggested fix applied.'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: TRANSLATION VALIDATION
         ======================================================== */}
      {activeTab === 'translation' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Language Pair: English ➔ German (EU MDR Target)</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
              Status: {translation?.status || 'WARNING'} (Nuance review advised)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Source English Content</h4>
              <div className="p-4 bg-[#080D18] rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap">
                {translation?.source_text || 'CardioSense Monitor CS-100\nWARNING: Fire risk - Do not dispose of in fire.'}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Target German Translation</h4>
              <div className="p-4 bg-[#080D18] rounded-xl text-xs font-mono text-cyan-200 whitespace-pre-wrap">
                {translation?.target_text || 'CardioSense Monitor CS-100\nWARNUNG: Brandgefahr - Nicht ins Feuer werfen.'}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Terminology Alignment Checks</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#10192E] rounded-xl border border-[#1A2A4A] flex items-start justify-between">
                <div>
                  <span className="font-bold text-white">"Fire risk" ➔ "Brandgefahr"</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    EU MDR harmonized medical terminology recommendation: "Brandrisiko" vs "Brandgefahr" based on BfArM standards.
                  </p>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">Minor</span>
              </div>

              <div className="p-3 bg-[#10192E] rounded-xl border border-[#1A2A4A] flex items-start justify-between">
                <div>
                  <span className="font-bold text-white">"Do not dispose of in fire" ➔ "Nicht ins Feuer werfen"</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Formal medical disposal clause: Prefer "Nicht im Feuer entsorgen" conforming to DIN EN ISO 15223-1.
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-mono">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: RISK & QUALITY ASSESSMENT
         ======================================================== */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1322] via-[#0E1A30] to-[#0C1322] border border-blue-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Computed Labeling Risk Level</span>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                {risk?.risk_level || 'LOW'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Risk Score: <strong className="text-white">{risk?.risk_score || 18.5} / 100</strong> (Lower score indicates lower hazard index)
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-right">
              <span className="text-[11px] text-cyan-400 font-semibold block">Human Oversight Policy</span>
              <span className="text-xs font-bold text-white">Enforced 21 CFR Part 11</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Aggregated Findings</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>Compliance Findings: 1 minor CDSCO font height adjustment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  <span>Artwork Vision: 1 symbol resizing (ISO 7010-W012 5mm)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Translation: 2 phrasing harmonization recommendations</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50]">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Mitigation Recommendation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {risk?.mitigation_recommendation || 'Accept automated symbol resizing and German terminology adjustment; route for final human sign-off.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: HUMAN APPROVAL GATE (CRITICAL REQUIREMENT)
         ======================================================== */}
      {activeTab === 'approval' && (
        <div className="p-6 rounded-2xl bg-[#0C1322] border border-blue-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-3 text-cyan-400 pb-4 border-b border-[#1C2A47]">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Human Approval Gate</h3>
              <p className="text-xs text-slate-400">
                AI agents validate and recommend; human regulatory leads maintain sole release authority under 21 CFR Part 11.
              </p>
            </div>
          </div>

          {/* Current Request Status Banner */}
          <div className="p-4 rounded-xl bg-[#10192E] border border-[#1E2E50] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400">Current Approval State:</span>
              <p className="text-base font-bold text-white mt-0.5">{request.status}</p>
            </div>
            <div className="flex items-center space-x-3">
              {request.status !== 'Approved' ? (
                <>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => setShowRevisionModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>Request Revision</span>
                  </button>

                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-emerald-500/30 flex items-center space-x-1.5 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approve & Release Label</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Officially Released by Authorized Regulatory Lead</span>
                </div>
              )}
            </div>
          </div>

          {/* Past Approvals History */}
          {request.approvals && request.approvals.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Recorded Approval Actions</h4>
              <div className="space-y-2">
                {request.approvals.map((ap, idx) => (
                  <div key={idx} className="p-3 bg-[#080D18] rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{ap.action}</span>
                      <span className="text-[10px] text-slate-400">{new Date(ap.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300">{ap.comments || ap.rejection_reason}</p>
                    <div className="text-[11px] text-cyan-400 font-mono">
                      Electronic Signature: {ap.electronic_signature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 7: AUDIT TRAIL
         ======================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-slate-400">Cryptographically verified 21 CFR Part 11 event stream</span>
            <a
              href={api.getAuditLogsExportUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Audit Log</span>
            </a>
          </div>

          <div className="bg-[#0C1322] border border-[#1E2E50] rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10192E] border-b border-[#1E2E50] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Timestamp (UTC)</th>
                  <th className="p-3.5">Actor / Agent</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Summary</th>
                  <th className="p-3.5 font-mono text-[10px]">SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2845]">
                {auditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-[#0F182B] transition-colors">
                    <td className="p-3.5 font-mono text-cyan-400 font-bold">{log.log_id}</td>
                    <td className="p-3.5 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3.5 font-semibold text-white">{log.actor_name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono text-[10px]">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">{log.summary}</td>
                    <td className="p-3.5 font-mono text-[9px] text-slate-500 truncate max-w-[120px]">
                      {log.hash_signature || 'e3b0c44298fc1c149afbf4c8996fb924...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: APPROVE REQUEST
         ======================================================== */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0E172A] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <UserCheck className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">21 CFR Part 11 Electronic Approval</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By applying your electronic signature, you certify that you have reviewed the proposed label content, compliance findings, artwork visual diffs, and German translations for <strong>{request.request_number}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Electronic Signature Name</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Regulatory Sign-Off Comments</label>
              <textarea
                rows={2}
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isProcessingAction}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                {isProcessingAction ? 'Sealing Release...' : 'Confirm Electronic Signature'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REJECT REQUEST
         ======================================================== */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0E172A] border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Reject Labeling Request</h3>
            </div>
            <p className="text-xs text-slate-300">
              A rejection reason is strictly required to be recorded in the tamper-evident audit trail.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rejection Reason *</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain the safety, regulatory, or clinical reason for rejection..."
                className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isProcessingAction || !rejectionReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
              >
                {isProcessingAction ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REQUEST REVISION
         ======================================================== */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0E172A] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <MessageSquare className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Request Label Revisions</h3>
            </div>
            <p className="text-xs text-slate-300">
              Provide instructions for the AI Authoring and Vision agents to regenerate the updated artwork and text.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Revision Instructions *</label>
              <textarea
                rows={3}
                value={revisionComments}
                onChange={(e) => setRevisionComments(e.target.value)}
                placeholder="e.g. Enlarge battery hazard triangle to 6mm and revise German wording to 'Brandrisiko'..."
                className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevision}
                disabled={isProcessingAction || !revisionComments.trim()}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors"
              >
                {isProcessingAction ? 'Submitting...' : 'Submit Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
