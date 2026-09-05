import React, { useState } from 'react';
import {
  Droplets,
  MapPin,
  ChevronDown,
  HelpCircle,
  Check,
  CheckCircle2,
  Power,
  Clock,
  Activity,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Sliders,
  AlertCircle,
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

interface IrrigationViewProps {
  onOpenHelp?: () => void;
}

interface IrrigationZone {
  id: string;
  name: string;
  crop: string;
  moisture: number;
  targetMoisture: number;
  status: 'active' | 'standby' | 'scheduled';
  mode: 'auto' | 'manual';
  valveOpen: boolean;
  flowRate: number; // L/min
  nextRun: string;
  durationMinutes: number;
}

const INITIAL_ZONES: IrrigationZone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1: North Plot',
    crop: 'Wheat (PBW 343)',
    moisture: 34,
    targetMoisture: 32,
    status: 'standby',
    mode: 'auto',
    valveOpen: false,
    flowRate: 0,
    nextRun: 'Tomorrow at 06:00 AM',
    durationMinutes: 45,
  },
  {
    id: 'zone-2',
    name: 'Zone 2: East Plot',
    crop: 'Sugarcane (Co 0238)',
    moisture: 24,
    targetMoisture: 30,
    status: 'active',
    mode: 'auto',
    valveOpen: true,
    flowRate: 42,
    nextRun: 'Currently Running',
    durationMinutes: 60,
  },
  {
    id: 'zone-3',
    name: 'Zone 3: Central Block',
    crop: 'Maize (HQPM 1)',
    moisture: 28,
    targetMoisture: 30,
    status: 'scheduled',
    mode: 'auto',
    valveOpen: false,
    flowRate: 0,
    nextRun: 'Today at 05:30 PM',
    durationMinutes: 30,
  },
  {
    id: 'zone-4',
    name: 'Zone 4: Terraces',
    crop: 'Mustard (RH 749)',
    moisture: 31,
    targetMoisture: 28,
    status: 'standby',
    mode: 'auto',
    valveOpen: false,
    flowRate: 0,
    nextRun: 'Wednesday at 07:00 AM',
    durationMinutes: 40,
  },
];

const WATER_CONSUMPTION_SERIES = [
  { day: 'Mon', actual: 4200, aiOptimized: 3100 },
  { day: 'Tue', actual: 3800, aiOptimized: 2900 },
  { day: 'Wed', actual: 4900, aiOptimized: 3600 },
  { day: 'Thu', actual: 3100, aiOptimized: 2400 },
  { day: 'Fri', actual: 4400, aiOptimized: 3200 },
  { day: 'Sat', actual: 4100, aiOptimized: 3000 },
  { day: 'Sun', actual: 3600, aiOptimized: 2600 },
];

export const IrrigationView: React.FC<IrrigationViewProps> = ({ onOpenHelp }) => {
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Punjab, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [zones, setZones] = useState<IrrigationZone[]>(INITIAL_ZONES);

  const toggleValve = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const newValve = !z.valveOpen;
          return {
            ...z,
            valveOpen: newValve,
            status: newValve ? 'active' : 'standby',
            flowRate: newValve ? 38 : 0,
          };
        }
        return z;
      })
    );
  };

  const toggleMode = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, mode: z.mode === 'auto' ? 'manual' : 'auto' } : z))
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. TOP HEADER ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span>Precision Irrigation</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Automated solenoid valve network, soil water depletion & evapotranspiration compensation
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

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>4 Valves Connected</span>
          </div>

          <button
            onClick={onOpenHelp}
            title="Irrigation Telemetry Documentation"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. STATS ROW (Responsive: 4 cols -> 2 cols -> 1 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Water Saved This Month</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">18,400 L</div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            -26% vs conventional flood irrigation
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Current Flow Rate</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">42 L/min</div>
          <p className="text-[11px] text-blue-700 font-semibold">
            Zone 2 (East Plot) actively irrigating
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Soil Water Deficit</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">-4.2 mm</div>
          <p className="text-[11px] text-slate-500 font-normal">
            Compensated by tonight's auto schedule
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Solenoid Health</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">100% Online</div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            All pressure sensors calibrated
          </p>
        </div>
      </div>

      {/* 3. SOLENOID VALVE CONTROLLERS GRID (Responsive: 2 cols -> 1 col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => {
          const isStressed = zone.moisture < zone.targetMoisture - 3;

          return (
            <div
              key={zone.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs flex flex-col justify-between transition-all ${
                zone.valveOpen ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                {/* Zone Header */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{zone.name}</h3>
                    <div className="text-xs text-slate-500">{zone.crop}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleMode(zone.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase transition-colors ${
                        zone.mode === 'auto'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {zone.mode}
                    </button>

                    <button
                      onClick={() => toggleValve(zone.id)}
                      className={`p-2 rounded-xl border font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        zone.valveOpen
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                      title={zone.valveOpen ? 'Turn Valve OFF' : 'Turn Valve ON'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span className="text-xs">{zone.valveOpen ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

                {/* Moisture Gauge Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Hydration Level</span>
                    <span className="font-extrabold text-slate-900">
                      {zone.moisture}% <span className="font-normal text-slate-400">/ target {zone.targetMoisture}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isStressed ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, (zone.moisture / 45) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Zone Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Flow Rate</div>
                    <div className="font-bold text-slate-800">{zone.flowRate} L/min</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Runtime Scheduled</div>
                    <div className="font-bold text-slate-800">{zone.durationMinutes} minutes</div>
                  </div>
                </div>
              </div>

              {/* Zone Footer */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{zone.nextRun}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    zone.valveOpen
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {zone.valveOpen ? 'Valve Active' : 'Standby'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. WATER CONSUMPTION & AI SAVINGS CHART */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">7-Day Irrigation Water Usage vs AI Savings</h3>
            <p className="text-xs text-slate-500">Telemetry comparison (Liters)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="text-slate-600">Conventional Base</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="font-bold text-blue-700">AgriN Optimized</span>
            </div>
          </div>
        </div>

        <div className="h-52 sm:h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WATER_CONSUMPTION_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  border: 'none',
                }}
              />
              <Bar dataKey="actual" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Conventional (L)" />
              <Bar dataKey="aiOptimized" fill="#2563eb" radius={[4, 4, 0, 0]} name="AgriN AI Optimized (L)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
