const fs = require('fs');
const path = require('path');

const catalogItems = [
  { code: 'AFS 001 SET', desc: 'Cotton SET', mrp: 990, price: 890, sizes: ['L'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Lavender Pink' },
  { code: 'AFS 002 SET', desc: 'Rayon SET', mrp: 1290, price: 1160, sizes: ['M', 'L', 'XL'], fabric: 'Rayon', cat: 'kurti-sets', color: 'Bottle Green' },
  { code: 'AFS 003 SET', desc: 'Rayon SET', mrp: 990, price: 890, sizes: ['L', 'XL'], fabric: 'Rayon', cat: 'kurti-sets', color: 'Teal Blue' },
  { code: 'AFS 004 KURTA', desc: 'Cotton Kurta', mrp: 690, price: 620, sizes: ['L'], fabric: 'Pure Cotton', cat: 'long-kurtis', color: 'Sunshine Yellow' },
  { code: 'AFS 005 KURTA', desc: 'Cotton Kurta', mrp: 590, price: 530, sizes: ['M', 'XL'], fabric: 'Pure Cotton', cat: 'long-kurtis', color: 'Mint Green' },
  { code: 'AFS 006 KURTA', desc: 'Rayon Kurta', mrp: 530, price: 480, sizes: ['M', 'L'], fabric: 'Rayon', cat: 'long-kurtis', color: 'Floral White' },
  { code: 'AFS 007 KURTA', desc: 'Rayon Kurta', mrp: 550, price: 500, sizes: ['M', 'L'], fabric: 'Rayon', cat: 'long-kurtis', color: 'Crimson Red' },
  { code: 'AFS 008 KURTA', desc: 'Rayon Kurta', mrp: 530, price: 480, sizes: ['M', 'L'], fabric: 'Rayon', cat: 'long-kurtis', color: 'Indigo White' },
  { code: 'AFS 009 SET', desc: 'Poly Silk SET', mrp: 1779, price: 1600, sizes: ['M', 'L'], fabric: 'Poly Silk', cat: 'kurti-sets', color: 'Coral Peach & Grey' },
  { code: 'AFS 010 SET', desc: 'Poly Silk SET', mrp: 1799, price: 1620, sizes: ['M'], fabric: 'Poly Silk', cat: 'kurti-sets', color: 'Peacock Teal' },
  { code: 'AFS 011 KURTA', desc: 'Cotton KURTA', mrp: 919, price: 830, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'long-kurtis', color: 'Charcoal Ombre' },
  { code: 'AFS 012 SET', desc: 'Chanderi Silk SET', mrp: 1999, price: 1799, sizes: ['M'], fabric: 'Chanderi Silk', cat: 'kurti-sets', color: 'Seafoam Green' },
  { code: 'AFS 013 SET', desc: 'Cotton SET', mrp: 1899, price: 1710, sizes: ['M', 'L'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Rose Dust Pink' },
  { code: 'AFS 014 SET', desc: 'Cotton SET', mrp: 1980, price: 1780, sizes: ['M', 'L', 'XL'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Marigold Yellow' },
  { code: 'AFS 015 Kurta', desc: 'Poly Crepe Kurta', mrp: 498, price: 450, sizes: ['M', 'L'], fabric: 'Poly Crepe', cat: 'short-kurtis', color: 'Prussian Blue' },
  { code: 'AFS 016 Kurta', desc: 'Cotton Kurta', mrp: 1459, price: 1299, sizes: ['M', 'L'], fabric: 'Pure Cotton', cat: 'long-kurtis', color: 'Maroon Gold' },
  { code: 'AFS 017 Kurta', desc: 'Cotton Kurta', mrp: 550, price: 499, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'short-kurtis', color: 'Fuchsia Pink' },
  { code: 'AFS 018 Kurta', desc: 'Cotton Kurta', mrp: 550, price: 499, sizes: ['L', 'XL'], fabric: 'Pure Cotton', cat: 'short-kurtis', color: 'Royal Indigo' },
  { code: 'AFS 019 Kurta', desc: 'Cotton Kurta', mrp: 550, price: 499, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'short-kurtis', color: 'Mustard Yellow' },
  { code: 'AFS 020 Kurta', desc: 'Cotton Kurta', mrp: 620, price: 559, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'long-kurtis', color: 'Coral Glow' },
  { code: 'AFS 021 Kurta', desc: 'Cotton Kurta', mrp: 550, price: 499, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'short-kurtis', color: 'Tangerine Orange' },
  { code: 'AFS 022 Kurta', desc: 'Cotton Kurta', mrp: 880, price: 799, sizes: ['M', 'L'], fabric: 'Pure Cotton', cat: 'long-kurtis', color: 'Navy Anarkali' },
  { code: 'AFS 023 Kurta', desc: 'Cotton Kurta', mrp: 738, price: 669, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'long-kurtis', color: 'Geometric Navy' },
  { code: 'AFS 024 Kurta', desc: 'Crepe Kurta', mrp: 778, price: 699, sizes: ['M'], fabric: 'Crepe', cat: 'long-kurtis', color: 'Aqua Layered' },
  { code: 'AFS 025 Kurta', desc: 'Dobby Chiffon Kurta', mrp: 1098, price: 999, sizes: ['M', 'L', 'XL'], fabric: 'Dobby Chiffon', cat: 'long-kurtis', color: 'Noir Black' },
  { code: 'AFS 026 Kurta', desc: 'Satin Kurta', mrp: 1218, price: 1099, sizes: ['S', 'M', 'XL'], fabric: 'Satin', cat: 'long-kurtis', color: 'Pink Floral Satin' },
  { code: 'AFS 027 Kurta', desc: 'Georgette Kurta', mrp: 1078, price: 979, sizes: ['M', 'XL'], fabric: 'Georgette', cat: 'long-kurtis', color: 'Blush Peach Anarkali' },
  { code: 'AFS 028 Kurta', desc: 'Crepe Kurta', mrp: 998, price: 899, sizes: ['L', 'XL'], fabric: 'Crepe', cat: 'long-kurtis', color: 'Crimson Bandhani' },
  { code: 'AFS 029 Kurta', desc: 'Crepe Kurta', mrp: 798, price: 719, sizes: ['M'], fabric: 'Crepe', cat: 'long-kurtis', color: 'Slate Blue Flared' },
  { code: 'AFS 030 Kurta', desc: 'Moss Kurta', mrp: 538, price: 479, sizes: ['M'], fabric: 'Moss', cat: 'short-kurtis', color: 'Teal Striped' },
  { code: 'AFS 031 SET', desc: 'Poly Crepe SET', mrp: 1458, price: 1299, sizes: ['M'], fabric: 'Poly Crepe', cat: 'kurti-sets', color: 'Royal Blue Palazzo' },
  { code: 'AFS 032 SET', desc: 'Cotton SET', mrp: 2458, price: 2199, sizes: ['L'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Ivory Floral Anarkali' },
  { code: 'AFS 033 SET', desc: 'Poly Silk SET', mrp: 1218, price: 1099, sizes: ['M', 'L'], fabric: 'Poly Silk', cat: 'kurti-sets', color: 'Ruby Red & Olive' },
  { code: 'AFS 034 SET', desc: 'Poly Silk SET', mrp: 1298, price: 1169, sizes: ['M', 'L'], fabric: 'Poly Silk', cat: 'kurti-sets', color: 'Sage Green Silk' },
  { code: 'AFS 035 SET', desc: 'Cotton SET', mrp: 1838, price: 1659, sizes: ['M', 'L'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Indigo Floral Pant' },
  { code: 'AFS 036 SET', desc: 'Cotton SET', mrp: 2018, price: 1799, sizes: ['M', 'L'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Pastel Pink Dupatta' },
  { code: 'AFS 037 SET', desc: 'Georgette SET', mrp: 1918, price: 1899, sizes: ['M', 'L'], fabric: 'Georgette', cat: 'kurti-sets', color: 'Peacock Blue Sharara' },
  { code: 'AFS 038 SET', desc: 'Poly Silk SET', mrp: 1758, price: 1590, sizes: ['M'], fabric: 'Poly Silk', cat: 'kurti-sets', color: 'Midnight Blue Crop Sharara' },
  { code: 'AFS 039 SET', desc: 'Poly Silk SET', mrp: 2478, price: 2229, sizes: ['M', 'L', 'XL'], fabric: 'Poly Silk', cat: 'kurti-sets', color: 'Blush Pink Embroidered' },
  { code: 'AFS 040 SET', desc: 'Chanderi Silk SET', mrp: 2398, price: 2159, sizes: ['M'], fabric: 'Chanderi Silk', cat: 'kurti-sets', color: 'Mint Frost Silk' },
  { code: 'AFS 041 SET', desc: 'Rayon SET', mrp: 1678, price: 1499, sizes: ['M', 'L'], fabric: 'Rayon', cat: 'kurti-sets', color: 'Emerald Festive Kurti' },
  { code: 'AFS 042 SET', desc: 'Cotton SET', mrp: 2338, price: 2099, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Multi Pastel Cotton' },
  { code: 'AFS 043 SET', desc: 'Cotton SET', mrp: 1798, price: 1799, sizes: ['S', 'M', 'L'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Sage Embroidered Kurti' },
  { code: 'AFS 044 SET', desc: 'Georgette Lehnga Choli SET', mrp: 1938, price: 1749, sizes: ['M', 'L'], fabric: 'Georgette', cat: 'kurti-sets', color: 'Sunset Coral Lehenga' },
  { code: 'AFS 045 SET', desc: 'Cotton SET', mrp: 1578, price: 1419, sizes: ['S', 'M', 'XL'], fabric: 'Pure Cotton', cat: 'kurti-sets', color: 'Ochre Yellow Angrakha' }
];

const clearanceCodes = ['AFS 015', 'AFS 030', 'AFS 023', 'AFS 029', 'AFS 011', 'AFS 006', 'AFS 016', 'AFS 010', 'AFS 026', 'AFS 028', 'AFS 037', 'AFS 008'];

const products = catalogItems.map((item, idx) => {
  const numStr = String(idx + 1).padStart(3, '0');
  const slug = (item.code.toLowerCase().replace(/\s+/g, '-') + '-' + item.desc.toLowerCase().replace(/\s+/g, '-') + '-' + item.color.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/--+/g, '-');
  const isClearance = clearanceCodes.some(c => item.code.startsWith(c));
  const isNewArrival = idx < 8 || idx >= 38;
  const isFeatured = [0, 1, 8, 11, 13, 31, 35, 36, 43].includes(idx);
  
  return {
    id: 'prod_' + numStr,
    code: item.code,
    sku: item.code.replace(/\s+/g, '-'),
    name: `${item.code} ${item.desc} in ${item.color}`,
    slug: slug,
    category: item.cat,
    categoryName: item.cat === 'kurti-sets' ? 'Kurti Sets' : item.cat === 'long-kurtis' ? 'Long Kurtis' : 'Short Kurtis',
    mrp: item.mrp,
    price: item.price,
    salePrice: isClearance ? Math.round(item.price * 0.85) : item.price,
    fabric: item.fabric,
    color: item.color,
    sizes: item.sizes,
    stock: 12 + ((idx * 7) % 25),
    isNewArrival: isNewArrival,
    isFeatured: isFeatured,
    isClearance: isClearance,
    rating: 4.8,
    reviewsCount: 14 + (idx % 23),
    images: [
      `/images/catalog/afs-${numStr}-main.jpg`,
      `/images/catalog/afs-${numStr}-hover.jpg`,
      `/images/catalog/afs-${numStr}-detail.jpg`,
      `/images/catalog/afs-${numStr}.jpg`
    ],
    shortDescription: `Elegant ${item.fabric} ${item.desc} featuring authentic Indian artisan cuts, refined stitching, and breathable comfort for daily wear or celebrations.`,
    description: `Embrace effortless elegance with the ${item.code} ${item.desc}. Specially crafted from premium ${item.fabric}, this style is designed to keep you cool, comfortable, and flawlessly styled from day to night. Featuring a flattering silhouette, precision neck detailing, and versatile pairing capability.`,
    careInstructions: 'Gentle hand wash or mild machine wash with like colors. Do not bleach. Dry in shade. Warm iron on reverse side.',
    fitDetails: 'Regular comfortable Indian fit. We recommend ordering your true size. Refer to our size guide for bust and waist measurements.',
    shippingInfo: 'Dispatched within 24-48 hours from our Titwala boutique. Free shipping across India on prepaid orders.'
  };
});

const tsCode = `export interface ProductVariant {
  size: string;
  stock: number;
  price: number;
}

export interface Product {
  id: string;
  code: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  mrp: number;
  price: number;
  salePrice: number;
  fabric: string;
  color: string;
  sizes: string[];
  stock: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isClearance: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  shortDescription: string;
  description: string;
  careInstructions: string;
  fitDetails: string;
  shippingInfo: string;
}

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const CATEGORIES = [
  {
    id: 'kurti-sets',
    name: 'Kurti Sets',
    slug: 'kurti-sets',
    headline: 'Effortless Outfits, Beautifully Put Together',
    description: 'Coordinated kurti pairs with pants, palazzos, shararas and dupattas crafted for celebrations and refined daily wear.',
    image: '/images/catalog/afs-001-main.jpg',
    count: PRODUCTS.filter(p => p.category === 'kurti-sets').length,
  },
  {
    id: 'long-kurtis',
    name: 'Long Kurtis',
    slug: 'long-kurtis',
    headline: 'Everyday Elegance with Easy Styling',
    description: 'Graceful straight and A-line long kurtis designed for office wear, family gatherings, and everyday comfort.',
    image: '/images/catalog/afs-004-main.jpg',
    count: PRODUCTS.filter(p => p.category === 'long-kurtis').length,
  },
  {
    id: 'short-kurtis',
    name: 'Short Kurtis',
    slug: 'short-kurtis',
    headline: 'Easy-Going Styles for Everyday Dressing',
    description: 'Chic, breezy short kurtis perfect for college, casual outings, denim pairings, and warm weather ease.',
    image: '/images/catalog/afs-017-main.jpg',
    count: PRODUCTS.filter(p => p.category === 'short-kurtis').length,
  },
  {
    id: 'clearance',
    name: 'Clearance Sale',
    slug: 'clearance',
    headline: 'Limited Pieces. Special Prices.',
    description: 'Exclusive seasonal markdowns on our authentic cotton, rayon, and crepe pieces. Grab yours before stock runs out.',
    image: '/images/catalog/afs-015-main.jpg',
    count: PRODUCTS.filter(p => p.isClearance).length,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug || p.code.toLowerCase().replace(/\\s+/g, '-') === slug || p.sku.toLowerCase() === slug.toLowerCase());
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'clearance') {
    return PRODUCTS.filter(p => p.isClearance);
  }
  return PRODUCTS.filter(p => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter(p => p.isNewArrival);
}
`;

fs.writeFileSync(path.join(__dirname, '../lib/data/products.ts'), tsCode);
console.log('Generated lib/data/products.ts successfully!');
