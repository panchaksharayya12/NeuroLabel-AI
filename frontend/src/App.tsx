import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { InnovationModal } from './components/InnovationModal';
import { Dashboard } from './pages/Dashboard';
import { NewRequest } from './pages/NewRequest';
import { RequestDetails } from './pages/RequestDetails';
import { LabelLibrary } from './pages/LabelLibrary';
import { ChangeImpact } from './pages/ChangeImpact';
import { Compliance } from './pages/Compliance';
import { ArtworkValidation } from './pages/ArtworkValidation';
import { TranslationValidation } from './pages/TranslationValidation';
import { AuditLogs } from './pages/AuditLogs';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeRequestId, setActiveRequestId] = useState<number>(1);
  const [isInnovationOpen, setIsInnovationOpen] = useState(false);

  const handleNavigate = (tab: string, meta?: any) => {
    if (meta?.requestId) {
      setActiveRequestId(meta.requestId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-[#070B14] text-slate-100 font-sans tech-grid">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={handleNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar onNavigate={handleNavigate} />

        <main className="flex-1">
          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onOpenInnovation={() => setIsInnovationOpen(true)}
            />
          )}

          {currentTab === 'new-request' && (
            <NewRequest onNavigate={handleNavigate} />
          )}

          {currentTab === 'request-details' && (
            <RequestDetails
              requestId={activeRequestId}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'label-library' && (
            <LabelLibrary />
          )}

          {currentTab === 'change-impact' && (
            <ChangeImpact />
          )}

          {currentTab === 'compliance' && (
            <Compliance />
          )}

          {currentTab === 'artwork-validation' && (
            <ArtworkValidation />
          )}

          {currentTab === 'translation-validation' && (
            <TranslationValidation />
          )}

          {currentTab === 'audit-logs' && (
            <AuditLogs />
          )}

          {currentTab === 'settings' && (
            <Settings />
          )}
        </main>
      </div>

      {/* Innovation Architecture Modal */}
      <InnovationModal
        isOpen={isInnovationOpen}
        onClose={() => setIsInnovationOpen(false)}
      />
    </div>
  );
};

export default App;
