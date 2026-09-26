import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getDynamicCategories } from '@/lib/data/server-products';

export function CollectionTiles() {
  const CATEGORIES = getDynamicCategories();
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-brand-wine uppercase tracking-widest">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal mt-1.5">
            Explore Amigos Wardrobe
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Every piece is selected for pure comfort, flattering silhouettes, and authentic Indian grace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group relative h-96 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity" />

              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold tracking-tight">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-brand-wine transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-xs text-stone-200 mt-1 line-clamp-2 leading-relaxed font-light">
                  {cat.headline}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    {cat.count} Styles
                  </span>
                  <span className="text-[11px] font-medium underline text-stone-300 group-hover:text-white transition-colors">
                    Browse Category →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
