const fs = require('fs');
const path = require('path');

// lib/store/cart-store.ts
const cartStore = `'use client';
import { useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  id: string; // product.id + '-' + size
  product: Product;
  size: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  description: string;
}

export const VALID_COUPONS: Coupon[] = [
  { code: 'AMIGOS10', type: 'percentage', value: 10, description: '10% Off on orders above ₹999', minOrder: 999 },
  { code: 'WELCOME50', type: 'fixed', value: 50, description: 'Flat ₹50 Off on your first order' },
  { code: 'FASHIONSTOP', type: 'percentage', value: 15, description: '15% Off on orders above ₹1,999', minOrder: 1999 }
];

const CART_STORAGE_KEY = 'amigos_cart_v1';
const COUPON_STORAGE_KEY = 'amigos_coupon_v1';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) setItems(JSON.parse(savedCart));
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsLoaded(true);
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  };

  const addItem = (product: Product, size: string, quantity = 1) => {
    const itemId = `${product.id}-${size}`;
    const priceToUse = product.isClearance ? product.salePrice : product.price;
    const existingIndex = items.findIndex(item => item.id === itemId);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = items.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updated = [...items, { id: itemId, product, size, quantity, price: priceToUse }];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    const updated = items.filter(item => item.id !== itemId);
    saveCart(updated);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const updated = items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS.find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try AMIGOS10' };
    }
    if (found.minOrder && subtotal < found.minOrder) {
      return { success: false, message: `Coupon requires minimum order of ₹${found.minOrder}` };
    }
    setCoupon(found);
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(found));
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalTotal = items.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const catalogSavings = Math.max(0, originalTotal - subtotal);

  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }
  }

  // Free shipping over ₹799, otherwise ₹60
  const freeShippingThreshold = 799;
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  return {
    items,
    isLoaded,
    isCartOpen,
    setIsCartOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    totalQuantity,
    subtotal,
    originalTotal,
    catalogSavings,
    discount,
    shippingFee,
    freeShippingThreshold,
    grandTotal
  };
}
`;
fs.writeFileSync(path.join(__dirname, '../lib/store/cart-store.ts'), cartStore);

// lib/store/wishlist-store.ts
const wishlistStore = `'use client';
import { useState, useEffect } from 'react';
import { Product } from '../data/products';

const WISHLIST_STORAGE_KEY = 'amigos_wishlist_v1';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleWishlist = (product: Product) => {
    let updated: Product[];
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      updated = wishlist.filter(p => p.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  return {
    wishlist,
    isLoaded,
    toggleWishlist,
    isInWishlist,
    count: wishlist.length
  };
}
`;
fs.writeFileSync(path.join(__dirname, '../lib/store/wishlist-store.ts'), wishlistStore);

// lib/services/whatsapp.ts
const whatsappService = `import { STORE_INFO } from '../data/store-info';
import { Product } from '../data/products';
import { CartItem } from '../store/cart-store';

export function generateProductWhatsAppUrl(product: Product, selectedSize?: string): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const sizeText = selectedSize ? \`in Size: \${selectedSize}\` : '';
  const price = product.isClearance ? product.salePrice : product.price;
  const message = \`Hi Amigos Fashionstop! 👋
I am interested in buying:
✨ *\${product.code}* - \${product.name}
👗 Fabric: \${product.fabric}
🏷️ Price: ₹\${price} \${sizeText}

Please confirm availability and dispatch options to my location. Thank you!\`;

  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
}

export function generateCartWhatsAppUrl(items: CartItem[], grandTotal: number): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const itemsSummary = items.map((item, i) => \`\${i + 1}. \${item.product.code} (Size: \${item.size}) x \${item.quantity} = ₹\${item.price * item.quantity}\`).join('\\n');
  const message = \`Hi Amigos Fashionstop! 👋
I would like to order the following items from your website:

\${itemsSummary}

💰 *Total Amount*: ₹\${grandTotal}

Could you please confirm payment and dispatch details? Thank you!\`;

  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
}

export function generateWholesaleWhatsAppUrl(businessName: string, city: string, units: string): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const message = \`Hi Amigos Fashionstop! 👋
I would like to enquire about wholesale / bulk orders for women's ethnic wear.

🏪 *Business Name*: \${businessName}
📍 *City*: \${city}
📦 *Estimated Units Required*: \${units}

Please share your latest B2B catalog and wholesale price tiers.\`;

  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
}

export function generateGeneralWhatsAppUrl(): string {
  const phone = STORE_INFO.primaryWhatsApp;
  const message = \`Hi Amigos Fashionstop! 👋
I am browsing your collection on your website and would love some assistance with selecting kurtis and sizing.\`;

  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
}
`;
fs.writeFileSync(path.join(__dirname, '../lib/services/whatsapp.ts'), whatsappService);

// lib/services/shipping.ts
const shippingService = `export interface PincodeCheckResult {
  serviceable: boolean;
  city: string;
  state: string;
  estimatedDays: string;
  isExpressAvailable: boolean;
  freeShippingQualified: boolean;
}

export function checkPincode(pincode: string): PincodeCheckResult {
  const clean = pincode.replace(/\\D/g, '').slice(0, 6);
  if (clean.length !== 6) {
    return {
      serviceable: false,
      city: '',
      state: '',
      estimatedDays: '',
      isExpressAvailable: false,
      freeShippingQualified: false
    };
  }

  // Priority delivery for Titwala, Kalyan, Thane, Mumbai (421xxx, 400xxx, 401xxx)
  if (clean.startsWith('421') || clean.startsWith('400') || clean.startsWith('401')) {
    const isTitwala = clean === '421605';
    return {
      serviceable: true,
      city: isTitwala ? 'Titwala' : clean.startsWith('421') ? 'Kalyan / Thane Dist' : 'Mumbai Metro',
      state: 'Maharashtra',
      estimatedDays: isTitwala ? 'Same day / Next day' : '1 - 2 Business Days',
      isExpressAvailable: true,
      freeShippingQualified: true
    };
  }

  // Maharashtra general (41xxxx, 42xxxx, 43xxxx, 44xxxx)
  if (clean.startsWith('41') || clean.startsWith('42') || clean.startsWith('43') || clean.startsWith('44')) {
    return {
      serviceable: true,
      city: 'Maharashtra Region',
      state: 'Maharashtra',
      estimatedDays: '2 - 3 Business Days',
      isExpressAvailable: true,
      freeShippingQualified: true
    };
  }

  // Pan-India coverage
  return {
    serviceable: true,
    city: 'All India Serviceable',
    state: 'Pan-India',
    estimatedDays: '3 - 5 Business Days',
    isExpressAvailable: false,
    freeShippingQualified: true
  };
}
`;
fs.writeFileSync(path.join(__dirname, '../lib/services/shipping.ts'), shippingService);

// lib/services/razorpay.ts
const razorpayService = `export interface RazorpayOrderOptions {
  amount: number; // in INR
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string;
  isSimulated: boolean;
}

export async function createRazorpayOrder(options: RazorpayOrderOptions): Promise<RazorpayOrderResponse> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_AmigosStoreDev';
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // In simulated/demo mode or if real credentials are not provided:
  const orderId = 'order_' + Math.random().toString(36).substring(2, 11);
  return {
    id: orderId,
    amount: options.amount * 100, // paise
    currency: 'INR',
    receipt: options.receipt,
    status: 'created',
    keyId: keyId,
    isSimulated: !keySecret || keySecret.startsWith('dummy')
  };
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  // If simulated mode, permit test verification
  if (paymentId.startsWith('pay_sim_')) return true;
  return Boolean(orderId && paymentId && signature);
}
`;
fs.writeFileSync(path.join(__dirname, '../lib/services/razorpay.ts'), razorpayService);

// lib/services/seo.ts
const seoService = `import { STORE_INFO } from '../data/store-info';
import { Product } from '../data/products';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: STORE_INFO.legalName,
    alternateName: STORE_INFO.name,
    description: STORE_INFO.ethos,
    url: 'https://amigosfashionstop.com',
    telephone: STORE_INFO.primaryPhone,
    email: STORE_INFO.email,
    priceRange: '₹₹',
    image: 'https://amigosfashionstop.com/images/brand/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: STORE_INFO.address.line1,
      addressLocality: STORE_INFO.address.city,
      addressRegion: STORE_INFO.address.state,
      postalCode: STORE_INFO.address.pincode,
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.3006,
      longitude: 73.2089
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '21:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '09:00',
        closes: '17:00'
      }
    ],
    sameAs: [
      STORE_INFO.instagram.url,
      'https://sites.google.com/view/amigos-fashionstop'
    ]
  };
}

export function getProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: ['https://amigosfashionstop.com' + product.images[0]],
    description: product.description,
    sku: product.sku,
    mpn: product.code,
    brand: {
      '@type': 'Brand',
      name: 'Amigos Fashionstop'
    },
    offers: {
      '@type': 'Offer',
      url: \`https://amigosfashionstop.com/product/\${product.slug}\`,
      priceCurrency: 'INR',
      price: product.isClearance ? product.salePrice : product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Amigos Fashionstop'
      }
    }
  };
}
`;
fs.writeFileSync(path.join(__dirname, '../lib/services/seo.ts'), seoService);

console.log('Stores and services created successfully!');
