import React, { useEffect, useState } from 'react';
import { Sparkles, MapPin, ShieldCheck, Leaf, Coins, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  destination: string;
}

const STEPS = [
  { label: 'Analyzing user interests, duration & travel archetype...', icon: Sparkles },
  { label: 'Computing multi-objective ranking (0.30 Interest + 0.20 Budget + 0.15 Distance)...', icon: Coins },
  { label: 'Verifying local safety scores, emergency hospital proximity & route advisories...', icon: ShieldCheck },
  { label: 'Calculating eco-footprint and carbon savings with public transit models...', icon: Leaf },
  { label: 'Synthesizing day-wise itinerary & local business discovery recommendations...', icon: MapPin }
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ destination }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 max-w-xl mx-auto text-center my-8">
      {/* Animated Glowing Compass Icon */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
        AI is creating your personalized journey...
      </h3>
      <p className="text-sm text-slate-600 mt-2">
        Building custom route for <span className="font-bold text-emerald-700">{destination}</span>
      </p>

      {/* Progress Steps */}
      <div className="mt-8 space-y-3 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          const Icon = step.icon;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold'
                  : isDone
                  ? 'bg-slate-50 text-slate-600 font-medium'
                  : 'opacity-40 text-slate-400'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Icon className={`w-5 h-5 ${isCurrent ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                )}
              </div>
              <p className="text-xs leading-tight">{step.label}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all duration-500 rounded-full"
          style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
        ></div>
      </div>
      <p className="text-[11px] text-slate-400 mt-2">
        Powered by TravelMate AI Multi-Objective Optimization Engine
      </p>
    </div>
  );
};
