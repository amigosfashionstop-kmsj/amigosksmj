import { cache } from 'react';
import { supabase } from '../supabase';
import { Product } from './products';

// Centralised static definitions for categories with rich metadata and banners
export const STORE_CATEGORIES = [
  {
    id: 'kurti-sets',
    name: 'Kurti Sets',
    slug: 'kurti-sets',
    headline: 'Effortless Outfits, Beautifully Put Together',
    description: 'Coordinated kurti pairs with pants, palazzos, shararas and dupattas crafted for celebrations and refined daily wear.',
    image: '/images/catalog/afs-001-main.jpg',
  },
  {
    id: 'long-kurtis',
    name: 'Long Kurtis',
    slug: 'long-kurtis',
    headline: 'Everyday Elegance with Easy Styling',
    description: 'Graceful straight and A-line long kurtis designed for office wear, family gatherings, and everyday comfort.',
    image: '/images/catalog/afs-004-main.jpg',
  },
  {
    id: 'short-kurtis',
    name: 'Short Kurtis',
    slug: 'short-kurtis',
    headline: 'Easy-Going Styles for Everyday Dressing',
    description: 'Chic, breezy short kurtis perfect for college, casual outings, denim pairings, and warm weather ease.',
    image: '/images/catalog/afs-017-main.jpg',
  },
  {
    id: 'clearance',
    name: 'Clearance Sale',
    slug: 'clearance',
    headline: 'Limited Pieces. Special Prices.',
    description: 'Exclusive seasonal markdowns on our authentic cotton, rayon, and crepe pieces. Grab yours before stock runs out.',
    image: '/images/catalog/afs-015-main.jpg',
  },
  // Legacy / Navigation aliases handled via mapping layer
  {
    id: 'kurtis',
    name: 'Kurtis',
    slug: 'kurtis',
    headline: 'Everyday Comfort & Boutique Elegance',
    description: 'Our full collection of handcrafted long, short, and straight kurtis.',
    image: '/images/catalog/afs-004-main.jpg',
  },
  {
    id: 'lehengas',
    name: 'Lehengas & Sets',
    slug: 'lehengas',
    headline: 'Festive & Celebration Ensembles',
    description: 'Festive lehengas, shararas, and celebration sets curated for special Indian occasions.',
    image: '/images/catalog/afs-044-main.jpg',
  },
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'sarees',
    headline: 'Timeless Indian Drapes',
    description: 'Handpicked sarees celebrating regional weaves and timeless craftsmanship.',
    image: '/images/catalog/afs-012-main.jpg',
  },
  {
    id: 'gowns',
    name: 'Gowns & Anarkalis',
    slug: 'gowns',
    headline: 'Graceful Silhouette Gowns',
    description: 'Flowing ethnic gowns and floor-length anarkalis for evening celebrations.',
    image: '/images/catalog/afs-022-main.jpg',
  }
];

const CATEGORY_NAME_MAP: Record<string, string> = {
  'kurti-sets': 'Kurti Sets',
  'long-kurtis': 'Long Kurtis',
  'short-kurtis': 'Short Kurtis',
  'clearance': 'Clearance Sale',
  'kurtis': 'Kurtis',
  'lehengas': 'Lehengas & Sets',
  'sarees': 'Sarees',
  'gowns': 'Gowns & Anarkalis',
};

// React cache dedupes requests within a single server render cycle
export const getServerProducts = cache(async (): Promise<Product[]> => {
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
    categoryName: CATEGORY_NAME_MAP[p.category] || p.categoryName || 'Kurti',
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
    careInstructions: p.care_instructions || '',
    fitDetails: p.fit_details || 'Regular comfortable Indian fit. True to size.',
    shippingInfo: p.shipping_info || 'Dispatched within 24-48 hours. Free shipping across India on orders above ₹799; ₹60 below.'
  })) as Product[];
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getServerProducts();
  const lower = slug.toLowerCase();
  return products.find(p => 
    p.slug === slug || 
    (p.code && p.code.toLowerCase().replace(/\s+/g, '-') === lower) || 
    (p.sku && p.sku.toLowerCase() === lower)
  );
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getServerProducts();
  const slug = categorySlug.toLowerCase();

  if (slug === 'clearance') {
    return products.filter(p => p.isClearance);
  }

  // Mapping layer: Kurtis includes long and short
  if (slug === 'kurtis') {
    return products.filter(p => p.category === 'long-kurtis' || p.category === 'short-kurtis');
  }

  // Mapping layer: Lehengas matches AFS 044 or category lehengas
  if (slug === 'lehengas') {
    return products.filter(p => 
      p.category === 'lehengas' || 
      p.code.includes('044') || 
      /lehenga/i.test(p.name)
    );
  }

  return products.filter(p => p.category === slug);
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

  return STORE_CATEGORIES.map(cat => {
    let count = 0;
    if (cat.slug === 'clearance') {
      count = products.filter(p => p.isClearance).length;
    } else if (cat.slug === 'kurtis') {
      count = products.filter(p => p.category === 'long-kurtis' || p.category === 'short-kurtis').length;
    } else if (cat.slug === 'lehengas') {
      count = products.filter(p => p.category === 'lehengas' || p.code.includes('044') || /lehenga/i.test(p.name)).length;
    } else {
      count = products.filter(p => p.category === cat.slug).length;
    }

    return {
      ...cat,
      count
    };
  });
}
