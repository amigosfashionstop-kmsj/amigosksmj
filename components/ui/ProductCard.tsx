'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, MessageCircle, Eye } from 'lucide-react';
import { Product } from '@/lib/data/products';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Badge } from './Badge';
import { useCart } from '@/lib/store/cart-store';
import { useWishlist } from '@/lib/store/wishlist-store';
import { generateProductWhatsAppUrl } from '@/lib/services/whatsapp';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Free');
  const [isAdding, setIsAdding] = useState(false);

  const price = product.isClearance ? product.salePrice : product.price;
  const discount = calculateDiscount(product.mrp, price);
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, selectedSize, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const whatsappUrl = generateProductWhatsAppUrl(product, selectedSize);

  return (
    <div className="group relative bg-white border border-stone-200/80 rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:border-brand-rose/40">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 block">
        {/* Main Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Alternate Image if available */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate angle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isClearance && (
            <Badge variant="sale">Clearance</Badge>
          )}
          {product.isNewArrival && !product.isClearance && (
            <Badge variant="wine">New In</Badge>
          )}
          {discount > 0 && (
            <span className="bg-brand-wine text-white font-bold text-[10px] tracking-wider px-1.5 py-0.5 rounded shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:scale-110 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'fill-brand-wine text-brand-wine' : 'text-stone-600 hover:text-brand-wine'
            }`}
          />
        </button>

        {/* Fabric Tag Overlay */}
        <div className="absolute bottom-2 left-2.5 z-10">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {product.fabric}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Code & Category */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
          <span className="font-semibold text-brand-wine tracking-wide">{product.code}</span>
          <span>{product.categoryName}</span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="group-hover:text-brand-wine transition-colors">
          <h3 className="text-sm font-medium text-brand-charcoal line-clamp-1 mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-2.5">
          <span className="text-base font-bold text-brand-wine">
            {formatPrice(price)}
          </span>
          {product.mrp > price && (
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>

        {/* Size Selection Pills */}
        <div className="mb-3">
          <div className="text-[11px] text-stone-500 mb-1 flex items-center justify-between">
            <span>Select Size:</span>
            <span className="font-semibold text-stone-700">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`text-[11px] px-2 py-0.5 rounded border font-medium transition-all ${
                  selectedSize === size
                    ? 'border-brand-wine bg-brand-wine text-white'
                    : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-stone-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Card Actions (Add to Cart & WhatsApp) */}
        <div className="mt-auto pt-2 grid grid-cols-5 gap-1.5 border-t border-stone-100">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="col-span-4 flex items-center justify-center gap-1.5 py-2 px-2 bg-brand-wine hover:bg-brand-wine-dark text-white rounded text-xs font-medium transition-all shadow-sm active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Added!' : 'Add to Cart'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enquire on WhatsApp"
            title="Chat about this item on WhatsApp"
            className="col-span-1 flex items-center justify-center p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.8 11.8 0 0 0-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
