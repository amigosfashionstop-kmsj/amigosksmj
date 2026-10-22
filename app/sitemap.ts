import { MetadataRoute } from 'next';
import { getServerProducts, getDynamicCategories } from '@/lib/data/server-products';
import { BLOG_POSTS } from '@/lib/data/blogs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const PRODUCTS = await getServerProducts();
  const CATEGORIES = await getDynamicCategories();
  const baseUrl = 'https://amigosfashionstop.com';

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

  const productRoutes = PRODUCTS.map(p => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogRoutes = BLOG_POSTS.map(b => ({
    url: `${baseUrl}/journal/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
