export type UserRole = 'verifier' | 'officer' | 'admin' | 'staff' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  displayRole: string;
  avatarUrl: string;
  department?: string;
}

export type RecordStatus = 
  | 'pending_processing'
  | 'auto_approved'
  | 'pending_verification'
  | 'verified_by_operator'
  | 'officer_approved'
  | 'spatial_discrepancy'
  | 'synced_dilrmp';

export type LanguageCode = 'hi' | 'mr' | 'en' | 'gu' | 'te';

export interface BoundingBox {
  id: string;
  fieldKey: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  confidence: number;
}

export interface ExtractedField {
  key: string;
  labelEnglish: string;
  labelIndic: string;
  extractedValue: string;
  standardizedValue: string;
  confidence: number; // 0 - 100
  isCorrected?: boolean;
  correctedValue?: string;
  boundingBoxId?: string;
  hasWarning?: boolean;
  warningMessage?: string;
}

export interface SpatialValidationResult {
  isMatched: boolean;
  rorStatedAreaHectares: number;
  cadastralSurveyAreaHectares: number;
  areaDeltaHectares: number;
  discrepancyPercentage: number;
  boundaryOverlapDetected: boolean;
  khasraParcelMatch: boolean;
  gisParcelId: string;
  surveyCoordinates: [number, number]; // lat, lng
  recommendation: 'Auto-Approve' | 'Manual Field Inspection' | 'Survey Re-demarcation';
}

export interface LandRecord {
  id: string;
  fileNumber: string;
  documentType: 'Jamabandi' | 'Khatauni' | '7/12 Extract' | 'RoR' | 'Cadastral Map';
  state: string;
  district: string;
  tehsil: string;
  village: string;
  language: LanguageCode;
  originalFileName: string;
  uploadedAt: string;
  processedAt?: string;
  verifiedAt?: string;
  status: RecordStatus;
  overallConfidence: number;
  scriptType: 'Printed' | 'Handwritten' | 'Mixed';
  fields: ExtractedField[];
  boundingBoxes: BoundingBox[];
  spatialValidation: SpatialValidationResult;
  assignedVerifier?: string;
  approvedByOfficer?: string;
  digitalSealHash?: string;
  dilrmpSyncTransactionId?: string;
  correctionHistory?: {
    fieldKey: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
    verifiedBy: string;
  }[];
}

export interface CadastralParcel {
  parcelId: string;
  khasraNumber: string;
  village: string;
  tehsil: string;
  district: string;
  polygonPoints: string; // SVG polygon points
  centerCoords: { x: number; y: number };
  areaHectares: number;
  areaAcres: number;
  ownerName: string;
  soilClassification: string;
  status: 'matched' | 'discrepancy' | 'disputed' | 'unverified';
  discrepancyDetail?: string;
  linkedRecordId?: string;
}
