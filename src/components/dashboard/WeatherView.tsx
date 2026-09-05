import React, { useState } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  ChevronDown,
  HelpCircle,
  Check,
  AlertTriangle,
  ArrowRight,
  Clock,
  Compass,
  Zap,
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

interface WeatherViewProps {
  onOpenHelp?: () => void;
}

const HOURLY_WEATHER_DATA = [
  { hour: '06:00', temp: 22, rainProb: 0, et0: 0.1, wind: 6 },
  { hour: '09:00', temp: 27, rainProb: 5, et0: 0.4, wind: 8 },
  { hour: '12:00', temp: 32, rainProb: 10, et0: 0.9, wind: 12 },
  { hour: '15:00', temp: 34, rainProb: 15, et0: 0.8, wind: 14 },
  { hour: '18:00', temp: 30, rainProb: 20, et0: 0.4, wind: 10 },
  { hour: '21:00', temp: 25, rainProb: 5, et0: 0.1, wind: 7 },
];

const SEVEN_DAY_FORECAST = [
  { day: 'Mon Today', tempMax: 32, tempMin: 20, condition: 'Partly Cloudy', icon: CloudSun, rain: '10%', et0: '4.2mm' },
  { day: 'Tue May 19', tempMax: 33, tempMin: 21, condition: 'Sunny & Warm', icon: Sun, rain: '5%', et0: '4.8mm' },
  { day: 'Wed May 20', tempMax: 30, tempMin: 22, condition: 'Thunderstorm', icon: CloudLightning, rain: '65%', et0: '2.1mm' },
  { day: 'Thu May 21', tempMax: 29, tempMin: 19, condition: 'Scattered Showers', icon: CloudRain, rain: '45%', et0: '2.8mm' },
  { day: 'Fri May 22', tempMax: 31, tempMin: 20, condition: 'Clear Sky', icon: Sun, rain: '0%', et0: '4.5mm' },
  { day: 'Sat May 23', tempMax: 32, tempMin: 21, condition: 'Partly Cloudy', icon: CloudSun, rain: '15%', et0: '4.1mm' },
  { day: 'Sun May 24', tempMax: 34, tempMin: 22, condition: 'Sunny High PAR', icon: Sun, rain: '5%', et0: '5.0mm' },
];

export const WeatherView: React.FC<WeatherViewProps> = ({ onOpenHelp }) => {
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Punjab, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* 1. TOP HEADER ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-500" />
            <span>Agro-Weather & Microclimate</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Hyper-local weather telemetry, evapotranspiration (ET₀) & agricultural spray windows
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
            <span>Live Radar Active</span>
          </div>

          <button
            onClick={onOpenHelp}
            title="Weather Guide"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CURRENT CONDITIONS HERO BANNER (Responsive flex / grid) */}
      <div className="bg-gradient-to-r from-[#1c4d28] via-[#215d31] to-[#174322] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0">
            <CloudSun className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black tracking-tight">32°C</span>
              <span className="text-sm sm:text-base text-emerald-200 font-medium">Feels like 34°C</span>
            </div>
            <div className="text-sm font-bold text-white mt-1">Partly Cloudy • High PAR Solar Window</div>
            <p className="text-xs text-emerald-200/90 mt-0.5">Punjab Agrometeorological Station #04</p>
          </div>
        </div>

        {/* 4 Microclimate Badges (2x2 grid on mobile, 4 in row on tablet/desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-6">
          <div className="space-y-0.5">
            <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
              <Droplets className="w-3 h-3" /> Humidity
            </div>
            <div className="text-base font-extrabold text-white">54%</div>
            <div className="text-[10px] text-emerald-200">Dew Point: 18°C</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
              <Wind className="w-3 h-3" /> Wind Speed
            </div>
            <div className="text-base font-extrabold text-white">12 km/h</div>
            <div className="text-[10px] text-emerald-200">Direction: NE</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
              <Sun className="w-3 h-3" /> Solar PAR
            </div>
            <div className="text-base font-extrabold text-white">21.4 MJ/m²</div>
            <div className="text-[10px] text-emerald-200">UV Index: 6 (Mod)</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> ET₀ Water Loss
            </div>
            <div className="text-base font-extrabold text-white">4.2 mm/d</div>
            <div className="text-[10px] text-emerald-200">Moderate Evapo</div>
          </div>
        </div>
      </div>

      {/* 3. AGRICULTURAL SPRAY ADVISORY CALLOUT */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="font-bold text-emerald-950">Optimal Spray Feasibility Window:</span>
            <span className="text-emerald-800 ml-1.5">
              Tomorrow 06:00 – 09:30 AM (Wind &lt; 8 km/h, Temperature 23°C, 0% Rain).
            </span>
          </div>
        </div>
        <span className="text-[10px] font-extrabold px-3 py-1 bg-emerald-700 text-white rounded-lg whitespace-nowrap">
          Ideal for Foliar Spray
        </span>
      </div>

      {/* 4. 7-DAY FORECAST GRID (Responsive: 7 cols -> 4 cols -> 2 cols -> 1 col) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <h2 className="text-sm font-extrabold text-slate-900">7-Day Agro-Meteorological Forecast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {SEVEN_DAY_FORECAST.map((f, i) => {
            const Icon = f.icon;
            const isRainy = parseInt(f.rain) > 30;

            return (
              <div
                key={f.day}
                className={`p-3 rounded-xl border flex flex-col justify-between items-center text-center space-y-2 ${
                  i === 0
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : isRainy
                    ? 'bg-blue-50/50 border-blue-200'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="text-xs font-bold text-slate-800">{f.day}</div>
                <Icon className={`w-7 h-7 ${isRainy ? 'text-blue-500' : 'text-amber-500'}`} />
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {f.tempMax}° / {f.tempMin}°
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{f.condition}</div>
                </div>
                <div className="w-full pt-1.5 border-t border-slate-200/60 flex justify-between text-[10px] text-slate-500">
                  <span>Rain: {f.rain}</span>
                  <span className="font-semibold text-slate-700">{f.et0}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. DIURNAL HOURLY TREND CHART (Responsive) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Diurnal Temperature & Precipitation Forecast</h3>
            <p className="text-xs text-slate-500">24-hour microclimate trajectory</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
            Hourly Resolution
          </span>
        </div>

        <div className="h-52 sm:h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_WEATHER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={[15, 40]} stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                dataKey="temp"
                name="Temperature (°C)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
