'use client';
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
