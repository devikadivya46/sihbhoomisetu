import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types/landRecords';

export const SYSTEM_USERS: UserProfile[] = [
  {
    id: 'user_admin_gec',
    name: 'Devika S.N',
    role: 'admin',
    displayRole: 'Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80',
    department: 'Revenue Administration',
  },
  {
    id: 'user_staff_sharma',
    name: 'Dr. S. Sharma',
    role: 'staff',
    displayRole: 'Review Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80',
    department: 'Verification Office',
  },
  {
    id: 'user_staff_verma',
    name: 'R. Verma',
    role: 'staff',
    displayRole: 'GIS Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80',
    department: 'Cadastral Mapping',
  },
  {
    id: 'user_student_amit',
    name: 'Amit Kumar',
    role: 'officer',
    displayRole: 'Approval Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=240&h=240&q=80',
    department: 'Tehsildar Office',
  },
  {
    id: 'user_student_priya',
    name: 'Priya Singh',
    role: 'staff',
    displayRole: 'Data Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=240&q=80',
    department: 'Digitization Unit',
  },
  {
    id: 'user_student_rahul',
    name: 'Rahul Gupta',
    role: 'staff',
    displayRole: 'Survey Associate',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&h=240&q=80',
    department: 'Survey Team',
  },
];

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(SYSTEM_USERS[0]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Simple Brand Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            BhoomiSetu
          </span>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-1">
          Sign In
        </h1>
        <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
          Select a profile to access the land records portal
        </p>

        {/* Profile Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full">
          {SYSTEM_USERS.map((user) => {
            const isSelected = selectedUser.id === user.id;

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3.5 rounded-xl transition-all text-left bg-white ${
                  isSelected
                    ? 'border-2 border-emerald-600 shadow-sm bg-emerald-50/20'
                    : 'border border-slate-200 hover:border-slate-300 shadow-2xs hover:bg-slate-50/50'
                }`}
              >
                {/* Circular Avatar */}
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 bg-slate-200 text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-slate-900 block truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500 block truncate">
                    {user.displayRole}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => onLogin(selectedUser)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
          >
            <span>Continue as {selectedUser.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
