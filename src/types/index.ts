export type NigerCity = 
  | 'Niamey'
  | 'Maradi'
  | 'Zinder'
  | 'Tahoua'
  | 'Agadez'
  | 'Dosso'
  | 'Tillabéri'
  | 'Diffa';

export type Gender = 'homme' | 'femme';
export type MaritalStatus = 'celibataire' | 'divorce' | 'veuf';
export type ProfileStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface PrivateContact {
  phone: string;
  whatsapp?: string;
  waliContact?: string; // Tuteur pour la femme ou contact familial
  neighborhood?: string;
}

export interface Profile {
  id: string;
  pseudonym: string; // Prénom / pseudo
  age: number;
  city: NigerCity;
  gender: Gender;
  maritalStatus: MaritalStatus;
  lookingFor: Gender;
  profession: string;
  education: string;
  religionPractice: string;
  presentation: string;
  criteria: string;
  photos: [string, string]; // 2 photos obligatoires
  status: ProfileStatus;
  submissionDate: string;
  isSuspicious?: boolean;
  suspiciousReason?: string;
  adminNotes?: string;
  contactInfo: PrivateContact; // Jamais affiché publiquement !
}

export type PaymentMethod = 'MyNita' | 'Amanata' | 'Autre';
export type RequestStatus = 'pending_proof' | 'proof_sent' | 'payment_verified' | 'contact_authorized' | 'rejected';

export interface ContactRequest {
  id: string;
  referenceCode: string; // e.g. NIK-227-1049
  targetProfileId: string;
  targetProfilePseudo: string;
  targetProfileCity: NigerCity;
  requesterPseudo: string;
  requesterPhone: string;
  requesterGender: Gender;
  paymentMethod: PaymentMethod;
  amountFCFA: number;
  paymentProofReference: string;
  proofNotes?: string;
  status: RequestStatus;
  createdAt: string;
  authorizedAt?: string;
  adminComment?: string;
}

export interface AdminStats {
  totalProfiles: number;
  pendingValidation: number;
  approvedActive: number;
  totalRequests: number;
  verifiedPayments: number;
  totalRevenueFCFA: number;
}

export const OFFICIAL_WHATSAPP_NUMBER = '+227 99 61 40 98';
export const OFFICIAL_WHATSAPP_RAW = '22799614098';
export const DEFAULT_CONTACT_FEE_FCFA = 3000;

export const NIGER_CITIES: NigerCity[] = [
  'Niamey',
  'Maradi',
  'Zinder',
  'Tahoua',
  'Agadez',
  'Dosso',
  'Tillabéri',
  'Diffa'
];
