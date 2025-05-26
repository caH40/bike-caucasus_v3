import { UserService } from '@/services/user';
import { News } from '@/services/news';
import { MetadataRoute } from 'next';
import { Trail } from '@/services/Trail';
import { OrganizerService } from '@/services/Organizer';
import { ChampionshipService } from '@/services/Championship';
import { millisecondsInDay } from '@/constants/date';

const host = process.env.NEXT_PUBLIC_SERVER_FRONT || 'https://bike-caucasus.ru';

// Интервал времени в секундах когда обновляется sitemap.
export const revalidate = 600;

/**
 * Генерирует карту сайта (sitemap) для сайта.
 * @returns {Promise<MetadataRoute.Sitemap>} - Объект карты сайта.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Генерация sitemap данных для страниц профилей пользователей.
  const profilesSitemap = await generateSitemapProfilePages();

  // Генерация sitemap данных для страниц Новость.
  const newsSitemap = await generateSitemapNewsPages();

  // Генерация sitemap данных для страниц описание Маршрута.
  const trailsSitemap = await generateSitemapTrailPages();

  // Генерация sitemap данных для страниц Организаторов.
  const organizersSitemap = await generateSitemapOrganizerPages();

  // Генерация sitemap данных для страниц Чемпионат.
  const championshipsSitemap = await generateSitemapChampionshipPages();

  // Генерация sitemap данных для страниц Регистрации на Чемпионат.
  const championshipsRegistrationSitemap = await generateSitemapChampionshipPages(
    'registration'
  );

  // Генерация sitemap данных для страниц результатов на Чемпионата.
  const championshipsResultsSitemap = await generateSitemapChampionshipPages('results');

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
    {
      url: `${host}/trails`,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${host}/calendar`,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${host}/organizers`,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${host}/championships`,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...profilesSitemap, // profile.
    ...newsSitemap, // news.
    ...trailsSitemap, // trails.
    ...organizersSitemap, // organizers.
    ...championshipsSitemap, // championship pages.
    ...championshipsRegistrationSitemap, // championship registration pages.
    ...championshipsResultsSitemap, // championship results pages.
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

    const responseWithNews = await newsService.getMany({ docsOnPage: 100 }); // Последние 100 новости.
    const newsSitemap: MetadataRoute.Sitemap = (responseWithNews.data?.news || []).map(
      (newsOne) => ({
        url: `${host}/news/${newsOne.urlSlug}`,
        lastModified: newsOne.updatedAt,
        changeFrequency: 'monthly',
        priority: 1,
      })
    );

    return newsSitemap;
  } catch (error) {
    return [];
  }
}

/**
 * Генерирует sitemap данных для страниц Маршрут /trails/urlSlug
 */
async function generateSitemapTrailPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const trailService = new Trail();
    const trails = await trailService.getMany({});

    const trailsSitemap: MetadataRoute.Sitemap = (trails.data || []).map((trail) => ({
      url: `${host}/trails/${trail.urlSlug}`,
      lastModified: trail.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return trailsSitemap;
  } catch (error) {
    return [];
  }
}

/**
 * Генерирует sitemap данных для страниц Организаторов /organizers/urlSlug
 */
async function generateSitemapOrganizerPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const organizerService = new OrganizerService();
    const organizers = await organizerService.getMany();

    const trailsSitemap: MetadataRoute.Sitemap = (organizers.data || []).map((organizer) => ({
      url: `${host}/organizers/${organizer.urlSlug}`,
      lastModified: new Date(organizer.updatedAt).toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return trailsSitemap;
  } catch (error) {
    return [];
  }
}

/**
 * Генерирует sitemap данных для страниц Чемпионата /championships/[entity]/[urlSlug]
 */
async function generateSitemapChampionshipPages(
  entity?: 'registered' | 'results' | 'registration' | 'documents'
): Promise<MetadataRoute.Sitemap> {
  try {
    const championshipService = new ChampionshipService();
    const championships = await championshipService.getMany({});

    const trailsSitemap: MetadataRoute.Sitemap = (championships.data || []).map((champ) => {
      const lastModified = new Date(champ.updatedAt);
      const isOld = Date.now() >= lastModified.getTime() + millisecondsInDay;

      return {
        url: `${host}/championships/${entity ? entity + '/' : ''}${champ.urlSlug}`,
        lastModified: lastModified.toISOString(),
        changeFrequency: isOld ? 'yearly' : 'hourly',
        priority: isOld ? 0.1 : 1,
      };
    });

    return trailsSitemap;
  } catch (error) {
    return [];
  }
}
