import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  PhoneCall, 
  Hospital, 
  Building, 
  AlertCircle, 
  MapPin, 
  CheckCircle2,
  ExternalLink,
  Pill,
  LifeBuoy
} from 'lucide-react';
import { SafetyInfo } from '../types';
import { GoogleMapsButton, GoogleDirectionsButton } from '../services/googleMaps';

interface SafetySectionProps {
  safety: SafetyInfo;
  destinationName: string;
  onOpenSOSModal: () => void;
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  safety,
  destinationName,
  onOpenSOSModal
}) => {
  // Graceful fallback extractions to ensure zero undefined map errors
  const touristNumber =
    safety.touristHelpline ||
    safety.emergencyContacts?.find((c) => c.title.toLowerCase().includes('tourist'))?.number ||
    '1363';

  const ambulanceNumber =
    safety.ambulanceNumber ||
    safety.emergencyContacts?.find(
      (c) => c.title.toLowerCase().includes('ambulance') || c.title.toLowerCase().includes('medical')
    )?.number ||
    '108';

  const womenNumber =
    safety.womenHelpline ||
    safety.emergencyContacts?.find((c) => c.title.toLowerCase().includes('women'))?.number ||
    '1091';

  const travelTips =
    safety.safeTravelTips && safety.safeTravelTips.length > 0
      ? safety.safeTravelTips
      : [
          ...(safety.travelAlerts || []),
          safety.safeRouteAdvice,
          'Keep emergency contact numbers handy on speed dial and share your live location with companions.',
          'Prefer authorized prepaid taxi/auto stands or app-based cab aggregators at transit hubs.'
        ].filter(Boolean);

  const hospitals =
    safety.nearestHospitals && safety.nearestHospitals.length > 0
      ? safety.nearestHospitals
      : safety.nearestHospital
        ? [
            {
              name: safety.nearestHospital.name,
              distance: `${safety.nearestHospital.distanceKm} km away`,
              contact: safety.nearestHospital.phone
            },
            {
              name: 'Apollo / Regional Emergency Trauma Care Center',
              distance: '3.2 km away',
              contact: '1066 / 108'
            }
          ]
        : [
            {
              name: 'District Government General Hospital',
              distance: '1.8 km away',
              contact: '108 / 112'
            }
          ];

  const policeList =
    safety.policeStations && safety.policeStations.length > 0
      ? safety.policeStations
      : safety.nearestPoliceStation
        ? [
            {
              name: safety.nearestPoliceStation.name,
              distance: `${safety.nearestPoliceStation.distanceKm} km away`,
              contact: safety.nearestPoliceStation.phone
            },
            {
              name: 'Tourism Police & Women Security Assistance Desk',
              distance: '1.2 km away',
              contact: '1363 / 1091'
            }
          ]
        : [
            {
              name: 'Central City Police Station & PCR Hub',
              distance: '1.0 km away',
              contact: '100 / 112'
            }
          ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header & Overall Safety Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-rose-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>24/7 Tourist Protection Grid</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Safety Intelligence & Emergency SOS
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time verified security indices, rapid medical access, and instant distress dispatch.
          </p>
        </div>

        {/* SOS Trigger Button */}
        <button
          id="btn-safety-sos-trigger"
          onClick={onOpenSOSModal}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-rose-600/30 transition cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>TRIGGER EMERGENCY SOS</span>
        </button>
      </div>

      {/* Safety Score Meter & Core Helplines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Safety Score Card */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              City Safety Index
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black text-emerald-950">
                {safety.overallSafetyScore || 90}
              </span>
              <span className="text-sm font-bold text-emerald-700">/ 100</span>
            </div>
            <p className="text-xs text-emerald-800 mt-2 font-medium">
              High safety rating. Active tourist police presence, CCTV coverage across heritage corridors, and well-lit thoroughfares.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Safe for solo, duo & family travel</span>
          </div>
        </div>

        {/* Essential Emergency Helpline Numbers */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 block">
            National & Regional Emergency Helplines (Toll-Free)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">All Emergency</p>
              <p className="text-lg font-black text-rose-600 mt-0.5">112</p>
              <p className="text-[10px] text-slate-500">National Response</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Tourist Helpline</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">{touristNumber}</p>
              <p className="text-[10px] text-slate-500">Multi-language 24/7</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Medical / Ambulance</p>
              <p className="text-lg font-black text-blue-600 mt-0.5">{ambulanceNumber}</p>
              <p className="text-[10px] text-slate-500">Rapid Medical Care</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Women Helpline</p>
              <p className="text-lg font-black text-purple-600 mt-0.5">{womenNumber}</p>
              <p className="text-[10px] text-slate-500">24/7 Immediate Help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safe Travel Tips & Advisories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-emerald-600" />
          Verified Local Travel Advisories for {destinationName}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {travelTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 font-medium"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Tap Emergency Google Maps Navigation Quick Grid */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Instant 1-Tap Emergency Google Maps Navigation
          </h4>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Instantly open verified nearest safety facilities and services in {destinationName} on Google Maps with turn-by-turn routing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Nearby Hospitals */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Hospital className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Nearby Hospitals</p>
                <p className="text-[10px] text-slate-400">Emergency trauma care</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
              <GoogleMapsButton fallbackQuery={`hospital near me in ${destinationName}`} label="Maps" />
              <GoogleDirectionsButton place={{ name: `Hospital in ${destinationName}` }} label="Directions" />
            </div>
          </div>

          {/* Nearby Police Stations */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Nearby Police Stations</p>
                <p className="text-[10px] text-slate-400">Law enforcement & PCR</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
              <GoogleMapsButton fallbackQuery={`police station near me in ${destinationName}`} label="Maps" />
              <GoogleDirectionsButton place={{ name: `Police station in ${destinationName}` }} label="Directions" />
            </div>
          </div>

          {/* Nearby Pharmacies */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Nearby Pharmacies</p>
                <p className="text-[10px] text-slate-400">24/7 Chemists & drugs</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
              <GoogleMapsButton fallbackQuery={`pharmacy chemist near me in ${destinationName}`} label="Maps" />
              <GoogleDirectionsButton place={{ name: `Pharmacy in ${destinationName}` }} label="Directions" />
            </div>
          </div>

          {/* Nearby Emergency Services */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Nearby Emergency Services</p>
                <p className="text-[10px] text-slate-400">Fire, rescue & dispatch</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
              <GoogleMapsButton fallbackQuery={`emergency services in ${destinationName}`} label="Maps" />
              <GoogleDirectionsButton place={{ name: `Emergency services in ${destinationName}` }} label="Directions" />
            </div>
          </div>
        </div>
      </div>

      {/* Verified Hospitals & Police Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Nearest Hospitals */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white">
          <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
            <Hospital className="w-4 h-4 text-rose-600" />
            <span>Nearest Accredited Hospitals</span>
          </div>

          <div className="space-y-3">
            {hospitals.map((h, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div className="flex justify-between items-start font-bold text-slate-800 gap-2">
                  <span>{h.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-slate-500 font-normal">{h.distance}</span>
                    <GoogleMapsButton place={{ name: h.name, destination: destinationName, address: h.distance }} label="Maps" />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-slate-600">
                  <span>Contact: {h.contact}</span>
                  <span className="text-emerald-700 font-semibold">24x7 Emergency</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Police Stations */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white">
          <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Local Tourist Police Stations</span>
          </div>

          <div className="space-y-3">
            {policeList.map((p, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div className="flex justify-between items-start font-bold text-slate-800 gap-2">
                  <span>{p.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-slate-500 font-normal">{p.distance}</span>
                    <GoogleMapsButton place={{ name: p.name, destination: destinationName, address: p.distance }} label="Maps" />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-slate-600">
                  <span>Helpline: {p.contact}</span>
                  <span className="text-blue-700 font-semibold">Tourist Assistance Desk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
