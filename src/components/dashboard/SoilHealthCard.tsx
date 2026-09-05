import React, { useState } from 'react';
import { Farm } from '../../types/farm';
import { ArrowRight, X, Sprout, CheckCircle2, Cpu, Battery, Radio } from 'lucide-react';

interface SoilHealthCardProps {
  farm: Farm;
}

export const SoilHealthCard: React.FC<SoilHealthCardProps> = ({ farm }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Score from 0 to 100
  const score = farm.fieldHealthIndex || 74;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreStatus = (val: number) => {
    if (val >= 80) return 'Optimal';
    if (val >= 65) return 'Good';
    if (val >= 50) return 'Adequate';
    return 'Action Needed';
  };

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between h-full min-h-[380px] shadow-2xs">
        {/* Card Header with Sensor Hardware Metadata */}
        <div>
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Soil Health & Telemetry</h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                SN-704-B • SDI-12 In-Situ Stratigraphy
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e5128]" />
              <span>Synced 4m ago</span>
            </div>
          </div>

          {/* Top Score Summary Strip */}
          <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {/* Circular Gauge */}
              <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="text-slate-100"
                    strokeWidth="9"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="text-[#1e5128] transition-all duration-700 ease-out"
                    strokeWidth="9"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-800 leading-none">{score}</span>
                  <span className="text-[8px] font-mono text-slate-400 mt-0.5">/100</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800">
                  Composite Soil Quality
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Macronutrients in balanced equilibrium
                </div>
              </div>
            </div>

            <span className="text-xs font-mono font-semibold text-[#1e5128] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
              {getScoreStatus(score)}
            </span>
          </div>

          {/* Full-Width Nutrient Parameters Ledger (Clean key-value rows with ample spacing) */}
          <div className="py-2.5 divide-y divide-slate-100 text-xs">
            {/* Organic Carbon */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 text-xs font-medium">Organic Carbon</span>
              <div className="flex items-center gap-2.5">
                <span className="font-mono tabular-nums font-semibold text-slate-900">{farm.organicMatter || 2.85}%</span>
                <span className="text-[10px] font-mono font-medium text-[#1e5128] bg-emerald-50/70 border border-emerald-200/60 px-1.5 py-0.5 rounded w-14 text-center">
                  Good
                </span>
              </div>
            </div>

            {/* Soil pH */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 text-xs font-medium">Soil pH Buffer</span>
              <div className="flex items-center gap-2.5">
                <span className="font-mono tabular-nums font-semibold text-slate-900">{farm.soilPh || 6.8}</span>
                <span className="text-[10px] font-mono font-medium text-[#1e5128] bg-emerald-50/70 border border-emerald-200/60 px-1.5 py-0.5 rounded w-14 text-center">
                  Neutral
                </span>
              </div>
            </div>

            {/* Nitrogen (N) */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 text-xs font-medium">Available N</span>
              <div className="flex items-center gap-2.5">
                <span className="font-mono tabular-nums font-semibold text-slate-900">{farm.nitrogenLevel || 34} kg/ha</span>
                <span className="text-[10px] font-mono font-medium text-[#1e5128] bg-emerald-50/70 border border-emerald-200/60 px-1.5 py-0.5 rounded w-14 text-center">
                  Optimal
                </span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 text-xs font-medium">Available P</span>
              <div className="flex items-center gap-2.5">
                <span className="font-mono tabular-nums font-semibold text-slate-900">{farm.phosphorus || 26} kg/ha</span>
                <span className="text-[10px] font-mono font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded w-14 text-center">
                  Medium
                </span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600 text-xs font-medium">Available K</span>
              <div className="flex items-center gap-2.5">
                <span className="font-mono tabular-nums font-semibold text-slate-900">{farm.potassium || 195} kg/ha</span>
                <span className="text-[10px] font-mono font-medium text-[#1e5128] bg-emerald-50/70 border border-emerald-200/60 px-1.5 py-0.5 rounded w-14 text-center">
                  Optimal
                </span>
              </div>
            </div>
          </div>

          {/* Rootzone Stratigraphy Micro-bars */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-500 font-mono text-[10px]">
              <span className="font-semibold uppercase tracking-wider">Stratigraphy Moisture</span>
              <span className="text-slate-600">VWC Sensor</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600">0–15cm (Surface)</span>
                <span className="font-mono tabular-nums text-slate-800 font-semibold">28.4%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1e5128] h-full rounded-full" style={{ width: '56%' }} />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="text-slate-600">15–30cm (Rootzone)</span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">31.4%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1e5128] h-full rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Link */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <button
            onClick={() => setIsReportOpen(true)}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Full Soil Telemetry Audit</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Detailed Soil Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#1e5128]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Agronomic Soil Analysis Report</h3>
                  <p className="text-[11px] font-mono text-slate-500">{farm.farmName} • {farm.farmSize}</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Composite Health Index: <span className="font-mono text-[#1e5128]">{score}/100</span></div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Macronutrient balance and electrical conductivity are supportive of vegetative grain filling.
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#1e5128] shrink-0" />
              </div>

              <div className="space-y-2.5">
                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>Organic Carbon & Microbial Activity</span>
                    <span className="font-mono font-bold text-[#1e5128]">{farm.organicMatter || 2.85}% (Target: 3.0%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                    <div className="bg-[#1e5128] h-full" style={{ width: `${((farm.organicMatter || 2.85) / 3.5) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Recommend biochar or green manure incorporation post-harvest.</p>
                </div>

                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>Soil pH Buffer</span>
                    <span className="font-mono font-bold text-[#1e5128]">{farm.soilPh || 6.8} (Neutral: 6.5–7.2)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                    <div className="bg-[#1e5128] h-full" style={{ width: `${((farm.soilPh || 6.8) / 8.5) * 100}%` }} />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3">
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>Elemental Macronutrient Balance</span>
                    <span className="font-mono text-slate-700">N: {farm.nitrogenLevel || 34} | P: {farm.phosphorus || 26} | K: {farm.potassium || 195} kg/ha</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Phosphorus buffer is medium; side-dressing with SSP recommended prior to flowering.</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsReportOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
