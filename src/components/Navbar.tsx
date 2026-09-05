import React, { useState } from 'react';
import { AgriNLogo } from './AgriNLogo';
import { Globe, ChevronDown, LogOut, LayoutDashboard, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { currentUser, userProfile, openModal, logout, currentView, setCurrentView } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'PT', label: 'Português (BR)' },
    { code: 'RU', label: 'Русский' },
    { code: 'ZH', label: '中文' },
    { code: 'HI', label: 'हिन्दी' },
  ];

  return (
    <header className="w-full bg-transparent absolute top-0 left-0 right-0 z-40 transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-20 sm:h-24 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView('home')}
          className="focus:outline-none rounded-lg"
        >
          <AgriNLogo size="md" />
        </button>

        {/* Navigation Links (Matching Screenshot: Platform, About Us, Partners) */}
        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-medium text-slate-800">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-emerald-800 transition-colors focus:outline-none"
          >
            Platform
          </button>

          <a href="#features" className="hover:text-emerald-800 transition-colors">
            About Us
          </a>
          
          <a href="#stats" className="hover:text-emerald-800 transition-colors">
            Partners
          </a>
        </nav>

        {/* Right CTA Actions: EN ⌵ | Log in | Get Started */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-800 hover:text-emerald-900 px-2 py-1.5 rounded-lg transition-colors focus:outline-none"
            >
              <Globe className="w-4 h-4 text-slate-700" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {langMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-36 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 p-1.5 z-50"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      currentLang === l.code
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Authentication Buttons matching exact screenshot */}
          {!currentUser ? (
            <div className="flex items-center gap-2.5">
              <button
                id="nav-login-btn"
                onClick={() => openModal('login')}
                className="px-4 py-1.5 text-sm font-medium text-slate-900 bg-white/80 hover:bg-white border border-slate-400/80 rounded-lg shadow-sm transition-all focus:outline-none"
              >
                Log in
              </button>
              <button
                id="nav-signup-btn"
                onClick={() => openModal('signup', 'farmer')}
                className="px-4.5 py-1.5 text-sm font-medium text-white bg-[#1e562c] hover:bg-[#164422] active:scale-[0.98] rounded-lg shadow-sm shadow-emerald-950/10 transition-all focus:outline-none"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Logged in User Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200 text-xs shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#1e562c] text-white flex items-center justify-center font-bold text-[11px]">
                  {userProfile?.fullName?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800 line-clamp-1 max-w-[110px]">
                    {userProfile?.fullName || currentUser.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium capitalize">
                    {userProfile?.role?.replace('_', ' ') || 'Member'}
                  </div>
                </div>
              </div>

              {/* Dashboard Link */}
              {userProfile?.role === 'farmer' || userProfile?.verificationStatus === 'approved' ? (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'bg-[#1e562c] text-white hover:bg-[#164422]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('pending_view')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Pending Status</span>
                </button>
              )}

              {/* Log Out */}
              <button
                id="nav-logout-btn"
                onClick={logout}
                title="Log Out"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 bg-white/80 border border-slate-200 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

