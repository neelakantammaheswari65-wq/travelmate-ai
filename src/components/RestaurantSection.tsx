import React from 'react';
import { Utensils, Star, MapPin, Sparkles, IndianRupee, Heart } from 'lucide-react';
import { Restaurant } from '../types';
import { GoogleMapsButton, GoogleDirectionsButton } from '../services/googleMaps';

interface RestaurantSectionProps {
  restaurants: Restaurant[];
}

export const RestaurantSection: React.FC<RestaurantSectionProps> = ({ restaurants }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-orange-200/60">
            <Utensils className="w-3.5 h-3.5 text-orange-600" />
            <span>Culinary Discovery Engine</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Local Gastronomy & Dining Highlights
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AI-curated regional eateries celebrated for hygienic authentic recipes and community reputation.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {restaurants.length} signature dining spots
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-800 border border-orange-200/60 px-2 py-0.5 rounded">
                  {restaurant.cuisine}
                </span>

                <div className="flex items-center text-amber-500 font-extrabold text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 text-slate-800">{restaurant.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-0.5">({restaurant.reviewsCount})</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {restaurant.name}
              </h4>

              <div className="mt-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs">
                <p className="text-slate-500 font-medium text-[11px] uppercase tracking-wider">Must-Try Specialty</p>
                <p className="font-bold text-orange-950 mt-0.5">{restaurant.speciality}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{restaurant.distance || restaurant.destination}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Average for Two</span>
                  <p className="text-sm font-extrabold text-slate-900">
                    ₹{restaurant.averageCostForTwo.toLocaleString('en-IN')}
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Verified Hygienic
                </span>
              </div>

              {/* Maps and Directions Action Row */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <GoogleMapsButton place={restaurant} label="Maps" />
                <GoogleDirectionsButton place={restaurant} label="Directions" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
