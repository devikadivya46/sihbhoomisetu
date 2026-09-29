import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  Menu, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types/landRecords';

interface GovernmentHeaderProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onSelectUser?: (user: any) => void;
  onToggleMobileMenu?: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({
  currentUser,
  onLogout,
  onToggleMobileMenu,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Spatial Discrepancy Flagged',
      detail: 'Mauza Rampur Khurd · Plot 405/1 exceeds ±1% GIS area threshold.',
      time: '12m ago',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 2,
      type: 'success',
      title: 'Officer Sign-Off Required',
      detail: 'Record #104/2 verified by operator and awaiting digital seal.',
      time: '35m ago',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 3,
      type: 'info',
      title: 'Active Learning Retrained',
      detail: 'Batch of 15 human corrections merged into Indic-TrOCR model.',
      time: '1h ago',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-2xs select-none">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Hamburger (Mobile) + National Emblem + Ministry + Digital India */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          {/* Mobile Menu Toggle Button */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* National Emblem & Ministry Information */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Ashoka Lion Capital Emblem */}
            <div className="w-8 sm:w-9 h-10 sm:h-11 shrink-0 flex items-center justify-center text-slate-800">
              <svg viewBox="0 0 100 120" className="w-full h-full object-contain" fill="currentColor">
                {/* Upper Lion Silhouette Group */}
                <path 
                  d="M50 14 C44 9 34 14 31 23 C29 29 31 37 37 41 C33 44 29 49 29 57 C29 64 34 69 41 71 L41 79 C35 81 24 84 19 89 L81 89 C76 84 65 81 59 79 L59 71 C66 69 71 64 71 57 C71 49 67 44 63 41 C69 37 71 29 69 23 C66 14 56 9 50 14 Z" 
                  fill="#1e293b" 
                />
                {/* Left and Right stylized lion heads */}
                <path d="M22 36 C20 42 22 49 28 52 C26 55 24 59 25 64 C28 64 32 62 34 59 Z" fill="#1e293b" />
                <path d="M78 36 C80 42 78 49 72 52 C74 55 76 59 75 64 C72 64 68 62 66 59 Z" fill="#1e293b" />
                {/* Ashoka Chakra in Base */}
                <circle cx="50" cy="98" r="6.5" stroke="#1e293b" strokeWidth="1.8" fill="none" />
                <circle cx="50" cy="98" r="1.5" fill="#1e293b" />
                <path d="M43.5 98 L56.5 98 M50 91.5 L50 104.5 M45.4 93.4 L54.6 102.6 M45.4 102.6 L54.6 93.4" stroke="#1e293b" strokeWidth="1.2" />
                {/* Pedestal Base */}
                <rect x="22" y="106" width="56" height="5.5" rx="2" fill="#1e293b" />
                {/* Satyameva Jayate Inscription */}
                <text x="50" y="118.5" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
                  सत्यमेव जयते
                </text>
              </svg>
            </div>

            {/* Ministry Text */}
            <div className="leading-tight">
              <span className="text-xs sm:text-[13px] font-bold text-slate-900 block tracking-tight">
                Government of India
              </span>
              <span className="text-xs sm:text-[13px] font-bold text-slate-900 block tracking-tight">
                Ministry of Rural Development
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">
                Department of Land Resources (DoLR)
              </span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block h-9 w-[1px] bg-slate-200" />

          {/* Digital India Logo */}
          <div className="hidden md:flex items-center gap-2.5">
            <svg viewBox="0 0 48 48" className="w-8 h-8 shrink-0">
              <circle cx="24" cy="24" r="22" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
              <path d="M12 28 C14 18, 22 14, 30 15 C34 16, 37 19, 36 24 C35 29, 29 32, 23 30 C19 28, 17 22, 21 18" fill="none" stroke="#FF9933" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M16 32 C18 24, 25 20, 31 22 C35 24, 36 29, 32 33 C28 36, 22 36, 18 31" fill="none" stroke="#138808" strokeWidth="2.3" strokeLinecap="round" />
              <path d="M22 12 C28 12, 36 17, 36 25 C36 33, 26 38, 18 34" fill="none" stroke="#000080" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
            <div className="leading-none">
              <span className="text-[13px] font-extrabold text-blue-900 tracking-tight block">
                Digital India
              </span>
              <span className="text-[8.5px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">
                POWER TO EMPOWER
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Notifications + User Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileMenuOpen(false);
              }}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
                    <p className="text-[10px] text-slate-500">Live ERM & Cadastral Updates</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${notif.color} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {notif.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Automated DILRMP 3.0 Realtime Service
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill: Devika S.N (Admin) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              {/* Circular Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shadow-2xs shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80" 
                  alt="Devika S.N" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Name & Role */}
              <div className="text-left hidden sm:block leading-tight">
                <span className="text-xs font-bold text-slate-900 block">
                  Devika S.N
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Admin
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* User Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Devika S.N</p>
                  <p className="text-[11px] text-slate-500 truncate">devika.sn@nic.in</p>
                  <span className="mt-1 inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Senior Administrator
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Role / Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
