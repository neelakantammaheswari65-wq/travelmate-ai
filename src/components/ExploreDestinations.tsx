import React from 'react';
import { MapPin, ArrowRight, ShieldCheck, Sparkles, Building2, Utensils, ExternalLink } from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { GoogleMapsButton, getGoogleMapsUrl } from '../services/googleMaps';

interface ExploreDestinationsProps {
  onSelectCityToPlan: (city: string) => void;
}

export const ExploreDestinations: React.FC<ExploreDestinationsProps> = ({
  onSelectCityToPlan
}) => {
  const cityKeys = Object.keys(DESTINATIONS_DATA);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-emerald-200/60">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated Tourism Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Explore Featured Indian Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover destinations pre-loaded with comprehensive cultural landmarks, safety grids, and verified hospitality data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cityKeys.map((cityName) => {
          const data = DESTINATIONS_DATA[cityName];
          if (!data) return null;
          const lowestHotelPrice = data.hotels && data.hotels.length > 0 
            ? Math.min(...data.hotels.map((h) => h.pricePerNight)) 
            : 1200;

          return (
            <div
              key={cityName}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {data.state}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-emerald-700 transition">
                      {data.name}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {data.safety.overallSafetyScore}/100
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-2">
                  {data.description}
                </p>

                {/* Key Metrics */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center py-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Attractions</p>
                    <p className="text-sm font-extrabold text-slate-900">{data.attractions.length}+</p>
                  </div>
                  <div className="border-x border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Hotels from</p>
                    <p className="text-sm font-extrabold text-slate-900">₹{lowestHotelPrice}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Best Time</p>
                    <p className="text-[11px] font-bold text-slate-800 truncate px-1">{(data.bestTimeToVisit || 'Oct - Mar').slice(0, 9)}</p>
                  </div>
                </div>

                {/* Tags with direct Maps links */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {(data.attractions || []).slice(0, 3).map((a, i) => (
                    <a
                      key={i}
                      href={getGoogleMapsUrl({ name: a.name, destination: data.name })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-medium bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-2 py-0.5 rounded transition inline-flex items-center gap-1"
                      title={`Open ${a.name} in Google Maps`}
                    >
                      <span>{a.name}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Ready to explore?</span>
                <div className="flex items-center gap-2">
                  <GoogleMapsButton place={{ name: `${data.name}, ${data.state}` }} label="Maps" />
                  <button
                    type="button"
                    onClick={() => onSelectCityToPlan(cityName)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <span>Plan Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
