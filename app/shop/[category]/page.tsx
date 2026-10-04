import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductsByCategory, getDynamicCategories } from '@/lib/data/server-products';
import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categories = await getDynamicCategories();
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return { title: 'Collection Not Found | Amigos Fashionstop' };

  return {
    title: `${category.name} | Amigos Fashionstop - Titwala Ethnic Wear`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Amigos Fashionstop`,
      description: category.description,
      images: [{ url: category.image }]
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

        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-10 bg-brand-wine text-white min-h-[220px] flex items-center">
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

          <div className="relative z-10 p-8 sm:p-12 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>{category.count} Curated Pieces</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              {category.name}
            </h1>

            <p className="text-sm text-stone-200 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between text-xs text-stone-600">
          <span>Displaying <strong>{products.length}</strong> styles in {category.name}</span>
          <span className="hidden sm:inline text-stone-400">Free shipping on orders above ?799</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </div>
    </div>
  );
}
