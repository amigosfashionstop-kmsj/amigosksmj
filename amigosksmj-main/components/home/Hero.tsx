import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] py-12 md:py-20 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-wine/10 border border-brand-wine/20 text-brand-wine text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
              <span>Boutique Design • Wholesale • Retail</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-charcoal leading-[1.15] tracking-tight">
              Your style. <br />
              Your comfort. <br />
              <span className="text-brand-wine italic font-normal">Your Amigos.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover thoughtfully selected women’s ethnic wear, from breathable everyday kurtis to festive kurti sets made for modern Indian wardrobes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/shop?filter=new-arrivals"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 bg-white border border-stone-300 hover:border-brand-wine text-stone-800 hover:text-brand-wine rounded-md font-semibold text-sm transition-all flex items-center justify-center"
              >
                Explore All Kurtis
              </Link>

              <a
                href={`https://wa.me/${STORE_INFO.primaryWhatsApp}?text=${encodeURIComponent("Hi Amigos Fashionstop! 👋 I would like assistance choosing kurtis from your new collection.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat with Us</span>
              </a>
            </div>

            {/* Micro Trust Proof */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="block font-serif text-lg font-bold text-brand-wine">45+</span>
                <span className="text-[11px] text-stone-500 font-medium">Authentic Styles</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-brand-wine">100%</span>
                <span className="text-[11px] text-stone-500 font-medium">Pure Fabrics</span>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-brand-wine">Titwala</span>
                <span className="text-[11px] text-stone-500 font-medium">Flagship Boutique</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Primary Large Editorial Image */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/catalog/afs-001-main.jpg"
                  alt="Amigos Fashion Stop Featured Kurti"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-wine px-2 py-0.5 rounded">
                    Bestselling Set
                  </span>
                  <p className="font-serif text-lg font-semibold mt-1">AFS 001 Cotton Kurti Set</p>
                  <p className="text-xs text-stone-200">₹890 <span className="line-through text-stone-400 text-[10px]">₹990</span></p>
                </div>
              </div>

              {/* Floating Accent Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-xl shadow-xl border border-stone-100 flex items-center gap-3 max-w-[220px]">
                <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  <Image src="/images/catalog/afs-014-main.jpg" alt="Marigold Yellow Kurti" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-brand-charcoal leading-tight">Marigold Set</p>
                  <p className="text-[10px] text-brand-wine font-semibold mt-0.5">Pure Cotton</p>
                  <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
