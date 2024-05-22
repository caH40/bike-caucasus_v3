import Image from 'next/image';
import Link from 'next/link';

import InteractiveNewsCard from '../UI/InteractiveNewsCard/InteractiveNewsCard';
import { getTimerLocal } from '@/libs/utils/date-local';
import type { TNews } from '@/types/models.interface';
import styles from './NewsCard.module.css';

type Props = {
  newsOne: TNews & { isLikedByUser: boolean };
};

export default function NewsCard({ newsOne }: Props) {
  const idNews = newsOne?._id ? String(newsOne._id) : undefined;

  return (
    <div className={styles.wrapper}>
      <div className={styles.box__img}>
        <Link href={`/news/${newsOne.urlSlug}`} className={styles.link}>
          <Image
            src={newsOne.poster}
            fill={true}
            sizes="(max-width: 992px) 100vw, 20vw"
            alt={`image ${newsOne.title}`}
            className={styles.img}
          />
        </Link>
      </div>
      <div className={styles.wrapper__info}>
        <Link href={`/news/${newsOne.urlSlug}`} className={styles.link}>
          <h3 className={styles.title}>{newsOne.title}</h3>
        </Link>
        <Link href={`/news/${newsOne.urlSlug}`} className={styles.link}>
          <p className={styles.subtitle}>{newsOne.subTitle}</p>
        </Link>
        <div className={styles.bottom}>
          <span>{getTimerLocal(newsOne.createdAt, 'DDMMYYHm')}</span>
          <InteractiveNewsCard
            likes={newsOne.likesCount}
            isLikedByUser={newsOne.isLikedByUser}
            idNews={idNews}
            views={newsOne.viewsCount}
          />
        </div>
      </div>
    </div>
  );
}
