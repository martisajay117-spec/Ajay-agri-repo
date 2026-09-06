import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, isRealFirebaseConfigured } from './config';
import { Farm, FieldHealthHistory, AiRecommendation, CropDiagnostic } from '../types/farm';

// Local Storage Keys
const STORAGE_FARMS = 'agrin_farms';
const STORAGE_HISTORY = 'agrin_field_history';
const STORAGE_RECS = 'agrin_recommendations';
const STORAGE_DIAGS = 'agrin_diagnostics';

// Subscriber listeners
const farmSubscribers: Map<string, Set<(farms: Farm[]) => void>> = new Map();
const historySubscribers: Map<string, Set<(hist: FieldHealthHistory[]) => void>> = new Map();
const recSubscribers: Map<string, Set<(recs: AiRecommendation[]) => void>> = new Map();
const diagSubscribers: Map<string, Set<(diags: CropDiagnostic[]) => void>> = new Map();

function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

function notifyFarmSubscribers(userId: string) {
  const listeners = farmSubscribers.get(userId);
  if (!listeners || listeners.size === 0) return;
  const allFarms = getLocalItem<Farm[]>(STORAGE_FARMS, []);
  const userFarms = allFarms.filter((f) => f.farmerId === userId);
  listeners.forEach((cb) => cb(userFarms));
}

function notifyHistorySubscribers(farmId: string) {
  const listeners = historySubscribers.get(farmId);
  if (!listeners || listeners.size === 0) return;
  const allHistory = getLocalItem<FieldHealthHistory[]>(STORAGE_HISTORY, []);
  const farmHistory = allHistory.filter((h) => h.farmId === farmId);
  listeners.forEach((cb) => cb(farmHistory));
}

function notifyRecSubscribers(farmId: string) {
  const listeners = recSubscribers.get(farmId);
  if (!listeners || listeners.size === 0) return;
  const allRecs = getLocalItem<AiRecommendation[]>(STORAGE_RECS, []);
  const farmRecs = allRecs.filter((r) => r.farmId === farmId);
  listeners.forEach((cb) => cb(farmRecs));
}

function notifyDiagSubscribers(farmId: string) {
  const listeners = diagSubscribers.get(farmId);
  if (!listeners || listeners.size === 0) return;
  const allDiags = getLocalItem<CropDiagnostic[]>(STORAGE_DIAGS, []);
  const farmDiags = allDiags.filter((d) => d.farmId === farmId);
  listeners.forEach((cb) => cb(farmDiags));
}

/**
 * Generate 14-day realistic NDVI history
 */
function generateInitialHistory(farmId: string): FieldHealthHistory[] {
  const history: FieldHealthHistory[] = [];
  const baseDate = new Date();

  const ndviTrend = [0.55, 0.58, 0.61, 0.64, 0.63, 0.67, 0.69, 0.72, 0.74, 0.73, 0.76, 0.79, 0.81, 0.82];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const ndvi = ndviTrend[13 - i];

    history.push({
      id: `hist-${farmId}-${dateStr}`,
      farmId,
      date: dateStr,
      ndvi,
      healthScore: Math.round(ndvi * 100),
      satelliteSource: 'Sentinel-2 L2A (10m Multi-spectral)',
      notes: ndvi > 0.75 ? 'Optimal canopy closure' : 'Healthy vegetative growth',
    });
  }

  return history;
}

/**
 * Initial curated recommendations
 */
function generateInitialRecommendations(farmId: string, farmerId: string): AiRecommendation[] {
  const now = new Date().toISOString();
  return [
    {
      id: `rec-1-${farmId}`,
      farmId,
      farmerId,
      title: 'Zone 3 Moisture Deficit Protocol',
      description: 'VWC dropped below 22% refill point. Initiate 2.5hr drip cycle before solar peak.',
      type: 'irrigation',
      status: 'pending',
      actionDue: 'In 24 hours',
      createdAt: now,
    },
    {
      id: `rec-2-${farmId}`,
      farmId,
      farmerId,
      title: 'Foliar Calcium & Boron spray ahead of bloom',
      description: 'Mitigate blossom end stress during upcoming 33°C daytime thermal window.',
      type: 'fertilizer',
      status: 'pending',
      actionDue: 'In 48h',
      createdAt: now,
    },
    {
      id: `rec-3-${farmId}`,
      farmId,
      farmerId,
      title: 'Post-harvest Legume cover crop preparation',
      description: 'Seed hairy vetch / clover to biologically fix 45kg/ha atmospheric nitrogen.',
      type: 'rotation',
      status: 'pending',
      actionDue: 'In 5 days',
      createdAt: now,
    },
    {
      id: `rec-4-${farmId}`,
      farmerId,
      farmId,
      title: 'Early blight spore risk preventative containment',
      description: 'Relative humidity exceeded 85% for 6 consecutive morning hours. Preventive bio-fungicide applied.',
      type: 'pest_management',
      status: 'done',
      actionDue: 'Completed',
      createdAt: now,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

/**
 * Initial curated diagnostics
 */
function generateInitialDiagnostics(farmId: string, farmerId: string): CropDiagnostic[] {
  return [
    {
      id: `diag-1-${farmId}`,
      farmId,
      farmerId,
      imageURL: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
      diagnosisResult: 'Early Blight (Alternaria solani)',
      confidenceScore: 94,
      severity: 'moderate',
      symptoms: 'Concentric dark target-pattern rings with chlorotic yellow halo on lower foliage.',
      treatmentRecommendation: 'Apply organic Copper-based fungicide spray (Bordeaux mixture 1%) during cool morning hours.',
      preventativeMeasures: 'Ensure drip lines avoid foliage splashing; maintain 45cm canopy spacing.',
      uploadedAt: '2 days ago',
    },
    {
      id: `diag-2-${farmId}`,
      farmId,
      farmerId,
      imageURL: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      diagnosisResult: 'Foliar Nitrogen Chlorosis',
      confidenceScore: 91,
      severity: 'low',
      symptoms: 'Uniform pale yellowing starting from bottom leaf tips upward.',
      treatmentRecommendation: 'Apply liquid seaweed extract or 1.5% urea foliar spray.',
      preventativeMeasures: 'Incorporate nitrogen-fixing cover crops before the next planting cycle.',
      uploadedAt: '5 days ago',
    },
  ];
}

/**
 * 1. Subscribe to Farmer's farms
 */
export function subscribeFarms(userId: string, callback: (farms: Farm[]) => void): () => void {
  if (!farmSubscribers.has(userId)) {
    farmSubscribers.set(userId, new Set());
  }
  farmSubscribers.get(userId)!.add(callback);

  // If real Firestore is configured, listen to collection
  if (isRealFirebaseConfigured) {
    try {
      const q = query(collection(db, 'farms'), where('farmerId', '==', userId));
      const unsubFirestore = onSnapshot(q, (snapshot) => {
        const farms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Farm));
        callback(farms);
      });

      return () => {
        farmSubscribers.get(userId)?.delete(callback);
        unsubFirestore();
      };
    } catch (e) {
      console.warn('Firestore farms listener failed, using local store:', e);
    }
  }

  // Initial emission from local storage
  const allFarms = getLocalItem<Farm[]>(STORAGE_FARMS, []);
  const userFarms = allFarms.filter((f) => f.farmerId === userId);
  callback(userFarms);

  return () => {
    farmSubscribers.get(userId)?.delete(callback);
  };
}

/**
 * 2. Seed initial farm & telemetry for a new farmer
 */
export async function seedInitialFarmerData(
  userId: string,
  country: string,
  fullName: string
): Promise<Farm> {
  const farmId = `farm-${userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}-1`;

  // Determine regional coordinates & naming based on BRICS country
  let farmName = `${fullName.split(' ')[0]}'s Agro-Farm`;
  let location = 'Punjab, India';
  let lat = 30.901;
  let lng = 75.8573;
  let cropType = 'Wheat';

  if (country === 'Brazil') {
    location = 'Mato Grosso, Brazil';
    farmName = 'Fazenda Boa Esperança';
    lat = -12.6819;
    lng = -55.8856;
    cropType = 'Soybeans';
  } else if (country === 'Russia') {
    location = 'Rostov Oblast, Russia';
    farmName = 'Volga Agro-Complex';
    lat = 47.2357;
    lng = 39.7015;
    cropType = 'Winter Barley';
  } else if (country === 'China') {
    location = 'Heilongjiang, China';
    farmName = 'Longjiang Grain Estate';
    lat = 45.7421;
    lng = 126.6625;
    cropType = 'Maize';
  } else if (country === 'South Africa') {
    location = 'Free State, South Africa';
    farmName = 'Veldview Agricultural Plot';
    lat = -28.4541;
    lng = 26.7968;
    cropType = 'Sunflower';
  }

  const newFarm: Farm = {
    id: farmId,
    farmerId: userId,
    farmName,
    location,
    lat,
    lng,
    farmSize: '25 Acres',
    cropType,
    fieldHealthIndex: 82,
    soilMoisture: 31,
    organicMatter: 2.85,
    nitrogenLevel: 34,
    soilPh: 6.8,
    phosphorus: 26,
    potassium: 195,
    predictedYield: '4.9 T/ha',
    lastUpdated: 'Today',
    createdAt: new Date().toISOString(),
  };

  // 1. Save Farm
  const existingFarms = getLocalItem<Farm[]>(STORAGE_FARMS, []);
  const filtered = existingFarms.filter((f) => f.id !== farmId);
  setLocalItem(STORAGE_FARMS, [newFarm, ...filtered]);

  // 2. Seed Field Health History
  const history = generateInitialHistory(farmId);
  const existingHistory = getLocalItem<FieldHealthHistory[]>(STORAGE_HISTORY, []).filter(
    (h) => h.farmId !== farmId
  );
  setLocalItem(STORAGE_HISTORY, [...history, ...existingHistory]);

  // 3. Seed AI Recommendations
  const recs = generateInitialRecommendations(farmId, userId);
  const existingRecs = getLocalItem<AiRecommendation[]>(STORAGE_RECS, []).filter(
    (r) => r.farmId !== farmId
  );
  setLocalItem(STORAGE_RECS, [...recs, ...existingRecs]);

  // 4. Seed Crop Diagnostics
  const diags = generateInitialDiagnostics(farmId, userId);
  const existingDiags = getLocalItem<CropDiagnostic[]>(STORAGE_DIAGS, []).filter(
    (d) => d.farmId !== farmId
  );
  setLocalItem(STORAGE_DIAGS, [...diags, ...existingDiags]);

  // Sync to Firestore if configured
  if (isRealFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'farms', farmId), newFarm);
    } catch (e) {
      console.warn('Firestore seed farm failed:', e);
    }
  }

  notifyFarmSubscribers(userId);
  notifyHistorySubscribers(farmId);
  notifyRecSubscribers(farmId);
  notifyDiagSubscribers(farmId);

  return newFarm;
}

/**
 * 3. Subscribe to Field Health History (NDVI)
 */
export function subscribeFieldHealthHistory(
  farmId: string,
  callback: (hist: FieldHealthHistory[]) => void
): () => void {
  if (!historySubscribers.has(farmId)) {
    historySubscribers.set(farmId, new Set());
  }
  historySubscribers.get(farmId)!.add(callback);

  const allHistory = getLocalItem<FieldHealthHistory[]>(STORAGE_HISTORY, []);
  let farmHistory = allHistory.filter((h) => h.farmId === farmId);

  // If no history exists for this farm yet, generate it
  if (farmHistory.length === 0) {
    farmHistory = generateInitialHistory(farmId);
    setLocalItem(STORAGE_HISTORY, [...farmHistory, ...allHistory]);
  }

  callback(farmHistory);

  return () => {
    historySubscribers.get(farmId)?.delete(callback);
  };
}

/**
 * 4. Subscribe to AI Recommendations
 */
export function subscribeAiRecommendations(
  farmId: string,
  callback: (recs: AiRecommendation[]) => void
): () => void {
  if (!recSubscribers.has(farmId)) {
    recSubscribers.set(farmId, new Set());
  }
  recSubscribers.get(farmId)!.add(callback);

  const allRecs = getLocalItem<AiRecommendation[]>(STORAGE_RECS, []);
  let farmRecs = allRecs.filter((r) => r.farmId === farmId);

  if (farmRecs.length === 0) {
    farmRecs = generateInitialRecommendations(farmId, 'demo-farmer-1');
    setLocalItem(STORAGE_RECS, [...farmRecs, ...allRecs]);
  }

  callback(farmRecs);

  return () => {
    recSubscribers.get(farmId)?.delete(callback);
  };
}

/**
 * 5. Subscribe to Crop Diagnostics
 */
export function subscribeCropDiagnostics(
  farmId: string,
  callback: (diags: CropDiagnostic[]) => void
): () => void {
  if (!diagSubscribers.has(farmId)) {
    diagSubscribers.set(farmId, new Set());
  }
  diagSubscribers.get(farmId)!.add(callback);

  const allDiags = getLocalItem<CropDiagnostic[]>(STORAGE_DIAGS, []);
  let farmDiags = allDiags.filter((d) => d.farmId === farmId);

  if (farmDiags.length === 0) {
    farmDiags = generateInitialDiagnostics(farmId, 'demo-farmer-1');
    setLocalItem(STORAGE_DIAGS, [...farmDiags, ...allDiags]);
  }

  callback(farmDiags);

  return () => {
    diagSubscribers.get(farmId)?.delete(callback);
  };
}

/**
 * 6. Toggle Recommendation status ('pending' <-> 'done')
 */
export async function toggleRecommendationStatus(
  farmId: string,
  recId: string,
  currentStatus: 'pending' | 'done'
): Promise<void> {
  const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
  const allRecs = getLocalItem<AiRecommendation[]>(STORAGE_RECS, []);

  const updated = allRecs.map((r) => {
    if (r.id === recId) {
      return {
        ...r,
        status: newStatus,
        completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
      };
    }
    return r;
  });

  setLocalItem(STORAGE_RECS, updated);

  if (isRealFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'recommendations', recId), {
        status: newStatus,
        completedAt: newStatus === 'done' ? new Date().toISOString() : null,
      });
    } catch (e) {
      console.warn('Firestore toggle recommendation failed:', e);
    }
  }

  notifyRecSubscribers(farmId);
}

/**
 * 7. Save a new Crop Diagnostic
 */
export async function saveCropDiagnostic(
  farmId: string,
  diag: Omit<CropDiagnostic, 'id'>
): Promise<string> {
  const newId = `diag-${Date.now()}`;
  const newDiag: CropDiagnostic = {
    ...diag,
    id: newId,
  };

  const allDiags = getLocalItem<CropDiagnostic[]>(STORAGE_DIAGS, []);
  setLocalItem(STORAGE_DIAGS, [newDiag, ...allDiags]);

  if (isRealFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'diagnostics', newId), newDiag);
    } catch (e) {
      console.warn('Firestore save diagnostic failed:', e);
    }
  }

  notifyDiagSubscribers(farmId);
  return newId;
}

/**
 * 8. Create a new Farm
 */
export async function createFarm(userId: string, farmData: Partial<Farm>): Promise<string> {
  const newId = `farm-${Date.now()}`;
  const newFarm: Farm = {
    id: newId,
    farmerId: userId,
    farmName: farmData.farmName || 'Green Valley Farm',
    location: farmData.location || 'Madhya Pradesh, India',
    lat: farmData.lat || 22.9734,
    lng: farmData.lng || 78.6569,
    farmSize: farmData.farmSize || '10 Hectares',
    cropType: farmData.cropType || 'Soybeans',
    fieldHealthIndex: farmData.fieldHealthIndex || 72,
    soilMoisture: farmData.soilMoisture || 28,
    organicMatter: farmData.organicMatter || 2.35,
    nitrogenLevel: farmData.nitrogenLevel || 28,
    soilPh: farmData.soilPh || 6.6,
    phosphorus: farmData.phosphorus || 22,
    potassium: farmData.potassium || 170,
    predictedYield: farmData.predictedYield || '4.2 T/ha',
    lastUpdated: 'Just now',
    createdAt: new Date().toISOString(),
  };

  const allFarms = getLocalItem<Farm[]>(STORAGE_FARMS, []);
  setLocalItem(STORAGE_FARMS, [newFarm, ...allFarms]);

  // Seed default history & recommendations for the new farm
  const history = generateInitialHistory(newId);
  const allHistory = getLocalItem<FieldHealthHistory[]>(STORAGE_HISTORY, []);
  setLocalItem(STORAGE_HISTORY, [...history, ...allHistory]);

  const recs = generateInitialRecommendations(newId, userId);
  const allRecs = getLocalItem<AiRecommendation[]>(STORAGE_RECS, []);
  setLocalItem(STORAGE_RECS, [...recs, ...allRecs]);

  if (isRealFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'farms', newId), newFarm);
    } catch (e) {
      console.warn('Firestore create farm failed:', e);
    }
  }

  notifyFarmSubscribers(userId);
  return newId;
}
