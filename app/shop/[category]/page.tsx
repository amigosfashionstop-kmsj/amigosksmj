import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductsByCategory, getDynamicCategories } from '@/lib/data/server-products';
import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getDynamicCategories();
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    return {
      title: 'Collection Not Found | Amigos Fashionstop',
      robots: { index: false, follow: false }
    };
  }

  const products = await getProductsByCategory(categorySlug);
  const isCategoryEmpty = products.length === 0;

  return {
    title: `${category.name} | Amigos Fashionstop - Titwala Ethnic Wear`,
    description: category.description,
    robots: isCategoryEmpty ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: `${category.name} | Amigos Fashionstop`,
      description: category.description,
      url: `${SITE_URL}/shop/${categorySlug}`,
      images: category.image ? [{ url: `${SITE_URL}${category.image}` }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Amigos Fashionstop`,
      description: category.description,
      images: category.image ? [`${SITE_URL}${category.image}`] : []
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categories = await getDynamicCategories();
  const category = categories.find(c => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(categorySlug);
  const isCategoryEmpty = products.length === 0;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-brand-wine font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-10 bg-brand-wine text-white min-h-[220px] flex items-center">
          {category.image && (
            <div className="absolute inset-0 z-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover object-center opacity-30 mix-blend-overlay"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-wine-dark via-brand-wine/90 to-transparent" />
            </div>
          )}

          <div className="relative z-10 p-8 sm:p-12 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>{products.length} Curated Pieces</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              {category.name}
            </h1>

            <p className="text-sm text-stone-200 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {isCategoryEmpty ? (
          /* Proper Empty State with no broken images */
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-xs max-w-xl mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-charcoal">
              New Styles Coming Soon
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We are currently restocking our curated {category.name.toLowerCase()} collection. Explore our live kurtis and sets in the meantime!
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md text-xs font-semibold uppercase tracking-wider shadow-sm transition-all"
              >
                <span>Browse All Collections</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-xs text-stone-600">
              <span>Displaying <strong>{products.length}</strong> styles in {category.name}</span>
              <span className="hidden sm:inline text-stone-400">Free shipping on prepaid orders above ₹799; ₹60 below.</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
