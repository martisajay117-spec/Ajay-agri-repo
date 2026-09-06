import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAgriNDemoPlaceholderKey1234567890',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agrin-brics-platform.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agrin-brics-platform',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agrin-brics-platform.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:100000000000:web:abcdef1234567890',
};

// Initialize Firebase safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isRealFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
);
