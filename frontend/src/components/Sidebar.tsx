import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  GitFork,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-request', label: 'New Request', icon: PlusCircle },
    { id: 'label-library', label: 'Label Library', icon: FileText },
    { id: 'change-impact', label: 'Change Impact', icon: GitFork },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'artwork-validation', label: 'Artwork Vision', icon: Zap },
    { id: 'translation-validation', label: 'Translation', icon: FileText },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-w-[16rem] bg-[#0A0F1D] border-r border-[#1C2A47] flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#162238] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow-blue border border-cyan-400/30">
            <span className="text-white font-extrabold text-2xl tracking-tighter">N</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
              NeuroNexa
            </h1>
            <p className="text-[11px] text-cyan-400/80 font-medium">Smarter AI. Safer Tomorrow.</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow-blue border border-blue-400/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111A2E]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mission Slogan with ECG Heartbeat wave */}
      <div className="p-5 border-t border-[#162238] relative overflow-hidden bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="flex items-center space-x-3 text-cyan-400">
          <Activity className="w-6 h-6 animate-pulse text-cyan-400 shrink-0" />
          <div className="text-xs font-semibold leading-relaxed tracking-wider text-slate-300">
            <p className="text-cyan-300">Better Labels.</p>
            <p className="text-white">Safer Patients.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
