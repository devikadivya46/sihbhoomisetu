import React from 'react';
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types/landRecords';

interface WorkflowSliderBarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserProfile;
  onOpenMobileSlider: () => void;
}

export const WorkflowSliderBar: React.FC<WorkflowSliderBarProps> = ({
  activeTab,
  onNavigate,
  onOpenMobileSlider,
}) => {
  const stages = [
    { id: 'admin', title: 'Dashboard' },
    { id: 'ingestion', title: 'Upload Records' },
    { id: 'verifier', title: 'Review & Verify' },
    { id: 'cadastral_map', title: 'Cadastral Map' },
    { id: 'officer', title: 'Approvals' },
    { id: 'retraining', title: 'AI Learning' },
  ];

  const currentIdx = stages.findIndex((s) => s.id === activeTab);

  const handlePrev = () => {
    if (currentIdx > 0) onNavigate(stages[currentIdx - 1].id);
  };

  const handleNext = () => {
    if (currentIdx < stages.length - 1) onNavigate(stages[currentIdx + 1].id);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        {/* Mobile menu trigger & current view title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSlider}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {stages[currentIdx]?.title || 'Section'}
            </h2>
          </div>
        </div>

        {/* Clean, Simple Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {stages.map((stage) => {
            const isActive = activeTab === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => onNavigate(stage.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {stage.title}
              </button>
            );
          })}
        </div>

        {/* Right side: Step Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={currentIdx <= 0}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous section"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 font-medium px-1">
            {currentIdx + 1} of {stages.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIdx >= stages.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next section"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
