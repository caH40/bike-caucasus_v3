import { getServerSession } from 'next-auth';

import Wrapper from '@/components/Wrapper/Wrapper';
import NewsShort from '@/components/NewsShort/NewsShort';
import BlockNews from '@/components/BlockNews/BlockNews';
import { News } from '@/services/news';
import { authOptions } from './api/auth/[...nextauth]/auth-options';
import type { TNews } from '@/types/models.interface';
import styles from './Home.module.css';

async function getNews({ quantity, idUserDB }: { quantity: number; idUserDB?: string }) {
  try {
    const news = new News();
    const response: {
      data: (TNews & { isLikedByUser: boolean })[] | null;
      ok: boolean;
      message: string;
    } = await news.getMany({
      quantity,
      idUserDB,
    });

    if (!response.ok) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error({ message: error.message }); // eslint-disable-line no-console
    }
    console.error(error); // eslint-disable-line no-console
  }
}

/**
 * Главная (домашняя) страница сайта.
 */
export default async function Home() {
  const session = await getServerSession(authOptions);

  const news = await getNews({ quantity: 6, idUserDB: session?.user.idDB });

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper title="Новости, события и анонсы мероприятий">
          <NewsShort news={news} />
          <BlockNews news={news} />
        </Wrapper>
      </div>
      <aside className={styles.wrapper__aside}></aside>
    </div>
  );
}
