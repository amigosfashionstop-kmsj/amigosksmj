import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Phone, Navigation, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

export function StoreBanner() {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${STORE_INFO.name}, ${STORE_INFO.address.line1}, ${STORE_INFO.address.city}, Maharashtra ${STORE_INFO.address.pincode}`
  )}`;

  return (
    <section className="py-16 bg-brand-wine text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gold bg-black/30 px-2.5 py-1 rounded">
              Flagship Experience
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Visit Our Titwala Boutique
            </h2>

            <p className="text-stone-200 text-sm leading-relaxed max-w-xl">
              Experience fabrics up close, try your favorite kurti cuts, and enjoy warm, personal shopping assistance at our flagship boutique in Manda Titwala (East).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Address:</strong>
                  <span className="text-stone-300">{STORE_INFO.address.line1}, {STORE_INFO.address.area}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Hours:</strong>
                  <span className="text-stone-300">Mon–Sat: 9AM–9PM • Sun: 9AM–5PM</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-brand-gold hover:bg-[#b8955b] text-brand-charcoal font-bold text-xs rounded-md shadow flex items-center gap-2 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${STORE_INFO.primaryPhone}`}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-md border border-white/20 flex items-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>

              <Link
                href="/visit-us"
                className="px-4 py-2.5 text-xs text-stone-300 hover:text-white flex items-center gap-1 font-medium"
              >
                <span>Store Page & Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Map Preview Badge */}
          <div className="lg:col-span-5 bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/15">
            <h3 className="font-serif text-lg font-bold text-white mb-3">
              Connect Directly with Our Team
            </h3>
            <div className="space-y-3">
              {STORE_INFO.contacts.map(contact => (
                <div key={contact.name} className="flex items-center justify-between p-2.5 bg-black/20 rounded-lg text-xs">
                  <div>
                    <p className="font-semibold text-white">{contact.name}</p>
                    <p className="text-[10px] text-stone-300">{contact.role}</p>
                  </div>
                  <a
                    href={`https://wa.me/${contact.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded font-medium text-[11px] transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
