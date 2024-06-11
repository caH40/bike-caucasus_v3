import NewsCard from '../NewsCard/NewsCard';
import TitleAndLine from '../TitleAndLine/TitleAndLine';
import { getNews } from '@/actions/news';
import styles from './BlockNews.module.css';

type Props = {
  idUserDB?: string | undefined;
};

export default async function BlockNews({ idUserDB }: Props) {
  const news = await getNews({ idUserDB, page: 1, docsOnPage: 5 });

  return (
    !!news?.news.length && (
      <div className={styles.wrapper}>
        <TitleAndLine hSize={2} title="Новости" />
        <div className={styles.wrapper__cards}>
          {news.news.map((elm) => (
            <NewsCard key={String(elm._id)} newsOne={elm} />
          ))}
        </div>
      </div>
    )
  );
}
