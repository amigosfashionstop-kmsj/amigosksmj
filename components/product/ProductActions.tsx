'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data/products';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-store';
import { useWishlist } from '@/lib/store/wishlist-store';
import { generateProductWhatsAppUrl } from '@/lib/services/whatsapp';
import { checkPincode, PincodeCheckResult } from '@/lib/services/shipping';
import { AccordionItem } from '@/components/ui/Accordion';
import { SizeGuideModal } from './SizeGuideModal';
import { Heart, ShoppingBag, Zap, MessageCircle, MapPin, Check, Truck, Shield, Sparkles, HelpCircle } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [pincodeInput, setPincodeInput] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckResult | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const price = product.isClearance ? product.salePrice : product.price;
  const discount = calculateDiscount(product.mrp, price);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, selectedSize, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setIsCartOpen(true);
    }, 400);
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, quantity);
    router.push('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim()) {
      const res = checkPincode(pincodeInput);
      setPincodeResult(res);
    }
  };

  const whatsappUrl = generateProductWhatsAppUrl(product, selectedSize);

  return (
    <div className="space-y-6">
      {/* Code & Category Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-brand-wine uppercase tracking-wider bg-brand-wine/10 px-2.5 py-1 rounded">
          SKU: {product.code}
        </span>
        <span className="text-stone-500 font-medium">{product.categoryName}</span>
      </div>

      {/* Product Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal leading-snug">
          {product.name}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Fabric: <strong className="text-stone-700">{product.fabric}</strong> • Colour: <strong className="text-stone-700">{product.color}</strong>
        </p>
      </div>

      {/* Pricing and Discount Callout */}
      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-brand-wine font-sans">
            {formatPrice(price)}
          </span>
          {product.mrp > price && (
            <>
              <span className="text-base text-stone-400 line-through">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Save {discount}%
              </span>
            </>
          )}
        </div>
        <p className="text-[11px] text-stone-500">
          Inclusive of all taxes. Free Pan-India shipping above ₹799.
        </p>
      </div>

      {/* Size Selector with Size Guide Link */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-800">
            Select Size: <strong className="text-brand-wine">{selectedSize}</strong>
          </span>
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-xs text-brand-wine hover:underline font-medium flex items-center gap-1"
          >
            <span>Size & Fit Guide</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`min-w-[48px] py-2 px-3.5 rounded-md border text-xs font-semibold transition-all ${
                selectedSize === size
                  ? 'border-brand-wine bg-brand-wine text-white shadow-sm'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-brand-rose'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-stone-800">Quantity:</span>
        <div className="flex items-center border border-stone-300 rounded-md bg-white">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold text-sm"
          >
            -
          </button>
          <span className="px-4 text-xs font-semibold text-brand-charcoal">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Primary CTA Buttons */}
      <div className="space-y-2.5 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full py-3.5 px-4 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-3.5 px-4 bg-brand-charcoal hover:bg-black text-white rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Zap className="w-4 h-4 text-brand-gold" />
            <span>Buy Now</span>
          </button>
        </div>

        {/* WhatsApp & Wishlist Secondary Bar */}
        <div className="flex gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20BA59] text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.8 11.8 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>Chat & Enquire on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`p-3 rounded-md border flex items-center justify-center transition-all ${
              inWishlist
                ? 'border-brand-wine bg-brand-wine/10 text-brand-wine'
                : 'border-stone-300 text-stone-600 hover:border-brand-wine hover:text-brand-wine bg-white'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-brand-wine' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pincode Serviceability Check */}
      <div className="p-4 bg-[#FAF7F2] rounded-xl border border-stone-200">
        <form onSubmit={handlePincodeCheck} className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-wine" />
            <span>Delivery & Pincode Serviceability</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 6-digit Pincode (e.g. 421605)"
              maxLength={6}
              value={pincodeInput}
              onChange={e => setPincodeInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-md focus:border-brand-wine focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand-charcoal text-white text-xs font-semibold rounded-md hover:bg-black transition-colors"
            >
              Check
            </button>
          </div>
        </form>

        {pincodeResult && (
          <div className="mt-3 pt-2.5 border-t border-stone-200 text-xs">
            {pincodeResult.serviceable ? (
              <div className="space-y-1 text-emerald-800">
                <p className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Serviceable to {pincodeResult.city} ({pincodeResult.state})</span>
                </p>
                <p className="text-[11px] text-stone-600 pl-5">
                  Estimated Delivery: <strong>{pincodeResult.estimatedDays}</strong> via express surface courier.
                </p>
              </div>
            ) : (
              <p className="text-xs text-red-600">Please enter a valid 6-digit Indian pincode.</p>
            )}
          </div>
        )}
      </div>

      {/* Information Accordion Tabs */}
      <div className="pt-4 border-t border-stone-200 space-y-1">
        <AccordionItem title="Description & Styling Notes" defaultOpen={true}>
          <p>{product.description}</p>
        </AccordionItem>

        <AccordionItem title="Fabric & Care Instructions">
          <p className="font-semibold text-brand-charcoal">Fabric: {product.fabric}</p>
          <p className="mt-1">{product.careInstructions}</p>
        </AccordionItem>

        <AccordionItem title="Size & Silhouette Fit">
          <p>{product.fitDetails}</p>
          <p className="mt-1">Garment is cut to comfortable Indian festive specifications. Need personalized size confirmation? Message our boutique team directly on WhatsApp.</p>
        </AccordionItem>

        <AccordionItem title="Pan-India Shipping & Dispatch">
          <p>{product.shippingInfo}</p>
          <ul className="list-disc pl-4 space-y-1 mt-1 text-xs">
            <li>Orders dispatched within 24-48 business hours from our Titwala boutique.</li>
            <li>Free shipping across India on prepaid orders above ₹799.</li>
            <li>Real-time tracking link sent via SMS and WhatsApp upon courier pickup.</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Returns & Boutique Exchanges">
          <p>We want you to adore your purchase. In the rare case of a sizing issue or transit defect, please notify us within 48 hours of delivery via WhatsApp (+91 9820140138) with your order number. We will arrange a friendly exchange.</p>
        </AccordionItem>

        <AccordionItem title="Need Assistance? Contact Boutique Team">
          <p className="text-xs">Have questions about drape, color shades, or store pickup?</p>
          <div className="pt-2 flex flex-col gap-1 text-xs">
            <span className="font-medium text-brand-wine">Phone: {STORE_INFO.primaryPhone}</span>
            <span>Titwala Store: {STORE_INFO.address.line1}, {STORE_INFO.address.city}</span>
          </div>
        </AccordionItem>
      </div>

      {/* Sizing Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
