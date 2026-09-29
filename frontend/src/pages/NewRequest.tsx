import React, { useState, useEffect } from 'react';
import { PlusCircle, Sparkles, Upload, FileText, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { Product, RegulatoryChange } from '../types';

interface NewRequestProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const NewRequest: React.FC<NewRequestProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [regulations, setRegulations] = useState<RegulatoryChange[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number>(1);
  const [selectedRegulation, setSelectedRegulation] = useState<number | ''>(1);
  const [title, setTitle] = useState('Safety Warning Update: Fire Risk Disclosure');
  const [description, setDescription] = useState('Mandatory hazard notification for high-density lithium secondary battery pack in patient monitor.');
  const [markets, setMarkets] = useState<string[]>(['India', 'EU']);
  const [languages, setLanguages] = useState<string[]>(['English', 'German']);
  const [priority, setPriority] = useState('High');

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    try {
      const [prods, regs] = await Promise.all([
        api.getProducts(),
        api.getRegulations()
      ]);
      setProducts(prods);
      setRegulations(regs);
      if (prods.length > 0) setSelectedProduct(prods[0].id);
      if (regs.length > 0) setSelectedRegulation(regs[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMarket = (m: string) => {
    setMarkets(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const handleToggleLang = (l: string) => {
    setLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a request title');
      return;
    }
    if (markets.length === 0) {
      setErrorMsg('Please select at least one market');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await api.createRequest({
        product_id: Number(selectedProduct),
        regulatory_change_id: selectedRegulation ? Number(selectedRegulation) : undefined,
        title,
        description,
        markets: markets.join(','),
        languages: languages.join(','),
        priority
      });

      // Navigate to the newly created request details!
      onNavigate('request-details', { requestId: created.id });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit labeling request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <PlusCircle className="w-4 h-4" />
          <span>Workflow Initiator</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Initiate Medical Device Labeling Request</h2>
        <p className="text-xs text-slate-400 mt-1">
          Feed a regulatory directive, product specification, and artwork files into the multi-agent AI pipeline.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-[#0C1322] border border-[#1E2E50] rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Product & Regulatory Change Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Affected Medical Device *</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              className="w-full bg-[#10192E] border border-[#233557] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.model}) - {p.device_class}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Regulatory Change Directive</label>
            <select
              value={selectedRegulation}
              onChange={(e) => setSelectedRegulation(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-[#10192E] border border-[#233557] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- None (Custom internal revision) --</option>
              {regulations.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} [{r.authority}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Request Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Safety Warning Update - Battery Fire Risk"
            className="w-full bg-[#10192E] border border-[#233557] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Description / Scope */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Clinical / Regulatory Rationale</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the clinical warning clause and reasons for the label update..."
            className="w-full bg-[#10192E] border border-[#233557] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Markets & Languages Checkbox Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#1C2A47]">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Target Markets *</label>
            <div className="flex flex-wrap gap-2">
              {['India', 'EU', 'US', 'UK', 'Japan'].map(m => {
                const checked = markets.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => handleToggleMarket(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      checked
                        ? 'bg-blue-600/40 border-cyan-400 text-white shadow-glow-blue'
                        : 'bg-[#10192E] border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m} {checked && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Target Languages *</label>
            <div className="flex flex-wrap gap-2">
              {['English', 'German', 'French', 'Spanish', 'Hindi'].map(l => {
                const checked = languages.includes(l);
                return (
                  <button
                    type="button"
                    key={l}
                    onClick={() => handleToggleLang(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      checked
                        ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-glow-purple'
                        : 'bg-[#10192E] border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {l} {checked && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="pt-2 border-t border-[#1C2A47]">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Current Label Artwork (Optional Upload)</label>
          <div className="border-2 border-dashed border-[#233557] hover:border-cyan-400/50 rounded-xl p-5 text-center bg-[#090F1C] cursor-pointer transition-colors relative">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setCurrentFile(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs text-slate-200 font-semibold">
              {currentFile ? currentFile.name : 'Click or drag & drop existing packaging label (PNG, JPG, PDF)'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">If empty, realistic reference artwork will be synthesized by Artwork Vision Agent.</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider shadow-glow-blue flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{isSubmitting ? 'Initializing AI Agents...' : 'Start AI Analysis'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
