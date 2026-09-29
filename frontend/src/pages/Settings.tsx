import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Cpu, Shield, Check, Save } from 'lucide-react';
import { api } from '../api/client';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    ai_mode: "Fallback Local Deterministic Engine (Offline & Reliable)",
    openai_configured: false,
    enable_eu_mdr: true,
    enable_cdsco: true,
    enable_fda_udi: true,
    enable_ukca: false,
    part11_electronic_signatures: true,
    confidence_threshold: 0.90,
    ocr_engine: "OpenCV Computer Vision + Layout Differencer"
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      await api.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">System Settings & AI Orchestration</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure agent operating modes, regulatory frameworks, and 21 CFR Part 11 digital signature policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-glow-blue flex items-center space-x-2 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="bg-[#0C1322] border border-[#1E2E50] rounded-2xl p-6 shadow-2xl space-y-6">
        {/* AI Engine Configuration */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI Orchestration Mode</span>
          </h3>

          <div className="p-4 rounded-xl bg-[#10192E] border border-cyan-500/30 flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Active Engine:</span>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">{settings.ai_mode}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero external dependency mode enabled. Deterministic medical device safety engines and OpenCV visual pipelines are active locally.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Operational
            </span>
          </div>
        </div>

        {/* Regulatory Standards Toggles */}
        <div className="pt-4 border-t border-[#1C2A47]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Active Regulatory Jurisdictions</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#10192E] border border-[#1A2A4A] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white">European Union MDR 2017/745</span>
                <p className="text-[11px] text-slate-400">Annex I General Safety & Performance requirements + CE 0123 verification.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enable_eu_mdr}
                onChange={(e) => setSettings({ ...settings, enable_eu_mdr: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#10192E] border border-[#1A2A4A] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white">India CDSCO Medical Device Rules 2017</span>
                <p className="text-[11px] text-slate-400">Rule 109 labeling, registration numbers, and 1.6mm minimum font enforcement.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enable_cdsco}
                onChange={(e) => setSettings({ ...settings, enable_cdsco: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#10192E] border border-[#1A2A4A] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white">FDA 21 CFR Part 801 / UDI System</span>
                <p className="text-[11px] text-slate-400">GS1-128 Human Readable Interpretation and UDI carrier verification.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enable_fda_udi}
                onChange={(e) => setSettings({ ...settings, enable_fda_udi: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Quality & Human Oversight */}
        <div className="pt-4 border-t border-[#1C2A47]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Quality & Human Oversight Policies
          </h3>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#10192E] border border-[#1A2A4A] cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white">Mandatory 21 CFR Part 11 Electronic Signature Gate</span>
              <p className="text-[11px] text-slate-400">Prevent autonomous label release without explicit human sign-off.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.part11_electronic_signatures}
              onChange={(e) => setSettings({ ...settings, part11_electronic_signatures: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
