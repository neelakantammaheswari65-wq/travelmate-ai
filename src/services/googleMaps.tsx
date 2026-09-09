import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { TravelPlace } from '../types';

export type TravelPlaceLike = 
  | TravelPlace
  | {
      id?: string;
      placeId?: string;
      name?: string;
      title?: string;
      activityTitle?: string;
      locationName?: string;
      businessName?: string;
      category?: string;
      address?: string;
      destination?: string;
      proximity?: string;
      distance?: string;
      latitude?: number;
      longitude?: number;
      lat?: number;
      lon?: number;
      rating?: number;
      googleMapsUri?: string;
      googleMapsLinks?: {
        placeUri?: string;
        directionsUri?: string;
        photosUri?: string;
        reviewsUri?: string;
      };
      photos?: string[];
      image?: string;
      [key: string]: any;
    };

/**
 * Normalizes and extracts clean place name and address from any place-like object.
 * Strips itinerary prefixes like "Authentic Lunch at ..." so Maps opens the exact restaurant.
 */
export function extractPlaceIdentity(place: TravelPlaceLike): {
  cleanName: string;
  address: string;
  destination: string;
  placeId?: string;
  lat?: number;
  lng?: number;
} {
  const p = place as any;
  let rawName = p.locationName || p.name || p.title || p.activityTitle || p.businessName || '';
  
  // Clean meal/activity prefix if present (e.g. "Authentic Lunch at Sweet Magic Restaurant" -> "Sweet Magic Restaurant")
  let cleanName = rawName
    .replace(/^Authentic (Lunch|Breakfast|Dinner) at\s+/i, '')
    .replace(/^(Lunch|Breakfast|Dinner) at\s+/i, '')
    .replace(/^Visit\s+/i, '')
    .replace(/^Explore\s+/i, '')
    .trim();

  if (!cleanName && p.category) {
    cleanName = p.category;
  }

  const address = p.address || p.proximity || '';
  const destination = p.destination || '';
  const placeId = p.placeId;
  const lat = p.latitude ?? p.lat;
  const lng = p.longitude ?? p.lon;

  return { cleanName, address, destination, placeId, lat, lng };
}

/**
 * Constructs a targeted Google Maps search/place URL based on the priority hierarchy:
 * 1. googleMapsUri
 * 2. googleMapsLinks.placeUri
 * 3. Google Maps Search URL using place ID:
 *    https://www.google.com/maps/search/?api=1&query=NAME_AND_ADDRESS&query_place_id=PLACE_ID
 * 4. Google Maps Search URL using name + address/destination:
 *    https://www.google.com/maps/search/?api=1&query=NAME_AND_ADDRESS
 * 5. Coordinates as final fallback
 * 6. Fallback query (e.g., "hospital near me")
 */
export function getGoogleMapsUrl(place?: TravelPlaceLike | null, fallbackQuery?: string): string {
  if (!place && !fallbackQuery) {
    return 'https://www.google.com/maps';
  }

  // 1. Direct googleMapsUri
  if (place?.googleMapsUri && typeof place.googleMapsUri === 'string' && place.googleMapsUri.startsWith('http')) {
    // Ensure it's not a generic homepage
    if (!place.googleMapsUri.endsWith('google.com/maps') && !place.googleMapsUri.endsWith('google.com/maps/')) {
      return place.googleMapsUri;
    }
  }

  // 2. googleMapsLinks.placeUri
  if (place?.googleMapsLinks?.placeUri && typeof place.googleMapsLinks.placeUri === 'string') {
    return place.googleMapsLinks.placeUri;
  }

  if (!place) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery || '')}`;
  }

  const { cleanName, address, destination, placeId, lat, lng } = extractPlaceIdentity(place);

  // Construct search query
  const queryParts = [cleanName, address, destination].filter(Boolean);
  const queryString = queryParts.join(', ') || fallbackQuery || '';

  // 3. Place ID available
  if (placeId && queryString) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryString)}&query_place_id=${encodeURIComponent(placeId)}`;
  }

  // 4. Name + Address / Destination available
  if (queryString) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryString)}`;
  }

  // 5. Coordinates fallback
  if (typeof lat === 'number' && typeof lng === 'number' && (lat !== 0 || lng !== 0)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`;
  }

  // 6. Fallback query
  if (fallbackQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
  }

  return 'https://www.google.com/maps';
}

/**
 * Constructs a Google Maps Directions URL using:
 * https://www.google.com/maps/dir/?api=1&destination=...&destination_place_id=...
 */
export function getGoogleMapsDirectionsUrl(place: TravelPlaceLike, origin?: string): string {
  const { cleanName, address, destination, placeId, lat, lng } = extractPlaceIdentity(place);
  const destinationQuery = [cleanName, address, destination].filter(Boolean).join(', ') || 
    (typeof lat === 'number' && typeof lng === 'number' ? `${lat},${lng}` : 'India');

  let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;

  if (placeId) {
    url += `&destination_place_id=${encodeURIComponent(placeId)}`;
  }

  if (origin && origin.trim()) {
    url += `&origin=${encodeURIComponent(origin.trim())}`;
  }

  return url;
}

/**
 * Universal service function: opens the place in Google Maps in a new tab.
 */
export function openPlaceInGoogleMaps(place: TravelPlaceLike, fallbackQuery?: string): void {
  const url = getGoogleMapsUrl(place, fallbackQuery);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Universal service function: opens Google Maps directions to the place.
 */
export function openDirectionsInGoogleMaps(place: TravelPlaceLike, origin?: string): void {
  const url = getGoogleMapsDirectionsUrl(place, origin);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Constructs a multi-stop route URL in Google Maps
 */
export function getGoogleMapsMultiStopRouteUrl(places: TravelPlaceLike[]): string {
  if (!places || places.length === 0) {
    return 'https://www.google.com/maps';
  }
  if (places.length === 1) {
    return getGoogleMapsUrl(places[0]);
  }

  const cleanPlaces = places.map((p) => {
    const id = extractPlaceIdentity(p);
    return [id.cleanName, id.destination].filter(Boolean).join(', ') || 'India';
  });

  const origin = cleanPlaces[0];
  const destination = cleanPlaces[cleanPlaces.length - 1];
  const waypoints = cleanPlaces.slice(1, -1);

  let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  if (waypoints.length > 0) {
    url += `&waypoints=${encodeURIComponent(waypoints.join('|'))}`;
  }
  return url;
}

/**
 * Opens full route with waypoints in Google Maps
 */
export function openFullRouteInGoogleMaps(places: TravelPlaceLike[]): void {
  const url = getGoogleMapsMultiStopRouteUrl(places);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// ==========================================
// UNIFIED UI COMPONENTS
// ==========================================

export interface GoogleMapsButtonProps {
  place?: TravelPlaceLike | null;
  fallbackQuery?: string;
  label?: string;
  showIcon?: boolean;
  showExternalIcon?: boolean;
  className?: string;
  hideLabelOnMobile?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Universal "Maps" button matching the application's clean design.
 * Opens the exact place in Google Maps in a new tab.
 */
export const GoogleMapsButton: React.FC<GoogleMapsButtonProps> = ({
  place,
  fallbackQuery,
  label = 'Maps',
  showIcon = true,
  showExternalIcon = true,
  className = '',
  hideLabelOnMobile = false,
  size = 'sm'
}) => {
  const url = getGoogleMapsUrl(place, fallbackQuery);
  const { cleanName } = place ? extractPlaceIdentity(place) : { cleanName: fallbackQuery || 'Location' };

  const paddingClass = size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 font-bold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 rounded-lg border border-slate-200 transition shadow-2xs cursor-pointer ${paddingClass} ${className}`}
      title={`Open ${cleanName} on Google Maps`}
    >
      {showIcon && <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
      <span className={hideLabelOnMobile ? 'hidden sm:inline' : ''}>{label}</span>
      {showExternalIcon && <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />}
    </a>
  );
};

export interface GoogleDirectionsButtonProps {
  place: TravelPlaceLike;
  origin?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Universal "Directions" button that launches Google Maps turn-by-turn navigation.
 */
export const GoogleDirectionsButton: React.FC<GoogleDirectionsButtonProps> = ({
  place,
  origin,
  label = 'Directions',
  className = '',
  size = 'sm'
}) => {
  const url = getGoogleMapsDirectionsUrl(place, origin);
  const { cleanName } = extractPlaceIdentity(place);
  const paddingClass = size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-lg border border-slate-200 transition shadow-2xs cursor-pointer ${paddingClass} ${className}`}
      title={`Get directions to ${cleanName} on Google Maps`}
    >
      <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      <span>{label}</span>
      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
    </a>
  );
};
