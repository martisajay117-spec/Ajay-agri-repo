import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HelpCircle,
  Calendar,
  ChevronDown,
  Loader2,
  Sprout,
  Plus,
  X,
  Menu,
  Check,
  Download,
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Radio,
  Battery,
  Wifi,
  AlertTriangle,
  SlidersHorizontal,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { Farm, FieldHealthHistory, AiRecommendation, CropDiagnostic, WeatherData, NotificationItem } from '../types/farm';
import {
  subscribeFarms,
  subscribeFieldHealthHistory,
  subscribeAiRecommendations,
  subscribeCropDiagnostics,
  toggleRecommendationStatus,
  saveCropDiagnostic,
  createFarm,
  seedInitialFarmerData,
} from '../firebase/farmService';
import { fetchLiveWeather } from '../services/weatherService';
import { SidebarNav } from './dashboard/SidebarNav';
import { FarmSelector } from './dashboard/FarmSelector';
import { FieldHealthMapCard } from './dashboard/FieldHealthMapCard';
import { SoilHealthCard } from './dashboard/SoilHealthCard';
import { WeatherCard } from './dashboard/WeatherCard';
import { CropHealthTrendChart } from './dashboard/CropHealthTrendChart';
import { AiAdvisoryCard } from './dashboard/AiAdvisoryCard';
import { CropDiagnosticCard } from './dashboard/CropDiagnosticCard';
import { NotificationPopover } from './dashboard/NotificationPopover';
import { AddFarmModal } from './dashboard/AddFarmModal';
import { FieldsView } from './dashboard/FieldsView';
import { CropHealthView } from './dashboard/CropHealthView';
import { ReportsView } from './dashboard/ReportsView';
import { MarketplaceView } from './dashboard/MarketplaceView';
import { CommunityView } from './dashboard/CommunityView';
import { SettingsView } from './dashboard/SettingsView';
import { SatelliteInsightsView } from './dashboard/SatelliteInsightsView';
import { SoilHealthView } from './dashboard/SoilHealthView';
import { WeatherView } from './dashboard/WeatherView';
import { AiAdvisoryView } from './dashboard/AiAdvisoryView';
import { IrrigationView } from './dashboard/IrrigationView';

const DEFAULT_FARM: Farm = {
  id: 'farm-green-valley',
  farmerId: 'demo-farmer-1',
  farmName: 'Green Valley Farm',
  location: 'Punjab, India',
  lat: 30.901,
  lng: 75.8573,
  farmSize: '25 Acres',
  cropType: 'Wheat',
  fieldHealthIndex: 82,
  soilMoisture: 31,
  organicMatter: 2.85,
  nitrogenLevel: 34,
  soilPh: 6.8,
  phosphorus: 26,
  potassium: 195,
  predictedYield: '4.9 T/ha',
  lastUpdated: 'May 18, 2024',
  createdAt: '2024-01-15',
};

export const Dashboard: React.FC = () => {
  const { userProfile, currentUser, setCurrentView } = useAuth();

  // Role Detection
  const role = userProfile?.role || 'farmer';
  const isFarmer = role === 'farmer';

  // Navigation State - default to 'dashboard' for enterprise operations view
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Farmer State
  const [farms, setFarms] = useState<Farm[]>([DEFAULT_FARM]);
  const [activeFarm, setActiveFarm] = useState<Farm | null>(DEFAULT_FARM);
  const [fieldHistory, setFieldHistory] = useState<FieldHealthHistory[]>([]);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [diagnostics, setDiagnostics] = useState<CropDiagnostic[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingFarms, setLoadingFarms] = useState<boolean>(false);
  const [isAddFarmOpen, setIsAddFarmOpen] = useState<boolean>(false);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());

  // Date range picker state
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7D (Last 7 Days)');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [thresholdModalOpen, setThresholdModalOpen] = useState(false);
  const [pdfReportOpen, setPdfReportOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('4m ago');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefreshTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSyncTime('Just now');
      setIsSyncing(false);
    }, 600);
  };

  const handleExportCsv = () => {
    if (!activeFarm) return;
    const headers = [
      'Timestamp_UTC',
      'Device_Serial',
      'Field_Name',
      'Location',
      'Latitude',
      'Longitude',
      'Area_Acres',
      'Crop_Type',
      'NDVI_Vegetative_Index',
      'Soil_Moisture_VWC_Pct',
      'Soil_pH',
      'Nitrogen_kg_ha',
      'Phosphorus_kg_ha',
      'Potassium_kg_ha',
      'Organic_Carbon_Pct',
      'Battery_Voltage',
      'Signal_RSSI_dBm',
      'Telemetry_Gateway'
    ];
    const row = [
      new Date().toISOString(),
      'SN-704-B',
      `"${activeFarm.farmName}"`,
      `"${activeFarm.location}"`,
      activeFarm.lat || 30.9010,
      activeFarm.lng || 75.8573,
      '25.0',
      `"${activeFarm.cropType || 'Wheat'}"`,
      activeFarm.fieldHealthIndex ? (activeFarm.fieldHealthIndex / 100).toFixed(2) : '0.82',
      activeFarm.soilMoisture || 31.4,
      activeFarm.soilPh || 6.8,
      activeFarm.nitrogenLevel || 34,
      activeFarm.phosphorus || 26,
      activeFarm.potassium || 195,
      activeFarm.organicMatter || 2.85,
      '3.92V',
      '-78 dBm',
      'LoRa-GW2'
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeFarm.farmName.toLowerCase().replace(/\s+/g, '_')}_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Subscribe to Farmer's farms in Firestore
  useEffect(() => {
    if (!currentUser || !isFarmer) {
      setLoadingFarms(false);
      return;
    }

    setLoadingFarms(true);

    const unsubscribe = subscribeFarms(currentUser.uid, async (fetchedFarms) => {
      if (fetchedFarms.length === 0) {
        // If farmer has 0 farms, seed realistic telemetry for their region
        try {
          const seeded = await seedInitialFarmerData(
            currentUser.uid,
            userProfile?.country || 'India',
            userProfile?.fullName || 'Ramesh Verma'
          );
          if (seeded) {
            setFarms([seeded]);
            setActiveFarm(seeded);
          }
        } catch (e) {
          console.error('Error auto-seeding initial farm data:', e);
        }
      } else {
        setFarms(fetchedFarms);
        setActiveFarm((prev) => {
          if (prev) {
            const found = fetchedFarms.find((f) => f.id === prev.id);
            return found || fetchedFarms[0];
          }
          return fetchedFarms[0];
        });
      }
      setLoadingFarms(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid, isFarmer, userProfile?.country, userProfile?.fullName]);

  // 2. Subscribe to subcollections when activeFarm changes
  useEffect(() => {
    if (!activeFarm) {
      setFieldHistory([]);
      setRecommendations([]);
      setDiagnostics([]);
      setWeather(null);
      return;
    }

    // Subscribe to NDVI history
    const unsubHistory = subscribeFieldHealthHistory(activeFarm.id, (hist) => {
      setFieldHistory(hist);
    });

    // Subscribe to AI recommendations
    const unsubRecs = subscribeAiRecommendations(activeFarm.id, (recs) => {
      setRecommendations(recs);
    });

    // Subscribe to Crop Diagnostics
    const unsubDiags = subscribeCropDiagnostics(activeFarm.id, (diags) => {
      setDiagnostics(diags);
    });

    // Fetch Live Weather for farm location
    fetchLiveWeather(activeFarm.location, activeFarm.lat, activeFarm.lng).then((wData) => {
      setWeather(wData);
    });

    return () => {
      unsubHistory();
      unsubRecs();
      unsubDiags();
    };
  }, [activeFarm?.id, activeFarm?.location, activeFarm?.lat, activeFarm?.lng]);

  // Dynamic live notifications
  const notifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    // Pending AI recommendations
    recommendations
      .filter((r) => r.status === 'pending')
      .slice(0, 3)
      .forEach((r) => {
        list.push({
          id: `rec-${r.id}`,
          type: 'recommendation',
          title: r.title,
          message: r.description,
          timeAgo: r.actionDue ? `Due ${r.actionDue}` : 'Active Advisory',
          read: readNotificationIds.has(`rec-${r.id}`),
        });
      });

    // Recent crop diagnostic alert
    if (diagnostics.length > 0) {
      const latest = diagnostics[0];
      list.push({
        id: `diag-${latest.id}`,
        type: 'diagnostic',
        title: `Leaf Diagnostic: ${latest.diagnosisResult}`,
        message: latest.treatmentRecommendation || 'Inspect crop canopy.',
        timeAgo: 'Recent Scan',
        read: readNotificationIds.has(`diag-${latest.id}`),
      });
    }

    // Weather alert
    if (weather?.current) {
      list.push({
        id: 'weather-alert-1',
        type: 'weather',
        title: `Microclimate: ${weather.current.temp}°C ${weather.current.condition}`,
        message: `Humidity at ${weather.current.humidity}%, wind ${weather.current.windSpeed} km/h. Suitable for field operations.`,
        timeAgo: 'Live',
        read: readNotificationIds.has('weather-alert-1'),
      });
    }

    return list;
  }, [recommendations, diagnostics, weather, readNotificationIds]);

  const handleMarkAsRead = (id: string) => {
    setReadNotificationIds((prev) => new Set([...prev, id]));
  };

  const handleMarkAllAsRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadNotificationIds(allIds);
  };

  const handleToggleRec = async (recId: string, currentStatus: 'pending' | 'done') => {
    if (!activeFarm) return;
    await toggleRecommendationStatus(activeFarm.id, recId, currentStatus);
  };

  const handleSaveDiagnosis = async (diag: Omit<CropDiagnostic, 'id'>) => {
    if (!activeFarm) return;
    await saveCropDiagnostic(activeFarm.id, {
      ...diag,
      farmerId: currentUser?.uid,
    });
  };

  const handleAddFarm = async (farmData: Partial<Farm>) => {
    if (!currentUser) return;
    const newId = await createFarm(currentUser.uid, farmData);
    if (newId) {
      const newFarmObj: Farm = {
        id: newId,
        farmerId: currentUser.uid,
        farmName: farmData.farmName || 'Green Valley Farm',
        location: farmData.location || 'Madhya Pradesh, India',
        lat: farmData.lat,
        lng: farmData.lng,
        farmSize: farmData.farmSize || '10 Hectares',
        cropType: farmData.cropType || 'Soybeans',
        fieldHealthIndex: farmData.fieldHealthIndex || 72,
        soilMoisture: farmData.soilMoisture || 28,
        organicMatter: farmData.organicMatter || 2.35,
        nitrogenLevel: farmData.nitrogenLevel || 28,
        soilPh: farmData.soilPh || 6.6,
        phosphorus: farmData.phosphorus || 18,
        potassium: farmData.potassium || 210,
        predictedYield: farmData.predictedYield || '4.8 T/ha',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setFarms((prev) => [...prev, newFarmObj]);
      setActiveFarm(newFarmObj);
    }
  };

  const farmerFirstName = userProfile?.fullName
    ? userProfile.fullName.split(' ')[0]
    : 'Ramesh';

  return (
    <div className="min-h-screen bg-[#f3f6f8] flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0d381a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#22c55e] flex items-center justify-center text-white">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">AgriN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-white hover:bg-[#134421] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Slide-out Sidebar Drawer */}
          <div className="relative z-50 w-64 max-w-[82vw] h-full shadow-2xl">
            <SidebarNav
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              onCloseMobileMenu={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:block shrink-0 z-30">
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'settings' ? (
            <SettingsView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'community' ? (
            <CommunityView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'marketplace' ? (
            <MarketplaceView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'reports' ? (
            <ReportsView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'crop_health' ? (
            <CropHealthView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'satellite' ? (
            <SatelliteInsightsView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'soil' ? (
            <SoilHealthView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'weather' ? (
            <WeatherView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'ai_advisory' ? (
            <AiAdvisoryView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'irrigation' ? (
            <IrrigationView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : activeTab === 'fields' ? (
            <FieldsView onOpenHelp={() => setHelpModalOpen(true)} />
          ) : (
            <>
              {/* Top Dashboard Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                {/* Left: Title & Field Specs */}
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                      {activeFarm?.farmName || 'Field Operations Dashboard'}
                    </h1>
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {activeFarm?.farmSize || '25 Acres'} • {activeFarm?.cropType || 'Wheat'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-normal mt-1">
                    Real-time field operations, Sentinel-2 vegetative density index (NDVI), and soil intelligence
                  </p>
                </div>

                {/* Right: Controls (Farm Selector, Notifications, Help) */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Farm Selector */}
                  <FarmSelector
                    farms={farms}
                    activeFarm={activeFarm}
                    onSelectFarm={(f) => setActiveFarm(f)}
                    onOpenAddModal={() => setIsAddFarmOpen(true)}
                  />

                  {/* Notification Bell */}
                  <NotificationPopover
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                  />

                  {/* Help Guide */}
                  <button
                    onClick={() => setHelpModalOpen(true)}
                    title="User Manual & Help"
                    className="w-8.5 h-8.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Loading Skeleton */}
              {loadingFarms ? (
                <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                  <div className="text-sm font-bold text-slate-800">
                    Synchronizing live Sentinel-2 satellite passes and soil telemetry...
                  </div>
                </div>
              ) : !activeFarm ? (
                /* Empty State */
                <div className="p-12 sm:p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                    <Sprout className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">No Farm Fields Configured</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Connect your first agricultural plot to begin receiving real-time NDVI health trends, AI crop advisories, and soil telemetry.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddFarmOpen(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Field</span>
                  </button>
                </div>
              ) : (
                /* ======================================================== */
                /* 6-CARD DASHBOARD GRID (2 ROWS × 3 COLUMNS)               */
                /* ======================================================== */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                  {/* Card 1: Field Health Map (NDVI) */}
                  <div className="h-full">
                    <FieldHealthMapCard farm={activeFarm} />
                  </div>

                  {/* Card 2: Soil Health Overview */}
                  <div className="h-full">
                    <SoilHealthCard farm={activeFarm} />
                  </div>

                  {/* Card 3: Weather Forecast */}
                  <div className="h-full">
                    <WeatherCard
                      weather={weather}
                      locationName={activeFarm.location}
                    />
                  </div>

                  {/* Card 4: Crop Health Trend (NDVI) */}
                  <div className="h-full">
                    <CropHealthTrendChart history={fieldHistory} />
                  </div>

                  {/* Card 5: AI Advisory */}
                  <div className="h-full">
                    <AiAdvisoryCard
                      farmId={activeFarm.id}
                      recommendations={recommendations}
                      onToggleStatus={handleToggleRec}
                    />
                  </div>

                  {/* Card 6: Crop Disease Diagnostic */}
                  <div className="h-full">
                    <CropDiagnosticCard
                      farmId={activeFarm.id}
                      diagnostics={diagnostics}
                      onSaveDiagnosis={handleSaveDiagnosis}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add New Farm Modal */}
      <AddFarmModal
        isOpen={isAddFarmOpen}
        onClose={() => setIsAddFarmOpen(false)}
        onAddFarm={handleAddFarm}
        farmerCountry={userProfile?.country}
      />

      {/* Dashboard Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">AgriN Farmer Guide</h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <div className="font-bold text-slate-900 mb-0.5">🌾 Field Health Map (NDVI)</div>
                <p className="text-slate-600">
                  Reflects Sentinel-2 satellite vegetative density. Green zones indicate vigorous biomass, while orange/red flags water or pest stress.
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-900 mb-0.5">🧪 Soil Health Overview</div>
                <p className="text-slate-600">
                  Aggregates IoT soil probe telemetry for pH, Organic Matter, and NPK macronutrients.
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-900 mb-0.5">💡 AI Advisory Actions</div>
                <p className="text-slate-600">
                  Actionable irrigation, fertilizer, and pest management tasks. Check them off when executed in the field.
                </p>
              </div>
              <div>
                <div className="font-bold text-slate-900 mb-0.5">🔬 Crop Disease Diagnostic</div>
                <p className="text-slate-600">
                  Upload a photo of any unhealthy plant leaf to receive immediate AI pathology classification and organic treatment recommendations.
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Threshold Rules & Alerts Modal */}
      {thresholdModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-800">Telemetry Threshold & Alert Rules</h3>
              </div>
              <button
                onClick={() => setThresholdModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-600">
                Configure automated alarm triggers for wireless LoRaWAN soil probes and Sentinel-2 vegetation passes.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Soil Moisture Minimum (Rootzone 15-30cm)</span>
                    <span className="font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Trigger &lt; 25.0%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Current Reading: <span className="font-mono text-slate-800 font-semibold">21.4% VWC</span> (Alert active in Zone 3).
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Vegetative Anomaly (NDVI Drop Threshold)</span>
                    <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      Trigger &Delta; &gt; -0.10
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Current Trend: <span className="font-mono text-[#1e5128] font-semibold">+0.08 NDVI / 7D</span> (Healthy vigor).
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Foliar Disease Confidence Threshold</span>
                    <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      Trigger &gt; 80.0%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Auto-schedules bio-fungicide recommendation and alerts mobile field agent.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setThresholdModalOpen(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setThresholdModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
              >
                Save Thresholds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Agronomic Field Report Modal */}
      {pdfReportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-800">Agronomic Audit & Telemetry Report</h3>
              </div>
              <button
                onClick={() => setPdfReportOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-6 overflow-y-auto space-y-4 font-sans print:p-0">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <div className="text-base font-bold text-slate-900">{activeFarm?.farmName || 'Green Valley Farm'}</div>
                  <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                    Field ID: {activeFarm?.id || 'SN-704'} • Location: {activeFarm?.location}
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono">
                    Coordinates: {activeFarm?.lat?.toFixed(4) || '30.9010'}°N, {activeFarm?.lng?.toFixed(4) || '75.8573'}°E • Area: {activeFarm?.farmSize}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-slate-500">Report Generated:</div>
                  <div className="text-xs font-mono font-semibold text-slate-800">{new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700">
                    ISO-14040 Certified
                  </span>
                </div>
              </div>

              {/* Summary Stats Table */}
              <div>
                <div className="text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                  1. Current Telemetry Snapshot
                </div>
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50 text-[11px] text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-2 font-semibold">Metric</th>
                      <th className="p-2 font-semibold">Observed Value</th>
                      <th className="p-2 font-semibold">Agronomic Target</th>
                      <th className="p-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="p-2 font-medium text-slate-700">NDVI Canopy Index</td>
                      <td className="p-2 font-mono font-bold text-slate-900">0.82</td>
                      <td className="p-2 font-mono text-slate-500">0.70 – 0.85</td>
                      <td className="p-2 text-[#1e5128] font-semibold">Optimal</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-700">Rootzone Moisture (15-30cm)</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{activeFarm?.soilMoisture || 31.4}%</td>
                      <td className="p-2 font-mono text-slate-500">28.0 – 35.0%</td>
                      <td className="p-2 text-[#1e5128] font-semibold">Field Capacity</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-700">Soil pH</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{activeFarm?.soilPh || 6.8}</td>
                      <td className="p-2 font-mono text-slate-500">6.5 – 7.2</td>
                      <td className="p-2 text-[#1e5128] font-semibold">Neutral</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-700">Available Nitrogen (N)</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{activeFarm?.nitrogenLevel || 34} kg/ha</td>
                      <td className="p-2 font-mono text-slate-500">30 – 40 kg/ha</td>
                      <td className="p-2 text-[#1e5128] font-semibold">Target Range</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-700">Phosphorus (P)</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{activeFarm?.phosphorus || 26} kg/ha</td>
                      <td className="p-2 font-mono text-slate-500">25 – 35 kg/ha</td>
                      <td className="p-2 text-slate-700 font-semibold">Sufficient</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-slate-700">Potassium (K)</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{activeFarm?.potassium || 195} kg/ha</td>
                      <td className="p-2 font-mono text-slate-500">180 – 220 kg/ha</td>
                      <td className="p-2 text-[#1e5128] font-semibold">Optimal</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Hardware & Calibration Signoff */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Hardware & Traceability Verification</div>
                <div>Probe SN-704-B calibrated via SDI-12 protocol. Gateway LoRa-GW2 latency: 184ms. Satellite imagery supplied by European Space Agency Sentinel-2 MSI instrument.</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-mono">AgriN Enterprise v2.4</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setPdfReportOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
