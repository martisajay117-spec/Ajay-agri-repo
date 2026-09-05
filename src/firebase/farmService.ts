import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from './config';
import {
  Farm,
  FieldHealthHistory,
  AiRecommendation,
  CropDiagnostic,
} from '../types/farm';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Real-time subscription to farmer's farms
 */
export function subscribeFarms(
  farmerId: string,
  onData: (farms: Farm[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'farms';
  const q = query(collection(db, path), where('farmerId', '==', farmerId));

  return onSnapshot(
    q,
    (snapshot) => {
      const farms: Farm[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          farmerId: data.farmerId || farmerId,
          farmName: data.farmName || 'Primary Field',
          location: data.location || 'Central Valley',
          lat: data.lat,
          lng: data.lng,
          farmSize: data.farmSize || '12 Hectares',
          cropType: data.cropType || 'Soybeans & Maize',
          fieldHealthIndex: typeof data.fieldHealthIndex === 'number' ? data.fieldHealthIndex : 78,
          soilMoisture: typeof data.soilMoisture === 'number' ? data.soilMoisture : 28,
          organicMatter: typeof data.organicMatter === 'number' ? data.organicMatter : 2.45,
          nitrogenLevel: typeof data.nitrogenLevel === 'number' ? data.nitrogenLevel : 32,
          soilPh: typeof data.soilPh === 'number' ? data.soilPh : 6.8,
          phosphorus: typeof data.phosphorus === 'number' ? data.phosphorus : 24,
          potassium: typeof data.potassium === 'number' ? data.potassium : 185,
          predictedYield: data.predictedYield || '4.8 T/ha',
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });
      onData(farms);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Real-time subscription to NDVI Historical Trend data
 */
export function subscribeFieldHealthHistory(
  farmId: string,
  onData: (history: FieldHealthHistory[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `farms/${farmId}/fieldHealthHistory`;
  const q = query(collection(db, path), orderBy('date', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const history: FieldHealthHistory[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          farmId,
          date: data.date,
          ndvi: typeof data.ndvi === 'number' ? data.ndvi : 0.75,
          healthScore: typeof data.healthScore === 'number' ? data.healthScore : 75,
          satelliteSource: data.satelliteSource || 'Sentinel-2 L2A',
          notes: data.notes || '',
        };
      });
      onData(history);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Real-time subscription to AI Recommendations
 */
export function subscribeAiRecommendations(
  farmId: string,
  onData: (recs: AiRecommendation[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `farms/${farmId}/aiRecommendations`;
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const recs: AiRecommendation[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          farmId,
          farmerId: data.farmerId,
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'irrigation',
          status: data.status || 'pending',
          impact: data.impact || 'High Potential',
          actionDue: data.actionDue,
          createdAt: data.createdAt || new Date().toISOString(),
          completedAt: data.completedAt,
        };
      });
      onData(recs);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Real-time subscription to Crop Diagnostics
 */
export function subscribeCropDiagnostics(
  farmId: string,
  onData: (diags: CropDiagnostic[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `farms/${farmId}/cropDiagnostics`;
  const q = query(collection(db, path), orderBy('uploadedAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const diags: CropDiagnostic[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          farmId,
          farmerId: data.farmerId,
          imageURL: data.imageURL || '',
          diagnosisResult: data.diagnosisResult || 'Healthy Foliage',
          confidenceScore: typeof data.confidenceScore === 'number' ? data.confidenceScore : 95,
          severity: data.severity || 'low',
          symptoms: data.symptoms || 'Optimal chlorophyll coloration',
          treatmentRecommendation: data.treatmentRecommendation || 'Maintain standard drip irrigation protocol.',
          preventativeMeasures: data.preventativeMeasures,
          uploadedAt: data.uploadedAt || new Date().toISOString(),
        };
      });
      onData(diags);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Toggle recommendation status (pending <-> done)
 */
export async function toggleRecommendationStatus(
  farmId: string,
  recId: string,
  currentStatus: 'pending' | 'done'
): Promise<void> {
  const path = `farms/${farmId}/aiRecommendations/${recId}`;
  try {
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    await updateDoc(doc(db, 'farms', farmId, 'aiRecommendations', recId), {
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : null,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Add a new AI recommendation
 */
export async function addRecommendation(
  farmId: string,
  recommendation: Omit<AiRecommendation, 'id'>
): Promise<string> {
  const path = `farms/${farmId}/aiRecommendations`;
  try {
    const docRef = await addDoc(collection(db, 'farms', farmId, 'aiRecommendations'), {
      ...recommendation,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

/**
 * Save crop diagnosis result to Firestore
 */
export async function saveCropDiagnostic(
  farmId: string,
  diagnostic: Omit<CropDiagnostic, 'id'>
): Promise<string> {
  const path = `farms/${farmId}/cropDiagnostics`;
  try {
    const docRef = await addDoc(collection(db, 'farms', farmId, 'cropDiagnostics'), {
      ...diagnostic,
      uploadedAt: diagnostic.uploadedAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

/**
 * Create a new farm
 */
export async function createFarm(farmerId: string, farmData: Partial<Farm>): Promise<string> {
  const path = 'farms';
  try {
    const newFarm: Omit<Farm, 'id'> = {
      farmerId,
      farmName: farmData.farmName || 'Green Valley Plot',
      location: farmData.location || 'Paranaguá, Brazil',
      lat: farmData.lat || -25.5163,
      lng: farmData.lng || -48.5225,
      farmSize: farmData.farmSize || '15 Hectares',
      cropType: farmData.cropType || 'Soybeans & Maize',
      fieldHealthIndex: farmData.fieldHealthIndex || 78,
      soilMoisture: farmData.soilMoisture || 28,
      organicMatter: farmData.organicMatter || 2.45,
      nitrogenLevel: farmData.nitrogenLevel || 32,
      soilPh: farmData.soilPh || 6.8,
      phosphorus: farmData.phosphorus || 24,
      potassium: farmData.potassium || 185,
      predictedYield: farmData.predictedYield || '4.8 T/ha',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'farms'), newFarm);
    const farmId = docRef.id;

    // Seed initial history, recommendations, and sample diagnostics for this new farm
    await seedSubcollectionsForFarm(farmId, farmerId, newFarm.location);

    return farmId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

/**
 * Helper to seed rich subcollections for a farm
 */
async function seedSubcollectionsForFarm(farmId: string, farmerId: string, location: string) {
  // 1. Seed NDVI history (last 30 days)
  const now = new Date();
  const historyItems: Omit<FieldHealthHistory, 'id'>[] = [];
  
  // Create 12 points spanning the last 35 days
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 3 * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    // Realistic curve oscillating around 0.68 - 0.84 NDVI
    const baseNdvi = 0.70 + Math.sin((12 - i) * 0.4) * 0.08 + (Math.random() * 0.04 - 0.02);
    const ndvi = Number(Math.max(0.55, Math.min(0.92, baseNdvi)).toFixed(2));
    const healthScore = Math.round(ndvi * 100);

    historyItems.push({
      farmId,
      date: dateStr,
      ndvi,
      healthScore,
      satelliteSource: 'Sentinel-2 MSI Level-2A',
      notes: i === 0 ? 'Latest multispectral composite' : 'Cloud cover < 5%',
    });
  }

  for (const item of historyItems) {
    await addDoc(collection(db, 'farms', farmId, 'fieldHealthHistory'), item);
  }

  // 2. Seed initial AI advisories
  const initialRecs: Omit<AiRecommendation, 'id'>[] = [
    {
      farmId,
      farmerId,
      title: 'Organic Compost Enrichment Protocol',
      description:
        'Apply organic vermicompost in 7 days across Sector B. Current soil organic matter is 2.45%, target is 3.0% for BRICS carbon credit qualification.',
      type: 'compost',
      status: 'pending',
      impact: '+12% Soil Microbiome Activity',
      actionDue: 'In 7 days',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      farmId,
      farmerId,
      title: 'Micro-Drip Irrigation Scheduler',
      description:
        'Localized weather models indicate 31°C peak temperature in 3 days. Recommend 45-minute root hydration at 05:30 AM to conserve 35% water.',
      type: 'irrigation',
      status: 'pending',
      impact: 'Conserve 35% Irrigation Water',
      actionDue: 'In 3 days',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      farmId,
      farmerId,
      title: 'Legume Crop Rotation Advisory',
      description:
        'Schedule winter pigeon pea or chickpea rotation to naturally replenish 28 kg/ha nitrogen without synthetic fertilizer.',
      type: 'rotation',
      status: 'pending',
      impact: '+28 kg/ha Bio Nitrogen',
      actionDue: 'Next Season',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      farmId,
      farmerId,
      title: 'Potassium Bio-Fertilizer Applied',
      description: 'Sector A foliar potassium application completed successfully.',
      type: 'fertilizer',
      status: 'done',
      impact: 'Stronger stalk resistance',
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const rec of initialRecs) {
    await addDoc(collection(db, 'farms', farmId, 'aiRecommendations'), rec);
  }

  // 3. Seed initial Diagnostic Sample
  const initialDiag: Omit<CropDiagnostic, 'id'> = {
    farmId,
    farmerId,
    imageURL: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    diagnosisResult: 'Early Blight (Alternaria solani) - Low Severity',
    confidenceScore: 94,
    severity: 'low',
    symptoms: 'Concentric dark target-pattern rings on lower foliage margins.',
    treatmentRecommendation:
      'Apply organic Copper-based fungicide spray (Bordeaux mixture 1%) during early morning. Prune affected bottom leaves.',
    preventativeMeasures: 'Ensure drip lines avoid foliage splashing; maintain 45cm canopy aeration.',
    uploadedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
  };

  await addDoc(collection(db, 'farms', farmId, 'cropDiagnostics'), initialDiag);
}

/**
 * Seed initial farmer data if the farmer has 0 farms
 */
export async function seedInitialFarmerData(
  farmerId: string,
  country: string = 'India',
  fullName: string = 'Farmer Partner'
): Promise<Farm | null> {
  // Check if farms already exist
  const q = query(collection(db, 'farms'), where('farmerId', '==', farmerId));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const firstDoc = snap.docs[0];
    return { id: firstDoc.id, ...firstDoc.data() } as Farm;
  }

  // Country defaults
  const countryLocations: Record<string, { name: string; loc: string; lat: number; lng: number; crop: string }> = {
    India: { name: 'Punjab Agro Field #1', loc: 'Ludhiana, Punjab', lat: 30.9010, lng: 75.8573, crop: 'Wheat & Mustard' },
    Brazil: { name: 'Mato Grosso Sector 4', loc: 'Cuiabá, Mato Grosso', lat: -15.6014, lng: -56.0979, crop: 'Soybeans & Maize' },
    Russia: { name: 'Krasnodar Black Earth Farm', loc: 'Krasnodar Krai', lat: 45.0393, lng: 38.9872, crop: 'Winter Wheat & Barley' },
    China: { name: 'Heilongjiang Agri Plot', loc: 'Harbin, Heilongjiang', lat: 45.8038, lng: 126.5350, crop: 'Soybeans & Corn' },
    'South Africa': { name: 'Free State Grain Hub', loc: 'Bloemfontein, Free State', lat: -29.0852, lng: 26.1596, crop: 'Maize & Sunflower' },
  };

  const selected = countryLocations[country] || countryLocations['India'];

  const farmId = await createFarm(farmerId, {
    farmName: selected.name,
    location: selected.loc,
    lat: selected.lat,
    lng: selected.lng,
    farmSize: '15 Hectares (Medium Farm)',
    cropType: selected.crop,
    fieldHealthIndex: 78,
    soilMoisture: 28,
    organicMatter: 2.45,
    nitrogenLevel: 32,
    soilPh: 6.8,
    phosphorus: 24,
    potassium: 185,
    predictedYield: '4.8 T/ha',
  });

  const createdDoc = await getDoc(doc(db, 'farms', farmId));
  if (createdDoc.exists()) {
    return { id: createdDoc.id, ...createdDoc.data() } as Farm;
  }
  return null;
}
