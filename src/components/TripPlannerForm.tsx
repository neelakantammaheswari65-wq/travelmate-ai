import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Calendar, 
  IndianRupee, 
  Heart, 
  Compass, 
  Bus, 
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { UserTripInput, TravelInterest, TravelStyle, TransportType } from '../types';

interface TripPlannerFormProps {
  onGenerateTrip: (input: UserTripInput) => void;
  isLoading: boolean;
  initialValues?: Partial<UserTripInput>;
}

const DESTINATION_OPTIONS = [
  'Vijayawada',
  'Visakhapatnam',
  'Hyderabad',
  'Goa',
  'Jaipur',
  'Bengaluru',
  'Chennai',
  'Delhi',
  'Mumbai',
  'Varanasi'
];

const INTEREST_OPTIONS: { id: TravelInterest; label: string; icon: string }[] = [
  { id: 'Culture', label: 'Culture', icon: '🏛️' },
  { id: 'Temples', label: 'Temples', icon: '🛕' },
  { id: 'History', label: 'History', icon: '📜' },
  { id: 'Nature', label: 'Nature', icon: '🌿' },
  { id: 'Adventure', label: 'Adventure', icon: '🧗' },
  { id: 'Food', label: 'Food & Culinary', icon: '🍲' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'Beaches', label: 'Beaches', icon: '🏖️' },
  { id: 'Photography', label: 'Photography', icon: '📸' },
  { id: 'Nightlife', label: 'Nightlife', icon: '✨' }
];

const TRAVEL_STYLES: { id: TravelStyle; label: string; desc: string }[] = [
  { id: 'Budget', label: 'Budget', desc: 'Hostels, local diners & public transit' },
  { id: 'Comfort', label: 'Comfort', desc: '3-star stays, cab rides & balanced spend' },
  { id: 'Luxury', label: 'Luxury', desc: 'Premium resorts & private chauffeurs' },
  { id: 'Backpacker', label: 'Backpacker', desc: 'Offbeat routes & nomadic exploration' },
  { id: 'Family', label: 'Family', desc: 'Kid-friendly stops & spacious pacing' },
  { id: 'Couple', label: 'Couple', desc: 'Scenic sunsets & private dining' },
  { id: 'Solo', label: 'Solo', desc: 'Safe routes, youth hubs & freedom' }
];

const TRANSPORT_TYPES: { id: TransportType; label: string; icon: string; ecoBadge?: string }[] = [
  { id: 'Public Transport', label: 'Public Transport', icon: '🚌', ecoBadge: 'Best for Eco & Budget' },
  { id: 'Cab', label: 'Cab / Taxi', icon: '🚖' },
  { id: 'Rental Car', label: 'Self-Drive Rental', icon: '🚗' },
  { id: 'Mixed', label: 'Mixed (Metro + Cab)', icon: '🚆' }
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  onGenerateTrip,
  isLoading,
  initialValues
}) => {
  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [travellers, setTravellers] = useState(initialValues?.travellers || 1);
  const [days, setDays] = useState(initialValues?.days || 0);
  const [budget, setBudget] = useState<number | ''>(initialValues?.budget ? initialValues.budget : '');
  const [interests, setInterests] = useState<TravelInterest[]>(
    initialValues?.interests || []
  );
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(initialValues?.travelStyle || 'Budget');
  const [transport, setTransport] = useState<TransportType>(initialValues?.transport || 'Mixed');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      if (initialValues.destination !== undefined) setDestination(initialValues.destination);
      if (initialValues.travellers !== undefined) setTravellers(initialValues.travellers);
      if (initialValues.days !== undefined) setDays(initialValues.days);
      if (initialValues.budget !== undefined) setBudget(initialValues.budget === 0 ? '' : initialValues.budget);
      if (initialValues.interests !== undefined) setInterests(initialValues.interests);
      if (initialValues.travelStyle !== undefined) setTravelStyle(initialValues.travelStyle);
      if (initialValues.transport !== undefined) setTransport(initialValues.transport);
    }
  }, [initialValues]);

  const toggleInterest = (interest: TravelInterest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!destination || !destination.trim()) {
      newErrors.destination = 'Please select your destination.';
    }

    if (!days || days < 1) {
      newErrors.days = 'Please select trip duration.';
    }

    if (!travellers || travellers < 1) {
      newErrors.travellers = 'Please select number of travellers.';
    }

    const numBudget = Number(budget);
    if (!budget || isNaN(numBudget) || numBudget < 1000) {
      newErrors.budget = 'Please enter a budget of at least ₹1,000.';
    }

    if (!interests || interests.length === 0) {
      newErrors.interests = 'Please select at least one travel interest (e.g. Culture, Food, Nature).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onGenerateTrip({
      destination,
      travellers: Number(travellers),
      days: Number(days),
      budget: Number(budget),
      interests,
      travelStyle,
      transport
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="pb-6 border-b border-slate-100">
        <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Itinerary Generator</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Plan Your Perfect Journey
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Tell us what you want from your trip and we'll create a personalized travel plan.
        </p>
      </div>

      <form onSubmit={validateAndSubmit} className="mt-8 space-y-8">
        {/* Row 1: Destination & Travellers & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Destination */}
          <div>
            <label htmlFor="input-destination" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> Destination
            </label>
            <div className="relative">
              <select
                id="input-destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium transition cursor-pointer"
              >
                <option value="">Select your destination</option>
                {DESTINATION_OPTIONS.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>
            {errors.destination && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.destination}
              </p>
            )}
          </div>

          {/* Number of Travellers */}
          <div>
            <label htmlFor="input-travellers" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" /> Travellers
              </span>
              <span className="text-emerald-700 font-extrabold text-sm">{travellers} {travellers === 1 ? 'person' : 'people'}</span>
            </label>
            <select
              id="input-travellers"
              value={travellers}
              onChange={(e) => setTravellers(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium transition cursor-pointer"
            >
              <option value="1">1 Solo Traveller</option>
              <option value="2">2 Travellers (Duo / Couple)</option>
              <option value="3">3 Travellers</option>
              <option value="4">4 Travellers (Family / Group)</option>
              <option value="5">5 Travellers</option>
              <option value="6">6 Travellers</option>
              <option value="8">8 Travellers</option>
              <option value="10">10 Travellers</option>
            </select>
            {errors.travellers && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.travellers}</p>
            )}
          </div>

          {/* Duration in Days */}
          <div>
            <label htmlFor="input-days" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> Duration
              </span>
              {days > 0 ? (
                <span className="text-emerald-700 font-extrabold text-sm">{days} {days === 1 ? 'Day' : 'Days'}</span>
              ) : (
                <span className="text-slate-400 text-xs font-normal">Select duration</span>
              )}
            </label>
            <select
              id="input-days"
              value={days || ''}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium transition cursor-pointer"
            >
              <option value="">Select duration</option>
              <option value="1">1 Day (Quick Getaway)</option>
              <option value="2">2 Days (Weekend Trip)</option>
              <option value="3">3 Days (Extended Weekend)</option>
              <option value="4">4 Days</option>
              <option value="5">5 Days</option>
              <option value="7">7 Days (Full Week)</option>
              <option value="10">10 Days</option>
              <option value="14">14 Days (Grand Circuit)</option>
            </select>
            {errors.days && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.days}</p>
            )}
          </div>
        </div>

        {/* Row 2: Budget */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <label htmlFor="input-budget-number" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" /> Total Estimated Budget (INR)
              </label>
              <p className="text-xs text-slate-500">
                Covers accommodation, local transit, food, and entry fees.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-xs">
              <span className="text-sm font-bold text-slate-500">₹</span>
              <input
                type="number"
                id="input-budget-number"
                min="1000"
                max="100000"
                step="500"
                placeholder="Enter budget"
                value={budget === 0 || budget === '' ? '' : budget}
                onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-32 text-right font-extrabold text-base text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
            <span>Min: ₹1,000</span>
            <span className="text-slate-600 font-semibold">Standard: ₹5,000</span>
            <span>Comfort: ₹15,000+</span>
          </div>
          {errors.budget && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.budget}
            </p>
          )}
        </div>

        {/* Row 3: Travel Interests Multi-Select Pills */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-emerald-600" /> Travel Interests (Pick at least 1)
            </label>
            <span className="text-xs text-slate-500 font-medium">
              {interests.length === 0 ? 'None selected initially' : `${interests.length} selected`}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((item) => {
              const isSelected = interests.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  id={`interest-${item.id.toLowerCase()}`}
                  onClick={() => toggleInterest(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 ml-0.5" />}
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.interests}</p>
          )}
        </div>

        {/* Row 4: Travel Style */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" /> Preferred Travel Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = travelStyle === style.id;
              return (
                <button
                  type="button"
                  key={style.id}
                  id={`style-${style.id.toLowerCase()}`}
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className={`text-xs font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-800'}`}>
                    {style.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                    {style.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 5: Preferred Transport Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Bus className="w-4 h-4 text-emerald-600" /> Preferred Transport Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TRANSPORT_TYPES.map((t) => {
              const isSelected = transport === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  id={`transport-${t.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setTransport(t.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{t.icon}</span>
                    <div className="text-left">
                      <p className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {t.label}
                      </p>
                      {t.ecoBadge && (
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                          {t.ecoBadge}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Runs intelligent weighted scoring: interest + budget + safety + sustainability.</span>
          </div>

          <button
            type="submit"
            id="btn-generate-smart-trip"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer active:scale-98"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Optimizing Journey...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>GENERATE SMART TRIP</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
