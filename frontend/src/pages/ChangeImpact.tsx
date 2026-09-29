import React, { useState } from 'react';
import { GitFork, Shield, ArrowRight, CheckCircle2, AlertTriangle, Layers, Sparkles } from 'lucide-react';

export const ChangeImpact: React.FC = () => {
  const [selectedDirective, setSelectedDirective] = useState('REG-2024-MDR-04');

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <GitFork className="w-4 h-4" />
          <span>Dependency Intelligence Engine</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Regulatory Change Impact Analysis</h2>
        <p className="text-xs text-slate-400 mt-1">
          Trace how international medical device mandates cascade across packaging labels, translations, and downstream supply-chain SKUs.
        </p>
      </div>

      {/* Directive Selector */}
      <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400">Selected Regulatory Change:</span>
          <h3 className="text-base font-bold text-white mt-1">
            EU MDR 2017/745 Annex I (23.4) & CDSCO Rule 109 — Fire & Thermal Runaway Mitigation
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Directive ID: [REG-2024-MDR-04] • Severity: High • Effective in 60 days</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Action Mandatory
          </span>
        </div>
      </div>

      {/* Top 3 Metric Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Affected Packaging Labels</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1">4 Labels</div>
          <p className="text-xs text-slate-400 mt-1">CardioSense IN-EN, EU-EN, EU-DE, and Master Carton</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Impacted Jurisdictions</span>
          <div className="text-3xl font-extrabold text-white mt-1">2 Markets</div>
          <p className="text-xs text-slate-400 mt-1">European Union (MDR) & India (CDSCO)</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Languages</span>
          <div className="text-3xl font-extrabold text-purple-400 mt-1">2 Languages</div>
          <p className="text-xs text-slate-400 mt-1">English (Master Source) & German (Local EU target)</p>
        </div>
      </div>

      {/* Visual Dependency Tree Flowchart */}
      <div className="p-6 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Regulatory Dependency Graph</h4>
        
        <div className="p-6 rounded-xl bg-[#070B14] border border-[#1A2845] flex flex-col md:flex-row items-center justify-between gap-6 overflow-x-auto">
          {/* Level 1: Directive */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-center min-w-[180px]">
            <span className="text-[10px] uppercase font-bold text-purple-400">Directive</span>
            <div className="text-xs font-bold text-white mt-1">EU MDR & CDSCO</div>
            <span className="text-[10px] text-slate-400">Fire Hazard Clause</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

          {/* Level 2: Device */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 text-center min-w-[200px]">
            <span className="text-[10px] uppercase font-bold text-cyan-400">Medical Device</span>
            <div className="text-xs font-bold text-white mt-1">CardioSense Monitor</div>
            <span className="text-[10px] text-slate-400">Model: CS-100 (Class IIb)</span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

          {/* Level 3: Cascading Labels */}
          <div className="space-y-2 min-w-[260px]">
            <div className="p-2.5 rounded-lg bg-[#10192E] border border-cyan-400/40 text-xs flex items-center justify-between">
              <span className="text-slate-200 font-semibold">🇮🇳 LBL-CS100-IN-EN</span>
              <span className="text-[10px] text-amber-400 font-bold">Revision Ready</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#10192E] border border-cyan-400/40 text-xs flex items-center justify-between">
              <span className="text-slate-200 font-semibold">🇪🇺 LBL-CS100-EU-EN</span>
              <span className="text-[10px] text-amber-400 font-bold">Revision Ready</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#10192E] border border-cyan-400/40 text-xs flex items-center justify-between">
              <span className="text-slate-200 font-semibold">🇪🇺 LBL-CS100-EU-DE</span>
              <span className="text-[10px] text-amber-400 font-bold">Revision Ready</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#10192E] border border-slate-700 text-xs flex items-center justify-between">
              <span className="text-slate-400 font-semibold">📦 Master Outer Carton</span>
              <span className="text-[10px] text-slate-500">Scheduled v2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Checklist */}
      <div className="p-6 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Required Compliance Action Items</h4>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#10192E] rounded-xl border border-[#1A2A4A] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Embed ISO 7010-W012 triangular fire hazard glyph on all secondary and primary packaging.</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Automated</span>
          </div>

          <div className="p-3 bg-[#10192E] rounded-xl border border-[#1A2A4A] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Update German packaging insert text to align with EU MDR Annex I fire hazard clause.</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Reviewed</span>
          </div>

          <div className="p-3 bg-[#10192E] rounded-xl border border-[#1A2A4A] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-200">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Validate CDSCO India sub-label font height (ensure minimum 1.6mm for import license code).</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Human Check</span>
          </div>
        </div>
      </div>
    </div>
  );
};
