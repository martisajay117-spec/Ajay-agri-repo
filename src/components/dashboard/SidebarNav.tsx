import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Grid,
  Satellite,
  Sprout,
  CloudSun,
  Wheat,
  Lightbulb,
  Droplets,
  FileText,
  ShoppingBag,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
  ArrowLeft,
  X,
  Send,
  Loader2,
  Star,
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAiAssistant?: () => void;
  onCloseMobileMenu?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAiAssistant,
  onCloseMobileMenu,
}) => {
  const { userProfile, currentUser, logout, setCurrentView } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: "Hello Ramesh! I'm your AgriN agronomic assistant. How can I help optimize your field health, soil nutrition, or irrigation schedules today?",
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fields', label: 'Fields', icon: Grid },
    { id: 'satellite', label: 'Satellite Insights', icon: Satellite },
    { id: 'soil', label: 'Soil Health', icon: Sprout },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'crop_health', label: 'Crop Health', icon: Wheat },
    { id: 'ai_advisory', label: 'AI Advisory', icon: Lightbulb },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery.trim();
    setAiChatLogs((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      let botReply = `Based on your field's current NDVI (0.78) and soil moisture (28%), `;
      if (userText.toLowerCase().includes('water') || userText.toLowerCase().includes('irrigat')) {
        botReply += `Zone 3 requires 18mm of drip hydration over the next 36 hours.`;
      } else if (userText.toLowerCase().includes('fertilizer') || userText.toLowerCase().includes('compost')) {
        botReply += `Nitrogen levels are currently optimal at 28 kg/ha. Apply organic compost in 5 days to sustain microbial balance.`;
      } else if (userText.toLowerCase().includes('disease') || userText.toLowerCase().includes('leaf') || userText.toLowerCase().includes('blight')) {
        botReply += `Your latest foliar scan flagged Early Blight with 87% confidence. Apply Copper Hydroxide (2.5g/L) during early morning.`;
      } else {
        botReply += `canopy biomass is progressing at +4.2% above historical averages. Recommended action is to monitor aphids and maintain balanced irrigation.`;
      }

      setAiChatLogs((prev) => [...prev, { sender: 'bot', text: botReply }]);
      setIsAiTyping(false);
    }, 900);
  };

  return (
    <>
      <aside className="w-64 bg-[#0d381a] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-lg select-none">
        {/* Top Logo & Branding */}
        <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-[#1b4d29]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white font-sans">
                AgriN
              </span>
              <span className="block text-[10px] text-emerald-300 font-medium">
                Fields Intelligence
              </span>
            </div>
          </div>

          {onCloseMobileMenu && (
            <button
              onClick={onCloseMobileMenu}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-[#154723] transition-colors md:hidden"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'bg-[#22c55e] text-[#0d381a] font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-[#154723] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0d381a]' : 'text-emerald-300'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: AI Assistant Box + User Profile */}
        <div className="p-3 border-t border-[#1b4d29] space-y-2">
          {/* AI Assistant Widget Box */}
          <div
            onClick={() => setAiAssistantOpen(true)}
            className="p-2.5 bg-[#144923] hover:bg-[#1c5d2e] rounded-xl border border-[#256c3a]/70 flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#22c55e] text-[#0d381a] flex items-center justify-center shrink-0">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">
                  AI Assistant
                </div>
                <div className="text-[10px] text-emerald-200">
                  Ask AgriN anything
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* User Profile Card */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#154723] transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-900 border border-emerald-600 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&h=150&crop=faces&q=80"
                    alt="Agriculture Farmer profile avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate leading-tight">
                    {userProfile?.fullName || 'Ramesh Verma'}
                  </div>
                  <div className="text-[10px] text-emerald-300 truncate">
                    Smallholder Farmer
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute bottom-14 left-0 w-full bg-[#0d381a] text-white rounded-2xl shadow-2xl border border-emerald-700/60 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] text-emerald-300 border-b border-[#1b4d29]">
                    Logged in as <strong>{currentUser?.email || userProfile?.emailOrPhone}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setCurrentView('home');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#154723] flex items-center gap-2 text-emerald-100 hover:text-white font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Website</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-red-950/60 flex items-center gap-2 text-red-300 hover:text-red-200 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* AI Assistant Modal */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">AgriN Farm Intelligence AI</h3>
                  <p className="text-[10px] text-slate-400">Grounded in live Sentinel-2 & soil sensor feeds</p>
                </div>
              </div>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Conversation */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {aiChatLogs.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white font-medium rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-tl-xs leading-relaxed'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Analyzing field satellite index...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendAi} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask about fertilizer, pests, NDVI, or water schedules..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
