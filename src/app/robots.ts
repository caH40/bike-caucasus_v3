import { MetadataRoute } from 'next';

const host = process.env.NEXT_PUBLIC_SERVER_FRONT || 'https://bike-caucasus.ru';

/**
 * Генерирует правила для файла robots.txt.
 * @returns {MetadataRoute.Robots} - Объект с правилами для robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/moderation',
          '/moderation/*',
          '/auth',
          '/auth/*',
          '/account',
          '/account/*',
          '/admin',
          '/admin/*',
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
  };
}
