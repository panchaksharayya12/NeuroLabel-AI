import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, Sparkles } from 'lucide-react';

export const Compliance: React.FC = () => {
  const [testText, setTestText] = useState(
    `CardioSense Monitor CS-100\n` +
    `Manufacturer: NeuroNexa Technologies Inc.\n` +
    `REF: 902100 | LOT: 202409A | SN: 123456789\n` +
    `CE 0123 | [UDI] (01)00850012345678 | IPX4\n` +
    `WARNING: Fire risk - Do not dispose of in fire. Risk of explosion during use.\n` +
    `CDSCO Reg: MD-14/1990`
  );

  const [evalResult, setEvalResult] = useState<any>(null);

  const handleRunEvaluation = () => {
    // Deterministic rules check
    const rules = [
      { name: "Device Identification", passed: testText.includes("CardioSense") && testText.includes("CS-100"), ref: "EU MDR 23.2(a)" },
      { name: "Manufacturer Details", passed: testText.includes("NeuroNexa"), ref: "EU MDR 23.2(b)" },
      { name: "Traceability (LOT & SN)", passed: testText.includes("LOT") && testText.includes("SN"), ref: "EU MDR 23.2(d)" },
      { name: "Notified Body CE Mark", passed: testText.includes("CE 0123"), ref: "MDR Article 20" },
      { name: "UDI Carrier Carrier", passed: testText.includes("UDI"), ref: "MDR Annex VI Part C" },
      { name: "Safety & Hazard Warnings", passed: testText.toLowerCase().includes("fire risk"), ref: "ISO 7010-W012 / CDSCO Rule 109" },
      { name: "CDSCO Import License", passed: testText.includes("CDSCO"), ref: "CDSCO MDR 2017 Rule 109" },
      { name: "Environmental / Moisture Limits", passed: testText.includes("IPX4"), ref: "EN ISO 15223-1" },
    ];

    const passedCount = rules.filter(r => r.passed).length;
    const score = Math.round((passedCount / rules.length) * 100);

    setEvalResult({
      score,
      rules,
      status: score >= 90 ? 'COMPLIANT' : 'WARNINGS FOUND'
    });
  };

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Regulatory Intelligence Hub</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Regulatory & Compliance Engine</h2>
        <p className="text-xs text-slate-400 mt-1">
          Automated rule verifications against EU MDR 2017/745, CDSCO Medical Device Rules 2017, and FDA 21 CFR 801.
        </p>
      </div>

      {/* Standards Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-[10px] font-mono text-cyan-400 font-bold">EUROPE</span>
          <h4 className="text-sm font-bold text-white mt-1">EU MDR 2017/745</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Annex I Chapter III General Safety & Performance Requirements.</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-[10px] font-mono text-cyan-400 font-bold">INDIA</span>
          <h4 className="text-sm font-bold text-white mt-1">CDSCO MDR 2017</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Rule 109 Device Labeling, Registration numbers & Import font mandates.</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-[10px] font-mono text-cyan-400 font-bold">GLOBAL</span>
          <h4 className="text-sm font-bold text-white mt-1">ISO 15223-1:2021</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Standardized medical device symbols for packaging & IFUs.</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-[10px] font-mono text-cyan-400 font-bold">RISK</span>
          <h4 className="text-sm font-bold text-white mt-1">ISO 14971:2019</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Application of risk management to medical device labeling.</p>
        </div>
      </div>

      {/* Interactive Compliance Checker */}
      <div className="p-6 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Label Compliance Inspector</span>
          </h3>
          <button
            onClick={handleRunEvaluation}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue transition-all"
          >
            Run Regulatory Audit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Label Text Payload for Audit</label>
            <textarea
              rows={8}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Compliance Evaluation Result</label>
            {evalResult ? (
              <div className="p-4 bg-[#080D18] rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Calculated Compliance Score:</span>
                  <span className="text-2xl font-extrabold text-cyan-400">{evalResult.score}%</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {evalResult.rules.map((r: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#10192E] text-xs">
                      <div className="flex items-center space-x-2">
                        {r.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        <span className="text-slate-200">{r.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{r.ref}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 bg-[#080D18] rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs">
                <ShieldCheck className="w-8 h-8 opacity-40 mb-2" />
                <span>Click "Run Regulatory Audit" to execute rules</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
