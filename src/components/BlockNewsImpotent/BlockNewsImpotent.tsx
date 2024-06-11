import { getNews } from '@/actions/news';
import styles from './BlockNewsImpotent.module.css';

import Image from 'next/image';
import Link from 'next/link';
type Props = {};

/**
 * Блок отображения важных новостей (новость с свойством impotent:true).
 */
export default async function BlockNewsImpotent({}: Props) {
  const newsLast = await getNews({ docsOnPage: 2, query: { impotent: true } });
  return (
    <div className={styles.wrapper}>
      {newsLast?.news.map((newsOne) => (
        <Link
          className={styles.box__poster}
          href={`/news/${newsOne.urlSlug}`}
          key={newsOne._id}
        >
          <Image
            src={newsOne.poster}
            fill={true}
            sizes="(max-width: 576px 100wv) 33wv"
            alt={newsOne.title}
            className={styles.img}
          />
        </Link>
      ))}
    </div>
  );
}
