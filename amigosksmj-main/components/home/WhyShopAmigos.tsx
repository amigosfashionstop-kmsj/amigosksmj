import React from 'react';
import { Sparkles, ShoppingBag, Ruler, MessageCircle } from 'lucide-react';

const TRUST_CARDS = [
  {
    icon: Sparkles,
    title: 'Curated Styles',
    description: 'Thoughtfully selected women’s fashion with breathable fabrics and modern cuts for Indian lifestyles.'
  },
  {
    icon: ShoppingBag,
    title: 'Easy Shopping',
    description: 'Discover online and order from the comfort of home with secure payment and Pan-India tracking.'
  },
  {
    icon: Ruler,
    title: 'Multiple Sizes',
    description: 'Selected styles tailored across Small, Medium, Large, XL, and up to 3XL with true-to-fit sizing.'
  },
  {
    icon: MessageCircle,
    title: 'Friendly Support',
    description: 'Need help? Reach out directly through WhatsApp for fabric questions, sizing checks, and orders.'
  }
];

export function WhyShopAmigos() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold text-brand-wine uppercase tracking-widest">
            The Amigos Promise
          </span>
          <h2 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">
            Why Shop with Amigos?
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Boutique warmth, transparent pricing, and personal care in every parcel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-6 rounded-xl bg-[#FAF7F2] border border-stone-200/70 text-center flex flex-col items-center hover:border-brand-rose/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-charcoal mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
