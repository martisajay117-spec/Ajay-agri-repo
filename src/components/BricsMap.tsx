import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  farmers: string;
  hectares: string;
  keyCrops: string;
  techNodes: string;
  x: number;
  y: number;
}

const BRICS_COUNTRIES: Record<string, CountryInfo> = {
  Brazil: {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    farmers: '420,000+',
    hectares: '680K ha',
    keyCrops: 'Soybeans, Sugar, Coffee',
    techNodes: '8 AI Hubs',
    x: 280,
    y: 350,
  },
  Russia: {
    name: 'Russia',
    code: 'RU',
    flag: '🇷🇺',
    farmers: '180,000+',
    hectares: '510K ha',
    keyCrops: 'Wheat, Barley, Sunflower',
    techNodes: '6 Satellite Links',
    x: 580,
    y: 130,
  },
  India: {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    farmers: '650,000+',
    hectares: '720K ha',
    keyCrops: 'Rice, Wheat, Pulses, Cotton',
    techNodes: '14 Field Stations',
    x: 540,
    y: 280,
  },
  China: {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    farmers: '320,000+',
    hectares: '490K ha',
    keyCrops: 'Corn, Rice, Vegetables',
    techNodes: '12 Autonomous Grid Labs',
    x: 620,
    y: 240,
  },
  'South Africa': {
    name: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    farmers: '95,000+',
    hectares: '140K ha',
    keyCrops: 'Maize, Citrus, Grapes',
    techNodes: '4 Precision Water Hubs',
    x: 420,
    y: 390,
  },
};

export const BricsMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [hoveredCountry, setHoveredCountry] = useState<CountryInfo | null>(null);

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span>BRICS Transnational Intelligence Network</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mt-0.5">
            Synchronized satellite telemetry, regional IoT ground nodes, and cross-border soil registries.
          </p>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="appearance-none bg-slate-50/80 hover:bg-slate-100/80 text-slate-700 text-xs font-medium py-1.5 pl-3 pr-7 rounded-lg border border-slate-200 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">All BRICS Nodes</option>
            <option value="Brazil">🇧🇷 Brazil</option>
            <option value="Russia">🇷🇺 Russia</option>
            <option value="India">🇮🇳 India</option>
            <option value="China">🇨🇳 China</option>
            <option value="South Africa">🇿🇦 South Africa</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* World Map SVG with Connected BRICS Orbital Network */}
      <div className="relative w-full h-[260px] sm:h-[300px] my-1 flex items-center justify-center">
        <svg
          viewBox="0 0 740 460"
          className="w-full h-full select-none"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.02))' }}
        >
          {/* Subtle World Map Continents Simplified Silhouette */}
          {/* North America */}
          <path
            d="M80 80 Q140 60 190 90 T240 140 T210 200 T150 210 T100 160 Z"
            fill="#e2e8f0"
            opacity="0.6"
          />
          {/* South America (Brazil highlighted) */}
          <path
            d="M210 230 Q270 240 310 290 T290 390 T240 430 T200 340 T190 270 Z"
            fill="#d1d5db"
            opacity="0.7"
          />
          {/* Brazil Highlight polygon */}
          <path
            d="M230 260 Q290 270 305 320 T275 385 T235 370 T220 300 Z"
            fill="#15803d"
            className="transition-all duration-300 hover:fill-emerald-600 cursor-pointer"
            onMouseEnter={() => setHoveredCountry(BRICS_COUNTRIES['Brazil'])}
            onMouseLeave={() => setHoveredCountry(null)}
          />

          {/* Europe */}
          <path
            d="M360 80 Q430 70 470 110 T440 170 T380 150 T340 110 Z"
            fill="#e2e8f0"
            opacity="0.6"
          />

          {/* Russia / Eurasia Highlight */}
          <path
            d="M450 70 Q600 50 690 90 T720 160 T640 170 T520 140 T460 110 Z"
            fill="#15803d"
            className="transition-all duration-300 hover:fill-emerald-600 cursor-pointer"
            onMouseEnter={() => setHoveredCountry(BRICS_COUNTRIES['Russia'])}
            onMouseLeave={() => setHoveredCountry(null)}
          />

          {/* Africa (South Africa highlighted) */}
          <path
            d="M350 170 Q430 170 450 250 T430 360 T380 430 T340 340 T320 230 Z"
            fill="#d1d5db"
            opacity="0.7"
          />
          {/* South Africa Highlight */}
          <path
            d="M370 370 Q430 375 425 415 T380 430 T365 400 Z"
            fill="#15803d"
            className="transition-all duration-300 hover:fill-emerald-600 cursor-pointer"
            onMouseEnter={() => setHoveredCountry(BRICS_COUNTRIES['South Africa'])}
            onMouseLeave={() => setHoveredCountry(null)}
          />

          {/* Asia / India & China Highlight */}
          <path
            d="M480 170 Q560 160 680 180 T700 300 T610 320 T520 290 Z"
            fill="#e2e8f0"
            opacity="0.6"
          />
          {/* India Highlight */}
          <path
            d="M510 230 Q560 235 555 285 T530 330 T505 270 Z"
            fill="#15803d"
            className="transition-all duration-300 hover:fill-emerald-600 cursor-pointer"
            onMouseEnter={() => setHoveredCountry(BRICS_COUNTRIES['India'])}
            onMouseLeave={() => setHoveredCountry(null)}
          />
          {/* China Highlight */}
          <path
            d="M560 180 Q660 175 675 220 T660 275 T575 260 T555 210 Z"
            fill="#15803d"
            className="transition-all duration-300 hover:fill-emerald-600 cursor-pointer"
            onMouseEnter={() => setHoveredCountry(BRICS_COUNTRIES['China'])}
            onMouseLeave={() => setHoveredCountry(null)}
          />

          {/* Australia */}
          <path
            d="M620 340 Q690 330 700 380 T660 420 T610 390 Z"
            fill="#e2e8f0"
            opacity="0.6"
          />

          {/* GLOWING ORBITAL TELEMETRY ARCS */}
          {/* Brazil to South Africa */}
          <path
            d="M 270 340 Q 340 430 400 400"
            stroke="#facc15"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          {/* South Africa to India */}
          <path
            d="M 400 400 Q 480 370 535 290"
            stroke="#facc15"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          {/* India to China */}
          <path
            d="M 535 290 Q 580 280 620 235"
            stroke="#facc15"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          {/* China to Russia */}
          <path
            d="M 620 235 Q 640 180 580 130"
            stroke="#facc15"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
            strokeDasharray="8 4"
          />
          {/* Russia back to Brazil long arc */}
          <path
            d="M 580 130 Q 360 80 270 340"
            stroke="#facc15"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
            strokeDasharray="4 6"
          />

          {/* Country Center Nodes & Glowing Pulses */}
          {/* Brazil Node */}
          <g transform="translate(270, 340)">
            <circle r="14" fill="#facc15" opacity="0.25" className="animate-ping" />
            <circle r="6" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
            <text x="12" y="4" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              Brazil
            </text>
          </g>

          {/* South Africa Node */}
          <g transform="translate(400, 400)">
            <circle r="14" fill="#facc15" opacity="0.25" className="animate-ping" />
            <circle r="6" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
            <text x="-50" y="24" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              South Africa
            </text>
          </g>

          {/* India Node */}
          <g transform="translate(535, 290)">
            <circle r="16" fill="#facc15" opacity="0.35" className="animate-ping" />
            <circle r="7" fill="#facc15" stroke="#ffffff" strokeWidth="2.5" />
            <text x="-35" y="18" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              India
            </text>
          </g>

          {/* China Node */}
          <g transform="translate(620, 235)">
            <circle r="14" fill="#facc15" opacity="0.25" className="animate-ping" />
            <circle r="6" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
            <text x="12" y="4" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              China
            </text>
          </g>

          {/* Russia Node */}
          <g transform="translate(580, 130)">
            <circle r="14" fill="#facc15" opacity="0.25" className="animate-ping" />
            <circle r="6" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
            <text x="12" y="4" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              Russia
            </text>
          </g>
        </svg>

        {/* Hover telemetry tooltip */}
        {hoveredCountry && (
          <div className="absolute top-2 left-2 sm:left-6 bg-slate-900/90 text-white backdrop-blur-md rounded-xl p-3 shadow-xl border border-slate-700 text-xs pointer-events-none z-20 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-400 mb-1">
              <span>{hoveredCountry.flag}</span>
              <span>{hoveredCountry.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300">
              <div><span className="text-slate-400">Farmers:</span> {hoveredCountry.farmers}</div>
              <div><span className="text-slate-400">Coverage:</span> {hoveredCountry.hectares}</div>
              <div className="col-span-2"><span className="text-slate-400">Focus Crops:</span> {hoveredCountry.keyCrops}</div>
              <div className="col-span-2 text-amber-300 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" /> {hoveredCountry.techNodes}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mini status indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          5 Nations Sync Active
        </span>
        <span className="text-slate-400">Live Satellite Telemetry</span>
      </div>
    </div>
  );
};
