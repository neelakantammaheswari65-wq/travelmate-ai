import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Download, 
  Building2, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Sparkles,
  Info,
  Bell
} from 'lucide-react';
import { GeneratedTripPlan, ItinerarySlot, Hotel, LocalExperience } from '../types';
import { GoogleMapsButton, GoogleDirectionsButton } from '../services/googleMaps';

// ==========================================
// 1. EMERGENCY SOS MODAL
// ==========================================
interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, destinationName }) => {
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'transmitting' | 'confirmed'>('idle');

  if (!isOpen) return null;

  const triggerDistress = () => {
    setDispatchStatus('transmitting');
    setTimeout(() => {
      setDispatchStatus('confirmed');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider mb-4 w-fit border border-rose-200">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-ping" />
          <span>Emergency Tourist Protection Protocol</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Tourist Distress Signal (SOS)
        </h3>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Instantly transmit your live GPS coordinates to the nearest Police Control Room, Tourist Police Desk, and Emergency Medical Services.
        </p>

        {/* GPS Coordinates Simulation */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div className="flex justify-between text-slate-500">
            <span>Location:</span>
            <strong className="text-slate-900">{destinationName} Active Circuit</strong>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Coordinates:</span>
            <span className="font-mono text-slate-800 font-semibold">16.5062° N, 80.6480° E (±4m accuracy)</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Status:</span>
            <span className="text-emerald-700 font-bold">GPS Locked & Network Active</span>
          </div>
        </div>

        {/* Direct One-Tap Dial Numbers */}
        <div className="mt-4 space-y-2">
          <a
            href="tel:112"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-600/20 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4" />
              <span>Call National Emergency (112)</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Toll-Free</span>
          </a>

          <a
            href="tel:1363"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4" />
              <span>National Tourist Helpline (1363)</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">24x7 Multi-Lang</span>
          </a>
        </div>

        {/* Rapid GPS Maps Navigation */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <GoogleMapsButton
            fallbackQuery={`hospital near me in ${destinationName}`}
            label="Nearby Hospitals"
            className="w-full justify-center text-center"
          />
          <GoogleMapsButton
            fallbackQuery={`police station near me in ${destinationName}`}
            label="Nearby Police"
            className="w-full justify-center text-center"
          />
        </div>

        {/* Dispatch Alert Simulation */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {dispatchStatus === 'confirmed' ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Distress Signal Transmitted & Logged!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Local patrol unit and emergency contact notified with your itinerary coordinates.
              </p>
            </div>
          ) : (
            <button
              onClick={triggerDistress}
              disabled={dispatchStatus === 'transmitting'}
              className="w-full py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              {dispatchStatus === 'transmitting' ? 'Broadcasting Coordinates...' : 'Broadcast Silent Geo-Alert to Police Station'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SHARE TRIP MODAL
// ==========================================
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: GeneratedTripPlan;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, trip }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tripSummary = `🚀 My TravelMate AI Itinerary for ${trip.destinationName}
📅 Duration: ${trip.input.days} Days • ${trip.input.travellers} Travellers
💰 Budget: ₹${trip.budget.total.toLocaleString('en-IN')} (Target: ₹${trip.input.budget.toLocaleString('en-IN')})
🛡️ Safety Score: ${trip.safety.overallSafetyScore}/100 • 🌱 Eco Score: ${trip.sustainability.sustainabilityScore}/100
🏨 Accommodation: ${trip.selectedHotel.name}
✨ Generated on TravelMate AI - Explore Smarter. Travel Better.`;

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(tripSummary).catch(() => {});
      }
    } catch {
      // Ignore iframe clipboard permission restrictions
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 w-fit">
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Share Itinerary</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          Share Your Travel Plan
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Export your generated travel plan to share with co-travellers or save for offline access.
        </p>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 whitespace-pre-line max-h-48 overflow-y-auto">
          {tripSummary}
        </div>

        <div className="mt-5 space-y-2">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary to Clipboard!' : 'Copy Travel Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. HOTEL BOOKING MODAL
// ==========================================
interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  trip: GeneratedTripPlan;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  isOpen,
  onClose,
  hotel,
  trip
}) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !hotel) return null;

  const nights = Math.max(1, trip.input.days - 1);
  const rooms = Math.ceil(trip.input.travellers / 2);
  const totalCost = hotel.pricePerNight * nights * rooms;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 w-fit">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Direct Partner Reservation</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          Book {hotel.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Zero-commission direct booking through TravelMate AI partner network.
        </p>

        {confirmed ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Reservation Confirmed!</h4>
            <p className="text-xs text-slate-600">Confirmation ID: TM-{Date.now().toString().slice(-6)}</p>
            <p className="text-[11px] text-slate-400">Pay at hotel upon check-in. Free cancellation anytime.</p>
          </div>
        ) : (
          <>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Room Rate:</span>
                <strong className="text-slate-900">₹{hotel.pricePerNight}/night</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Stay Duration:</span>
                <span>{nights} {nights === 1 ? 'Night' : 'Nights'} ({rooms} {rooms === 1 ? 'Room' : 'Rooms'})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <span>{hotel.proximity}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Total Estimated Cost:</span>
                <span className="text-emerald-700">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. SLOT DETAIL MODAL
// ==========================================
interface SlotDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: ItinerarySlot | null;
}

export const SlotDetailModal: React.FC<SlotDetailModalProps> = ({ isOpen, onClose, slot }) => {
  if (!isOpen || !slot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-3 w-fit">
          <span>{slot.category}</span>
          <span>•</span>
          <span>{slot.time}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          {slot.activityTitle}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Location: {slot.locationName}
        </p>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          {slot.description}
        </p>

        <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Why TravelMate AI Picked This:
          </p>
          <p className="text-emerald-950 font-medium">{slot.recommendationReason}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Estimated Cost</span>
            <span className="font-extrabold text-slate-900">
              {slot.estimatedCost === 0 ? 'Free' : `₹${slot.estimatedCost}`}
            </span>
          </div>
          <div className="border-x border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block">Duration</span>
            <span className="font-extrabold text-slate-900">{slot.durationHours} hrs</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Safety Index</span>
            <span className="font-extrabold text-emerald-700">{slot.safetyScore}/100</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <GoogleMapsButton place={slot} label="Open in Google Maps" className="flex-1 justify-center py-2.5" />
            <GoogleDirectionsButton place={slot} label="Get Directions" className="flex-1 justify-center py-2.5" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. NOTIFICATIONS MODAL
// ==========================================
interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 1,
      title: 'Festival Advisory: Kanaka Durga Temple Special Darshan',
      time: '15 mins ago',
      desc: 'Morning hours (07:00 AM - 10:00 AM) experience heavy devotee influx. Free shuttle buses running from Railway Station.',
      type: 'Advisory'
    },
    {
      id: 2,
      title: 'Green Transit Update: Free Electric Rickshaw Hub',
      time: '2 hours ago',
      desc: 'New battery-swapping solar e-rickshaws stationed at Prakasam Barrage tourist terminus.',
      type: 'Eco'
    },
    {
      id: 3,
      title: 'GI-Artisan Fair in Kondapalli',
      time: 'Yesterday',
      desc: '20 master wooden toy craftsmen conducting live carving demonstrations this weekend.',
      type: 'Cultural'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 w-fit">
          <Bell className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-Time Travel Intelligence</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          Destination Alerts & Updates
        </h3>

        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{alert.title}</span>
                <span className="text-[10px] text-slate-400">{alert.time}</span>
              </div>
              <p className="text-slate-600 mt-1">{alert.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
