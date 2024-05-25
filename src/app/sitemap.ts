import { UserService } from '@/services/mongodb/UserService';
import { MetadataRoute } from 'next';

const host = process.env.NEXT_PUBLIC_SERVER_FRONT || 'https://bike-caucasus.ru';

// Интервал времени в секундах когда обновляется sitemap.
export const revalidate = 1200;

const userService = new UserService();

/**
 * Генерирует карту сайта (sitemap) для сайта.
 * @returns {Promise<MetadataRoute.Sitemap>} - Объект карты сайта.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Генерация sitemap данных для страницы профиля пользователя
  const profilesDB = await userService.getProfiles();
  const profilesSitemap: MetadataRoute.Sitemap = (profilesDB.data || []).map((profile) => ({
    url: `${host}/profile/${profile.id}`,
    lastModified: profile.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

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
  ];
}
