import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  MapPin,
  ChevronDown,
  HelpCircle,
  Check,
  CheckCircle2,
  AlertTriangle,
  Send,
  Droplets,
  Sprout,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  ThumbsUp,
  RefreshCw,
} from 'lucide-react';

interface AiAdvisoryViewProps {
  onOpenHelp?: () => void;
}

interface AdvisoryItem {
  id: string;
  category: 'Irrigation' | 'Nutrition' | 'Pest Management' | 'Harvest';
  title: string;
  urgency: 'High' | 'Medium' | 'Low';
  confidence: number;
  description: string;
  actionLabel: string;
  status: 'pending' | 'completed';
  date: string;
}

const INITIAL_ADVISORIES: AdvisoryItem[] = [
  {
    id: 'adv-1',
    category: 'Irrigation',
    title: 'Schedule 18mm Drip Irrigation in Zone 3',
    urgency: 'High',
    confidence: 96,
    description: 'Rootzone moisture at 24% is dipping below the 28% heading threshold. Evapotranspiration is forecasted to increase to 4.8mm/day on Tuesday.',
    actionLabel: 'Trigger Solenoid Valve #3',
    status: 'pending',
    date: '2 hours ago',
  },
  {
    id: 'adv-2',
    category: 'Nutrition',
    title: 'Foliar Potassium (KNO₃) Top-Dressing Ahead of Anthesis',
    urgency: 'Medium',
    confidence: 92,
    description: 'Chlorophyll reflectance shows slight nitrogen dilution under rapid biomass expansion. Apply 2% KNO₃ spray to boost grain filling.',
    actionLabel: 'Log Fertilizer Application',
    status: 'pending',
    date: 'Yesterday',
  },
  {
    id: 'adv-3',
    category: 'Pest Management',
    title: 'Aphid Vector Alert on Border Quadrants',
    urgency: 'Medium',
    confidence: 88,
    description: 'Microclimate humidity and warm diurnal winds create favorable conditions for aphid multiplication. Scout field perimeter rows.',
    actionLabel: 'Order Neem Biopesticide',
    status: 'pending',
    date: '2 days ago',
  },
  {
    id: 'adv-4',
    category: 'Harvest',
    title: 'Predicted Optimal Harvest Window: April 10 – 14',
    urgency: 'Low',
    confidence: 94,
    description: 'NDVI accumulation curves project grain maturity reaching 14% moisture content precisely on April 12.',
    actionLabel: 'Schedule Combine Harvester',
    status: 'completed',
    date: 'May 12',
  },
];

export const AiAdvisoryView: React.FC<AiAdvisoryViewProps> = ({ onOpenHelp }) => {
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Punjab, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>(INITIAL_ADVISORIES);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [userQuery, setUserQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [customReply, setCustomReply] = useState<string | null>(null);

  const filteredAdvisories = advisories.filter((a) => {
    if (activeCategory === 'All') return true;
    return a.category === activeCategory;
  });

  const handleToggleStatus = (id: string) => {
    setAdvisories((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'pending' ? 'completed' : 'pending' } : a))
    );
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setCustomReply(
        `Gemini Agronomic Analysis for "${userQuery}": Based on current NDVI (0.82) and 31.4% soil moisture, crop vigor is running +6.8% above historical average. Maintain current drip regime and perform foliar inspection in 48 hours.`
      );
    }, 800);
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. TOP HEADER ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>AI Agronomic Advisory</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Precision recommendations grounded in Sentinel-2 telemetry & localized crop science
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Farm Selector */}
          <div className="relative">
            <button
              onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs max-w-[260px] sm:max-w-none truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{selectedFarm}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
            {farmDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setFarmDropdownOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {['Green Valley Farm - Punjab, India', 'Highland Terraces - Punjab, India', 'Agro-BRICS Model Plot - Brazil'].map((f) => (
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
                      <span className="truncate">{f}</span>
                      {selectedFarm === f && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-800 rounded-xl border border-purple-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Gemini AI Active</span>
          </div>

          <button
            onClick={onOpenHelp}
            title="AI Advisory Documentation"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. ASK AI PROMPT BOX (Responsive) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-extrabold text-slate-900">Ask the AI Agronomist</h2>
        </div>

        <form onSubmit={handleAskAi} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g. When should I spray biopesticides for aphids on wheat?"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isThinking || !userQuery.trim()}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isThinking ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Consult AI</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Quick queries:</span>
          {[
            'Optimal spray window for rust',
            'NPK top-dressing rate',
            'Water requirements for heading stage',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setUserQuery(prompt)}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* AI Answer Box */}
        {customReply && (
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1.5 animate-fade-in">
            <div className="font-bold flex items-center gap-1.5 text-purple-900">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Agronomic Guidance</span>
            </div>
            <p className="leading-relaxed">{customReply}</p>
          </div>
        )}
      </div>

      {/* 3. CATEGORY FILTER TABS */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        {['All', 'Irrigation', 'Nutrition', 'Pest Management', 'Harvest'].map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'bg-[#296839] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. ADVISORY CARDS GRID (Responsive: 2 cols on desktop/tablet -> 1 col on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAdvisories.map((item) => {
          const isDone = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-2xs flex flex-col justify-between transition-all ${
                isDone ? 'border-slate-200 opacity-75 bg-slate-50/50' : 'border-slate-200/90 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                        item.urgency === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.urgency === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.urgency} Priority
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {item.confidence}% Confidence
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    className={`text-sm font-extrabold ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">{item.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Mark Pending' : item.actionLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
