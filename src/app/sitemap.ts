import { UserService } from '@/services/user';
import { News } from '@/services/news';
import { MetadataRoute } from 'next';
import { Trail } from '@/services/Trail';
import { OrganizerService } from '@/services/Organizer';
import { ChampionshipService } from '@/services/Championship';

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
  const championshipsRegistrationSitemap = await generateSitemapChampionshipRegistrationPages();

  // Генерация sitemap данных для страниц зарегистрированных на Чемпионат.
  const championshipsRegisteredSitemap = await generateSitemapChampionshipRegisteredPages();

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
    ...profilesSitemap, // profile
    ...newsSitemap, // news
    ...trailsSitemap, // trails
    ...organizersSitemap, // organizers
    ...championshipsSitemap, // championship pages
    ...championshipsRegistrationSitemap, // championship registration pages
    ...championshipsRegisteredSitemap, // championship registered pages
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
 * Генерирует sitemap данных для страниц Чемпионата /championships/[urlSlug]
 */
async function generateSitemapChampionshipPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const championshipService = new ChampionshipService();
    const championships = await championshipService.getMany({});

    const trailsSitemap: MetadataRoute.Sitemap = (championships.data || []).map((champ) => ({
      url: `${host}/championships/${champ.urlSlug}`,
      lastModified: new Date(champ.updatedAt).toISOString(),
      changeFrequency: 'hourly',
      priority: 0.9,
    }));

    return trailsSitemap;
  } catch (error) {
    return [];
  }
}

/**
 * Генерирует sitemap данных для страниц Регистрации на Чемпионат /championships/registration/[urlSlug]
 */
async function generateSitemapChampionshipRegistrationPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const championshipService = new ChampionshipService();
    const championships = await championshipService.getMany({});

    const trailsSitemap: MetadataRoute.Sitemap = (championships.data || []).map((champ) => ({
      url: `${host}/championships/registration/${champ.urlSlug}`,
      lastModified: new Date(champ.updatedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.2,
    }));

    return trailsSitemap;
  } catch (error) {
    return [];
  }
}

/**
 * Генерирует sitemap данных для страниц зарегистрированных на Чемпионат /championships/registered/[urlSlug]
 */
async function generateSitemapChampionshipRegisteredPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const championshipService = new ChampionshipService();
    const championships = await championshipService.getMany({});

    const trailsSitemap: MetadataRoute.Sitemap = (championships.data || []).map((champ) => ({
      url: `${host}/championships/registered/${champ.urlSlug}`,
      lastModified: new Date(champ.updatedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.2,
    }));

    return trailsSitemap;
  } catch (error) {
    return [];
  }
}
