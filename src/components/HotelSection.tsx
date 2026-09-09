import React from 'react';
import { 
  Building2, 
  Star, 
  MapPin, 
  Wifi, 
  CheckCircle2, 
  ShieldCheck, 
  IndianRupee, 
  Sparkles,
  Award
} from 'lucide-react';
import { Hotel } from '../types';
import { GoogleMapsButton, GoogleDirectionsButton } from '../services/googleMaps';

interface HotelSectionProps {
  hotels: Hotel[];
  selectedHotelId: string;
  onSelectHotel: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const HotelSection: React.FC<HotelSectionProps> = ({
  hotels,
  selectedHotelId,
  onSelectHotel,
  onBookHotel
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-blue-200/60">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart Accommodation Engine</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Curated Hotel Recommendations
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ranked by AI match percentage based on safety, proximity to attractions, and your budget tier.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {hotels.length} verified options in destination
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotels.map((hotel) => {
          const isSelected = hotel.id === selectedHotelId;

          return (
            <div
              key={hotel.id}
              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Hotel Header with Match Badge */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    hotel.tier === 'Budget'
                      ? 'bg-emerald-100 text-emerald-800'
                      : hotel.tier === 'Comfort'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {hotel.tier} Tier
                  </span>

                  {/* AI Match Percentage */}
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                    <Sparkles className="w-3 h-3" />
                    {hotel.matchScore}% Match
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {hotel.name}
                </h4>

                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1 text-slate-800">{hotel.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">({hotel.reviewsCount})</span>
                  </div>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {hotel.proximity}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400"> / night</span>
                  </div>

                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Safe
                  </span>
                </div>

                {/* Amenities Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {hotel.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-3 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectHotel(hotel)}
                    className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    {isSelected ? 'Selected in Trip' : 'Select Hotel'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookHotel(hotel)}
                    className="text-xs font-bold py-2.5 px-3 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                    title="Reserve without upfront fee"
                  >
                    Book Direct
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500 truncate" title={hotel.address}>
                    {hotel.address}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <GoogleMapsButton place={hotel} label="Maps" />
                    <GoogleDirectionsButton place={hotel} label="Directions" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
