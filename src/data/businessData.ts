import { BusinessListing } from '../types';

export interface TourismMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
}

export interface InterestStatistic {
  category: string;
  percentage: number;
  color: string;
  count: number;
}

export interface DayFootfall {
  day: string;
  visitors: number;
  hotelOccupancy: number;
}

export const INITIAL_BUSINESS_METRICS: TourismMetric[] = [
  {
    title: 'Total Tracked Visitors',
    value: '12,450',
    change: '+18.4%',
    isPositive: true,
    subtext: 'Monthly active tourists planning via TravelMate AI'
  },
  {
    title: 'Verified Hotel Bookings',
    value: '3,820',
    change: '+22.1%',
    isPositive: true,
    subtext: 'Direct reservations facilitated for local accommodations'
  },
  {
    title: 'Average Hotel Occupancy',
    value: '82%',
    change: '+7.5%',
    isPositive: true,
    subtext: 'Up from 74% baseline across partnered hotels'
  },
  {
    title: 'Average Tourist Spend',
    value: '₹4,850',
    change: '+14.2%',
    isPositive: true,
    subtext: 'Per trip direct infusion into local economy'
  }
];

export const TOURIST_INTEREST_STATS: InterestStatistic[] = [
  { category: 'Culture & Heritage', percentage: 42, color: 'bg-amber-500', count: 5229 },
  { category: 'Nature & Scenic', percentage: 28, color: 'bg-emerald-500', count: 3486 },
  { category: 'Local Food & Culinary', percentage: 18, color: 'bg-orange-500', count: 2241 },
  { category: 'Adventure & Leisure', percentage: 12, color: 'bg-indigo-500', count: 1494 }
];

export const WEEKLY_FOOTFALL_TRENDS: DayFootfall[] = [
  { day: 'Mon', visitors: 1150, hotelOccupancy: 64 },
  { day: 'Tue', visitors: 1280, hotelOccupancy: 68 },
  { day: 'Wed', visitors: 1390, hotelOccupancy: 70 },
  { day: 'Thu', visitors: 1540, hotelOccupancy: 74 },
  { day: 'Fri', visitors: 2180, hotelOccupancy: 88 },
  { day: 'Sat', visitors: 2650, hotelOccupancy: 95 },
  { day: 'Sun', visitors: 2260, hotelOccupancy: 92 }
];

export const AI_BUSINESS_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    title: 'Rising Cultural Tourism Demand',
    tag: 'Market Insight',
    priority: 'High',
    description: 'Tourists show an increasing 42% preference for cultural and temple heritage experiences. Local guides and hotels should showcase historic folklore and temple walking tours.',
    actionableTip: 'Introduce a "Sunrise Heritage & Temple Trail" package on weekends to boost guide bookings.'
  },
  {
    id: 'rec-2',
    title: 'Weekend vs. Weekday Occupancy Dynamic',
    tag: 'Yield Management',
    priority: 'High',
    description: 'Weekend demand is 48% higher than weekday footfalls. Average Saturday occupancy reaches 95% while Tuesday sits at 68%.',
    actionableTip: 'Offer a 15% discount for Sunday-to-Thursday weekday stays or bundle breakfast with local handicraft souvenirs.'
  },
  {
    id: 'rec-3',
    title: 'Proximity Driver for Family Travellers',
    tag: 'Customer Segmentation',
    priority: 'Medium',
    description: 'Family travellers (36% of bookings) consistently select hotels within 3 km of major attractions with verified safety scores > 90.',
    actionableTip: 'Partner with local auto-rickshaw collectives to provide seamless shuttles between hotels and central attractions.'
  },
  {
    id: 'rec-4',
    title: 'High Engagement in Local Food & Crafts',
    tag: 'Ecosystem Growth',
    priority: 'High',
    description: 'Local food discovery experiences like street snack trails and Kondapalli toy workshops achieve the highest user satisfaction ratings (4.9/5).',
    actionableTip: 'Encourage restaurants to offer an exclusive "TravelMate AI Curated Regional Thali" with QR menu integration.'
  },
  {
    id: 'rec-5',
    title: 'Package Opportunity: 2-Day All-Inclusive Heritage Circuit',
    tag: 'Product Innovation',
    priority: 'Medium',
    description: 'Over 68% of itinerary searches in Vijayawada are for 2-day itineraries with a budget under ₹6,000.',
    actionableTip: 'Local tour operators can bundle hotel + breakfast + transport + guided cave tour for ₹4,800 to capture high-intent travelers.'
  }
];

export const SEED_BUSINESS_LISTINGS: BusinessListing[] = [
  {
    id: 'biz-1',
    businessName: 'Krishna Heritage Auto-Rickshaw & Cab Collective',
    category: 'Transport Provider',
    location: 'Vijayawada Central Railway Station & Bus Terminal',
    priceRange: '₹200 - ₹1,200 per day',
    contact: '+91 98480 12345',
    description: 'Union of 65 verified, uniform-wearing drivers offering honest fixed-meter fares and guided tourist transport with women safety training.',
    registeredAt: '2026-02-15',
    verified: true
  },
  {
    id: 'biz-2',
    businessName: 'Kondapalli Traditional Toy Artisan Co-operative',
    category: 'Handicraft Seller',
    location: 'Artisans Street, Kondapalli, Vijayawada',
    priceRange: '₹150 - ₹2,500',
    contact: '+91 94401 56789',
    description: 'Certified GI-tagged wooden toys and sculptures crafted from softwood and organic vegetable dyes. Direct purchase from master artisans.',
    registeredAt: '2026-01-20',
    verified: true
  },
  {
    id: 'biz-3',
    businessName: 'Sree Guru Heritage Tourist Homestay',
    category: 'Hotel',
    location: 'Governorpet, Vijayawada',
    priceRange: '₹1,100 - ₹1,800 per night',
    contact: '+91 866 247 8899',
    description: 'Eco-friendly traditional Andhra townhouse offering solar hot water, homemade banana-leaf breakfasts, and guided pilgrimage assistance.',
    registeredAt: '2026-02-01',
    verified: true
  },
  {
    id: 'biz-4',
    businessName: 'Amaravati Youth Eco-Guides & Heritage Walkers',
    category: 'Local Guide',
    location: 'Undavalli Caves & Prakasam Barrage',
    priceRange: '₹300 - ₹600 per tour',
    contact: '+91 99890 33445',
    description: 'Government certified bilingual youth guides specializing in Buddhist history, rock-cut architecture, and regional temple legends.',
    registeredAt: '2026-02-10',
    verified: true
  }
];

// Helper to get local stored businesses
export function getStoredBusinesses(): BusinessListing[] {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('travelmate_registered_businesses');
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (e) {
    console.error('Error loading businesses:', e);
  }
  return SEED_BUSINESS_LISTINGS;
}

export function saveNewBusiness(business: Omit<BusinessListing, 'id' | 'registeredAt' | 'verified'>): BusinessListing {
  const current = getStoredBusinesses();
  const newEntry: BusinessListing = {
    ...business,
    id: `biz-${Date.now()}`,
    registeredAt: new Date().toISOString().split('T')[0],
    verified: true
  };
  const updated = [newEntry, ...current];
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('travelmate_registered_businesses', JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Error saving business:', e);
  }
  return newEntry;
}
