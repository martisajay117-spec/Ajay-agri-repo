import React, { useState } from 'react';
import { ArrowRight, Sparkles, Droplets, Leaf, ChevronDown, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Hero: React.FC = () => {
  const { openModal, setCurrentView } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [showAiDetails, setShowAiDetails] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoRequested, setDemoRequested] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(true);

  const handleExploreClick = () => {
    setCurrentView('dashboard');
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#eaf4fc] via-[#f7faf8] to-[#fafaf9] pt-24 sm:pt-28 pb-12 lg:pb-16">
      
      {/* Background Soft Blue Sky with Clouds & Crop Field Horizon */}
      <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden">
        {/* Soft Sky Blue Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-[#cae6f8] via-[#e2f0fb] to-transparent opacity-80" />
        
        {/* Subtle Fluffy White Clouds */}
        <div className="absolute top-8 left-10 w-96 h-32 bg-white/60 blur-2xl rounded-full" />
        <div className="absolute top-4 left-1/3 w-[500px] h-36 bg-white/70 blur-3xl rounded-full" />
        <div className="absolute top-12 right-20 w-80 h-28 bg-white/50 blur-2xl rounded-full" />

        {/* Bottom Horizon Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fafaf9] to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* 3-Column Panoramic Composition Matching Target Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* ======================================================== */}
          {/* COLUMN 1 (lg:col-span-5): Farmer, Orbiting Satellite & Metric Overlays */}
          {/* ======================================================== */}
          <div className="order-2 lg:order-1 lg:col-span-5 relative min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-end">
            
            {/* 3D Realistic Orbiting Satellite in Top Sky with Beaming Telemetry */}
            <div className="absolute top-0 left-1/4 sm:left-44 z-20 select-none pointer-events-none">
              <svg className="w-24 h-24 sm:w-40 sm:h-40 drop-shadow-md" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dashed Telemetry Laser Beams pointing down toward Tablet */}
                <path d="M70 85 L25 240" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <path d="M80 85 L35 245" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
                <path d="M90 85 L45 240" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                {/* Satellite Body & Solar Panels */}
                <g transform="rotate(-30 80 80)">
                  {/* Left Solar Panel */}
                  <rect x="15" y="68" width="40" height="24" rx="2" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                  <line x1="28" y1="68" x2="28" y2="92" stroke="#60a5fa" strokeWidth="1" />
                  <line x1="41" y1="68" x2="41" y2="92" stroke="#60a5fa" strokeWidth="1" />
                  <line x1="15" y1="80" x2="55" y2="80" stroke="#60a5fa" strokeWidth="1" />

                  {/* Right Solar Panel */}
                  <rect x="105" y="68" width="40" height="24" rx="2" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                  <line x1="118" y1="68" x2="118" y2="92" stroke="#60a5fa" strokeWidth="1" />
                  <line x1="131" y1="68" x2="131" y2="92" stroke="#60a5fa" strokeWidth="1" />
                  <line x1="105" y1="80" x2="145" y2="80" stroke="#60a5fa" strokeWidth="1" />

                  {/* Satellite Core Chassis */}
                  <rect x="62" y="64" width="36" height="32" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                  <rect x="68" y="70" width="24" height="20" rx="2" fill="#94a3b8" />
                  <circle cx="80" cy="80" r="4" fill="#38bdf8" className="animate-ping" />
                  <circle cx="80" cy="80" r="3" fill="#0284c7" />

                  {/* Antenna Dish */}
                  <path d="M80 64 L80 50" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <path d="M72 50 Q80 44 88 50" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                  <circle cx="80" cy="46" r="2" fill="#f59e0b" />
                </g>
              </svg>
            </div>

            {/* Farmer in Field Visual with Integrated Foreground Crops */}
            <div className="relative w-full h-[460px] sm:h-[560px] lg:h-[600px] overflow-visible flex items-end">
              
              {/* Farmer Composite Container */}
              <div className="relative w-full max-w-[calc(100%-110px)] sm:max-w-[380px] lg:max-w-[420px] h-[440px] sm:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent">
                
                {/* Real High-Resolution Photorealistic Farmer in Field */}
                {imgLoaded ? (
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85"
                    alt="Indian Farmer using digital agriculture tablet in green crop field"
                    referrerPolicy="no-referrer"
                    onError={() => setImgLoaded(false)}
                    className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
                  />
                ) : (
                  /* High Fidelity Graphic Fallback */
                  <div className="w-full h-full bg-gradient-to-b from-[#87ceeb] via-[#bbf7d0] to-[#14532d] flex flex-col justify-end p-6 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                  </div>
                )}

                {/* Sky and Crop Field Depth Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a14]/90 via-[#0d2a14]/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fafaf9]/40 pointer-events-none" />

                {/* Farmer Digital Tablet Glow Effect */}
                <div className="absolute bottom-32 left-10 sm:left-20 w-44 h-32 bg-sky-400/25 blur-xl rounded-full pointer-events-none" />
              </div>

              {/* 4 Vertical Floating Metric Cards (Stacked to the right of the Farmer) */}
              <div className="absolute top-4 sm:top-6 right-0 sm:-right-4 flex flex-col gap-2 z-30 w-[115px] sm:w-[155px]">
                
                {/* 1. Field Health Index Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100/90 transition-all hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center justify-between text-slate-700 text-[11px] font-semibold mb-1">
                    <span>Field Health Index</span>
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  {/* Circular Arc Gauge */}
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center my-0.5">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray="78, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-bold text-slate-900 leading-none">78</span>
                      <span className="text-[9px] text-slate-400 font-medium">/100</span>
                      <span className="text-[10px] text-emerald-600 font-bold leading-none mt-0.5">Good</span>
                    </div>
                  </div>
                </div>

                {/* 2. Soil Moisture Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100/90 transition-all hover:scale-105 hover:shadow-xl">
                  <div className="text-slate-700 text-[11px] font-semibold mb-1">
                    Soil Moisture
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-4 h-4 fill-blue-500 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 leading-none">28%</div>
                      <div className="text-[10px] text-blue-600 font-bold mt-0.5">Optimal</div>
                    </div>
                  </div>
                </div>

                {/* 3. Organic Matter Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100/90 transition-all hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center justify-between text-slate-700 text-[11px] font-semibold mb-0.5">
                    <span>Organic Matter</span>
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 leading-tight">2.45%</div>
                    <div className="text-[10px] text-emerald-600 font-bold">Good</div>
                  </div>
                </div>

                {/* 4. Nitrogen Level Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100/90 transition-all hover:scale-105 hover:shadow-xl">
                  <div className="text-slate-700 text-[11px] font-semibold mb-0.5">
                    Nitrogen Level
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-slate-900 leading-tight">
                        32 <span className="text-[10px] font-normal text-slate-500">kg/ha</span>
                      </div>
                      <div className="text-[10px] text-blue-600 font-bold">Optimal</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
                      N
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom-Left Translucent Dark Green AI Recommendation Box */}
              <div className="absolute bottom-4 left-3 sm:left-4 z-30 max-w-[270px] sm:max-w-[290px] bg-[#143d1c]/90 backdrop-blur-md rounded-2xl p-4 text-white shadow-2xl border border-white/25">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>AI Recommendation</span>
                </div>
                <div className="space-y-1 text-xs text-white/90 font-normal leading-relaxed mb-3">
                  <p>Apply organic compost in 7 days</p>
                  <p>Irrigation recommended in 3 days</p>
                </div>
                <button
                  onClick={() => setShowAiDetails(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#255230] hover:bg-[#2e623a] text-[11px] font-medium text-white border border-white/20 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>


          {/* ======================================================== */}
          {/* COLUMN 2 (lg:col-span-3 or center flow): Typography & CTAs */}
          {/* ======================================================== */}
          <div className="order-1 lg:order-2 lg:col-span-3 flex flex-col justify-center space-y-4 pt-2 lg:pt-0">
            
            {/* Green Pill Badge matching screenshot */}
            <div className="inline-flex items-center self-start px-3.5 py-1 rounded-full bg-[#e4f4e8] text-[#1b7a37] text-[11px] font-bold tracking-wider uppercase">
              AI-POWERED. DATA-DRIVEN. PLANET-POSITIVE.
            </div>

            {/* Exact 3-line Headline matching screenshot */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Empowering Farmers.<br />
              Strengthening Nations.<br />
              <span className="text-[#1b7a37]">
                Sustaining the Future.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal">
              AgriN is the intelligence platform driving regenerative agriculture and food security across BRICS nations and beyond.
            </p>

            {/* Buttons Side by Side matching screenshot */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-btn"
                onClick={handleExploreClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1e562c] hover:bg-[#164422] active:scale-[0.98] rounded-xl shadow-md transition-all focus:outline-none"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-demo-btn"
                onClick={() => setShowDemoModal(true)}
                className="px-5 py-3 text-sm font-medium text-slate-800 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-sm focus:outline-none"
              >
                Request Demo
              </button>
            </div>

          </div>


          {/* ======================================================== */}
          {/* COLUMN 3 (lg:col-span-4): BRICS Network World Map Card */}
          {/* ======================================================== */}
          <div className="order-3 lg:order-3 lg:col-span-4">
            <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_12px_35px_rgba(0,0,0,0.06)] flex flex-col justify-between relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    BRICS Network
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[210px] mt-0.5">
                    Connecting data. Sharing knowledge. Building a sustainable future.
                  </p>
                </div>

                {/* Countries Dropdown Pill */}
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="appearance-none bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-lg border border-slate-200 cursor-pointer transition-colors focus:outline-none"
                  >
                    <option value="All">BRICS Countries</option>
                    <option value="Brazil">🇧🇷 Brazil</option>
                    <option value="Russia">🇷🇺 Russia</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="China">🇨🇳 China</option>
                    <option value="South Africa">🇿🇦 South Africa</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* World Map with 5 Highlighted Green BRICS Countries & Golden Glowing Network Arcs */}
              <div className="relative w-full h-[280px] sm:h-[320px] my-1 flex items-center justify-center select-none bg-slate-50/50 rounded-2xl p-2">
                <svg
                  viewBox="0 0 740 460"
                  className="w-full h-full"
                >
                  {/* Continents Base in Clean Soft Gray */}
                  {/* North America */}
                  <path
                    d="M80 80 Q140 60 190 90 T240 140 T210 200 T150 210 T100 160 Z"
                    fill="#e2e8f0"
                  />
                  {/* South America Base */}
                  <path
                    d="M210 230 Q270 240 310 290 T290 390 T240 430 T200 340 T190 270 Z"
                    fill="#e2e8f0"
                  />
                  {/* Brazil Highlight in Rich Emerald Green */}
                  <path
                    d="M230 255 Q290 265 305 315 T275 380 T235 365 T220 295 Z"
                    fill="#15803d"
                    className="transition-colors hover:fill-emerald-600"
                  />

                  {/* Europe Base */}
                  <path
                    d="M360 80 Q430 70 470 110 T440 170 T380 150 T340 110 Z"
                    fill="#e2e8f0"
                  />

                  {/* Russia Highlight in Rich Emerald Green */}
                  <path
                    d="M450 70 Q600 50 690 90 T720 160 T640 170 T520 140 T460 110 Z"
                    fill="#15803d"
                    className="transition-colors hover:fill-emerald-600"
                  />

                  {/* Africa Base */}
                  <path
                    d="M350 170 Q430 170 450 250 T430 360 T380 430 T340 340 T320 230 Z"
                    fill="#e2e8f0"
                  />
                  {/* South Africa Highlight in Rich Emerald Green */}
                  <path
                    d="M370 370 Q430 375 425 415 T380 430 T365 400 Z"
                    fill="#15803d"
                    className="transition-colors hover:fill-emerald-600"
                  />

                  {/* Asia Base */}
                  <path
                    d="M480 170 Q560 160 680 180 T700 300 T610 320 T520 290 Z"
                    fill="#e2e8f0"
                  />
                  {/* India Highlight in Rich Emerald Green */}
                  <path
                    d="M510 230 Q560 235 555 285 T530 330 T505 270 Z"
                    fill="#15803d"
                    className="transition-colors hover:fill-emerald-600"
                  />
                  {/* China Highlight in Rich Emerald Green */}
                  <path
                    d="M560 180 Q660 175 675 220 T660 275 T575 260 T555 210 Z"
                    fill="#15803d"
                    className="transition-colors hover:fill-emerald-600"
                  />

                  {/* Australia */}
                  <path
                    d="M620 340 Q690 330 700 380 T660 420 T610 390 Z"
                    fill="#e2e8f0"
                  />

                  {/* Golden Yellow Glowing Telemetry Arcs */}
                  {/* Brazil to South Africa */}
                  <path
                    d="M 270 340 Q 340 430 400 400"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.95"
                  />
                  {/* South Africa to India */}
                  <path
                    d="M 400 400 Q 480 370 535 290"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.95"
                  />
                  {/* India to China */}
                  <path
                    d="M 535 290 Q 580 280 620 235"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.95"
                  />
                  {/* China to Russia */}
                  <path
                    d="M 620 235 Q 640 180 580 130"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.95"
                  />
                  {/* Russia to Brazil loop */}
                  <path
                    d="M 580 130 Q 380 70 270 340"
                    stroke="#facc15"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.5"
                    strokeDasharray="4 4"
                  />

                  {/* Glowing Nodes & Country Labels */}
                  {/* Brazil */}
                  <g transform="translate(270, 340)">
                    <circle r="10" fill="#facc15" opacity="0.4" className="animate-ping" />
                    <circle r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                    <text x="10" y="4" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                      Brazil
                    </text>
                  </g>

                  {/* South Africa */}
                  <g transform="translate(400, 400)">
                    <circle r="10" fill="#facc15" opacity="0.4" className="animate-ping" />
                    <circle r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                    <text x="-40" y="22" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                      South Africa
                    </text>
                  </g>

                  {/* India */}
                  <g transform="translate(535, 290)">
                    <circle r="12" fill="#facc15" opacity="0.4" className="animate-ping" />
                    <circle r="6" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                    <text x="-35" y="16" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                      India
                    </text>
                  </g>

                  {/* China */}
                  <g transform="translate(620, 235)">
                    <circle r="10" fill="#facc15" opacity="0.4" className="animate-ping" />
                    <circle r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                    <text x="10" y="4" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                      China
                    </text>
                  </g>

                  {/* Russia */}
                  <g transform="translate(580, 130)">
                    <circle r="10" fill="#facc15" opacity="0.4" className="animate-ping" />
                    <circle r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                    <text x="10" y="4" fill="#0f3a1f" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                      Russia
                    </text>
                  </g>
                </svg>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* AI Recommendation Details Modal */}
      {showAiDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowAiDetails(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-lg mb-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Agronomic Advisory Insights</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Synthesized from Sentinel-2 multispectral imagery, hyper-local ground IoT sensors, and predictive climate models.
            </p>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
                <div className="font-semibold text-emerald-900 mb-1">🌱 Soil Organic Compost Protocol</div>
                <p>Nitrogen uptake is currently at 32 kg/ha (optimal). Applying 1.2 tonnes/ha of organic vermicompost in 7 days will protect micro-nutrients during the upcoming flowering stage.</p>
              </div>
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80">
                <div className="font-semibold text-blue-900 mb-1">💧 Precision Irrigation Schedule</div>
                <p>Soil moisture currently sits at 28%. Rain probability is 12% over next 72h. Scheduled micro-drip irrigation for 45 mins at dawn on Day 3 to prevent root thermal stress.</p>
              </div>
            </div>
            <button
              onClick={() => setShowAiDetails(false)}
              className="w-full mt-5 py-2.5 bg-[#1e562c] text-white font-semibold text-xs rounded-xl hover:bg-[#164422] transition-colors"
            >
              Close Advisory
            </button>
          </div>
        </div>
      )}

      {/* Request Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => {
                setShowDemoModal(false);
                setDemoRequested(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!demoRequested ? (
              <div>
                <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-1">
                  <span>Schedule an AgriN Demo</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Experience full platform capabilities with one of our BRICS agricultural intelligence specialists.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDemoRequested(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email or Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="agri-leader@agency.gov / +1..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Region</label>
                    <input
                      type="text"
                      required
                      placeholder="Ministry of Agriculture / Research Lab"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1e562c] text-white font-semibold text-xs rounded-xl hover:bg-[#164422] transition-colors mt-2"
                  >
                    Request Demo Session
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Demo Request Received!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Our regional team will contact you within 24 hours to schedule your personalized live demonstration.
                </p>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    setDemoRequested(false);
                  }}
                  className="px-6 py-2 bg-[#1e562c] text-white text-xs font-semibold rounded-lg"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
