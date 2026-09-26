import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

export const metadata = {
  title: "Visit Titwala Boutique | Amigos Fashionstop - Address, Timings & Directions",
  description: "Visit our flagship ethnic wear boutique in Manda Titwala (East), Maharashtra. Experience authentic kurtis, sets, and festive outfits in person.",
};

export default function VisitUsPage() {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Amigos Fashionstop, ${STORE_INFO.address.line1}, ${STORE_INFO.address.city}, Maharashtra 421605`
  )}`;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-brand-wine uppercase tracking-widest bg-brand-wine/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <span>Titwala Flagship Store</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-charcoal">
            Visit Amigos in Titwala
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Feel the pure cotton textures, try your ideal kurti sizes, and enjoy personalized styling guidance from our welcoming team.
          </p>
        </div>

        {/* Store Detail Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Location, Hours, Contact */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Box */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                Flagship Boutique
              </h2>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div>
                    <strong className="block text-brand-charcoal text-sm">Primary Store Address:</strong>
                    <p className="leading-relaxed mt-0.5">
                      {STORE_INFO.address.line1}<br />
                      {STORE_INFO.address.area}<br />
                      {STORE_INFO.address.city}, {STORE_INFO.address.state} - {STORE_INFO.address.pincode}<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-start gap-3 text-stone-500">
                  <span className="font-semibold text-brand-wine">Alternate:</span>
                  <span>{STORE_INFO.address.alternateAddress}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${STORE_INFO.primaryPhone}`}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>
              </div>
            </div>

            {/* Timings Box */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-brand-charcoal flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span>Operating Boutique Hours</span>
              </h3>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="font-medium text-stone-800">Monday � Saturday</span>
                  <span className="font-bold text-brand-wine">9:00 AM � 9:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-stone-800">Sunday</span>
                  <span className="font-bold text-brand-wine">9:00 AM � 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Boutique Coordinators */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-brand-charcoal">
                Meet Your Amigos Team
              </h3>
              <div className="space-y-2.5 text-xs">
                {STORE_INFO.contacts.map(c => (
                  <div key={c.name} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                    <div>
                      <p className="font-bold text-brand-charcoal">{c.name}</p>
                      <p className="text-[10px] text-stone-500">{c.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${c.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#25D366] text-white rounded hover:bg-[#20ba59]"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      </a>
                      <a
                        href={`tel:${c.phone}`}
                        className="p-1.5 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Embed & Directions Guide */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs">
              <div className="p-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-charcoal">
                  Interactive Map � Titwala (East)
                </span>
                <span className="text-[10px] text-brand-wine font-semibold uppercase">
                  Maharashtra 421605
                </span>
              </div>
              <div className="relative aspect-[16/10] w-full bg-stone-100">
                <iframe
                  title="Amigos Fashion Stop Location in Titwala"
                  src="https://maps.google.com/maps?q=Mayuresh%20Nagar%20CHS,%20Ganesh%20Mandir%20Road,%20Titwala,%20Maharashtra%20421605&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* How to Reach Us */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-3 text-xs text-stone-600">
              <h3 className="font-serif text-base font-bold text-brand-charcoal">
                How to Reach Our Store:
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                <li><strong>From Titwala Railway Station (East):</strong> Auto-rickshaws are readily available. Ask for Mayuresh Nagar CHS on Ganesh Mandir Road (approx. 5�7 minutes drive).</li>
                <li><strong>Near Sacred Ganesh Mandir:</strong> Located along the main Ganesh Mandir Road corridor, convenient for devotees and shoppers visiting the famous temple.</li>
                <li><strong>Store Pickup Available:</strong> Place your order online or via WhatsApp and select store pickup to try on your garments immediately.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
