import React, { useState } from 'react';
import { Store, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { saveNewBusiness } from '../data/businessData';
import { BusinessListing } from '../types';

interface BusinessFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBusinessAdded: (newListing: BusinessListing) => void;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({
  isOpen,
  onClose,
  onBusinessAdded
}) => {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<BusinessListing['category']>('Local Guide');
  const [location, setLocation] = useState('Vijayawada');
  const [priceRange, setPriceRange] = useState('₹300 - ₹800');
  const [contact, setContact] = useState('+91 98480 11223');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !description.trim()) return;

    const created = saveNewBusiness({
      businessName: businessName.trim(),
      category,
      location: location.trim(),
      priceRange: priceRange.trim(),
      contact: contact.trim(),
      description: description.trim()
    });

    setIsSuccess(true);
    setTimeout(() => {
      onBusinessAdded(created);
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 w-fit">
          <Store className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local Partner Onboarding</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          Promote Your Local Business
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          List your service on TravelMate AI to receive direct bookings from smart travellers with 0% middleman commission.
        </p>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Business Registered!</h4>
            <p className="text-xs text-slate-600">
              Your listing is now live in the TravelMate AI partner directory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business / Enterprise Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amaravati Heritage Guides"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white cursor-pointer"
                >
                  <option value="Local Guide">Local Guide</option>
                  <option value="Hotel">Hotel / Homestay</option>
                  <option value="Restaurant">Restaurant / Food Stall</option>
                  <option value="Transport Provider">Transport Provider</option>
                  <option value="Handicraft Seller">Handicraft / Artisan</option>
                  <option value="Tour Operator">Tour Operator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Operating Location / City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vijayawada Railway Station"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Typical Price Range *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹400 - ₹800 per tour"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98480 12345"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description of Services & Heritage Specialty *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain what makes your service unique (e.g. bilingual storytelling, homemade organic meals, clean AC cabs)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white resize-none"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Register Listing Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
