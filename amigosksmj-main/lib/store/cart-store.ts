'use client';
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

class CartStore extends EventTarget {
  items: CartItem[] = [];
  coupon: Coupon | null = null;
  isCartOpen: boolean = false;
  isLoaded: boolean = false;

  constructor() {
    super();
    if (typeof window !== 'undefined') {
      this.load();
    }
  }

  load() {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) this.items = JSON.parse(savedCart);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) this.coupon = JSON.parse(savedCoupon);
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    this.isLoaded = true;
    this.emit();
  }

  emit() {
    this.dispatchEvent(new Event('change'));
  }

  saveCart(newItems: CartItem[]) {
    this.items = newItems;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    }
    this.emit();
  }

  setIsCartOpen = (isOpen: boolean) => {
    this.isCartOpen = isOpen;
    this.emit();
  }

  addItem = (product: Product, size: string, quantity = 1) => {
    const itemId = product.id + '-' + size;
    const priceToUse = product.isClearance ? product.salePrice : product.price;
    const existingIndex = this.items.findIndex(item => item.id === itemId);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = this.items.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updated = [...this.items, { id: itemId, product, size, quantity, price: priceToUse }];
    }
    this.saveCart(updated);
    this.setIsCartOpen(true);
  }

  removeItem = (itemId: string) => {
    const updated = this.items.filter(item => item.id !== itemId);
    this.saveCart(updated);
  }

  updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    const updated = this.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.saveCart(updated);
  }

  clearCart = () => {
    this.saveCart([]);
    this.coupon = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
    this.emit();
  }

  applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS.find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try AMIGOS10' };
    }
    const subtotal = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (found.minOrder && subtotal < found.minOrder) {
      return { success: false, message: 'Coupon requires minimum order of ₹' + found.minOrder };
    }
    this.coupon = found;
    if (typeof window !== 'undefined') {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(found));
    }
    this.emit();
    return { success: true, message: 'Coupon ' + found.code + ' applied successfully!' };
  }

  removeCoupon = () => {
    this.coupon = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
    this.emit();
  }
}

export const globalCartStore = new CartStore();

export function useCart() {
  const [state, setState] = useState({
    items: globalCartStore.items,
    coupon: globalCartStore.coupon,
    isCartOpen: globalCartStore.isCartOpen,
    isLoaded: globalCartStore.isLoaded
  });

  useEffect(() => {
    // Also load on mount just in case SSR was missed
    if (!globalCartStore.isLoaded) {
      globalCartStore.load();
    }
    
    const handleUpdate = () => {
      setState({
        items: globalCartStore.items,
        coupon: globalCartStore.coupon,
        isCartOpen: globalCartStore.isCartOpen,
        isLoaded: globalCartStore.isLoaded
      });
    };
    
    globalCartStore.addEventListener('change', handleUpdate);
    handleUpdate(); // Sync immediately
    
    return () => globalCartStore.removeEventListener('change', handleUpdate);
  }, []);

  const totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalTotal = state.items.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const catalogSavings = Math.max(0, originalTotal - subtotal);

  let discount = 0;
  if (state.coupon) {
    if (state.coupon.type === 'percentage') {
      discount = Math.round((subtotal * state.coupon.value) / 100);
    } else {
      discount = state.coupon.value;
    }
  }

  const freeShippingThreshold = 799;
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  return {
    ...state,
    setIsCartOpen: globalCartStore.setIsCartOpen,
    addItem: globalCartStore.addItem,
    removeItem: globalCartStore.removeItem,
    updateQuantity: globalCartStore.updateQuantity,
    clearCart: globalCartStore.clearCart,
    applyCoupon: globalCartStore.applyCoupon.bind(globalCartStore),
    removeCoupon: globalCartStore.removeCoupon,
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
