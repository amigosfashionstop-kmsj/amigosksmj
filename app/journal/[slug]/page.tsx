import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/data/blogs';
import { ArrowLeft, User, Calendar, Clock, ShoppingBag } from 'lucide-react';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found | Amigos Fashionstop' };

  return {
    title: `${post.title} | Amigos Fashion Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }]
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-brand-wine font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Fashion Journal</span>
          </Link>
        </div>

        <article className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200/80 shadow-xs space-y-6">
          <div className="space-y-3 pb-6 border-b border-stone-200">
            <span className="text-xs font-bold text-brand-wine uppercase tracking-widest bg-brand-wine/10 px-2.5 py-0.5 rounded">
              Amigos Styling
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1 font-medium text-stone-700">
                <User className="w-3.5 h-3.5 text-brand-wine" />
                {post.author}
              </span>
              <span>�</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>�</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-stone-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-4 pt-4 text-stone-700 whitespace-pre-line">
            {post.content}
          </div>

          <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-brand-charcoal">Loved this guide?</p>
              <p className="text-xs text-stone-500">Explore authentic kurtis and sets in our wardrobe.</p>
            </div>
            <Link
              href={`/shop/${post.relatedCategory}`}
              className="px-5 py-2.5 bg-brand-wine text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Related Styles</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
