import React from 'react';
import { Sparkles, HeartHandshake, Clock, IndianRupee, Users, CheckCircle2 } from 'lucide-react';
import { LocalExperience } from '../types';
import { GoogleMapsButton } from '../services/googleMaps';

interface LocalExperiencesSectionProps {
  experiences: LocalExperience[];
  onBookExperience: (experience: LocalExperience) => void;
}

export const LocalExperiencesSection: React.FC<LocalExperiencesSectionProps> = ({
  experiences,
  onBookExperience
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-indigo-200/60">
            <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
            <span>Community Tourism & Heritage Support</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Immersion & Grassroots Experiences
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connect directly with verified local guides, GI-tagged artisans, and heritage storytellers.
          </p>
        </div>

        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          100% Direct Local Income Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200/60 px-2 py-0.5 rounded">
                  {exp.category}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {exp.durationHours} hrs
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {exp.title}
              </h4>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {exp.description}
              </p>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Host & Community Impact</p>
                <p className="font-semibold text-slate-800 mt-0.5">{exp.providerName}</p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">🌱 {exp.communityImpact}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Per Person</span>
                <p className="text-base font-extrabold text-slate-900">
                  ₹{exp.price.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <GoogleMapsButton place={exp} label="Maps" />
                <button
                  type="button"
                  onClick={() => onBookExperience(exp)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  <span>Reserve Slot</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
