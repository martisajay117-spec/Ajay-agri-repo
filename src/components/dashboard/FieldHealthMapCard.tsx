import React, { useState } from 'react';
import { Farm } from '../../types/farm';
import { Info, Plus, Minus, Maximize2, ExternalLink, X, Satellite, Layers, MapPin, Eye } from 'lucide-react';

interface FieldHealthMapCardProps {
  farm: Farm;
}

export const FieldHealthMapCard: React.FC<FieldHealthMapCardProps> = ({ farm }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullMapModalOpen, setIsFullMapModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'rgb' | 'moisture'>('ndvi');

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));

  return (
    <>
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between relative h-full min-h-[360px]">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Sentinel-2 NDVI Canopy</h3>
              <button
                onClick={() => setShowInfo(!showInfo)}
                title="Spectral band methodology"
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e5128]" />
              <span>10m BOA L2A</span>
            </div>
          </div>

          {showInfo && (
            <div className="absolute top-12 left-4 right-4 z-20 bg-slate-900 text-white p-3 rounded-lg text-xs space-y-1 shadow-lg border border-slate-700">
              <div className="flex justify-between items-center font-semibold text-slate-200">
                <span>NDVI Spectral Methodology</span>
                <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300">
                Formula: (B08 - B04) / (B08 + B04). Computed from European Space Agency Sentinel-2 Bottom-Of-Atmosphere reflectance. Tile: T43RFS. Cloud: 1.2%.
              </p>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="relative flex-1 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center min-h-[240px]">
          {/* Satellite Imagery with Realistic NDVI Choropleth */}
          <div
            className="absolute inset-0 transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Base Satellite Texture */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80')`,
                filter: activeLayer === 'rgb' ? 'contrast(1.05)' : 'brightness(0.55) contrast(1.2)'
              }}
            />

            {/* Crisp Field Boundary Polygon with Agtech NDVI ramp */}
            {activeLayer !== 'rgb' && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 500 350"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Agtech Grounded NDVI Ramp (No neon gradients) */}
                  <linearGradient id="ndviAgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e5128" stopOpacity="0.88" />
                    <stop offset="35%" stopColor="#3b7a37" stopOpacity="0.88" />
                    <stop offset="65%" stopColor="#85992c" stopOpacity="0.88" />
                    <stop offset="82%" stopColor="#d97706" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Main Agricultural Field Polygon Boundary */}
                <polygon
                  points="110,60 380,45 440,190 390,300 210,315 130,220 90,140"
                  fill="url(#ndviAgGradient)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  opacity="0.9"
                />

                {/* High vigor biomass sector */}
                <polygon
                  points="160,80 340,70 380,150 290,170 170,140"
                  fill="#1e5128"
                  opacity="0.8"
                />

                {/* Zone 3 water-stressed sector (Alerted zone) */}
                <polygon
                  points="280,180 380,190 350,270 260,260"
                  fill="#c2410c"
                  opacity="0.85"
                />

                {/* Sensor probe location pin */}
                <circle cx="230" cy="140" r="4" fill="#ffffff" stroke="#1e5128" strokeWidth="2" />
                <text x="238" y="144" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">SN-704-B</text>

                {/* Target Zone 3 pin */}
                <circle cx="315" cy="225" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                <text x="323" y="229" fill="#fef3c7" fontSize="9" fontFamily="monospace" fontWeight="bold">Zone 3 (Deficit)</text>
              </svg>
            )}
          </div>

          {/* Map Layer Switcher (Top-Left) */}
          <div className="absolute top-2 left-2 flex items-center bg-slate-900/90 rounded border border-slate-700 p-0.5 z-10 text-[10px] font-mono">
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-1.5 py-0.5 rounded ${activeLayer === 'ndvi' ? 'bg-[#1e5128] text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              NDVI
            </button>
            <button
              onClick={() => setActiveLayer('rgb')}
              className={`px-1.5 py-0.5 rounded ${activeLayer === 'rgb' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              TrueColor
            </button>
          </div>

          {/* Map Zoom & Expand Controls (Top-Right) */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="w-6 h-6 rounded bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="w-6 h-6 rounded bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullMapModalOpen(true)}
              title="Expand Full Screen"
              className="w-6 h-6 rounded bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Flat Enterprise Agtech Legend (Bottom-Left) */}
          <div className="absolute bottom-2 left-2 bg-slate-950/90 p-1.5 rounded border border-slate-800 text-[9px] font-mono text-slate-300 flex items-center gap-2 z-10">
            <span className="text-slate-400">NDVI:</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2 rounded-xs bg-[#1e5128]" />
              <span>&gt;0.75</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2 rounded-xs bg-[#85992c]" />
              <span>0.55</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2 rounded-xs bg-[#d97706]" />
              <span>0.35</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2 rounded-xs bg-[#b91c1c]" />
              <span>&lt;0.20</span>
            </div>
          </div>

          {/* Quick Details Trigger */}
          <button
            onClick={() => setIsFullMapModalOpen(true)}
            className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/90 hover:bg-slate-800 text-white rounded text-[10px] font-mono flex items-center gap-1 border border-slate-700 transition-colors z-10"
          >
            <span>Inspect 10m Tiles</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Card Footer Telemetry */}
        <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span>Mean NDVI: <strong className="text-slate-800">0.82</strong></span>
          <span>Coverage: <strong className="text-slate-800">25.0 ac (100%)</strong></span>
          <span className="text-[#1e5128] font-semibold">Healthy Canopy</span>
        </div>
      </div>

      {/* Full Map Modal */}
      {isFullMapModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-slate-700" />
                  Multispectral Satellite Analysis: {farm.farmName}
                </h3>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Location: {farm.location} • Area: {farm.farmSize} • Pass: Sentinel-2A L2A BOA
                </p>
              </div>
              <button
                onClick={() => setIsFullMapModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[420px] bg-slate-950">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80')`,
                  filter: 'brightness(0.6) contrast(1.15)'
                }}
              />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                <polygon
                  points="160,80 620,70 710,320 630,460 320,470 190,360 140,210"
                  fill="url(#ndviModalGradient)"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  opacity="0.88"
                />
                <defs>
                  <linearGradient id="ndviModalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e5128" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#3b7a37" stopOpacity="0.85" />
                    <stop offset="65%" stopColor="#85992c" stopOpacity="0.88" />
                    <stop offset="85%" stopColor="#d97706" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.92" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute top-4 left-4 bg-slate-900/90 text-white p-3 rounded-lg text-xs space-y-1 backdrop-blur-xs border border-slate-700 font-mono">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1e5128]" /> Field Stratification Specs
                </div>
                <div className="text-[11px] text-slate-300 space-y-0.5 pt-1">
                  <div>Vegetation Index: <strong className="text-white">0.82 (Dense Canopy)</strong></div>
                  <div>Zonal Deficit: <strong className="text-amber-400">Zone 3 Dry Spot (-14% VWC)</strong></div>
                  <div>Yield Forecast: <strong className="text-white">{farm.predictedYield}</strong></div>
                  <div>GSD Resolution: <strong className="text-white">10m / Pixel</strong></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">ESA Copernicus Sentinel-2 MSI • Cloud Cover 1.2%</span>
              <button
                onClick={() => setIsFullMapModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
