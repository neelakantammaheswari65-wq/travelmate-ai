export type TravelStyle = 'Budget' | 'Comfort' | 'Luxury' | 'Backpacker' | 'Family' | 'Couple' | 'Solo';

export type TransportType = 'Public Transport' | 'Cab' | 'Rental Car' | 'Mixed';

export type TravelInterest = 
  | 'Culture' 
  | 'Temples' 
  | 'History' 
  | 'Nature' 
  | 'Adventure' 
  | 'Food' 
  | 'Shopping' 
  | 'Beaches' 
  | 'Photography' 
  | 'Nightlife';

export interface UserTripInput {
  destination: string;
  travellers: number;
  days: number;
  budget: number;
  interests: TravelInterest[];
  travelStyle: TravelStyle;
  transport: TransportType;
}

export interface TravelPlace {
  id?: string;
  placeId?: string;
  name: string;
  category?: string;
  address?: string;
  destination?: string;
  latitude?: number;
  longitude?: number;
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
}

export interface Attraction {
  id: string;
  placeId?: string;
  name: string;
  category: string;
  address?: string;
  visitDurationHours: number;
  estimatedVisitDuration?: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  estimatedCost?: number;
  safetyScore: number;
  sustainabilityScore: number;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  bestTimeToVisit: string;
  openingHours?: string;
  tags: TravelInterest[];
  interests?: TravelInterest[];
  popularityScore: number; // 1-100
  rating?: number;
  familyFriendly?: boolean;
  googleMapsUri?: string;
  googleMapsLinks?: {
    placeUri?: string;
    directionsUri?: string;
  };
  lastUpdated?: string;
  dataSource?: 'places-api' | 'curated-database';
}

export interface Hotel {
  id: string;
  placeId?: string;
  name: string;
  destination: string;
  rating: number;
  pricePerNight: number;
  distanceFromCenterKm: number;
  amenities: string[];
  safetyScore: number;
  matchPercentage: number;
  image: string;
  address: string;
  tier: 'Budget' | 'Comfort' | 'Luxury';
  latitude?: number;
  longitude?: number;
  googleMapsUri?: string;
  googleMapsLinks?: {
    placeUri?: string;
    directionsUri?: string;
  };
  photos?: string[];
}

export interface Restaurant {
  id: string;
  placeId?: string;
  name: string;
  destination: string;
  cuisine: string;
  averageCostForTwo: number;
  rating: number;
  distanceKm: number;
  speciality: string;
  image: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUri?: string;
  googleMapsLinks?: {
    placeUri?: string;
    directionsUri?: string;
  };
  photos?: string[];
  isAiRecommended?: boolean;
}

export interface LocalExperience {
  id: string;
  placeId?: string;
  title: string;
  name?: string;
  destination: string;
  category: 'Handicraft' | 'Food Tour' | 'Cultural Walk' | 'Village Visit' | 'Workshop' | 'Heritage Guide';
  providerName: string;
  duration: string;
  price: number;
  rating: number;
  description: string;
  communityImpact: string;
  image: string;
  address?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUri?: string;
  googleMapsLinks?: {
    placeUri?: string;
    directionsUri?: string;
  };
}

export interface ItinerarySlot {
  id: string;
  placeId?: string;
  time: string;
  activityTitle: string;
  locationName: string;
  name?: string;
  address?: string;
  category: string;
  estimatedCost: number;
  durationHours: number;
  recommendationReason: string;
  latitude: number;
  longitude: number;
  description: string;
  safetyScore: number;
  sustainabilityScore: number;
  isMeal?: boolean;
  rating?: number;
  googleMapsUri?: string;
  googleMapsLinks?: {
    placeUri?: string;
    directionsUri?: string;
  };
  openingHours?: string;
  familyFriendly?: boolean;
  whyRecommended?: string;
  lastUpdated?: string;
  dataSource?: 'places-api' | 'curated-database';
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  theme: string;
  slots: ItinerarySlot[];
  dayEstimatedCost: number;
}

export interface BudgetBreakdown {
  hotel: number;
  food: number;
  transport: number;
  attractions: number;
  shoppingMisc: number;
  total: number;
  userBudget: number;
  remaining: number;
  isWithinBudget: boolean;
  savingsSuggestion?: string;
}

export interface SafetyInfo {
  overallSafetyScore: number;
  emergencyContacts: {
    title: string;
    number: string;
    description: string;
  }[];
  nearestHospital: {
    name: string;
    distanceKm: number;
    phone: string;
  };
  nearestPoliceStation: {
    name: string;
    distanceKm: number;
    phone: string;
  };
  safeRouteAdvice: string;
  travelAlerts: string[];
  touristHelpline?: string;
  ambulanceNumber?: string;
  womenHelpline?: string;
  safeTravelTips?: string[];
  nearestHospitals?: {
    name: string;
    distance: string;
    contact: string;
  }[];
  policeStations?: {
    name: string;
    distance: string;
    contact: string;
  }[];
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Hotel' | 'Food' | 'Transport' | 'Attractions' | 'Shopping/Misc';
  amount: number;
  date: string;
}

export interface SustainabilityMetrics {
  sustainabilityScore: number;
  carbonSavedKg: number;
  recommendations: string[];
}

export interface GeneratedTripPlan {
  id: string;
  createdAt: string;
  input: UserTripInput;
  destinationName: string;
  days: DayItinerary[];
  budget: BudgetBreakdown;
  selectedHotel: Hotel;
  recommendedHotels: Hotel[];
  recommendedRestaurants: Restaurant[];
  recommendedExperiences: LocalExperience[];
  safety: SafetyInfo;
  sustainability: SustainabilityMetrics;
  aiSource: 'Gemini-AI' | 'Intelligent-Engine' | 'Gemini-3.8-Flash + LocalEngine';
  dataFreshness?: 'Updated recently' | 'Information from curated tourism data';
}

export interface BusinessListing {
  id: string;
  businessName: string;
  category: 'Hotel' | 'Restaurant' | 'Local Guide' | 'Transport Provider' | 'Tour Operator' | 'Handicraft Seller';
  location: string;
  priceRange: string;
  contact: string;
  description: string;
  registeredAt: string;
  verified: boolean;
}

export interface DestinationInfo {
  name: string;
  state: string;
  tagline: string;
  heroImage: string;
  latitude: number;
  longitude: number;
  description: string;
  bestTimeToVisit?: string;
  attractions: Attraction[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  localExperiences: LocalExperience[];
  safety: SafetyInfo;
}
