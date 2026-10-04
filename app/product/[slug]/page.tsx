import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getServerProducts } from '@/lib/data/server-products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductCard } from '@/components/ui/ProductCard';
import { getProductSchema } from '@/lib/services/seo';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | Amigos Fashionstop' };

  return {
    title: `${product.code} - ${product.name} | Amigos Fashionstop`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.code} - ${product.name}`,
      description: product.shortDescription,
      images: [{ url: product.images[0] }]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from same category, excluding current
  const allProducts = await getServerProducts();
  const relatedProducts = allProducts.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const productJsonLd = getProductSchema(product);

  return (
    <div className="bg-white min-h-screen py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-brand-wine">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/shop" className="hover:text-brand-wine">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href={`/shop/${product.category}`} className="hover:text-brand-wine">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium truncate">{product.code}</span>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">
          {/* Left: Interactive Multi-angle Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Details & Buying Actions */}
          <div className="lg:col-span-5">
            <ProductActions product={product} />
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-stone-200">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold text-brand-wine uppercase tracking-widest">
                Pairing & Alternatives
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mt-1">
                You May Also Love
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                More styles in {product.categoryName} chosen for your wardrobe.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
