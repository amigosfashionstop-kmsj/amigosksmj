import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

const INSTA_IMAGES = [
  { src: '/images/catalog/afs-009-main.jpg', alt: 'Poly Silk Coral Set' },
  { src: '/images/catalog/afs-012-main.jpg', alt: 'Chanderi Silk Seafoam Set' },
  { src: '/images/catalog/afs-013-main.jpg', alt: 'Dusty Rose Kaftan Set' },
  { src: '/images/catalog/afs-022-main.jpg', alt: 'Navy Pure Cotton Kurta' },
  { src: '/images/catalog/afs-035-main.jpg', alt: 'Indigo Floral Pant Set' },
  { src: '/images/catalog/afs-044-main.jpg', alt: 'Sunset Coral Lehenga Set' }
];

export function InstagramSection() {
  return (
    <section className="py-16 bg-[#FAF7F2] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-brand-wine uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-brand-wine" />
            <span>@amigosfashionstop</span>
          </span>
          <h2 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">
            See What’s Happening at Amigos
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Follow us for new arrivals, product highlights, styling inspiration, and boutique updates.
          </p>
        </div>

        {/* 6-image Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INSTA_IMAGES.map((img, i) => (
            <a
              key={i}
              href={STORE_INFO.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-stone-100 shadow-xs block"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brand-wine/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6 transform -translate-y-2 group-hover:translate-y-0 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={STORE_INFO.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-300 hover:border-brand-wine text-stone-800 hover:text-brand-wine text-xs font-bold rounded-full uppercase tracking-wider transition-all shadow-xs"
          >
            <Instagram className="w-4 h-4 text-brand-wine" />
            <span>Follow @amigosfashionstop</span>
          </a>
        </div>
      </div>
    </section>
  );
}
