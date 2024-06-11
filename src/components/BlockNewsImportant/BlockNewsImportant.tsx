import Image from 'next/image';
import Link from 'next/link';

import { blurBase64 } from '@/libs/image';
import { getNews } from '@/actions/news';
import styles from './BlockNewsImportant.module.css';

/**
 * Блок отображения важных новостей (новость с свойством impotent:true).
 */
export default async function BlockNewsImpotent() {
  const newsLast = await getNews({ docsOnPage: 2, query: { important: true } });
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
            priority={true}
            placeholder="blur"
            blurDataURL={blurBase64}
          />
          <h3 className={styles.title}>{newsOne.title}</h3>
        </Link>
      ))}
    </div>
  );
}
