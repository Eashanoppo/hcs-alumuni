import { MetadataRoute } from 'next';

const BASE_URL = 'https://holy-crescent.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/directory',
    '/gallery',
    '/notices',
    '/registration',
    '/teachers',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real scenario, you would fetch all notice IDs from Supabase here
  // and add them to the sitemap. For now, we list the main routes.

  return [...routes];
}
