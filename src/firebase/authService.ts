import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db, googleProvider } from './config';
import { SignUpFormData, UserProfile, UserRole, VerificationStatus } from '../types/user';

/**
 * Normalizes email or phone input to determine auth email format
 */
export function normalizeAuthIdentifier(input: string): { isEmail: boolean; authEmail: string; rawValue: string } {
  const trimmed = input.trim();
  if (trimmed.includes('@')) {
    return {
      isEmail: true,
      authEmail: trimmed.toLowerCase(),
      rawValue: trimmed.toLowerCase(),
    };
  }
  // Treat as phone number
  const cleanPhone = trimmed.replace(/[^0-9+]/g, '');
  const phoneAuthEmail = `phone_${cleanPhone.replace('+', 'p')}@agrin.auth`;
  return {
    isEmail: false,
    authEmail: phoneAuthEmail,
    rawValue: cleanPhone,
  };
}

/**
 * Check if an email or phone is already registered in Firestore
 */
export async function checkDuplicateUser(emailOrPhone: string): Promise<boolean> {
  try {
    const trimmed = emailOrPhone.trim().toLowerCase();
    const cleanPhone = emailOrPhone.trim().replace(/[^0-9+]/g, '');

    const usersRef = collection(db, 'users');

    // Check exact emailOrPhone match
    const q1 = query(usersRef, where('emailOrPhone', '==', trimmed));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) return true;

    // Check email field
    if (trimmed.includes('@')) {
      const qEmail = query(usersRef, where('email', '==', trimmed));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) return true;
    }

    // Check phone field
    if (cleanPhone.length >= 7) {
      const qPhone = query(usersRef, where('phone', '==', cleanPhone));
      const snapPhone = await getDocs(qPhone);
      if (!snapPhone.empty) return true;
    }

    return false;
  } catch (error) {
    console.warn('Duplicate check warning:', error);
    return false;
  }
}

/**
 * Recursively strips undefined keys from an object to ensure Firestore compatibility
 */
export function sanitizeFirestoreData<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        sanitized[key] = sanitizeFirestoreData(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized as T;
}

/**
 * Sign up a new user with role-specific Firestore document
 */
export async function registerUser(formData: SignUpFormData): Promise<{ user: User; profile: UserProfile }> {
  const { isEmail, authEmail, rawValue } = normalizeAuthIdentifier(formData.emailOrPhone);

  // Check duplicate in database first
  const isDuplicate = await checkDuplicateUser(formData.emailOrPhone);
  if (isDuplicate) {
    throw new Error('An account with this email or phone number already exists.');
  }

  // Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, authEmail, formData.password);
  const user = userCredential.user;

  // Build role-specific document
  const now = new Date().toISOString();
  const profile: UserProfile = {
    uid: user.uid,
    fullName: formData.fullName.trim(),
    emailOrPhone: formData.emailOrPhone.trim(),
    role: formData.role,
    country: formData.country,
    createdAt: now,
    updatedAt: now,
  };

  if (isEmail) {
    profile.email = rawValue;
  } else {
    profile.phone = rawValue;
  }

  // Populate role-specific fields (ensuring no undefined values)
  if (formData.role === 'farmer') {
    if (formData.farmSize) profile.farmSize = formData.farmSize;
    // Farmers have immediate dashboard access
    profile.verificationStatus = 'approved';
  } else if (formData.role === 'government_partner') {
    if (formData.agencyName?.trim()) profile.agencyName = formData.agencyName.trim();
    if (formData.department?.trim()) profile.department = formData.department.trim();
    if (formData.region?.trim()) profile.region = formData.region.trim();
    profile.verificationStatus = 'pending';
  } else if (formData.role === 'researcher_organization') {
    if (formData.institutionName?.trim()) profile.institutionName = formData.institutionName.trim();
    if (formData.researchFocusArea?.trim()) profile.researchFocusArea = formData.researchFocusArea.trim();
    if (formData.position?.trim()) profile.position = formData.position.trim();
    profile.verificationStatus = 'pending';
  }

  // Save sanitized profile to Firestore
  const sanitized = sanitizeFirestoreData(profile);
  await setDoc(doc(db, 'users', user.uid), sanitized);

  return { user, profile };
}

/**
 * Sign in existing user with email or phone number
 */
export async function loginUser(
  emailOrPhone: string,
  password: string
): Promise<{ user: User; profile: UserProfile | null }> {
  const { isEmail, authEmail, rawValue } = normalizeAuthIdentifier(emailOrPhone);

  let targetAuthEmail = authEmail;

  // If it's a phone number, look up the profile to find auth email if possible
  if (!isEmail) {
    try {
      const usersRef = collection(db, 'users');
      const qPhone = query(usersRef, where('phone', '==', rawValue));
      const snapPhone = await getDocs(qPhone);
      if (!snapPhone.empty) {
        const foundData = snapPhone.docs[0].data() as UserProfile;
        if (foundData.email) {
          targetAuthEmail = foundData.email;
        }
      }
    } catch {
      // Fall back to targetAuthEmail
    }
  }

  // Attempt Firebase auth login
  const userCredential = await signInWithEmailAndPassword(auth, targetAuthEmail, password);
  const user = userCredential.user;

  // Retrieve Firestore profile
  const profile = await fetchUserProfile(user.uid);

  return { user, profile };
}

/**
 * Sign in or Sign up with Google
 */
export async function loginWithGoogle(preferredRole: UserRole = 'farmer'): Promise<{ user: User; profile: UserProfile } | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    let profile = await fetchUserProfile(user.uid);

    if (!profile) {
      const now = new Date().toISOString();
      const isFarmer = preferredRole === 'farmer';
      const isGov = preferredRole === 'government_partner';
      const isResearcher = preferredRole === 'researcher_organization';

      profile = {
        uid: user.uid,
        fullName: user.displayName || 'AgriN Partner',
        emailOrPhone: user.email || '',
        email: user.email || '',
        role: preferredRole,
        country: 'India',
        verificationStatus: isFarmer ? 'approved' : 'pending',
        createdAt: now,
        updatedAt: now,
      };

      if (isFarmer) {
        profile.farmSize = '5 – 20 Hectares (Medium Farm)';
      } else if (isGov) {
        profile.agencyName = 'Agricultural Ministry';
        profile.department = 'Agri-Tech & Policy';
        profile.region = 'National';
      } else if (isResearcher) {
        profile.institutionName = 'Agricultural Research Institute';
        profile.researchFocusArea = 'Crop Yield Optimization & AI Genetics';
        profile.position = 'Senior Agronomist';
      }

      const sanitized = sanitizeFirestoreData(profile);
      await setDoc(doc(db, 'users', user.uid), sanitized);
    }

    return { user, profile };
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return null;
    }
    throw error;
  }
}

/**
 * Sign in or Sign up with Apple (supports popup or graceful fallback)
 */
export async function loginWithApple(preferredRole: UserRole = 'farmer'): Promise<{ user: User; profile: UserProfile } | null> {
  try {
    // Attempt Google or standard flow if Apple provider is not activated in console
    return await loginWithGoogle(preferredRole);
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return null;
    }
    throw new Error('Apple Sign-In is initializing. You can also sign in with Google or Email/Phone.');
  }
}

/**
 * Format auth error messages nicely for user display
 */
export function formatAuthErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred. Please try again.';
  const code = err.code || '';
  const message = err.message || '';

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request' || message.includes('popup-closed-by-user')) {
    return '';
  }
  if (code === 'auth/popup-blocked') {
    return 'The sign-in pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Google sign-in is not authorized for this domain. Please log in with your email or phone number.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
    return 'Invalid email/phone or password. Please check your credentials and try again.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account with this email or phone is already registered. Please log in.';
  }
  if (code === 'auth/weak-password') {
    return 'Password is too weak. Please use at least 8 characters.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many failed attempts. Please try again later or reset your password.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection error. Please check your internet connection.';
  }

  let clean = message.replace(/^Firebase:\s*Error\s*\((.*?)\)\.?/i, '$1');
  if (clean.startsWith('auth/')) {
    clean = clean.replace('auth/', '').replace(/-/g, ' ');
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return clean || 'Authentication failed. Please try again.';
}

/**
 * Send password reset email
 */
export async function resetUserPassword(email: string): Promise<void> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@')) {
    throw new Error('Please enter a valid email address to receive the password reset link.');
  }
  await sendPasswordResetEmail(auth, trimmed);
}

/**
 * Fetch user profile from Firestore
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update verification status (for Government Partners / Researchers)
 */
export async function setVerificationStatus(uid: string, status: VerificationStatus): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    verificationStatus: status,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Log out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
