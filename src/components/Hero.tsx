import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  Coins, 
  Building2, 
  Users2, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

interface HeroProps {
  onPlanTrip: () => void;
  onExploreDestinations: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlanTrip,
  onExploreDestinations
}) => {
  const stats = [
    { label: 'Trips Planned', value: '10K+', sub: 'Personalized itineraries' },
    { label: 'Destinations', value: '500+', sub: 'Across Indian states' },
    { label: 'Budget Accuracy', value: '95%', sub: 'Dynamic cost prediction' },
    { label: 'Travel Assistance', value: '24/7', sub: 'Instant SOS & safety score' }
  ];

  const features = [
    {
      title: 'AI Trip Planning',
      description: 'Intelligent multi-objective algorithm weighting interests, distances, and optimal visiting windows.',
      icon: Sparkles,
      accent: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Smart Budgeting',
      description: 'Granular breakdowns for stay, food, transit, and entry fees with proactive budget-exceeded alerts.',
      icon: Coins,
      accent: 'from-amber-500 to-yellow-600',
      bg: 'bg-amber-50 text-amber-700'
    },
    {
      title: 'Hotel Recommendations',
      description: 'AI match percentages calculating distance to attractions, amenities, and verified safety ratings.',
      icon: Building2,
      accent: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Tourist Safety System',
      description: 'Real-time safety scoring (92/100+), instant SOS emergency helpline triggers, and nearest hospital mappings.',
      icon: ShieldCheck,
      accent: 'from-rose-500 to-red-600',
      bg: 'bg-rose-50 text-rose-700'
    },
    {
      title: 'Grassroots Experiences',
      description: 'Direct empowerment for local artisans, certified heritage guides, and family-run regional diners.',
      icon: HeartHandshake,
      accent: 'from-indigo-500 to-violet-600',
      bg: 'bg-indigo-50 text-indigo-700'
    },
    {
      title: 'Sustainable Travel',
      description: 'Smart Eco-Scores with real-time carbon saving tracking when opting for green public transit and eco-stays.',
      icon: Leaf,
      accent: 'from-teal-500 to-emerald-600',
      bg: 'bg-teal-50 text-teal-700'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-16">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
        <div className="absolute -top-12 left-10 w-72 h-72 bg-emerald-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Card & Typography */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Driven Tourism Intelligence Platform</span>
          </div>

          {/* Primary Title & Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif] leading-[1.15]">
            TRAVELMATE <span className="text-emerald-600">AI</span>
          </h1>

          <p className="mt-3 text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            “Explore Smarter. Travel Better.”
          </p>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Your intelligent travel companion for personalized, budget-friendly, safe, and sustainable journeys — empowering both travelers and local tourism businesses.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-hero-plan-trip"
              onClick={onPlanTrip}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Plan My Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-explore"
              onClick={onExploreDestinations}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm px-6 py-3.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Explore Destinations</span>
            </button>
          </div>
        </div>

        {/* Real-time Statistics Counter */}
        <div className="mt-14 pt-8 border-t border-slate-200/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition duration-200 text-center sm:text-left"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-emerald-700 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              A Complete Solution for Modern Tourism
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Engineered for the dual ecosystem: enriching tourist journeys while uplifting local micro-businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.bg} group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700">
                    <span>Explore Module</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
