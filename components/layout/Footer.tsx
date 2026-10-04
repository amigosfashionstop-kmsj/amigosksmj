import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle, ShieldCheck, Heart } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white/10 rounded-full p-1 border border-white/20">
                <Image
                  src="/images/brand/logo.png"
                  alt="Amigos Fashion Stop Crest"
                  fill
                  className="object-contain p-0.5 filter invert"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide uppercase">
                  Amigos Fashionstop
                </h3>
                <p className="text-[10px] text-brand-gold font-medium uppercase tracking-widest">
                  Our Passion, Your Fashion
                </p>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              Amigos means &ldquo;friends&rdquo;. We curate modern Indian ethnic wear with thoughtful comfort, premium fabrics, and welcoming boutique care. Discover our collections online, connect via WhatsApp, or visit our flagship store in Titwala.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={STORE_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-brand-wine text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${STORE_INFO.primaryWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-stone-500 pl-2">
                Follow @amigosfashionstop for daily new drops
              </span>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 border-l-2 border-brand-wine pl-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li><Link href="/shop/kurti-sets" className="hover:text-white transition-colors">Kurti Sets (2 & 3 Piece)</Link></li>
              <li><Link href="/shop/long-kurtis" className="hover:text-white transition-colors">Long Kurtis (Office & Daily)</Link></li>
              <li><Link href="/shop/short-kurtis" className="hover:text-white transition-colors">Short Kurtis (Denim & Casual)</Link></li>
              <li><Link href="/shop/clearance" className="text-rose-400 hover:text-rose-300 transition-colors">Clearance Markdowns</Link></li>
              <li><Link href="/shop?filter=cotton" className="hover:text-white transition-colors">100% Pure Cotton Range</Link></li>
              <li><Link href="/shop?filter=silk" className="hover:text-white transition-colors">Chanderi & Poly Silk Festive</Link></li>
            </ul>
          </div>

          {/* Customer & Care */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 border-l-2 border-brand-wine pl-2">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide & Fit Tips</Link></li>
              <li><Link href="/policies#shipping" className="hover:text-white transition-colors">Shipping & Pincodes</Link></li>
              <li><Link href="/policies#returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/wholesale" className="hover:text-white transition-colors">Wholesale & Bulk Orders</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">Fashion Styling Journal</Link></li>
              <li><Link href="/policies#privacy" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>

          {/* Titwala Store Visit */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 border-l-2 border-brand-wine pl-2">
              Titwala Boutique
            </h4>
            <div className="space-y-3 text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-rose shrink-0 mt-0.5" />
                <span>{STORE_INFO.address.line1}, {STORE_INFO.address.city}, Maharashtra {STORE_INFO.address.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Mon–Sat: 9AM–9PM | Sun: 9AM–5PM</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${STORE_INFO.primaryPhone}`} className="hover:text-white">{STORE_INFO.primaryPhone}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-white">{STORE_INFO.email}</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-4">
          <p>© {new Date().getFullYear()} Amigo&apos;s Fashion Stop. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Verified Boutique Quality
            </span>
            <span>•</span>
            <Link href="/admin" className="hover:text-stone-300">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
