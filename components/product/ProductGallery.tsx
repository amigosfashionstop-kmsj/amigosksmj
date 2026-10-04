'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const imageLabels = ['Front View', 'Side Angle', 'Detail / Neck', 'Catalog Sheet'];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-28">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-visible pb-2 md:pb-0 shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`relative w-16 h-20 md:w-20 md:h-24 rounded-md overflow-hidden border-2 transition-all shrink-0 bg-stone-100 ${
              activeIdx === i ? 'border-brand-wine shadow-sm' : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${i + 1}`}
              fill
              className="object-cover object-top"
            />
          </button>
        ))}
      </div>

      {/* Main Stage Image */}
      <div className="flex-1">
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs group">
          <Image
            src={images[activeIdx]}
            alt={`${productName} - ${imageLabels[activeIdx] || 'Angle'}`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-full pointer-events-none">
            {imageLabels[activeIdx] || `Photo ${activeIdx + 1}`}
          </div>
        </div>
      </div>
    </div>
  );
}
