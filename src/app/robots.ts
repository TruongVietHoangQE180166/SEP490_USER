import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/teacher/', '/profile/', '/wallet/', '/api/'],
    },
    sitemap: 'https://victeach.io.vn/sitemap.xml',
  };
}
