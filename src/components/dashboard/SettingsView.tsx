import React, { useState } from 'react';
import {
  MapPin,
  Bell,
  Globe,
  Cpu,
  Save,
  Camera,
  Check,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  ChevronDown,
  X,
  Edit2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Radio,
  Wifi,
  Battery,
  Shield,
  Upload,
} from 'lucide-react';

// ============================================================================
// DATA TYPES & SEED DATA
// ============================================================================
export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'soil' | 'weather' | 'npk' | 'drone' | 'gateway' | 'valve';
  zone: string;
  status: 'online' | 'connecting' | 'offline';
  battery: number;
  lastSync: string;
  protocol: string;
}

export const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-1',
    name: 'Sensor 1: Soil Moisture (Zone A)',
    type: 'soil',
    zone: 'Zone A - Upper Terraces',
    status: 'online',
    battery: 92,
    lastSync: '1 min ago',
    protocol: 'LoRaWAN 865 MHz',
  },
  {
    id: 'dev-2',
    name: 'Weather Station: Green Valley',
    type: 'weather',
    zone: 'Central Homestead',
    status: 'online',
    battery: 100,
    lastSync: 'Just now',
    protocol: '4G LTE Cellular',
  },
  {
    id: 'dev-3',
    name: 'Sensor 2: NPK Levels (Zone B)',
    type: 'npk',
    zone: 'Zone B - Canal Basin',
    status: 'connecting',
    battery: 68,
    lastSync: 'Connecting...',
    protocol: 'Zigbee Mesh',
  },
  {
    id: 'dev-4',
    name: 'LoRaWAN Gateway (Riverside)',
    type: 'gateway',
    zone: 'River Boundary',
    status: 'offline',
    battery: 14,
    lastSync: '4 hours ago',
    protocol: 'Solar / Ethernet',
  },
];

export const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', native: 'English', region: 'Global' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', region: 'India (National)' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', region: 'Andhra / Telangana' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা', region: 'West Bengal' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab' },
  { code: 'pt-BR', name: 'Portuguese', native: 'Português', region: 'Brazil (BRICS)' },
  { code: 'ru-RU', name: 'Russian', native: 'Русский', region: 'Russia (BRICS)' },
  { code: 'zh-CN', name: 'Chinese', native: '中文', region: 'China' },
  { code: 'es-ES', name: 'Spanish', native: 'Español', region: 'Latin America' },
];

export const PRESET_AVATARS = [
  {
    id: 'ramesh-default',
    name: 'Ramesh Patel',
    subtitle: 'Madhya Pradesh, India',
    url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&h=400&crop=faces&q=80',
  },
  {
    id: 'vikram-punjab',
    name: 'Vikram Singh',
    subtitle: 'Punjab Terraces',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&crop=faces&q=80',
  },
  {
    id: 'anand-agronomist',
    name: 'Dr. Anand',
    subtitle: 'Senior Agronomist',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&crop=faces&q=80',
  },
  {
    id: 'priya-scientist',
    name: 'Priya Sharma',
    subtitle: 'Field Crop Specialist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&crop=faces&q=80',
  },
  {
    id: 'dev-field',
    name: 'Devraj Singh',
    subtitle: 'Organic Soil Lead',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&crop=faces&q=80',
  },
];

interface SettingsViewProps {
  onOpenHelp?: () => void;
}

type TabType = 'overview' | 'profile' | 'farm_details' | 'notifications' | 'language' | 'connected_devices';

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenHelp }) => {
  // Navigation Sub-tab state
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Profile State
  const [profilePhoto, setProfilePhoto] = useState<string>(
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&h=400&crop=faces&q=80'
  );
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState('Ramesh Verma');
  const [email, setEmail] = useState('ramesh.verma@agrin.farm');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [farmerRole, setFarmerRole] = useState('Smallholder Farmer');

  // 2. Farm Details State
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [locationName, setLocationName] = useState('Madhya Pradesh, India');
  const [coordinates, setCoordinates] = useState({ lat: 23.2599, lng: 77.4126 });
  const [farmSize, setFarmSize] = useState('45 Hectares');
  const [primaryCrops, setPrimaryCrops] = useState(['Wheat', 'Sugarcane', 'Soybean']);
  const [irrigationType, setIrrigationType] = useState('Drip Irrigation & Canal Sluice');
  const [soilType, setSoilType] = useState('Black Cotton (Vertisol)');
  const [isPickingLocation, setIsPickingLocation] = useState(false);

  // 3. Notifications State
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyWeather, setNotifyWeather] = useState(true);
  const [notifyCropReports, setNotifyCropReports] = useState(true);
  const [notifyMarket, setNotifyMarket] = useState(true);
  const [notifyCommunity, setNotifyCommunity] = useState(true);

  // 4. Language State
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('en-US');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // 5. Connected Devices State
  const [devices, setDevices] = useState<ConnectedDevice[]>(INITIAL_DEVICES);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'soil' | 'weather' | 'npk' | 'valve'>('soil');
  const [newDeviceZone, setNewDeviceZone] = useState('Zone A - Upper Terraces');

  // GIS floating bar zoom
  const [zoomLevel, setZoomLevel] = useState(1);

  // Trigger Save Notification
  const handleSaveChanges = () => {
    setToastMessage('Settings successfully saved to your cloud profile!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add New Device Handler
  const handleAddNewDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    const newDev: ConnectedDevice = {
      id: `dev-${Date.now()}`,
      name: newDeviceName.trim(),
      type: newDeviceType,
      zone: newDeviceZone,
      status: 'online',
      battery: 100,
      lastSync: 'Just now',
      protocol: 'LoRaWAN 865 MHz',
    };

    setDevices((prev) => [...prev, newDev]);
    setNewDeviceName('');
    setIsAddDeviceModalOpen(false);
    setToastMessage(`New device "${newDev.name}" paired and online!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-emerald-200 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE WITH FLOATING GIS TOOLBAR               */}
      {/* ======================================================== */}
      <div className="relative">
        {/* Floating GIS Toolbar on far left matching screenshot */}
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
            title="Farm Boundary Centroid"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            title="Reset Extent"
            className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-slate-900 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-full h-px bg-slate-100" />
          <button
            onClick={() => {}}
            title="Telemetry Map Layers"
            className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: OVERVIEW GRID (MATCHING SCREENSHOT LAYOUT)       */}
        {/* ======================================================== */}
        {(activeTab === 'overview' || activeTab === 'profile') && (
          <div className="space-y-4">
            {/* Top Banner: Account Settings */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
              <h2 className="text-lg font-extrabold text-slate-900">Account Settings</h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Configure farmer identity, agricultural parcel telemetry and alert routing
              </p>
            </div>

            {/* 3-Column Grid Matching Screenshot Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* ---------------------------------------------------- */}
              {/* COLUMN 1 (md:col-span-4): PROFILE INFO CARD          */}
              {/* ---------------------------------------------------- */}
              <div className="md:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Profile Info</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                    Kisan ID #4829
                  </span>
                </div>

                {/* Profile Avatar with Edit Photo Green Button matching screenshot */}
                <div className="flex flex-col items-center justify-center py-2 space-y-2.5">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setIsAvatarModalOpen(true)}
                    title="Click to change profile picture"
                  >
                    <img
                      src={profilePhoto}
                      alt={`${fullName} - Agriculture Farmer Profile`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md ring-2 ring-emerald-600/30 group-hover:ring-4 group-hover:ring-emerald-600 group-hover:scale-105 transition-all duration-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 rounded-full bg-slate-950/45 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Change</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAvatarModalOpen(true);
                      }}
                      title="Change profile picture"
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#296839] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#1d4d29] transition-colors z-10"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                      id="photo-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setProfilePhoto(reader.result);
                              setToastMessage('Profile photo updated!');
                              setTimeout(() => setToastMessage(null), 3000);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  {/* Green "Edit Photo" Pill Button matching screenshot */}
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="px-4 py-1.5 bg-[#296839] hover:bg-[#1d4d29] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                </div>

                {/* Editable Profile Fields */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Click to change."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Click to change."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Click to change."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Role Designation
                    </label>
                    <input
                      type="text"
                      value={farmerRole}
                      onChange={(e) => setFarmerRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <button
                  onClick={handleSaveChanges}
                  className="w-full py-2 bg-[#296839] hover:bg-[#1d4d29] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              {/* ---------------------------------------------------- */}
              {/* COLUMN 2 (md:col-span-4): FARM DETAILS + LANGUAGE   */}
              {/* ---------------------------------------------------- */}
              <div className="md:col-span-4 space-y-4">
                {/* CARD A: FARM DETAILS (MATCHING SCREENSHOT) */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">Farm Details</h3>
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>

                  {/* Farm Name with Edit Icon */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Farm Name</span>
                      <Edit2 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                    />
                  </div>

                  {/* Location with Edit Icon */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Location</span>
                      <Edit2 className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                      />
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Size with Edit Icon */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>Size</span>
                      <Edit2 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                    />
                  </div>

                  {/* Primary Crops */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Primary Crop Types
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {primaryCrops.map((crop) => (
                        <span
                          key={crop}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 flex items-center gap-1"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Save Farm Button */}
                  <button
                    onClick={handleSaveChanges}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Update Farm Coordinates</span>
                  </button>
                </div>

                {/* CARD B: LANGUAGE SELECTION (MATCHING SCREENSHOT) */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">Language Selection</h3>
                    <Globe className="w-4 h-4 text-emerald-600" />
                  </div>

                  {/* Language Selector Dropdown matching screenshot */}
                  <div className="relative">
                    <button
                      onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                      className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <span>
                        {LANGUAGES.find((l) => l.code === selectedLanguageCode)?.name ||
                          'English (US)'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Open List of languages matching screenshot with scrollbar */}
                    {languageDropdownOpen && (
                      <div className="mt-1.5 max-h-48 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-30 divide-y divide-slate-100 text-xs">
                        {LANGUAGES.map((lang) => {
                          const isSelected = selectedLanguageCode === lang.code;
                          return (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLanguageCode(lang.code);
                                setLanguageDropdownOpen(false);
                                setToastMessage(`Language changed to ${lang.name}`);
                                setTimeout(() => setToastMessage(null), 3000);
                              }}
                              className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                                isSelected
                                  ? 'bg-emerald-50/70 font-bold text-emerald-800'
                                  : 'text-slate-700 font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{lang.name}</span>
                                <span className="text-[10px] text-slate-400">
                                  ({lang.native})
                                </span>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* COLUMN 3 (md:col-span-4): NOTIFICATIONS + DEVICES    */}
              {/* ---------------------------------------------------- */}
              <div className="md:col-span-4 space-y-4">
                {/* CARD A: NOTIFICATION PREFERENCES (MATCHING SCREENSHOT) */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Notification Preferences
                    </h3>
                    <Bell className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Receive via:</div>

                  {/* Toggle list matching screenshot */}
                  <div className="space-y-2.5">
                    {/* Critical Alerts */}
                    <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Critical Alerts</div>
                        <div className="text-[10px] text-slate-400">Receive via Critical Alerts</div>
                      </div>
                      <button
                        onClick={() => setNotifyCritical(!notifyCritical)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                          notifyCritical ? 'bg-[#296839]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                            notifyCritical ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Weather Updates */}
                    <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Weather Updates</div>
                        <div className="text-[10px] text-slate-400">Receive via Weather Updates</div>
                      </div>
                      <button
                        onClick={() => setNotifyWeather(!notifyWeather)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                          notifyWeather ? 'bg-[#296839]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                            notifyWeather ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Crop Reports */}
                    <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Crop Reports</div>
                        <div className="text-[10px] text-slate-400">Receive via Crop Reports</div>
                      </div>
                      <button
                        onClick={() => setNotifyCropReports(!notifyCropReports)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                          notifyCropReports ? 'bg-[#296839]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                            notifyCropReports ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Market Alerts */}
                    <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Market Alerts</div>
                        <div className="text-[10px] text-slate-400">Receive via Market Alerts</div>
                      </div>
                      <button
                        onClick={() => setNotifyMarket(!notifyMarket)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                          notifyMarket ? 'bg-[#296839]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                            notifyMarket ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Community Mentions */}
                    <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Community Mentions</div>
                        <div className="text-[10px] text-slate-400">Receive via Community</div>
                      </div>
                      <button
                        onClick={() => setNotifyCommunity(!notifyCommunity)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                          notifyCommunity ? 'bg-[#296839]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                            notifyCommunity ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARD B: CONNECTED DEVICES / SENSORS (MATCHING SCREENSHOT) */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Connected Devices / Sensors
                    </h3>
                    <Cpu className="w-4 h-4 text-emerald-600" />
                  </div>

                  {/* Device list matching screenshot */}
                  <div className="space-y-2">
                    {devices.slice(0, 3).map((dev) => {
                      const isConnected = dev.status === 'online';
                      const isConnecting = dev.status === 'connecting';

                      return (
                        <div
                          key={dev.id}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between gap-2 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                              <Radio className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold text-slate-900 truncate">
                                {dev.name}
                              </div>
                              <div className="text-[10px] flex items-center gap-1 font-medium">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isConnected
                                      ? 'bg-emerald-500'
                                      : isConnecting
                                      ? 'bg-amber-500 animate-pulse'
                                      : 'bg-rose-500'
                                  }`}
                                />
                                <span
                                  className={
                                    isConnected
                                      ? 'text-emerald-700'
                                      : isConnecting
                                      ? 'text-amber-700'
                                      : 'text-rose-700'
                                  }
                                >
                                  {isConnected
                                    ? '- Connected'
                                    : isConnecting
                                    ? '- Connecting...'
                                    : '- Offline'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Device Button */}
                  <button
                    onClick={() => setIsAddDeviceModalOpen(true)}
                    className="w-full py-2 bg-[#296839] hover:bg-[#1d4d29] text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Device</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: DEDICATED FARM DETAILS TAB                       */}
        {/* ======================================================== */}
        {activeTab === 'farm_details' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Farm Acreage & Geo-Location</h2>
                <p className="text-xs text-slate-500 font-normal">
                  Define your agricultural boundary, topography, and soil classification
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                Active Farm Plot
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Farm Name
                  </label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Registered Location
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Total Farm Size
                    </label>
                    <input
                      type="text"
                      value={farmSize}
                      onChange={(e) => setFarmSize(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Soil Classification
                    </label>
                    <input
                      type="text"
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Primary Crop Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={primaryCrops.join(', ')}
                    onChange={(e) =>
                      setPrimaryCrops(
                        e.target.value
                          .split(',')
                          .map((c) => c.trim())
                          .filter(Boolean)
                      )
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Primary Irrigation Infrastructure
                  </label>
                  <input
                    type="text"
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {/* Map Pin Selector Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>GPS Parcel Centroid ({coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E)</span>
                  <span className="text-emerald-700 text-[11px]">Click map to move pin</span>
                </div>
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    setCoordinates({
                      lat: +(23.2 + y * 0.1).toFixed(4),
                      lng: +(77.35 + x * 0.1).toFixed(4),
                    });
                    setToastMessage('Updated GPS map pin location!');
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-emerald-50 cursor-crosshair shadow-inner"
                >
                  <svg className="w-full h-full" viewBox="0 0 400 250">
                    <rect width="400" height="250" fill="#d8edd9" />
                    {/* Topographic parcel polygons */}
                    <polygon points="40,30 180,20 220,90 80,120" fill="#a7d7b0" stroke="#7ab685" strokeWidth="2" />
                    <polygon points="190,25 360,40 330,130 230,95" fill="#88c894" stroke="#68a975" strokeWidth="2" />
                    <polygon points="90,130 240,105 280,220 120,230" fill="#69b876" stroke="#4a8f57" strokeWidth="2" />
                    <polygon points="250,110 380,140 350,235 290,225" fill="#52a760" stroke="#367e43" strokeWidth="2" />

                    {/* Irrigation canal */}
                    <path d="M 0 80 Q 200 130 400 90" fill="none" stroke="#60a5fa" strokeWidth="6" opacity="0.8" />
                  </svg>

                  {/* Interactive Map Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none animate-bounce">
                    <div className="bg-[#296839] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap mb-1">
                      {farmName} Pin
                    </div>
                    <MapPin className="w-8 h-8 text-rose-600 fill-rose-500 filter drop-shadow-md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2.5 bg-[#296839] hover:bg-[#1d4d29] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Farm Details</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: DEDICATED NOTIFICATIONS TAB                      */}
        {/* ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900">Notification Alerts & Channels</h2>
              <p className="text-xs text-slate-500 font-normal">
                Choose how and when AgriN delivers agronomic advisories, pest alerts, and marketplace updates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'weather',
                  title: 'Weather & Micro-Climate Alerts',
                  desc: 'Flash storm alerts, frost probability, hail warnings, and sudden humidity spikes',
                  checked: notifyWeather,
                  toggle: () => setNotifyWeather(!notifyWeather),
                },
                {
                  id: 'ai',
                  title: 'AI Agronomic Recommendations',
                  desc: 'Gemini crop model notifications, fertilizer schedules, and NDVI yield improvements',
                  checked: notifyCropReports,
                  toggle: () => setNotifyCropReports(!notifyCropReports),
                },
                {
                  id: 'pest',
                  title: 'Pest Outbreaks & Disease Warnings',
                  desc: 'Satellite multispectral disease detection and neighboring farm infection warnings',
                  checked: notifyCritical,
                  toggle: () => setNotifyCritical(!notifyCritical),
                },
                {
                  id: 'community',
                  title: 'Community Discussions & Co-op Updates',
                  desc: 'Direct replies to your questions, co-operative meetings, and sugarcane harvest dates',
                  checked: notifyCommunity,
                  toggle: () => setNotifyCommunity(!notifyCommunity),
                },
                {
                  id: 'market',
                  title: 'Mandi Price & Commodity Tickers',
                  desc: 'Real-time MSP threshold alerts, local grain mandi bids, and trader inquiries',
                  checked: notifyMarket,
                  toggle: () => setNotifyMarket(!notifyMarket),
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{item.title}</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <button
                    onClick={item.toggle}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                      item.checked ? 'bg-[#296839]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                        item.checked ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2.5 bg-[#296839] hover:bg-[#1d4d29] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Notification Rules</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: DEDICATED LANGUAGE TAB                           */}
        {/* ======================================================== */}
        {activeTab === 'language' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900">Regional & Vernacular Language</h2>
              <p className="text-xs text-slate-500 font-normal">
                Select your preferred interface language across voice advisory, SMS alerts, and dashboard
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguageCode === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguageCode(lang.code);
                      setToastMessage(`Language set to ${lang.name} (${lang.native})`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{lang.name}</div>
                      <div className="text-sm font-semibold text-emerald-800 mt-0.5">
                        {lang.native}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{lang.region}</div>
                    </div>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#296839] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: DEDICATED CONNECTED DEVICES TAB                  */}
        {/* ======================================================== */}
        {activeTab === 'connected_devices' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Telemetry Devices & Sensor Nodes ({devices.length})
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  Real-time edge nodes transmitting soil moisture, weather, and multispectral drone data
                </p>
              </div>
              <button
                onClick={() => setIsAddDeviceModalOpen(true)}
                className="px-4 py-2 bg-[#296839] hover:bg-[#1d4d29] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Device</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((dev) => {
                const isOnline = dev.status === 'online';
                const isConnecting = dev.status === 'connecting';

                return (
                  <div
                    key={dev.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <Radio className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{dev.name}</div>
                          <div className="text-[11px] text-slate-500">{dev.zone}</div>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          isOnline
                            ? 'bg-emerald-100 text-emerald-800'
                            : isConnecting
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOnline
                              ? 'bg-emerald-600'
                              : isConnecting
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        {isOnline ? 'Online' : isConnecting ? 'Connecting...' : 'Offline'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Battery</span>
                        <span className="font-bold text-slate-800">{dev.battery}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Protocol</span>
                        <span className="font-bold text-slate-800">{dev.protocol}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Last Sync</span>
                        <span className="font-bold text-slate-800">{dev.lastSync}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ADD NEW DEVICE MODAL                                     */}
      {/* ======================================================== */}
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Pair New Farm Sensor</span>
              </h3>
              <button
                onClick={() => setIsAddDeviceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewDevice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  required
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="e.g., Sensor 3: Deep Soil Moisture"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Device Type
                </label>
                <select
                  value={newDeviceType}
                  onChange={(e) =>
                    setNewDeviceType(e.target.value as 'soil' | 'weather' | 'npk' | 'valve')
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                >
                  <option value="soil">Soil Moisture & Temperature Probe</option>
                  <option value="weather">Micro-Weather Station (Anemometer + Rain)</option>
                  <option value="npk">NPK Soil Chemical Spectrometer</option>
                  <option value="valve">Automated Drip Solenoid Valve</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Farm Zone Assignment
                </label>
                <select
                  value={newDeviceZone}
                  onChange={(e) => setNewDeviceZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-semibold"
                >
                  <option value="Zone A - Upper Terraces">Zone A - Upper Terraces</option>
                  <option value="Zone B - Canal Basin">Zone B - Canal Basin</option>
                  <option value="River Boundary">River Boundary</option>
                  <option value="Central Homestead">Central Homestead</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Auto-discovers via LoRaWAN 865 MHz gateway within 5km radius.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeviceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#296839] hover:bg-[#1d4d29] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Pair Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. AVATAR / PROFILE PHOTO SELECTOR MODAL                  */}
      {/* ======================================================== */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAvatarModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 z-10 space-y-5 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Choose Profile Picture
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Select a verified agricultural profile portrait or upload your own
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Curated Farmer Avatars Grid */}
            <div>
              <div className="text-xs font-bold text-slate-800 mb-2.5">
                Authentic Farmer & Agronomist Portraits
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_AVATARS.map((avatar) => {
                  const isSelected = profilePhoto === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setProfilePhoto(avatar.url);
                        setIsAvatarModalOpen(false);
                        setToastMessage(`Profile picture updated to ${avatar.name}!`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#296839] bg-emerald-50/60 ring-2 ring-[#296839]/30 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {avatar.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {avatar.subtitle}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#296839] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Upload Section */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <label
                htmlFor="modal-photo-upload"
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Upload From Device</span>
              </label>
              <input
                id="modal-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        setProfilePhoto(reader.result);
                        setIsAvatarModalOpen(false);
                        setToastMessage('Profile photo uploaded successfully!');
                        setTimeout(() => setToastMessage(null), 3000);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2 bg-[#296839] hover:bg-[#1d4d29] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
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
