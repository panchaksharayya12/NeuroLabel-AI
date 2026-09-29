import React, { useState } from 'react';
import { Globe, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../api/client';

export const TranslationValidation: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('German');
  const [sourceText, setSourceText] = useState(
    'WARNING: Fire risk - Do not dispose of in fire. Risk of explosion during use.\nKeep dry. Store between 10°C and 40°C.'
  );
  const [targetText, setTargetText] = useState(
    'WARNUNG: Brandgefahr - Nicht ins Feuer werfen. Explosionsgefahr während des Betriebs.\nVor Nässe schützen. Lagern zwischen 10°C und 40°C.'
  );

  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const res = await api.validateTranslation({
        source_language: sourceLang,
        target_language: targetLang,
        source_text: sourceText,
        target_text: targetText
      });
      setValidationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Globe className="w-4 h-4" />
          <span>Multilingual Medical Lexicon Engine</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Translation & Terminology Validation</h2>
        <p className="text-xs text-slate-400 mt-1">
          Harmonize clinical warnings and mandatory safety notices across European and international target languages.
        </p>
      </div>

      {/* Language Pair Selector */}
      <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50] flex items-center space-x-4 text-xs">
        <div>
          <span className="text-slate-400 mr-2">Source:</span>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-[#10192E] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          >
            <option value="English">English (Master)</option>
          </select>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-500" />

        <div>
          <span className="text-slate-400 mr-2">Target:</span>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-[#10192E] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          >
            <option value="German">German (EU MDR)</option>
            <option value="French">French (EU MDR)</option>
            <option value="Spanish">Spanish (EU MDR)</option>
          </select>
        </div>

        <button
          onClick={handleValidate}
          disabled={isValidating}
          className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue transition-all"
        >
          {isValidating ? 'Validating Lexicon...' : 'Run Translation Inspection'}
        </button>
      </div>

      {/* Source vs Target Textboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Source Text (English)</h4>
          <textarea
            rows={6}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full bg-[#080D18] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 resize-none"
          />
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1322] border border-cyan-500/30 shadow-glow-blue">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Target Text (German)</h4>
          <textarea
            rows={6}
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            className="w-full bg-[#080D18] border border-cyan-500/20 rounded-xl p-3 text-xs font-mono text-cyan-200 resize-none"
          />
        </div>
      </div>

      {/* Terminology Findings */}
      <div className="p-6 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Detected Terminology Findings</h4>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#10192E] rounded-xl border border-[#1A2A4A] flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>"Fire risk" ➔ "Brandgefahr"</span>
              </span>
              <p className="text-slate-400 text-[11px]">
                Recommendation: Harmonize with EU MDR terminology: 'Brandrisiko' vs 'Brandgefahr' based on German BfArM medical dictionary standard.
              </p>
            </div>
            <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10">Minor Nuance</span>
          </div>

          <div className="p-3 bg-[#10192E] rounded-xl border border-[#1A2A4A] flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>"Do not dispose of in fire" ➔ "Nicht ins Feuer werfen"</span>
              </span>
              <p className="text-slate-400 text-[11px]">
                Recommendation: Prefer formal medical phrasing: 'Nicht im Feuer entsorgen' for compliance with DIN EN ISO 15223-1.
              </p>
            </div>
            <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10">Moderate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
