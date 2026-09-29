import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  Printer, 
  Check, 
  Clock, 
  ShieldCheck,
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';

interface OfficerApprovalQueueProps {
  records: LandRecord[];
  onUpdateRecord: (updated: LandRecord) => void;
  onSelectRecordForInspection: (recordId: string) => void;
}

export const OfficerApprovalQueue: React.FC<OfficerApprovalQueueProps> = ({
  records,
  onUpdateRecord,
}) => {
  const [selectedCertificateRecord, setSelectedCertificateRecord] = useState<LandRecord | null>(null);
  const [signingRecordId, setSigningRecordId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [signedSuccessMsg, setSignedSuccessMsg] = useState<string | null>(null);

  const queueRecords = records.filter(
    (r) => r.status === 'verified_by_operator' || r.status === 'auto_approved' || r.status === 'officer_approved'
  );

  const handleSignAndApprove = (record: LandRecord) => {
    setSigningRecordId(record.id);

    setTimeout(() => {
      const updated: LandRecord = {
        ...record,
        status: 'officer_approved',
        approvedByOfficer: 'Rajesh Solanki (Tehsildar)',
        dilrmpSyncTransactionId: `SYNC-${record.state.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      };

      onUpdateRecord(updated);
      setSigningRecordId(null);
      setSignedSuccessMsg(`Record #${record.fileNumber} has been approved and signed.`);
      setTimeout(() => setSignedSuccessMsg(null), 3500);
    }, 600);
  };

  const handlePushAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      records
        .filter((r) => r.status === 'officer_approved')
        .forEach((r) => {
          onUpdateRecord({
            ...r,
            status: 'synced_dilrmp',
          });
        });
      setIsSyncing(false);
      setSignedSuccessMsg('All approved records have been synced.');
      setTimeout(() => setSignedSuccessMsg(null), 3500);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Officer Approvals
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Review verified land records and sign them off for official issuance.
            </p>
          </div>

          <button
            onClick={handlePushAll}
            disabled={isSyncing}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'Syncing...' : 'Sync All to National Portal'}</span>
          </button>
        </div>
      </div>

      {signedSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{signedSuccessMsg}</span>
          </span>
          <button onClick={() => setSignedSuccessMsg(null)} className="text-xs font-semibold text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Table of Records */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pending Approvals ({queueRecords.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Records verified by staff and cross-checked with maps
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            {records.filter((r) => r.status === 'officer_approved' || r.status === 'synced_dilrmp').length} Approved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs">
              <tr>
                <th className="py-3 px-4 font-semibold">File Number</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Owner &amp; Plot</th>
                <th className="py-3 px-4 font-semibold text-right">Area</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {queueRecords.map((record) => {
                const ownerField = record.fields.find((f) => f.key === 'owner_name');
                const khasraField = record.fields.find((f) => f.key === 'khasra_number');
                const areaField = record.fields.find((f) => f.key === 'plot_area');
                const isSigning = signingRecordId === record.id;
                const isApproved = record.status === 'officer_approved' || record.status === 'synced_dilrmp';

                return (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {record.fileNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {record.state}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">
                        {record.village}
                      </span>
                      <span className="text-xs text-slate-400">
                        {record.district}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {ownerField?.standardizedValue || ownerField?.extractedValue}
                      </span>
                      <span className="text-xs text-slate-500">
                        Plot #{khasraField?.extractedValue}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-900 font-medium">
                      {areaField?.extractedValue} Ha
                    </td>

                    <td className="py-3.5 px-4">
                      {isApproved ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1 text-xs">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Approved
                        </span>
                      ) : (
                        <span className="text-blue-700 flex items-center gap-1 text-xs">
                          <Clock className="w-4 h-4 text-blue-600" />
                          Ready for Approval
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isApproved ? (
                        <button
                          onClick={() => setSelectedCertificateRecord(record)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Record</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSignAndApprove(record)}
                          disabled={isSigning}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isSigning ? 'Signing...' : 'Approve'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {selectedCertificateRecord && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCertificateRecord(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedCertificateRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-sm font-semibold p-1 cursor-pointer"
            >
              ✕ Close
            </button>

            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Official Land Record
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Certificate of Land Ownership
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Record #{selectedCertificateRecord.fileNumber}
              </p>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Village &amp; District</span>
                <span className="font-semibold text-slate-900 text-xs">{selectedCertificateRecord.village}, {selectedCertificateRecord.district}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Landowner</span>
                <span className="font-semibold text-slate-900 text-xs">
                  {selectedCertificateRecord.fields.find(f => f.key === 'owner_name')?.extractedValue}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Plot / Survey Number</span>
                <span className="font-semibold text-slate-900 text-xs">
                  {selectedCertificateRecord.fields.find(f => f.key === 'khasra_number')?.extractedValue}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Area</span>
                <span className="font-semibold text-slate-900 text-xs">
                  {selectedCertificateRecord.fields.find(f => f.key === 'plot_area')?.extractedValue} Hectares
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 text-xs">Approved By</span>
                <span className="font-semibold text-emerald-800 text-xs">Rajesh Solanki (Tehsildar)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCertificateRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
