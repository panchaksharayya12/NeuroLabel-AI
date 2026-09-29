import React from 'react';
import { X, Sparkles, Shield, Cpu, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface InnovationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InnovationModal: React.FC<InnovationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#0D1527] border border-blue-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-glow-blue relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-cyan-400 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Our Innovation Architecture</h3>
            <p className="text-xs text-slate-400">Next-Generation Coordinated Multi-Agent Intelligence</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Unlike basic LLM wrappers that merely generate text, <strong className="text-cyan-400">NeuroLabel AI</strong> is an enterprise-grade agentic orchestration system designed strictly for regulated life-sciences environments:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#111B30] border border-[#1E2E50]">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold text-sm mb-1.5">
              <Layers className="w-4 h-4" />
              <span>Multi-Agent Specialization</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              7 specialized AI agents collaborate across regulatory change impact, clinical authoring, deterministic rule compliance, OpenCV visual inspection, bilingual medical translation, and risk aggregation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111B30] border border-[#1E2E50]">
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-sm mb-1.5">
              <Shield className="w-4 h-4" />
              <span>Strict Human-in-the-Loop</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              AI agents validate, recommend, and cross-reference, but never release. An enforced 21 CFR Part 11 electronic approval gate ensures human oversight before any label release.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111B30] border border-[#1E2E50]">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cryptographic Audit Trail</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Every agent execution, compliance finding, diff inspection, and human decision is cryptographically hashed with SHA-256 for complete traceability during Notified Body inspections.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111B30] border border-[#1E2E50]">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm mb-1.5">
              <Cpu className="w-4 h-4" />
              <span>Dual-Mode Reliability</span>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Zero dependency risk: operates with online LLM integration or offline deterministic medical regulatory engines without degradation in safety checks.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-glow-blue transition-all"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
