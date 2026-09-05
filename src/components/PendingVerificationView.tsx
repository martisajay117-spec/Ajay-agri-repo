import React, { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle2, RefreshCw, LogOut, ArrowLeft, Building2, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AgriNLogo } from './AgriNLogo';

export const PendingVerificationView: React.FC = () => {
  const { userProfile, refreshProfile, logout, setCurrentView, simulateApproveVerification } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [approving, setApproving] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleSimulateApproval = async () => {
    setApproving(true);
    await simulateApproveVerification();
    setApproving(false);
  };

  const isGov = userProfile?.role === 'government_partner';
  const roleTitle = isGov ? 'Government Partner' : 'Researcher / Academic Organization';

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-amber-50/40 via-white to-slate-50">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-amber-200/80 p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Top ambient banner */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-600" />

        {/* Center Badge Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Verification Pending
        </div>

        {/* Header Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Account Pending Verification
        </h2>

        {/* Exact Prompt Required Message */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/90 my-4 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
          <p className="font-semibold text-amber-900 mb-1">
            "Your account is pending verification. You'll be notified once approved."
          </p>
          <p className="text-[12px] text-amber-800/80">
            For security compliance across BRICS ministerial and research datasets, our data governance team reviews institutional credentials prior to dashboard access.
          </p>
        </div>

        {/* User Submission Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs space-y-2 mb-6">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span>Submitted Credentials</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              {roleTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">Full Name:</span>
              <span className="font-semibold">{userProfile?.fullName || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Country:</span>
              <span className="font-semibold">{userProfile?.country || 'N/A'}</span>
            </div>

            {isGov ? (
              <>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Agency / Ministry:</span>
                  <span className="font-semibold">{userProfile?.agencyName || 'Agricultural Ministry'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Department:</span>
                  <span className="font-semibold">{userProfile?.department || 'Policy & Telemetry'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Region:</span>
                  <span className="font-semibold">{userProfile?.region || 'National'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Institution:</span>
                  <span className="font-semibold">{userProfile?.institutionName || 'Research Center'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Focus Area:</span>
                  <span className="font-semibold">{userProfile?.researchFocusArea || 'Crop Yield & Soil'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Refresh Status Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Check Approval Status</span>
          </button>

          {/* Simulate Admin Approval in Database (One-Click Testing Helper) */}
          <button
            onClick={handleSimulateApproval}
            disabled={approving}
            className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            title="Simulate setting verificationStatus = approved in Firestore"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{approving ? 'Approving in Database...' : 'Simulate Database Admin Approval (Test Dashboard)'}</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Home</span>
            </button>

            <button
              onClick={logout}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
