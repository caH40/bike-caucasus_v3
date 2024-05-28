import { UserService } from '@/services/user';
import { News } from '@/services/news';
import { MetadataRoute } from 'next';

const host = process.env.NEXT_PUBLIC_SERVER_FRONT || 'https://bike-caucasus.ru';

// Интервал времени в секундах когда обновляется sitemap.
export const revalidate = 1200;

/**
 * Генерирует карту сайта (sitemap) для сайта.
 * @returns {Promise<MetadataRoute.Sitemap>} - Объект карты сайта.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Генерация sitemap данных для страниц профилей пользователей.
  const profilesSitemap = await generateSitemapProfilePages();

  // Генерация sitemap данных для страниц Новость.
  const newsSitemap = await generateSitemapNewsPages();

  return [
    {
      url: host,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${host}/webcam`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...profilesSitemap, // profile
    ...newsSitemap, // news
  ];
}

/**
 * Генерирует sitemap данных для страниц профилей пользователей.
 */
async function generateSitemapProfilePages(): Promise<MetadataRoute.Sitemap> {
  try {
    const userService = new UserService();
    const profilesDB = await userService.getProfiles();

    const profilesSitemap: MetadataRoute.Sitemap = (profilesDB.data || []).map((profile) => ({
      url: `${host}/profile/${profile.id}`,
      lastModified: profile.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.5,
    }));

    return profilesSitemap;
  } catch (error) {
    return [];
  }
}

/**
 * Генерирует sitemap данных для страниц Новость /news/urlSlug
 */
async function generateSitemapNewsPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const newsService = new News();

    const newsDB = await newsService.getMany({ quantity: 100 }); // Последние 100 новости.
    const newsSitemap: MetadataRoute.Sitemap = (newsDB.data || []).map((newsOne) => ({
      url: `${host}/news/${newsOne.urlSlug}`,
      lastModified: newsOne.updatedAt,
      changeFrequency: 'hourly',
      priority: 1,
    }));

    return newsSitemap;
  } catch (error) {
    return [];
  }
}
