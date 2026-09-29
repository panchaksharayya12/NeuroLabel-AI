import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Check, X, Shield, Cpu, ExternalLink } from 'lucide-react';
import { api } from '../api/client';
import { NotificationItem, SearchResultItem } from '../types';

interface TopbarProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.search(searchQuery);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="h-20 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-[#1C2A47] px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div className="flex items-center space-x-3.5">
        <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-glow-blue">
          <Cpu className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-wide">NeuroLabel AI</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/20 text-cyan-400 border border-cyan-500/40">
              Beta
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Agentic AI-Powered Medical Device Labeling Automation</p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, labels, regulations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
            className="w-full bg-[#0D1527] border border-[#203052] rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {showSearchDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#0F172A] border border-[#233557] rounded-xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-xs text-center text-slate-400">Searching regulatory databases...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      if (item.type === 'request') onNavigate('request-details', { requestId: item.id });
                      else if (item.type === 'label') onNavigate('label-library');
                      else if (item.type === 'regulation') onNavigate('compliance');
                      else onNavigate('label-library');
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-[#1E293B] transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                          {item.type}
                        </span>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-xs text-center text-slate-400">No matching medical products or regulations found.</div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="w-10 h-10 rounded-xl bg-[#0D1527] border border-[#203052] flex items-center justify-center text-slate-300 hover:text-white hover:border-blue-500/50 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shadow-lg border-2 border-[#0A0F1D]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0F172A] border border-[#233557] rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">System Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        api.markNotificationRead(n.id);
                        if (n.link?.includes('requests')) onNavigate('request-details', { requestId: 1 });
                        else if (n.link?.includes('compliance')) onNavigate('compliance');
                        else if (n.link?.includes('translation')) onNavigate('translation-validation');
                        setShowNotifDropdown(false);
                      }}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                        n.is_read
                          ? 'bg-[#0D1527]/50 border-transparent text-slate-400'
                          : 'bg-blue-950/30 border-blue-500/30 text-slate-200 hover:bg-blue-900/30'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-snug">{n.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-center text-slate-400">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching reference: "Rashmi Gowda", "Project Lead" */}
        <div className="flex items-center space-x-3 pl-4 border-l border-[#1C2A47]">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-glow-cyan bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Rashmi Gowda"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-white leading-tight">Rashmi Gowda</h4>
            <p className="text-[11px] text-slate-400 font-medium">Project Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
