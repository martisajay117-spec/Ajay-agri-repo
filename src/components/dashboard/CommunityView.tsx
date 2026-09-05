import React, { useState, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  Heart,
  Share2,
  Image as ImageIcon,
  Send,
  MoreVertical,
  MapPin,
  Bell,
  HelpCircle,
  Users,
  TrendingUp,
  Tag,
  Check,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  UserPlus,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Smile,
  Paperclip,
} from 'lucide-react';
import { CommunityPost, FarmerGroup, TrendingTopic } from '../../types/farm';

// ============================================================================
// INITIAL SEED DATA MATCHING SCREENSHOT
// ============================================================================
export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Sunil Kumar',
    authorAvatar:
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=200&h=200&crop=faces&q=80',
    authorLocation: 'Madhya Pradesh, India',
    timestamp: '13 hours ago',
    content: 'Check out my new drip irrigation set up. Sugarcane looks good!',
    cropPhoto:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80',
    cropTags: ['Sugarcane', 'Drip Irrigation'],
    likes: 34,
    commentsCount: 12,
    isLiked: false,
    comments: [
      {
        id: 'c1-1',
        authorName: 'Ramesh Verma',
        authorAvatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        content: 'Nice, Sunil! What was the cost?',
        timestamp: '11 hours ago',
      },
      {
        id: 'c1-2',
        authorName: 'Ramesh Verma',
        authorAvatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        content: 'What was matched in the bolt? Any pressure regulators needed?',
        timestamp: '9 hours ago',
      },
    ],
  },
  {
    id: 'post-2',
    authorName: 'Meera Sharma',
    authorAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    authorLocation: 'Punjab, India',
    timestamp: '13 hours ago',
    content: 'Need help identifying this pest. Recommendations?',
    cropPhoto:
      'https://images.unsplash.com/photo-1599827552599-eeddd598e94b?auto=format&fit=crop&w=800&q=80',
    cropTags: ['Crop Disease', 'Pest Control'],
    likes: 5,
    commentsCount: 5,
    isLiked: false,
    comments: [
      {
        id: 'c2-1',
        authorName: 'Dr. Anand Joshi',
        authorAvatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        content: 'Looks like early stages of Cercospora leaf spot. Spray Mancozeb 75 WP at 2g/L water.',
        timestamp: '10 hours ago',
      },
    ],
  },
  {
    id: 'post-3',
    authorName: 'Ganesh Singh',
    authorAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    authorLocation: 'Madhya Pradesh, India',
    timestamp: '12 hours ago',
    content: 'Soil pH issues in Wheat, any cover crop suggestions?',
    cropTags: ['Soil Health', 'Wheat'],
    likes: 18,
    commentsCount: 7,
    isLiked: false,
    comments: [
      {
        id: 'c3-1',
        authorName: 'Ganesh Singh',
        authorAvatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        content: 'Soil pH 8.1 in lower wheat parcel. Need advice for deep cover crop over winter.',
        timestamp: '11 hours ago',
      },
      {
        id: 'c3-2',
        authorName: 'Ramesh Verma',
        authorAvatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        content: 'Dhaincha (Sesbania) or Sunn hemp works wonders to bring pH down naturally.',
        timestamp: '8 hours ago',
      },
      {
        id: 'c3-3',
        authorName: 'Ganesh Singh',
        authorAvatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        content: 'Advice is appreciated, will seed Dhaincha ahead of pre-monsoon shower.',
        timestamp: '6 hours ago',
      },
    ],
  },
  {
    id: 'post-4',
    authorName: 'Meera Sharma',
    authorAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    authorLocation: 'Punjab, India',
    timestamp: '12 hours ago',
    content: 'Successful harvest of organic mustard! Averaged 2.2 T/ha with bio-fertilizers only.',
    cropTags: ['Organic Farming', 'Harvest'],
    likes: 42,
    commentsCount: 8,
    isLiked: false,
    comments: [],
  },
];

export const INITIAL_TRENDING_TOPICS: TrendingTopic[] = [
  { id: 'trend-1', tag: '#WheatDryingTips', postsCount: 7 },
  { id: 'trend-2', tag: 'Pest Control Strategies', postsCount: 3 },
  { id: 'trend-3', tag: '#OrganicManure', postsCount: 2 },
  { id: 'trend-4', tag: 'Rainfall Predications', postsCount: 3 },
];

export const INITIAL_FARMER_GROUPS: FarmerGroup[] = [
  {
    id: 'group-1',
    name: 'Bantwal Sugarcane Co-op',
    membersCount: 142,
    location: 'Madhya Pradesh',
    avatarUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80',
    isJoined: false,
    category: 'Sugarcane & Jaggery',
  },
  {
    id: 'group-2',
    name: 'Kudremukh Dairy Union',
    membersCount: 89,
    location: 'Karnataka / MP Border',
    avatarUrl:
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=200&q=80',
    isJoined: false,
    category: 'Livestock & Fodder',
  },
  {
    id: 'group-3',
    name: 'Guthu Farming Collective',
    membersCount: 215,
    location: 'Central Agro Valley',
    avatarUrl:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=200&q=80',
    isJoined: false,
    category: 'Regenerative Grain',
  },
];

interface CommunityViewProps {
  onOpenHelp?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onOpenHelp }) => {
  // Farm & Notification State
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Madhya Pradesh, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Feed State
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTag1, setNewPostTag1] = useState('Wheat');
  const [newPostTag2, setNewPostTag2] = useState('Crop Health');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [expandedThreadPostId, setExpandedThreadPostId] = useState<string | null>('post-1');
  const [replyInputByPost, setReplyInputByPost] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trending & Groups State
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>(INITIAL_TRENDING_TOPICS);
  const [farmerGroups, setFarmerGroups] = useState<FarmerGroup[]>(INITIAL_FARMER_GROUPS);
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);

  // Floating GIS Toolbar
  const [zoomLevel, setZoomLevel] = useState(1);

  // Current User (Ramesh Verma matching screenshot)
  const currentFarmer = {
    name: 'Ramesh Verma',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'Smallholder Farmer',
  };

  // Filtered Posts based on tag or search
  const filteredPosts = useMemo(() => {
    if (!activeFilterTag) return posts;
    const filterLower = activeFilterTag.toLowerCase().replace('#', '');
    return posts.filter(
      (p) =>
        p.content.toLowerCase().includes(filterLower) ||
        p.cropTags?.some((t) => t.toLowerCase().includes(filterLower))
    );
  }, [posts, activeFilterTag]);

  // Handle Post Creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      const createdPost: CommunityPost = {
        id: `post-${Date.now()}`,
        authorName: currentFarmer.name,
        authorAvatar: currentFarmer.avatar,
        authorLocation: 'Madhya Pradesh, India',
        timestamp: 'Just now',
        content: newPostText.trim(),
        cropPhoto: newPostImage || undefined,
        cropTags: [newPostTag1, newPostTag2].filter(Boolean),
        likes: 1,
        commentsCount: 0,
        isLiked: true,
        comments: [],
      };

      setPosts((prev) => [createdPost, ...prev]);
      setNewPostText('');
      setNewPostImage(null);
      setIsPosting(false);
      setToastMessage('Question posted to the Farmer Community!');
      setTimeout(() => setToastMessage(null), 3500);
    }, 600);
  };

  // Handle Like Post
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  // Handle Submit Comment / Reply
  const handleAddComment = (postId: string) => {
    const text = replyInputByPost[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: `c-${Date.now()}`,
      authorName: currentFarmer.name,
      authorAvatar: currentFarmer.avatar,
      content: text,
      timestamp: 'Just now',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    setReplyInputByPost((prev) => ({ ...prev, [postId]: '' }));
    setExpandedThreadPostId(postId);
  };

  // Handle Join Group Toggle
  const handleToggleJoinGroup = (groupId: string) => {
    setFarmerGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const isJoined = !g.isJoined;
          return {
            ...g,
            isJoined,
            membersCount: isJoined ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
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
      {/* 1. TOP HEADER ROW MATCHING SCREENSHOT                     */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Left: Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Community Hub</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Peer knowledge exchange, pest diagnostics & regional farmer co-operatives
          </p>
        </div>

        {/* Right Controls: Farm Selector, Notification Bell, Help */}
        <div className="flex items-center gap-2.5 flex-wrap">
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

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="Community Notifications"
              className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-40 text-xs space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Recent Community Mentions
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <span className="font-bold">Sunil Kumar</span> replied to your comment on drip irrigation setup.
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                    <span className="font-bold">Bantwal Sugarcane Co-op</span> posted weekly sugar recovery rates.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            title="Community Guidelines"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN 2-COLUMN LAYOUT: FEED (LEFT) + TRENDS (RIGHT)     */}
      {/* ======================================================== */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
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
            title="Locate Regional Farmers"
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
            title="Community Layers"
            className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* LEFT COLUMN (lg:col-span-8): POST CREATOR + POSTS FEED    */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Filter Tag Pill if selected */}
          {activeFilterTag && (
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold">
              <span>Showing posts tagged with "{activeFilterTag}"</span>
              <button
                onClick={() => setActiveFilterTag(null)}
                className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-[11px]"
              >
                <X className="w-3.5 h-3.5" /> Clear Filter
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* ASK THE COMMUNITY POST INPUT BOX (MATCHING SCREENSHOT)   */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-start gap-3">
              {/* Farmer Profile Avatar on Left */}
              <img
                src={currentFarmer.avatar}
                alt={currentFarmer.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
              />

              {/* Input Area */}
              <div className="flex-1 space-y-2.5">
                <div className="text-xs font-bold text-slate-800">Ask the Community</div>

                {/* Text Field */}
                <textarea
                  rows={2}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Type a question..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-emerald-500 font-normal resize-none"
                />

                {/* Optional Attached Photo Preview */}
                {newPostImage && (
                  <div className="relative inline-block mt-1">
                    <img
                      src={newPostImage}
                      alt="Crop attachment"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                    />
                    <button
                      onClick={() => setNewPostImage(null)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Bottom Bar: Crop-Tags Dropdowns + Photo Upload Icon + Post Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Crop-tags Dropdown 1 matching screenshot */}
                    <div className="relative">
                      <select
                        value={newPostTag1}
                        onChange={(e) => setNewPostTag1(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-emerald-500 cursor-pointer"
                      >
                        <option value="Wheat">Wheat</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Maize">Maize</option>
                        <option value="Rice">Rice</option>
                        <option value="Soybean">Soybean</option>
                        <option value="Cotton">Cotton</option>
                      </select>
                    </div>

                    {/* Crop-tags Dropdown 2 matching screenshot */}
                    <div className="relative">
                      <select
                        value={newPostTag2}
                        onChange={(e) => setNewPostTag2(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-emerald-500 cursor-pointer"
                      >
                        <option value="Crop Health">Crop Health</option>
                        <option value="Pest Control">Pest Control</option>
                        <option value="Drip Irrigation">Drip Irrigation</option>
                        <option value="Soil Health">Soil Health</option>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Weather Impact">Weather Impact</option>
                      </select>
                    </div>

                    {/* Photo Upload Trigger Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Sample realistic field photo attachment
                        setNewPostImage(
                          'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80'
                        );
                      }}
                      title="Attach field or crop photo"
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1 text-xs"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline text-[11px] font-medium">Photo</span>
                    </button>
                  </div>

                  {/* Green Post Button matching screenshot */}
                  <button
                    type="button"
                    onClick={handleCreatePost}
                    disabled={isPosting || !newPostText.trim()}
                    className={`px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      newPostText.trim()
                        ? 'bg-[#296839] hover:bg-[#1d4d29] text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isPosting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <span>Post</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SCROLLABLE FEED OF FARMER POSTS (MATCHING SCREENSHOT)    */}
          {/* ======================================================== */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isExpanded = expandedThreadPostId === post.id;
              const hasThread = post.comments && post.comments.length > 0;

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3"
                >
                  {/* Post Header: Profile Photo, Name, Time, Menu */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 leading-tight">
                          {post.authorName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {post.timestamp} • {post.authorLocation}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Tags chips */}
                      {post.cropTags?.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => setActiveFilterTag(tag)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-[10px] font-semibold rounded-md cursor-pointer transition-colors hidden sm:inline-block"
                        >
                          #{tag}
                        </span>
                      ))}
                      <button
                        title="Options"
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Post Text */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {post.content}
                  </p>

                  {/* Crop Photo (Optional) matching screenshot */}
                  {post.cropPhoto && (
                    <div className="w-full max-h-72 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={post.cropPhoto}
                        alt="Crop status"
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Action Bar: Likes, Comments, Share matching screenshot */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-4">
                      {/* Heart / Like Button */}
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors ${
                          post.isLiked ? 'text-rose-600 font-bold' : 'text-slate-600'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            post.isLiked ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                        <span>{post.likes}</span>
                      </button>

                      {/* Comment Count / Thread Toggle */}
                      <button
                        onClick={() =>
                          setExpandedThreadPostId(isExpanded ? null : post.id)
                        }
                        className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>
                          {post.commentsCount}{' '}
                          {hasThread ? `(${post.comments.length} threads)` : ''}
                        </span>
                      </button>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={() => {
                        setToastMessage(`Copied link to ${post.authorName}'s post!`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50"
                      title="Share post"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expanded Discussion Thread matching screenshot */}
                  {isExpanded && (
                    <div className="mt-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>Discussion thread ({post.comments.length})</span>
                        <button
                          onClick={() => setExpandedThreadPostId(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Comment list */}
                      <div className="space-y-2.5">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2.5">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                            />
                            <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">
                                  {comment.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {comment.timestamp}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input Box */}
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={currentFarmer.avatar}
                          alt={currentFarmer.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyInputByPost[post.id] || ''}
                          onChange={(e) =>
                            setReplyInputByPost((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-emerald-500 font-normal"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (lg:col-span-4): TRENDING & NEARBY GROUPS    */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* CARD 1: TRENDING TOPICS (MATCHING SCREENSHOT) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center justify-between">
              <span>Trending Topics</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </h2>

            <div className="space-y-2">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => setActiveFilterTag(topic.tag)}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {topic.tag}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {topic.postsCount} active posts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: NEARBY FARMER GROUPS (MATCHING SCREENSHOT) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center justify-between">
              <span>Nearby Farmer Groups</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </h2>

            {/* Mini Geographic Cluster Map Preview matching screenshot */}
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-200 bg-emerald-50">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                <rect width="300" height="120" fill="#e2f1e6" />
                {/* Simulated topographical landscape contours */}
                <path
                  d="M0,40 Q80,20 150,50 T300,30 L300,120 L0,120 Z"
                  fill="#d1ebd8"
                  opacity="0.7"
                />
                <path
                  d="M0,70 Q100,50 180,80 T300,60 L300,120 L0,120 Z"
                  fill="#bfe3c9"
                  opacity="0.8"
                />
                <path
                  d="M40,0 Q90,60 140,20 T240,40"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="3"
                  opacity="0.6"
                />

                {/* Farmer Cluster Pins matching screenshot */}
                {[
                  { cx: 50, cy: 35, label: 'Sugarcane' },
                  { cx: 85, cy: 60, label: 'Dairy' },
                  { cx: 120, cy: 45, label: 'Wheat' },
                  { cx: 155, cy: 75, label: 'Organic' },
                  { cx: 200, cy: 50, label: 'Central' },
                  { cx: 245, cy: 40, label: 'Hort' },
                  { cx: 270, cy: 70, label: 'Paddy' },
                ].map((pin, i) => (
                  <g key={i}>
                    <circle cx={pin.cx} cy={pin.cy} r="9" fill="#2d6a3f" opacity="0.9" />
                    <circle cx={pin.cx} cy={pin.cy} r="4" fill="#ffffff" />
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-1.5 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold rounded">
                Madhya Pradesh Region
              </div>
            </div>

            {/* List with Member Counts and "Join" Button matching screenshot */}
            <div className="space-y-2.5">
              {farmerGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/90 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={group.avatarUrl}
                      alt={group.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 truncate">
                        {group.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {group.membersCount} members • {group.category}
                      </div>
                    </div>
                  </div>

                  {/* Green "Join" Button matching screenshot */}
                  <button
                    onClick={() => handleToggleJoinGroup(group.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      group.isJoined
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-[#296839] hover:bg-[#1d4d29] text-white shadow-2xs'
                    }`}
                  >
                    {group.isJoined ? 'Joined ✓' : 'Join Group'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
