import React, { useState, useMemo } from 'react';
import { FieldHealthHistory } from '../../types/farm';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ChevronDown, TrendingUp, Calendar } from 'lucide-react';

interface CropHealthTrendChartProps {
  history: FieldHealthHistory[];
  loading?: boolean;
}

export const CropHealthTrendChart: React.FC<CropHealthTrendChartProps> = ({
  history,
  loading = false,
}) => {
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days'>('Last 7 Days');

  const filteredData = useMemo(() => {
    if (!history || history.length === 0) {
      return [
        { date: '2024-05-12', label: '05/12', ndvi: 0.38 },
        { date: '2024-05-13', label: '05/13', ndvi: 0.62 },
        { date: '2024-05-14', label: '05/14', ndvi: 0.58 },
        { date: '2024-05-15', label: '05/15', ndvi: 0.68 },
        { date: '2024-05-16', label: '05/16', ndvi: 0.68 },
        { date: '2024-05-17', label: '05/17', ndvi: 0.81 },
        { date: '2024-05-18', label: '05/18', ndvi: 0.72 },
      ];
    }

    const count = selectedRange === 'Last 7 Days' ? 7 : selectedRange === 'Last 30 Days' ? 14 : 30;
    const slice = history.slice(-count);

    return slice.map((item) => {
      const d = new Date(item.date);
      const label = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      return {
        ...item,
        label,
        ndvi: Number(item.ndvi.toFixed(2)),
      };
    });
  }, [history, selectedRange]);

  const latestNdvi = filteredData.length > 0 ? filteredData[filteredData.length - 1].ndvi : 0.72;
  const initialNdvi = filteredData.length > 0 ? filteredData[0].ndvi : 0.38;
  const deltaNdvi = Number((latestNdvi - initialNdvi).toFixed(2));

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between h-full min-h-[380px] shadow-2xs">
      {/* Header with Title and Range Dropdown */}
      <div>
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Vegetation Index Trend</h3>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">Sentinel-2 Surface Reflectance (L2A)</p>
          </div>

          {/* Segmented / Dropdown Selector */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-mono text-slate-700 transition-colors"
            >
              <span>{selectedRange}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {rangeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setRangeDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-40 text-xs font-mono">
                  {(['Last 7 Days', 'Last 30 Days', 'Last 90 Days'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSelectedRange(opt);
                        setRangeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                        selectedRange === opt ? 'font-bold text-[#1e5128] bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full pt-3 pb-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 8, right: 12, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="ndviEnterpriseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e5128" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1e5128" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e2e8f0" />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
              dy={5}
            />

            <YAxis
              domain={[0.0, 1.0]}
              ticks={[0.0, 0.25, 0.5, 0.75, 1.0]}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
              tickFormatter={(val) => val.toFixed(2)}
            />

            <ReferenceLine
              y={0.70}
              stroke="#d97706"
              strokeDasharray="3 3"
              label={{ value: 'Target 0.70', fill: '#92400e', fontSize: 9, position: 'insideTopRight', fontFamily: 'monospace' }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-700 font-mono">
                      <div className="text-slate-400 text-[10px]">Pass Date: {data.date || data.label}</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5 tabular-nums">
                        NDVI: {data.ndvi}
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1">
                        Status: {data.ndvi >= 0.7 ? 'Optimal Canopy' : data.ndvi >= 0.5 ? 'Moderate Biomass' : 'Deficit'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="ndvi"
              stroke="#1e5128"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#ndviEnterpriseGradient)"
              dot={{ r: 3, fill: '#1e5128', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 4.5, fill: '#1e5128', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Telemetry Stats Footer */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
          <span className="text-slate-400 text-[10px] block uppercase font-sans">Current NDVI</span>
          <span className="font-bold text-slate-900 tabular-nums">{latestNdvi}</span>
        </div>
        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
          <span className="text-slate-400 text-[10px] block uppercase font-sans">Period Delta</span>
          <span className={`font-bold tabular-nums ${deltaNdvi >= 0 ? 'text-[#1e5128]' : 'text-amber-700'}`}>
            {deltaNdvi >= 0 ? `+${deltaNdvi}` : deltaNdvi}
          </span>
        </div>
        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
          <span className="text-slate-400 text-[10px] block uppercase font-sans">Canopy Index</span>
          <span className="font-bold text-slate-800">Dense (0.82)</span>
        </div>
      </div>
    </div>
  );
};
