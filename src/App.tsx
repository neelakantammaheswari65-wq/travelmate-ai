import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripPlannerForm } from './components/TripPlannerForm';
import { LoadingScreen } from './components/LoadingScreen';
import { ItineraryView } from './components/ItineraryView';
import { BudgetDashboard } from './components/BudgetDashboard';
import { HotelSection } from './components/HotelSection';
import { RestaurantSection } from './components/RestaurantSection';
import { LocalExperiencesSection } from './components/LocalExperiencesSection';
import { SafetySection } from './components/SafetySection';
import { SustainabilitySection } from './components/SustainabilitySection';
import { InteractiveMap } from './components/InteractiveMap';
import { BusinessDashboard } from './components/BusinessDashboard';
import { BusinessForm } from './components/BusinessForm';
import { SavedTrips } from './components/SavedTrips';
import { ExploreDestinations } from './components/ExploreDestinations';
import {
  SOSModal,
  ShareModal,
  HotelBookingModal,
  SlotDetailModal,
  NotificationsModal
} from './components/Modals';
import { 
  UserTripInput, 
  GeneratedTripPlan, 
  Hotel, 
  ItinerarySlot, 
  LocalExperience,
  BusinessListing,
  Attraction
} from './types';
import { generateLocalItinerary, discoverLivePlaces } from './utils/recommendationEngine';
import { DESTINATIONS_DATA } from './data/destinations';
import { 
  Sparkles, 
  Compass, 
  MapPin, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  Zap, 
  ExternalLink,
  Layers,
  ArrowRight,
  X
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'planner' | 'explore' | 'my-trips' | 'business'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<GeneratedTripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<GeneratedTripPlan[]>([]);
  const [plannerInitialValues, setPlannerInitialValues] = useState<Partial<UserTripInput>>({
    destination: '',
    travellers: 1,
    days: 0,
    budget: 0,
    interests: [],
    travelStyle: 'Budget',
    transport: 'Mixed'
  });

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRegisterBizOpen, setIsRegisterBizOpen] = useState(false);
  const [selectedBookingHotel, setSelectedBookingHotel] = useState<Hotel | null>(null);
  const [selectedSlotDetail, setSelectedSlotDetail] = useState<ItinerarySlot | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeSecondaryModal, setActiveSecondaryModal] = useState<'hotels' | 'restaurants' | 'experiences' | 'safety' | 'sustainability' | 'map' | 'budget' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Load saved trips from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('travelmate_saved_trips');
      if (saved) {
        setSavedTrips(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Could not read saved trips from localStorage:', err);
    }
  }, []);

  // Save trips helper
  const handleSaveCurrentTrip = () => {
    if (!currentTrip) return;
    const exists = savedTrips.some((t) => t.id === currentTrip.id);
    let updated: GeneratedTripPlan[];
    if (exists) {
      updated = savedTrips.filter((t) => t.id !== currentTrip.id);
      showToast(`Removed "${currentTrip.destinationName}" trip from saved bookmarks.`);
    } else {
      updated = [currentTrip, ...savedTrips];
      showToast(`Saved "${currentTrip.destinationName}" trip to your local bookmarks!`);
    }
    setSavedTrips(updated);
    try {
      localStorage.setItem('travelmate_saved_trips', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save trip to localStorage:', e);
    }
  };

  const handleDeleteSavedTrip = (id: string) => {
    const updated = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(updated);
    showToast('Trip removed from saved list.');
    try {
      localStorage.setItem('travelmate_saved_trips', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete trip from localStorage:', e);
    }
  };

  // Generate Trip Workflow
  const handleGenerateTrip = async (input: UserTripInput) => {
    setIsLoading(true);
    setCurrentTab('planner');

    // Smooth scroll to top of planner
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // 1. Attempt live place discovery via Google Places API (New) with graceful fallback
      let livePlaces: Attraction[] = [];
      try {
        livePlaces = await discoverLivePlaces(input.destination, input.interests);
      } catch (e) {
        // Silently continue with curated database
      }

      // 2. Generate non-repeating, destination-aware, geographically optimized itinerary
      const generated = generateLocalItinerary(input, input.destination, undefined, livePlaces);

      // 3. Try fetching server-side AI enhancement (non-blocking fallback)
      try {
        const res = await fetch('/api/ai-plan-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.curatedAdvice) {
            generated.aiSource = 'Gemini-3.8-Flash + LocalEngine';
            if (data.data.curatedAdvice) {
              generated.days[0].slots[0].recommendationReason = `AI Curated: ${data.data.curatedAdvice}`;
            }
          }
        }
      } catch (err) {
        console.log('Server AI offline, running local recommendation engine smoothly.');
      }

      // Realistic AI generation pacing
      setTimeout(() => {
        setCurrentTrip(generated);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Trip generation error:', error);
      setIsLoading(false);
    }
  };

  // Dynamic Hotel Re-selection from recommendations list
  const handleSelectHotel = (hotel: Hotel) => {
    if (!currentTrip) return;
    const reCalculated = generateLocalItinerary(currentTrip.input, currentTrip.destinationName, hotel);
    setCurrentTrip(reCalculated);
  };

  const isCurrentTripSaved = currentTrip ? savedTrips.some((t) => t.id === currentTrip.id) : false;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        savedTripsCount={savedTrips.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* ================= TAB 1: HOME ================= */}
        {currentTab === 'home' && (
          <div className="space-y-16">
            <Hero
              onPlanTrip={() => {
                setCurrentTab('planner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreDestinations={() => {
                setCurrentTab('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Quick banner if a trip has been generated */}
            {currentTrip && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">✨</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Active Itinerary Loaded</p>
                    <h4 className="text-sm font-bold text-slate-900">
                      {currentTrip.destinationName} • {currentTrip.input.days} Days • {currentTrip.input.travellers} Travellers (₹{currentTrip.budget.total.toLocaleString('en-IN')})
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentTab('planner');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  <span>View Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: TRIP PLANNER ================= */}
        {currentTab === 'planner' && (
          <div className="space-y-12">
            {/* Form */}
            <div id="trip-planner-form">
              <TripPlannerForm
                onGenerateTrip={handleGenerateTrip}
                isLoading={isLoading}
                initialValues={plannerInitialValues}
              />
            </div>

            {/* Loading animation state */}
            {isLoading && (
              <LoadingScreen destination={plannerInitialValues.destination || 'Vijayawada'} />
            )}

            {/* Generated Plan Display (Simplified & Clutter-Free) */}
            {!isLoading && currentTrip && (
              <div id="smart-trip-results" className="space-y-6 animate-in fade-in duration-300">
                <ItineraryView
                  trip={currentTrip}
                  onSaveTrip={handleSaveCurrentTrip}
                  isSaved={isCurrentTripSaved}
                  onShareTrip={() => setIsShareOpen(true)}
                  onCustomizeTrip={() => {
                    const formEl = document.getElementById('trip-planner-form');
                    if (formEl) {
                      formEl.scrollIntoView({ behavior: 'smooth' });
                    }
                    showToast('Adjust parameters above and click "Generate Smart Trip" to re-plan.');
                  }}
                  onSelectSlotDetail={(slot) => setSelectedSlotDetail(slot)}
                  onOpenSecondary={(section) => setActiveSecondaryModal(section)}
                />
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: EXPLORE ================= */}
        {currentTab === 'explore' && (
          <ExploreDestinations
            onSelectCityToPlan={(city) => {
              setPlannerInitialValues({
                ...plannerInitialValues,
                destination: city
              });
              setCurrentTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ================= TAB 4: MY TRIPS ================= */}
        {currentTab === 'my-trips' && (
          <SavedTrips
            savedTrips={savedTrips}
            onSelectTrip={(trip) => {
              setCurrentTrip(trip);
              setCurrentTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteTrip={handleDeleteSavedTrip}
            onPlanNewTrip={() => {
              setCurrentTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ================= TAB 5: BUSINESS DASHBOARD ================= */}
        {currentTab === 'business' && (
          <BusinessDashboard
            onOpenRegisterBusiness={() => setIsRegisterBizOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="font-black text-base text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  TRAVELMATE AI
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Your intelligent travel companion for personalized, budget-friendly, safe, and sustainable journeys — empowering both travelers and local tourism businesses.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Crash Local Engine Fallback Architecture</span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider mb-2">Platform Modules</p>
              <ul className="space-y-1.5 text-slate-500">
                <li><button onClick={() => setCurrentTab('planner')} className="hover:text-emerald-700 cursor-pointer">AI Itinerary Planner</button></li>
                <li><button onClick={() => setCurrentTab('explore')} className="hover:text-emerald-700 cursor-pointer">Curated Destinations</button></li>
                <li><button onClick={() => setCurrentTab('business')} className="hover:text-emerald-700 cursor-pointer">Tourism Business Intelligence</button></li>
                <li><button onClick={() => setIsSOSOpen(true)} className="hover:text-rose-600 cursor-pointer">Tourist Safety & Emergency SOS</button></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider mb-2">Sustainable Tourism</p>
              <ul className="space-y-1.5 text-slate-500">
                <li><span>Verified Local Businesses</span></li>
                <li><span>Eco-Friendly Transit First</span></li>
                <li><span>Responsible Heritage Tourism</span></li>
                <li><span>24/7 Tourist Safety Grid</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 TravelMate AI. All rights reserved.</p>
            <p>“Explore Smarter. Travel Better.”</p>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        destinationName={currentTrip?.destinationName || 'Vijayawada'}
      />

      {currentTrip && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          trip={currentTrip}
        />
      )}

      {currentTrip && (
        <HotelBookingModal
          isOpen={!!selectedBookingHotel}
          onClose={() => setSelectedBookingHotel(null)}
          hotel={selectedBookingHotel}
          trip={currentTrip}
        />
      )}

      {/* Secondary Resources & Verified Services Detail Modal */}
      {activeSecondaryModal && currentTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                {activeSecondaryModal === 'hotels' && <span>🏨 Recommended Hotels in {currentTrip.destinationName}</span>}
                {activeSecondaryModal === 'restaurants' && <span>🍴 Gastronomy & Verified Dining in {currentTrip.destinationName}</span>}
                {activeSecondaryModal === 'experiences' && <span>🧑🎨 Authentic Local Experiences in {currentTrip.destinationName}</span>}
                {activeSecondaryModal === 'safety' && <span>🛡️ Traveler Safety Assessment & Helplines</span>}
                {activeSecondaryModal === 'sustainability' && <span>🌱 Sustainability & Eco Breakdown</span>}
                {activeSecondaryModal === 'map' && <span>🗺️ Interactive Route Map ({currentTrip.destinationName})</span>}
                {activeSecondaryModal === 'budget' && <span>💰 Granular Budget Breakdown & Expense Logger</span>}
              </div>
              <button
                onClick={() => setActiveSecondaryModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {activeSecondaryModal === 'hotels' && (
                <HotelSection
                  hotels={currentTrip.recommendedHotels}
                  selectedHotelId={currentTrip.selectedHotel.id}
                  onSelectHotel={handleSelectHotel}
                  onBookHotel={(hotel) => {
                    setActiveSecondaryModal(null);
                    setSelectedBookingHotel(hotel);
                  }}
                />
              )}
              {activeSecondaryModal === 'restaurants' && (
                <RestaurantSection restaurants={currentTrip.recommendedRestaurants} />
              )}
              {activeSecondaryModal === 'experiences' && (
                <LocalExperiencesSection
                  experiences={currentTrip.recommendedExperiences}
                  onBookExperience={(exp) => {
                    showToast(`Reservation inquiry registered for "${exp.title}" with host ${exp.providerName}. Direct contact details dispatched.`);
                  }}
                />
              )}
              {activeSecondaryModal === 'safety' && (
                <SafetySection
                  safety={currentTrip.safety}
                  destinationName={currentTrip.destinationName}
                  onOpenSOSModal={() => {
                    setActiveSecondaryModal(null);
                    setIsSOSOpen(true);
                  }}
                />
              )}
              {activeSecondaryModal === 'sustainability' && (
                <SustainabilitySection
                  sustainability={currentTrip.sustainability}
                  days={currentTrip.input.days}
                  travellers={currentTrip.input.travellers}
                />
              )}
              {activeSecondaryModal === 'map' && (
                <InteractiveMap trip={currentTrip} />
              )}
              {activeSecondaryModal === 'budget' && (
                <BudgetDashboard budget={currentTrip.budget} />
              )}
            </div>
          </div>
        </div>
      )}

      <SlotDetailModal
        isOpen={!!selectedSlotDetail}
        onClose={() => setSelectedSlotDetail(null)}
        slot={selectedSlotDetail}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <BusinessForm
        isOpen={isRegisterBizOpen}
        onClose={() => setIsRegisterBizOpen(false)}
        onBusinessAdded={() => {
          // Trigger re-render of business directory
          setCurrentTab('business');
          showToast('Business successfully registered and listed in verified directory!');
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <p className="text-xs font-medium text-slate-200 leading-snug">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-slate-400 hover:text-white text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
