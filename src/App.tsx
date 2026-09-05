/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesRow } from './components/FeaturesRow';
import { PartnersFooter } from './components/PartnersFooter';
import { AuthModal } from './components/AuthModal';
import { PendingVerificationView } from './components/PendingVerificationView';
import { Dashboard } from './components/Dashboard';
import { Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        <span className="text-xs font-semibold text-slate-600">Connecting to AgriN Security Gateway...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Current View Switcher */}
      {currentView === 'home' && (
        <>
          <Navbar />
          <main className="flex-1">
            <Hero />
            <FeaturesRow />
          </main>
          <PartnersFooter />
        </>
      )}

      {currentView === 'pending_view' && (
        <>
          <Navbar />
          <main className="flex-1">
            <PendingVerificationView />
          </main>
          <PartnersFooter />
        </>
      )}

      {currentView === 'dashboard' && <Dashboard />}

      {/* Global Auth Modal for Login, Sign Up & Password Reset */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
