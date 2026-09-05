import React, { useState } from 'react';
import { X, Sprout, MapPin, Loader2 } from 'lucide-react';
import { Farm } from '../../types/farm';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFarm: (farmData: Partial<Farm>) => Promise<void>;
  farmerCountry?: string;
}

export const AddFarmModal: React.FC<AddFarmModalProps> = ({
  isOpen,
  onClose,
  onAddFarm,
  farmerCountry = 'India',
}) => {
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('10 Hectares (Medium Farm)');
  const [cropType, setCropType] = useState('Soybeans & Maize');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;

    setSubmitting(true);
    try {
      await onAddFarm({
        farmName: farmName.trim(),
        location: location.trim() || `${farmerCountry} Agrarian Sector`,
        farmSize,
        cropType,
        fieldHealthIndex: Math.floor(Math.random() * 15) + 75,
        soilMoisture: Math.floor(Math.random() * 10) + 24,
        organicMatter: Number((Math.random() * 1.5 + 2.0).toFixed(2)),
        nitrogenLevel: Math.floor(Math.random() * 15) + 25,
        soilPh: Number((Math.random() * 0.8 + 6.4).toFixed(1)),
        phosphorus: Math.floor(Math.random() * 10) + 20,
        potassium: Math.floor(Math.random() * 40) + 160,
        predictedYield: '4.8 T/ha',
      });
      setFarmName('');
      setLocation('');
      onClose();
    } catch (err) {
      console.error('Failed to add farm field:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Agricultural Field</h3>
              <p className="text-xs text-slate-500">Connect a plot to Sentinel-2 satellite telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Field / Plot Name <span className="text-emerald-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. North Basin Soybeans"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Region / Location Coordinates
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Ludhiana, Punjab or Cuiabá, Mato Grosso"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plot Area / Size</label>
              <select
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="5 Hectares (Small Plot)">5 Hectares (Small)</option>
                <option value="15 Hectares (Medium Farm)">15 Hectares (Medium)</option>
                <option value="50 Hectares (Large Farm)">50 Hectares (Large)</option>
                <option value="120+ Hectares (Agro-Estate)">120+ Hectares (Estate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Crop</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Soybeans & Maize">Soybeans & Maize</option>
                <option value="Winter Wheat & Mustard">Wheat & Mustard</option>
                <option value="Rice & Pulses">Rice & Pulses</option>
                <option value="Cotton & Millet">Cotton & Millet</option>
                <option value="Coffee & Cocoa">Coffee & Cocoa</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !farmName.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting Field...</span>
                </>
              ) : (
                <span>Initialize Field</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
