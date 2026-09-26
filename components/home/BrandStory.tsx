import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, ArrowRight } from 'lucide-react';

export function BrandStory() {
  return (
    <section className="py-20 bg-[#F4EFE6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Composition */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/catalog/afs-032-main.jpg"
                alt="Amigos Cotton Anarkali Set"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md mt-8">
              <Image
                src="/images/catalog/afs-037-main.jpg"
                alt="Amigos Georgette Sharara Set"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Right Text Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-wine uppercase tracking-widest">
              <HeartHandshake className="w-4 h-4 text-brand-wine" />
              <span>Friends to Friends</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal leading-tight">
              Made for the moments that matter.
            </h2>

            <p className="text-base text-stone-700 leading-relaxed font-normal">
              At <strong className="text-brand-charcoal">Amigos Fashionstop</strong>, we believe fashion should feel personal. From simple everyday looks to outfits that make you feel a little extra special, our collections are chosen to bring together comfort, colour, confidence, and contemporary Indian style.
            </p>

            <p className="text-sm text-stone-600 leading-relaxed">
              The word <span className="italic font-serif text-brand-wine font-semibold">&ldquo;Amigos&rdquo;</span> means friends. That spirit is at the heart of everything we do—whether you are visiting our boutique in Titwala, ordering online from across Maharashtra, or reaching out on WhatsApp for styling tips.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-wine hover:bg-brand-wine-dark text-white text-xs font-semibold rounded-md shadow-sm transition-all group"
              >
                <span>Explore Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
