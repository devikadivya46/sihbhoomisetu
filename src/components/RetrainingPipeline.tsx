import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Download,
  Play,
  Cpu
} from 'lucide-react';
import { RETRAINING_LOGS } from '../data/mockLandRecords';

interface RetrainingPipelineProps {
  logs: typeof RETRAINING_LOGS;
  onTriggerTraining: () => void;
}

export const RetrainingPipeline: React.FC<RetrainingPipelineProps> = ({
  logs,
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleStartFineTune = () => {
    setIsTraining(true);
    setTrainingProgress(20);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setSuccessBanner('AI model successfully updated with recent corrections.');
          setTimeout(() => setSuccessBanner(null), 4000);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleExportDataset = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Corrections_Dataset_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Learning &amp; Improvements
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              The AI learns from corrections made by staff to continuously improve reading accuracy on historical deeds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDataset}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Corrections</span>
            </button>

            <button
              onClick={handleStartFineTune}
              disabled={isTraining}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isTraining ? `Updating (${trainingProgress}%)...` : 'Update AI Model'}</span>
            </button>
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

      {/* Model Benchmark Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">
            Verification Accuracy
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-slate-900">89.4%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              +13.2%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Accuracy improvement after human verifications
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">
            Handwriting Reading
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-slate-900">86.7%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              +10.5%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Confidence on cursive handwriting
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">
            Map Boundary Matching
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-teal-700">96.4%</span>
            <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              +8.5%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Alignment between textual areas and GIS polygons
          </p>
        </div>
      </div>

      {/* Human Corrections Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Verifier Corrections ({logs.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Samples saved to train the next model update
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active Dataset
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs">
              <tr>
                <th className="py-3 px-4 font-semibold">Field</th>
                <th className="py-3 px-4 font-semibold">Language</th>
                <th className="py-3 px-4 font-semibold">Initial Machine Reading</th>
                <th className="py-3 px-4 font-semibold">Corrected Value</th>
                <th className="py-3 px-4 font-semibold">Verified By</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {log.fieldKey.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">{log.language}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-amber-900 bg-amber-50/50">
                    {log.originalExtracted}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-900 bg-emerald-50/50">
                    {log.correctedValue}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <span className="block font-medium">{log.verifier}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">
                      Learned
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
