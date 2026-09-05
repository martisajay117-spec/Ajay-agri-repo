import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Star,
  Filter,
  ChevronDown,
  MapPin,
  Bell,
  HelpCircle,
  Plus,
  Minus,
  Trash2,
  Check,
  X,
  Sparkles,
  Package,
  Truck,
  ShieldCheck,
  CreditCard,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ProductItem, MarketplaceCategory, CartItem } from '../../types/farm';

// ============================================================================
// INITIAL REALISTIC PRODUCTS MATCHING THE SCREENSHOT
// ============================================================================
export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-pioneer-maize',
    name: 'Pioneer Hi-Bred Maize Seeds',
    category: 'Seeds',
    price: 1450,
    unit: 'bag',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Ravi Seeds & Pesticides',
    sellerRating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'Corteva Pioneer',
    badge: 'High Germination (98%)',
    description:
      'Premium hybrid maize seeds bred for high drought tolerance and maximum kernel weight. Treated with Thiamethoxam for early shoot-fly protection.',
  },
  {
    id: 'prod-gromor-fertilizer',
    name: 'Coromandel Gromor 19:19:19 Fertilizer',
    category: 'Fertilizers',
    price: 1450,
    unit: 'bag',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Ravi Seeds & Pesticides',
    sellerRating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'Coromandel International',
    badge: '100% Water Soluble',
    description:
      'Balanced foliar & fertigation grade NPK formulation for vegetative and heading stages. Rapid absorption within 4 hours of application.',
  },
  {
    id: 'prod-cotton-fertilizer',
    name: 'Cotton of Tractor Fertilizer',
    category: 'Fertilizers',
    price: 1450,
    unit: 'bag',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Ravi Seeds & Pesticides',
    sellerRating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'Kisan Agritech',
    badge: 'Micronutrient Enriched',
    description:
      'Specialized cotton booster complex with Zinc, Boron, and Magnesium. Prevents square drying and boll shedding during critical flowering.',
  },
  {
    id: 'prod-farmtrac-attachment-1',
    name: 'Farmtrac Tractor Attachment',
    category: 'Equipment',
    price: 28500,
    unit: 'unit',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Farmtrac Tractor',
    sellerRating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'Escorts Kubota / Farmtrac',
    badge: 'Heavy Duty 3-Point Linkage',
    description:
      'Commercial-grade hydraulic tractor hitch attachment compatible with 35-55 HP utility tractors. Solid boron steel frame.',
  },
  {
    id: 'prod-farmtrac-attachment-2',
    name: 'Farmtrac Tractor Attachment',
    category: 'Equipment',
    price: 28500,
    unit: 'unit',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Farmtrac Trachment',
    sellerRating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'Farmtrac Agricultural',
    badge: 'PTO Driven (540 RPM)',
    description:
      'Universal rear-mounted furrower and land-leveler attachment. Designed for precision seedbed contouring.',
  },
  {
    id: 'prod-farmtrac-tillachment',
    name: 'Farmtrac Tractor Tillachmert',
    category: 'Equipment',
    price: 28500,
    unit: 'unit',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Ravi Seeds & Pesticides',
    sellerRating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'VST Shakti / Farmtrac',
    badge: 'Multi-Speed Gearbox',
    description:
      'Rotary power tiller attachment with 36 heat-treated C-type blades for deep soil aeration and clod pulverization.',
  },
  {
    id: 'prod-drone-spraying',
    name: 'Drone Spraying & Machine Rental',
    category: 'Services',
    price: 19500,
    unit: 'unit',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Drone Spraying',
    sellerRating: 5.0,
    imageUrl:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'AgriN AeroTech',
    badge: '10 Ha / Day Coverage',
    description:
      'Turnkey precision agro-drone service with certified DGCA pilot. Centrifugal micron atomizer ensures 99.4% canopy penetration.',
  },
  {
    id: 'prod-farming-machine-rental',
    name: 'Farmtrac Farming Machine Rental',
    category: 'Services',
    price: 18500,
    unit: 'unit',
    rating: 5,
    reviewCount: 128,
    sellerName: 'Machine Machine',
    sellerRating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    brand: 'Kisan Fleet Services',
    badge: 'Operator Included',
    description:
      'High-capacity pneumatic seed drill and broadcast spreader tractor unit on daily rental with diesel and certified driver.',
  },
];

interface MarketplaceViewProps {
  onOpenHelp?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onOpenHelp }) => {
  // Top Header State
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm - Madhya Pradesh, India');
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Seeds');
  const [productTypeDropdown, setProductTypeDropdown] = useState('All Products');
  const [productTypeOpen, setProductTypeOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'low-to-high' | 'high-to-low' | 'rating'>('low-to-high');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Cart State (Initialized with 2 items for realistic live preview matching screenshot)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 2 },
    { product: INITIAL_PRODUCTS[1], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Product Quick-View Modal
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);

  // Floating GIS Toolbar
  const [zoomLevel, setZoomLevel] = useState(1);

  // Checkout Success State
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Category List matching screenshot
  const categories = ['Seeds', 'Fertilizers', 'Equipment', 'Services'];

  // Add to cart handler
  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setJustAddedId(product.id);
    setToastMessage(`Added 1x ${product.name} to Cart`);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart quantity controls
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Cart totals
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const kisanSubsidy = Math.round(cartSubtotal * 0.05);
  const finalTotal = Math.max(0, cartSubtotal - kisanSubsidy);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      // Category filter (if not "All Categories")
      if (selectedCategory !== 'All Categories' && product.category !== selectedCategory) {
        return false;
      }

      // Dropdown product type filter
      if (productTypeDropdown !== 'All Products' && product.category !== productTypeDropdown) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchSeller = product.sellerName.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        if (!matchName && !matchSeller && !matchCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'low-to-high') return a.price - b.price;
      if (sortOption === 'high-to-low') return b.price - a.price;
      if (sortOption === 'rating') return (b.sellerRating || 5) - (a.sellerRating || 5);
      return 0;
    });
  }, [selectedCategory, productTypeDropdown, searchQuery, sortOption]);

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
        {/* Left: Page Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>AgriN Marketplace</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Certified agricultural inputs, high-yield seeds, fertilizers & machinery rentals
          </p>
        </div>

        {/* Right Controls: Farm Selector, Notification Bell, Help, Cart Icon */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Farm Selector Dropdown matching screenshot */}
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
              title="Marketplace & Order Alerts"
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
                    Marketplace & Delivery Alerts
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <span className="font-bold">Dispatch Update:</span> Pioneer Hybrid Maize batch
                    dispatched to Madhya Pradesh depot.
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                    <span className="font-bold">Price Drop:</span> Coromandel Gromor 19:19:19 eligible
                    for ₹150 PM-KISAN subsidy voucher.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            title="Marketplace & Delivery Guide"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Small Cart Icon with Item Count at Top Right matching user prompt */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="View Shopping Cart"
            className="relative px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Cart</span>
            {totalCartCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-extrabold min-w-[18px] text-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FILTER & SEARCH BAR MATCHING SCREENSHOT               */}
      {/* ======================================================== */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Floating GIS Toolbar on left matching screenshot */}
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
            title="Center Field"
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
            title="Market Layer"
            className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-emerald-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Bar matching screenshot */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, seeds, machines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-emerald-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Middle & Right Filter Dropdowns matching screenshot */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Dropdown: "All Products" */}
          <div className="relative">
            <button
              onClick={() => setProductTypeOpen(!productTypeOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs min-w-[140px] justify-between"
            >
              <span>{productTypeDropdown}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {productTypeOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProductTypeOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {['All Products', 'Seeds', 'Fertilizers', 'Equipment', 'Services'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setProductTypeDropdown(type);
                        setProductTypeOpen(false);
                        if (type !== 'All Products') setSelectedCategory(type);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                        productTypeDropdown === type
                          ? 'font-bold text-emerald-700 bg-emerald-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{type}</span>
                      {productTypeDropdown === type && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dropdown: "Price: Low to High" matching screenshot */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-2xs min-w-[160px] justify-between"
            >
              <span>
                {sortOption === 'low-to-high'
                  ? 'Price: Low to High'
                  : sortOption === 'high-to-low'
                  ? 'Price: High to Low'
                  : 'Highest Rated'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {sortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setSortDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  {[
                    { id: 'low-to-high', label: 'Price: Low to High' },
                    { id: 'high-to-low', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Highest Rated (4.9+)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSortOption(s.id as any);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between ${
                        sortOption === s.id
                          ? 'font-bold text-emerald-700 bg-emerald-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{s.label}</span>
                      {sortOption === s.id && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Filters Button matching screenshot */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-semibold transition-colors shadow-2xs ${
              filtersOpen
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN SECTION: CATEGORY SIDEBAR + PRODUCT GRID         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Category Filter Sidebar/Tabs matching screenshot */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="text-sm font-extrabold text-slate-900 pb-1">
            Category
          </div>
          <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setProductTypeDropdown('All Products');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
            <button
              onClick={() => {
                setSelectedCategory('All Categories');
                setProductTypeDropdown('All Products');
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'All Categories'
                  ? 'bg-slate-100 text-slate-900 font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              All Categories
            </button>
          </div>

          {/* Quick Filter Info Badge */}
          <div className="pt-2 border-t border-slate-100 hidden lg:block">
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kisan Guarantee</span>
              </div>
              <p className="text-[10px] text-emerald-700 leading-snug">
                All seeds and inputs are lab-tested with BRICS phyto-sanitary clearance.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4-Column Product Cards Grid matching screenshot */}
        <div className="lg:col-span-10">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-base font-bold text-slate-700">No products found</div>
              <p className="text-xs text-slate-500">
                Try selecting "All Categories" or adjusting your search keywords.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const isJustAdded = justAddedId === product.id;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image Thumbnail */}
                      <div
                        onClick={() => setInspectProduct(product)}
                        className="relative w-full h-36 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 mb-3 cursor-pointer group-hover:opacity-95 transition-opacity"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {product.badge && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded-md">
                            {product.badge}
                          </div>
                        )}
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setInspectProduct(product)}
                        className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2 min-h-[32px] cursor-pointer group-hover:text-emerald-800 transition-colors"
                      >
                        {product.name}
                      </h3>

                      {/* Price / Unit matching screenshot */}
                      <div className="mt-1.5 flex items-baseline gap-1">
                        <span className="text-sm font-extrabold text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          / {product.unit}
                        </span>
                      </div>

                      {/* Star Rating & Review Count matching screenshot */}
                      <div className="mt-1 flex items-center gap-1.5 text-xs">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {product.reviewCount} ratings
                        </span>
                      </div>

                      {/* Seller Name matching screenshot */}
                      <div className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                        Sold by: <span className="text-slate-700">{product.sellerName}</span>
                      </div>
                    </div>

                    {/* Add to Cart Button matching screenshot */}
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isJustAdded
                            ? 'bg-emerald-800 text-white scale-98'
                            : 'bg-[#296839] hover:bg-[#1d4d29] active:bg-[#153c1f] text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SHOPPING CART DRAWER / SLIDE-OVER                      */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Your Farm Cart</h3>
                  <p className="text-xs text-slate-500">
                    {totalCartCount} item{totalCartCount !== 1 ? 's' : ''} in cart
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="text-sm font-bold text-slate-700">Your cart is empty</div>
                  <p className="text-xs text-slate-400">
                    Browse seeds, fertilizers, or farm machinery rentals to add items.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex gap-3 items-center"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ₹{item.product.price.toLocaleString('en-IN')} / {item.product.unit}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')} total
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-md hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold text-slate-900 px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-md hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>PM-KISAN Agri Subsidy (5%)</span>
                    <span className="font-bold">-₹{kisanSubsidy.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depot Delivery</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-emerald-800">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCheckoutComplete(true);
                    setCartItems([]);
                    setTimeout(() => {
                      setCheckoutComplete(false);
                      setIsCartOpen(false);
                    }, 3000);
                  }}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Place Farm Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                </button>

                {checkoutComplete && (
                  <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-900 text-xs text-center font-bold animate-bounce">
                    🎉 Order #AGR-{Math.floor(100000 + Math.random() * 900000)} Placed Successfully!
                    Scheduled for delivery to {selectedFarm}.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PRODUCT QUICK-VIEW DOSSIER MODAL                      */}
      {/* ======================================================== */}
      {inspectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                  {inspectProduct.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-semibold">{inspectProduct.brand}</span>
              </div>
              <button
                onClick={() => setInspectProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="w-full h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={inspectProduct.imageUrl}
                  alt={inspectProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{inspectProduct.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {inspectProduct.reviewCount} verified reviews
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Kisan Price</div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{inspectProduct.price.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-500 font-normal"> / {inspectProduct.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">
                    In Stock (Madhya Pradesh Depot)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {inspectProduct.description}
              </p>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Sold by: <span className="font-bold text-slate-800">{inspectProduct.sellerName}</span>
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(inspectProduct);
                    setInspectProduct(null);
                  }}
                  className="px-5 py-2.5 bg-[#296839] hover:bg-[#1d4d29] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
