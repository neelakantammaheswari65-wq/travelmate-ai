import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Users, 
  Sparkles,
  Plus
} from 'lucide-react';
import { GeneratedTripPlan } from '../types';
import { GoogleMapsButton } from '../services/googleMaps';

interface SavedTripsProps {
  savedTrips: GeneratedTripPlan[];
  onSelectTrip: (trip: GeneratedTripPlan) => void;
  onDeleteTrip: (tripId: string) => void;
  onPlanNewTrip: () => void;
}

export const SavedTrips: React.FC<SavedTripsProps> = ({
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
  onPlanNewTrip
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-emerald-200/60">
            <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>Saved Itineraries</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            My Planned Trips ({savedTrips.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your personalized generated travel plans securely saved to local storage for offline access.
          </p>
        </div>

        <button
          onClick={onPlanNewTrip}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Another Trip</span>
        </button>
      </div>

      {savedTrips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Saved Trips Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Generate an AI itinerary for Vijayawada or any destination and click "Save Trip" to keep it here.
          </p>
          <button
            onClick={onPlanNewTrip}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                    {trip.input?.travelStyle || 'Budget'} Style
                  </span>

                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                    title="Remove from saved trips"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {trip.destinationName}
                </h3>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {trip.input?.days || 2} Days
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {trip.input?.travellers || 2} Travellers
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    ₹{trip.budget?.total?.toLocaleString('en-IN') || '5,000'}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(trip.input?.interests || []).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(trip.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <GoogleMapsButton place={{ name: trip.destinationName }} label="Maps" />
                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg transition"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
