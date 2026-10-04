import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { STORE_INFO } from '@/lib/data/store-info';
import { HeartHandshake, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Our Story: Friends to Friends | Amigos Fashionstop",
  description: "Learn about the heart behind Amigos Fashionstop. We curate contemporary Indian ethnic wear with boutique warmth and personal friendship.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Brand Crest & Heading */}
        <div className="text-center space-y-4 mb-12">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src="/images/brand/logo.png"
              alt="Amigos Fashion Stop Crest"
              fill
              className="object-contain"
            />
          </div>

          <span className="text-xs font-bold text-brand-wine uppercase tracking-widest bg-brand-wine/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Our Journey</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-charcoal">
            Friends to Friends.
          </h1>

          <p className="font-serif text-lg text-brand-wine italic">
            &ldquo;Our Passion, Your Fashion&rdquo;
          </p>
        </div>

        {/* Narrative Content */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200/80 shadow-xs space-y-6 text-stone-700 leading-relaxed text-sm">
          <p className="text-base sm:text-lg text-brand-charcoal font-medium leading-relaxed">
            <strong className="text-brand-wine">Amigos Fashionstop</strong> was created around a simple, heartfelt idea: fashion feels better when the experience feels personal.
          </p>

          <p>
            The word <strong>&ldquo;Amigos&rdquo;</strong> means friends, and that spirit is at the heart of everything we do. Customers should never feel like they are dealing with a cold, faceless ecommerce conglomerate. When you connect with us, you are shopping with women who understand the joy of finding a kurti that feels breezy, flattering, and effortless.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-stone-200 text-center">
            <div className="p-4 bg-[#FAF7F2] rounded-xl">
              <span className="block font-serif text-xl font-bold text-brand-wine">DESIGN</span>
              <span className="text-xs text-stone-500 mt-1 block">Handpicked artisan silhouettes & prints</span>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-xl">
              <span className="block font-serif text-xl font-bold text-brand-wine">WHOLESALE</span>
              <span className="text-xs text-stone-500 mt-1 block">Empowering local retailers & boutiques</span>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-xl">
              <span className="block font-serif text-xl font-bold text-brand-wine">RETAIL</span>
              <span className="text-xs text-stone-500 mt-1 block">Direct boutique care to every customer</span>
            </div>
          </div>

          <p>
            We bring together contemporary Indian fashion and everyday ethnic wear with an uncompromising focus on style, comfort, and inclusive choices. From breathable pure cottons that survive sultry summer afternoons to festive chanderi silk and georgette sets for family celebrations, each piece in our wardrobe is thoughtfully selected.
          </p>

          <p>
            Whether you are shopping for yourself, looking for your next favourite work outfit, or enquiring about wholesale opportunities for your own shop, we want every interaction to feel welcoming, honest, and genuine.
          </p>

          {/* Boutique Founders Note */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-base font-bold text-brand-charcoal">With love & warmth,</p>
              <p className="text-xs text-brand-wine font-semibold">Samruddhi, Juily & Vaidehi</p>
              <p className="text-[11px] text-stone-400">Titwala Flagship Boutique, Maharashtra</p>
            </div>

            <Link
              href="/shop"
              className="px-6 py-3 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
