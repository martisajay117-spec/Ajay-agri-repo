import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronDown,
  Bell,
  HelpCircle,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Droplets,
  Layers,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MapPin,
  TrendingUp,
  Sprout,
  ShieldAlert,
  ChevronUp,
  FileText,
  Sliders,
  Eye,
  Info,
  Thermometer,
  CloudRain,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CropHealthRecord, CropRiskIndicator } from '../../types/farm';

// ============================================================================
// REALISTIC HIGH-RES CROP DATA MATCHING THE SCREENSHOT
// ============================================================================
export const INITIAL_CROPS: CropHealthRecord[] = [
  {
    id: 'crop-wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum (Sharbati Gold)',
    fieldId: 'field-1',
    fieldName: 'North Plot (32 Acres)',
    sizeAcres: 32,
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Heading',
    stageProgressPercent: 68,
    stageLabel: 'Heading — 68%',
    stages: ['Seedling', 'Tillering', 'Jointing', 'Heading', 'Maturity'],
    currentStageIndex: 3,
    riskLevel: 'Low Risk',
    pestIndicators: [
      { name: 'Low Risk', level: 'Low', iconType: 'check', description: 'Canopy clear of fungal rust.' },
      { name: 'Moderate Risk', level: 'Moderate', iconType: 'warning', description: 'Monitor aphids on border rows.' },
      { name: 'High Risk', level: 'High', iconType: 'danger', description: 'No acute pathogens.' },
    ],
    ndviHistory: [
      { month: 'Jan 1', ndvi: 0.38, baseline: 0.35 },
      { month: 'Mar 2', ndvi: 0.52, baseline: 0.48 },
      { month: 'Mar 3', ndvi: 0.65, baseline: 0.60 },
      { month: 'Jul 4', ndvi: 0.72, baseline: 0.68 },
      { month: 'Mar 5', ndvi: 0.78, baseline: 0.72 },
      { month: 'Mar 6', ndvi: 0.82, baseline: 0.76 },
    ],
    currentNdvi: 0.82,
    ndviDelta: '+0.08',
    soilMoisture: 31,
    nitrogenKgHa: 34,
    chlorophyllIndex: 48.5,
    canopyDensity: 84,
    plantingDate: 'Nov 20, 2023',
    estimatedHarvest: 'Apr 10, 2024',
    predictedYield: '4.85 T/ha (+7%)',
    fullHistoryNotes: [
      { date: 'Jan 15', event: 'Germination and tillering emergence validated via Sentinel-2.', ndviValue: 0.38, impact: 'positive' },
      { date: 'Feb 28', event: 'First foliar nitrogen spray applied. Vigor surged +14%.', ndviValue: 0.52, impact: 'positive' },
      { date: 'Mar 18', event: 'Jointing stage reached with deep root hydration index at 34%.', ndviValue: 0.65, impact: 'positive' },
      { date: 'Apr 25', event: 'Heading phase commenced. Ear density is uniform across all quadrants.', ndviValue: 0.82, impact: 'positive' },
    ],
    recommendations: [
      {
        title: 'Maintain Uniform Drip Irrigation',
        urgency: 'Medium',
        category: 'Irrigation',
        detail: 'Heading phase is water-sensitive. Maintain root zone moisture between 28% and 32% to prevent grain abortion.',
        actionLabel: 'Schedule 18mm Drip',
      },
      {
        title: 'Preventative Yellow Rust Scouting',
        urgency: 'Low',
        category: 'Pest Control',
        detail: 'Relative humidity forecasted to rise mid-week. Scout lower leaves for pustules; apply propiconazole if detected.',
        actionLabel: 'Log Field Scout',
      },
      {
        title: 'Micronutrient Boost (Zinc + Boron)',
        urgency: 'Low',
        category: 'Fertilization',
        detail: 'Foliar spray of 0.5% chelated zinc improves grain filling and test weight during anthesis.',
        actionLabel: 'Review Fertigation Plan',
      },
    ],
  },
  {
    id: 'crop-rice',
    name: 'Rice',
    scientificName: 'Oryza sativa (Basmati 1121)',
    fieldId: 'field-2',
    fieldName: 'Riverside Paddies (18 Acres)',
    sizeAcres: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Heading',
    stageProgressPercent: 74,
    stageLabel: 'Heading — 74%',
    stages: ['Seedling', 'Tillering', 'Jointing', 'Heading', 'Maturity'],
    currentStageIndex: 3,
    riskLevel: 'Moderate Risk',
    pestIndicators: [
      { name: 'Low Risk', level: 'Low', iconType: 'check', description: 'Blast disease controlled.' },
      { name: 'Moderate Risk', level: 'Moderate', iconType: 'warning', description: 'Stem borer moths reported nearby.' },
      { name: 'High Risk', level: 'High', iconType: 'danger', description: 'Algal growth in standing water.' },
    ],
    ndviHistory: [
      { month: 'Jan 3', ndvi: 0.42, baseline: 0.40 },
      { month: 'Jun 2', ndvi: 0.56, baseline: 0.50 },
      { month: 'Jun 3', ndvi: 0.69, baseline: 0.62 },
      { month: 'Mar 5', ndvi: 0.74, baseline: 0.68 },
      { month: 'Mar 8', ndvi: 0.79, baseline: 0.73 },
    ],
    currentNdvi: 0.79,
    ndviDelta: '+0.05',
    soilMoisture: 38,
    nitrogenKgHa: 28,
    chlorophyllIndex: 44.2,
    canopyDensity: 88,
    plantingDate: 'Dec 05, 2023',
    estimatedHarvest: 'May 02, 2024',
    predictedYield: '4.20 T/ha (+4%)',
    fullHistoryNotes: [
      { date: 'Jan 20', event: 'Transplanting finalized in flooded bunds with 5cm standing depth.', ndviValue: 0.42, impact: 'positive' },
      { date: 'Feb 15', event: 'Stem borer pheromone traps deployed (12 units/hectare).', ndviValue: 0.56, impact: 'neutral' },
      { date: 'Mar 30', event: 'Maximum panicle tillering reached with high chlorophyll index.', ndviValue: 0.69, impact: 'positive' },
      { date: 'May 02', event: 'Flowering heads emergent. Biomass index exceeds regional average.', ndviValue: 0.79, impact: 'positive' },
    ],
    recommendations: [
      {
        title: 'Stem Borer Biological Management',
        urgency: 'High',
        category: 'Pest Control',
        detail: 'Trap counts showed 6 moths/trap/night. Release Trichogramma japonicum egg parasitoids at 100,000/ha.',
        actionLabel: 'Order Bio-Parasitoids',
      },
      {
        title: 'Alternate Wetting and Drying (AWD)',
        urgency: 'Medium',
        category: 'Irrigation',
        detail: 'Allow water level to drop 5cm below soil surface before re-flooding to conserve water and strengthen roots.',
        actionLabel: 'Adjust AWD Sensor',
      },
    ],
  },
  {
    id: 'crop-maize',
    name: 'Maize',
    scientificName: 'Zea mays (Highland Sweetcorn F1)',
    fieldId: 'field-3',
    fieldName: 'Central Field (32 Acres)',
    sizeAcres: 32,
    imageUrl:
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Heading',
    stageProgressPercent: 58,
    stageLabel: 'Heading / Silking — 58%',
    stages: ['Seedling', 'Tillering', 'Jointing', 'Heading', 'Maturity'],
    currentStageIndex: 3,
    riskLevel: 'Low Risk',
    pestIndicators: [
      { name: 'Low Risk', level: 'Low', iconType: 'check', description: 'No fall armyworm detected.' },
      { name: 'Moderate Risk', level: 'Moderate', iconType: 'warning', description: 'Minor nitrogen yellowing at margins.' },
      { name: 'High Risk', level: 'High', iconType: 'danger', description: 'Under control.' },
    ],
    ndviHistory: [
      { month: 'Jan 1', ndvi: 0.32, baseline: 0.30 },
      { month: 'Feb 2', ndvi: 0.48, baseline: 0.44 },
      { month: 'Mar 1', ndvi: 0.61, baseline: 0.55 },
      { month: 'Jul 4', ndvi: 0.71, baseline: 0.65 },
      { month: 'Mar 5', ndvi: 0.76, baseline: 0.70 },
      { month: 'Mar 8', ndvi: 0.81, baseline: 0.74 },
    ],
    currentNdvi: 0.81,
    ndviDelta: '+0.11',
    soilMoisture: 28,
    nitrogenKgHa: 36,
    chlorophyllIndex: 51.0,
    canopyDensity: 82,
    plantingDate: 'Dec 18, 2023',
    estimatedHarvest: 'May 20, 2024',
    predictedYield: '6.40 T/ha (+9%)',
    fullHistoryNotes: [
      { date: 'Jan 10', event: 'Precision drill seeding completed with 94% uniform emergence.', ndviValue: 0.32, impact: 'positive' },
      { date: 'Feb 20', event: 'Knee-high vegetative jump. Satellite NDVI indicated robust canopy.', ndviValue: 0.48, impact: 'positive' },
      { date: 'Apr 02', event: 'Tasseling initiation detected. Deep soil root moisture at 28%.', ndviValue: 0.76, impact: 'positive' },
      { date: 'May 08', event: 'Silk emergence with excellent pollination index.', ndviValue: 0.81, impact: 'positive' },
    ],
    recommendations: [
      {
        title: 'Side-Dress Potassium Sulphate',
        urgency: 'Medium',
        category: 'Fertilization',
        detail: 'Apply 35 kg/ha K2O to support starch translocation into kernel tips and reduce lodging risks.',
        actionLabel: 'Schedule Side-Dress',
      },
      {
        title: 'Fall Armyworm Pheromone Check',
        urgency: 'Low',
        category: 'Pest Control',
        detail: 'Inspect leaf whorls for pinholes or frass twice weekly during warm afternoons.',
        actionLabel: 'Mark Inspected',
      },
    ],
  },
  {
    id: 'crop-soybean',
    name: 'Soybean',
    scientificName: 'Glycine max (JS 335 Gold)',
    fieldId: 'field-4',
    fieldName: 'South Valley (25 Acres)',
    sizeAcres: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Heading',
    stageProgressPercent: 65,
    stageLabel: 'Heading / Podding — 65%',
    stages: ['Seedling', 'Tillering', 'Jointing', 'Heading', 'Maturity'],
    currentStageIndex: 3,
    riskLevel: 'Moderate Risk',
    pestIndicators: [
      { name: 'Aphids', level: 'Low', iconType: 'check', description: 'Under control.' },
      { name: 'Mildew', level: 'Moderate', iconType: 'warning', description: 'Early powdery mildew on lower leaves.' },
      { name: 'Blight', level: 'High', iconType: 'danger', description: 'Localized foliar blight patch.' },
    ],
    ndviHistory: [
      { month: 'Jan 1', ndvi: 0.28, baseline: 0.26 },
      { month: 'Feb 2', ndvi: 0.42, baseline: 0.38 },
      { month: 'Mar 3', ndvi: 0.54, baseline: 0.49 },
      { month: 'Mar 4', ndvi: 0.65, baseline: 0.60 },
      { month: 'Mar 8', ndvi: 0.74, baseline: 0.69 },
    ],
    currentNdvi: 0.74,
    ndviDelta: '+0.06',
    soilMoisture: 24,
    nitrogenKgHa: 26,
    chlorophyllIndex: 42.8,
    canopyDensity: 76,
    plantingDate: 'Jan 02, 2024',
    estimatedHarvest: 'May 28, 2024',
    predictedYield: '2.80 T/ha (+3%)',
    fullHistoryNotes: [
      { date: 'Jan 22', event: 'Rhizobium inoculated seedling emergence verified.', ndviValue: 0.28, impact: 'positive' },
      { date: 'Mar 05', event: 'Third trifoliate leaf stage reached under clear skies.', ndviValue: 0.42, impact: 'positive' },
      { date: 'Apr 12', event: 'Mild powdery mildew detected in shaded southern fence rows.', ndviValue: 0.54, impact: 'warning' },
      { date: 'May 10', event: 'Pod filling initiated with steady 0.74 vegetative index.', ndviValue: 0.74, impact: 'positive' },
    ],
    recommendations: [
      {
        title: 'Targeted Bio-Fungicide for Mildew',
        urgency: 'High',
        category: 'Pest Control',
        detail: 'Spray Bacillus subtilis or wettable sulfur (2g/L) on affected south quadrant before spore dispersal.',
        actionLabel: 'Deploy Drone Spray',
      },
      {
        title: 'Pod Fill Supplemental Hydration',
        urgency: 'Medium',
        category: 'Irrigation',
        detail: 'Soil moisture is down to 24%. Apply 22mm supplemental irrigation to ensure full pod grain density.',
        actionLabel: 'Activate Drip Valve 4',
      },
    ],
  },
];

// Weather Context data (Dual-axis Temperature vs Humidity matching screenshot)
const WEATHER_CONTEXT_DATA = [
  { month: 'Jan', temp: 14, humidity: 44 },
  { month: 'Feb', temp: 19, humidity: 38 },
  { month: 'Mar', temp: 28, humidity: 30 },
  { month: 'Apr', temp: 35, humidity: 24 },
  { month: 'May', temp: 42, humidity: 18 },
  { month: 'Jun', temp: 37, humidity: 62 },
];

// Rain chance weekly data matching screenshot
const RAIN_CHANCE_DATA = [
  { day: 'S', chance: 42, mm: 6 },
  { day: 'M', chance: 18, mm: 1 },
  { day: 'T', chance: 26, mm: 2 },
  { day: 'W', chance: 12, mm: 0 },
  { day: 'T', chance: 28, mm: 3 },
  { day: 'F', chance: 15, mm: 1 },
  { day: 'Sa', chance: 32, mm: 4 },
];

// Comparison timeline across all 4 crops
const COMPARISON_TIMELINE = [
  { time: 'Jan 1', Wheat: 0.38, Rice: 0.32, Maize: 0.30, Soybean: 0.28 },
  { time: 'Jan 20', Wheat: 0.45, Rice: 0.40, Maize: 0.39, Soybean: 0.35 },
  { time: 'Feb 15', Wheat: 0.54, Rice: 0.50, Maize: 0.49, Soybean: 0.43 },
  { time: 'Mar 05', Wheat: 0.65, Rice: 0.61, Maize: 0.60, Soybean: 0.54 },
  { time: 'Apr 01', Wheat: 0.74, Rice: 0.70, Maize: 0.72, Soybean: 0.65 },
  { time: 'May 01', Wheat: 0.82, Rice: 0.79, Maize: 0.81, Soybean: 0.74 },
];

interface CropHealthViewProps {
  onOpenHelp?: () => void;
}

export const CropHealthView: React.FC<CropHealthViewProps> = ({ onOpenHelp }) => {
  // Top bar states
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Madhya Pradesh, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('May 1 – May 18, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  // View Mode: 'individual' vs 'compare'
  const [viewMode, setViewMode] = useState<'individual' | 'compare'>('individual');

  // Selected crop for the deep-dive detail modal
  const [selectedCrop, setSelectedCrop] = useState<CropHealthRecord | null>(null);

  // Active crop filters for Compare view
  const [compareCropsSelected, setCompareCropsSelected] = useState<Record<string, boolean>>({
    Wheat: true,
    Rice: true,
    Maize: true,
    Soybean: true,
  });

  // Collapsible section states
  const [cropCardsCollapsed, setCropCardsCollapsed] = useState(false);
  const [fieldMapCollapsed, setFieldMapCollapsed] = useState(false);
  const [weatherCollapsed, setWeatherCollapsed] = useState(false);
  const [rainCollapsed, setRainCollapsed] = useState(false);

  // Floating map tools state
  const [mapZoom, setMapZoom] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'rgb' | 'moisture'>('ndvi');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Filter crops if needed
  const crops = INITIAL_CROPS;

  return (
    <div className="w-full space-y-4">
      {/* ======================================================== */}
      {/* 1. TOP HEADER ROW MATCHING SCREENSHOT                     */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Left: Page Title */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Crop Health Overview</span>
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Sentinel-2 multispectral NDVI trends, phenological growth tracking & biosecurity alerts
            </p>
          </div>
        </div>

        {/* Right Controls: Date Picker, Farm Selector, Notifications, Help */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Range Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedDateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDateDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {[
                    'May 1 – May 18, 2024',
                    'May 01 – May 30, 2024',
                    'Last 30 Days',
                    'Season to Date (120 Days)',
                  ].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setSelectedDateRange(range);
                        setDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                        selectedDateRange === range
                          ? 'font-bold text-emerald-700 bg-emerald-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{range}</span>
                      {selectedDateRange === range && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Farm Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs max-w-[280px] sm:max-w-none truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{selectedFarm}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {farmDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setFarmDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {[
                    'Green Valley Farm - Madhya Pradesh, India',
                    'Highland Terraces - Punjab, India',
                    'Agro-BRICS Model Plot - São Paulo, Brazil',
                  ].map((farm) => (
                    <button
                      key={farm}
                      onClick={() => {
                        setSelectedFarm(farm);
                        setFarmDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between ${
                        selectedFarm === farm
                          ? 'font-bold text-emerald-700 bg-emerald-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{farm}</span>
                      {selectedFarm === farm && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setNotificationsRead(true);
              }}
              title="Crop Health Alerts"
              className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs transition-colors"
            >
              <Bell className="w-4 h-4" />
              {!notificationsRead && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  3
                </span>
              )}
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-40 text-xs space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>Crop Telemetry Alerts</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Live Sentinel-2</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Soybean: Powdery Mildew Detected</span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-0.5">
                      South quadrant moisture drop (24%). Early foliar powdery mildew observed.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Wheat: Optimal Heading Biomass</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      NDVI reached 0.82 (+7% over regional BRICS benchmark).
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Rice: Standing Water Level Normal</span>
                    </div>
                    <div className="text-[11px] text-blue-700 mt-0.5">
                      Standing water at 4cm. Stem borer traps active.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            title="Crop Health Guide"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT TWO-COLUMN LAYOUT                        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* ====================================================== */}
        {/* LEFT / CENTER COLUMN (xl:col-span-8): CROP CARDS GRID  */}
        {/* ====================================================== */}
        <div className="xl:col-span-8 space-y-4">
          {/* Section Container Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
            {/* Top Row of the Section: Title & Controls */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  {viewMode === 'compare'
                    ? 'Crop Health Multi-Trend Comparison'
                    : 'Crop-by-Crop Health Cards'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode Toggle Button: [ Compare Crops (All) ] / [ Individual ] */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200 shadow-inner">
                  <button
                    onClick={() => setViewMode('compare')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      viewMode === 'compare'
                        ? 'bg-[#1b5028] text-white shadow-xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Compare Crops (All)</span>
                  </button>
                  <span className="text-slate-300 self-center">/</span>
                  <button
                    onClick={() => setViewMode('individual')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      viewMode === 'individual'
                        ? 'bg-[#1b5028] text-white shadow-xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Individual</span>
                  </button>
                </div>

                {/* Section Collapse Chevron */}
                <button
                  onClick={() => setCropCardsCollapsed(!cropCardsCollapsed)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronUp
                    className={`w-4 h-4 transition-transform ${
                      cropCardsCollapsed ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* If Collapsed, hide content */}
            {!cropCardsCollapsed && (
              <div className="relative">
                {/* Floating Map/GIS Toolbar on the Left (from screenshot) */}
                <div className="hidden md:flex absolute -left-2 top-2 -translate-x-full flex-col items-center bg-white border border-slate-200 rounded-xl shadow-md p-1 z-20 space-y-1 text-slate-600">
                  <button
                    onClick={() => setMapZoom((z) => Math.min(2, z + 0.1))}
                    title="Zoom In"
                    className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMapZoom((z) => Math.max(0.8, z - 0.1))}
                    title="Zoom Out"
                    className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-full h-px bg-slate-100" />
                  <button
                    onClick={() => {}}
                    title="Pin Farm Centroid"
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-700 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMapZoom(1)}
                    title="Fit Extent"
                    className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-slate-900 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="relative">
                    <button
                      onClick={() => setShowLayerMenu(!showLayerMenu)}
                      title="Spectral Layers"
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                    {showLayerMenu && (
                      <div className="absolute left-full ml-2 top-0 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-36 text-[11px] font-semibold text-slate-700 space-y-1 z-30">
                        <button
                          onClick={() => {
                            setActiveLayer('ndvi');
                            setShowLayerMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded ${
                            activeLayer === 'ndvi' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
                          }`}
                        >
                          NDVI Index
                        </button>
                        <button
                          onClick={() => {
                            setActiveLayer('rgb');
                            setShowLayerMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded ${
                            activeLayer === 'rgb' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
                          }`}
                        >
                          Natural RGB
                        </button>
                        <button
                          onClick={() => {
                            setActiveLayer('moisture');
                            setShowLayerMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded ${
                            activeLayer === 'moisture'
                              ? 'bg-emerald-50 text-emerald-700 font-bold'
                              : ''
                          }`}
                        >
                          Moisture NDWI
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ==================================================== */}
                {/* VIEW MODE: COMPARE CROPS OVERLAY                     */}
                {/* ==================================================== */}
                {viewMode === 'compare' ? (
                  <div className="space-y-6">
                    {/* Filter Pills for Compare */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                      <div className="text-xs text-slate-500 font-medium">
                        Toggle crops to compare multi-spectral NDVI trends over the season:
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { key: 'Wheat', color: '#16a34a', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                          { key: 'Rice', color: '#059669', bg: 'bg-teal-50 text-teal-800 border-teal-300' },
                          { key: 'Maize', color: '#d97706', bg: 'bg-amber-50 text-amber-800 border-amber-300' },
                          { key: 'Soybean', color: '#6366f1', bg: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
                        ].map((item) => (
                          <button
                            key={item.key}
                            onClick={() =>
                              setCompareCropsSelected((prev) => ({
                                ...prev,
                                [item.key]: !prev[item.key],
                              }))
                            }
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                              compareCropsSelected[item.key]
                                ? item.bg
                                : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60'
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.key}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Unified Multi-Line Chart */}
                    <div className="h-72 w-full bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={COMPARISON_TIMELINE}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis
                            dataKey="time"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            stroke="#cbd5e1"
                          />
                          <YAxis
                            domain={[0.2, 1.0]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            stroke="#cbd5e1"
                            unit=" NDVI"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#1e293b',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '12px',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            }}
                          />
                          <Legend />
                          {compareCropsSelected.Wheat && (
                            <Line
                              type="monotone"
                              dataKey="Wheat"
                              stroke="#16a34a"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#16a34a' }}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {compareCropsSelected.Rice && (
                            <Line
                              type="monotone"
                              dataKey="Rice"
                              stroke="#059669"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#059669' }}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {compareCropsSelected.Maize && (
                            <Line
                              type="monotone"
                              dataKey="Maize"
                              stroke="#d97706"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#d97706' }}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {compareCropsSelected.Soybean && (
                            <Line
                              type="monotone"
                              dataKey="Soybean"
                              stroke="#6366f1"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#6366f1' }}
                              activeDot={{ r: 6 }}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Comparative Performance Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Crop / Field</th>
                            <th className="p-3">Current NDVI</th>
                            <th className="p-3">Growth Stage</th>
                            <th className="p-3">Soil Moisture</th>
                            <th className="p-3">Pest Threat</th>
                            <th className="p-3">Projected Yield</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {crops.map((c) => (
                            <tr
                              key={c.id}
                              className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                              onClick={() => setSelectedCrop(c)}
                            >
                              <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                <img
                                  src={c.imageUrl}
                                  alt={c.name}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-md object-cover"
                                />
                                <div>
                                  <div>{c.name}</div>
                                  <div className="text-[10px] text-slate-400 font-normal">
                                    {c.fieldName}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-bold text-emerald-700">
                                {c.currentNdvi}{' '}
                                <span className="text-[10px] text-emerald-600 font-normal">
                                  ({c.ndviDelta})
                                </span>
                              </td>
                              <td className="p-3 font-medium text-slate-700">
                                {c.stageLabel}
                              </td>
                              <td className="p-3 font-semibold text-blue-600">
                                {c.soilMoisture}%
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    c.riskLevel === 'Low Risk'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {c.riskLevel}
                                </span>
                              </td>
                              <td className="p-3 font-semibold text-slate-800">
                                {c.predictedYield}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCrop(c);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors text-[11px]"
                                >
                                  Inspect →
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* ==================================================== */
                  /* VIEW MODE: INDIVIDUAL 2x2 CROP CARDS (SCREENSHOT)   */
                  /* ==================================================== */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {crops.map((crop) => (
                      <div
                        key={crop.id}
                        onClick={() => setSelectedCrop(crop)}
                        className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          {/* Card Header: Crop Name with Collapse Chevron */}
                          <div className="flex items-center justify-between pb-2">
                            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                              {crop.name}
                            </h3>
                            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                          </div>

                          {/* Crop Photo Thumbnail Banner */}
                          <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 shadow-inner">
                            <img
                              src={crop.imageUrl}
                              alt={`${crop.name} field`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                              {crop.fieldName}
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold">
                              NDVI {crop.currentNdvi}
                            </div>
                          </div>

                          {/* Growth Stage Progress Bar Section */}
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                              <span>Growth Stage Progress Bar</span>
                              <span className="text-emerald-700 font-extrabold">
                                {crop.stageLabel}
                              </span>
                            </div>

                            {/* Continuous Progress Bar with Node Stages */}
                            <div className="relative pt-1 pb-2">
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                  style={{ width: `${crop.stageProgressPercent}%` }}
                                />
                              </div>

                              {/* Stage Labels underneath matching screenshot */}
                              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                                {crop.stages.map((st, idx) => {
                                  const isCurrent = st === crop.currentStage;
                                  return (
                                    <span
                                      key={st}
                                      className={`${
                                        isCurrent
                                          ? 'font-bold text-slate-900 border-b-2 border-emerald-600 pb-0.5'
                                          : idx <= crop.currentStageIndex
                                          ? 'text-slate-600 font-semibold'
                                          : 'text-slate-400'
                                      }`}
                                    >
                                      {st}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Pest/Disease Risk Indicators matching screenshot */}
                          <div className="space-y-1.5 mb-3">
                            <div className="text-[11px] font-bold text-slate-700">
                              Pest/Disease Risk Indicators
                            </div>
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                              {crop.name === 'Soybean' ? (
                                <>
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-100">
                                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    <span>Aphids</span>
                                  </div>
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-100">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>Mildew</span>
                                  </div>
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-100">
                                    <XCircle className="w-3 h-3 text-rose-600" />
                                    <span>Blight</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                                    <span>Low Risk</span>
                                  </div>
                                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span>Moderate Risk</span>
                                  </div>
                                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <span>High Risk</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Mini NDVI Health Trend Sparkline matching screenshot */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                              <span className="font-bold text-slate-700">NDVI Health Trend</span>
                              <span className="text-[10px] text-emerald-700 font-semibold">
                                Multispectral Index
                              </span>
                            </div>

                            <div className="h-24 w-full bg-slate-50/60 rounded-xl p-1.5 border border-slate-100">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={crop.ndviHistory}
                                  margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                                >
                                  <YAxis
                                    domain={[0, 1.0]}
                                    tick={{ fontSize: 9, fill: '#64748b' }}
                                    tickCount={4}
                                  />
                                  <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 9, fill: '#64748b' }}
                                  />
                                  <Tooltip
                                    formatter={(val: any) => [`${val} NDVI`, 'Canopy']}
                                    contentStyle={{
                                      backgroundColor: '#0f172a',
                                      borderRadius: '8px',
                                      color: '#fff',
                                      fontSize: '10px',
                                      padding: '4px 8px',
                                    }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="ndvi"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: '#16a34a' }}
                                    activeDot={{ r: 5 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Action link */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="text-[11px]">Click for complete agronomic diagnostic</span>
                          <span className="text-[11px] text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            <span>Details</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ====================================================== */}
        {/* RIGHT COLUMN (xl:col-span-4): GIS MAP & WEATHER PANELS */}
        {/* ====================================================== */}
        <div className="xl:col-span-4 space-y-4">
          {/* 1. OVERALL FIELD MAP WIDGET */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Overall Field Map</h3>
              </div>
              <button
                onClick={() => setFieldMapCollapsed(!fieldMapCollapsed)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <ChevronUp
                  className={`w-3.5 h-3.5 transition-transform ${
                    fieldMapCollapsed ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {!fieldMapCollapsed && (
              <div className="pt-3 space-y-2.5">
                {/* Satellite Preview with Multispectral Colored Field Boundaries */}
                <div className="relative h-52 w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
                    alt="Overall Farm Satellite Imagery"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                    style={{ transform: `scale(${mapZoom})` }}
                  />

                  {/* SVG Multi-Polygon Overlay representing Farm Parcels */}
                  <svg
                    viewBox="0 0 200 160"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {/* Wheat Parcel (Green) */}
                    <polygon
                      points="20,20 90,15 95,75 35,70"
                      fill="#22c55e"
                      fillOpacity="0.4"
                      stroke="#16a34a"
                      strokeWidth="2"
                    />
                    <text x="28" y="45" fill="#ffffff" fontSize="7" fontWeight="bold">
                      Wheat (32 Ac)
                    </text>

                    {/* Rice Paddies (Lime) */}
                    <polygon
                      points="105,25 180,20 185,85 110,80"
                      fill="#84cc16"
                      fillOpacity="0.4"
                      stroke="#65a30d"
                      strokeWidth="2"
                    />
                    <text x="115" y="50" fill="#ffffff" fontSize="7" fontWeight="bold">
                      Rice Paddies
                    </text>

                    {/* Central Maize (Emerald) */}
                    <polygon
                      points="35,80 120,85 115,145 25,140"
                      fill="#10b981"
                      fillOpacity="0.45"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x="45" y="112" fill="#ffffff" fontSize="7" fontWeight="bold">
                      Central Maize (32 Ac)
                    </text>

                    {/* Soybean South (Amber/Yellow) */}
                    <polygon
                      points="125,90 190,95 180,150 120,145"
                      fill="#eab308"
                      fillOpacity="0.45"
                      stroke="#ca8a04"
                      strokeWidth="2"
                    />
                    <text x="128" y="120" fill="#ffffff" fontSize="7" fontWeight="bold">
                      Soybean (25 Ac)
                    </text>
                  </svg>

                  {/* NDVI Scale Bar Legend in Top Right */}
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs p-1.5 rounded-lg text-[9px] text-white font-mono space-y-1">
                    <div className="font-sans text-[8px] font-bold text-slate-300">NDVI INDEX</div>
                    <div className="w-16 h-2 rounded bg-gradient-to-r from-red-500 via-yellow-400 via-lime-400 to-emerald-600" />
                    <div className="flex justify-between text-[7px] text-slate-300">
                      <span>0.1</span>
                      <span>0.4</span>
                      <span>0.8</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>Total Active Cultivation: <strong>107 Acres</strong></span>
                  <span className="text-emerald-700 font-bold">4 Verified Parcels</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. WEATHER CONTEXT WIDGET */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Weather Context</h3>
              </div>
              <button
                onClick={() => setWeatherCollapsed(!weatherCollapsed)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <ChevronUp
                  className={`w-3.5 h-3.5 transition-transform ${
                    weatherCollapsed ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {!weatherCollapsed && (
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Temperature (°C)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <span>Humidity (%)</span>
                  </div>
                </div>

                <div className="h-36 w-full bg-slate-50/70 rounded-xl p-1.5 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={WEATHER_CONTEXT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 50]}
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        unit="°"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        unit="%"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '10px',
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="temp"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#16a34a' }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="humidity"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#14b8a6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* 3. RAIN CHANCE WIDGET */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Rain Chance</h3>
              </div>
              <button
                onClick={() => setRainCollapsed(!rainCollapsed)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <ChevronUp
                  className={`w-3.5 h-3.5 transition-transform ${
                    rainCollapsed ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {!rainCollapsed && (
              <div className="pt-3 space-y-2">
                <div className="h-28 w-full bg-slate-50/70 rounded-xl p-1 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={RAIN_CHANCE_DATA}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis
                        domain={[0, 60]}
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        unit="%"
                      />
                      <Tooltip
                        formatter={(val: any) => [`${val}% probability`, 'Rain Chance']}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '10px',
                        }}
                      />
                      <Bar dataKey="chance" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-slate-500 text-center">
                  Weekly probability peaks on Sunday (42% chance, ~6mm).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CROP DETAIL MODAL / SLIDEOVER PANEL                    */}
      {/* ======================================================== */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden text-xs my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header with Crop Photo & Basic Identifiers */}
            <div className="relative p-6 bg-slate-900 text-white overflow-hidden">
              <img
                src={selectedCrop.imageUrl}
                alt={selectedCrop.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                    <Sprout className="w-3 h-3" />
                    <span>{selectedCrop.scientificName || selectedCrop.name}</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    {selectedCrop.name} Health Dossier
                  </h2>
                  <p className="text-xs text-slate-300">
                    {selectedCrop.fieldName} • {selectedCrop.sizeAcres} Acres • Planted: {selectedCrop.plantingDate}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCrop(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Key Quick Metrics Header Bar */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] text-slate-300 font-medium">NDVI Index</div>
                  <div className="text-base font-extrabold text-emerald-300 mt-0.5">
                    {selectedCrop.currentNdvi} ({selectedCrop.ndviDelta})
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] text-slate-300 font-medium">Growth Stage</div>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {selectedCrop.currentStage} ({selectedCrop.stageProgressPercent}%)
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] text-slate-300 font-medium">Soil Moisture</div>
                  <div className="text-base font-extrabold text-blue-300 mt-0.5">
                    {selectedCrop.soilMoisture}% Hydration
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] text-slate-300 font-medium">Yield Outlook</div>
                  <div className="text-base font-extrabold text-amber-300 mt-0.5">
                    {selectedCrop.predictedYield}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body: Scrollable Content */}
            <div className="p-6 space-y-5 max-h-[68vh] overflow-y-auto">
              {/* 1. Full NDVI History Chart */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Complete Sentinel-2 NDVI Telemetry vs Regional Benchmark</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">10m Multispectral Resolution</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCrop.ndviHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis
                        domain={[0.2, 1.0]}
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        unit=" NDVI"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line
                        type="monotone"
                        dataKey="ndvi"
                        name="Observed Canopy NDVI"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#16a34a' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        name="BRICS Regional Baseline"
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Pest & Biosecurity Diagnostic Panel */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Pest & Disease Risk Assessment</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedCrop.pestIndicators.map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        p.level === 'Low'
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                          : p.level === 'Moderate'
                          ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                          : 'bg-rose-50/50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{p.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            p.level === 'Low'
                              ? 'bg-emerald-200 text-emerald-800'
                              : p.level === 'Moderate'
                              ? 'bg-amber-200 text-amber-800'
                              : 'bg-rose-200 text-rose-800'
                          }`}
                        >
                          {p.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Agronomic AI Recommendations */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  <span>Actionable Agronomic Advisories</span>
                </h4>
                <div className="space-y-2">
                  {selectedCrop.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rec.urgency === 'High'
                                ? 'bg-rose-100 text-rose-800'
                                : rec.urgency === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {rec.urgency} Urgency
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            {rec.category}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs">{rec.title}</div>
                        <p className="text-[11px] text-slate-600 max-w-xl">{rec.detail}</p>
                      </div>
                      <button
                        onClick={() => alert(`Initiating: "${rec.actionLabel}" for ${selectedCrop.name}. Telemetry updated.`)}
                        className="px-3.5 py-1.5 bg-[#1b5028] hover:bg-[#154322] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                      >
                        {rec.actionLabel}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Full Phenological Event Log */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Field Observation & Satellite History</span>
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {selectedCrop.fullHistoryNotes.map((note, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{note.event}</div>
                        <div className="text-[10px] text-slate-400">{note.date}</div>
                      </div>
                      <div className="font-bold text-emerald-700 shrink-0">
                        {note.ndviValue} NDVI
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                Crop ID: <strong>{selectedCrop.id}</strong> • Next Sentinel-2 pass: <strong>Tomorrow, 10:42 AM</strong>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
