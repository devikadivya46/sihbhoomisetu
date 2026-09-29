import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  FileText, 
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';
import sarulSatelliteImg from '../assets/sarul_satellite.png';

interface CadastralMapViewProps {
  records: LandRecord[];
  selectedRecordId?: string;
  onSelectRecord?: (recordId: string) => void;
}

interface PlotInfo {
  khasra: string;
  landholder: string;
  gisArea: string;
  rorArea: string;
  delta: string;
  deltaStatus: 'matched' | 'discrepancy' | 'disputed';
  soil: string;
  village: string;
  statusBadge: string;
}

export const CadastralMapView: React.FC<CadastralMapViewProps> = ({
  records,
  selectedRecordId,
  onSelectRecord,
}) => {
  const [selectedPlot, setSelectedPlot] = useState<string>('104/2');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRoadsCanals, setShowRoadsCanals] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<'hybrid' | 'satellite' | 'cadastral'>('hybrid');
  const [hoveredPlot, setHoveredPlot] = useState<string | null>(null);

  const plotDetails: Record<string, PlotInfo> = {
    '104/2': {
      khasra: 'Khasra #11 (104/2)',
      landholder: 'रामेश्वर दयाल सिंह (Rameshwar Dayal Singh)',
      gisArea: '1.416 Ha (3.50 Acres)',
      rorArea: '1.425 Ha',
      delta: '-0.009 Ha (-0.6%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Double Crop (Perennial Well)',
      village: 'Sarul Central (Mauza Rampur Khurd) • Nashik, Maharashtra',
      statusBadge: 'Spatially Matched (±1% area delta)',
    },
    '108': {
      khasra: 'Khasra #108',
      landholder: 'तुकाराम विठोबा जगताप (Tukaram Vithoba Jagtap)',
      gisArea: '1.900 Ha (4.69 Acres)',
      rorArea: '1.900 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Bagayat (Perennial Irrigated)',
      village: 'Viholi West • Nashik Highway Corridor',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '7': {
      khasra: 'Khasra #7',
      landholder: 'दिलीप नारायण पाटील (Dilip Narayan Patil)',
      gisArea: '0.840 Ha (2.07 Acres)',
      rorArea: '0.850 Ha',
      delta: '-0.010 Ha (-1.1%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Jirayat (Rainfed)',
      village: 'Sarul Middle Belt • Nashik',
      statusBadge: 'Spatially Matched (±1% area delta)',
    },
    '8': {
      khasra: 'Khasra #8',
      landholder: 'भाऊसाहेब एकनाथ शिंदे (Bhausaheb Eknath Shinde)',
      gisArea: '0.780 Ha (1.92 Acres)',
      rorArea: '0.785 Ha',
      delta: '-0.005 Ha (-0.6%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Double Crop',
      village: 'Sarul Strip Parcel • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '9': {
      khasra: 'Khasra #9',
      landholder: 'गणपत बापूराव काळे (Ganpat Bapurao Kale)',
      gisArea: '0.810 Ha (2.00 Acres)',
      rorArea: '0.810 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Seasonal Irrigated',
      village: 'Sarul Strip Parcel • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '10': {
      khasra: 'Khasra #10',
      landholder: 'विठ्ठल सखाराम बोरसे (Vitthal Sakharam Borse)',
      gisArea: '0.750 Ha (1.85 Acres)',
      rorArea: '0.760 Ha',
      delta: '-0.010 Ha (-1.3%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Jirayat',
      village: 'Sarul Strip Parcel • Nashik',
      statusBadge: 'Spatially Matched (±1% delta)',
    },
    '12': {
      khasra: 'Khasra #12 (Talav / Reservoir)',
      landholder: 'महाराष्ट्र शासन / ग्रामपंचायत सरूळ (Govt Water Body)',
      gisArea: '2.450 Ha (6.05 Acres)',
      rorArea: '2.450 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Water Reservoir / Talav (Public Commons)',
      village: 'Sarul South Reservoir • Nashik',
      statusBadge: 'Govt Commons / Verified Water Body',
    },
    '124': {
      khasra: 'Khasra #124',
      landholder: 'विष्णू किसन चौधरी (Vishnu Kisan Choudhary)',
      gisArea: '0.720 Ha (1.78 Acres)',
      rorArea: '0.720 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Double Crop',
      village: 'Viholi East • Mumbai-Nashik Expy',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '122': {
      khasra: 'Khasra #122',
      landholder: 'सखाराम नामदेव गायकवाड (Sakharam Gaikwad)',
      gisArea: '0.690 Ha (1.70 Acres)',
      rorArea: '0.695 Ha',
      delta: '-0.005 Ha (-0.7%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Dryland',
      village: 'Viholi East • Mumbai-Nashik Expy',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '121': {
      khasra: 'Khasra #121',
      landholder: 'दशरथ गोविंद पवार (Dashrath Govind Pawar)',
      gisArea: '0.710 Ha (1.75 Acres)',
      rorArea: '0.710 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Double Crop',
      village: 'Viholi East • Mumbai-Nashik Expy',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '118': {
      khasra: 'Khasra #118',
      landholder: 'प्रमोद बन्सीलाल अग्रवाल (Pramod Bansilal Agarwal)',
      gisArea: '0.830 Ha (2.05 Acres)',
      rorArea: '0.830 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Commercial Conversion / Mixed',
      village: 'Viholi Highway Frontage • Nashik',
      statusBadge: 'Spatially Matched (Verified)',
    },
    'Gaothan': {
      khasra: 'Sarul Gaothan (Settlement Area)',
      landholder: 'ग्रामपंचायत सरूळ (Gram Panchayat Abadi Area)',
      gisArea: '4.850 Ha (11.98 Acres)',
      rorArea: '4.850 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Gaothan / Residential Settlement (Abadi Deh)',
      village: 'Sarul Central Gaothan • Nashik',
      statusBadge: 'Gaothan Abadi Section 122 MLRC',
    },
    '1': {
      khasra: 'Khasra #1',
      landholder: 'गोविंद भास्कर जोशी (Govind Bhaskar Joshi)',
      gisArea: '1.200 Ha (2.96 Acres)',
      rorArea: '1.200 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Bagayat',
      village: 'Sarul North-East • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '2': {
      khasra: 'Khasra #2',
      landholder: 'बाळकृष्ण विनायक कुलकर्णी (Balkrishna Kulkarni)',
      gisArea: '1.450 Ha (3.58 Acres)',
      rorArea: '1.450 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Perennial',
      village: 'Sarul East Border • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '5': {
      khasra: 'Khasra #5',
      landholder: 'कैलास त्र्यंबक कदम (Kailas Trimbak Kadam)',
      gisArea: '1.180 Ha (2.91 Acres)',
      rorArea: '1.190 Ha',
      delta: '-0.010 Ha (-0.8%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Jirayat',
      village: 'Sarul Gaothan Adjacent • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '136': {
      khasra: 'Khasra #136',
      landholder: 'सुरेश बाबुराव गायकवाड (Suresh Baburao Gaikwad)',
      gisArea: '2.110 Ha (5.21 Acres)',
      rorArea: '2.340 Ha',
      delta: '+0.230 Ha (+9.8% Variance)',
      deltaStatus: 'discrepancy',
      soil: 'Agricultural Dryland',
      village: 'Viholi Boundary • Nashik',
      statusBadge: 'Spatial Discrepancy (>5% area variance)',
    },
    '137': {
      khasra: 'Khasra #137',
      landholder: 'मोहनराव दत्तात्रय वाघ (Mohanrao Dattatraya Wagh)',
      gisArea: '1.650 Ha (4.07 Acres)',
      rorArea: '1.650 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Irrigated',
      village: 'Viholi North Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '138': {
      khasra: 'Khasra #138',
      landholder: 'प्रदीप माधवराव थोरात (Pradeep Thorat)',
      gisArea: '1.820 Ha (4.49 Acres)',
      rorArea: '1.820 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Irrigated',
      village: 'Viholi North-East Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '83': {
      khasra: 'Khasra #83',
      landholder: 'चंद्रकांत मारुती जाधव (Chandrakant Maruti Jadhav)',
      gisArea: '1.100 Ha (2.71 Acres)',
      rorArea: '1.100 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Terrace Cultivation',
      village: 'Sarul North-West Hill Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '81': {
      khasra: 'Khasra #81',
      landholder: 'तानाजी किसन मोरे (Tanaji Kisan More)',
      gisArea: '1.340 Ha (3.31 Acres)',
      rorArea: '1.350 Ha',
      delta: '-0.010 Ha (-0.7%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Jirayat',
      village: 'Sarul Hill Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '79': {
      khasra: 'Khasra #79',
      landholder: 'अशोक शंकर देशमुख (Ashok Shankar Deshmukh)',
      gisArea: '1.520 Ha (3.75 Acres)',
      rorArea: '1.520 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Double Crop',
      village: 'Sarul West Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '72': {
      khasra: 'Khasra #72',
      landholder: 'रंगनाथ सखाराम शिंदे (Ranganath Sakharam Shinde)',
      gisArea: '1.250 Ha (3.08 Acres)',
      rorArea: '1.250 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Jirayat',
      village: 'Sarul West Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '47': {
      khasra: 'Khasra #47',
      landholder: 'भास्कर विठोबा सानप (Bhaskar Vithoba Sanap)',
      gisArea: '1.050 Ha (2.59 Acres)',
      rorArea: '1.050 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Irrigated',
      village: 'Sarul South-West • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '45': {
      khasra: 'Khasra #45',
      landholder: 'संपत किसन घुगे (Sampat Kisan Ghuge)',
      gisArea: '0.980 Ha (2.42 Acres)',
      rorArea: '0.980 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Rainfed',
      village: 'Sarul Boundary Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
    '18': {
      khasra: 'Khasra #18',
      landholder: 'मच्छिंद्र पांडुरंग दराडे (Machhindra Darade)',
      gisArea: '1.740 Ha (4.29 Acres)',
      rorArea: '1.740 Ha',
      delta: '0.000 Ha (0.0%)',
      deltaStatus: 'matched',
      soil: 'Agricultural Double Crop',
      village: 'Sarul South Sector • Nashik',
      statusBadge: 'Spatially Matched (Exact)',
    },
  };

  const currentPlot: PlotInfo = plotDetails[selectedPlot] || {
    khasra: `Khasra #${selectedPlot}`,
    landholder: 'खातेदार शेतकरी (Registered Farmer)',
    gisArea: '1.250 Ha',
    rorArea: '1.250 Ha',
    delta: '0.000 Ha',
    deltaStatus: 'matched',
    soil: 'Agricultural Farmland (Jirayat / Bagayat)',
    village: 'Sarul / Viholi Shivar • Nashik, Maharashtra',
    statusBadge: 'Spatially Matched (DILRMP Verified)',
  };

  return (
    <div className="space-y-5">
      {/* 1. Simple, Clean Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Cadastral Village Map
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Sarul &amp; Vilholi Farmlands, Nashik &bull; Click any plot on the map to view ownership and boundaries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              184 Plots Mapped
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Map & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Real Satellite Cadastral Map (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col">
          {/* Map Top Bar */}
          <div className="flex flex-wrap items-center justify-between p-3.5 border-b border-slate-200 bg-slate-50 gap-2">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">
                Sarul &amp; Vilholi Farmlands
              </span>
              <span className="text-xs text-slate-500">
                Nashik District, Maharashtra
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Layer switch buttons */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setActiveLayer('hybrid')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeLayer === 'hybrid' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Hybrid
                </button>
                <button
                  onClick={() => setActiveLayer('satellite')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeLayer === 'satellite' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setActiveLayer('cadastral')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeLayer === 'cadastral' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Boundaries
                </button>
              </div>

              {/* Highway toggle */}
              <button
                onClick={() => setShowRoadsCanals(!showRoadsCanals)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  showRoadsCanals 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {showRoadsCanals ? 'Expressway: Visible' : 'Expressway: Hidden'}
              </button>

              {/* Zoom controls */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2.0))}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.75))}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                  title="Reset Map"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* SATELLITE CADASTRAL CANVAS: EXACT AERIAL ORTHOPHOTO REPLICA */}
          <div className="relative w-full h-[540px] bg-slate-950 overflow-hidden select-none">
            <div 
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full h-full relative"
            >
              {/* 1. AUTHENTIC HIGH-RES SATELLITE ORTHOMOSAIC BASEMAP */}
              {activeLayer !== 'cadastral' && (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={sarulSatelliteImg}
                    alt="Sarul Viholi Satellite Imagery"
                    className="w-full h-full object-cover brightness-[0.92] contrast-[1.18] saturate-[1.15]"
                  />
                  {/* Subtle orthophoto GIS color-grade overlay to match aerial sensor imagery */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-900/25 pointer-events-none mix-blend-multiply" />
                </div>
              )}

              {/* If cadastral-only mode, clean dark GIS cartographic background */}
              {activeLayer === 'cadastral' && (
                <div className="absolute inset-0 bg-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                </div>
              )}

              {/* 2. OVERLAY SVG CADASTRAL PARCEL NETWORK (Matching Image 2 / Mahabhunaksha Exactly) */}
              <svg viewBox="0 0 800 520" className="absolute inset-0 w-full h-full">
                <defs>
                  {/* Water texture for Plot 12 reservoir */}
                  <pattern id="waterRipple" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#0284c7" fillOpacity="0.45" />
                    <circle cx="10" cy="10" r="3" fill="#38bdf8" fillOpacity="0.3" />
                  </pattern>
                  {/* Gaothan settlement roof hatch pattern */}
                  <pattern id="gaothanHatch" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="#78350f" fillOpacity="0.25" />
                    <line x1="0" y1="0" x2="10" y2="10" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.35" />
                  </pattern>
                </defs>

                {/* Plot 12 Retention Pond / Water Reservoir (Exact from Image 2) */}
                <g>
                  <polygon 
                    points="375,390 480,385 470,470 380,465" 
                    fill="url(#waterRipple)" 
                    stroke="#0284c7" 
                    strokeWidth="1.5"
                  />
                  <ellipse cx="425" cy="430" rx="30" ry="18" fill="#0369a1" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1" />
                </g>

                {/* 1. Purple Village Administrative Boundary (Dividing Sarul and Viholi from top to bottom) */}
                <path 
                  d="M 505,0 L 507,70 L 512,160 L 515,260 L 516,360 L 514,460 L 512,520" 
                  fill="none" 
                  stroke="#9333ea" 
                  strokeWidth="4" 
                  strokeDasharray="6 3" 
                  className="drop-shadow-md"
                />

                {/* 2. Mumbai - Nashik Expressway (Highway on Right side from Image 2) */}
                {showRoadsCanals && (
                  <g>
                    {/* Asphalt highway body */}
                    <path 
                      d="M 800,320 L 690,520" 
                      fill="none" 
                      stroke="#1e293b" 
                      strokeWidth="20" 
                      strokeOpacity="0.75" 
                    />
                    {/* Yellow boundary shoulder lines */}
                    <path 
                      d="M 810,320 L 700,520" 
                      fill="none" 
                      stroke="#facc15" 
                      strokeWidth="3.5" 
                      strokeDasharray="8 4" 
                    />
                    <path 
                      d="M 790,320 L 680,520" 
                      fill="none" 
                      stroke="#facc15" 
                      strokeWidth="2" 
                    />
                    {/* Center white dashed divider */}
                    <path 
                      d="M 800,320 L 690,520" 
                      fill="none" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                      strokeDasharray="5 5" 
                    />
                    {/* Expressway Label */}
                    <text 
                      x="735" 
                      y="450" 
                      fill="#ffffff" 
                      fontSize="10" 
                      fontWeight="bold" 
                      fontFamily="sans-serif"
                      transform="rotate(62 735 450)"
                      className="drop-shadow-md tracking-wider"
                    >
                      Mumbai - Nashik Expy
                    </text>
                    {/* Gaikwad Galli label */}
                    <text 
                      x="770" 
                      y="490" 
                      fill="#fef08a" 
                      fontSize="8" 
                      fontFamily="sans-serif"
                      transform="rotate(62 770 490)"
                      className="drop-shadow-sm font-semibold"
                    >
                      Gaikwad Galli
                    </text>
                  </g>
                )}

                {/* ============================================================== */}
                {/* TURQUOISE PARCEL BOUNDARIES (Sarul Farmlands & Viholi Farmlands) */}
                {/* ============================================================== */}
                {/* --- Top Row Sarul Parcels --- */}
                <polygon points="10,5 65,3 55,75 10,70" fill={selectedPlot === '83' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('83')} className="cursor-pointer" />
                <text x="25" y="40" fill="#ffffff" fontSize="9" fontWeight="bold">83</text>

                <polygon points="65,3 125,5 120,78 55,75" fill={selectedPlot === '81' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('81')} className="cursor-pointer" />
                <text x="82" y="42" fill="#ffffff" fontSize="9" fontWeight="bold">81</text>

                <polygon points="125,5 160,6 155,78 120,78" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="135" y="44" fill="#ffffff" fontSize="9" fontWeight="bold">63</text>

                <polygon points="160,6 195,8 190,80 155,78" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="170" y="45" fill="#ffffff" fontSize="9" fontWeight="bold">59</text>

                <polygon points="195,8 230,10 225,82 190,80" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="205" y="46" fill="#ffffff" fontSize="9" fontWeight="bold">60</text>

                <polygon points="260,5 315,10 310,75 255,70" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="280" y="42" fill="#ffffff" fontSize="9" fontWeight="bold">172</text>

                <polygon points="315,10 380,12 375,80 310,75" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="340" y="44" fill="#ffffff" fontSize="9" fontWeight="bold">173</text>

                <polygon points="380,12 460,15 455,85 375,80" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="410" y="48" fill="#ffffff" fontSize="9" fontWeight="bold">189</text>

                {/* --- Second Row Sarul Parcels --- */}
                <polygon points="10,70 55,75 50,140 10,135" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="25" y="105" fill="#ffffff" fontSize="9" fontWeight="bold">82</text>

                <polygon points="55,75 120,78 115,145 50,140" fill={selectedPlot === '79' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('79')} className="cursor-pointer" />
                <text x="75" y="110" fill="#ffffff" fontSize="9" fontWeight="bold">79</text>

                <polygon points="120,78 150,80 145,145 115,145" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="127" y="112" fill="#ffffff" fontSize="8" fontWeight="bold">64</text>

                <polygon points="150,80 185,82 180,148 145,145" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="160" y="114" fill="#ffffff" fontSize="8" fontWeight="bold">65</text>

                <polygon points="185,82 225,85 220,150 180,148" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="198" y="116" fill="#ffffff" fontSize="8" fontWeight="bold">58</text>

                <polygon points="225,85 265,88 260,152 220,150" fill={selectedPlot === '57' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('57')} className="cursor-pointer" />
                <text x="238" y="118" fill="#ffffff" fontSize="9" fontWeight="bold">57</text>

                <polygon points="400,85 490,90 485,160 395,155" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="440" y="125" fill="#ffffff" fontSize="9" fontWeight="bold">190</text>

                {/* --- Third Row Sarul Parcels --- */}
                <polygon points="10,135 50,140 45,205 10,200" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="25" y="170" fill="#ffffff" fontSize="9" fontWeight="bold">76</text>

                <polygon points="50,140 115,145 105,210 45,205" fill={selectedPlot === '72' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('72')} className="cursor-pointer" />
                <text x="70" y="175" fill="#ffffff" fontSize="9" fontWeight="bold">72</text>

                <polygon points="115,145 175,150 165,215 105,210" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="135" y="180" fill="#ffffff" fontSize="8" fontWeight="bold">71</text>

                <polygon points="175,150 220,152 210,218 165,215" fill={selectedPlot === '51' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('51')} className="cursor-pointer" />
                <text x="188" y="182" fill="#ffffff" fontSize="9" fontWeight="bold">51</text>

                <polygon points="220,152 260,155 250,220 210,218" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="232" y="184" fill="#ffffff" fontSize="9" fontWeight="bold">52</text>

                {/* --- Fourth Row Sarul Parcels --- */}
                <polygon points="45,205 105,210 95,275 35,270" fill={selectedPlot === '47' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('47')} className="cursor-pointer" />
                <text x="65" y="240" fill="#ffffff" fontSize="9" fontWeight="bold">47</text>

                <polygon points="105,210 165,215 155,280 95,275" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="125" y="245" fill="#ffffff" fontSize="9" fontWeight="bold">48</text>

                <polygon points="165,215 210,218 200,285 155,280" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="180" y="250" fill="#ffffff" fontSize="9" fontWeight="bold">49</text>

                <polygon points="35,270 95,275 85,340 25,335" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="55" y="305" fill="#ffffff" fontSize="9" fontWeight="bold">46</text>

                <polygon points="25,335 85,340 75,410 15,405" fill={selectedPlot === '45' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('45')} className="cursor-pointer" />
                <text x="45" y="375" fill="#ffffff" fontSize="9" fontWeight="bold">45</text>

                <polygon points="15,405 75,410 65,475 10,470" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="35" y="440" fill="#ffffff" fontSize="9" fontWeight="bold">44</text>

                {/* --- Bottom Left Sarul Agricultural Fields: 18, 19, 29, 20, 21, 16, 15, 14, 13 --- */}
                <polygon points="120,285 195,290 185,370 110,365" fill={selectedPlot === '18' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('18')} className="cursor-pointer" />
                <text x="145" y="330" fill="#ffffff" fontSize="10" fontWeight="bold">18</text>

                <polygon points="10,470 65,475 55,515 5,515" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="25" y="495" fill="#ffffff" fontSize="8" fontWeight="bold">29</text>

                <polygon points="65,475 130,480 120,515 55,515" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="90" y="500" fill="#ffffff" fontSize="8" fontWeight="bold">20</text>

                <polygon points="130,480 185,485 175,515 120,515" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="150" y="500" fill="#ffffff" fontSize="8" fontWeight="bold">21</text>

                <polygon points="185,485 240,490 230,515 175,515" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="205" y="502" fill="#ffffff" fontSize="8" fontWeight="bold">16</text>

                <polygon points="240,490 295,495 285,515 230,515" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="260" y="505" fill="#ffffff" fontSize="8" fontWeight="bold">15</text>

                <polygon points="295,495 350,500 340,515 285,515" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="315" y="508" fill="#ffffff" fontSize="8" fontWeight="bold">14</text>

                <polygon points="350,500 405,505 395,515 340,515" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="370" y="510" fill="#ffffff" fontSize="8" fontWeight="bold">13</text>

                {/* --- Viholi Upper Turquoise Parcels (142, 141, 139, 136, 137, 138, 133, 132, 131, 130) --- */}
                <polygon points="520,5 570,8 565,65 515,62" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="535" y="38" fill="#ffffff" fontSize="9" fontWeight="bold">142</text>

                <polygon points="570,8 625,12 620,70 565,65" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="590" y="40" fill="#ffffff" fontSize="9" fontWeight="bold">141</text>

                <polygon points="675,15 750,20 745,75 670,70" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="705" y="45" fill="#ffffff" fontSize="9" fontWeight="bold">139</text>

                <polygon points="515,65 590,70 585,130 510,125" fill={selectedPlot === '136' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('136')} className="cursor-pointer" />
                <text x="545" y="100" fill="#ffffff" fontSize="9" fontWeight="bold">136</text>

                <polygon points="590,70 665,75 660,135 585,130" fill={selectedPlot === '137' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('137')} className="cursor-pointer" />
                <text x="620" y="102" fill="#ffffff" fontSize="9" fontWeight="bold">137</text>

                <polygon points="665,75 745,80 740,140 660,135" fill={selectedPlot === '138' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.12)'} stroke="#22d3ee" strokeWidth="2" onClick={() => setSelectedPlot('138')} className="cursor-pointer" />
                <text x="695" y="105" fill="#ffffff" fontSize="9" fontWeight="bold">138</text>

                <polygon points="600,135 665,140 660,180 595,175" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="625" y="160" fill="#ffffff" fontSize="9" fontWeight="bold">133</text>

                <polygon points="600,180 665,185 660,215 595,210" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="625" y="200" fill="#ffffff" fontSize="8" fontWeight="bold">132</text>

                <polygon points="665,140 735,145 730,215 660,210" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="690" y="180" fill="#ffffff" fontSize="9" fontWeight="bold">131</text>

                <polygon points="735,145 770,148 765,218 730,215" fill="rgba(6, 182, 212, 0.12)" stroke="#22d3ee" strokeWidth="2" />
                <text x="745" y="182" fill="#ffffff" fontSize="8" fontWeight="bold">130</text>

                {/* ============================================================== */}
                {/* YELLOW CADASTRAL PARCELS (Sarul Gaothan & Viholi Residential/Farm Plots) */}
                {/* ============================================================== */}
                {/* --- Sarul Gaothan Settlement Area (Top Center) --- */}
                <g 
                  onClick={() => setSelectedPlot('Gaothan')}
                  className="cursor-pointer"
                >
                  <polygon 
                    points="340,95 425,100 415,190 335,180" 
                    fill="url(#gaothanHatch)" 
                    stroke="#facc15" 
                    strokeWidth="3.5" 
                    className="hover:stroke-yellow-300 transition-colors"
                  />
                  {/* Blue Label Badge matching Image 2 */}
                  <rect x="355" y="105" width="48" height="18" rx="4" fill="#1d4ed8" fillOpacity="0.9" />
                  <text x="363" y="118" fill="#ffffff" fontSize="10" fontWeight="bold">Sarul</text>
                  <text x="350" y="142" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-md">Gaothan</text>
                </g>

                {/* Plot 1 */}
                <polygon points="425,100 500,105 490,185 415,190" fill={selectedPlot === '1' ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.22)'} stroke="#facc15" strokeWidth="2.5" onClick={() => setSelectedPlot('1')} className="cursor-pointer" />
                <text x="455" y="145" fill="#ffffff" fontSize="10" fontWeight="bold">1</text>

                {/* Plot 2 */}
                <polygon points="415,190 490,185 480,270 410,265" fill={selectedPlot === '2' ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.22)'} stroke="#facc15" strokeWidth="2.5" onClick={() => setSelectedPlot('2')} className="cursor-pointer" />
                <text x="450" y="230" fill="#ffffff" fontSize="10" fontWeight="bold">2</text>

                {/* Plot 5 */}
                <polygon points="335,180 415,190 410,265 330,260" fill={selectedPlot === '5' ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.22)'} stroke="#facc15" strokeWidth="2.5" onClick={() => setSelectedPlot('5')} className="cursor-pointer" />
                <text x="365" y="225" fill="#ffffff" fontSize="10" fontWeight="bold">5</text>

                {/* --- Central Horizontal Strip Plots: 7, 8, 9, 10, 11 (Matching Image 2) --- */}
                {/* Plot 7 */}
                <g onClick={() => setSelectedPlot('7')} className="cursor-pointer">
                  <polygon 
                    points="230,245 330,240 325,275 240,285" 
                    fill={selectedPlot === '7' ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.25)'} 
                    stroke="#facc15" 
                    strokeWidth={selectedPlot === '7' ? '4' : '2.5'} 
                  />
                  <text x="275" y="265" fill="#ffffff" fontSize="11" fontWeight="bold">7</text>
                </g>

                {/* Plot 8 */}
                <g onClick={() => setSelectedPlot('8')} className="cursor-pointer">
                  <polygon points="240,285 325,275 320,315 248,325" fill={selectedPlot === '8' ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.25)'} stroke="#facc15" strokeWidth="2.5" />
                  <text x="280" y="305" fill="#ffffff" fontSize="11" fontWeight="bold">8</text>
                </g>

                {/* Plot 9 */}
                <g onClick={() => setSelectedPlot('9')} className="cursor-pointer">
                  <polygon points="248,325 320,315 315,355 255,365" fill={selectedPlot === '9' ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.25)'} stroke="#facc15" strokeWidth="2.5" />
                  <text x="282" y="345" fill="#ffffff" fontSize="11" fontWeight="bold">9</text>
                </g>

                {/* Plot 10 */}
                <g onClick={() => setSelectedPlot('10')} className="cursor-pointer">
                  <polygon points="255,365 315,355 310,395 260,405" fill={selectedPlot === '10' ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.25)'} stroke="#facc15" strokeWidth="2.5" />
                  <text x="280" y="385" fill="#ffffff" fontSize="11" fontWeight="bold">10</text>
                </g>

                {/* Plot 11 (Target Highlighted Plot - Matches Rameshwar Dayal Singh 104/2 in Verification Queue) */}
                <g onClick={() => setSelectedPlot('104/2')} className="cursor-pointer">
                  <polygon 
                    points="260,405 310,395 345,475 295,490" 
                    fill={selectedPlot === '104/2' ? 'rgba(34, 197, 94, 0.55)' : 'rgba(250, 204, 21, 0.25)'} 
                    stroke={selectedPlot === '104/2' ? '#22c55e' : '#facc15'} 
                    strokeWidth={selectedPlot === '104/2' ? '4.5' : '2.5'} 
                  />
                  <text x="275" y="445" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-md">
                    11 (104/2)
                  </text>
                </g>

                {/* Plot 12 (Bordering Reservoir) */}
                <g onClick={() => setSelectedPlot('12')} className="cursor-pointer">
                  <polygon points="310,395 400,390 390,470 345,475" fill={selectedPlot === '12' ? 'rgba(2, 132, 199, 0.5)' : 'rgba(250, 204, 21, 0.22)'} stroke="#facc15" strokeWidth="2.5" />
                  <text x="350" y="430" fill="#ffffff" fontSize="10" fontWeight="bold">12</text>
                </g>

                {/* --- Viholi Southern Yellow Plots: 126, 127, 128, 129, 124, 122, 121, 118, 108 --- */}
                <polygon points="580,220 640,225 635,260 575,255" fill="rgba(250, 204, 21, 0.22)" stroke="#facc15" strokeWidth="2" />
                <text x="600" y="245" fill="#ffffff" fontSize="8" fontWeight="bold">126</text>

                <polygon points="640,225 700,230 695,265 635,260" fill="rgba(250, 204, 21, 0.22)" stroke="#facc15" strokeWidth="2" />
                <text x="660" y="248" fill="#ffffff" fontSize="8" fontWeight="bold">127</text>

                <polygon points="575,255 635,260 630,295 570,290" fill="rgba(250, 204, 21, 0.22)" stroke="#facc15" strokeWidth="2" />
                <text x="595" y="280" fill="#ffffff" fontSize="8" fontWeight="bold">120</text>

                {/* Plot 124 */}
                <g onClick={() => setSelectedPlot('124')} className="cursor-pointer">
                  <polygon 
                    points="600,295 680,290 675,330 595,335" 
                    fill={selectedPlot === '124' ? 'rgba(250, 204, 21, 0.55)' : 'rgba(250, 204, 21, 0.22)'} 
                    stroke="#facc15" 
                    strokeWidth={selectedPlot === '124' ? '3.5' : '2'} 
                  />
                  <text x="630" y="315" fill="#ffffff" fontSize="10" fontWeight="bold">124</text>
                </g>

                {/* Plot 122 */}
                <g onClick={() => setSelectedPlot('122')} className="cursor-pointer">
                  <polygon points="595,335 675,330 670,370 590,375" fill={selectedPlot === '122' ? 'rgba(250, 204, 21, 0.55)' : 'rgba(250, 204, 21, 0.22)'} stroke="#facc15" strokeWidth="2" />
                  <text x="625" y="355" fill="#ffffff" fontSize="10" fontWeight="bold">122</text>
                </g>

                {/* Plot 121 */}
                <g onClick={() => setSelectedPlot('121')} className="cursor-pointer">
                  <polygon points="590,375 670,370 665,410 585,415" fill={selectedPlot === '121' ? 'rgba(250, 204, 21, 0.55)' : 'rgba(250, 204, 21, 0.22)'} stroke="#facc15" strokeWidth="2" />
                  <text x="620" y="395" fill="#ffffff" fontSize="10" fontWeight="bold">121</text>
                </g>

                {/* Plot 118 */}
                <g onClick={() => setSelectedPlot('118')} className="cursor-pointer">
                  <polygon points="585,415 665,410 660,450 580,455" fill={selectedPlot === '118' ? 'rgba(250, 204, 21, 0.55)' : 'rgba(250, 204, 21, 0.22)'} stroke="#facc15" strokeWidth="2" />
                  <text x="615" y="435" fill="#ffffff" fontSize="10" fontWeight="bold">118</text>
                </g>

                {/* Plot 108 */}
                <g onClick={() => setSelectedPlot('108')} className="cursor-pointer">
                  <polygon points="620,450 685,445 680,485 615,490" fill={selectedPlot === '108' ? 'rgba(250, 204, 21, 0.6)' : 'rgba(250, 204, 21, 0.35)'} stroke="#facc15" strokeWidth="2.5" />
                  <text x="640" y="470" fill="#fef08a" fontSize="10" fontWeight="bold">108</text>
                </g>

                {/* ============================================================== */}
                {/* BLUE BADGES FOR VILLAGE LABELS (Matching Image 2 Exactly) */}
                {/* ============================================================== */}
                {/* Sarul Badges */}
                <g transform="translate(110, 110)">
                  <rect x="0" y="0" width="56" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1" />
                  <text x="10" y="14" fill="#ffffff" fontSize="11" fontWeight="bold">Sarul</text>
                </g>
                <g transform="translate(110, 360)">
                  <rect x="0" y="0" width="56" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1" />
                  <text x="10" y="14" fill="#ffffff" fontSize="11" fontWeight="bold">Sarul</text>
                </g>
                <g transform="translate(370, 360)">
                  <rect x="0" y="0" width="56" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1" />
                  <text x="10" y="14" fill="#ffffff" fontSize="11" fontWeight="bold">Sarul</text>
                </g>

                {/* Viholi Badges */}
                <g transform="translate(520, 100)">
                  <rect x="0" y="0" width="58" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1" />
                  <text x="9" y="14" fill="#ffffff" fontSize="11" fontWeight="bold">Viholi</text>
                </g>
                <g transform="translate(520, 360)">
                  <rect x="0" y="0" width="58" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1" />
                  <text x="9" y="14" fill="#ffffff" fontSize="11" fontWeight="bold">Viholi</text>
                </g>
                <g transform="translate(710, 110)">
                  <rect x="0" y="0" width="58" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1" />
                  <text x="9" y="14" fill="#ffffff" fontSize="11" fontWeight="bold">Viholi</text>
                </g>

                {/* Active Red Location Pin on Selected Plot */}
                {selectedPlot === '104/2' && (
                  <g transform="translate(290, 445)">
                    <ellipse cx="0" cy="10" rx="8" ry="3" fill="rgba(0,0,0,0.6)" />
                    <path d="M0,10 L-6,-5 C-6,-12 6,-12 6,-5 Z" fill="#ef4444" />
                    <circle cx="0" cy="-6" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="0" cy="-6" r="2.5" fill="#ffffff" />
                  </g>
                )}
                {selectedPlot === '108' && (
                  <g transform="translate(640, 470)">
                    <ellipse cx="0" cy="10" rx="8" ry="3" fill="rgba(0,0,0,0.6)" />
                    <path d="M0,10 L-6,-5 C-6,-12 6,-12 6,-5 Z" fill="#ef4444" />
                    <circle cx="0" cy="-6" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="0" cy="-6" r="2.5" fill="#ffffff" />
                  </g>
                )}
                {selectedPlot === '7' && (
                  <g transform="translate(275, 265)">
                    <ellipse cx="0" cy="10" rx="8" ry="3" fill="rgba(0,0,0,0.6)" />
                    <path d="M0,10 L-6,-5 C-6,-12 6,-12 6,-5 Z" fill="#ef4444" />
                    <circle cx="0" cy="-6" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="0" cy="-6" r="2.5" fill="#ffffff" />
                  </g>
                )}
              </svg>

              {/* Clean Status Badge in corner */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span className="font-medium text-slate-200">184 Parcels Mapped</span>
              </div>
            </div>
          </div>

          {/* Map Footer Legend */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3.5 h-3.5 rounded bg-cyan-100 border border-cyan-500 inline-block" />
                <span>Farmland (Cyan)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-500 inline-block" />
                <span>Village Settlement (Yellow)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3.5 h-3.5 rounded bg-purple-100 border border-purple-500 inline-block" />
                <span>Village Boundary (Purple)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-500 inline-block" />
                <span>Matched Plots (Green)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: CLEAN SELECTED PLOT INSPECTOR */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block">
              Plot Details
            </span>
            <div className="flex items-center justify-between mt-1">
              <h2 className="text-lg font-bold text-slate-900">
                {currentPlot.khasra}
              </h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                currentPlot.deltaStatus === 'discrepancy' 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {currentPlot.deltaStatus === 'discrepancy' ? 'Check Needed' : 'Verified'}
              </span>
            </div>
          </div>

          {/* Landholder */}
          <div>
            <span className="text-xs text-slate-500 block">Registered Owner</span>
            <span className="text-sm font-semibold text-slate-900 block mt-0.5">
              {currentPlot.landholder}
            </span>
          </div>

          {/* Area Comparison Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-lg">
              <span className="text-xs font-medium text-emerald-800 block">
                Survey Area
              </span>
              <span className="text-sm font-bold font-mono text-emerald-950 block mt-1">
                {currentPlot.gisArea}
              </span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-lg">
              <span className="text-xs font-medium text-blue-800 block">
                Record Area
              </span>
              <span className="text-sm font-bold font-mono text-blue-950 block mt-1">
                {currentPlot.rorArea}
              </span>
            </div>
          </div>

          {/* Delta Variance */}
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="font-medium text-slate-600">Area Difference</span>
            <span className={`font-mono font-bold ${currentPlot.deltaStatus === 'discrepancy' ? 'text-amber-700' : 'text-emerald-700'}`}>
              {currentPlot.delta}
            </span>
          </div>

          {/* Land Type */}
          <div>
            <span className="text-xs text-slate-500 block">Land Type</span>
            <span className="text-xs font-medium text-slate-900 block mt-0.5">
              {currentPlot.soil}
            </span>
          </div>

          {/* Village & Tehsil */}
          <div>
            <span className="text-xs text-slate-500 block">Location</span>
            <span className="text-xs text-slate-700 block mt-0.5">
              {currentPlot.village}
            </span>
          </div>

          {/* Friendly helper */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Click any plot on the map to view its details.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
