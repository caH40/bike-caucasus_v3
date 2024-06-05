// Метаданные для страниц 404.

const server = process.env.NEXT_PUBLIC_SERVER_FRONT || 'https://bike-caucasus.ru';

const title = 'Страница не найдена - Ошибка 404';
const description =
  'К сожалению, запрашиваемая страница не найдена. Мы извиняемся за неудобства. Вернитесь на главную страницу или воспользуйтесь навигацией для поиска нужной информации.';
/**
 * Метаданные для домашней страницы "/" (home).
 */
export const metadata404Page = {
  metadataBase: new URL(server),
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    images: `./images/og/404.jpg`,
  },
};
