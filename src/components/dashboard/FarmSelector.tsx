import React, { useState } from 'react';
import { Farm } from '../../types/farm';
import { MapPin, ChevronDown, Plus, Check } from 'lucide-react';

interface FarmSelectorProps {
  farms: Farm[];
  activeFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  onOpenAddModal: () => void;
}

export const FarmSelector: React.FC<FarmSelectorProps> = ({
  farms,
  activeFarm,
  onSelectFarm,
  onOpenAddModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        id="farm-selector-dropdown-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs text-xs font-bold text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="truncate max-w-[160px] sm:max-w-[200px]">
          {activeFarm ? activeFarm.farmName : 'Select Farm Field'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Your Monitored Fields ({farms.length})
            </div>

            <div className="max-h-60 overflow-y-auto py-1">
              {farms.map((farm) => {
                const isSelected = activeFarm?.id === farm.id;
                return (
                  <button
                    key={farm.id}
                    onClick={() => {
                      onSelectFarm(farm);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50/60 transition-colors ${
                      isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 leading-tight">{farm.farmName}</div>
                      <div className="text-[10px] text-slate-500">{farm.location} • {farm.farmSize}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-1.5 mt-1 border-t border-slate-100 px-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAddModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Field</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
