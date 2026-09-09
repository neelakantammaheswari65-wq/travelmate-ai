import React, { useState } from 'react';
import { 
  Calendar, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  SlidersHorizontal,
  ChevronRight, 
  Info,
  Building2,
  Utensils,
  HeartHandshake,
  ShieldCheck,
  Leaf,
  MapPin,
  IndianRupee,
  Sparkles,
  Star,
  Clock,
  ExternalLink
} from 'lucide-react';
import { GeneratedTripPlan, ItinerarySlot } from '../types';
import { GoogleMapsButton } from '../services/googleMaps';

interface ItineraryViewProps {
  trip: GeneratedTripPlan;
  onSaveTrip: () => void;
  isSaved: boolean;
  onShareTrip: () => void;
  onCustomizeTrip: () => void;
  onSelectSlotDetail: (slot: ItinerarySlot) => void;
  onOpenSecondary: (section: 'hotels' | 'restaurants' | 'experiences' | 'safety' | 'sustainability' | 'map' | 'budget') => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onSaveTrip,
  isSaved,
  onShareTrip,
  onCustomizeTrip,
  onSelectSlotDetail,
  onOpenSecondary
}) => {
  const [activeDay, setActiveDay] = useState(1);

  const currentDayData = trip?.days?.find((d) => d.dayNumber === activeDay) || trip?.days?.[0] || {
    dayNumber: 1,
    title: 'Trip Circuit',
    theme: 'Exploration',
    slots: [],
    dayEstimatedCost: 0
  };

  return (
    <div className="space-y-8">
      {/* 1. Simplified Header: "YOUR PERSONALIZED TRIP" */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>YOUR PERSONALIZED TRIP</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {trip.dataFreshness || 'Information from curated tourism data'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
              {trip.destinationName} • {trip.input.days} {trip.input.days === 1 ? 'Day' : 'Days'} • {trip.input.travellers} {trip.input.travellers === 1 ? 'Traveller' : 'Travellers'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Optimized for {trip.input.travelStyle} travel style • {trip.input.transport} transit • {trip.input.interests.join(', ')}
            </p>
          </div>

          {/* Clean Top Action Buttons: [ Save Trip ], [ Share Trip ], [ Customize Trip ] */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="btn-save-trip"
              onClick={onSaveTrip}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border ${
                isSaved
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
              }`}
              title={isSaved ? 'Trip Saved Locally' : 'Save Itinerary to My Trips'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Saved' : 'Save Trip'}</span>
            </button>

            <button
              id="btn-share-trip"
              onClick={onShareTrip}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Share Trip</span>
            </button>

            <button
              id="btn-customize-trip"
              onClick={onCustomizeTrip}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition cursor-pointer"
              title="Return to planner to adjust inputs"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Customize Trip</span>
            </button>
          </div>
        </div>

        {/* 2. Compact Summary Row (4 metric cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6">
          {/* Estimated Budget Card */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              💰 Estimated Budget
            </span>
            <div className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
              ₹{(trip.budget?.total || 0).toLocaleString('en-IN')}{' '}
              <span className="text-xs font-semibold text-slate-400">
                / ₹{(trip.input?.budget || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 mt-1">
              {(trip.budget?.total || 0) <= (trip.input?.budget || 0) ? '✓ Within Budget' : 'Over Target'}
            </span>
          </div>

          {/* Safety Card */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              🛡️ Safety
            </span>
            <div className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
              {trip.safety.overallSafetyScore}
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 mt-1">
              Verified Tourist Grid
            </span>
          </div>

          {/* Sustainability Card */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              🌱 Sustainability
            </span>
            <div className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
              {trip.sustainability.sustainabilityScore}
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 mt-1">
              {trip.sustainability.carbonSavedKg} kg CO₂ saved
            </span>
          </div>

          {/* AI Match Card */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              ⭐ AI Match
            </span>
            <div className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
              {Math.round(trip.aiMatchScore || 94)}%
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 mt-1">
              Optimal Sequence
            </span>
          </div>
        </div>
      </div>

      {/* 3. Clean Day-Wise Vertical Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {/* Day Selector Navigation Pills */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(trip?.days || []).map((day) => {
              const isCurrent = day.dayNumber === activeDay;
              return (
                <button
                  key={day.dayNumber}
                  id={`day-tab-${day.dayNumber}`}
                  onClick={() => setActiveDay(day.dayNumber)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>DAY {day.dayNumber}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {(day.slots || []).length} stops
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Day Activities: <strong className="text-slate-900">₹{currentDayData.dayEstimatedCost.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Day Title */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Day {activeDay}: {currentDayData.title}
          </h3>
          <p className="text-xs text-emerald-700 font-medium mt-0.5">
            Theme: {currentDayData.theme}
          </p>
        </div>

        {/* Clean Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-200 space-y-8 ml-2 sm:ml-4 py-2">
          {(currentDayData.slots || []).map((slot, index) => {
            const isMeal = slot.isMeal;
            return (
              <div key={slot.id} className="relative group">
                {/* Timeline node */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                  isMeal ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>

                {/* Slot Item */}
                <div className="bg-slate-50/70 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 transition-all duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Time */}
                        <span className="text-xs font-extrabold text-emerald-800 tracking-wider">
                          {slot.time}
                        </span>
                        {/* Rating if present */}
                        {slot.rating && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{slot.rating}</span>
                          </span>
                        )}
                        {/* Opening hours if present */}
                        {slot.openingHours && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{slot.openingHours}</span>
                          </span>
                        )}
                        {/* Family friendly tag */}
                        {slot.familyFriendly && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Family Friendly
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">
                        {slot.activityTitle}
                      </h4>

                      {/* Subtitle / Category • Duration */}
                      <p className="text-xs text-slate-500 mt-1">
                        {slot.isMeal ? 'Food Experience' : `${slot.category} • ${slot.durationHours} hrs`}
                      </p>

                      {/* Recommendation Reason */}
                      {slot.recommendationReason && (
                        <p className="text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded-lg px-2.5 py-1 mt-2 inline-block max-w-full">
                          💡 {slot.recommendationReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start pt-1 sm:pt-0 shrink-0">
                      <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        {slot.estimatedCost === 0 ? 'Free Entry' : `₹${slot.estimatedCost.toLocaleString('en-IN')}`}
                      </span>

                      <GoogleMapsButton place={slot} hideLabelOnMobile={true} />

                      <button
                        onClick={() => onSelectSlotDetail(slot)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer shadow-2xs"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Secondary Information: Compact Cards Grid (Requirement 5) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Trip Resources & Verified Services
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore dedicated recommendations, verified stay partners, safety helplines, and eco analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Recommended Hotels */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-3">
                  🏨
                </div>
                {trip.selectedHotel && (
                  <GoogleMapsButton place={trip.selectedHotel} label="Maps" />
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Recommended Hotels</h4>
              <p className="text-xs text-slate-500 mt-1">
                {trip.recommendedHotels.length} curated stays • Selected: <strong className="text-slate-800">{trip.selectedHotel.name}</strong>
              </p>
            </div>
            <button
              onClick={() => onOpenSecondary('hotels')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>View Hotels</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Card 2: Restaurants */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-3">
                🍴
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Restaurants</h4>
              <p className="text-xs text-slate-500 mt-1">
                {trip.recommendedRestaurants.length} verified dining spots • Authentic regional cuisine
              </p>
            </div>
            <button
              onClick={() => onOpenSecondary('restaurants')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>View Restaurants</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Card 3: Local Experiences */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg mb-3">
                🧑🎨
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Local Experiences</h4>
              <p className="text-xs text-slate-500 mt-1">
                {trip.recommendedExperiences.length} authentic artisan workshops & heritage tours
              </p>
            </div>
            <button
              onClick={() => onOpenSecondary('experiences')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Explore Local Experiences</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Card 4: Safety */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-lg mb-3">
                🛡️
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Safety</h4>
              <p className="text-xs text-slate-500 mt-1">
                Safety Score: {trip.safety.overallSafetyScore}/100 • Emergency helplines & police booths
              </p>
            </div>
            <button
              onClick={() => onOpenSecondary('safety')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Safety Details</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Card 5: Sustainability */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg mb-3">
                🌱
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Sustainability</h4>
              <p className="text-xs text-slate-500 mt-1">
                Eco Score: {trip.sustainability.sustainabilityScore}/100 • Carbon savings tracker
              </p>
            </div>
            <button
              onClick={() => onOpenSecondary('sustainability')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Eco Recommendations</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Card 6: Interactive Route Map */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-3">
                🗺️
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Interactive Map</h4>
              <p className="text-xs text-slate-500 mt-1">
                Spatial circuit overview with waypoint pins & distance metrics
              </p>
            </div>
            <button
              onClick={() => onOpenSecondary('map')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>View Route Map</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Card 7: Budget Tracker */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:col-span-2 lg:col-span-3 hover:border-emerald-300 transition">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>💰</span> Granular Budget Breakdown & Expense Logger
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Stay ₹{(trip.budget?.hotel || 0).toLocaleString('en-IN')} • Food ₹{(trip.budget?.food || 0).toLocaleString('en-IN')} • Transit ₹{(trip.budget?.transport || 0).toLocaleString('en-IN')} • Activities ₹{(trip.budget?.attractions || 0).toLocaleString('en-IN')} • Misc ₹{(trip.budget?.shoppingMisc || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={() => onOpenSecondary('budget')}
              className="py-2.5 px-4 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
            >
              <span>View Full Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
