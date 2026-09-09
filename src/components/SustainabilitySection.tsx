import React, { useState } from 'react';
import { Leaf, Trees, Wind, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SustainabilityMetrics } from '../types';

interface SustainabilitySectionProps {
  sustainability: SustainabilityMetrics;
  days: number;
  travellers: number;
}

export const SustainabilitySection: React.FC<SustainabilitySectionProps> = ({
  sustainability,
  days,
  travellers
}) => {
  const [transitMode, setTransitMode] = useState<'public' | 'cab'>('public');

  const baselineCabEmissions = (days * travellers * 18.5).toFixed(1);
  const publicTransitEmissions = (days * travellers * 4.3).toFixed(1);
  const carbonDelta = (Number(baselineCabEmissions) - Number(publicTransitEmissions)).toFixed(1);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-teal-200/60">
            <Leaf className="w-3.5 h-3.5 text-teal-600" />
            <span>Green Tourism Protocol</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Sustainability Index & Carbon Metrics
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Measure ecological conservation, waste reduction, and carbon offset on your itinerary.
          </p>
        </div>

        <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Aligned with Ministry of Tourism Sustainable Travel Mission
        </span>
      </div>

      {/* Main Score & Carbon Saved Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-teal-900 to-emerald-950 text-white p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-teal-300">
              Trip Eco-Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black tracking-tight text-white">
                {sustainability.sustainabilityScore}
              </span>
              <span className="text-base text-teal-300 font-semibold">/ 100</span>
            </div>
            <p className="text-xs text-teal-100/90 mt-2 leading-relaxed">
              Exemplary sustainability rating. Your selected activities prioritize cultural conservation, zero single-use plastic corridors, and community-led trails.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-teal-800/80 flex items-center gap-2 text-xs text-teal-200">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Eligible for Green Traveler Digital Certificate</span>
          </div>
        </div>

        {/* Carbon Offset Card */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
              Estimated Carbon Footprint Savings
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-emerald-950 tracking-tight">
                {sustainability.carbonSavedKg}
              </span>
              <span className="text-lg font-bold text-emerald-700">kg CO₂ saved</span>
            </div>
            <p className="text-xs text-emerald-800 mt-2 leading-relaxed font-medium">
              Achieved primarily by choosing clean public transit (RTC electric buses, metro, shared e-rickshaws) and walkable heritage links.
            </p>
          </div>

          {/* Interactive Carbon Mode Comparison Toggle */}
          <div className="mt-6 pt-4 border-t border-emerald-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Transit Mode Impact Comparison:</span>
              <span className="text-emerald-700">-{carbonDelta} kg CO₂ saved</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTransitMode('public')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  transitMode === 'public'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Electric Public Transit ({publicTransitEmissions} kg)
              </button>
              <button
                type="button"
                onClick={() => setTransitMode('cab')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  transitMode === 'cab'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Private Solo Cab ({baselineCabEmissions} kg)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Eco-Practices List */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <Trees className="w-4 h-4 text-emerald-600" />
          Eco-Friendly Travel Recommendations for Tourists
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sustainability.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
