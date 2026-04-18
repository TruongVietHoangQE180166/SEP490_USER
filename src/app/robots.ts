import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://victeach.io.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/course',
          '/blog',
          '/trading',
          '/documentation',
          '/about',
          '/speech-to-text',
        ],
        disallow: [
          '/admin/',
          '/teacher/',
          '/profile/',
          '/wallet/',
          '/my-course/',
          '/learn/',
          '/api/',
          '/reset-password',
          '/verify-otp',
          '/*?*', // Prevent crawling search results or filtered pages with query params
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
