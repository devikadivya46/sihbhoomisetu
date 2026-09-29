import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Map, 
  Clock, 
  MapPin, 
  Award, 
  RefreshCw,
  ArrowRight,
  UploadCloud
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';

interface AdminDashboardProps {
  records: LandRecord[];
  onOpenRecord: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  records,
  onOpenRecord,
  onNavigateTab,
}) => {
  const stateRecords = [
    {
      state: 'Maharashtra',
      portal: 'Mahabhulekh',
      records: '2,410',
      matchRate: '96.8%',
      status: 'Fully Synced',
      statusClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      state: 'Rajasthan',
      portal: 'e-Dharti',
      records: '1,982',
      matchRate: '89.4%',
      status: 'In Progress',
      statusClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      state: 'Uttar Pradesh',
      portal: 'Bhulekh',
      records: '3,176',
      matchRate: '82.7%',
      status: 'In Progress',
      statusClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      state: 'Karnataka',
      portal: 'Bhoomi',
      records: '1,203',
      matchRate: '76.1%',
      status: 'Review Needed',
      statusClass: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Batch of 1,240 records processed',
      detail: 'Maharashtra · 7/12 Land Records',
      time: '11:42 AM',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 2,
      title: '15 records sent for verification',
      detail: 'Handwritten deeds needing operator check',
      time: '10:26 AM',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      id: 3,
      title: 'Sarul & Vilholi cadastral map synced',
      detail: '184 parcels mapped to satellite boundaries',
      time: '09:15 AM',
      icon: MapPin,
      iconColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: 4,
      title: 'Record #1452 approved by Officer',
      detail: 'Signed and ready for citizen issuance',
      time: 'Yesterday',
      icon: Award,
      iconColor: 'text-purple-600 bg-purple-50',
    },
    {
      id: 5,
      title: 'AI model updated with corrections',
      detail: 'Feedback applied to improve handwriting OCR',
      time: 'Yesterday',
      icon: RefreshCw,
      iconColor: 'text-teal-600 bg-teal-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER CARD (Exact match to User's Uploaded Image) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-50/90 via-blue-50/40 to-slate-50 min-h-[195px] shadow-xs">
        {/* Right Half: Edge-to-Edge Panoramic Agricultural Landscape + Cadastral Grid + Slogan + Paper Sheet */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-7/12 pointer-events-none overflow-hidden select-none">
          {/* Real Green Farm Foliage Photographic Image */}
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=80"
            alt="Agricultural Land Survey"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 24%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 24%, black 100%)',
            }}
          />

          {/* Perspective Cadastral Survey Polygon Grid Overlay */}
          <svg 
            viewBox="0 0 600 240" 
            preserveAspectRatio="none" 
            className="absolute inset-0 w-full h-full opacity-90"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 26%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 26%, black 100%)',
            }}
          >
            {/* Perspective Cadastral Polygons */}
            <polygon points="120,170 240,110 370,125 250,195" fill="rgba(34, 197, 94, 0.20)" stroke="#facc15" strokeWidth="2.5" />
            <polygon points="240,110 350,65 470,75 370,125" fill="rgba(34, 197, 94, 0.12)" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 2" />
            <polygon points="370,125 470,75 580,95 480,155" fill="rgba(34, 197, 94, 0.22)" stroke="#ffffff" strokeWidth="1.8" />
            <polygon points="250,195 370,125 480,155 370,230" fill="rgba(250, 204, 21, 0.22)" stroke="#facc15" strokeWidth="2.8" />
            <polygon points="50,195 120,170 250,195 170,238" fill="rgba(34, 197, 94, 0.15)" stroke="#ffffff" strokeWidth="1.8" />

            {/* Cadastral Survey Boundary Node Markers */}
            <circle cx="240" cy="110" r="4" fill="#ffffff" stroke="#059669" strokeWidth="2" />
            <circle cx="250" cy="195" r="4.5" fill="#facc15" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="480" cy="155" r="3.5" fill="#ffffff" stroke="#059669" strokeWidth="1.5" />

            {/* Prominent 3D Red Location Pin on Plot Vertex */}
            <g transform="translate(370, 125)">
              <ellipse cx="0" cy="10" rx="9" ry="3.5" fill="rgba(0,0,0,0.55)" filter="blur(1px)" />
              <path 
                d="M0,10 C-1,9 -11,-4 -11,-15 C-11,-22 -5,-27 0,-27 C5,-27 11,-22 11,-15 C11,-4 1,9 0,10 Z" 
                fill="#DC2626" 
                stroke="#FFFFFF" 
                strokeWidth="2" 
                className="drop-shadow-md"
              />
              <circle cx="0" cy="-15" r="4" fill="#FFFFFF" />
            </g>
          </svg>

          {/* Slogan Floating Card (Top-Right) */}
          <div className="absolute right-4 sm:right-6 top-3 sm:top-4 z-20 pointer-events-auto">
            <div className="bg-white/80 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/80 shadow-xs text-right">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block tracking-tight">
                सशक्त किसान | समृद्ध भारत
              </span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="inline-block w-3.5 h-2.5 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] border border-slate-300 rounded-2xs" />
                <span className="text-[10px] sm:text-xs text-slate-600 font-medium">
                  Empowering Farmers | Building a Prosperous India
                </span>
              </div>
            </div>
          </div>

          {/* Layered Jamabandi Archival Paper Sheet on Far Right */}
          <div className="absolute right-[-8px] top-6 sm:top-8 w-44 sm:w-48 h-48 bg-[#fdfaf2] border border-amber-900/40 rounded-lg shadow-md transform rotate-[5deg] p-3 overflow-hidden opacity-95">
            <div className="border-b border-red-800/30 pb-1 mb-1.5 flex items-center justify-between">
              <span className="text-[8px] font-bold text-amber-950 font-serif">
                जमाबंदी माल/खतौनी
              </span>
              <span className="text-[6.5px] text-slate-500 font-mono">
                सन् १९६२-६३
              </span>
            </div>
            
            <div className="space-y-1 text-[7.5px] text-slate-800 font-serif leading-tight">
              <div className="flex justify-between border-b border-amber-900/15 pb-0.5">
                <span className="font-semibold text-slate-900">खाता संख्या:</span>
                <span className="font-mono">१२४/८</span>
              </div>
              <div className="flex justify-between border-b border-amber-900/15 pb-0.5">
                <span className="font-semibold text-slate-900">खसरा नंबर:</span>
                <span className="font-mono text-amber-900 font-bold">४०५/१, ४०८</span>
              </div>
              <div className="flex justify-between border-b border-amber-900/15 pb-0.5">
                <span className="font-semibold text-slate-900">काश्तकार:</span>
                <span>रामेश्वर दयाल</span>
              </div>
            </div>

            {/* Purple Circular Revenue Stamp */}
            <div className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full border-2 border-purple-800/70 flex flex-col items-center justify-center text-[5.5px] font-bold text-purple-950 rotate-[-15deg] bg-purple-600/10 shadow-2xs">
              <span>राजस्व विभाग</span>
              <span className="text-[4.5px]">तहसीलदार</span>
            </div>
          </div>
        </div>

        {/* Foreground Content: Institutional Titles on Left */}
        <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-between min-h-[195px]">
          {/* Top: Ministry and Emblem */}
          <div className="flex items-center gap-3">
            {/* Ashoka Lion Capital Emblem */}
            <div className="w-8 h-9 shrink-0 text-slate-800">
              <svg viewBox="0 0 100 120" className="w-full h-full object-contain" fill="currentColor">
                <path d="M50 15 C45 10 35 15 32 24 C30 30 32 38 38 42 C34 45 30 50 30 58 C30 65 35 70 42 72 L42 80 C36 82 25 85 20 90 L80 90 C75 85 64 82 58 80 L58 72 C65 70 70 65 70 58 C70 50 66 45 62 42 C68 38 70 30 68 24 C65 15 55 10 50 15 Z" fill="#1e293b" />
                <circle cx="50" cy="98" r="6" stroke="#1e293b" strokeWidth="2" fill="none" />
                <rect x="25" y="106" width="50" height="5" rx="2" fill="#1e293b" />
                <text x="50" y="118" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#0f172a">
                  सत्यमेव जयते
                </text>
              </svg>
            </div>

            <div>
              <span className="text-sm font-bold text-blue-900 block leading-tight">
                Ministry of Rural Development
              </span>
              <span className="text-xs text-slate-600 font-medium block">
                Department of Land Resources (DoLR)
              </span>
            </div>
          </div>

          {/* Headline & Description */}
          <div className="max-w-xl mt-4 sm:mt-5">
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight leading-snug">
              Intelligent Land Record Digitization &amp; Cadastral Validation ERP
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal">
              Digitizing historical land records, validating cadastral maps and ensuring accurate land ownership for a transparent and secure tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* 2. FOUR CLEAN, SPACIOUS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Total Records</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 font-mono">14,280</span>
            <p className="text-xs text-slate-500 mt-1">Processed across 4 states</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Accuracy Rate</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-emerald-600 font-mono">96.4%</span>
            <p className="text-xs text-slate-500 mt-1">Automatic verification</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Needs Review</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-amber-600 font-mono">18.6%</span>
            <p className="text-xs text-slate-500 mt-1">Awaiting staff check</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Map Match Rate</span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-teal-600 font-mono">96.8%</span>
            <p className="text-xs text-slate-500 mt-1">Matched to GIS boundaries</p>
          </div>
        </div>
      </div>

      {/* 3. TWO COLUMNS: STATE PROGRESS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: State Overview (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                State Progress Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Status of records and boundary matching by state
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('cadastral_map')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Mini Map */}
            <div className="md:col-span-4 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center min-h-[220px]">
              <svg 
                viewBox="0 0 280 340" 
                className="w-full max-w-[170px] h-auto select-none"
              >
                <polygon points="120,40 155,20 185,45 155,75 125,58" fill="#fda4af" />
                <polygon points="125,60 148,65 142,95 120,88" fill="#10b981" />
                <polygon points="90,95 125,93 130,150 95,152 82,122" fill="#f59e0b" />
                <polygon points="130,95 180,98 175,148 132,150" fill="#f59e0b" />
                <polygon points="178,125 212,128 205,165 174,155" fill="#f59e0b" />
                <polygon points="210,140 258,125 268,150 240,172 208,162" fill="#fda4af" />
                <polygon points="65,152 110,152 112,192 72,190 60,170" fill="#10b981" />
                <polygon points="112,150 172,150 168,198 114,198" fill="#10b981" />
                <polygon points="172,158 206,168 198,220 166,205" fill="#10b981" />
                <polygon points="98,200 152,202 148,252 102,246" fill="#10b981" />
                <polygon points="152,204 195,208 184,272 146,260" fill="#10b981" />
                <polygon points="102,250 144,258 132,310 108,295" fill="#f59e0b" />
                <polygon points="116,310 144,310 134,355 124,355" fill="#10b981" />
              </svg>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>High Match</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Medium</span>
                </span>
              </div>
            </div>

            {/* Clean Data Table */}
            <div className="md:col-span-8 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-xs">
                    <th className="pb-3 font-medium">State</th>
                    <th className="pb-3 font-medium">Records</th>
                    <th className="pb-3 font-medium">Map Match</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stateRecords.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pr-3">
                        <span className="font-semibold text-slate-900 block">
                          {row.state}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          {row.portal}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                        {row.records}
                      </td>
                      <td className="py-3.5 px-3 font-bold font-mono text-slate-900 whitespace-nowrap">
                        {row.matchRate}
                      </td>
                      <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${row.statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <h2 className="text-base font-bold text-slate-900">
                Recent Updates
              </h2>
            </div>
            <button 
              onClick={() => onNavigateTab('verifier')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${act.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {act.title}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {act.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
