// Метаданные для страниц.

import { getTrail } from '@/actions/trail';
import { getNewsOne } from '@/app/news/[urlSlug]/page';
import { ResolvingMetadata, type Metadata } from 'next';
import { bikeTypes, regions } from '../constants/trail';
import { metadata404Page } from './meta404';
import { ParamsWithId } from '@/types/index.interface';
import { UserService } from '@/services/user';

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
      { url: '/favicon/favicon-120x120.png', sizes: '16x16', type: 'image/png' },
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
      images: '/images/og/Webcam.jpg',
      type: 'website',
    },
  };
}

/**
 * Метаданные для страницы Новость "/trails/[urlSlug]".
 */
export async function generateMetadataTrails(): Promise<Metadata> {
  const title = 'Захватывающие велосипедные маршруты по Кавказу';
  const description =
    'Велосипедные маршруты по Ставропольскому краю, республикам Карачаево-Черкессия, Кабардино-Балкария, Северная Осетия для шоссейных, гравийных и горных байков.';

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
 * Метаданные для страницы Новость "/trails/[urlSlug]".
 */
export async function generateMetadataTrail({ params }: Props): Promise<Metadata> {
  const urlSlug = params.urlSlug;

  const trail = await getTrail(urlSlug);

  if (!trail) {
    return metadata404Page;
  }

  const region = regions.find((region) => region.name === trail.region)?.translation || '';
  const bikeType = bikeTypes.find((type) => type.name === trail.bikeType)?.translation || '';

  const title = `${trail.title} - Велосипедный маршрут в регионе ${region}`;
  const description = `Откройте для себя велосипедный маршрут ${trail.title}, пролегающий в ${region}. Старт из ${trail.startLocation}, с разворотом в ${trail.turnLocation}. Идеально для ${bikeType} велосипед.`;

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
 * Метаданные для страницы Новость "/calendar".
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
export async function generateMetadataProfile({ params }: ParamsWithId): Promise<Metadata> {
  const userService = new UserService();

  const { data: profile } = await await userService.getProfile({ id: +params.id });
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
