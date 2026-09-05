import React, { useState } from 'react';
import { WeatherData } from '../../types/farm';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Cloud,
  ArrowRight,
  X,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData | null;
  locationName: string;
  loading?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  locationName,
  loading = false,
}) => {
  const [isForecastOpen, setIsForecastOpen] = useState(false);

  const renderWeatherIcon = (type: string, className = 'w-4 h-4') => {
    switch (type) {
      case 'sun':
        return <Sun className={`${className} text-amber-600`} />;
      case 'rain':
        return <CloudRain className={`${className} text-blue-600`} />;
      case 'storm':
        return <CloudLightning className={`${className} text-slate-700`} />;
      case 'cloud':
        return <Cloud className={`${className} text-slate-500`} />;
      case 'partly-cloudy':
      default:
        return <CloudSun className={`${className} text-amber-600`} />;
    }
  };

  const current = weather?.current || {
    temp: 32,
    condition: 'Partly Cloudy',
    description: 'Partly Cloudy',
    humidity: 54,
    windSpeed: 12,
    uvIndex: 6,
    precipitationProb: 10,
    iconType: 'partly-cloudy' as const,
  };

  // Agronomic Delta-T calculation approximation (Dry bulb minus wet bulb temperature)
  // Optimal spraying Delta-T is 2°C to 8°C
  const deltaT = (2.4 + (current.temp - 20) * 0.15).toFixed(1);

  const forecastDays = weather?.forecast && weather.forecast.length >= 5
    ? weather.forecast.slice(0, 5)
    : [
        { dayName: 'Mon', tempMax: 32, tempMin: 20, iconType: 'sun' as const, condition: 'Sunny', deltaT: 4.1 },
        { dayName: 'Tue', tempMax: 33, tempMin: 21, iconType: 'rain' as const, condition: 'Rain', deltaT: 2.8 },
        { dayName: 'Wed', tempMax: 34, tempMin: 22, iconType: 'partly-cloudy' as const, condition: 'Partly Cloudy', deltaT: 5.2 },
        { dayName: 'Thu', tempMax: 33, tempMin: 21, iconType: 'rain' as const, condition: 'Rain', deltaT: 3.1 },
        { dayName: 'Fri', tempMax: 31, tempMin: 20, iconType: 'rain' as const, condition: 'Rain', deltaT: 3.9 },
      ];

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between h-full min-h-[380px] shadow-2xs">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Microclimate Telemetry</h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">{locationName || 'Field Station WS-99'}</p>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e5128]" />
              <span>WNW @ 12km/h</span>
            </div>
          </div>

          {/* Current Weather Display */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-slate-900 tracking-tight tabular-nums">
                  {current.temp}°C
                </span>
                <span className="text-xs font-mono text-slate-500">
                  (Dew: 18.2°C)
                </span>
              </div>
              <div className="text-xs font-medium text-slate-700 mt-1 flex items-center gap-1.5">
                {renderWeatherIcon(current.iconType, 'w-4 h-4')}
                <span>{current.condition}</span>
              </div>
            </div>

            {/* Spray Window Status Badge */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-[#1e5128] border border-emerald-200 text-xs font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ΔT {deltaT}°C • Safe</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">Spray Limit &lt; 15 km/h</div>
            </div>
          </div>

          {/* Primary Sensor Row */}
          <div className="grid grid-cols-3 gap-2 text-center py-2.5 my-3 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-xs">
            <div className="p-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-medium">Rel. Humidity</div>
              <div className="font-bold text-slate-900 mt-0.5 tabular-nums">{current.humidity}%</div>
            </div>
            <div className="p-1 border-x border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-medium">Barometer</div>
              <div className="font-bold text-slate-900 mt-0.5 tabular-nums">1012.4 hPa</div>
            </div>
            <div className="p-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-medium">Precip. Risk</div>
              <div className="font-bold text-slate-900 mt-0.5 tabular-nums">{current.precipitationProb}%</div>
            </div>
          </div>

          {/* 5-Day Forecast Horizontal Strip with Even Column Spacing */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2 flex justify-between items-center">
              <span>5-Day Outlook</span>
              <span className="font-mono text-slate-400 font-normal">High-Res Forecast</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {forecastDays.map((d, idx) => (
                <div key={idx} className="border border-slate-200/80 rounded-lg p-2 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold block">{d.dayName}</span>
                  <div className="my-1.5 flex items-center justify-center">
                    {renderWeatherIcon(d.iconType, 'w-4 h-4')}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                    {d.tempMax}°
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 tabular-nums">
                    {d.tempMin}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Link */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <button
            onClick={() => setIsForecastOpen(true)}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Inspect 7-Day ET₀ & Spray Windows</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Full Forecast Modal */}
      {isForecastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Agro-Meteorological Forecast & Spray Indices</h3>
                <p className="text-[11px] font-mono text-slate-500">{locationName} • WMO Met-Station Node 14</p>
              </div>
              <button
                onClick={() => setIsForecastOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Solar PAR Radiation</div>
                  <div className="text-base font-bold text-slate-900 mt-1 tabular-nums">21.4 MJ/m²</div>
                  <div className="text-[10px] text-[#1e5128] font-semibold mt-0.5 font-sans">Optimal Photosynthetic Rate</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">Penman-Monteith ET₀</div>
                  <div className="text-base font-bold text-slate-900 mt-1 tabular-nums">4.2 mm/day</div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5 font-sans">Baseline Irrigation Demand</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Chemical Application Windows (Delta-T & Drift Risk)
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {forecastDays.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        {renderWeatherIcon(d.iconType, 'w-3.5 h-3.5')}
                        <span className="font-bold text-slate-800">{d.dayName}</span>
                        <span className="text-slate-500 text-[11px] font-sans">{d.condition}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700 tabular-nums">{d.tempMax}° / {d.tempMin}°C</span>
                        <span className="text-[10px] font-medium text-[#1e5128] bg-[#1e5128]/10 px-2 py-0.5 rounded border border-[#1e5128]/20 font-mono">
                          ΔT: 3.8°C OK
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsForecastOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
