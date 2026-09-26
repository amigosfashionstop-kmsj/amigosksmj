import { getProducts } from '../db';
import { PRODUCTS, CATEGORIES, Product } from './products';

export function getServerProducts(): Product[] {
  const dbProducts = getProducts();
  return dbProducts || PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getServerProducts().find(p => p.slug === slug || p.code.toLowerCase().replace(/\s+/g, '-') === slug || p.sku.toLowerCase() === slug.toLowerCase());
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'clearance') {
    return getServerProducts().filter(p => p.isClearance);
  }
  return getServerProducts().filter(p => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return getServerProducts().filter(p => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return getServerProducts().filter(p => p.isNewArrival);
}

export function getDynamicCategories() {
  return CATEGORIES.map(cat => ({
    ...cat,
    count: cat.slug === 'clearance' 
      ? getServerProducts().filter(p => p.isClearance).length 
      : getServerProducts().filter(p => p.category === cat.slug).length
  }));
}
