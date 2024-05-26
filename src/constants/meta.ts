// Метаданные для страниц.

import { getNewsOne } from '@/app/news/[urlSlug]/page';
import { ResolvingMetadata, type Metadata } from 'next';

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
    'Новости велоспорта на Северном Кавказе | Соревнования, совместные тренировки, маршруты и события.',
  description:
    'Оставайтесь в курсе новостей велоспорта на Северном Кавказе! Соревнования, результаты, маршруты и совместные выезды для шоссейных и горных велосипедов.',
  alternates: {
    canonical: './',
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
    return metadataHomePage;
  }

  return {
    title: news.title,
    description: news.subTitle,
    openGraph: {
      title: news.title,
      description: news.subTitle,
      url: './',
      images: [news.poster],
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
    },
  };
}
