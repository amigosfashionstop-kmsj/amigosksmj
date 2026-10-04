import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNewArrivals, getFeaturedProducts } from '@/lib/data/server-products';
import { ProductCard } from '@/components/ui/ProductCard';

export function FeaturedSection() {
  const newArrivals = getNewArrivals().slice(0, 8);

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-brand-wine uppercase tracking-widest">
              Fresh Off The Loom
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">
              Fresh Styles, Just In
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Discover the latest additions to the Amigos wardrobe.
            </p>
          </div>
          <Link
            href="/shop?filter=new-arrivals"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-wine hover:text-brand-wine-dark uppercase tracking-wider group"
          >
            <span>View All New In</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
