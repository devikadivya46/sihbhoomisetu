import React from 'react';
import { 
  Home, 
  Cpu, 
  FileCheck, 
  Compass, 
  UserCheck, 
  TrendingUp,
  LogOut,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types/landRecords';

interface SidebarSliderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarSlider: React.FC<SidebarSliderProps> = ({
  activeTab,
  onNavigate,
  currentUser,
  onLogout,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const navItems = [
    {
      id: 'admin',
      label: 'Dashboard',
      description: 'Overview & Analytics',
      icon: Home,
    },
    {
      id: 'ingestion',
      label: 'Document Ingestion',
      description: 'OCR & Entity Extraction',
      icon: Cpu,
    },
    {
      id: 'verifier',
      label: 'Verification Panel',
      description: 'Human-in-the-Loop QC',
      icon: FileCheck,
    },
    {
      id: 'cadastral_map',
      label: 'Cadastral GIS Map',
      description: 'Aks Shajra / Mahabhunak',
      icon: Compass,
    },
    {
      id: 'officer',
      label: 'Officer Approval',
      description: 'Digital Sign & Land Registry',
      icon: UserCheck,
    },
    {
      id: 'retraining',
      label: 'Retraining Engine',
      description: 'Active Learning Feedback',
      icon: TrendingUp,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Clean White Sidebar matching User Screenshot */}
      <aside
        className={`fixed md:sticky top-[58px] inset-y-0 left-0 z-30 flex flex-col bg-white text-slate-800 border-r border-slate-200 transition-all duration-200 select-none h-[calc(100vh-58px)] ${
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
                title={isCollapsed ? `${item.label} (${item.description})` : undefined}
              >
                <div className={`mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className={`text-[13px] block leading-tight ${isActive ? 'text-blue-600 font-bold' : 'text-slate-800 font-semibold'}`}>
                      {item.label}
                    </span>
                    <p className={`text-[11px] truncate mt-0.5 leading-tight ${isActive ? 'text-blue-500/90 font-medium' : 'text-slate-400 font-normal'}`}>
                      {item.description}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer with collapse toggle and user */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-2">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex items-center gap-2 w-full p-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 mx-auto" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Collapse Menu</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-500 capitalize block truncate">
                  {currentUser.role}
                </span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 ml-auto"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
