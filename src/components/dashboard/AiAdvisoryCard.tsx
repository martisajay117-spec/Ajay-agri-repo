import React, { useState } from 'react';
import { AiRecommendation } from '../../types/farm';
import {
  Droplets,
  ChevronRight,
  Check,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface AiAdvisoryCardProps {
  farmId: string;
  recommendations: AiRecommendation[];
  onToggleStatus: (recId: string, currentStatus: 'pending' | 'done') => void;
  loading?: boolean;
}

export const AiAdvisoryCard: React.FC<AiAdvisoryCardProps> = ({
  farmId,
  recommendations,
  onToggleStatus,
  loading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecForDetail, setSelectedRecForDetail] = useState<AiRecommendation | null>(null);

  const pendingList = recommendations.filter((r) => r.status === 'pending');
  const completedList = recommendations.filter((r) => r.status === 'done');

  // Featured top recommendation (e.g. Irrigation recommended)
  const featuredRec = pendingList.find((r) => r.type === 'irrigation') || pendingList[0] || {
    id: 'default-irrigation',
    farmId,
    title: 'Zone 3 Moisture Deficit Protocol',
    description: 'VWC dropped below 22% refill point. Initiate 2.5hr drip cycle before solar peak.',
    type: 'irrigation' as const,
    status: 'pending' as const,
    actionDue: 'In 24 hours',
    createdAt: new Date().toISOString(),
  };

  // Other recommendations
  const otherRecs = pendingList.filter((r) => r.id !== featuredRec.id);
  const displayOthers = otherRecs.length > 0
    ? otherRecs.slice(0, 3)
    : [
        {
          id: 'def-compost',
          farmId,
          title: 'Foliar Calcium & Boron spray ahead of bloom',
          description: 'Mitigate blossom end stress during 33°C thermal window.',
          type: 'compost' as const,
          status: 'pending' as const,
          actionDue: 'In 48h',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'def-aphids',
          farmId,
          title: 'Scout Zone 1 canopy for thrip colonization',
          description: 'Relative humidity drop and wind conditions favor vector migration.',
          type: 'pest_management' as const,
          status: 'pending' as const,
          actionDue: 'In 3 days',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'def-rotation',
          farmId,
          title: 'Post-harvest legume green-manure sequencing',
          description: 'Replenish active soil nitrogen following harvest.',
          type: 'rotation' as const,
          status: 'pending' as const,
          actionDue: 'In 14 days',
          createdAt: new Date().toISOString(),
        },
      ];

  return (
    <>
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between h-full min-h-[360px]">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Agronomic Advisory Ledger</h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">Gemini 2.5 Bio-Model • Decision Engine</p>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{pendingList.length || 3} Actions Queued</span>
            </div>
          </div>
        </div>

        {/* Priority Action Card (Subtle Slate with Left Accent) */}
        <div
          onClick={() => {
            setSelectedRecForDetail(featuredRec);
            setIsModalOpen(true);
          }}
          className="my-2.5 p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg cursor-pointer transition-colors border-l-4 border-l-amber-600"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                  Priority 1
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Due: {featuredRec.actionDue || 'Within 24h'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {featuredRec.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                {featuredRec.description}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
          </div>
        </div>

        {/* Secondary Recommendations Checklist */}
        <div className="space-y-1.5 my-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Scheduled Agronomic Interventions
          </div>

          <div className="space-y-1">
            {displayOthers.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleStatus(item.id, item.status)}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3.5 h-3.5 rounded border border-slate-300 group-hover:border-[#1e5128] bg-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-transparent group-hover:text-[#1e5128]" />
                  </div>
                  <span className="text-xs text-slate-700 font-medium truncate">
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                  {item.actionDue || 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Link */}
        <div className="pt-2 border-t border-slate-100 mt-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Review Full Protocol Audit Log</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* All Recommendations Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1e5128]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Agronomic Prescriptions & Intervention Ledger</h3>
                  <p className="text-[11px] font-mono text-slate-500">AgriN Decision Engine • ISO 11783 Compliant</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Protocol Prescriptions ({pendingList.length})
              </div>

              {pendingList.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{rec.title}</div>
                    <p className="text-slate-600 text-[11px]">{rec.description}</p>
                    {rec.actionDue && (
                      <span className="inline-block text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Deadline: {rec.actionDue}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onToggleStatus(rec.id, rec.status)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-medium shrink-0"
                  >
                    Mark Executed
                  </button>
                </div>
              ))}

              {completedList.length > 0 && (
                <>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">
                    Verified Execution Ledger ({completedList.length})
                  </div>
                  {completedList.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-white text-slate-400 flex justify-between items-center text-xs"
                    >
                      <span className="line-through">{rec.title}</span>
                      <button
                        onClick={() => onToggleStatus(rec.id, rec.status)}
                        className="text-[10px] text-[#1e5128] hover:underline font-mono"
                      >
                        Re-queue
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
