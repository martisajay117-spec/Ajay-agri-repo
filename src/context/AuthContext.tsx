import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { fetchUserProfile, logoutUser, setVerificationStatus } from '../firebase/authService';
import { AuthModalMode, UserProfile, UserRole, VerificationStatus } from '../types/user';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authModal: AuthModalMode;
  initialRole: UserRole;
  currentView: 'home' | 'dashboard' | 'pending_view';
  openModal: (mode: AuthModalMode, role?: UserRole) => void;
  closeModal: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setCurrentView: (view: 'home' | 'dashboard' | 'pending_view') => void;
  simulateApproveVerification: () => Promise<void>;
  pendingMessage: string | null;
  setPendingMessage: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_FARMER_PROFILE: UserProfile = {
  uid: 'demo-farmer-1',
  fullName: 'Ramesh Verma',
  emailOrPhone: 'ramesh.verma@agrin.brics',
  role: 'farmer',
  country: 'India',
  farmSize: '25 Acres',
  verificationStatus: 'approved',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(DEMO_FARMER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);
  const [initialRole, setInitialRole] = useState<UserRole>('farmer');
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'pending_view'>('home');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Sync auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          setUserProfile(profile || DEMO_FARMER_PROFILE);
          // If logged in user is a farmer or approved, they can access dashboard
          if (profile) {
            if (profile.role === 'farmer' || profile.verificationStatus === 'approved') {
              setCurrentView('dashboard');
            } else if (profile.verificationStatus === 'pending') {
              setCurrentView('pending_view');
              setPendingMessage("Your account is pending verification. You'll be notified once approved.");
            }
          }
        } catch (err) {
          console.error('Failed to load profile on auth change:', err);
          setUserProfile(DEMO_FARMER_PROFILE);
        }
      } else {
        // Unauthenticated users start at the website landing page
        setUserProfile(DEMO_FARMER_PROFILE);
        setCurrentView('home');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (mode: AuthModalMode, role: UserRole = 'farmer') => {
    setInitialRole(role);
    setAuthModal(mode);
  };

  const closeModal = () => {
    setAuthModal(null);
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.uid);
      setUserProfile(profile);
      if (profile) {
        if (profile.role === 'farmer' || profile.verificationStatus === 'approved') {
          setCurrentView('dashboard');
          setPendingMessage(null);
        } else if (profile.verificationStatus === 'pending') {
          setCurrentView('pending_view');
          setPendingMessage("Your account is pending verification. You'll be notified once approved.");
        }
      }
    }
  };

  const simulateApproveVerification = async () => {
    if (currentUser && userProfile) {
      await setVerificationStatus(currentUser.uid, 'approved');
      await refreshProfile();
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
      setCurrentView('home');
      setPendingMessage(null);
      closeModal();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        authModal,
        initialRole,
        currentView,
        openModal,
        closeModal,
        logout,
        refreshProfile,
        setCurrentView,
        simulateApproveVerification,
        pendingMessage,
        setPendingMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
