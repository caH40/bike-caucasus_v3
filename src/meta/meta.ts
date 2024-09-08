// Метаданные для страниц.

import { getTrail } from '@/actions/trail';
import { getNewsOne } from '@/app/news/[urlSlug]/page';
import { ResolvingMetadata, type Metadata } from 'next';
import { bikeTypes, regions } from '../constants/trail';
import { metadata404Page } from './meta404';
import { UserService } from '@/services/user';
import { OrganizerService } from '@/services/Organizer';
import { getChampionship } from '@/actions/championship';
import {
  getDescriptionChampionship,
  getDescriptionForRegistered,
  getDescriptionForRegistration,
  getDescriptionResultsRace,
  getTitleChampionship,
  getTitleForRegistered,
  getTitleForRegistration,
  getTitleResultsRace,
} from '@/app/championships/utils';

type Props = {
  params: {
    urlSlug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};
// eslint-disable-next-line no-unused-vars
type Parent = ResolvingMetadata;

const server = process.env.NEXT_PUBLIC_SERVER_FRONT || 'https://bike-caucasus.ru';

/**
 * Метаданные для домашней страницы "/" (home).
 */
export const metadataHomePage = {
  metadataBase: new URL(server),
  title:
    'Новости велоспорта на Северном Кавказе. Соревнования, совместные тренировки, маршруты и события.',
  description:
    'Оставайтесь в курсе новостей велоспорта на Северном Кавказе! Соревнования, результаты, маршруты и совместные выезды для шоссейных и горных велосипедов.',
  alternates: {
    canonical: './',
  },
  // Добавляем метаданные для Яндекс
  other: {
    'yandex-verification': 'bccbba4d470fdd1c',
  },

  openGraph: {
    title: 'Новости велоспорта на Северном Кавказе | Соревнования, маршруты и события',
    description:
      'Оставайтесь в курсе новостей велоспорта на Северном Кавказе! Соревнования, результаты, маршруты и совместные выезды для шоссейных и горных велосипедов.',
    url: './',
    type: 'website',
    images: `./images/og/main.jpg`,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', sizes: 'any' },
      { url: '/favicon/favicon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'manifest',
        url: '/favicon/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        url: '/favicon/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
};

/**
 * Метаданные для страницы Новость "/news/[urlSlug]".
 */
export async function generateMetadataNews({ params }: Props): Promise<Metadata> {
  const urlSlug = params.urlSlug;

  const news = await getNewsOne({ urlSlug });
  if (!news) {
    return metadata404Page;
  }

  return {
    title: news.title,
    description: news.subTitle,
    openGraph: {
      title: news.title,
      description: news.subTitle,
      url: './',
      images: [news.poster],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Вебкамеры "/webcam".
 */
export function generateMetadataWebcam(): Metadata {
  const title = 'Вебкамеры на горе Шаджатмаз по дороге на Джилы-Су.';
  const description =
    'Вебкамеры на горе Шаджатмаз на высоте 2000 метров. Потрясающие виды на Эльбрус, КМВ, Учкекен, Канжол, дорога на теплые источники Джилы-СУ.';
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: './',
      images: '/images/og/webcam.jpg',
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Маршруты "/trails".
 */
export async function generateMetadataTrails(): Promise<Metadata> {
  const title = 'Захватывающие велосипедные маршруты по Кавказу';
  const description =
    'Велосипедные маршруты по региону Кавказские Минеральные Воды, республикам Карачаево-Черкессия, Кабардино-Балкария, Северная Осетия для шоссейных, гравийных и горных байков.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: ['/images/og/Hurzuk.JPG'],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Маршрут "/trails/[urlSlug]".
 */
export async function generateMetadataTrail({ params }: Props): Promise<Metadata> {
  const urlSlug = params.urlSlug;

  const trail = await getTrail(urlSlug);

  if (!trail) {
    return metadata404Page;
  }

  const region = regions.find((region) => region.name === trail.region)?.translation || '';
  const bikeType = bikeTypes.find((type) => type.name === trail.bikeType)?.translation || '';

  const title = `${trail.title} - Велосипедный маршрут со стартом из ${trail.startLocation}`;
  const description = `На велосипеде ${trail.title}, маршрут пролегает в регионе ${region} со стартом из ${trail.startLocation}. Маршрут для типа велосипеда - ${bikeType}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: [trail.poster],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Календарь "/calendar".
 */
export function generateMetadataCalendar(): Metadata {
  const title = `Календарь соревнований на Кавказе по велоспорту в дисциплинах: кросскантри, шоссе и грэвел`;
  const description = `Календарь велосоревнований на Кавказе: кросскантри, горный, шоссейный и грэвел. Узнайте о событиях в Ставрополье, Краснодаре, КЧР, КБР и Северной Осетии и не пропустите важные события!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: ['/images/og/calendar.JPG'],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Профиль "/profile/[id]".
 */
export async function generateMetadataProfile({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata> {
  const userService = new UserService();

  const { data: profile } = await userService.getProfile({ id: +params.id });
  if (!profile) {
    return metadata404Page;
  }

  const title = `Профиль спортсмена ${profile.person.lastName} ${profile.person.firstName} | Велосипедные маршруты и соревнования на Кавказе.`;
  const description = `Откройте профиль спортсмена ${profile.person.lastName} ${profile.person.firstName} для вдохновения и советов по велоспорту, соревнованиям и маршрутам на Кавказе.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: [profile.image],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Организаторы "/organizers".
 */
const titleOrganizers = 'Организаторы Чемпионатов по любительскому велоспорту на Кавказе';
const descriptionOrganizers =
  'Организаторы соревнований, гонок-тренировок, чемпионатов по любительскому велоспорту в Ставропольском, Краснодарском крае, КЧР, КБР, Северной Осетии';
export const metadataOrganizers: Metadata = {
  title: titleOrganizers,
  description: descriptionOrganizers,
  openGraph: {
    title: titleOrganizers,
    description: descriptionOrganizers,
    url: './',
    images: ['/images/og/organizers.jpg'],
    type: 'website',
  },
};

/**
 * Метаданные для страницы Организатор "/organizers/[urlSlug]".
 */
export async function generateMetadataOrganizer({ params }: Props): Promise<Metadata> {
  const organizerService = new OrganizerService();
  const { data: organizer } = await organizerService.getOne({ urlSlug: params.urlSlug });

  if (!organizer) {
    return metadata404Page;
  }

  const title = `${organizer.name} - организатор Чемпионатов по любительскому велоспорту из города ${organizer.address.city}`;
  const description = `Организатор ${organizer.name} проводит соревнования, гонки-тренировки, чемпионаты по любительскому велоспорту в регионе ${organizer.address.state} и на Кавказе`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: [organizer.posterUrl],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Чемпионаты "/championships".
 */
const titleChampionships =
  'Чемпионаты по любительскому велоспорту на Кавказе, в Ставропольском крае, Краснодарском крае, КЧР, КБР, Северной Осетии';
const descriptionChampionships =
  'Соревнования, гонки-тренировки, чемпионаты по любительскому велоспорту на шоссе, МТБ, даунхил в Ставропольском крае, Краснодарском крае, КЧР, КБР, Северной Осетии';
export const metadataChampionships: Metadata = {
  title: titleChampionships,
  description: descriptionChampionships,
  openGraph: {
    title: titleChampionships,
    description: descriptionChampionships,
    url: './',
    images: ['/images/og/organizers.jpg'],
    type: 'website',
  },
};

/**
 * Метаданные для страницы Чемпионат "/championships/[urlSlug]".
 */
export async function generateMetadataChampionship({
  params: { urlSlug },
}: Props): Promise<Metadata> {
  const { data } = await getChampionship({ urlSlug });

  if (!data) {
    return metadata404Page;
  }

  const title = getTitleChampionship({ champ: data });
  const description = getDescriptionChampionship({ champ: data });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: [data.posterUrl],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Регистрация на Чемпионат "/championships/registration/[urlSlug]".
 */
export async function generateMetadataChampRegistration({
  params: { urlSlug },
}: Props): Promise<Metadata> {
  const { data } = await getChampionship({ urlSlug });

  if (!data) {
    return metadata404Page;
  }

  const title = getTitleForRegistration({ champ: data });
  const description = getDescriptionForRegistration({ champ: data });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: [data.posterUrl],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Регистрация на Чемпионат "/championships/registered/[urlSlug]".
 */
export async function generateMetadataChampRegistered({
  params: { urlSlug },
}: Props): Promise<Metadata> {
  const { data } = await getChampionship({ urlSlug });

  if (!data) {
    return metadata404Page;
  }

  const title = getTitleForRegistered({ champ: data });
  const description = getDescriptionForRegistered({ champ: data });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: [data.posterUrl],
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Результаты заездов "/championships/results/registered/[urlSlug]".
 */
export async function generateMetadataResultsRace({
  params: { urlSlug },
}: Props): Promise<Metadata> {
  const { data } = await getChampionship({ urlSlug });

  if (!data) {
    return metadata404Page;
  }

  const title = getTitleResultsRace({ champ: data });
  const description = getDescriptionResultsRace({ champ: data });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: './',
      images: [data.posterUrl],
      type: 'website',
    },
  };
}
