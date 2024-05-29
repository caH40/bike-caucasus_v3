import NewsCard from '../NewsCard/NewsCard';
import TitleAndLine from '../UI/TitleAndLine/TitleAndLine';
import type { TNewsGetOneDto } from '@/types/dto.types';
import styles from './BlockNews.module.css';

type Props = {
  news: TNewsGetOneDto[] | null | undefined;
};

export default function BlockNews({ news }: Props) {
  return (
    !!news?.length && (
      <div className={styles.wrapper}>
        <TitleAndLine hSize={2} title="Новости" />
        <div className={styles.wrapper__cards}>
          {news.map((elm) => (
            <NewsCard key={String(elm._id)} newsOne={elm} />
          ))}
        </div>
      </div>
    )
  );
}
