import Wrapper from '@/components/Wrapper/Wrapper';
import NewsShort from '@/components/NewsShort/NewsShort';
import { News } from '@/services/news';
import type { TNews } from '@/types/models.interface';
import styles from './Home.module.css';

async function getNews(quantity: number) {
  try {
    const news = new News();
    const response: { data: TNews[] | null; ok: boolean; message: string } = await news.getMany(
      {
        quantity,
      }
    );

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

export default async function Home() {
  const news = await getNews(4);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper title="Новости, события и анонсы мероприятий">
          <NewsShort news={news} />
        </Wrapper>
      </div>
      <aside className={styles.wrapper__aside}></aside>
    </div>
  );
}
