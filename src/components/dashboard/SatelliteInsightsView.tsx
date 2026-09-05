import React, { useState, useRef } from 'react';
import {
  Satellite,
  Layers,
  MapPin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Bell,
  HelpCircle,
  Check,
  Info,
  Sliders,
  Search,
  Crosshair,
  Split,
  X,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Droplets,
  Thermometer,
  Eye,
  Minimize2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';

interface SatelliteInsightsViewProps {
  onOpenHelp?: () => void;
}

interface FieldParcel {
  id: string;
  name: string;
  crop: string;
  acres: number;
  points: string;
  center: { x: number; y: number };
  ndviScore: number;
  moistureScore: number;
  tempScore: number;
  status: string;
  ndviGradientId: string;
}

const PARCELS: FieldParcel[] = [
  {
    id: 'p1',
    name: 'East Sugarcane Field',
    crop: 'Maize',
    acres: 36,
    points: '50,140 135,160 115,310 25,290',
    center: { x: 75, y: 220 },
    ndviScore: 0.68,
    moistureScore: 0.54,
    tempScore: 28.4,
    status: 'Dense Vegetation',
    ndviGradientId: 'grad-p1',
  },
  {
    id: 'p2',
    name: 'North Maize Field',
    crop: 'Maize',
    acres: 32,
    points: '160,130 250,165 240,360 145,320',
    center: { x: 195, y: 240 },
    ndviScore: 0.81,
    moistureScore: 0.72,
    tempScore: 26.8,
    status: 'Dense Vegetation',
    ndviGradientId: 'grad-p2',
  },
  {
    id: 'p3',
    name: 'Central Maize Field',
    crop: 'Maize',
    acres: 32,
    points: '200,10 245,7 235,95 185,90',
    center: { x: 215, y: 50 },
    ndviScore: 0.74,
    moistureScore: 0.65,
    tempScore: 27.5,
    status: 'Moderate',
    ndviGradientId: 'grad-p3',
  },
  {
    id: 'p4',
    name: 'Central Maize Field (NE)',
    crop: 'Maize',
    acres: 32,
    points: '245,60 305,75 295,190 238,170',
    center: { x: 270, y: 125 },
    ndviScore: 0.77,
    moistureScore: 0.68,
    tempScore: 27.0,
    status: 'Dense Vegetation',
    ndviGradientId: 'grad-p4',
  },
  {
    id: 'p5',
    name: 'Central Maize Field (E)',
    crop: 'Maize',
    acres: 32,
    points: '300,110 345,120 338,300 290,290',
    center: { x: 318, y: 200 },
    ndviScore: 0.42,
    moistureScore: 0.38,
    tempScore: 33.6,
    status: 'Sparse/Bare Soil',
    ndviGradientId: 'grad-p5',
  },
  {
    id: 'p6',
    name: 'Central Maize Field (S)',
    crop: 'Maize',
    acres: 32,
    points: '140,240 190,270 170,320 125,290',
    center: { x: 155, y: 280 },
    ndviScore: 0.79,
    moistureScore: 0.71,
    tempScore: 26.5,
    status: 'Dense Vegetation',
    ndviGradientId: 'grad-p6',
  },
  {
    id: 'p7',
    name: 'Kortm Maize Field',
    crop: 'Maize',
    acres: 32,
    points: '145,310 195,315 185,360 135,355',
    center: { x: 165, y: 335 },
    ndviScore: 0.62,
    moistureScore: 0.58,
    tempScore: 29.2,
    status: 'Moderate',
    ndviGradientId: 'grad-p7',
  },
];

const TIMELINE_MONTHS = [
  { id: 'feb', label: 'Feb', dateRange: 'Feb 1 – Feb 28, 2024', ndvi: 0.34, previewUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=70' },
  { id: 'mar', label: 'Mar', dateRange: 'Mar 1 – Mar 31, 2024', ndvi: 0.46, previewUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=300&q=70' },
  { id: 'apr', label: 'Apr', dateRange: 'Apr 1 – Apr 30, 2024', ndvi: 0.58, previewUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=300&q=70' },
  { id: 'may', label: 'May', dateRange: 'May 1 – May 18, 2024', ndvi: 0.74, previewUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=70' },
  { id: 'jun', label: 'Jun', dateRange: 'Jun 1 – Jun 30, 2024', ndvi: 0.79, previewUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=300&q=70' },
  { id: 'jul', label: 'Jul', dateRange: 'Jul 1 – Jul 31, 2024', ndvi: 0.82, previewUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=70' },
  { id: 'aug', label: 'Aug', dateRange: 'Aug 1 – Aug 31, 2024', ndvi: 0.71, previewUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=300&q=70' },
  { id: 'sep', label: 'Sep', dateRange: 'Sep 1 – Sep 30, 2024', ndvi: 0.63, previewUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=300&q=70' },
  { id: 'oct', label: 'Oct', dateRange: 'Oct 1 – Oct 31, 2024', ndvi: 0.49, previewUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=300&q=70' },
  { id: 'nov', label: 'Nov', dateRange: 'Nov 1 – Nov 30, 2024', ndvi: 0.38, previewUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=70' },
  { id: 'dec', label: 'Dec', dateRange: 'Dec 1 – Dec 31, 2024', ndvi: 0.28, previewUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=70' },
];

const HISTORICAL_TREND_DATA = [
  { month: 'Jan 3', ndvi: 0.08, moisture: 0.15, temp: 18.2 },
  { month: 'Feb 6', ndvi: 0.32, moisture: 0.35, temp: 21.0 },
  { month: 'Mar 7', ndvi: 0.41, moisture: 0.42, temp: 24.5 },
  { month: 'Apr 7', ndvi: 0.34, moisture: 0.38, temp: 28.0 },
  { month: 'May 7', ndvi: 0.48, moisture: 0.52, temp: 29.5 },
  { month: 'Jun 7', ndvi: 0.62, moisture: 0.68, temp: 31.0 },
  { month: 'Jul 1', ndvi: 0.64, moisture: 0.72, temp: 32.5 },
  { month: 'Feb 8', ndvi: 0.47, moisture: 0.51, temp: 27.2 },
  { month: 'Mar 8', ndvi: 0.58, moisture: 0.64, temp: 26.4 },
];

export const SatelliteInsightsView: React.FC<SatelliteInsightsViewProps> = ({ onOpenHelp }) => {
  // Navigation & Dropdown states
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [dateRangeDropdownOpen, setDateRangeDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Active Layer & Options
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'moisture' | 'temperature'>('ndvi');
  const [layerToggles, setLayerToggles] = useState({
    ndvi: true,
    moisture: false,
    temperature: false,
  });
  const [showGraph, setShowGraph] = useState(true);
  const [showOptions, setShowOptions] = useState(true);

  // Timeline State
  const [timelineIndex, setTimelineIndex] = useState(3); // Default 'May'
  const currentTimeline = TIMELINE_MONTHS[timelineIndex];
  const [customDateRange, setCustomDateRange] = useState('May 1 – May 18, 2024');

  // Map Controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState<FieldParcel | null>(PARCELS[1]);
  const [showDrawMode, setShowDrawMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  // Compare Dates Feature
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareDateA, setCompareDateA] = useState('Feb 1 – Feb 28, 2024');
  const [compareDateB, setCompareDateB] = useState('May 1 – May 18, 2024');
  const [compareSliderPos, setCompareSliderPos] = useState(50);

  // Handle Layer Toggle
  const handleToggleLayer = (layer: 'ndvi' | 'moisture' | 'temperature') => {
    setActiveLayer(layer);
    setLayerToggles({
      ndvi: layer === 'ndvi',
      moisture: layer === 'moisture',
      temperature: layer === 'temperature',
    });
  };

  // Timeline Advance
  const handleTimelineNext = () => {
    setTimelineIndex((prev) => (prev + 1) % TIMELINE_MONTHS.length);
    setCustomDateRange(TIMELINE_MONTHS[(timelineIndex + 1) % TIMELINE_MONTHS.length].dateRange);
  };

  const handleTimelineSelect = (idx: number) => {
    setTimelineIndex(idx);
    setCustomDateRange(TIMELINE_MONTHS[idx].dateRange);
  };

  return (
    <div className="w-full space-y-4">
      {/* ======================================================== */}
      {/* 1. TOP HEADER: Title, Date Picker, Farm Selector, Badges */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="text-[#0e3b1c]">Satellite Insights</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Sentinel-2 MSI 10m multispectral remote sensing and vegetation health index
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Range Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setDateRangeDropdownOpen(!dateRangeDropdownOpen);
                setFarmDropdownOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{customDateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dateRangeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDateRangeDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 text-xs">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Preset Capture Windows
                  </div>
                  {[
                    'May 1 – May 18, 2024',
                    'Apr 1 – Apr 30, 2024',
                    'Mar 1 – Mar 31, 2024',
                    'Feb 1 – Feb 28, 2024',
                    'Season to Date (Feb - May 2024)',
                  ].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setCustomDateRange(range);
                        setDateRangeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                        customDateRange === range ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{range}</span>
                      {customDateRange === range && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Farm/Location Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFarmDropdownOpen(!farmDropdownOpen);
                setDateRangeDropdownOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs max-w-[240px] truncate"
            >
              <span className="text-slate-500 font-normal">Farm:</span>
              <span className="font-bold text-slate-900 truncate">{selectedFarm}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {farmDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setFarmDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 text-xs">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Farm Location
                  </div>
                  {['Green Valley Farm', 'Highland Terraces', 'Agro-BRICS Model Plot'].map((f) => (
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
                      <span>{f}</span>
                      {selectedFarm === f && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notification Bell with Badge (3) */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setFarmDropdownOpen(false);
                setDateRangeDropdownOpen(false);
              }}
              className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-40 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Telemetry Alerts</span>
                    <span className="text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded">3 New</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                    <div className="font-bold">Sentinel-2 Pass Cleared</div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">100% cloud-free pass calibrated for May 18.</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-900">
                    <div className="font-bold">Moisture Deficit Flag</div>
                    <div className="text-[11px] text-amber-700 mt-0.5">East Parcel shows drop in NDMI index to 0.38.</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-800">
                    <div className="font-bold">Thermal Anomaly Detected</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Surface temp peaked at 33.6°C on eastern boundary.</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Button (?) */}
          <button
            onClick={onOpenHelp}
            title="Help & Spectral Documentation"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN GRID: Left (Satellite Map) & Right (Side Panel) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ======================================================== */}
        {/* LEFT / CENTER (lg:col-span-8): Large Interactive Map      */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/90 shadow-2xs space-y-3">
          
          {/* Satellite Map Container */}
          <div className="relative w-full h-[460px] sm:h-[520px] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 select-none">
            
            {/* Zoomable & Pannable Viewport */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* High-Resolution Photorealistic Satellite Aerial Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80')`,
                  filter: 'brightness(0.92) contrast(1.18)',
                }}
              />

              {/* Sub-surface field textures & grid lines */}
              <div
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                }}
              />

              {/* SVG Parcels & Color Heatmap Overlays */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <defs>
                  {/* NDVI Gradient 1: East Field (Amber to Lime to Red Edge) */}
                  <linearGradient id="grad-p1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#eab308" stopOpacity="0.85" />
                    <stop offset="85%" stopColor="#ef4444" stopOpacity="0.88" />
                  </linearGradient>

                  {/* NDVI Gradient 2: North Field (Vibrant Emerald Green) */}
                  <linearGradient id="grad-p2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#22c55e" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity="0.85" />
                  </linearGradient>

                  {/* NDVI Gradient 3: Central Top Field (Bright Lime to Yellow) */}
                  <linearGradient id="grad-p3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity="0.88" />
                    <stop offset="50%" stopColor="#eab308" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                  </linearGradient>

                  {/* NDVI Gradient 4: Central East Field (Green Canopy) */}
                  <linearGradient id="grad-p4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#15803d" stopOpacity="0.88" />
                    <stop offset="70%" stopColor="#22c55e" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0.85" />
                  </linearGradient>

                  {/* NDVI Gradient 5: Far East Field (Intense Stressed Red / Bare Soil) */}
                  <linearGradient id="grad-p5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.92" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0.85" />
                  </linearGradient>

                  {/* NDVI Gradient 6 & 7: South fields */}
                  <linearGradient id="grad-p6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity="0.85" />
                  </linearGradient>

                  <linearGradient id="grad-p7" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0.85" />
                  </linearGradient>

                  {/* Moisture Gradient (Blue / Cyan / Orange) */}
                  <linearGradient id="grad-moisture" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.88" />
                    <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Temperature Gradient (Purple / Amber / Red) */}
                  <linearGradient id="grad-temp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.92" />
                  </linearGradient>
                </defs>

                {/* Render Each Parcel Polygon */}
                {PARCELS.map((parcel) => {
                  const isSelected = selectedParcel?.id === parcel.id;
                  
                  // Fill choice depending on layer
                  let fillStyle = `url(#${parcel.ndviGradientId})`;
                  if (activeLayer === 'moisture') {
                    fillStyle = 'url(#grad-moisture)';
                  } else if (activeLayer === 'temperature') {
                    fillStyle = 'url(#grad-temp)';
                  }

                  return (
                    <g
                      key={parcel.id}
                      onClick={() => setSelectedParcel(parcel)}
                      className="cursor-pointer group"
                    >
                      <polygon
                        points={parcel.points}
                        fill={fillStyle}
                        stroke={isSelected ? '#ffffff' : '#fbbf24'}
                        strokeWidth={isSelected ? '2.5' : '1.8'}
                        className="transition-all duration-150 drop-shadow-sm group-hover:stroke-white group-hover:stroke-[2.5]"
                      />

                      {/* Parcel Label Tag (matching screenshot exactly) */}
                      {showLabels && (
                        <g transform={`translate(${parcel.center.x}, ${parcel.center.y})`} className="pointer-events-none select-none">
                          <text
                            textAnchor="middle"
                            y="-6"
                            className="text-[8.5px] font-black fill-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
                          >
                            {parcel.name}
                          </text>
                          <text
                            textAnchor="middle"
                            y="4"
                            className="text-[7.5px] font-bold fill-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
                          >
                            {parcel.crop}
                          </text>
                          <text
                            textAnchor="middle"
                            y="14"
                            className="text-[8px] font-extrabold fill-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
                          >
                            {parcel.acres} Acres
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* ======================================================== */}
            {/* FLOATING LEFT MAP TOOLBAR (+, -, Layers, Scan, Measure)   */}
            {/* ======================================================== */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200/90">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                title="Zoom In"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
                title="Zoom Out"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-full h-px bg-slate-200 my-0.5" />
              <button
                onClick={() => handleToggleLayer(activeLayer === 'ndvi' ? 'moisture' : activeLayer === 'moisture' ? 'temperature' : 'ndvi')}
                title={`Current Layer: ${activeLayer.toUpperCase()} (Click to cycle)`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Layers className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                title="Reset View / Recenter"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Crosshair className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowLabels(!showLabels)}
                title={showLabels ? 'Hide Field Labels' : 'Show Field Labels'}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  showLabels ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* ======================================================== */}
            {/* FLOATING TOP-RIGHT MAP TOOLBAR (Filter, Search, Marker)   */}
            {/* ======================================================== */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200/90">
              <button
                onClick={() => setCompareModalOpen(true)}
                title="Compare Two Satellite Dates Side-by-Side"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-800 hover:bg-emerald-50 transition-colors"
              >
                <Split className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                onClick={() => setSelectedParcel(PARCELS[0])}
                title="Search / Center on Plot"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDrawMode(!showDrawMode)}
                title="Drop Marker / Pin"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  showDrawMode ? 'bg-red-50 text-red-600' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-red-600" />
              </button>
            </div>

            {/* ======================================================== */}
            {/* FLOATING BOTTOM-LEFT LEGEND (Matching Screenshot)         */}
            {/* ======================================================== */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/90 text-xs w-[165px]">
              <div className="font-extrabold text-slate-900 mb-2 uppercase tracking-wide flex items-center justify-between">
                <span>{activeLayer.toUpperCase()}</span>
                <span className="text-[10px] text-slate-400 font-medium">Index</span>
              </div>
              
              {activeLayer === 'ndvi' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#16a34a] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">Dense Vegetation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#eab308] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#ef4444] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">Sparse/Bare Soil</span>
                  </div>
                </div>
              )}

              {activeLayer === 'moisture' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#0284c7] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">High Moisture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#06b6d4] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">Adequate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#f59e0b] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">Moisture Stress</span>
                  </div>
                </div>
              )}

              {activeLayer === 'temperature' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#dc2626] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">High Heat (&gt;32°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#f59e0b] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">Optimal (26-31°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-[#6366f1] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800">Cool (&lt;25°C)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Parcel Telemetry Pill */}
            {selectedParcel && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-white/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedParcel.name}</span>
                <span className="text-slate-400">|</span>
                <span className="text-emerald-300 font-bold">{selectedParcel.ndviScore} NDVI</span>
                <span className="text-slate-400">|</span>
                <span className="text-sky-300">{selectedParcel.tempScore}°C</span>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 3. TIMELINE SCRUBBER SLIDER (Below Satellite Map)        */}
          {/* ======================================================== */}
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3">
            
            {/* Timeline Snapshot Floating Previews (Matching Screenshot) */}
            <div className="relative w-full h-16 hidden sm:block">
              {/* Feb Thumbnail */}
              <div
                onClick={() => handleTimelineSelect(0)}
                className={`absolute bottom-1 left-[14%] -translate-x-1/2 cursor-pointer transition-transform hover:scale-105 ${
                  timelineIndex === 0 ? 'scale-110 z-20' : 'opacity-80'
                }`}
              >
                <div className="relative bg-slate-900 p-1 rounded-xl shadow-md border-2 border-emerald-500">
                  <img
                    src={TIMELINE_MONTHS[0].previewUrl}
                    alt="Feb snapshot"
                    className="w-14 h-9 object-cover rounded-lg"
                  />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-emerald-500" />
                </div>
              </div>

              {/* May Thumbnail */}
              <div
                onClick={() => handleTimelineSelect(3)}
                className={`absolute bottom-1 left-[40%] -translate-x-1/2 cursor-pointer transition-transform hover:scale-105 ${
                  timelineIndex === 3 ? 'scale-110 z-20' : 'opacity-80'
                }`}
              >
                <div className="relative bg-slate-900 p-1 rounded-xl shadow-md border-2 border-emerald-500">
                  <img
                    src={TIMELINE_MONTHS[3].previewUrl}
                    alt="May snapshot"
                    className="w-16 h-10 object-cover rounded-lg"
                  />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-emerald-500" />
                </div>
              </div>

              {/* Sep Thumbnail */}
              <div
                onClick={() => handleTimelineSelect(7)}
                className={`absolute bottom-1 left-[68%] -translate-x-1/2 cursor-pointer transition-transform hover:scale-105 ${
                  timelineIndex === 7 ? 'scale-110 z-20' : 'opacity-80'
                }`}
              >
                <div className="relative bg-slate-900 p-1 rounded-xl shadow-md border-2 border-emerald-500">
                  <img
                    src={TIMELINE_MONTHS[7].previewUrl}
                    alt="Sep snapshot"
                    className="w-14 h-9 object-cover rounded-lg"
                  />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-emerald-500" />
                </div>
              </div>

              {/* Dec Thumbnail */}
              <div
                onClick={() => handleTimelineSelect(10)}
                className={`absolute bottom-1 left-[92%] -translate-x-1/2 cursor-pointer transition-transform hover:scale-105 ${
                  timelineIndex === 10 ? 'scale-110 z-20' : 'opacity-80'
                }`}
              >
                <div className="relative bg-slate-900 p-1 rounded-xl shadow-md border-2 border-emerald-500">
                  <img
                    src={TIMELINE_MONTHS[10].previewUrl}
                    alt="Dec snapshot"
                    className="w-14 h-9 object-cover rounded-lg"
                  />
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-emerald-500" />
                </div>
              </div>
            </div>

            {/* Scrubber Track & Marks */}
            <div className="relative flex items-center gap-3">
              {/* Left Label */}
              <div className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap">
                past weeks/months
              </div>

              {/* Interactive Scrub Bar */}
              <div className="relative flex-1 py-3 cursor-pointer">
                {/* Background Track Line */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full relative overflow-hidden">
                  {/* Filled Progress to Active Month */}
                  <div
                    className="h-full bg-[#16a34a] rounded-full transition-all duration-200"
                    style={{ width: `${(timelineIndex / (TIMELINE_MONTHS.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Draggable Circle Handle at Active Month */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-[#16a34a] shadow-md transition-all duration-200"
                  style={{ left: `${(timelineIndex / (TIMELINE_MONTHS.length - 1)) * 100}%` }}
                />
              </div>

              {/* Next Chevron Button */}
              <button
                onClick={handleTimelineNext}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors shadow-2xs shrink-0"
                title="Next Month Capture"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Month Ticks Labels */}
            <div className="flex justify-between pl-24 pr-8 text-[11px] font-bold text-slate-500">
              {TIMELINE_MONTHS.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => handleTimelineSelect(idx)}
                  className={`hover:text-emerald-700 transition-colors cursor-pointer ${
                    timelineIndex === idx ? 'text-emerald-700 font-black' : ''
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT (lg:col-span-4): Side Panel (Graph + Options)       */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* ======================================================== */}
          {/* 4. VEGETATION INDEX TRENDS GRAPH CARD                     */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div
              onClick={() => setShowGraph(!showGraph)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Vegetation Index Trends Graph
              </h3>
              <button className="p-1 text-slate-400 hover:text-slate-600">
                {showGraph ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showGraph && (
              <div className="space-y-3 pt-1">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  {activeLayer.toUpperCase()}
                </div>

                {/* Line Chart showing NDVI over time */}
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={HISTORICAL_TREND_DATA}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 0.7]}
                        ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]}
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl border border-slate-700 space-y-1">
                                <div className="font-bold">{label}</div>
                                <div className="text-emerald-400">
                                  {activeLayer.toUpperCase()}: {payload[0].value}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey={activeLayer === 'moisture' ? 'moisture' : activeLayer === 'temperature' ? 'temp' : 'ndvi'}
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#ffffff', stroke: '#16a34a', strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: '#16a34a', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-center text-[10px] text-slate-400 font-medium">
                  Months
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 5. OPTIONS CARD: Index Layer Toggles (NDVI, NDMI, LST)   */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Options
              </h3>
              <button className="p-1 text-slate-400 hover:text-slate-600">
                {showOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showOptions && (
              <div className="space-y-3.5 pt-1">
                {/* 1. NDVI Toggle Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">NDVI</span>
                    <span className="text-[10px] text-slate-400">(Vegetation Index)</span>
                  </div>
                  <button
                    onClick={() => handleToggleLayer('ndvi')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      layerToggles.ndvi ? 'bg-[#16a34a]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        layerToggles.ndvi ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Moisture Index (NDMI) Toggle Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">Moisture Index (NDMI)</span>
                    <span className="text-[10px] text-slate-400">(Canopy Water)</span>
                  </div>
                  <button
                    onClick={() => handleToggleLayer('moisture')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      layerToggles.moisture ? 'bg-[#0284c7]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        layerToggles.moisture ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Surface Temperature Toggle Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">Surface Temperature</span>
                    <span className="text-[10px] text-slate-400">(Thermal Band)</span>
                  </div>
                  <button
                    onClick={() => handleToggleLayer('temperature')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      layerToggles.temperature ? 'bg-[#dc2626]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        layerToggles.temperature ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Compare Two Dates</span>
                  <button
                    onClick={() => setCompareModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span>Side-by-Side</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Telemetry Summary Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-[#0e3b1c] text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Sentinel-2 Sensor</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-200 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                10m MSI
              </span>
            </div>
            <div className="text-xl font-extrabold">Clean Satellite Pass</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Orbital telemetry confirms 100% cloud-free reflectance across Punjab sector on {customDateRange}.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-emerald-200">Next Scheduled Pass:</span>
              <span className="font-bold text-white">Tomorrow, 10:48 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. "COMPARE DATES" SIDE-BY-SIDE MODAL / DRAWER           */}
      {/* ======================================================== */}
      {compareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in"
          onClick={() => setCompareModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-6 my-auto space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Split className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Side-by-Side Satellite Date Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Analyze seasonal canopy growth, vegetation index variance, and moisture recovery.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Snapshots Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Snapshot A (Early Window) */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Snapshot A (Earlier)</span>
                  <select
                    value={compareDateA}
                    onChange={(e) => setCompareDateA(e.target.value)}
                    className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                  >
                    <option value="Feb 1 – Feb 28, 2024">Feb 1 – Feb 28, 2024</option>
                    <option value="Mar 1 – Mar 31, 2024">Mar 1 – Mar 31, 2024</option>
                    <option value="Apr 1 – Apr 30, 2024">Apr 1 – Apr 30, 2024</option>
                  </select>
                </div>

                <div className="relative h-56 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80')`,
                      filter: 'sepia(0.2) contrast(1.1)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/30 to-red-500/20 mix-blend-color-burn" />
                  
                  {/* Badge */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    0.34 Average NDVI
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">
                    Early Vegetative
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px]">NDVI</div>
                    <div className="font-bold text-slate-900">0.34</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px]">NDMI</div>
                    <div className="font-bold text-slate-900">0.35</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Temp</div>
                    <div className="font-bold text-slate-900">21.0°C</div>
                  </div>
                </div>
              </div>

              {/* Snapshot B (Peak Window) */}
              <div className="bg-emerald-50/50 rounded-2xl p-3.5 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase">Snapshot B (Current)</span>
                  <select
                    value={compareDateB}
                    onChange={(e) => setCompareDateB(e.target.value)}
                    className="text-xs font-semibold bg-white border border-emerald-200 rounded-lg px-2.5 py-1 text-slate-800"
                  >
                    <option value="May 1 – May 18, 2024">May 1 – May 18, 2024</option>
                    <option value="Jun 1 – Jun 30, 2024">Jun 1 – Jun 30, 2024</option>
                    <option value="Jul 1 – Jul 31, 2024">Jul 1 – Jul 31, 2024</option>
                  </select>
                </div>

                <div className="relative h-56 rounded-xl overflow-hidden bg-slate-900 border border-emerald-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80')`,
                      filter: 'saturate(1.4) contrast(1.2)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/40 via-lime-400/30 to-amber-500/20 mix-blend-color-burn" />

                  {/* Badge */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    0.74 Average NDVI
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white font-black px-2 py-0.5 rounded text-[10px]">
                    Peak Biomass Vigor
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <div className="text-slate-400 text-[10px]">NDVI</div>
                    <div className="font-bold text-emerald-700">0.74</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <div className="text-slate-400 text-[10px]">NDMI</div>
                    <div className="font-bold text-sky-700">0.68</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-100">
                    <div className="text-slate-400 text-[10px]">Temp</div>
                    <div className="font-bold text-slate-900">29.5°C</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Differential Growth Analytics Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-200">Biomass Growth Delta</div>
                  <div className="text-sm font-black">+0.40 NDVI (+117% relative canopy density)</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-200">Moisture Retention:</span>
                <span className="text-xs font-bold text-white bg-emerald-800 px-2 py-0.5 rounded-md">+33%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
