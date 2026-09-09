import React, { useState } from 'react';
import { MapPin, Navigation, Building2, Utensils, Sparkles, Layers, Info, Compass, ExternalLink } from 'lucide-react';
import { GeneratedTripPlan, Attraction, Hotel, Restaurant } from '../types';
import { GoogleMapsButton, GoogleDirectionsButton, openFullRouteInGoogleMaps } from '../services/googleMaps';

interface InteractiveMapProps {
  trip: GeneratedTripPlan;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ trip }) => {
  const [filter, setFilter] = useState<'all' | 'attractions' | 'hotels' | 'restaurants'>('all');
  const [selectedPoint, setSelectedPoint] = useState<{
    name: string;
    type: 'Attraction' | 'Hotel' | 'Restaurant';
    category?: string;
    score?: number;
    description?: string;
    lat: number;
    lon: number;
  } | null>(null);

  // Extract all points for the destination
  const allAttractions = (trip?.days || []).flatMap((d) => (d.slots || []).filter((s) => !s.isMeal));
  const hotel = trip?.selectedHotel;
  const restaurants = trip?.recommendedRestaurants || [];

  // Compute bounding box
  const lats = [
    hotel?.latitude || 16.5062,
    ...allAttractions.map((a) => a.latitude),
    ...restaurants.map((r) => 16.5062)
  ];
  const lons = [
    hotel?.longitude || 80.648,
    ...allAttractions.map((a) => a.longitude),
    ...restaurants.map((r) => 80.648)
  ];

  const minLat = Math.min(...lats) - 0.02;
  const maxLat = Math.max(...lats) + 0.02;
  const minLon = Math.min(...lons) - 0.02;
  const maxLon = Math.max(...lons) + 0.02;

  const latRange = maxLat - minLat || 0.1;
  const lonRange = maxLon - minLon || 0.1;

  // Convert lat/lon to percentage (0% to 100%) inside map container
  const getCoordinates = (lat: number, lon: number) => {
    const x = Math.max(8, Math.min(92, ((lon - minLon) / lonRange) * 100));
    const y = Math.max(8, Math.min(92, 100 - ((lat - minLat) / latRange) * 100));
    return { x, y };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-emerald-200/60">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Spatial Route Visualizer</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Interactive Geo-Map & Circuit Explorer
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore planned points of interest, hotel proximity, and regional routes in {trip.destinationName}.
          </p>
        </div>

        {/* Route Actions and Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const allStops = [hotel, ...allAttractions, ...restaurants].filter(Boolean) as any[];
              openFullRouteInGoogleMaps(allStops);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition cursor-pointer shadow-2xs"
            title="Open full itinerary route with waypoints in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Open Route in Maps</span>
            <ExternalLink className="w-3 h-3 text-emerald-600" />
          </button>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === 'all' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Points
            </button>
            <button
              onClick={() => setFilter('attractions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === 'attractions' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attractions
            </button>
            <button
              onClick={() => setFilter('hotels')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === 'hotels' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hotels
            </button>
            <button
              onClick={() => setFilter('restaurants')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === 'restaurants' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diners
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas Surface */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        {/* Subtle Grid Lines & Geographic Radar Styling */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        {/* Simulated River / Topography Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <path
            d="M -50 240 Q 200 180, 450 260 T 900 200"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M -50 240 Q 200 180, 450 260 T 900 200"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="8"
            strokeDasharray="6 6"
          />
        </svg>

        {/* City Watermark */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/70 backdrop-blur-xs border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Region: <strong>{trip.destinationName} Circuit</strong></span>
        </div>

        {/* Hotel Marker */}
        {(filter === 'all' || filter === 'hotels') && (
          <button
            onClick={() =>
              setSelectedPoint({
                name: hotel.name,
                type: 'Hotel',
                category: `${hotel.tier} Tier Accommodation`,
                score: hotel.matchScore,
                description: `${hotel.proximity} • ₹${hotel.pricePerNight}/night`,
                lat: hotel.latitude || 16.5062,
                lon: hotel.longitude || 80.648
              })
            }
            style={{
              left: `${getCoordinates(hotel.latitude || 16.5062, hotel.longitude || 80.648).x}%`,
              top: `${getCoordinates(hotel.latitude || 16.5062, hotel.longitude || 80.648).y}%`
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
            title={hotel.name}
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-125 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold bg-slate-950/90 text-white px-2 py-0.5 rounded shadow-sm opacity-90 group-hover:opacity-100">
              Stay: {hotel.name.slice(0, 14)}...
            </span>
          </button>
        )}

        {/* Attractions Markers */}
        {(filter === 'all' || filter === 'attractions') &&
          allAttractions.map((slot, idx) => {
            const { x, y } = getCoordinates(slot.latitude, slot.longitude);
            return (
              <button
                key={slot.id}
                onClick={() =>
                  setSelectedPoint({
                    name: slot.locationName,
                    type: 'Attraction',
                    category: slot.category,
                    score: slot.safetyScore,
                    description: slot.activityTitle,
                    lat: slot.latitude,
                    lon: slot.longitude
                  })
                }
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                title={slot.locationName}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-125 transition-transform">
                  <span className="text-[11px] font-black">{idx + 1}</span>
                </div>
                <span className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold bg-slate-950/90 text-emerald-300 px-2 py-0.5 rounded shadow-sm opacity-90 group-hover:opacity-100">
                  {slot.locationName.slice(0, 16)}
                </span>
              </button>
            );
          })}

        {/* Restaurant Markers */}
        {(filter === 'all' || filter === 'restaurants') &&
          restaurants.map((rest, idx) => {
            const { x, y } = getCoordinates(16.5062 + 0.008 * (idx + 1), 80.648 + 0.006 * (idx + 1));
            return (
              <button
                key={rest.id}
                onClick={() =>
                  setSelectedPoint({
                    name: rest.name,
                    type: 'Restaurant',
                    category: rest.cuisine,
                    score: Math.round(rest.rating * 20),
                    description: `Specialty: ${rest.speciality}`,
                    lat: 16.5062,
                    lon: 80.648
                  })
                }
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                title={rest.name}
              >
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-125 transition-transform">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}

        {/* Selected Marker Callout Box */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedPoint.type === 'Hotel'
                  ? 'bg-indigo-100 text-indigo-800'
                  : selectedPoint.type === 'Restaurant'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedPoint.type} • {selectedPoint.category}
              </span>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-extrabold text-slate-900 mt-1">
              {selectedPoint.name}
            </h4>

            <p className="text-xs text-slate-600 mt-1">
              {selectedPoint.description}
            </p>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Geo: {selectedPoint.lat.toFixed(4)}° N, {selectedPoint.lon.toFixed(4)}° E</span>
              {selectedPoint.score && (
                <span className="font-bold text-emerald-700">★ {selectedPoint.score} Score</span>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <GoogleMapsButton
                place={{
                  name: selectedPoint.name,
                  destination: trip.destinationName,
                  latitude: selectedPoint.lat,
                  longitude: selectedPoint.lon
                }}
                label="Maps"
              />
              <GoogleDirectionsButton
                place={{
                  name: selectedPoint.name,
                  destination: trip.destinationName
                }}
                label="Directions"
              />
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Day Stops</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span>Selected Hotel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Dining Spot</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">
          Click any pinpoint on the map for instant coordinates and details
        </span>
      </div>
    </div>
  );
};
