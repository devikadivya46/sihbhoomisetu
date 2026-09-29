import React, { useState, useRef } from 'react';
import { 
  Play, 
  ArrowRight, 
  RefreshCw, 
  AlertTriangle,
  Upload,
  FileSearch,
  Check
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';

interface IngestionPipelineProps {
  onIngestComplete: (newRecord: LandRecord) => void;
  onOpenRecordInVerifier: (recordId: string) => void;
}

export const IngestionPipeline: React.FC<IngestionPipelineProps> = ({
  onIngestComplete,
  onOpenRecordInVerifier,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    type: 'apnilaw' | 'jamabandi' | 'saatbaara' | 'custom';
    size: string;
    village: string;
    district: string;
    format: string;
    previewUrl?: string;
  } | null>({
    name: '1921 Mutation Register.png',
    type: 'apnilaw',
    size: '8.4 MB',
    village: 'Sarul Farmlands',
    district: 'Nashik, Maharashtra',
    format: 'Historical Mutation Deed',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [hasExtracted, setHasExtracted] = useState(true);
  const [createdRecordId, setCreatedRecordId] = useState<string>('rec-up-001');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getExtractedFields = () => {
    if (!selectedFile) return [];

    if (selectedFile.type === 'apnilaw') {
      return [
        {
          fieldName: 'Landowner Name',
          extractedText: 'Doulatram s/o Thamma',
          confidence: 89,
          status: 'high',
          notes: 'Handwritten cursive entry in title column.',
        },
        {
          fieldName: 'Acquisition Type',
          extractedText: 'Purchased for Rs. 1,500/-',
          confidence: 96,
          status: 'high',
          notes: 'Standard purchase mutation.',
        },
        {
          fieldName: 'Survey / Plot Number',
          extractedText: 'Plot No. 983 / 984 + 756',
          confidence: 94,
          status: 'high',
          notes: 'Matched to cadastral sheet.',
        },
        {
          fieldName: 'Record Date',
          extractedText: '15 August 1921',
          confidence: 97,
          status: 'high',
          notes: 'Official registration date.',
        },
        {
          fieldName: 'Rights & Mortgages',
          extractedText: 'Mortgage of Rs. 4,000/- with Sukraj Ramatmal',
          confidence: 72,
          status: 'low',
          notes: 'Faded cursive script. Recommended for quick review.',
        },
      ];
    }

    if (selectedFile.type === 'saatbaara') {
      return [
        {
          fieldName: 'Landowner Name',
          extractedText: 'Tukaram Vithoba Jagtap',
          confidence: 97,
          status: 'high',
          notes: 'Digitized landholder extract.',
        },
        {
          fieldName: 'Survey / Gat Number',
          extractedText: 'Plot 108 / 1',
          confidence: 99,
          status: 'high',
          notes: 'Matches Sarul Gaothan sheet.',
        },
        {
          fieldName: 'Total Area',
          extractedText: '1.90 Hectares (4.69 Acres)',
          confidence: 92,
          status: 'high',
          notes: 'Area variance is 0.00% compared to map.',
        },
        {
          fieldName: 'Land Tenure',
          extractedText: 'Class-1 Occupant (Freehold)',
          confidence: 94,
          status: 'high',
          notes: 'Unrestricted agricultural land.',
        },
      ];
    }

    // Default Jamabandi
    return [
      {
        fieldName: 'Landowner Name',
        extractedText: 'Rameshwar Dayal Singh',
        confidence: 95,
        status: 'high',
        notes: 'Matches cadastral ownership registry.',
      },
      {
        fieldName: "Father's Name",
        extractedText: 'Late Badri Prasad Singh',
        confidence: 68,
        status: 'low',
        notes: 'Handwritten script. Please verify in review panel.',
      },
      {
        fieldName: 'Survey / Plot Number',
        extractedText: 'Plot 104/2',
        confidence: 96,
        status: 'high',
        notes: 'Matched to cadastral map polygon.',
      },
      {
        fieldName: 'Account Number',
        extractedText: '00184',
        confidence: 98,
        status: 'high',
        notes: 'Standard 5-digit account.',
      },
      {
        fieldName: 'Plot Area',
        extractedText: '1.42 Hectares (3.52 Acres)',
        confidence: 84,
        status: 'moderate',
        notes: 'Within 1% tolerance of mapped boundaries.',
      },
    ];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile({
        name: file.name,
        type: 'custom',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        village: 'Uploaded Record',
        district: 'Selected File',
        format: file.type || 'PDF / Image',
        previewUrl,
      });
      setHasExtracted(false);
    }
  };

  const handleSelectSample = (sampleType: 'apnilaw' | 'jamabandi' | 'saatbaara') => {
    setHasExtracted(false);
    if (sampleType === 'apnilaw') {
      setSelectedFile({
        name: '1921 Mutation Register.png',
        type: 'apnilaw',
        size: '8.4 MB',
        village: 'Sarul Farmlands',
        district: 'Nashik, Maharashtra',
        format: 'Historical Mutation Deed',
      });
    } else if (sampleType === 'saatbaara') {
      setSelectedFile({
        name: 'Maharashtra 7-12 Extract.pdf',
        type: 'saatbaara',
        size: '3.2 MB',
        village: 'Viholi Sector',
        district: 'Nashik, Maharashtra',
        format: 'Digital Land Extract',
      });
    } else {
      setSelectedFile({
        name: 'Village Land Register.pdf',
        type: 'jamabandi',
        size: '12.4 MB',
        village: 'Mauza Rampur',
        district: 'Shivpuri Region',
        format: 'Revenue Register',
      });
    }
  };

  const handleRunProcessing = () => {
    setIsProcessing(true);
    setProgressPercent(20);
    setProcessingStage('Enhancing scan quality...');

    setTimeout(() => {
      setProgressPercent(60);
      setProcessingStage('Reading text & numbers...');
      setTimeout(() => {
        setProgressPercent(90);
        setProcessingStage('Extracting fields...');
        setTimeout(() => {
          setProgressPercent(100);
          setIsProcessing(false);
          setHasExtracted(true);

          const currentFields = getExtractedFields();
          const conf = currentFields.length > 0
            ? Math.round(currentFields.reduce((acc, f) => acc + f.confidence, 0) / currentFields.length)
            : 92;

          const newId = `rec-ingested-${Date.now().toString().slice(-4)}`;
          const owner = currentFields.find(f => f.fieldName.toLowerCase().includes('owner') || f.fieldName.toLowerCase().includes('landowner'))?.extractedText || 'Doulatram s/o Thamma';
          const plot = currentFields.find(f => f.fieldName.toLowerCase().includes('survey') || f.fieldName.toLowerCase().includes('plot'))?.extractedText || '104/2';

          const newRecord: LandRecord = {
            id: newId,
            fileNumber: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
            village: selectedFile?.village || 'Sarul Farmlands',
            district: selectedFile?.district || 'Nashik',
            tehsil: 'Nashik',
            state: 'Maharashtra',
            documentType: selectedFile?.type === 'saatbaara' ? '7/12 Extract' : selectedFile?.type === 'jamabandi' ? 'Jamabandi' : 'RoR',
            language: selectedFile?.type === 'apnilaw' ? 'mr' : 'hi',
            scriptType: 'Handwritten',
            overallConfidence: conf,
            status: 'pending_verification',
            originalFileName: selectedFile?.name || 'Uploaded Document',
            uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
            fields: [
              {
                key: 'owner_name',
                labelEnglish: 'Landowner Name',
                labelIndic: 'काश्तकार / खातेदार नाव',
                extractedValue: owner,
                standardizedValue: owner.replace('s/o', '').trim(),
                confidence: 94,
                isCorrected: false,
                hasWarning: false,
              },
              {
                key: 'father_spouse_name',
                labelEnglish: 'Father / Spouse Name',
                labelIndic: 'पिता / पतीचे नाव',
                extractedValue: currentFields.find(f => f.fieldName.toLowerCase().includes('father'))?.extractedText || 'Thamma Ramatmal',
                standardizedValue: 'Thamma Ramatmal',
                confidence: 68,
                isCorrected: false,
                hasWarning: true,
              },
              {
                key: 'khasra_number',
                labelEnglish: 'Survey / Plot Number',
                labelIndic: 'खसरा / गट क्रमांक',
                extractedValue: plot,
                standardizedValue: plot,
                confidence: 96,
                isCorrected: false,
                hasWarning: false,
              },
              {
                key: 'khatauni_number',
                labelEnglish: 'Register Account Number',
                labelIndic: 'खाता / नोंद वही क्रमांक',
                extractedValue: '00184',
                standardizedValue: '00184',
                confidence: 98,
                isCorrected: false,
                hasWarning: false,
              },
              {
                key: 'plot_area',
                labelEnglish: 'Total Plot Area',
                labelIndic: 'क्षेत्रफळ (हेक्टर)',
                extractedValue: '1.42',
                standardizedValue: '1.42',
                confidence: 90,
                isCorrected: false,
                hasWarning: false,
              },
              {
                key: 'tehsil',
                labelEnglish: 'Tehsil',
                labelIndic: 'तहसील / तालुका',
                extractedValue: 'Nashik',
                standardizedValue: 'Nashik',
                confidence: 95,
                isCorrected: false,
                hasWarning: false,
              },
            ],
            boundingBoxes: [],
            spatialValidation: {
              isMatched: true,
              rorStatedAreaHectares: 1.42,
              cadastralSurveyAreaHectares: 1.416,
              areaDeltaHectares: -0.004,
              discrepancyPercentage: 0.28,
              boundaryOverlapDetected: false,
              khasraParcelMatch: true,
              gisParcelId: 'MH-NSK-SRL-104',
              surveyCoordinates: [19.9975, 73.7898],
              recommendation: 'Auto-Approve',
            },
          };

          onIngestComplete(newRecord);
          setCreatedRecordId(newId);
        }, 500);
      }, 600);
    }, 600);
  };

  const fields = getExtractedFields();
  const overallConf = fields.length > 0
    ? Math.round(fields.reduce((acc, f) => acc + f.confidence, 0) / fields.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Upload &amp; Extract Land Records
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Upload scanned deeds or choose a sample to automatically read owner names, plot numbers, and areas.
        </p>
      </div>

      {/* Main Grid: Upload Zone (Left) + Extraction Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File selection */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              1. Choose Document
            </h2>

            {/* Drag & Drop Area */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,.pdf,.tiff"
              onChange={handleFileUpload}
              className="hidden" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-6 text-center bg-slate-50/60 hover:bg-emerald-50/30 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse file
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, JPG, and PNG files
              </p>
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-600 block">
                Or pick a sample deed:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectSample('apnilaw')}
                  className={`text-left p-3 rounded-lg border text-xs transition-colors ${
                    selectedFile?.type === 'apnilaw'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Historical Mutation Deed (1921)</span>
                    <span className="text-xs text-slate-400">Parchment</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSample('saatbaara')}
                  className={`text-left p-3 rounded-lg border text-xs transition-colors ${
                    selectedFile?.type === 'saatbaara'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Land Extract (Maharashtra 7/12)</span>
                    <span className="text-xs text-slate-400">PDF Extract</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSample('jamabandi')}
                  className={`text-left p-3 rounded-lg border text-xs transition-colors ${
                    selectedFile?.type === 'jamabandi'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Village Land Register (Jamabandi)</span>
                    <span className="text-xs text-slate-400">Ledger</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunProcessing}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{processingStage}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Read Document &amp; Extract Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Extracted Fields */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs min-h-[460px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  2. Extracted Data
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted fields ready for verification
                </p>
              </div>

              {hasExtracted && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Overall Confidence: {overallConf}%</span>
                </div>
              )}
            </div>

            {/* Empty state */}
            {!hasExtracted && !isProcessing && (
              <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
                <FileSearch className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-700">No document extracted yet</p>
                <p className="text-xs text-slate-500 mt-1">Select a file and click "Read Document" to start.</p>
              </div>
            )}

            {/* Processing state */}
            {isProcessing && (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-900">{processingStage}</p>
                <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden mx-auto">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Populated fields */}
            {hasExtracted && !isProcessing && (
              <div className="space-y-2.5">
                {fields.map((field, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border transition-colors ${
                      field.status === 'low'
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        {field.status === 'low' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{field.fieldName}</span>
                      </span>
                      <span
                        className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
                          field.confidence >= 90
                            ? 'text-emerald-800 bg-emerald-100'
                            : field.confidence >= 80
                            ? 'text-blue-800 bg-blue-100'
                            : 'text-amber-800 bg-amber-100'
                        }`}
                      >
                        {field.confidence}% Match
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {field.extractedText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action to proceed to verification */}
          {hasExtracted && !isProcessing && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-5">
              <span className="text-xs text-slate-500">
                1 field flagged for quick review.
              </span>
              <button
                onClick={() => onOpenRecordInVerifier(createdRecordId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Open in Review Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
