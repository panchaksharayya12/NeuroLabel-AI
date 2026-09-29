import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Search, Shield, Filter, RotateCw } from 'lucide-react';
import { api } from '../api/client';
import { AuditLog } from '../types';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState('');
  const [actorQuery, setActorQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, [selectedAction, actorQuery]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs({
        action_type: selectedAction || undefined,
        actor_name: actorQuery || undefined
      });
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[1500px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>21 CFR Part 11 Compliance Records</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Audit Trail & Chain of Custody</h2>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically sealed immutable log of all autonomous agent actions, regulatory validations, and human sign-offs.
          </p>
        </div>

        <a
          href={api.getAuditLogsExportUrl()}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-glow-blue flex items-center space-x-2 transition-all self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </a>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl bg-[#0C1322] border border-[#1E2E50] flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by Actor or Agent..."
            value={actorQuery}
            onChange={(e) => setActorQuery(e.target.value)}
            className="w-full bg-[#10192E] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="bg-[#10192E] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
        >
          <option value="">All Action Types</option>
          <option value="REQUEST_CREATED">Request Created</option>
          <option value="AGENT_EXECUTION">Agent Execution</option>
          <option value="COMPLIANCE_EVAL">Compliance Evaluation</option>
          <option value="APPROVAL">Human Approval</option>
          <option value="REJECTION">Rejection</option>
          <option value="RELEASE">Cryptographic Release</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0C1322] border border-[#1E2E50] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#10192E] border-b border-[#1E2E50] text-slate-400 uppercase font-semibold">
            <tr>
              <th className="p-3.5">Log Identifier</th>
              <th className="p-3.5">Timestamp (UTC)</th>
              <th className="p-3.5">Actor / Agent</th>
              <th className="p-3.5">Action Type</th>
              <th className="p-3.5">Summary of Activity</th>
              <th className="p-3.5 font-mono text-[10px]">SHA-256 Signature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2845]">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0F182B] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-cyan-400">{log.log_id}</td>
                  <td className="p-3.5 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-semibold text-white">{log.actor_name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-md">{log.summary}</td>
                  <td className="p-3.5 font-mono text-[9px] text-slate-500 truncate max-w-[120px]" title={log.hash_signature}>
                    {log.hash_signature}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No matching audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
