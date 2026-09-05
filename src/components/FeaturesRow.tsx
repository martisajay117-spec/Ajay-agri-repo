import React from 'react';
import { useAuth } from '../context/AuthContext';

export const FeaturesRow: React.FC = () => {
  const { openModal } = useAuth();

  const features = [
    {
      id: 'satellite',
      title: 'Satellite Monitoring',
      description: 'Real-time insights from space',
      icon: (
        <svg className="w-10 h-10 text-[#144723]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Satellite body and solar panels matching reference line art */}
          <rect x="18" y="18" width="12" height="12" rx="2" fill="#e7f5ea" />
          <path d="M12 12L20 20" />
          <path d="M28 28L36 36" />
          <path d="M6 18L18 6" />
          <path d="M30 42L42 30" />
          <path d="M9 15L15 9" />
          <path d="M33 39L39 33" />
          <circle cx="24" cy="24" r="2" fill="#1b7a37" />
          <path d="M22 26L16 32" />
        </svg>
      ),
      roleTarget: 'farmer' as const,
    },
    {
      id: 'soil',
      title: 'Soil Intelligence',
      description: 'Deep soil analytics for better decisions',
      icon: (
        <svg className="w-10 h-10 text-[#144723]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Plant growing from layered soil bed */}
          <path d="M24 10C24 10 18 16 18 22C18 25.3 20.7 28 24 28C27.3 28 30 25.3 30 22C30 16 24 10 24 10Z" fill="#e7f5ea" />
          <path d="M24 28V36" />
          <path d="M10 36H38" />
          <path d="M14 40H34" />
          <path d="M18 44H30" />
        </svg>
      ),
      roleTarget: 'researcher_organization' as const,
    },
    {
      id: 'weather',
      title: 'Weather Forecasts',
      description: 'Localized forecasts for smarter planning',
      icon: (
        <svg className="w-10 h-10 text-[#144723]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Sun behind cloud */}
          <path d="M28 16C31 16 33.5 18 34 20.8C34.6 20.6 35.3 20.5 36 20.5C39.3 20.5 42 23.2 42 26.5C42 29.8 39.3 32.5 36 32.5H16C11.6 32.5 8 28.9 8 24.5C8 20.4 11.1 17 15.1 16.6C16.3 12.3 20.3 9 25 9C27.5 9 29.8 9.9 31.5 11.5" fill="#fef9c3" opacity="0.5" />
          <circle cx="34" cy="14" r="5" stroke="#f59e0b" fill="#fef3c7" />
          <path d="M14 34H36C39.3 34 42 31.3 42 28C42 24.7 39.3 22 36 22C35.5 22 35 22.1 34.6 22.2C33.7 18.1 30.1 15 25.7 15C21.8 15 18.5 17.5 17.3 21C16.9 20.9 16.4 20.9 16 20.9C12.1 20.9 9 24 9 27.9C9 31.3 11.2 34 14 34Z" stroke="currentColor" />
        </svg>
      ),
      roleTarget: 'farmer' as const,
    },
    {
      id: 'ai-advisory',
      title: 'AI Advisory',
      description: 'Personalized recommendations',
      icon: (
        <svg className="w-10 h-10 text-[#144723]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* AI Microchip Processor */}
          <rect x="12" y="12" width="24" height="24" rx="4" fill="#e7f5ea" />
          <line x1="18" y1="6" x2="18" y2="12" />
          <line x1="24" y1="6" x2="24" y2="12" />
          <line x1="30" y1="6" x2="30" y2="12" />
          <line x1="18" y1="36" x2="18" y2="42" />
          <line x1="24" y1="36" x2="24" y2="42" />
          <line x1="30" y1="36" x2="30" y2="42" />
          <line x1="6" y1="18" x2="12" y2="18" />
          <line x1="6" y1="24" x2="12" y2="24" />
          <line x1="6" y1="30" x2="12" y2="30" />
          <line x1="36" y1="18" x2="42" y2="18" />
          <line x1="36" y1="24" x2="42" y2="24" />
          <line x1="36" y1="30" x2="42" y2="30" />
          <text x="17" y="27" fontSize="11" fontWeight="bold" fill="#1b7a37" stroke="none">AI</text>
        </svg>
      ),
      roleTarget: 'farmer' as const,
    },
    {
      id: 'market-connect',
      title: 'Market Connect',
      description: 'Linking farmers to markets & partners',
      icon: (
        <svg className="w-10 h-10 text-[#144723]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Connected people network */}
          <circle cx="24" cy="15" r="5" fill="#e7f5ea" />
          <path d="M14 33C14 27.5 18.5 24 24 24C29.5 24 34 27.5 34 33" />
          <circle cx="11" cy="20" r="3.5" />
          <path d="M4 35C4 31 7 28.5 11 28.5" />
          <circle cx="37" cy="20" r="3.5" />
          <path d="M44 35C44 31 41 28.5 37 28.5" />
        </svg>
      ),
      roleTarget: 'government_partner' as const,
    },
  ];

  return (
    <section id="features" className="w-full bg-[#fafaf9] py-8 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
          {features.map((f) => (
            <div
              key={f.id}
              onClick={() => openModal('signup', f.roleTarget)}
              className="group flex flex-col items-center text-center p-2 rounded-2xl transition-all duration-200 cursor-pointer"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-800 transition-colors">
                {f.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed max-w-[170px] font-normal">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
