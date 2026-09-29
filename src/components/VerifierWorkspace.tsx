import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  FileCheck, 
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Info
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';
import { DocumentViewer } from './DocumentViewer';

interface VerifierWorkspaceProps {
  records: LandRecord[];
  activeRecordId: string;
  onSelectRecord: (id: string) => void;
  onUpdateRecord: (updated: LandRecord) => void;
  onAddRetrainingLog: (log: any) => void;
  onSwitchToMap: () => void;
}

export const VerifierWorkspace: React.FC<VerifierWorkspaceProps> = ({
  records,
  activeRecordId,
  onSelectRecord,
  onUpdateRecord,
  onAddRetrainingLog,
  onSwitchToMap,
}) => {
  const currentRecord = records.find((r) => r.id === activeRecordId) || records[0];
  const [selectedFieldKey, setSelectedFieldKey] = useState<string | null>('khasra_number');
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const getFieldValue = (fieldKey: string, fallback: string) => {
    if (editValues[fieldKey] !== undefined) return editValues[fieldKey];
    const field = currentRecord.fields.find((f) => f.key === fieldKey);
    return field?.correctedValue || field?.extractedValue || fallback;
  };

  const handleFieldChange = (fieldKey: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleSaveCorrection = () => {
    const updatedFields = currentRecord.fields.map((field) => {
      if (editValues[field.key] !== undefined) {
        return {
          ...field,
          correctedValue: editValues[field.key],
          isCorrected: true,
          confidence: 100,
          hasWarning: false,
        };
      }
      return field;
    });

    const updatedRecord: LandRecord = {
      ...currentRecord,
      fields: updatedFields,
    };

    onUpdateRecord(updatedRecord);

    // Save correction to retraining log
    Object.keys(editValues).forEach((key) => {
      const oldField = currentRecord.fields.find((f) => f.key === key);
      if (oldField) {
        onAddRetrainingLog({
          id: `RET-${Date.now().toString().slice(-4)}`,
          fieldKey: key,
          language: currentRecord.language === 'mr' ? 'Marathi' : 'Hindi',
          script: currentRecord.scriptType,
          originalExtracted: `${oldField.extractedValue} (${oldField.confidence}% conf)`,
          correctedValue: editValues[key],
          verifier: 'Staff Verifier',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: 'queued_for_training',
        });
      }
    });

    setSuccessBanner('Changes saved successfully. The correction has been added to the AI model retraining dataset.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleApproveRecord = () => {
    const updated: LandRecord = {
      ...currentRecord,
      status: 'verified_by_operator',
      verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    onUpdateRecord(updated);
    setSuccessBanner(`Record #${currentRecord.fileNumber} has been verified and forwarded to the Revenue Officer queue.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const ownerField = currentRecord.fields.find((f) => f.key === 'owner_name');
  const surveyField = currentRecord.fields.find((f) => f.key === 'khasra_number');
  const khatauniField = currentRecord.fields.find((f) => f.key === 'khatauni_number');
  const areaField = currentRecord.fields.find((f) => f.key === 'plot_area');
  const tehsilField = currentRecord.fields.find((f) => f.key === 'tehsil');
  const fatherField = currentRecord.fields.find((f) => f.key === 'father_spouse_name');

  const currentIndex = records.findIndex((r) => r.id === currentRecord.id);

  return (
    <div className="space-y-6">
      {/* Top Description Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Review &amp; Verify Records
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Compare the original scanned document on the left with the extracted text on the right. Edit any values before approval.
            </p>
          </div>

          {/* Record Selector & Progress */}
          <div className="flex items-center gap-3">
            <select
              value={currentRecord.id}
              onChange={(e) => onSelectRecord(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-1 focus:ring-emerald-500"
            >
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fileNumber} &bull; {r.village} ({r.overallConfidence}% match)
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={() => currentIndex > 0 && onSelectRecord(records[currentIndex - 1].id)}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                title="Previous record"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => currentIndex < records.length - 1 && onSelectRecord(records[currentIndex + 1].id)}
                disabled={currentIndex === records.length - 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                title="Next record"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </span>
          <button onClick={() => setSuccessBanner(null)} className="text-xs font-semibold text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dual View: Scan (Left) vs Input Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Original Scanned Record */}
        <div className="lg:col-span-7 flex flex-col h-[580px] lg:h-auto">
          <DocumentViewer
            record={currentRecord}
            selectedFieldKey={selectedFieldKey}
            onSelectField={(key) => setSelectedFieldKey(key)}
            isScanning={false}
          />
        </div>

        {/* Right: Clean Edit Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Extracted Record Fields
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any field to highlight its location on the original deed
              </p>
            </div>

            {/* Field: Landowner Name */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">Landowner Name</label>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {ownerField?.confidence ?? 92}% match
                </span>
              </div>
              <input
                type="text"
                value={getFieldValue('owner_name', ownerField?.extractedValue || '')}
                onChange={(e) => handleFieldChange('owner_name', e.target.value)}
                onClick={() => setSelectedFieldKey('owner_name')}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Standardized: {ownerField?.standardizedValue}
              </span>
            </div>

            {/* Field: Father's Name (Flagged) */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Father / Spouse Name</span>
                </label>
                <span className="text-xs font-mono font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {fatherField?.confidence ?? 68}% (Please verify)
                </span>
              </div>
              <input
                type="text"
                value={getFieldValue('father_spouse_name', fatherField?.extractedValue || '')}
                onChange={(e) => handleFieldChange('father_spouse_name', e.target.value)}
                onClick={() => setSelectedFieldKey('father_spouse_name')}
                className="w-full text-xs font-mono px-3 py-2 border border-amber-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white font-medium"
              />
              <span className="text-xs text-amber-700 mt-1 block">
                Handwriting was unclear. Please check against the scan.
              </span>
            </div>

            {/* Field: Survey / Khasra No. */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">Survey / Plot Number</label>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {surveyField?.confidence ?? 94}% match
                </span>
              </div>
              <input
                type="text"
                value={getFieldValue('khasra_number', surveyField?.extractedValue || '')}
                onChange={(e) => handleFieldChange('khasra_number', e.target.value)}
                onClick={() => setSelectedFieldKey('khasra_number')}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            </div>

            {/* Field: Khatauni Account No. */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">Register Account Number</label>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {khatauniField?.confidence ?? 98}% match
                </span>
              </div>
              <input
                type="text"
                value={getFieldValue('khatauni_number', khatauniField?.extractedValue || '')}
                onChange={(e) => handleFieldChange('khatauni_number', e.target.value)}
                onClick={() => setSelectedFieldKey('khatauni_number')}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            </div>

            {/* Field: Area (Hectares) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-800">Total Plot Area</label>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {areaField?.confidence ?? 84}% match
                </span>
              </div>
              <input
                type="text"
                value={getFieldValue('plot_area', areaField?.extractedValue || '')}
                onChange={(e) => handleFieldChange('plot_area', e.target.value)}
                onClick={() => setSelectedFieldKey('plot_area')}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Action Buttons: Clear, accessible labels */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={handleSaveCorrection}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Corrections</span>
            </button>

            <button
              onClick={handleApproveRecord}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
