export type UserRole = 'farmer' | 'government_partner' | 'researcher_organization';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  fullName: string;
  emailOrPhone: string;
  email?: string;
  phone?: string;
  role: UserRole;
  country: string;
  // Farmer specific
  farmSize?: string;
  // Government Partner specific
  agencyName?: string;
  department?: string;
  region?: string;
  // Researcher / Organization specific
  institutionName?: string;
  researchFocusArea?: string;
  position?: string;
  // Verification for Gov & Researcher
  verificationStatus?: VerificationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type AuthModalMode = 'login' | 'signup' | 'forgot_password' | 'pending_verification' | null;

export interface SignUpFormData {
  fullName: string;
  emailOrPhone: string;
  country: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  // Role specific
  farmSize: string;
  agencyName: string;
  department: string;
  region: string;
  institutionName: string;
  researchFocusArea: string;
  position: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
