import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ShieldAlert, 
  BookmarkCheck, 
  BarChart3, 
  Bell, 
  User, 
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'planner' | 'explore' | 'my-trips' | 'business';
  onSelectTab: (tab: 'home' | 'planner' | 'explore' | 'my-trips' | 'business') => void;
  onOpenSOS: () => void;
  onOpenNotifications: () => void;
  savedTripsCount: number;
}

interface NavItem {
  id: 'home' | 'planner' | 'explore' | 'my-trips' | 'business';
  label: string;
  icon: any;
  badge?: number | null;
  highlight?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSOS,
  onOpenNotifications,
  savedTripsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'planner', label: 'Plan Trip', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: MapPin },
    { id: 'my-trips', label: 'My Trips', icon: BookmarkCheck, badge: savedTripsCount > 0 ? savedTripsCount : null },
    { id: 'business', label: 'Business Dashboard', icon: BarChart3, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <button 
            onClick={() => onSelectTab('home')} 
            className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition duration-200">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  TRAVELMATE <span className="text-emerald-600 font-black">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-1.5 py-0.2 rounded">
                  MVP
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-normal hidden sm:block">
                Explore Smarter. Travel Better.
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  } ${item.highlight ? 'border border-emerald-300/60 bg-emerald-50/40 text-emerald-800' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Emergency Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick SOS Trigger Button */}
            <button
              id="btn-emergency-sos-quick"
              onClick={onOpenSOS}
              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Tourist Emergency SOS Helpline 112 / 108"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
              <span className="hidden sm:inline">SOS</span>
              <span className="sm:hidden text-[11px]">SOS</span>
            </button>

            {/* Notification Bell */}
            <button
              id="btn-notifications"
              onClick={onOpenNotifications}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition relative cursor-pointer"
              title="Travel Alerts & Intelligence Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <p className="text-xs font-bold text-slate-800">Traveler Profile</p>
                <p className="text-[10px] text-slate-500">Verified Member</p>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
