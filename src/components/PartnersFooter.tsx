import React from 'react';

export const PartnersFooter: React.FC = () => {
  const bricsFlags = [
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Russia', flag: '🇷🇺' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'South Africa', flag: '🇿🇦' },
  ];

  return (
    <footer id="stats" className="w-full bg-[#f3f6f3] border-t border-slate-200/80 py-7">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          
          {/* Left Side: "Trusted by partners across BRICS" + 5 Flags */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full lg:w-auto justify-between sm:justify-start">
            
            {/* Title */}
            <div className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight leading-snug text-center sm:text-left whitespace-nowrap">
              Trusted by partners<br />across BRICS
            </div>

            {/* 5 Flags in a clean row */}
            <div className="flex items-center gap-5 sm:gap-6">
              {bricsFlags.map((c) => (
                <div key={c.name} className="flex flex-col items-center gap-1 group cursor-default">
                  <div className="text-2xl sm:text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                    {c.flag}
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Vertical Divider for desktop */}
          <div className="hidden lg:block w-px h-12 bg-slate-300/80" />

          {/* Right Side: 4 Platform Stats with Green Outline Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200">
            
            {/* Metric 1: 1.6M+ Farmers Empowered */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#144723]">
                {/* Sprout Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 20h10" />
                  <path d="M12 20v-8" />
                  <path d="M12 12c-3 0-6-2-6-6 4 0 6 2 6 6z" fill="#e7f5ea" />
                  <path d="M12 12c3 0 6-2 6-6-4 0-6 2-6 6z" fill="#e7f5ea" />
                </svg>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">1.6M+</div>
                <div className="text-[11px] text-slate-600 font-normal mt-0.5 whitespace-nowrap">Farmers Empowered</div>
              </div>
            </div>

            {/* Metric 2: 2.3M+ Hectares Monitored */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#144723]">
                {/* Multi-leaf plant icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22V8" />
                  <path d="M12 14c-3 0-5-2-5-5 3 0 5 2 5 5z" fill="#e7f5ea" />
                  <path d="M12 11c3 0 5-2 5-5-3 0-5 2-5 5z" fill="#e7f5ea" />
                  <circle cx="12" cy="5" r="3" fill="#e7f5ea" />
                </svg>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">2.3M+</div>
                <div className="text-[11px] text-slate-600 font-normal mt-0.5 whitespace-nowrap">Hectares Monitored</div>
              </div>
            </div>

            {/* Metric 3: 40+ Technology Partners */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#144723]">
                {/* Cog/Tech icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="3" fill="#e7f5ea" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">40+</div>
                <div className="text-[11px] text-slate-600 font-normal mt-0.5 whitespace-nowrap">Technology Partners</div>
              </div>
            </div>

            {/* Metric 4: 5 BRICS Nations */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#144723]">
                {/* Globe/Alliances icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" fill="#e7f5ea" />
                  <path d="M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">5</div>
                <div className="text-[11px] text-slate-600 font-normal mt-0.5 whitespace-nowrap">BRICS Nations</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
};
