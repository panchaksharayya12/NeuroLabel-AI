import React, { useState, useEffect } from 'react';
import { Eye, Upload, Sparkles, CheckCircle2, AlertTriangle, Layers, RotateCw } from 'lucide-react';
import { api, getMediaUrl } from '../api/client';
import { ArtworkComparison } from '../types';

export const ArtworkValidation: React.FC = () => {
  const [artwork, setArtwork] = useState<ArtworkComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    loadArtwork();
  }, []);

  const loadArtwork = async () => {
    try {
      const res = await api.getArtwork(1);
      setArtwork(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1 || !file2) return;
    setIsComparing(true);
    try {
      const formData = new FormData();
      formData.append('current_file', file1);
      formData.append('proposed_file', file2);
      formData.append('request_id', '1');

      const res = await api.compareArtwork(formData);
      setArtwork(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Eye className="w-4 h-4" />
          <span>Computer Vision Quality Gate</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Artwork Vision & Physical Layout Validation</h2>
        <p className="text-xs text-slate-400 mt-1">
          OpenCV-powered pixel and structural difference inspection detecting bounding box deviations, barcode fidelity, and hazard symbol sizing.
        </p>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-xs text-slate-400">Structural Similarity Index (SSIM)</span>
          <p className="text-2xl font-extrabold text-white mt-1">{artwork?.ssim_score || 0.942}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-xs text-slate-400">Changed Surface Area</span>
          <p className="text-2xl font-extrabold text-pink-400 mt-1">{artwork?.difference_percentage || 4.8}%</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-xs text-slate-400">GS1-128 Barcode Verification</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{artwork?.barcode_status || 'Valid'}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50]">
          <span className="text-xs text-slate-400">Layout Shift Flag</span>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">
            {artwork?.layout_shift_detected ? 'True (Warning Box)' : 'None'}
          </p>
        </div>
      </div>

      {/* Side-by-Side Proofs and Diff Map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CURRENT */}
        <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Baseline Artwork</h4>
            <span className="text-[10px] text-slate-500 font-mono">v1.0</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-white">
            <img
              src={getMediaUrl(artwork?.original_image_path || '/media/req_1_orig.png')}
              alt="Baseline Artwork"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* PROPOSED */}
        <div className="p-5 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Proposed Artwork</h4>
            <span className="text-[10px] text-cyan-400 font-mono">v1.1</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-white">
            <img
              src={getMediaUrl(artwork?.proposed_image_path || '/media/req_1_prop.png')}
              alt="Proposed Artwork"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* OPENCV DIFF */}
        <div className="p-5 rounded-2xl bg-[#0C1322] border border-pink-500/40 shadow-glow-pink">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
              <span>OpenCV Diff Map</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 font-mono">
              Delta Boxes
            </span>
          </div>
          <div className="rounded-xl overflow-hidden border border-pink-500/40 bg-white">
            <img
              src={getMediaUrl(artwork?.diff_image_path || '/media/req_1_prop.png')}
              alt="Diff Visualizer"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Manual Upload and Run Studio */}
      <div className="p-6 rounded-2xl bg-[#0C1322] border border-[#1E2E50] shadow-xl">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Run Custom Artwork Comparison Studio</h4>
        <form onSubmit={handleRunComparison} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center bg-[#090F1C]">
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setFile1(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white"
            />
            <p className="text-[10px] text-slate-500 mt-2">Upload Original Label (PNG, JPG)</p>
          </div>

          <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center bg-[#090F1C]">
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setFile2(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white"
            />
            <p className="text-[10px] text-slate-500 mt-2">Upload Proposed Label (PNG, JPG)</p>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isComparing || !file1 || !file2}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-glow-pink flex items-center space-x-2 transition-all"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
              <span>{isComparing ? 'Executing OpenCV Diff...' : 'Run Vision Comparison'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
