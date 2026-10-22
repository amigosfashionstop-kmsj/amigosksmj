import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/data/blogs';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const staticRoutes = [
    '',
    '/shop',
    '/shop/kurti-sets',
    '/shop/long-kurtis',
    '/shop/short-kurtis',
    '/shop/clearance',
    '/about',
    '/wholesale',
    '/visit-us',
    '/size-guide',
    '/journal',
    '/policies',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogRoutes = BLOG_POSTS.map(b => ({
    url: `${baseUrl}/journal/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
