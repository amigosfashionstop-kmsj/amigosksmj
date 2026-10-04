import React from 'react';
import Link from 'next/link';
import { Tag, Sparkles } from 'lucide-react';

const PRICE_TIERS = [
  {
    title: 'Under ₹500',
    subtitle: 'Daily & College Wear',
    description: 'Everyday pure cotton and rayon kurtis',
    range: 'under-500',
    count: '9 Styles',
    color: 'from-amber-50 to-orange-50 border-amber-200'
  },
  {
    title: '₹500 – ₹999',
    subtitle: 'Office & Casual Chic',
    description: 'Flared anarkalis, straight kurtas & sets',
    range: '500-999',
    count: '18 Styles',
    color: 'from-rose-50 to-pink-50 border-rose-200'
  },
  {
    title: '₹1,000 – ₹1,499',
    subtitle: 'Work & Weekend Sets',
    description: 'Coordinated kurti pant sets with refined detailing',
    range: '1000-1499',
    count: '10 Styles',
    color: 'from-stone-50 to-amber-50 border-stone-300'
  },
  {
    title: '₹1,500+',
    subtitle: 'Celebration & Festive Wear',
    description: 'Chanderi silk, georgette shararas & dupatta sets',
    range: '1500-above',
    count: '8 Styles',
    color: 'from-purple-50 to-brand-rose-light border-purple-200'
  }
];

export function ShopByPrice() {
  return (
    <section className="py-16 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-brand-wine uppercase tracking-widest">
            Affordable Luxury
          </span>
          <h2 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">
            Shop by Budget
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Quality ethnic wear made accessible for every celebration and everyday comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICE_TIERS.map(tier => (
            <Link
              key={tier.range}
              href={`/shop?price=${tier.range}`}
              className={`group p-6 rounded-xl border bg-gradient-to-br ${tier.color} hover:shadow-md transition-all duration-200 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-wine bg-white/80 px-2 py-0.5 rounded shadow-xs">
                  {tier.count}
                </span>
                <Tag className="w-4 h-4 text-stone-400 group-hover:text-brand-wine transition-colors" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-brand-charcoal group-hover:text-brand-wine transition-colors">
                {tier.title}
              </h3>
              <p className="text-xs font-semibold text-stone-700 mt-0.5">
                {tier.subtitle}
              </p>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {tier.description}
              </p>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-brand-wine">
                <span>Explore Styles</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
