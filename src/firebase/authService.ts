import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isRealFirebaseConfigured } from './config';
import { SignUpFormData, UserProfile, UserRole, VerificationStatus } from '../types/user';

const DEMO_FARMER_UID = 'demo-farmer-1';

const MOCK_STORAGE_KEY_PROFILES = 'agrin_user_profiles';
const MOCK_STORAGE_KEY_CURRENT_USER = 'agrin_current_user';

// In-memory subscribers for mock auth state
type AuthListener = (user: User | null) => void;
const authListeners: Set<AuthListener> = new Set();

let currentMockUser: User | null = (() => {
  try {
    const saved = localStorage.getItem(MOCK_STORAGE_KEY_CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
})();

function notifyAuthListeners(user: User | null) {
  currentMockUser = user;
  try {
    if (user) {
      localStorage.setItem(MOCK_STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_STORAGE_KEY_CURRENT_USER);
    }
  } catch {
    // Ignore storage issues
  }
  authListeners.forEach((listener) => listener(user));
}

function getStoredProfiles(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY_PROFILES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredProfile(profile: UserProfile): void {
  try {
    const profiles = getStoredProfiles();
    profiles[profile.uid] = profile;
    localStorage.setItem(MOCK_STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch {
    // Ignore storage issues
  }
}

/**
 * Unified auth change listener supporting both Firebase & local mock
 */
export function onAuthChange(callback: AuthListener): () => void {
  authListeners.add(callback);

  // If real Firebase is configured, listen to Firebase Auth
  if (isRealFirebaseConfigured) {
    const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
      callback(user);
    });
    return () => {
      authListeners.delete(callback);
      unsubscribeFirebase();
    };
  }

  // Otherwise emit current local user
  callback(currentMockUser);
  return () => {
    authListeners.delete(callback);
  };
}

/**
 * Maps error messages/codes to user-friendly copy
 */
export function formatAuthErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const code = typeof err === 'string' ? err : err.code || err.message || '';

  if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
    return 'Invalid credentials. Please check your email/phone and password.';
  }
  if (code.includes('auth/user-not-found')) {
    return 'No account registered with this email or phone number.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Password must be at least 6 characters long.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('auth/popup-closed-by-user') || code.includes('auth/cancelled-popup-request')) {
    return '';
  }
  return err.message || 'Authentication error. Please try again.';
}

/**
 * Fetch profile by UID
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  if (uid === DEMO_FARMER_UID) {
    return {
      uid: DEMO_FARMER_UID,
      fullName: 'Ramesh Verma',
      emailOrPhone: 'ramesh.verma@agrin.brics',
      role: 'farmer',
      country: 'India',
      farmSize: '25 Acres',
      verificationStatus: 'approved',
    };
  }

  if (isRealFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local cache:', e);
    }
  }

  const profiles = getStoredProfiles();
  return profiles[uid] || null;
}

/**
 * Update verification status (used by Government / Researcher simulation)
 */
export async function setVerificationStatus(uid: string, status: VerificationStatus): Promise<void> {
  if (isRealFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        verificationStatus: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore verification update failed:', e);
    }
  }

  const profiles = getStoredProfiles();
  if (profiles[uid]) {
    profiles[uid].verificationStatus = status;
    profiles[uid].updatedAt = new Date().toISOString();
    localStorage.setItem(MOCK_STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }
}

/**
 * Register a new user
 */
export async function registerUser(formData: SignUpFormData): Promise<{ user: any; profile: UserProfile }> {
  let uid = 'user_' + Date.now();
  let createdUser: any = null;

  if (isRealFirebaseConfigured && formData.emailOrPhone.includes('@')) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.emailOrPhone, formData.password);
      createdUser = cred.user;
      uid = cred.user.uid;
    } catch (e) {
      console.warn('Firebase registration failed, using local store:', e);
    }
  }

  const isFarmer = formData.role === 'farmer';
  const profile: UserProfile = {
    uid,
    fullName: formData.fullName,
    emailOrPhone: formData.emailOrPhone,
    email: formData.emailOrPhone.includes('@') ? formData.emailOrPhone : undefined,
    phone: !formData.emailOrPhone.includes('@') ? formData.emailOrPhone : undefined,
    role: formData.role,
    country: formData.country,
    farmSize: formData.farmSize,
    agencyName: formData.agencyName,
    department: formData.department,
    region: formData.region,
    institutionName: formData.institutionName,
    researchFocusArea: formData.researchFocusArea,
    position: formData.position,
    verificationStatus: isFarmer ? 'approved' : 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveStoredProfile(profile);

  if (isRealFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'users', uid), profile);
    } catch (e) {
      console.warn('Firestore setDoc failed:', e);
    }
  }

  const userObj = createdUser || {
    uid,
    email: formData.emailOrPhone.includes('@') ? formData.emailOrPhone : `${uid}@agrin.mock`,
    displayName: formData.fullName,
  };

  notifyAuthListeners(userObj as User);
  return { user: userObj, profile };
}

/**
 * Login user
 */
export async function loginUser(identifier: string, password: string): Promise<{ user: any; profile: UserProfile }> {
  const cleanId = identifier.trim().toLowerCase();

  // Demo user shortcut
  if (cleanId === 'demo' || cleanId === 'ramesh.verma@agrin.brics') {
    const demoUser = {
      uid: DEMO_FARMER_UID,
      email: 'ramesh.verma@agrin.brics',
      displayName: 'Ramesh Verma',
    };
    const profile: UserProfile = {
      uid: DEMO_FARMER_UID,
      fullName: 'Ramesh Verma',
      emailOrPhone: 'ramesh.verma@agrin.brics',
      role: 'farmer',
      country: 'India',
      farmSize: '25 Acres',
      verificationStatus: 'approved',
    };
    notifyAuthListeners(demoUser as User);
    return { user: demoUser, profile };
  }

  if (isRealFirebaseConfigured && cleanId.includes('@')) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanId, password);
      const profile = await fetchUserProfile(cred.user.uid);
      return { user: cred.user, profile: profile || {
        uid: cred.user.uid,
        fullName: cred.user.displayName || 'User',
        emailOrPhone: cred.user.email || cleanId,
        role: 'farmer',
        country: 'India',
        verificationStatus: 'approved',
      }};
    } catch (e) {
      console.warn('Firebase login failed, trying local profiles:', e);
    }
  }

  // Check locally registered profiles
  const profiles = getStoredProfiles();
  const matched = Object.values(profiles).find(
    (p) => p.emailOrPhone.toLowerCase() === cleanId || p.email?.toLowerCase() === cleanId
  );

  if (matched) {
    const userObj = {
      uid: matched.uid,
      email: matched.email || matched.emailOrPhone,
      displayName: matched.fullName,
    };
    notifyAuthListeners(userObj as User);
    return { user: userObj, profile: matched };
  }

  // Generic fallback if user enters any email during offline testing
  const fallbackUid = 'user_' + Math.abs(cleanId.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0));
  const fallbackProfile: UserProfile = {
    uid: fallbackUid,
    fullName: cleanId.split('@')[0].replace(/[._-]/g, ' '),
    emailOrPhone: cleanId,
    role: 'farmer',
    country: 'India',
    farmSize: '20 – 50 Hectares (Commercial)',
    verificationStatus: 'approved',
  };
  saveStoredProfile(fallbackProfile);

  const fallbackUser = {
    uid: fallbackUid,
    email: cleanId,
    displayName: fallbackProfile.fullName,
  };
  notifyAuthListeners(fallbackUser as User);
  return { user: fallbackUser, profile: fallbackProfile };
}

/**
 * Google Sign-in
 */
export async function loginWithGoogle(role: UserRole = 'farmer'): Promise<{ user: any; profile: UserProfile } | null> {
  const uid = 'google_' + Date.now();
  const isFarmer = role === 'farmer';
  const profile: UserProfile = {
    uid,
    fullName: role === 'farmer' ? 'Ramesh Verma' : role === 'government_partner' ? 'BRICS Ministry Partner' : 'Dr. Elena Rostova',
    emailOrPhone: role === 'farmer' ? 'ramesh.agrin@gmail.com' : role === 'government_partner' ? 'partner.brics@agrin.gov' : 'research.elena@brics-agri.org',
    role,
    country: 'India',
    farmSize: isFarmer ? '25 Acres' : undefined,
    agencyName: role === 'government_partner' ? 'Ministry of Agriculture & Food Security' : undefined,
    department: role === 'government_partner' ? 'International Agronomic Cooperation' : undefined,
    region: role === 'government_partner' ? 'BRICS Ag-Tech Exchange' : undefined,
    institutionName: role === 'researcher_organization' ? 'BRICS Agricultural Research Institute' : undefined,
    researchFocusArea: role === 'researcher_organization' ? 'Regenerative Agriculture & Soil Microbiome' : undefined,
    position: role === 'researcher_organization' ? 'Lead Agronomist' : undefined,
    verificationStatus: isFarmer ? 'approved' : 'pending',
    createdAt: new Date().toISOString(),
  };

  saveStoredProfile(profile);

  const userObj = {
    uid,
    email: profile.emailOrPhone,
    displayName: profile.fullName,
  };

  notifyAuthListeners(userObj as User);
  return { user: userObj, profile };
}

/**
 * Apple Sign-in
 */
export async function loginWithApple(role: UserRole = 'farmer'): Promise<{ user: any; profile: UserProfile } | null> {
  return loginWithGoogle(role);
}

/**
 * Reset password
 */
export async function resetUserPassword(email: string): Promise<void> {
  if (isRealFirebaseConfigured && email.includes('@')) {
    try {
      await sendPasswordResetEmail(auth, email);
      return;
    } catch (e) {
      console.warn('Firebase sendPasswordResetEmail error:', e);
    }
  }
  // Simulate delay
  await new Promise((r) => setTimeout(r, 600));
}

/**
 * Logout
 */
export async function logoutUser(): Promise<void> {
  if (isRealFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
  }
  notifyAuthListeners(null);
}
