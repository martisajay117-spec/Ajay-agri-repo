import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  ChevronDown,
  Bell,
  HelpCircle,
  Check,
  X,
  Sparkles,
  Wheat,
  Trees,
  Layers,
  Activity,
  Filter,
} from 'lucide-react';
import { FieldPlot, FieldStatus } from '../../types/farm';

// Realistic aerial/satellite textures for field parcels
const AERIAL_TEXTURES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80',
];

export const INITIAL_FIELDS: FieldPlot[] = [
  {
    id: 'field-1',
    name: 'North Wheat Plot',
    cropType: 'Wheat',
    sizeAcres: 25,
    status: 'Good',
    updatedDate: 'May 17, 2024',
    imageUrl: AERIAL_TEXTURES[0],
    polygonPoints: '15,10 80,18 90,65 65,85 20,80',
    polygonColor: '#22c55e', // Green
    ndviScore: 0.82,
    soilMoisture: 31,
    nitrogenLevel: 34,
  },
  {
    id: 'field-2',
    name: 'East Sugarcane Block',
    cropType: 'Sugarcane',
    sizeAcres: 18,
    status: 'Moderate',
    updatedDate: 'May 18, 2024',
    imageUrl: AERIAL_TEXTURES[1],
    polygonPoints: '30,12 85,30 65,85 15,60',
    polygonColor: '#eab308', // Yellow
    ndviScore: 0.65,
    soilMoisture: 24,
    nitrogenLevel: 26,
  },
  {
    id: 'field-3',
    name: 'Central Maize Field',
    cropType: 'Maize',
    sizeAcres: 32,
    status: 'Poor',
    updatedDate: 'May 17, 2024',
    imageUrl: AERIAL_TEXTURES[2],
    polygonPoints: '25,15 75,10 90,55 70,88 20,70',
    polygonColor: '#ef4444', // Red
    ndviScore: 0.44,
    soilMoisture: 18,
    nitrogenLevel: 19,
  },
  {
    id: 'field-4',
    name: 'Central Maize Field',
    cropType: 'Maize',
    sizeAcres: 32,
    status: 'Good',
    updatedDate: 'May 17, 2024',
    imageUrl: AERIAL_TEXTURES[3],
    polygonPoints: '20,20 75,15 85,70 45,90 15,60',
    polygonColor: '#22c55e', // Green
    ndviScore: 0.79,
    soilMoisture: 29,
    nitrogenLevel: 32,
  },
  {
    id: 'field-5',
    name: 'North nl Maize Field',
    cropType: 'Maize',
    sizeAcres: 32,
    status: 'Moderate',
    updatedDate: 'May 18, 2024',
    imageUrl: AERIAL_TEXTURES[4],
    polygonPoints: '35,10 75,35 60,85 20,55',
    polygonColor: '#eab308', // Yellow
    ndviScore: 0.61,
    soilMoisture: 22,
    nitrogenLevel: 25,
  },
  {
    id: 'field-6',
    name: 'Central Sentant Field',
    cropType: 'Maize',
    sizeAcres: 32,
    status: 'Poor',
    updatedDate: 'May 18, 2024',
    imageUrl: AERIAL_TEXTURES[5],
    polygonPoints: '20,15 80,12 92,60 55,88 15,65',
    polygonColor: '#ef4444', // Red
    ndviScore: 0.42,
    soilMoisture: 17,
    nitrogenLevel: 18,
  },
  {
    id: 'field-7',
    name: 'Nortm Maize Field',
    cropType: 'Maize',
    sizeAcres: 28,
    status: 'Moderate',
    updatedDate: 'May 18, 2024',
    imageUrl: AERIAL_TEXTURES[1],
    polygonPoints: '25,15 80,25 70,85 15,65',
    polygonColor: '#eab308', // Yellow
    ndviScore: 0.59,
    soilMoisture: 23,
    nitrogenLevel: 24,
  },
  {
    id: 'field-8',
    name: 'Central Maize',
    cropType: 'Maize',
    sizeAcres: 24,
    status: 'Good',
    updatedDate: 'May 18, 2024',
    imageUrl: AERIAL_TEXTURES[0],
    polygonPoints: '20,20 75,10 88,60 60,85 18,70',
    polygonColor: '#22c55e', // Green
    ndviScore: 0.81,
    soilMoisture: 30,
    nitrogenLevel: 33,
  },
  {
    id: 'field-9',
    name: 'North Wheat Plot',
    cropType: 'Wheat',
    sizeAcres: 20,
    status: 'Moderate',
    updatedDate: 'May 17, 2024',
    imageUrl: AERIAL_TEXTURES[3],
    polygonPoints: '15,15 80,15 85,75 50,85 20,60',
    polygonColor: '#ef4444', // Red boundary
    ndviScore: 0.63,
    soilMoisture: 25,
    nitrogenLevel: 27,
  },
  {
    id: 'field-10',
    name: 'South Valley Soybean',
    cropType: 'Soybean',
    sizeAcres: 35,
    status: 'Good',
    updatedDate: 'May 19, 2024',
    imageUrl: AERIAL_TEXTURES[4],
    polygonPoints: '25,10 85,20 75,80 20,75',
    polygonColor: '#22c55e',
    ndviScore: 0.86,
    soilMoisture: 32,
    nitrogenLevel: 35,
  },
  {
    id: 'field-11',
    name: 'Riverside Rice Paddies',
    cropType: 'Rice',
    sizeAcres: 16,
    status: 'Good',
    updatedDate: 'May 19, 2024',
    imageUrl: AERIAL_TEXTURES[2],
    polygonPoints: '15,20 85,15 90,65 55,85 15,70',
    polygonColor: '#22c55e',
    ndviScore: 0.84,
    soilMoisture: 38,
    nitrogenLevel: 31,
  },
  {
    id: 'field-12',
    name: 'Eastern Cotton Block',
    cropType: 'Cotton',
    sizeAcres: 22,
    status: 'Moderate',
    updatedDate: 'May 18, 2024',
    imageUrl: AERIAL_TEXTURES[5],
    polygonPoints: '30,15 80,25 70,80 20,60',
    polygonColor: '#eab308',
    ndviScore: 0.62,
    soilMoisture: 21,
    nitrogenLevel: 25,
  },
];

interface FieldsViewProps {
  onOpenHelp?: () => void;
}

export const FieldsView: React.FC<FieldsViewProps> = ({ onOpenHelp }) => {
  const [fields, setFields] = useState<FieldPlot[]>(INITIAL_FIELDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'size-desc' | 'name-asc'>('default');

  // Top header dropdown states
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('May 12 – May 19, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);

  // Add Field Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newCropType, setNewCropType] = useState('Wheat');
  const [newSizeAcres, setNewSizeAcres] = useState<number>(20);
  const [newStatus, setNewStatus] = useState<FieldStatus>('Good');

  // Field Detail Modal State
  const [selectedPlot, setSelectedPlot] = useState<FieldPlot | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filtered & Sorted Fields
  const filteredFields = useMemo(() => {
    let result = fields.filter((field) => {
      const matchesSearch =
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCrop =
        selectedCropFilter === 'All' || field.cropType.toLowerCase() === selectedCropFilter.toLowerCase();

      const matchesStatus =
        selectedStatusFilter === 'All' || field.status.toLowerCase() === selectedStatusFilter.toLowerCase();

      return matchesSearch && matchesCrop && matchesStatus;
    });

    if (sortBy === 'size-desc') {
      result = [...result].sort((a, b) => b.sizeAcres - a.sizeAcres);
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [fields, searchQuery, selectedCropFilter, selectedStatusFilter, sortBy]);

  const totalPages = Math.ceil(filteredFields.length / itemsPerPage) || 1;
  const paginatedFields = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFields.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFields, currentPage]);

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const polygonColor =
      newStatus === 'Good' ? '#22c55e' : newStatus === 'Moderate' ? '#eab308' : '#ef4444';

    const newPlot: FieldPlot = {
      id: `field-${Date.now()}`,
      name: newFieldName.trim(),
      cropType: newCropType,
      sizeAcres: Number(newSizeAcres) || 20,
      status: newStatus,
      updatedDate: 'May 19, 2024',
      imageUrl: AERIAL_TEXTURES[Math.floor(Math.random() * AERIAL_TEXTURES.length)],
      polygonPoints: '20,15 80,15 85,75 50,85 15,65',
      polygonColor,
      ndviScore: newStatus === 'Good' ? 0.82 : newStatus === 'Moderate' ? 0.62 : 0.45,
      soilMoisture: newStatus === 'Good' ? 29 : newStatus === 'Moderate' ? 23 : 18,
      nitrogenLevel: newStatus === 'Good' ? 32 : newStatus === 'Moderate' ? 24 : 19,
    };

    setFields((prev) => [newPlot, ...prev]);
    setIsAddModalOpen(false);
    setNewFieldName('');
    setNewSizeAcres(20);
    setCurrentPage(1);
  };

  // Small Crop Icon Renderer
  const renderCropIcon = (cropType: string) => {
    switch (cropType.toLowerCase()) {
      case 'wheat':
        return <span className="text-amber-600 text-sm">🌾</span>;
      case 'sugarcane':
        return <span className="text-emerald-600 text-sm">🎋</span>;
      case 'maize':
      case 'corn':
        return <span className="text-amber-500 text-sm">🌽</span>;
      case 'soybean':
        return <span className="text-lime-600 text-sm">🫘</span>;
      case 'rice':
        return <span className="text-emerald-700 text-sm">🌾</span>;
      case 'cotton':
        return <span className="text-slate-400 text-sm">🌿</span>;
      default:
        return <Wheat className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  // Status Badge Renderer matching exact screenshot
  const renderStatusBadge = (status: FieldStatus) => {
    switch (status) {
      case 'Good':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 fill-[#15803d] text-white" />
            <span>Good</span>
          </div>
        );
      case 'Moderate':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fef9c3] text-[#a16207] text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 fill-[#a16207] text-white" />
            <span>Moderate</span>
          </div>
        );
      case 'Poor':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5 fill-[#b91c1c] text-white" />
            <span>Poor</span>
          </div>
        );
    }
  };

  const activeFilterCount =
    (selectedCropFilter !== 'All' ? 1 : 0) +
    (selectedStatusFilter !== 'All' ? 1 : 0) +
    (sortBy !== 'default' ? 1 : 0);

  return (
    <div className="w-full space-y-5">
      {/* ======================================================== */}
      {/* TOP HEADER ROW: "Fields" on Left, Controls on Right      */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fields
          </h1>
        </div>

        {/* Right Controls: Farm Selector, Date Range, Notifications, Help */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Farm Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs text-xs font-medium text-slate-700 transition-colors"
            >
              <span className="text-slate-500">Farm:</span>
              <span className="font-semibold text-slate-900">{selectedFarm}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {farmDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setFarmDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {['Green Valley Farm', 'Sunrise Agri Plot', 'Highland Terraces'].map((f) => (
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

          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs text-xs font-medium text-slate-700 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedDateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDateDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {['May 12 – May 19, 2024', 'May 01 – May 19, 2024', 'Last 30 Days', 'Season 2024'].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDateRange(d);
                        setDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                        selectedDateRange === d ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{d}</span>
                      {selectedDateRange === d && <Check className="w-3.5 h-3.5 text-emerald-600" />}
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
                setNotificationOpen(!notificationOpen);
                setNotificationsRead(true);
              }}
              title="Field Notifications"
              className="relative w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs transition-colors"
            >
              <Bell className="w-4 h-4" />
              {!notificationsRead && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  3
                </span>
              )}
            </button>

            {notificationOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setNotificationOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 text-xs space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Field Telemetry Alerts
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
                    <div className="font-semibold">East Sugarcane Block</div>
                    <div className="text-[11px] text-amber-700 mt-0.5">Soil moisture down to 24%. Irrigation recommended.</div>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
                    <div className="font-semibold">Central Maize Field</div>
                    <div className="text-[11px] text-rose-700 mt-0.5">NDVI vegetative drop detected (0.44 score).</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <div className="font-semibold">North Wheat Plot</div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">Optimal growth index (0.82 NDVI).</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            title="Fields Documentation"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SEARCH & FILTERS BAR: Search, Filter Dropdown, + Add Button */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Left: Search input + Filter Dropdown */}
        <div className="flex items-center gap-2.5 flex-1 max-w-lg">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search fields..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className={`flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 border rounded-xl shadow-2xs text-xs font-semibold transition-all ${
                activeFilterCount > 0
                  ? 'border-emerald-500 text-emerald-800 bg-emerald-50/40'
                  : 'border-slate-200 text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {filterDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setFilterDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-40 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">Filter Fields</span>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedCropFilter('All');
                          setSelectedStatusFilter('All');
                          setSortBy('default');
                        }}
                        className="text-[11px] text-emerald-700 hover:underline font-medium"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Crop Type Filter */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Crop Type
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {['All', 'Wheat', 'Sugarcane', 'Maize', 'Soybean', 'Rice'].map((crop) => (
                        <button
                          key={crop}
                          onClick={() => {
                            setSelectedCropFilter(crop);
                            setCurrentPage(1);
                          }}
                          className={`px-2 py-1.5 rounded-lg text-center transition-colors text-[11px] ${
                            selectedCropFilter === crop
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {crop}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Health Status
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {['All', 'Good', 'Moderate', 'Poor'].map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setSelectedStatusFilter(st);
                            setCurrentPage(1);
                          }}
                          className={`px-1.5 py-1.5 rounded-lg text-center transition-colors text-[11px] ${
                            selectedStatusFilter === st
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort by */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="default">Default Order</option>
                      <option value="size-desc">Largest Size First</option>
                      <option value="name-asc">Field Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Green "+ Add New Field" Button */}
        <div>
          <button
            id="add-new-field-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1b5028] hover:bg-[#154322] active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-xs transition-all focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Field</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RESPONSIVE GRID OF FIELD CARDS (3 PER ROW ON DESKTOP)     */}
      {/* ======================================================== */}
      {filteredFields.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No matching fields found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or clear the active filters to see all available plots.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCropFilter('All');
              setSelectedStatusFilter('All');
            }}
            className="px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedFields.map((field) => (
            <div
              key={field.id}
              onClick={() => setSelectedPlot(field)}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Top Row: Left Image with Polygon + Right Details */}
              <div className="flex items-start gap-4">
                {/* Aerial/Satellite Thumbnail with Colored Polygon Boundary Overlay */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-900 shadow-inner">
                  <img
                    src={field.imageUrl}
                    alt={`${field.name} satellite thumbnail`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle darkening for satellite contrast */}
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                  {/* SVG Polygon Overlay showing Field Boundary Outline */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    <polygon
                      points={field.polygonPoints}
                      fill={field.polygonColor}
                      fillOpacity="0.18"
                      stroke={field.polygonColor}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Pulsing point on first coordinate */}
                    <circle
                      cx={field.polygonPoints.split(' ')[0].split(',')[0]}
                      cy={field.polygonPoints.split(' ')[0].split(',')[1]}
                      r="2"
                      fill={field.polygonColor}
                    />
                  </svg>
                </div>

                {/* Right Details: Field Name, Crop Type, Size, Status Badge */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-28 sm:h-32 py-0.5">
                  {/* Field Name */}
                  <h3 className="text-sm font-bold text-slate-900 truncate leading-tight group-hover:text-emerald-800 transition-colors">
                    {field.name}
                  </h3>

                  {/* Crop Type */}
                  <div className="mt-1">
                    <div className="text-[11px] text-slate-400 font-medium leading-none">
                      Crop Type
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-slate-800">
                      {renderCropIcon(field.cropType)}
                      <span>{field.cropType}</span>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mt-1">
                    <div className="text-[11px] text-slate-400 font-medium leading-none">
                      Size
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">
                      {field.sizeAcres} Acres
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-1.5 self-start">
                    {renderStatusBadge(field.status)}
                  </div>
                </div>
              </div>

              {/* Bottom Timestamp */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Updated: {field.updatedDate}</span>
                <span className="text-[11px] text-emerald-700 font-medium group-hover:translate-x-0.5 transition-transform">
                  Inspect →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* PAGINATION / SCROLL CONTROLS                             */}
      {/* ======================================================== */}
      {filteredFields.length > 0 && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing{' '}
            <strong className="text-slate-800">
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredFields.length)}
            </strong>{' '}
            of <strong className="text-slate-800">{filteredFields.length}</strong> fields
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 font-semibold transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 font-semibold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD NEW FIELD MODAL                                      */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Agricultural Field</h3>
                  <p className="text-[11px] text-slate-500">Define plot boundaries and crop variety</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddField} className="p-5 space-y-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Field Name *</label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. South Terrace Wheat Block"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Crop Type</label>
                  <select
                    value={newCropType}
                    onChange={(e) => setNewCropType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Wheat">🌾 Wheat</option>
                    <option value="Sugarcane">🎋 Sugarcane</option>
                    <option value="Maize">🌽 Maize</option>
                    <option value="Soybean">🫘 Soybean</option>
                    <option value="Rice">🌾 Rice</option>
                    <option value="Cotton">🌿 Cotton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Size (Acres)</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={newSizeAcres}
                    onChange={(e) => setNewSizeAcres(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Health Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Good', 'Moderate', 'Poor'] as FieldStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                        newStatus === st
                          ? st === 'Good'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : st === 'Moderate'
                            ? 'bg-amber-50 border-amber-500 text-amber-800'
                            : 'bg-rose-50 border-rose-500 text-rose-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900 text-[11px] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Once created, Sentinel-2 multispectral sensors will automatically index NDVI vegetation scores and soil moisture for this plot.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1b5028] hover:bg-[#154322] text-white rounded-xl font-bold shadow-xs transition-all"
                >
                  Save Field Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FIELD INSPECTION DETAIL MODAL                            */}
      {/* ======================================================== */}
      {selectedPlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1b5028] text-white flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedPlot.name}</h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedPlot.cropType} • {selectedPlot.sizeAcres} Acres • Last Sync: {selectedPlot.updatedDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlot(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Aerial Preview with Boundary */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                <img
                  src={selectedPlot.imageUrl}
                  alt={selectedPlot.name}
                  className="w-full h-full object-cover"
                />
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <polygon
                    points={selectedPlot.polygonPoints}
                    fill={selectedPlot.polygonColor}
                    fillOpacity="0.25"
                    stroke={selectedPlot.polygonColor}
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute top-3 right-3">
                  {renderStatusBadge(selectedPlot.status)}
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">NDVI Index</div>
                  <div className="text-lg font-bold text-emerald-700 mt-0.5">
                    {selectedPlot.ndviScore || 0.78}
                  </div>
                  <div className="text-[10px] text-slate-500">Vegetation</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Soil Moisture</div>
                  <div className="text-lg font-bold text-blue-600 mt-0.5">
                    {selectedPlot.soilMoisture || 28}%
                  </div>
                  <div className="text-[10px] text-slate-500">Hydration</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Nitrogen</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedPlot.nitrogenLevel || 32} <span className="text-[10px] font-normal text-slate-400">kg/ha</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Macronutrient</div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Agronomic Advisory</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {selectedPlot.status === 'Good'
                    ? 'Canopy vigor is optimal. Maintain current irrigation cycle and monitor for early aphids in border rows.'
                    : selectedPlot.status === 'Moderate'
                    ? 'Sub-surface soil moisture is dropping below threshold. Apply 20mm drip irrigation within 48 hours.'
                    : 'Significant chlorophyll stress detected in north quadrant. Inspect for leaf rust or nitrogen deficiency immediately.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPlot(null)}
                className="px-5 py-2 bg-[#1b5028] text-white font-bold rounded-xl hover:bg-[#154322] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
