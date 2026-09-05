import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, Phone, User as UserIcon, Building2, MapPin, Globe2, Briefcase, Award, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AgriNLogo } from './AgriNLogo';
import { useAuth } from '../context/AuthContext';
import { SignUpFormData, UserRole, FormErrors } from '../types/user';
import { registerUser, loginUser, loginWithGoogle, loginWithApple, resetUserPassword, formatAuthErrorMessage } from '../firebase/authService';

const BRICS_COUNTRIES = [
  'India',
  'Brazil',
  'Russia',
  'China',
  'South Africa',
  'United Arab Emirates',
  'Saudi Arabia',
  'Egypt',
  'Ethiopia',
  'Iran',
  'Other',
];

const FARM_SIZES = [
  '< 5 Hectares (Smallholder)',
  '5 – 20 Hectares (Medium Farm)',
  '20 – 50 Hectares (Commercial)',
  '50+ Hectares (Enterprise Estate)',
];

const RESEARCH_FOCUS_AREAS = [
  'Regenerative Agriculture & Soil Microbiome',
  'Satellite Remote Sensing & Crop Telemetry',
  'Climate Resilience & Drought Resistance',
  'Precision Irrigation & Water Conservation',
  'Crop Yield Optimization & AI Genetics',
  'Food Security Policy & BRICS Trade Dynamics',
];

export const AuthModal: React.FC = () => {
  const { authModal, closeModal, openModal, initialRole, refreshProfile, setCurrentView, setPendingMessage } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup State
  const [signupForm, setSignupForm] = useState<SignUpFormData>({
    fullName: '',
    emailOrPhone: '',
    country: 'India',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    farmSize: '< 5 Hectares (Smallholder)',
    agencyName: '',
    department: '',
    region: '',
    institutionName: '',
    researchFocusArea: 'Regenerative Agriculture & Soil Microbiome',
    position: '',
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupErrors, setSignupErrors] = useState<FormErrors>({});
  const [signupGeneralError, setSignupGeneralError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Social Auth Loading
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  useEffect(() => {
    if (authModal === 'login') {
      setMode('login');
      setLoginError(null);
    } else if (authModal === 'signup') {
      setMode('signup');
      setSelectedRole(initialRole || 'farmer');
      setSignupErrors({});
      setSignupGeneralError(null);
    } else if (authModal === 'forgot_password') {
      setMode('forgot_password');
      setResetSent(false);
      setResetError(null);
    }
  }, [authModal, initialRole]);

  if (!authModal || authModal === 'pending_verification') return null;

  // Validation for Signup
  const validateSignup = (): boolean => {
    const errors: FormErrors = {};

    if (!signupForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!signupForm.emailOrPhone.trim()) {
      errors.emailOrPhone = 'Email or phone number is required';
    } else {
      const val = signupForm.emailOrPhone.trim();
      const isEmail = val.includes('@');
      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          errors.emailOrPhone = 'Please enter a valid email address';
        }
      } else {
        const digits = val.replace(/[^0-9]/g, '');
        if (digits.length < 8) {
          errors.emailOrPhone = 'Please enter a valid phone number (at least 8 digits)';
        }
      }
    }

    if (!signupForm.password) {
      errors.password = 'Password is required';
    } else if (signupForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!signupForm.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Role-specific validations
    if (selectedRole === 'farmer') {
      if (!signupForm.farmSize) {
        errors.farmSize = 'Please specify farm size';
      }
    } else if (selectedRole === 'government_partner') {
      if (!signupForm.agencyName.trim()) {
        errors.agencyName = 'Agency / Ministry name is required';
      }
      if (!signupForm.department.trim()) {
        errors.department = 'Department name is required';
      }
      if (!signupForm.region.trim()) {
        errors.region = 'Jurisdiction / Region is required';
      }
    } else if (selectedRole === 'researcher_organization') {
      if (!signupForm.institutionName.trim()) {
        errors.institutionName = 'Institution or organization name is required';
      }
      if (!signupForm.researchFocusArea.trim()) {
        errors.researchFocusArea = 'Research focus area is required';
      }
      if (!signupForm.position.trim()) {
        errors.position = 'Academic or organization position is required';
      }
    }

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email or phone number.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setLoginLoading(true);
    try {
      const { profile } = await loginUser(loginIdentifier, loginPassword);
      await refreshProfile();
      closeModal();

      // Check role & verification status
      if (profile) {
        if (profile.role === 'farmer' || profile.verificationStatus === 'approved') {
          setCurrentView('dashboard');
        } else if (profile.verificationStatus === 'pending') {
          setCurrentView('pending_view');
          setPendingMessage("Your account is pending verification. You'll be notified once approved.");
        }
      } else {
        setCurrentView('dashboard');
      }
    } catch (err: any) {
      setLoginError(formatAuthErrorMessage(err));
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupGeneralError(null);

    if (!validateSignup()) {
      return;
    }

    setSignupLoading(true);
    try {
      const submissionData: SignUpFormData = {
        ...signupForm,
        role: selectedRole,
      };

      const { profile } = await registerUser(submissionData);
      await refreshProfile();
      closeModal();

      // Check role & post-signup behavior
      if (profile.role === 'farmer') {
        setCurrentView('dashboard');
      } else {
        // Government Partner & Researcher: Do NOT redirect to dashboard, show pending notice
        setCurrentView('pending_view');
        setPendingMessage("Your account is pending verification. You'll be notified once approved.");
      }
    } catch (err: any) {
      setSignupGeneralError(formatAuthErrorMessage(err));
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setSocialLoading('google');
    setLoginError(null);
    setSignupGeneralError(null);
    try {
      const result = await loginWithGoogle(selectedRole);
      if (!result) {
        // User voluntarily closed or cancelled the popup
        return;
      }
      const { profile } = result;
      await refreshProfile();
      closeModal();

      if (profile.role === 'farmer' || profile.verificationStatus === 'approved') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('pending_view');
        setPendingMessage("Your account is pending verification. You'll be notified once approved.");
      }
    } catch (err: any) {
      const formatted = formatAuthErrorMessage(err);
      if (formatted) {
        setLoginError(formatted);
        setSignupGeneralError(formatted);
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // Handle Apple Auth
  const handleAppleAuth = async () => {
    setSocialLoading('apple');
    try {
      const result = await loginWithApple(selectedRole);
      if (!result) {
        return;
      }
      const { profile } = result;
      await refreshProfile();
      closeModal();

      if (profile.role === 'farmer' || profile.verificationStatus === 'approved') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('pending_view');
      }
    } catch (err: any) {
      const formatted = formatAuthErrorMessage(err);
      if (formatted) {
        setLoginError(formatted);
        setSignupGeneralError(formatted);
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // Handle Forgot Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    try {
      await resetUserPassword(resetEmail);
      setResetSent(true);
    } catch (err: any) {
      setResetError(formatAuthErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-[92vw] sm:max-w-[480px] max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-8 my-auto text-center overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Leaf Icon */}
        <div className="flex justify-center mb-3">
          <AgriNLogo showText={false} size="lg" />
        </div>

        {/* ======================================================== */}
        {/* 1. LOGIN MODAL (Matching Image 2 exact structure)        */}
        {/* ======================================================== */}
        {mode === 'login' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Log in to access your farm dashboard.
            </p>

            {/* Login Error Notification */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
              {/* Email / Phone Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <div className="flex items-center gap-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <input
                  id="login-email-phone"
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Email/phone"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Log In Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-[#245b2f] hover:bg-[#1a4422] active:scale-[0.99] disabled:opacity-70 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] text-slate-400 uppercase">
                <span className="bg-white px-3 tracking-wider font-medium">or continue with</span>
              </div>
            </div>

            {/* Social Auth Buttons (Google & Apple) */}
            <div className="flex items-center justify-center gap-3">
              {/* Google Button */}
              <button
                id="google-signin-btn"
                type="button"
                onClick={handleGoogleAuth}
                disabled={socialLoading !== null}
                className="w-12 h-12 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                title="Continue with Google"
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
              </button>

              {/* Apple Button */}
              <button
                id="apple-signin-btn"
                type="button"
                onClick={handleAppleAuth}
                disabled={socialLoading !== null}
                className="w-12 h-12 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                title="Continue with Apple"
              >
                {socialLoading === 'apple' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.64-.78 1.08-1.86.96-2.94-1 .04-2.15.65-2.81 1.43-.58.67-1.1 1.77-.96 2.83 1.12.09 2.19-.54 2.81-1.32z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Footer Sign Up Link */}
            <p className="text-xs text-slate-500 mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-emerald-800 hover:text-emerald-950 transition-colors focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. SIGN UP MODAL (3 Role Variants + Strict Validation)   */}
        {/* ======================================================== */}
        {mode === 'signup' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create Your AgriN Account
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Select your role across the BRICS agricultural ecosystem.
            </p>

            {/* 3 Role Selection Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'farmer'
                    ? 'bg-white text-emerald-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🌾 Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('government_partner')}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'government_partner'
                    ? 'bg-white text-blue-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏛️ Gov Partner</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('researcher_organization')}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'researcher_organization'
                    ? 'bg-white text-purple-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🔬 Researcher</span>
              </button>
            </div>

            {/* General Error Banner */}
            {signupGeneralError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{signupGeneralError}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3 text-left max-h-[55vh] overflow-y-auto pr-1">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={signupForm.fullName}
                    onChange={(e) => {
                      setSignupForm({ ...signupForm, fullName: e.target.value });
                      if (signupErrors.fullName) setSignupErrors({ ...signupErrors, fullName: undefined });
                    }}
                    placeholder="e.g. Maria Silva / Rajesh Patel"
                    className={`w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      signupErrors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>
                {signupErrors.fullName && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{signupErrors.fullName}</p>
                )}
              </div>

              {/* Email or Phone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email or Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={signupForm.emailOrPhone}
                    onChange={(e) => {
                      setSignupForm({ ...signupForm, emailOrPhone: e.target.value });
                      if (signupErrors.emailOrPhone) setSignupErrors({ ...signupErrors, emailOrPhone: undefined });
                    }}
                    placeholder="name@organization.com or +919876543210"
                    className={`w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      signupErrors.emailOrPhone ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>
                {signupErrors.emailOrPhone && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{signupErrors.emailOrPhone}</p>
                )}
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={signupForm.country}
                    onChange={(e) => setSignupForm({ ...signupForm, country: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {BRICS_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ========================================= */}
              {/* ROLE SPECIFIC FIELDS                      */}
              {/* ========================================= */}

              {/* 1. FARMER FIELDS */}
              {selectedRole === 'farmer' && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2.5">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>Farm Profile Details</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Farm Size (Hectares) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={signupForm.farmSize}
                      onChange={(e) => setSignupForm({ ...signupForm, farmSize: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {FARM_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 2. GOVERNMENT PARTNER FIELDS */}
              {selectedRole === 'government_partner' && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2.5">
                  <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <span>Government Agency Credentials (Verification Required)</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Ministry / Agency Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={signupForm.agencyName}
                      onChange={(e) => setSignupForm({ ...signupForm, agencyName: e.target.value })}
                      placeholder="e.g. Ministry of Agriculture and Rural Affairs"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        signupErrors.agencyName ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {signupErrors.agencyName && (
                      <p className="text-[10px] text-red-600 mt-0.5">{signupErrors.agencyName}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={signupForm.department}
                        onChange={(e) => setSignupForm({ ...signupForm, department: e.target.value })}
                        placeholder="e.g. Food Security & Policy"
                        className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          signupErrors.department ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Region / State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={signupForm.region}
                        onChange={(e) => setSignupForm({ ...signupForm, region: e.target.value })}
                        placeholder="e.g. São Paulo / Punjab / Federal"
                        className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          signupErrors.region ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RESEARCHER / ORGANIZATION FIELDS */}
              {selectedRole === 'researcher_organization' && (
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-2.5">
                  <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <span>Research Institution Credentials (Verification Required)</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Institution / University / Org <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={signupForm.institutionName}
                      onChange={(e) => setSignupForm({ ...signupForm, institutionName: e.target.value })}
                      placeholder="e.g. Brazilian Agricultural Research Corporation (Embrapa)"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                        signupErrors.institutionName ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {signupErrors.institutionName && (
                      <p className="text-[10px] text-red-600 mt-0.5">{signupErrors.institutionName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Research Focus Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={signupForm.researchFocusArea}
                      onChange={(e) => setSignupForm({ ...signupForm, researchFocusArea: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      {RESEARCH_FOCUS_AREAS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Position / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={signupForm.position}
                      onChange={(e) => setSignupForm({ ...signupForm, position: e.target.value })}
                      placeholder="e.g. Lead Soil Scientist / Principal Investigator"
                      className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                        signupErrors.position ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password (8+ chars) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => {
                        setSignupForm({ ...signupForm, password: e.target.value });
                        if (signupErrors.password) setSignupErrors({ ...signupErrors, password: undefined });
                      }}
                      placeholder="Min. 8 chars"
                      className={`w-full px-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-9 ${
                        signupErrors.password ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {signupErrors.password && (
                    <p className="text-[10px] text-red-600 mt-1 font-medium">{signupErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupConfirmPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => {
                        setSignupForm({ ...signupForm, confirmPassword: e.target.value });
                        if (signupErrors.confirmPassword) setSignupErrors({ ...signupErrors, confirmPassword: undefined });
                      }}
                      placeholder="Repeat password"
                      className={`w-full px-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-9 ${
                        signupErrors.confirmPassword ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showSignupConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {signupErrors.confirmPassword && (
                    <p className="text-[10px] text-red-600 mt-1 font-medium">{signupErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 bg-[#245b2f] hover:bg-[#1a4422] active:scale-[0.99] disabled:opacity-70 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {signupLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>
                    {selectedRole === 'farmer' ? 'Register & Open Farm Dashboard' : 'Submit for Verification'}
                  </span>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] text-slate-400 uppercase">
                <span className="bg-white px-3 tracking-wider font-medium">or continue with</span>
              </div>
            </div>

            {/* Social Auth Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={socialLoading !== null}
                className="w-11 h-11 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-all"
                title="Sign up with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleAppleAuth}
                disabled={socialLoading !== null}
                className="w-11 h-11 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-all text-slate-900"
                title="Sign up with Apple"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.64-.78 1.08-1.86.96-2.94-1 .04-2.15.65-2.81 1.43-.58.67-1.1 1.77-.96 2.83 1.12.09 2.19-.54 2.81-1.32z" />
                </svg>
              </button>
            </div>

            {/* Already have account */}
            <p className="text-xs text-slate-500 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-800 hover:text-emerald-950 transition-colors focus:outline-none"
              >
                Log In
              </button>
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. FORGOT PASSWORD MODAL                                 */}
        {/* ======================================================== */}
        {mode === 'forgot_password' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Enter your registered email address and we will send you a secure password reset link.
            </p>

            {resetSent ? (
              <div className="space-y-4 py-2 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Reset Email Dispatched!</h4>
                  <p className="text-xs text-slate-600">
                    We've sent a link to <span className="font-semibold text-slate-800">{resetEmail}</span>. Please check your inbox and spam folder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full py-2.5 bg-[#245b2f] text-white text-xs font-bold rounded-xl hover:bg-[#1a4422] transition-colors"
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4 text-left">
                {resetError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 bg-[#245b2f] hover:bg-[#1a4422] disabled:opacity-70 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <span>Send Password Reset Link</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    ← Back to Log In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
