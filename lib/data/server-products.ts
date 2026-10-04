import { supabase } from '../supabase';
import { Product } from './products';

export async function getServerProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(size, stock)')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Map variants back to the expected product structure
  return data.map(p => ({
    id: p.id,
    sku: p.sku || '',
    code: p.code || '',
    name: p.name,
    slug: p.slug,
    category: p.category,
    subcategory: p.subcategory || '',
    mrp: Number(p.mrp),
    price: Number(p.price),
    salePrice: p.sale_price ? Number(p.sale_price) : 0,
    fabric: p.fabric || '',
    color: p.color || '',
    sizes: p.product_variants?.map((v: any) => v.size) || [],
    stock: p.product_variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0,
    isNewArrival: p.is_new_arrival,
    isFeatured: p.is_featured,
    isClearance: p.is_clearance,
    rating: Number(p.rating),
    reviewsCount: p.reviews_count,
    images: p.images || [],
    shortDescription: p.short_description || '',
    description: p.description || '',
    careInstructions: p.care_instructions || ''
  })) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getServerProducts();
  return products.find(p => 
    p.slug === slug || 
    (p.code && p.code.toLowerCase().replace(/\s+/g, '-') === slug) || 
    (p.sku && p.sku.toLowerCase() === slug.toLowerCase())
  );
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getServerProducts();
  if (categorySlug === 'clearance') {
    return products.filter(p => p.isClearance);
  }
  return products.filter(p => p.category === categorySlug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getServerProducts();
  return products.filter(p => p.isFeatured);
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await getServerProducts();
  return products.filter(p => p.isNewArrival);
}

export async function getDynamicCategories() {
  const products = await getServerProducts();
  // Using static categories list for metadata, but dynamic counts
  const CATEGORIES = [
    { name: 'Sarees', slug: 'sarees' },
    { name: 'Kurtis', slug: 'kurtis' },
    { name: 'Lehengas', slug: 'lehengas' },
    { name: 'Gowns', slug: 'gowns' },
    { name: 'Clearance', slug: 'clearance' }
  ];
  return CATEGORIES.map(cat => ({
    ...cat,
    count: cat.slug === 'clearance' 
      ? products.filter(p => p.isClearance).length 
      : products.filter(p => p.category === cat.slug).length
  }));
}
