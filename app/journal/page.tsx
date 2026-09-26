import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/lib/data/blogs';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';

export const metadata = {
  title: "Fashion Journal & Styling Inspiration | Amigos Fashionstop",
  description: "Styling tips, fabric care guides, and kurti fashion inspiration from the Amigos Fashionstop boutique team in Titwala.",
};

export default function JournalPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-brand-wine uppercase tracking-widest bg-brand-wine/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial Journal</span>
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-charcoal">
            The Amigos Fashion Journal
          </h1>
          <p className="text-sm text-stone-600">
            Styling inspiration, fabric breakdowns, and ethnic wardrobe guides from our boutique stylists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col group hover:shadow-md transition-all"
            >
              <Link href={`/journal/${post.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 block">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-brand-wine" />
                      {post.author}
                    </span>
                    <span>�</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/journal/${post.slug}`}>
                    <h2 className="font-serif text-lg font-bold text-brand-charcoal group-hover:text-brand-wine transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-wine group-hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
