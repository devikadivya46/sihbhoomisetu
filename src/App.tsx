import React, { useState } from 'react';
import { GovernmentHeader } from './components/GovernmentHeader';
import { SidebarSlider } from './components/SidebarSlider';
import { WorkflowSliderBar } from './components/WorkflowSliderBar';
import { LoginScreen, SYSTEM_USERS } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { IngestionPipeline } from './components/IngestionPipeline';
import { VerifierWorkspace } from './components/VerifierWorkspace';
import { CadastralMapView } from './components/CadastralMapView';
import { OfficerApprovalQueue } from './components/OfficerApprovalQueue';
import { RetrainingPipeline } from './components/RetrainingPipeline';
import { INITIAL_LAND_RECORDS, RETRAINING_LOGS } from './data/mockLandRecords';
import { LandRecord, UserProfile } from './types/landRecords';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(SYSTEM_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [records, setRecords] = useState<LandRecord[]>(INITIAL_LAND_RECORDS);
  const [activeRecordId, setActiveRecordId] = useState<string>(INITIAL_LAND_RECORDS[0].id);
  const [activeTab, setActiveTab] = useState<string>('admin');
  const [retrainingLogs, setRetrainingLogs] = useState(RETRAINING_LOGS);

  // Sidebar collapse & mobile drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSliderOpen, setIsMobileSliderOpen] = useState(false);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);

    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.role === 'staff' || user.role === 'verifier') {
      setActiveTab('verifier');
    } else {
      setActiveTab('officer');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleUpdateRecord = (updated: LandRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleIngestComplete = (newRecord: LandRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
    setActiveRecordId(newRecord.id);
  };

  const handleOpenRecordInVerifier = (recordId: string) => {
    setActiveRecordId(recordId);
    setActiveTab('verifier');
  };

  const handleAddRetrainingLog = (log: any) => {
    setRetrainingLogs((prev) => [log, ...prev]);
  };

  if (!isLoggedIn || !currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Header */}
      <GovernmentHeader
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileSliderOpen(!isMobileSliderOpen)}
      />

      <div className="flex-1 flex min-w-0">
        {/* Navigation Sidebar */}
        <SidebarSlider
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          currentUser={currentUser}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSliderOpen}
          onCloseMobile={() => setIsMobileSliderOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar for subpages */}
          {activeTab !== 'admin' && (
            <WorkflowSliderBar
              activeTab={activeTab}
              onNavigate={(tab) => setActiveTab(tab)}
              currentUser={currentUser}
              onOpenMobileSlider={() => setIsMobileSliderOpen(true)}
            />
          )}

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto max-w-[1560px]">
            {activeTab === 'admin' && (
              <AdminDashboard
                records={records}
                onOpenRecord={handleOpenRecordInVerifier}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'ingestion' && (
              <IngestionPipeline
                onIngestComplete={handleIngestComplete}
                onOpenRecordInVerifier={handleOpenRecordInVerifier}
              />
            )}

            {activeTab === 'verifier' && (
              <VerifierWorkspace
                records={records}
                activeRecordId={activeRecordId}
                onSelectRecord={(id) => setActiveRecordId(id)}
                onUpdateRecord={handleUpdateRecord}
                onSwitchToMap={() => setActiveTab('cadastral_map')}
                onAddRetrainingLog={handleAddRetrainingLog}
              />
            )}

            {activeTab === 'cadastral_map' && (
              <CadastralMapView
                records={records}
                selectedRecordId={activeRecordId}
                onSelectRecord={(id) => setActiveRecordId(id)}
              />
            )}

            {activeTab === 'officer' && (
              <OfficerApprovalQueue
                records={records}
                onUpdateRecord={handleUpdateRecord}
                onSelectRecordForInspection={(id) => {
                  setActiveRecordId(id);
                  setActiveTab('cadastral_map');
                }}
              />
            )}

            {activeTab === 'retraining' && (
              <RetrainingPipeline
                logs={retrainingLogs}
                onTriggerTraining={() => {
                  const newLog = {
                    id: `log_${Date.now()}`,
                    fieldKey: 'khasra_number',
                    language: 'Hindi',
                    script: 'Devanagari',
                    originalExtracted: '४०५/१',
                    correctedValue: '४०५/१, ४०८',
                    verifier: 'Devika S.N',
                    timestamp: 'Just now',
                    status: 'applied',
                  };
                  handleAddRetrainingLog(newLog);
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
