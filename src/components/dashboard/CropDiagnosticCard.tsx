import React, { useState, useRef } from 'react';
import { CropDiagnostic } from '../../types/farm';
import { fileToDataUrl, diagnoseCropLeaf } from '../../services/cropAiService';
import {
  UploadCloud,
  ArrowRight,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  ShieldCheck,
  Camera,
} from 'lucide-react';

interface CropDiagnosticCardProps {
  farmId: string;
  diagnostics: CropDiagnostic[];
  onSaveDiagnosis: (diag: Omit<CropDiagnostic, 'id'>) => Promise<void>;
  loading?: boolean;
}

// Preset verified agricultural field disease samples
const FIELD_SAMPLES = [
  {
    name: 'Sample 1: Early Blight',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Early Blight (Alternaria solani)',
    confidence: 89,
    severity: 'moderate' as const,
    symptoms: 'Concentric necrotic rings with chlorotic yellow halo on lower foliar canopy.',
    treatment: 'Apply Copper Hydroxide (2.5g/L) or Bacillus subtilis bio-fungicide within 48h.',
    prevention: 'Maintain drip irrigation; avoid overhead canopy wetting.',
  },
  {
    name: 'Sample 2: Septoria Spot',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Septoria Foliar Spot',
    confidence: 93,
    severity: 'mild' as const,
    symptoms: 'Circular water-soaked spots with dark brown margins developing on vegetative leaf margins.',
    treatment: 'Foliar application of Azoxystrobin + Difenoconazole at standard agronomic rate.',
    prevention: 'Enhance row spacing to increase ventilation and reduce microclimate humidity.',
  },
  {
    name: 'Sample 3: Nitrogen Chlorosis',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Foliar Nitrogen Chlorosis',
    confidence: 96,
    severity: 'mild' as const,
    symptoms: 'Uniform general pale-yellow chlorosis progressing from older leaves upward.',
    treatment: 'Apply 1.5% Urea or calcium nitrate foliar spray during early morning window.',
    prevention: 'Adjust side-dress nitrogen fertigation based on weekly soil sensor EC readings.',
  },
];

export const CropDiagnosticCard: React.FC<CropDiagnosticCardProps> = ({
  farmId,
  diagnostics,
  onSaveDiagnosis,
  loading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isTreatmentOpen, setIsTreatmentOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active diagnostic specimen
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  const currentSample = FIELD_SAMPLES[activeSampleIdx];

  const latestDiag: CropDiagnostic = diagnostics[0] || {
    id: 'default-scan',
    farmId,
    imageURL: currentSample.imageUrl,
    diagnosisResult: currentSample.diagnosis,
    confidenceScore: currentSample.confidence,
    severity: currentSample.severity,
    symptoms: currentSample.symptoms,
    treatmentRecommendation: currentSample.treatment,
    preventativeMeasures: currentSample.prevention,
    uploadedAt: new Date().toISOString(),
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit.');
      return;
    }

    setErrorMessage(null);
    setAnalyzing(true);

    try {
      const dataUrl = await fileToDataUrl(file);
      const result = await diagnoseCropLeaf(dataUrl);

      await onSaveDiagnosis({
        farmId,
        imageURL: dataUrl,
        diagnosisResult: result.diagnosisResult,
        confidenceScore: result.confidenceScore,
        severity: result.severity,
        symptoms: result.symptoms,
        treatmentRecommendation: result.treatmentRecommendation,
        preventativeMeasures: result.preventativeMeasures,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error analyzing leaf image:', err);
      setErrorMessage(err?.message || 'Failed to analyze leaf image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between h-full min-h-[360px]">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Foliar Disease Diagnostic</h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">Computer Vision Pathology • EPPO ALTESO</p>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Pathogen Identified</span>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Sample Switcher Tabs */}
        <div className="flex items-center gap-1 my-1.5 bg-slate-50 p-1 rounded border border-slate-200 text-[10px] font-mono">
          <span className="text-slate-400 px-1">Specimens:</span>
          {FIELD_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSampleIdx(idx)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeSampleIdx === idx
                  ? 'bg-slate-800 text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {idx === 0 ? 'Blight' : idx === 1 ? 'Septoria' : 'Chlorosis'}
            </button>
          ))}
        </div>

        {/* Main Content Split: Left Image + Right Upload/Diagnosis */}
        <div className="grid grid-cols-2 gap-3 my-1">
          {/* Left: Authentic Crop Leaf Pathology Preview */}
          <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-200 h-36 flex items-center justify-center group">
            <img
              src={latestDiag.imageURL || currentSample.imageUrl}
              alt="Diagnosed crop leaf sample with foliar pathology"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Diagnostic target reticle overlay */}
            <div className="absolute inset-0 border border-amber-500/40 pointer-events-none m-2 rounded" />
            <div className="absolute bottom-1.5 left-1.5 bg-slate-950/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300">
              ROI: Lower Canopy
            </div>

            {analyzing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin mb-1" />
                <span className="text-[10px] font-mono font-medium">Classifying Lesions...</span>
              </div>
            )}
          </div>

          {/* Right: Upload Box + Diagnosis & Confidence */}
          <div className="flex flex-col justify-between space-y-1.5">
            {/* Upload New Image Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border border-dashed rounded-lg p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-slate-800 bg-slate-100'
                  : 'border-slate-300 hover:border-slate-500 bg-slate-50'
              } h-16`}
            >
              <UploadCloud className="w-4 h-4 text-slate-500 mb-0.5" />
              <div className="text-[11px] font-medium text-slate-800 leading-tight">
                Upload Leaf Photo
              </div>
              <div className="text-[9px] font-mono text-slate-400">JPG, PNG &lt; 5MB</div>
            </div>

            {/* Diagnosis & Confidence Section */}
            <div className="space-y-1 pt-0.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Diagnostic Result
              </div>
              <div className="px-2 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono font-bold truncate">
                {latestDiag.diagnosisResult || currentSample.diagnosis}
              </div>

              <div className="pt-0.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-0.5">
                  <span>Confidence:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {latestDiag.confidenceScore || currentSample.confidence}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                  <div
                    className="bg-[#1e5128] h-full transition-all duration-500"
                    style={{ width: `${latestDiag.confidenceScore || currentSample.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="text-[10px] font-mono text-red-600 bg-red-50 p-1.5 rounded border border-red-200 mt-1">
            {errorMessage}
          </div>
        )}

        {/* Bottom Link */}
        <div className="pt-2 border-t border-slate-100 mt-1">
          <button
            onClick={() => setIsTreatmentOpen(true)}
            className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Bio-Fungicide Treatment Protocol</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Treatment Solutions Modal */}
      {isTreatmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-slate-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Foliar Pathology & Treatment Protocol</h3>
                  <p className="text-[11px] font-mono text-slate-500">Diagnosis: {latestDiag.diagnosisResult || currentSample.diagnosis}</p>
                </div>
              </div>
              <button
                onClick={() => setIsTreatmentOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="flex gap-3 items-center p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                  <img
                    src={latestDiag.imageURL || currentSample.imageUrl}
                    alt="Analyzed leaf specimen"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="font-mono">
                  <div className="font-bold text-amber-950">{latestDiag.diagnosisResult || currentSample.diagnosis}</div>
                  <div className="text-[10px] text-amber-800 mt-0.5">
                    Confidence: <strong>{latestDiag.confidenceScore || currentSample.confidence}%</strong> • Severity: <strong>{latestDiag.severity || 'Moderate'}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1e5128]" />
                    Prescribed Chemical & Biological Treatment
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {latestDiag.treatmentRecommendation || currentSample.treatment}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="font-bold text-slate-800 mb-1 text-xs">Observed Foliar Morphology</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {latestDiag.symptoms || currentSample.symptoms}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="font-bold text-slate-800 mb-1 text-xs">Preventative Cultural Controls</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {latestDiag.preventativeMeasures || currentSample.prevention}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsTreatmentOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
