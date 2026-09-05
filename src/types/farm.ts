export interface Farm {
  id: string;
  farmerId: string;
  farmName: string;
  location: string;
  lat?: number;
  lng?: number;
  farmSize: string;
  cropType: string;
  fieldHealthIndex: number; // 0 - 100
  soilMoisture: number; // percentage, e.g. 28
  organicMatter: number; // percentage, e.g. 2.45
  nitrogenLevel: number; // kg/ha, e.g. 32
  soilPh: number; // e.g. 6.8
  phosphorus: number; // kg/ha, e.g. 24
  potassium: number; // kg/ha, e.g. 185
  predictedYield: string; // e.g. "4.8 T/ha"
  lastUpdated: string;
  createdAt: string;
}

export interface FieldHealthHistory {
  id: string;
  farmId: string;
  date: string; // YYYY-MM-DD
  ndvi: number; // 0.00 - 1.00
  healthScore: number; // 0 - 100
  satelliteSource?: string;
  notes?: string;
}

export interface AiRecommendation {
  id: string;
  farmId: string;
  farmerId?: string;
  title: string;
  description: string;
  type: 'irrigation' | 'compost' | 'rotation' | 'fertilizer' | 'pest_management' | 'harvest';
  status: 'pending' | 'done';
  impact?: string;
  actionDue?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CropDiagnostic {
  id: string;
  farmId: string;
  farmerId?: string;
  imageURL: string;
  diagnosisResult: string;
  confidenceScore: number; // e.g. 94 for 94%
  severity?: 'low' | 'moderate' | 'high';
  symptoms?: string;
  treatmentRecommendation?: string;
  preventativeMeasures?: string;
  uploadedAt: string;
}

export interface WeatherCurrent {
  temp: number; // Celsius
  condition: string;
  description: string;
  humidity: number; // percentage
  windSpeed: number; // km/h
  uvIndex: number;
  precipitationProb: number; // %
  iconType: 'sun' | 'cloud' | 'rain' | 'storm' | 'partly-cloudy';
}

export interface WeatherForecastDay {
  dayName: string; // TODAY, TOMORROW, WED, THU...
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  iconType: 'sun' | 'cloud' | 'rain' | 'storm' | 'partly-cloudy';
  rainProbability: number;
  statusTag: string; // e.g. "Optimal", "Rain 40%", "Sunny"
}

export interface WeatherData {
  locationName: string;
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  lastFetched: string;
}

export interface NotificationItem {
  id: string;
  type: 'recommendation' | 'weather' | 'health' | 'diagnostic';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  actionUrl?: string;
}

export type FieldStatus = 'Good' | 'Moderate' | 'Poor';

export interface FieldPlot {
  id: string;
  name: string;
  cropType: 'Wheat' | 'Sugarcane' | 'Maize' | 'Soybean' | 'Rice' | 'Cotton' | string;
  sizeAcres: number;
  status: FieldStatus;
  updatedDate: string;
  imageUrl: string;
  polygonPoints: string; // SVG polygon points e.g. "20,15 80,10 95,65 50,85 10,60"
  polygonColor: string; // hex or rgb
  ndviScore?: number;
  soilMoisture?: number;
  nitrogenLevel?: number;
  irrigationType?: string;
}

export interface CropRiskIndicator {
  name: string;
  level: 'Low' | 'Moderate' | 'High';
  iconType?: 'check' | 'warning' | 'danger';
  description?: string;
}

export interface CropNdviPoint {
  month: string;
  ndvi: number;
  baseline?: number;
}

export interface CropHealthRecord {
  id: string;
  name: string;
  scientificName?: string;
  fieldId: string;
  fieldName: string;
  sizeAcres: number;
  imageUrl: string;
  currentStage: string;
  stageProgressPercent: number;
  stageLabel: string;
  stages: string[];
  currentStageIndex: number;
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  pestIndicators: CropRiskIndicator[];
  ndviHistory: CropNdviPoint[];
  currentNdvi: number;
  ndviDelta: string;
  soilMoisture: number;
  nitrogenKgHa: number;
  chlorophyllIndex: number;
  canopyDensity: number;
  plantingDate: string;
  estimatedHarvest: string;
  predictedYield: string;
  fullHistoryNotes: {
    date: string;
    event: string;
    ndviValue: number;
    impact: 'positive' | 'neutral' | 'warning';
  }[];
  recommendations: {
    title: string;
    urgency: 'Low' | 'Medium' | 'High';
    category: 'Irrigation' | 'Fertilization' | 'Pest Control' | 'Harvesting';
    detail: string;
    actionLabel: string;
  }[];
}

export type ReportType = 'Soil Health' | 'Yield Summary' | 'Weather Impact' | 'Crop Disease History' | 'Custom';

export interface ReportItem {
  id: string;
  title: string;
  type: ReportType;
  dateRange: string;
  startDate: string;
  endDate: string;
  description: string;
  fileSize: string;
  generatedDate: string;
  fieldsCovered: string[];
  keyMetrics: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  author: string;
  downloadCount?: number;
}

export type MarketplaceCategory = 'Seeds' | 'Fertilizers' | 'Equipment' | 'Services';

export interface ProductItem {
  id: string;
  name: string;
  category: MarketplaceCategory;
  price: number;
  unit: string;
  rating: number;
  reviewCount: number;
  sellerName: string;
  sellerRating?: number;
  imageUrl: string;
  inStock: boolean;
  description?: string;
  brand?: string;
  badge?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation?: string;
  content: string;
  timestamp: string;
  likes?: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  timestamp: string;
  content: string;
  cropPhoto?: string;
  cropTags?: string[];
  likes: number;
  commentsCount: number;
  comments: CommunityComment[];
  isLiked?: boolean;
}

export interface FarmerGroup {
  id: string;
  name: string;
  membersCount: number;
  location: string;
  avatarUrl: string;
  isJoined?: boolean;
  category: string;
}

export interface TrendingTopic {
  id: string;
  tag: string;
  postsCount: number;
}

