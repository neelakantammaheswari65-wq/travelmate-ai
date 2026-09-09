import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Coins, 
  Sparkles, 
  Plus, 
  Store, 
  ArrowUpRight, 
  CheckCircle2, 
  Lightbulb, 
  Phone, 
  MapPin, 
  Tag,
  ShieldCheck
} from 'lucide-react';
import { 
  INITIAL_BUSINESS_METRICS, 
  TOURIST_INTEREST_STATS, 
  WEEKLY_FOOTFALL_TRENDS, 
  AI_BUSINESS_RECOMMENDATIONS, 
  getStoredBusinesses, 
  saveNewBusiness 
} from '../data/businessData';
import { BusinessListing } from '../types';

interface BusinessDashboardProps {
  onOpenRegisterBusiness: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  onOpenRegisterBusiness
}) => {
  const [businesses, setBusinesses] = useState<BusinessListing[]>(getStoredBusinesses());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const filteredBusinesses = selectedCategoryFilter === 'All'
    ? businesses
    : businesses.filter((b) => b.category === selectedCategoryFilter);

  const categories = ['All', 'Hotel', 'Restaurant', 'Local Guide', 'Transport Provider', 'Handicraft Seller'];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time Market Analytics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
              Tourism Intelligence Dashboard
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Empowering local hospitality, transport operators, guides, and artisans with real-time traveler demand analytics and AI-driven growth recommendations.
            </p>
          </div>

          {/* Action CTA to promote business */}
          <div className="shrink-0">
            <button
              id="btn-open-promote-business"
              onClick={onOpenRegisterBusiness}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Promote Your Business</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_BUSINESS_METRICS.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {metric.title}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                {metric.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-['Outfit',sans-serif]">
              {metric.value}
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-tight">
              {metric.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Rows: Tourist Interests + Footfall Dynamic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Interests Breakdown */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Customer Interests Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time search intents parsed from 12,450 active itineraries
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              High Intent
            </span>
          </div>

          <div className="space-y-4">
            {TOURIST_INTEREST_STATS.map((stat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{stat.category}</span>
                  <span className="text-slate-900 font-extrabold">
                    {stat.percentage}% ({stat.count.toLocaleString('en-IN')} trips)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${stat.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Takeaway for Businesses:</strong> Align packages with heritage and local dining for maximum booking conversions.</span>
          </div>
        </div>

        {/* Weekly Footfall & Occupancy Dynamic */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Weekly Footfall & Hotel Occupancy Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visitor volume spikes Friday through Sunday
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              95% Sat Peak
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4">
            {WEEKLY_FOOTFALL_TRENDS.map((dayData, idx) => {
              const heightPct = (dayData.visitors / 2800) * 100;
              const isWeekend = dayData.day === 'Fri' || dayData.day === 'Sat' || dayData.day === 'Sun';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 opacity-0 group-hover:opacity-100 transition">
                    {dayData.visitors}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isWeekend ? 'bg-indigo-600 group-hover:bg-indigo-700' : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-700 block">{dayData.day}</span>
                    <span className="text-[10px] text-slate-400">{dayData.hotelOccupancy}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span> Weekend Surge (Fri-Sun)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span> Weekday Baseline
            </span>
          </div>
        </div>
      </div>

      {/* AI Business Recommendations */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-1 border border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Growth Strategies</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Actionable Business Optimization Recommendations
            </h3>
          </div>

          <span className="text-xs font-bold text-slate-500 hidden sm:block">
            Updated daily via TravelMate AI Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_BUSINESS_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded">
                    {rec.tag}
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    {rec.priority} Impact
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {rec.title}
                </h4>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 text-xs">
                <p className="font-bold text-emerald-800 flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{rec.actionableTip}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Local Tourism Businesses Directory */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider mb-1 border border-teal-200/60">
              <Store className="w-3.5 h-3.5 text-teal-600" />
              <span>Local Tourism Ecosystem</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Registered Tourism Providers ({businesses.length})
            </h3>
            <p className="text-xs text-slate-500">
              Verified local guides, drivers, homestays, and handicraft artisans connected directly to travelers.
            </p>
          </div>

          <button
            onClick={onOpenRegisterBusiness}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Listing</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                selectedCategoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {biz.category}
                    </span>
                    {biz.verified && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1.5">
                    {biz.businessName}
                  </h4>
                </div>

                <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                  {biz.priceRange}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {biz.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {biz.location}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {biz.contact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
