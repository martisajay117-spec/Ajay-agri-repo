import React, { useState } from 'react';
import {
  Sprout,
  MapPin,
  ChevronDown,
  HelpCircle,
  Check,
  Droplets,
  Activity,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

interface SoilHealthViewProps {
  onOpenHelp?: () => void;
}

const MOISTURE_SERIES = [
  { day: 'May 01', moisture: 29, temp: 22 },
  { day: 'May 04', moisture: 34, temp: 23 },
  { day: 'May 07', moisture: 31, temp: 24 },
  { day: 'May 10', moisture: 28, temp: 26 },
  { day: 'May 13', moisture: 35, temp: 25 },
  { day: 'May 16', moisture: 32, temp: 27 },
  { day: 'May 18', moisture: 31, temp: 26 },
];

const SOIL_DEPTH_LAYERS = [
  { depth: '0 – 15 cm (Topsoil)', moisture: '34%', organicMatter: '3.1%', microbes: 'High Activity', status: 'Optimal' },
  { depth: '15 – 30 cm (Rootzone)', moisture: '31%', organicMatter: '2.8%', microbes: 'Active Mycorrhizae', status: 'Optimal' },
  { depth: '30 – 60 cm (Subsoil)', moisture: '27%', organicMatter: '1.9%', microbes: 'Moderate Mineral', status: 'Stable' },
];

const NUTRIENT_ITEMS = [
  { name: 'Nitrogen (N)', current: 34, target: 35, unit: 'kg/ha', status: 'Optimal', color: '#16a34a' },
  { name: 'Phosphorus (P)', current: 26, target: 25, unit: 'kg/ha', status: 'Balanced', color: '#3b82f6' },
  { name: 'Potassium (K)', current: 195, target: 200, unit: 'kg/ha', status: 'Optimal', color: '#8b5cf6' },
  { name: 'Sulfur (S)', current: 18, target: 20, unit: 'ppm', status: 'Sufficient', color: '#f59e0b' },
  { name: 'Zinc (Zn)', current: 1.4, target: 1.5, unit: 'ppm', status: 'Adequate', color: '#06b6d4' },
  { name: 'Iron (Fe)', current: 8.6, target: 8.0, unit: 'ppm', status: 'High', color: '#10b981' },
];

export const SoilHealthView: React.FC<SoilHealthViewProps> = ({ onOpenHelp }) => {
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Punjab, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [selectedDepth, setSelectedDepth] = useState('15 – 30 cm (Rootzone)');

  return (
    <div className="w-full space-y-4">
      {/* 1. TOP HEADER ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>Soil Health</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Real-time IoT probe telemetry, organic carbon & nutrient depth stratigraphy
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Farm Selector */}
          <div className="relative">
            <button
              onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs max-w-[260px] sm:max-w-none truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{selectedFarm}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
            {farmDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setFarmDropdownOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {['Green Valley Farm - Punjab, India', 'Highland Terraces - Punjab, India', 'Agro-BRICS Model Plot - Brazil'].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setSelectedFarm(f);
                        setFarmDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                        selectedFarm === f ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{f}</span>
                      {selectedFarm === f && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* IoT Probes Active Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>5 IoT Probes Live</span>
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            title="Soil Telemetry Help"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 4 CORE METRIC CARDS (Responsive: 4 cols -> 2 cols -> 1 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Soil Health Index</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">84 / 100</div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+3.2 pts vs last month (Optimal)</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Rootzone Moisture</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">31.4%</div>
          <p className="text-[11px] text-blue-700 font-semibold">
            Field capacity: 32% (Stable hydration)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Soil Organic Carbon</span>
            <Sprout className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">2.85%</div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            High organic carbon sequestration
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Soil pH Balance</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">6.8 pH</div>
          <p className="text-[11px] text-purple-700 font-semibold">
            Neutral balanced (Ideal for Wheat)
          </p>
        </div>
      </div>

      {/* 3. MAIN SECTION: DEPTH STRATIGRAPHY & NPK SENSORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (lg:col-span-7): Depth Layers & Trend Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Soil Moisture & Depth Profile</h2>
              <p className="text-xs text-slate-500">Multi-depth wireless capacitive capacitance sensors</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Live Feed
            </span>
          </div>

          {/* Depth Layer Selector Buttons */}
          <div className="space-y-2">
            {SOIL_DEPTH_LAYERS.map((layer) => (
              <div
                key={layer.depth}
                onClick={() => setSelectedDepth(layer.depth)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  selectedDepth === layer.depth
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{layer.depth}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Organic Matter: <strong>{layer.organicMatter}</strong> • Biology: {layer.microbes}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-sm font-extrabold text-emerald-800">{layer.moisture}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                    {layer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Soil Moisture 30-Day Trend Chart */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
              <span>Hydration Trend (% VWC)</span>
              <span className="text-slate-400 font-normal">Past 18 Days</span>
            </div>
            <div className="h-48 sm:h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOISTURE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="soilMoistGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[20, 40]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#soilMoistGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-5): NPK Nutrients & Lab Sync */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Nutrient & Mineral Levels</h3>
                <p className="text-[11px] text-slate-500">Optical spectrometer & chemical probe telemetry</p>
              </div>
              <button
                onClick={() => {}}
                title="Refresh Readings"
                className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {NUTRIENT_ITEMS.map((item) => {
                const ratio = Math.min(100, Math.round((item.current / item.target) * 100));
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-extrabold text-slate-900">
                          {item.current} {item.unit}
                        </span>
                        <span className="text-[10px] text-slate-400">/ {item.target}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${ratio}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro-biological Health Callout */}
            <div className="mt-4 p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mycorrhizal Fungi Colony Healthy</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Beneficial fungal hyphae network covers 88% of root surface area, enhancing phosphorus uptake by +22%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
