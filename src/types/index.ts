export type Role = 
  | 'SUPER_ADMIN' 
  | 'DISTRICT_ADMIN' 
  | 'KENDRA_OWNER' 
  | 'OPERATOR' 
  | 'SUPERVISOR' 
  | 'CITIZEN';

export interface LocationHierarchy {
  stateId: string;
  stateName: string;
  districtId: string;
  districtName: string;
  localBodyId: string;
  localBodyName: string; // Municipality / Corporation / Block
  wardId: string;
  wardName: string;
}

export interface SevaKendra extends LocationHierarchy {
  id: string;
  code: string; // e.g. KOL-W27-SK001
  name: string;
  address: string;
  pin: string;
  ownerName: string;
  contactMobile: string;
  whatsAppNumber: string;
  email: string;
  openingHours: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  operatorsCount: number;
  isPublic: boolean;
  latitude?: number;
  longitude?: number;
}

export type SocialCategory = 'General' | 'SC' | 'ST' | 'OBC-A' | 'OBC-B';
export type Religion = 'Hinduism' | 'Islam' | 'Christianity' | 'Sikhism' | 'Buddhism' | 'Jainism' | 'Other';
export type RationCardType = 'AAY (Antyodaya)' | 'SPHH' | 'PHH' | 'RKSY-I' | 'RKSY-II' | 'None';
export type MaritalStatus = 'Single' | 'Married' | 'Widowed' | 'Divorced / Separated';
export type DisabilityStatus = 'None' | 'Yes (40%+ Divyangjan)';
export type LandHolding = 'None / Landless' | 'Marginal (< 1 Acre)' | 'Small (1 - 2.5 Acres)' | 'Large (> 2.5 Acres)';

export interface Citizen {
  id: string;
  citizenId: string; // CIT-2026-000184
  fullName: string;
  mobile: string;
  whatsApp: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  district: string;
  localBody: string;
  ward: string;
  pin: string;
  occupation: string;
  incomeRange: string;
  category?: SocialCategory;
  casteCertificateNo?: string;
  religion?: Religion;
  isMinority?: boolean;
  rationCardType?: RationCardType;
  rationCardNo?: string;
  maritalStatus?: MaritalStatus;
  disabilityStatus?: DisabilityStatus;
  disabilityCertNo?: string;
  landHolding?: LandHolding;
  bankName?: string;
  bankAccountLast4?: string;
  bankIfsc?: string;
  isDbtAadhaarLinked?: boolean;
  email?: string;
  aadhaarLast4?: string; // Strictly last 4 digits only
  photoUrl?: string;
  kendraId: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  nameBn: string;
  category: ServiceCategory;
  description: string;
  descriptionBn: string;
  eligibilitySummary: string;
  requiredDocs: string[];
  department: string;
  officialUrl: string;
  estimatedDays: number;
  govtFee: number;
  assistanceFee: number;
  active: boolean;
  lastVerifiedDate: string;
}

export type ServiceCategory = 
  | 'Government Schemes'
  | 'Certificates'
  | 'Health & Welfare'
  | 'Education & Youth'
  | 'Employment & Skill'
  | 'Agriculture & Farmers'
  | 'Senior Citizens'
  | 'Women & Child Development'
  | 'Housing & Land'
  | 'Digital & Utility Services'
  | 'Electoral Assistance'
  | 'Other Citizen Assistance';

export interface GovernmentScheme {
  id: string;
  schemeName: string;
  schemeNameBn: string;
  department: string;
  category: ServiceCategory;
  description: string;
  descriptionBn: string;
  eligibilityRules: {
    minAge?: number;
    maxAge?: number;
    gender?: 'Male' | 'Female' | 'Any';
    occupation?: string[];
    maxIncome?: number; // per annum in INR
    urbanRural?: 'Urban' | 'Rural' | 'Both';
    studentOnly?: boolean;
    farmerOnly?: boolean;
    seniorOnly?: boolean;
    femaleOnly?: boolean;
    categories?: SocialCategory[];
    religions?: Religion[];
    minorityOnly?: boolean;
    disabilityOnly?: boolean;
    widowOnly?: boolean;
    rationCardTypes?: RationCardType[];
  };
  benefits: string;
  requiredDocs: string[];
  applicationMethod: string;
  officialUrl: string;
  helpline: string;
  lastVerifiedDate: string;
  active: boolean;
}

export type ApplicationStatus = 
  | 'NEW'
  | 'DOCUMENTS_PENDING'
  | 'DOCUMENTS_RECEIVED'
  | 'READY_FOR_SUBMISSION'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_DOCUMENT_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ApplicationPriority = 'NORMAL' | 'HIGH' | 'URGENT';

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  docType: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  uploadDate: string;
  verificationStatus: 'REQUIRED' | 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED';
  verifiedBy?: string;
  verificationDate?: string;
  notes?: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  applicationId: string;
  timestamp: string;
  title: string;
  description: string;
  performedBy: string;
  status: ApplicationStatus;
}

export interface SevaApplication {
  id: string;
  sevaId: string; // SEVA-2026-000184
  citizenId: string;
  citizenName: string;
  citizenMobile: string;
  kendraId: string;
  kendraName: string;
  serviceId: string;
  serviceName: string;
  serviceNameBn?: string;
  assignedOperator: string;
  operatorId: string;
  priority: ApplicationPriority;
  status: ApplicationStatus;
  govtFee: number;
  assistanceFee: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  documents: ApplicationDocument[];
  timeline: ApplicationTimelineEvent[];
}

export interface QueueToken {
  id: string;
  tokenNumber: string; // TOKEN-047
  numberOnly: number;
  citizenName: string;
  citizenMobile: string;
  serviceName: string;
  kendraId: string;
  status: 'WAITING' | 'SERVING' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
  createdAt: string;
  counterNo?: number;
}

export type ActiveView = 
  | 'DASHBOARD'
  | 'CITIZENS'
  | 'SERVICES'
  | 'SCHEMES'
  | 'APPLICATIONS'
  | 'TOKEN_QUEUE'
  | 'APPOINTMENTS'
  | 'PAYMENTS'
  | 'NOTIFICATIONS'
  | 'KENDRAS'
  | 'PUBLIC_TRACK'
  | 'CITIZEN_MOBILE'
  | 'REPORTS'
  | 'ADMIN_USER_MANAGEMENT';

export interface AppointmentSlot {
  id: string;
  citizenName: string;
  citizenMobile: string;
  serviceName: string;
  kendraId: string;
  date?: string;
  timeSlot?: string;
  preferredDate?: string;
  preferredTime?: string;
  status: 'CONFIRMED' | 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt?: string;
}

export type Appointment = AppointmentSlot;

export interface WhatsAppNotification {
  id: string;
  citizenMobile: string;
  citizenName: string;
  sevaId: string;
  templateType: 'RECEIPT' | 'DOCS_REQUIRED' | 'COMPLETED' | 'TOKEN_CALL';
  messageText: string;
  status: 'SENT' | 'FAILED' | 'QUEUED';
  sentAt: string;
}


export interface PaymentRecord {
  id: string;
  applicationId: string;
  sevaId: string;
  citizenName: string;
  govtFee: number;
  assistanceFee: number;
  printingFee: number;
  scanningFee: number;
  total: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Other';
  paymentStatus: 'PAID' | 'REFUNDED';
  receiptNumber: string;
  kendraId: string;
  operatorName: string;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  recipientMobile: string;
  type: 'WHATSAPP' | 'SMS' | 'EMAIL';
  message: string;
  status: 'SENT' | 'FAILED' | 'QUEUED';
  sentAt: string;
  sevaId?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface FeedbackItem {
  id: string;
  applicationId: string;
  sevaId: string;
  citizenName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  kendraId?: string;
  districtId?: string;
  avatarUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string; // Email or username used for login
  email: string;
  mobile: string;
  password: string;
  role: Role;
  kendraId?: string;
  kendraName?: string;
  districtId?: string;
  districtName?: string;
  wardName?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}
