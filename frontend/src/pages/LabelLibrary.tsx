import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Plus, ArrowRight, Shield, CheckCircle2, History, X } from 'lucide-react';
import { api } from '../api/client';
import { Label, Product } from '../types';

export const LabelLibrary: React.FC = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [selectedLabelForHistory, setSelectedLabelForHistory] = useState<Label | null>(null);

  // New Label Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLabelCode, setNewLabelCode] = useState('');
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelMarket, setNewLabelMarket] = useState('India');
  const [newLabelLang, setNewLabelLang] = useState('English');
  const [newLabelContent, setNewLabelContent] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedMarket, selectedProduct]);

  const loadData = async () => {
    try {
      const [lbls, prods] = await Promise.all([
        api.getLabels({
          market: selectedMarket || undefined,
          product_id: selectedProduct ? Number(selectedProduct) : undefined
        }),
        api.getProducts()
      ]);
      setLabels(lbls);
      setProducts(prods);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelCode.trim() || !newLabelName.trim()) return;
    try {
      await api.createLabel({
        product_id: Number(selectedProduct) || 1,
        label_code: newLabelCode,
        name: newLabelName,
        market: newLabelMarket,
        language: newLabelLang,
        content_text: newLabelContent || `${newLabelName}\nSN 987654321\nKeep Dry.`
      });
      setShowCreateModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLabels = labels.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.label_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Medical Device Label Library</h2>
          <p className="text-xs text-slate-400 mt-1">
            Global repository of approved, under-revision, and superseded packaging labels across EU MDR and CDSCO.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-glow-blue flex items-center space-x-2 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Label</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50] flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search label name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#10192E] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
          className="bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
        >
          <option value="">All Markets</option>
          <option value="India">India</option>
          <option value="EU">European Union</option>
          <option value="US">United States</option>
        </select>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value ? Number(e.target.value) : '')}
          className="bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
        >
          <option value="">All Devices</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.model})</option>
          ))}
        </select>
      </div>

      {/* Labels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabels.map((lbl) => (
          <div
            key={lbl.id}
            className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] hover:border-cyan-400/50 transition-all flex flex-col justify-between shadow-xl group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                  {lbl.label_code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    lbl.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                  }`}
                >
                  {lbl.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                {lbl.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">{lbl.label_type}</p>

              {/* Specs Badge Bar */}
              <div className="flex items-center space-x-3 mt-4 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 font-semibold">
                  <span>Market:</span>
                  <span className="text-white">{lbl.market}</span>
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span>Language:</span>
                  <span className="text-white">{lbl.language}</span>
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span>Version:</span>
                  <span className="text-cyan-400 font-mono">{lbl.current_version_str}</span>
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#1C2A47] flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Compliance: <strong className={lbl.compliance_status === 'Compliant' ? 'text-emerald-400' : 'text-amber-400'}>{lbl.compliance_status}</strong>
              </span>

              <button
                onClick={() => setSelectedLabelForHistory(lbl)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <History className="w-3.5 h-3.5" />
                <span>Version History</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Version History Modal */}
      {selectedLabelForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0E172A] border border-blue-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedLabelForHistory(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-cyan-400">
              <History className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Version History: {selectedLabelForHistory.label_code}</h3>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {(selectedLabelForHistory.versions && selectedLabelForHistory.versions.length > 0 ? selectedLabelForHistory.versions : [
                {
                  version_number: 'v1.1',
                  status: 'In Review',
                  title: 'Fire Hazard Warning Directive Revision',
                  content_text: 'CardioSense Monitor CS-100\nSN 123456789\nWARNING: Fire risk - Do not dispose of in fire. Risk of explosion.'
                },
                {
                  version_number: 'v1.0',
                  status: 'Superseded',
                  title: 'Initial Production Release',
                  content_text: 'CardioSense Monitor CS-100\nSN 123456789\nKeep dry. Read IFU.'
                }
              ]).map((v, i) => (
                <div key={i} className="p-3 bg-[#10192E] rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono text-cyan-300">{v.version_number} - {v.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">{v.status}</span>
                  </div>
                  <pre className="p-2 bg-[#080D18] rounded text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                    {v.content_text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Register New Label Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateLabel} className="bg-[#0E172A] border border-blue-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Register New Medical Label</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Label Code *</label>
              <input
                type="text"
                placeholder="e.g. LBL-CS100-US-EN"
                value={newLabelCode}
                onChange={(e) => setNewLabelCode(e.target.value)}
                className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Label Name *</label>
              <input
                type="text"
                placeholder="e.g. CardioSense Primary Label (US - FDA)"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Market</label>
                <select
                  value={newLabelMarket}
                  onChange={(e) => setNewLabelMarket(e.target.value)}
                  className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                >
                  <option value="India">India</option>
                  <option value="EU">EU</option>
                  <option value="US">US</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                <select
                  value={newLabelLang}
                  onChange={(e) => setNewLabelLang(e.target.value)}
                  className="w-full bg-[#10192E] border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                >
                  <option value="English">English</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Create Label
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
