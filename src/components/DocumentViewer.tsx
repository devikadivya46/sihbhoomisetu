import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Layers, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Scale,
  Sparkles,
  Sliders
} from 'lucide-react';
import { BoundingBox, LandRecord } from '../types/landRecords';

interface DocumentViewerProps {
  record: LandRecord;
  selectedFieldKey: string | null;
  onSelectField: (key: string) => void;
  showBoxes?: boolean;
  isScanning?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  record,
  selectedFieldKey,
  onSelectField,
  showBoxes = true,
  isScanning = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [filterMode, setFilterMode] = useState<'normal' | 'denoised' | 'binarized' | 'negative'>('normal');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(showBoxes);
  const [activeDocType, setActiveDocType] = useState<'apnilaw_real' | 'jamabandi' | 'cadastral' | 'custom'>('apnilaw_real');
  const [customDocUrl, setCustomDocUrl] = useState<string | null>(null);
  const [customDocName, setCustomDocName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoom(1);

  // Handle User Upload of Real Document
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomDocUrl(url);
      setCustomDocName(file.name);
      setActiveDocType('custom');
      setZoom(1);
    }
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'denoised':
        return 'contrast-[1.28] brightness-[1.03] saturate-[0.85]';
      case 'binarized':
        return 'contrast-[3.6] grayscale brightness-[0.8]';
      case 'negative':
        return 'invert contrast-[1.4] brightness-[0.95] hue-rotate-180';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg select-none">
      {/* 1. TOP CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-300">
        {/* Left: Document Type Selector & Upload Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Document Ingestion Scan</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">&bull;</span>

          {/* Document Switcher Dropdown */}
          <div className="relative">
            <select
              value={activeDocType}
              onChange={(e) => setActiveDocType(e.target.value as any)}
              className="bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer hover:bg-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="apnilaw_real">📜 Real Historical Register (Apni Law 1921 Mutation Scan)</option>
              <option value="jamabandi">📄 UP Jamabandi RoR-1 (Archival Revenue Ledger)</option>
              <option value="cadastral">🗺️ Cadastral Aks Shajra Map (Village Survey)</option>
              {customDocUrl && <option value="custom">📁 Custom: {customDocName}</option>}
            </select>
          </div>

          {/* Upload Real Document Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-2xs text-[11px]"
            title="Upload any real scanned land deed or record from your computer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Upload Real Document</span>
            <span className="md:hidden">Upload</span>
          </button>
        </div>

        {/* Right: Filters & Zoom */}
        <div className="flex items-center gap-2">
          {/* Filter Modes */}
          <div className="flex items-center p-0.5 bg-slate-800/90 rounded-md border border-slate-700/60">
            <button
              onClick={() => setFilterMode('normal')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterMode === 'normal' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw
            </button>
            <button
              onClick={() => setFilterMode('denoised')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterMode === 'denoised' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="OpenCV Bilateral Denoising"
            >
              Denoised
            </button>
            <button
              onClick={() => setFilterMode('binarized')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterMode === 'binarized' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Otsu Binarization OCR Threshold"
            >
              Binarized
            </button>
            <button
              onClick={() => setFilterMode('negative')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterMode === 'negative' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Inverted Spectrum"
            >
              Negative
            </button>
          </div>

          {/* Toggle Bounding Boxes Button */}
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              showBoundingBoxes 
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/50' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={showBoundingBoxes ? 'Hide OCR bounding boxes' : 'Show OCR bounding boxes'}
          >
            {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-md border border-slate-700/60 p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-300 hover:text-white rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-300 hover:text-white rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 text-slate-300 hover:text-white rounded"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. DOCUMENT VIEWPORT CANVAS */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto bg-[#070A0F] p-4 sm:p-8 flex items-center justify-center min-h-[520px]"
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative my-auto"
        >
          {/* Laser Scanning Animation Beam */}
          {isScanning && (
            <div 
              className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-cyan-400/50 to-emerald-400/70 border-b-2 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.9)] pointer-events-none z-40 animate-pulse"
              style={{
                top: '35%',
                animation: 'scanMotion 2.5s ease-in-out infinite alternate',
              }}
            />
          )}

          {/* ============================================================== */}
          {/* DOCUMENT 1: REALISTIC HISTORICAL APNI LAW LAND RECORD (1921) */}
          {/* Exactly matching user's uploaded Image 2 & Image 3           */}
          {/* ============================================================== */}
          {activeDocType === 'apnilaw_real' && (
            <div 
              className={`w-[820px] min-h-[580px] bg-[#d5c6aa] text-stone-900 shadow-2xl relative select-none transition-all overflow-hidden border border-amber-950/40 rounded-xs ${getFilterStyle()}`}
              style={{
                boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 100px -20px rgba(0,0,0,0.5)',
              }}
            >
              {/* Photorealistic Aged Paper Background Texture with natural vignetting, paper creases & coffee foxing */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 45% 40%, #e2d6be 0%, #d8caa7 40%, #c4b38d 85%, #ad9c75 100%)',
                }}
              />

              {/* Real Photographic Vintage Paper Fiber Texture Overlay */}
              <img
                src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1400&q=80"
                alt="Real Parchment Texture"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60 pointer-events-none"
              />

              {/* High-frequency subtle paper grain & fibers texture */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-45 mix-blend-multiply"
                style={{
                  backgroundImage: `radial-gradient(#8c6b45 0.75px, transparent 0.75px), radial-gradient(#6d4c28 1px, transparent 1px)`,
                  backgroundSize: '24px 24px, 32px 32px',
                  backgroundPosition: '0 0, 12px 12px'
                }}
              />

              {/* Natural paper crease and tea-stain aging layers */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-color-burn"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(139,69,19,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(101,67,33,0.5) 0%, transparent 70%)'
                }}
              />

              {/* Ragged, Torn, Fibrous Left Margin Effect (matching the real torn register page) */}
              <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-20">
                <svg viewBox="0 0 40 600" preserveAspectRatio="none" className="w-full h-full">
                  <path 
                    d="M0,0 L18,0 Q24,15 15,35 Q6,55 22,75 Q32,95 12,120 Q5,145 28,175 Q35,195 14,225 Q8,255 26,285 Q33,315 12,345 Q4,375 25,405 Q34,435 15,465 Q7,495 24,525 Q32,555 16,585 L0,600 Z" 
                    fill="#070A0F" 
                  />
                  {/* Dark shadow along the torn edge */}
                  <path 
                    d="M18,0 Q24,15 15,35 Q6,55 22,75 Q32,95 12,120 Q5,145 28,175 Q35,195 14,225 Q8,255 26,285 Q33,315 12,345 Q4,375 25,405 Q34,435 15,465 Q7,495 24,525 Q32,555 16,585" 
                    fill="none" 
                    stroke="rgba(40,25,10,0.5)" 
                    strokeWidth="3" 
                  />
                </svg>
              </div>

              {/* Document Header: "CITY OF ..." in vintage serif block stamp text */}
              <div className="pt-3 pl-10 pr-6 pb-2 border-b-2 border-stone-800/80 flex items-center justify-between text-stone-900">
                <div className="text-sm font-serif font-black tracking-widest uppercase opacity-90">
                  CITY OF BILASPUR &bull; RECORD OF RIGHTS &amp; MUTATIONS
                </div>
                <div className="text-[10px] font-mono text-stone-800/70 italic">
                  REGISTER NO. 14 &bull; FOLIO 82
                </div>
              </div>

              {/* The Exact 6 Columns from User's Image: Cols 8 to 13 */}
              <div className="relative pl-7 pr-3 min-h-[480px]">
                {/* Horizontal Ruled Faint Ledger Guidelines (like genuine register paper) */}
                <div className="absolute inset-0 pl-7 pr-3 pointer-events-none opacity-25">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      className="border-b border-stone-700 w-full" 
                      style={{ height: '31px' }} 
                    />
                  ))}
                </div>

                {/* Table Header: Column Numbers & Titles */}
                <div className="grid grid-cols-12 border-b-2 border-stone-800 text-[9.5px] font-serif text-stone-950 divide-x-2 divide-stone-800 bg-amber-950/5">
                  {/* Col 8: Nature and origin of title */}
                  <div className="col-span-2 p-1.5 leading-snug">
                    <div className="text-[8px] font-sans text-stone-600 block">Nature and origin of title.</div>
                    <div className="text-center font-bold text-[10px] mt-0.5">8</div>
                  </div>

                  {/* Col 9: Name of lessee and details of title */}
                  <div className="col-span-2 p-1.5 leading-snug">
                    <div className="text-[8px] font-sans text-stone-600 block">Name of lessee and details of title.</div>
                    <div className="text-center font-bold text-[10px] mt-0.5">9</div>
                  </div>

                  {/* Col 10: Mortgagees with possession and details of title */}
                  <div className="col-span-2 p-1.5 leading-snug">
                    <div className="text-[8px] font-sans text-stone-600 block">Mortgagees with possession and details of title.</div>
                    <div className="text-center font-bold text-[10px] mt-0.5">10</div>
                  </div>

                  {/* Col 11: Other rights */}
                  <div className="col-span-2 p-1.5 leading-snug">
                    <div className="text-[8px] font-sans text-stone-600 block">Other rights.</div>
                    <div className="text-center font-bold text-[10px] mt-0.5">11</div>
                  </div>

                  {/* Col 12: Date of mutation and reference to authority */}
                  <div className="col-span-2 p-1.5 leading-snug">
                    <div className="text-[8px] font-sans text-stone-600 block">Date of mutation and reference to authority.</div>
                    <div className="text-center font-bold text-[10px] mt-0.5">12</div>
                  </div>

                  {/* Col 13: Remarks */}
                  <div className="col-span-2 p-1.5 leading-snug">
                    <div className="text-[8px] font-sans text-stone-600 block">Remarks.</div>
                    <div className="text-center font-bold text-[10px] mt-0.5">13</div>
                  </div>
                </div>

                {/* Table Body: Authentic Fountain-Pen Cursive Ink Entries (Exact Replica from Image) */}
                <div className="grid grid-cols-12 divide-x-2 divide-stone-800 min-h-[420px] text-stone-900 relative">
                  {/* ================= COLUMN 8: Nature & Origin ================= */}
                  <div className="col-span-2 p-2 relative">
                    {/* Handwritten Entry: By Purchase */}
                    <div 
                      className="font-serif text-lg font-bold text-[#1e1710] tracking-tight transform rotate-[-3deg] select-text"
                      style={{ 
                        fontFamily: "'Caveat', 'Beth Ellen', cursive",
                        filter: 'drop-shadow(0.5px 0.5px 0px rgba(30,20,10,0.4))'
                      }}
                    >
                      By Purchase
                    </div>

                    {/* Handwritten Entry: Thamma's share purchased by Doulatram */}
                    <div 
                      className="mt-6 text-base font-bold text-[#2a1e12] leading-tight transform rotate-[-1deg] select-text"
                      style={{ 
                        fontFamily: "'Caveat', cursive",
                        lineHeight: '1.25'
                      }}
                    >
                      Thamma's share purchased by Doulatram for Rs. 1500/-
                    </div>
                  </div>

                  {/* ================= COLUMN 9: Name of Lessee ================= */}
                  <div className="col-span-2 p-2 relative">
                    <div 
                      className="text-base font-bold text-[#261d15] mt-10 transform rotate-[-2deg] select-text"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Doulatram s/o Thamma
                      <div className="text-xs text-stone-700/80 font-mono mt-1 font-semibold">
                        Pattadar Sole Rights
                      </div>
                    </div>
                  </div>

                  {/* ================= COLUMN 10: Mortgagees ================= */}
                  <div className="col-span-2 p-2 relative">
                    <div 
                      className="text-xs font-mono text-stone-750/70 mt-12 italic"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Nil with possession
                    </div>
                  </div>

                  {/* ================= COLUMN 11: Other Rights ================= */}
                  <div className="col-span-2 p-1.5 relative text-xs leading-snug">
                    {/* Handwritten Record 1 */}
                    <div 
                      className="text-[13px] font-bold text-[#201812] transform rotate-[-1deg] select-text"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      S.No. C.No. 983 / 984 + 756
                      <div className="text-[12px] text-[#2c1d10] font-semibold mt-0.5">
                        Mort. P for Rs. 4,000/- with Sukraj Ramatmal
                      </div>
                    </div>

                    {/* Handwritten Record 2 */}
                    <div 
                      className="mt-8 text-[13px] text-[#2b2016] transform rotate-[-1deg] select-text"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Rs 325.00 with Roshan Lal &amp; Chaddaram
                    </div>

                    {/* Handwritten Record 3 */}
                    <div 
                      className="mt-8 text-[12px] text-[#251b12] transform rotate-[-1.5deg] select-text"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      - Do - with Kishenchand Khemchand
                    </div>
                  </div>

                  {/* ================= COLUMN 12: Mutation Dates & Reference ================= */}
                  <div className="col-span-2 p-1.5 relative text-xs leading-snug">
                    {/* Entry 1 */}
                    <div 
                      className="text-sm font-bold text-[#1f1710] transform rotate-[-1deg] select-text"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      <span className="text-base text-stone-950 font-black">15.8.21</span>
                      <div className="text-xs font-mono font-bold text-stone-900 mt-0.5">
                        D.R.No: 422 of 26 4/25
                      </div>
                    </div>

                    {/* Entry 2 */}
                    <div 
                      className="mt-6 text-sm font-bold text-[#221a13] transform rotate-[-1deg] select-text"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      <span className="text-base text-stone-950 font-black">13.4.31</span>
                      <div className="text-xs font-mono font-bold text-stone-900 mt-0.5">
                        D.R.No: 121 of 9 2/31
                      </div>
                    </div>

                    {/* Entry 3 */}
                    <div 
                      className="mt-6 text-xs text-[#201812] transform rotate-[-2deg] select-text"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      <div className="font-bold text-sm">5 5/32</div>
                      <div className="font-mono text-[11px]">D.R.No 1157 of 21 5/31</div>
                    </div>

                    {/* Entry 4 */}
                    <div 
                      className="mt-4 text-xs font-bold font-mono text-[#251a11]"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      12 2/33
                    </div>
                  </div>

                  {/* ================= COLUMN 13: Remarks ================= */}
                  <div className="col-span-2 p-2 relative">
                    {/* Shorthand ink registration flourish */}
                    <div 
                      className="text-lg font-serif text-[#1e1710] transform rotate-[-6deg] select-text mt-2 opacity-85"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      درج شد
                    </div>
                    <div 
                      className="text-xs text-stone-800 mt-4 transform rotate-[-3deg]"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      Attested &amp; Verified by Revenue Officer
                    </div>
                  </div>
                </div>

                {/* WATERMARK BADGE: APNI LAW (Matching Screenshot Exactly) */}
                <div className="absolute bottom-2 right-2 z-30 bg-white/95 px-3 py-1.5 rounded-sm shadow-md border border-slate-300 flex items-center gap-2 select-none">
                  {/* Balance / Scales of Justice Icon */}
                  <Scale className="w-5 h-5 text-slate-800 shrink-0" />
                  <div className="leading-tight">
                    <span className="text-xs font-extrabold tracking-widest text-slate-950 block">
                      APNI LAW
                    </span>
                    <span className="text-[8px] text-slate-500 font-sans tracking-tight block">
                      www.ApniLaw.com
                    </span>
                  </div>
                </div>

                {/* OVERLAY OCR BOUNDING BOXES (Tightly fitting the actual handwritten entries) */}
                {showBoundingBoxes && (
                  <div className="absolute inset-0 pointer-events-none pl-7 pr-3">
                    {/* 1. Owner Name Box over "Thamma's share purchased by Doulatram" */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); onSelectField('owner_name'); }}
                      className={`absolute pointer-events-auto cursor-pointer rounded-xs border-2 transition-all ${
                        selectedFieldKey === 'owner_name' 
                          ? 'border-indigo-600 bg-indigo-500/25 ring-2 ring-indigo-400' 
                          : 'border-emerald-500/90 bg-emerald-500/10 hover:bg-emerald-500/20'
                      }`}
                      style={{ left: '32px', top: '92px', width: '135px', height: '68px' }}
                    >
                      <span className="absolute -top-4 left-0 bg-emerald-700 text-white font-mono text-[9px] font-bold px-1 rounded shadow-2xs whitespace-nowrap">
                        89% conf &bull; Owner Name
                      </span>
                    </div>

                    {/* 2. Nature of Title Box over "By Purchase" */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); onSelectField('transaction_type'); }}
                      className={`absolute pointer-events-auto cursor-pointer rounded-xs border-2 transition-all ${
                        selectedFieldKey === 'transaction_type' 
                          ? 'border-indigo-600 bg-indigo-500/25 ring-2 ring-indigo-400' 
                          : 'border-emerald-500/90 bg-emerald-500/10 hover:bg-emerald-500/20'
                      }`}
                      style={{ left: '32px', top: '48px', width: '125px', height: '34px' }}
                    >
                      <span className="absolute -top-4 left-0 bg-emerald-700 text-white font-mono text-[9px] font-bold px-1 rounded shadow-2xs whitespace-nowrap">
                        96% conf &bull; By Purchase
                      </span>
                    </div>

                    {/* 3. Khasra / Survey Number Box over "S.No. C.No. 983 / 984" */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); onSelectField('khasra_number'); }}
                      className={`absolute pointer-events-auto cursor-pointer rounded-xs border-2 transition-all ${
                        selectedFieldKey === 'khasra_number' 
                          ? 'border-indigo-600 bg-indigo-500/25 ring-2 ring-indigo-400' 
                          : 'border-blue-500/90 bg-blue-500/15 hover:bg-blue-500/25'
                      }`}
                      style={{ left: '425px', top: '46px', width: '130px', height: '38px' }}
                    >
                      <span className="absolute -top-4 left-0 bg-blue-700 text-white font-mono text-[9px] font-bold px-1 rounded shadow-2xs whitespace-nowrap">
                        94% conf &bull; Survey #983/984
                      </span>
                    </div>

                    {/* 4. Mutation Date Box over "15.8.21 / D.R.No: 422" */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); onSelectField('mutation_date'); }}
                      className={`absolute pointer-events-auto cursor-pointer rounded-xs border-2 transition-all ${
                        selectedFieldKey === 'mutation_date' 
                          ? 'border-indigo-600 bg-indigo-500/25 ring-2 ring-indigo-400' 
                          : 'border-emerald-500/90 bg-emerald-500/10 hover:bg-emerald-500/20'
                      }`}
                      style={{ left: '560px', top: '46px', width: '125px', height: '44px' }}
                    >
                      <span className="absolute -top-4 left-0 bg-emerald-700 text-white font-mono text-[9px] font-bold px-1 rounded shadow-2xs whitespace-nowrap">
                        97% conf &bull; Date 15.8.21
                      </span>
                    </div>

                    {/* 5. Mortgage Encumbrance Box (Low Conf / Flagged) over "Mort. P for Rs. 4,000" */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); onSelectField('encumbrance_status'); }}
                      className={`absolute pointer-events-auto cursor-pointer rounded-xs border-2 transition-all ${
                        selectedFieldKey === 'encumbrance_status' 
                          ? 'border-indigo-600 bg-indigo-500/25 ring-2 ring-indigo-400' 
                          : 'border-amber-500/90 bg-amber-500/15 hover:bg-amber-500/25 animate-pulse'
                      }`}
                      style={{ left: '425px', top: '88px', width: '130px', height: '38px' }}
                    >
                      <span className="absolute -top-4 left-0 bg-amber-700 text-white font-mono text-[9px] font-bold px-1 rounded shadow-2xs whitespace-nowrap">
                        72% conf &bull; Mortgage Flag
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* DOCUMENT 2: AUTHENTIC ARCHIVAL SCANNED JAMABANDI 1984 (UP)   */}
          {/* ============================================================== */}
          {activeDocType === 'jamabandi' && (
            <div className={`w-[720px] min-h-[880px] bg-[#fbf5e6] text-slate-900 border-2 border-[#d6c3a5] rounded-xs shadow-2xl relative p-8 select-none transition-all ${getFilterStyle()}`}>
              {/* Aged Parchment Background Textures, Foxing Spots & Watermarks */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: `radial-gradient(#8c6239 1px, transparent 1px), radial-gradient(#b89770 1.5px, transparent 1.5px)`,
                  backgroundSize: '36px 36px, 48px 48px',
                  backgroundPosition: '0 0, 18px 18px'
                }}
              />
              <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-amber-950/20 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-amber-950/20 to-transparent pointer-events-none" />
              
              {/* Official Purple Revenue Rubber Stamp Seal */}
              <div className="absolute top-7 right-8 w-24 h-24 rounded-full border-2 border-indigo-900/70 p-1 flex flex-col items-center justify-center text-center text-indigo-950 transform rotate-[-12deg] select-none pointer-events-none shadow-2xs bg-indigo-500/5">
                <span className="text-[7.5px] font-bold uppercase tracking-wider">तहसीलदार कार्यालय</span>
                <span className="text-[6.5px] my-0.5">★ बिलासपुर ★</span>
                <span className="text-[8px] font-extrabold text-indigo-900 border-y border-indigo-900/40 px-1">रजिस्ट्री १९८४</span>
                <span className="text-[6px] mt-0.5">जिला रामपुर (उ०प्र०)</span>
              </div>

              {/* Document Header */}
              <div className="text-center pt-2 pb-4 border-b-2 border-amber-950/70 relative">
                <p className="text-[11px] font-serif font-bold text-amber-950 tracking-wider">
                  उत्तर प्रदेश शासन &bull; राजस्व परिषद (Board of Revenue, U.P.)
                </p>
                <h1 className="text-2xl font-serif font-extrabold text-amber-950 tracking-tight mt-1">
                  जमाबंदी / खतौनी रजिस्टर (Form RoR-1)
                </h1>
                <p className="text-[12px] font-serif text-stone-800 italic mt-0.5">
                  अधिकार अभिलेख (Record of Rights under Land Revenue Act) &mdash; फसली वर्ष १४०२
                </p>

                {/* Village / Tehsil / District Details Row */}
                <div className="grid grid-cols-3 mt-4 pt-3 border-t border-amber-900/40 text-left text-xs font-serif text-stone-900">
                  <div>
                    <span className="text-stone-600 font-sans text-[11px]">ग्राम / मौजा: </span>
                    <span className="font-bold underline">रामपुर खुर्द</span>
                  </div>
                  <div>
                    <span className="text-stone-600 font-sans text-[11px]">तहसील: </span>
                    <span className="font-bold underline">बिलासपुर</span>
                  </div>
                  <div>
                    <span className="text-stone-600 font-sans text-[11px]">ज़िला: </span>
                    <span className="font-bold underline">रामपुर</span>
                  </div>
                </div>
              </div>

              {/* Khata & Khasra Grid */}
              <div className="grid grid-cols-3 gap-3 bg-[#f5ecda] p-3.5 rounded-xs border-2 border-amber-950/30 my-4 text-xs font-serif">
                <div>
                  <span className="block text-[11px] font-sans font-medium text-stone-700">खाता / खतौनी संख्या:</span>
                  <span className="text-base font-bold font-mono text-stone-950">00184</span>
                </div>
                <div>
                  <span className="block text-[11px] font-sans font-medium text-stone-700">खसरा / सर्वे संख्या:</span>
                  <span className="text-base font-bold font-mono text-amber-950">104/2</span>
                </div>
                <div>
                  <span className="block text-[11px] font-sans font-medium text-stone-700">कुल रकबा (हेक्टेयर):</span>
                  <span className="text-base font-bold font-mono text-emerald-950">1.4250 हे.</span>
                </div>
              </div>

              {/* Table */}
              <div className="border-2 border-amber-950/60 my-4 bg-[#fdf9ef]">
                <div className="grid grid-cols-12 bg-[#ede1cb] border-b-2 border-amber-950/60 text-[11px] font-bold text-amber-950 text-center py-2 font-serif divide-x divide-amber-950/40">
                  <div className="col-span-5 px-2">खातेदार का नाम व वल्दियत</div>
                  <div className="col-span-3 px-2">हिस्सा (Share)</div>
                  <div className="col-span-4 px-2">भूमि श्रेणी (Classification)</div>
                </div>

                <div className="grid grid-cols-12 text-xs font-serif divide-x divide-amber-950/40 min-h-[90px] items-stretch">
                  <div className="col-span-5 p-3 space-y-1">
                    <p className="font-bold text-sm text-stone-950 font-serif">रामेश्वर दयाल सिंह</p>
                    <p className="text-stone-700 text-xs">वल्द: <span className="font-semibold">स्व० बद्री प्रसाद सिंह</span></p>
                    <p className="text-stone-600 text-[11px]">निवास: साकिन देह</p>
                  </div>
                  <div className="col-span-3 p-3 flex flex-col justify-center text-center font-bold text-stone-900 font-mono text-sm">
                    पूर्ण १/१ (एकल)
                  </div>
                  <div className="col-span-4 p-3 flex flex-col justify-center text-stone-800 text-xs">
                    <span className="font-bold text-stone-950">कृषि भूमि (दोफसली नहरी)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* DOCUMENT 3: AUTHENTIC CADASTRAL AKS SHAJRA VILLAGE MAP SCAN   */}
          {/* ============================================================== */}
          {activeDocType === 'cadastral' && (
            <div className={`w-[720px] min-h-[640px] bg-[#f0e7d0] text-amber-950 border-4 border-amber-950/60 rounded-xs shadow-2xl relative p-6 select-none transition-all ${getFilterStyle()}`}>
              <div className="border-2 border-dashed border-amber-900/60 p-4 min-h-[580px] relative">
                <div className="flex items-center justify-between border-b-2 border-amber-900/40 pb-2 mb-4">
                  <div>
                    <h2 className="text-lg font-bold font-serif text-amber-950">
                      अक्स शजरा किस्तवार (Cadastral Village Parcel Survey Map)
                    </h2>
                    <p className="text-xs text-amber-900">
                      गाँव: शिवपुरी खुर्द &bull; पैमाना: १६ इंच = १ मील
                    </p>
                  </div>
                  <div className="w-10 h-10 border border-amber-900/40 rounded-full flex flex-col items-center justify-center font-bold text-xs">
                    <span className="text-[10px] text-red-800">▲ N</span>
                    <span className="text-[7px]">उत्तर</span>
                  </div>
                </div>

                <div className="relative w-full h-[460px] bg-[#faf3e3] border-2 border-amber-900/50 rounded overflow-hidden">
                  <svg viewBox="0 0 500 450" className="w-full h-full">
                    <path d="M 0,220 Q 200,240 500,210" fill="none" stroke="#3b82f6" strokeWidth="8" strokeOpacity="0.4" />
                    <polygon points="180,30 360,45 340,165 160,150" fill="#dcfce7" stroke="#15803d" strokeWidth="2.5" />
                    <text x="240" y="100" fontSize="15" fontWeight="bold" fill="#14532d">१०४/२</text>
                    <polygon points="150,260 330,245 350,380 170,400" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
                    <text x="235" y="325" fontSize="17" fontWeight="bold" fill="#854d0e">१०८</text>
                    <text x="220" y="348" fontSize="10" fill="#a16207" fontWeight="bold">रामेश्वर दयाल</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* DOCUMENT 4: USER'S OWN UPLOADED REAL SCANNED DOCUMENT IMAGE    */}
          {/* ============================================================== */}
          {activeDocType === 'custom' && customDocUrl && (
            <div className={`relative max-w-[850px] shadow-2xl rounded-xs overflow-hidden border-2 border-slate-300 bg-white transition-all ${getFilterStyle()}`}>
              <img 
                src={customDocUrl} 
                alt="Uploaded Real Land Document"
                className="w-full h-auto object-contain select-none pointer-events-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM AUDIT & TELEMETRY BAR */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>High Confidence (&ge;90%)</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Review Flag (&lt;80%)</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Format: 300 DPI Archival Scan</span>
          <span>&bull;</span>
          <span>Engine: Tesseract 5 + TrOCR Indic</span>
        </div>
      </div>
    </div>
  );
};
