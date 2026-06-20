export enum UserRole {
  CITIZEN = "CITIZEN",
  OFFICIAL = "OFFICIAL",
  ADMIN = "ADMIN"
}

export enum AppLanguage {
  EN = "EN",
  HI = "HI",
  MW = "MW"
}

export enum CertificateType {
  DOMICILE = "DOMICILE",
  CASTE = "CASTE",
  INCOME = "INCOME",
  BIRTH = "BIRTH",
  WIDOW = "WIDOW",
  EWS = "EWS",
  BPL = "BPL",
  NOC = "NOC",
  RESIDENTIAL = "RESIDENTIAL"
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum GrievanceCategory {
  ROAD = "ROAD",
  WATER = "WATER",
  SANITATION = "SANITATION",
  ELECTRICITY = "ELECTRICITY",
  SCHOOL = "SCHOOL",
  OTHERS = "OTHERS"
}

export enum GrievanceStatus {
  SUBMITTED = "SUBMITTED",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED"
}

export enum EscalationLevel {
  PANCHAYAT = "PANCHAYAT",
  BLOCK = "BLOCK",
  DISTRICT = "DISTRICT"
}

export interface CertificateApplication {
  id: string;
  type: CertificateType;
  citizenName: string;
  citizenAadhaar: string;
  photoUrl?: string;
  docUrl?: string;
  status: ApplicationStatus;
  submissionDate: string;
  lastUpdated: string;
  remarks?: string;
  officerInCharge: string;
  slaDaysRemaining: number;
}

export interface GrievanceComplaint {
  id: string;
  category: GrievanceCategory;
  description: string;
  citizenName: string;
  phone: string;
  photoUrl?: string;
  latitude: number;
  longitude: number;
  status: GrievanceStatus;
  submissionDate: string;
  lastUpdated: string;
  wardId: number;
  officerAssigned: string;
  resolutionText?: string;
  escalationLevel: EscalationLevel;
  slaDaysRemaining: number;
}

export interface GramSabhaMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  attendanceCount: number;
  agenda: string;
  recordingsSimulated?: boolean;
  minutesTitle?: string;
  minutesSummaryEN?: string;
  minutesSummaryHI?: string;
  resolutions?: string[];
  attendees?: string[]; // Ward member names
}

export interface PanchayatAsset {
  id: string;
  name: string;
  type: "WELL" | "ROAD" | "SCHOOL" | "TOILET" | "STREETLIGHT" | "HEALTH_CENTRE";
  lat: number;
  lon: number;
  photoUrl?: string;
  status: "FUNCTIONAL" | "NEEDS_REPAIR" | "UNDER_CONSTRUCTION";
  wardId: number;
  lastChecked: string;
  verifiedBy: string;
}

export interface NREGAMusterWorker {
  id: string;
  name: string;
  jobCardId: string;
  attendanceDate: string;
  checkInTime?: string;
  status: "PRESENT" | "ABSENT" | "PENDING";
  selfieUrl?: string;
  lat?: number;
  lon?: number;
}

export interface FundAllocation {
  id: string;
  scheme: string; // e.g., "15th Finance Commission", "SWACHH BHARAT MISSION", "PM AWAS YOJANA"
  allocatedAmount: number;
  spentAmount: number;
  type: "INFRASTRUCTURE" | "WELFARE" | "ADMINISTRATION" | "WATER_SANITATION";
  title: string;
  description: string;
  financialYear: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface SyncQueueItem {
  id: string;
  type: "CERT_APPLICATION" | "GRIEVANCE_SUBMISSION" | "WORK_ATTENDANCE" | "ASSET_TAGGING" | "GRAM_SABHA_SCHEDULE";
  data: any;
  timestamp: string;
}
