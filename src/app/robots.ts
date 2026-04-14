import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/profile/',
        '/registration/payment/',
      ],
    },
    sitemap: 'https://holy-crescent.com/sitemap.xml',
  };
}
