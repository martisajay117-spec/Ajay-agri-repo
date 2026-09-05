import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  FileText,
  Plus,
  Bell,
  HelpCircle,
  Check,
  X,
  MapPin,
  TrendingUp,
  Droplets,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Sun,
  CloudSun,
  CloudRain,
  Zap,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  Thermometer,
  ShieldAlert,
  Printer,
  Share2,
  ExternalLink,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { ReportItem, ReportType } from '../../types/farm';

// ============================================================================
// REPORT PREVIEW CHART DATA CONSTANTS
// ============================================================================

// 1. Soil Health Data
const SOIL_NUTRIENTS_DATA = [
  { name: 'Nitrogen', value: 50, color: '#16a34a' },
  { name: 'Phosphorus', value: 24, color: '#f59e0b' },
  { name: 'Potassium', value: 16, color: '#3b82f6' },
  { name: 'Organic Matter', value: 10, color: '#8b5cf6' },
];

const SOIL_MOISTURE_SERIES = [
  { day: '1', moisture: 32 },
  { day: '3', moisture: 28 },
  { day: '5', moisture: 24 },
  { day: '7', moisture: 22 },
  { day: '9', moisture: 35 },
  { day: '11', moisture: 34 },
  { day: '13', moisture: 30 },
  { day: '15', moisture: 27 },
  { day: '17', moisture: 26 },
  { day: '19', moisture: 36 },
  { day: '21', moisture: 33 },
  { day: '23', moisture: 30 },
  { day: '25', moisture: 28 },
  { day: '27', moisture: 31 },
  { day: '29', moisture: 29 },
];

// 2. Yield Summary Data
const YIELD_BAR_DATA = [
  { field: 'North A', maize: 5.8, sugarcane: 6.2 },
  { field: 'Pale', maize: 6.4, sugarcane: 7.1 },
  { field: 'Zone 2', maize: 5.1, sugarcane: 5.9 },
  { field: 'East Field', maize: 6.9, sugarcane: 7.4 },
];

const YIELD_BAR_DATA_SECONDARY = [
  { field: 'North A', biomass: 78, projected: 82 },
  { field: 'Pale', biomass: 84, projected: 88 },
  { field: 'Zone 2', biomass: 69, projected: 73 },
  { field: 'East Field', biomass: 89, projected: 92 },
];

// 3. Weather Impact Data
const WEATHER_TREND_DATA = [
  { day: '1', temp: 24, rain: 2 },
  { day: '3', temp: 27, rain: 0 },
  { day: '5', temp: 31, rain: 8 },
  { day: '7', temp: 29, rain: 14 },
  { day: '11', temp: 34, rain: 4 },
  { day: '15', temp: 38, rain: 28 },
  { day: '18', temp: 32, rain: 18 },
  { day: '21', temp: 30, rain: 6 },
  { day: '23', temp: 33, rain: 12 },
  { day: '27', temp: 36, rain: 2 },
  { day: '29', temp: 31, rain: 5 },
];

// Initial default reports matching the screenshot
export const DEFAULT_REPORTS: ReportItem[] = [
  {
    id: 'report-soil-health',
    title: 'Soil Health Report',
    type: 'Soil Health',
    dateRange: 'Mar 15 - May 10, 2024',
    startDate: '2024-03-15',
    endDate: '2024-05-10',
    description:
      'Summary of soil health report nutrients, with contents, nutrients, and moisture graph, with all organizations.',
    fileSize: '4.8 MB',
    generatedDate: 'May 11, 2024',
    fieldsCovered: ['North Plot (32 Ac)', 'South Valley (25 Ac)', 'Central Field (32 Ac)'],
    keyMetrics: [
      { label: 'Avg Soil pH', value: '6.8', trend: 'neutral' },
      { label: 'Organic Matter', value: '2.85%', trend: 'up' },
      { label: 'Available Nitrogen', value: '34 kg/ha', trend: 'up' },
      { label: 'Moisture Adequacy', value: '94%', trend: 'up' },
    ],
    author: 'AgriN Soil Telemetry & Sentinel-2',
    downloadCount: 14,
  },
  {
    id: 'report-yield-summary',
    title: 'Yield Summary',
    type: 'Yield Summary',
    dateRange: 'Apr 1 - May 15, 2024',
    startDate: '2024-04-01',
    endDate: '2024-05-15',
    description:
      'Summary of crop yields by field proven. Maize owing Maize vs. Sugarcane, and crop extents by field.',
    fileSize: '6.2 MB',
    generatedDate: 'May 16, 2024',
    fieldsCovered: ['Zone 1 Maize', 'Zone 2 Sugarcane', 'Riverside Paddies'],
    keyMetrics: [
      { label: 'Maize Projected', value: '6.40 T/ha', trend: 'up' },
      { label: 'Sugarcane Index', value: '7.10 T/ha', trend: 'up' },
      { label: 'Harvest Index', value: '0.48', trend: 'neutral' },
      { label: 'Variance vs 2023', value: '+7.4%', trend: 'up' },
    ],
    author: 'BRICS Predictive Harvest Engine',
    downloadCount: 22,
  },
  {
    id: 'report-weather-impact',
    title: 'Weather Impact Report',
    type: 'Weather Impact',
    dateRange: 'May 1 - May 18, 2024',
    startDate: '2024-05-01',
    endDate: '2024-05-18',
    description:
      'Severe weather events of weather weather, combined with severe weather events and river details.',
    fileSize: '3.9 MB',
    generatedDate: 'May 18, 2024',
    fieldsCovered: ['All Green Valley Sectors'],
    keyMetrics: [
      { label: 'Max Heat Wave', value: '42.4 °C', trend: 'up' },
      { label: 'Precipitation Total', value: '46 mm', trend: 'neutral' },
      { label: 'Hail Risk Factor', value: 'Zero', trend: 'neutral' },
      { label: 'ET0 Evapotranspiration', value: '5.2 mm/day', trend: 'up' },
    ],
    author: 'ECMWF & Sentinel Agro-Met Service',
    downloadCount: 9,
  },
  {
    id: 'report-disease-history',
    title: 'Crop Disease History',
    type: 'Crop Disease History',
    dateRange: 'Feb 1 - May 18, 2024',
    startDate: '2024-02-01',
    endDate: '2024-05-18',
    description:
      'Summary of observations are observation for student prevalence and moisture and field prevalence.',
    fileSize: '5.1 MB',
    generatedDate: 'May 18, 2024',
    fieldsCovered: ['Soybean South Sector', 'Wheat North Block', 'Rice Paddies'],
    keyMetrics: [
      { label: 'Active Rust Sites', value: '0 Confirmed', trend: 'neutral' },
      { label: 'Powdery Mildew Risk', value: 'Moderate (Isolated)', trend: 'down' },
      { label: 'Stem Borer Traps', value: '6/trap/night', trend: 'neutral' },
      { label: 'Treated Hectares', value: '42.5 Ha', trend: 'neutral' },
    ],
    author: 'AgriN Computer Vision & Field Scouts',
    downloadCount: 18,
  },
];

interface ReportsViewProps {
  onOpenHelp?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenHelp }) => {
  // Top level filters
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Madhya Pradesh, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('May 1 – May 18, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Filter Bar state
  const [selectedReportType, setSelectedReportType] = useState<string>('All Types');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  // Reports state
  const [reportsList, setReportsList] = useState<ReportItem[]>(DEFAULT_REPORTS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Selected report modal
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  // Custom Report Generator Modal
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('Comprehensive Agronomic Audit Q2');
  const [customType, setCustomType] = useState<ReportType>('Soil Health');
  const [customStartDate, setCustomStartDate] = useState('2024-05-01');
  const [customEndDate, setCustomEndDate] = useState('2024-05-18');
  const [customField, setCustomField] = useState('All Fields');
  const [includeNdvi, setIncludeNdvi] = useState(true);
  const [includeNpk, setIncludeNpk] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(true);
  const [includePest, setIncludePest] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Floating toolbar
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      // Type filter
      if (selectedReportType !== 'All Types' && r.type !== selectedReportType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [reportsList, selectedReportType, searchQuery]);

  // Handle PDF download
  const handleDownloadPdf = (report: ReportItem) => {
    setDownloadingId(report.id);

    // Create a real downloadable agronomic report file
    setTimeout(() => {
      const reportContent = `===============================================================
AGRIN PRECISION AGRICULTURE - OFFICIAL REPORT
Report Title: ${report.title}
Report Category: ${report.type}
Period Covered: ${report.dateRange}
Generated Date: ${report.generatedDate}
Farm: ${selectedFarm}
Author / Engine: ${report.author}
===============================================================

EXECUTIVE SUMMARY:
${report.description}

FIELDS MONITORED:
${report.fieldsCovered.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

TELEMETRY & KEY METRICS:
${report.keyMetrics.map((m) => `  - ${m.label}: ${m.value}`).join('\n')}

SATELLITE VERIFICATION:
Sentinel-2 multispectral MSI sensor passes validated. 
Cloud cover index: < 3.2%. All NDVI polygons verified with BRICS regional agro-models.

RECOMMENDED INTERVENTIONS:
  1. Adhere to prescribed fertigation schedules based on nitrogen deficit.
  2. Implement integrated pest management (IPM) as flagged in disease matrix.
  3. Calibrate deep root soil tensiometers ahead of forecasted temperature spike.

Generated by AgriN Precision Agriculture Platform
Ref ID: AGRIN-${report.id.toUpperCase()}-2024
===============================================================`;

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AgriN_${report.title.replace(/\s+/g, '_')}_2024.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
      setDownloadSuccessToast(`Downloaded: ${report.title} (PDF Document)`);
      setTimeout(() => setDownloadSuccessToast(null), 4000);
    }, 900);
  };

  // Handle Custom Report Generation
  const handleGenerateCustomReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const newReport: ReportItem = {
        id: `report-custom-${Date.now()}`,
        title: customTitle.trim() || 'Custom Field Audit',
        type: customType,
        dateRange: `${customStartDate} to ${customEndDate}`,
        startDate: customStartDate,
        endDate: customEndDate,
        description: `Custom synthesized dossier for ${customField} covering ${[
          includeNdvi ? 'Sentinel-2 NDVI' : null,
          includeNpk ? 'NPK Soil Chemistry' : null,
          includeWeather ? 'Severe Weather Anomalies' : null,
          includePest ? 'Biosecurity Logs' : null,
        ]
          .filter(Boolean)
          .join(', ')}.`,
        fileSize: '5.4 MB',
        generatedDate: 'Today (Live)',
        fieldsCovered: [customField],
        keyMetrics: [
          { label: 'Composite Health Score', value: '88/100', trend: 'up' },
          { label: 'Acreage Assessed', value: '107 Acres', trend: 'neutral' },
          { label: 'Precision Confidence', value: '96.2%', trend: 'up' },
          { label: 'Data Points Analyzed', value: '14,820', trend: 'neutral' },
        ],
        author: 'AgriN On-Demand Custom Builder',
        downloadCount: 1,
      };

      setReportsList((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      setCustomModalOpen(false);
      setDownloadSuccessToast(`Custom Report "${newReport.title}" generated successfully!`);
      setTimeout(() => setDownloadSuccessToast(null), 4000);
    }, 1200);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{downloadSuccessToast}</span>
          <button
            onClick={() => setDownloadSuccessToast(null)}
            className="ml-2 text-emerald-200 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP HEADER ROW MATCHING SCREENSHOT                     */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Left: Page Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Reports & Downloads</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Exportable agronomic intelligence, Sentinel-2 analysis, nutrient balances & yield archives
          </p>
        </div>

        {/* Right Controls: Farm Selector, Notification Bell, Help, Generate Custom Report */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Generate Custom Report Button at Top Right */}
          <button
            onClick={() => setCustomModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Custom Report</span>
          </button>

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
              title="Report & Telemetry Alerts"
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
                    <span>Recent Generated Reports</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Ready to Download</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Weather Impact Report Ready</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Compiled May 18. Heatwave & river precipitation anomalies analyzed.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Yield Summary Q2 Compiled</span>
                    </div>
                    <div className="text-[11px] text-blue-700 mt-0.5">
                      Maize vs Sugarcane comparative indices ready for review.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            title="Reports & Analytics Guide"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FILTER CONTROLS BAR MATCHING SCREENSHOT               */}
      {/* ======================================================== */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Floating GIS Toolbar on left (from screenshot) */}
        <div className="hidden lg:flex absolute -left-2 top-3 -translate-x-full flex-col items-center bg-white border border-slate-200 rounded-xl shadow-md p-1 z-20 space-y-1 text-slate-600">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
            title="Zoom In"
            className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
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
            onClick={() => setZoomLevel(1)}
            title="Fit Extent"
            className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-slate-900 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-full h-px bg-slate-100" />
          <button
            onClick={() => {}}
            title="Spectral Layers"
            className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Controls: Date Range, Report Type, Filter Reports Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Picker matching screenshot */}
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
                <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {[
                    'May 1 – May 18, 2024',
                    'Apr 1 - May 15, 2024',
                    'Mar 15 - May 10, 2024',
                    'Feb 1 - May 18, 2024',
                    'Current Growing Season',
                    'All Historical Archive',
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

          {/* Report Type Dropdown with "Report Type" Label matching screenshot */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Report Type</span>
            <div className="relative">
              <button
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs min-w-[160px] justify-between"
              >
                <span>{selectedReportType}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {typeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setTypeDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                    {[
                      'All Types',
                      'Soil Health',
                      'Yield Summary',
                      'Weather Impact',
                      'Crop Disease History',
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedReportType(type);
                          setTypeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                          selectedReportType === type
                            ? 'font-bold text-emerald-700 bg-emerald-50/50'
                            : 'text-slate-700'
                        }`}
                      >
                        <span>{type}</span>
                        {selectedReportType === type && (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Search and "Filter Reports" button matching screenshot */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500 w-36 sm:w-44"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-semibold transition-colors shadow-2xs ${
              filterDrawerOpen || selectedReportType !== 'All Types'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Reports</span>
          </button>
        </div>
      </div>

      {/* Filter Drawer / Quick Filter Badges if opened */}
      {filterDrawerOpen && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700">Quick Filters:</span>
            {['All Types', 'Soil Health', 'Yield Summary', 'Weather Impact', 'Crop Disease History'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedReportType(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    selectedReportType === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => {
              setSelectedReportType('All Types');
              setSearchQuery('');
              setSelectedDateRange('May 1 – May 18, 2024');
            }}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. 2x2 GRID OF REPORT CARDS MATCHING SCREENSHOT           */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => {
          const isDownloading = downloadingId === report.id;

          return (
            <div
              key={report.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Title & Top-Right Download Icon */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
                  <h2
                    onClick={() => setPreviewReport(report)}
                    className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    {report.title}
                  </h2>
                  <button
                    onClick={() => handleDownloadPdf(report)}
                    title="Download Report PDF"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* 2-Column Body inside Card: Left Thumbnail Preview + Right Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  {/* Left (sm:col-span-6): High Fidelity Chart Thumbnail Preview */}
                  <div
                    onClick={() => setPreviewReport(report)}
                    className="sm:col-span-6 bg-slate-50/80 rounded-xl p-3 border border-slate-200 cursor-pointer hover:border-emerald-300 transition-colors flex flex-col justify-between min-h-[190px]"
                  >
                    {/* Thumbnail Internal Header */}
                    <div className="text-[11px] font-bold text-slate-700 pb-1.5 border-b border-slate-200/70 mb-2 flex items-center justify-between">
                      <span>{report.title}</span>
                      <span className="text-[9px] text-slate-400 font-normal">Preview</span>
                    </div>

                    {/* DYNAMIC THUMBNAILS MATCHING EACH REPORT TYPE */}
                    {report.type === 'Soil Health' && (
                      <div className="space-y-2">
                        {/* Donut & Nutrition Mini Visual */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="w-16 h-16">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={SOIL_NUTRIENTS_DATA}
                                  dataKey="value"
                                  innerRadius={14}
                                  outerRadius={26}
                                  paddingAngle={2}
                                >
                                  {SOIL_NUTRIENTS_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="text-[9px] space-y-0.5 text-slate-500 font-medium">
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                              <span>Nitrogen 50%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>Phosphorus 24%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span>Potassium 16%</span>
                            </div>
                          </div>
                        </div>

                        {/* Moisture Wave Graph underneath */}
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-400 mb-0.5 font-medium">
                            <span>Moisture %</span>
                            <span>Days 1-29</span>
                          </div>
                          <div className="h-14 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={SOIL_MOISTURE_SERIES}>
                                <Area
                                  type="monotone"
                                  dataKey="moisture"
                                  stroke="#0284c7"
                                  fill="#bae6fd"
                                  fillOpacity={0.6}
                                  strokeWidth={1.5}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}

                    {report.type === 'Yield Summary' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
                          <span>Yield (T/ha)</span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-xs bg-emerald-600" /> Maize
                            <span className="w-1.5 h-1.5 rounded-xs bg-lime-500" /> Sugarcane
                          </span>
                        </div>
                        {/* Top Dual Bar Chart */}
                        <div className="h-16 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={YIELD_BAR_DATA} barGap={1}>
                              <Bar dataKey="maize" fill="#16a34a" radius={[2, 2, 0, 0]} />
                              <Bar dataKey="sugarcane" fill="#84cc16" radius={[2, 2, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Bottom Secondary Bar Chart */}
                        <div className="h-14 w-full pt-1 border-t border-slate-200/60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={YIELD_BAR_DATA_SECONDARY} barGap={1}>
                              <Bar dataKey="biomass" fill="#d97706" radius={[2, 2, 0, 0]} />
                              <Bar dataKey="projected" fill="#65a30d" radius={[2, 2, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {report.type === 'Weather Impact' && (
                      <div className="space-y-2">
                        {/* Weather Icons Row */}
                        <div className="flex items-center justify-around py-1 bg-white/70 rounded-lg border border-slate-200/60 text-slate-600">
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          <CloudSun className="w-3.5 h-3.5 text-slate-500" />
                          <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                          <Zap className="w-3.5 h-3.5 text-indigo-500" />
                        </div>

                        {/* Temperature & Rainfall Dual Graph */}
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-400 mb-0.5 font-medium">
                            <span className="text-amber-600 font-semibold">— Temperature</span>
                            <span className="text-blue-600 font-semibold">— Rainfall</span>
                          </div>
                          <div className="h-16 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={WEATHER_TREND_DATA}>
                                <Line
                                  type="monotone"
                                  dataKey="temp"
                                  stroke="#d97706"
                                  strokeWidth={1.5}
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="rain"
                                  stroke="#0284c7"
                                  strokeWidth={1.5}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}

                    {report.type === 'Crop Disease History' && (
                      <div className="space-y-2">
                        {/* Disease Icon row matching screenshot */}
                        <div className="grid grid-cols-4 gap-1 text-center py-1">
                          <div className="flex flex-col items-center">
                            <ShieldAlert className="w-3 h-3 text-emerald-600" />
                            <span className="text-[8px] text-slate-500">Rust</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <span className="text-[8px] text-slate-500">Blight</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span className="text-[8px] text-slate-500">Mildew</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            <span className="text-[8px] text-slate-500">Aphids</span>
                          </div>
                        </div>

                        {/* Field Prevalence Heatmap Grid */}
                        <div className="space-y-1">
                          <div className="text-[9px] text-slate-400 font-medium">
                            Field Prevalence Matrix
                          </div>
                          <div className="grid grid-cols-3 gap-1 h-14">
                            <div className="bg-emerald-100 rounded-sm flex items-center justify-center text-[9px] font-bold text-emerald-800">
                              Feb Low
                            </div>
                            <div className="bg-amber-100 rounded-sm flex items-center justify-center text-[9px] font-bold text-amber-800">
                              Mar Mid
                            </div>
                            <div className="bg-orange-100 rounded-sm flex items-center justify-center text-[9px] font-bold text-orange-800">
                              May Iso
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Generic / Custom Report Fallback Preview */}
                    {report.type === 'Custom' && (
                      <div className="space-y-2 py-3 text-center">
                        <FileText className="w-8 h-8 text-emerald-600 mx-auto" />
                        <div className="text-[10px] font-bold text-slate-700">
                          Custom Compiled Dossier
                        </div>
                        <div className="text-[9px] text-slate-400">
                          Multi-metric synthesized analytics
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right (sm:col-span-6): Metadata, Date Range & Description */}
                  <div className="sm:col-span-6 flex flex-col justify-between space-y-3">
                    {/* Date Range Covered matching screenshot */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{report.dateRange}</span>
                    </div>

                    {/* Short Description text */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {report.description}
                    </p>

                    {/* Key Metrics Chips */}
                    <div className="grid grid-cols-2 gap-1.5 py-1">
                      {report.keyMetrics.slice(0, 2).map((km, i) => (
                        <div key={i} className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="text-[9px] text-slate-400 truncate">{km.label}</div>
                          <div className="text-[11px] font-extrabold text-slate-800">
                            {km.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Large Download PDF Button matching screenshot */}
                    <button
                      onClick={() => handleDownloadPdf(report)}
                      disabled={isDownloading}
                      className="w-full py-2.5 px-4 bg-[#236336] hover:bg-[#1a4f2b] active:bg-[#143e22] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 4. REPORT PREVIEW DOSSIER MODAL                           */}
      {/* ======================================================== */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Top Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {previewReport.title}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{previewReport.dateRange}</span>
                    <span>•</span>
                    <span>{previewReport.fileSize}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{previewReport.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPdf(previewReport)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Executive Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Executive Agronomic Summary
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {previewReport.description}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="font-semibold text-slate-500">Parcels Audited:</span>
                  {previewReport.fieldsCovered.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Telemetry Metrics Grid */}
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-3">
                  Telemetry & Physical Indices
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {previewReport.keyMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs"
                    >
                      <div className="text-xs text-slate-500 font-medium">{metric.label}</div>
                      <div className="text-lg font-extrabold text-slate-900 mt-1">
                        {metric.value}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>BRICS benchmark passed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Audit Logs */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 p-3 text-xs font-bold text-slate-700 border-b border-slate-200">
                  Data Sensor Audit Trail
                </div>
                <div className="p-3.5 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Sentinel-2 Orbit Track</span>
                    <span className="text-slate-500">Relative Orbit R019, Tiles T43RDM / T43REM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Atmospheric Correction</span>
                    <span className="text-slate-500">Sen2Cor Level-2A Bottom-Of-Atmosphere (BOA)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Cloud & Shadow Masking</span>
                    <span className="text-slate-500">Scene Classification Layer (SCL) &gt; 98.4% Clear</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-slate-700">In-situ Soil Telemetry</span>
                    <span className="text-slate-500">LoRaWAN Capacitive TDR Probes at 15cm & 45cm</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => handleDownloadPdf(previewReport)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full PDF Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. GENERATE CUSTOM REPORT BUILDER MODAL                  */}
      {/* ======================================================== */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Generate Custom Agronomic Report
                  </h3>
                  <p className="text-xs text-slate-500">
                    Synthesize custom satellite bands, soil telemetry, and yield estimates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCustomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleGenerateCustomReport} className="p-5 space-y-4 text-xs">
              {/* Report Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Report Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500"
                  placeholder="e.g. Q2 Fertilizer & Soil Vigor Assessment"
                />
              </div>

              {/* Report Category */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Report Category</label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as ReportType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500"
                >
                  <option value="Soil Health">Soil Health & Nutrients (NPK)</option>
                  <option value="Yield Summary">Crop Yield & Biomass Estimates</option>
                  <option value="Weather Impact">Weather Impact & Precipitation</option>
                  <option value="Crop Disease History">Crop Disease & Biosecurity History</option>
                  <option value="Custom">Custom Multidisciplinary Dossier</option>
                </select>
              </div>

              {/* Date Range Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              {/* Target Field */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Target Field / Plot</label>
                <select
                  value={customField}
                  onChange={(e) => setCustomField(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500"
                >
                  <option value="All Fields">All Green Valley Sectors (107 Acres)</option>
                  <option value="North Plot (32 Acres)">North Plot (32 Acres) - Wheat</option>
                  <option value="Riverside Paddies (18 Acres)">Riverside Paddies (18 Acres) - Rice</option>
                  <option value="Central Field (32 Acres)">Central Field (32 Acres) - Maize</option>
                  <option value="South Valley (25 Acres)">South Valley (25 Acres) - Soybean</option>
                </select>
              </div>

              {/* Metrics Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-700">Modules to Include</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNdvi}
                      onChange={(e) => setIncludeNdvi(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Sentinel-2 NDVI Maps</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNpk}
                      onChange={(e) => setIncludeNpk(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">NPK Soil Nutrients</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeWeather}
                      onChange={(e) => setIncludeWeather(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Severe Weather Logs</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePest}
                      onChange={(e) => setIncludePest(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Pest & Disease Traps</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Compiling Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate & Compile Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
