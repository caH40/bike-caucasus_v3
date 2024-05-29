import Image from 'next/image';
import Link from 'next/link';

import InteractiveBlockNews from '../UI/InteractiveBlockNews/InteractiveBlockNews';
import { getTimerLocal } from '@/libs/utils/date-local';
import type { TNewsGetOneDto } from '@/types/dto.types';
import styles from './NewsCard.module.css';

type Props = {
  newsOne: TNewsGetOneDto;
};

export default function NewsCard({ newsOne }: Props) {
  const idNews = newsOne?._id ? String(newsOne._id) : undefined;

  return (
    <div className={styles.wrapper}>
      <Link href={`/news/${newsOne.urlSlug}`} className={styles.link}>
        <div className={styles.box__img}>
          <Image
            src={newsOne.poster}
            fill={true}
            sizes="(max-width: 992px) 100vw, 20vw"
            alt={`image ${newsOne.title}`}
            className={styles.img}
            priority={true}
          />
        </div>
      </Link>
      <div className={styles.wrapper__info}>
        <Link href={`/news/${newsOne.urlSlug}`} className={styles.link}>
          <h3 className={styles.title}>{newsOne.title}</h3>
        </Link>
        <Link href={`/news/${newsOne.urlSlug}`} className={styles.link}>
          <p className={styles.subtitle}>{newsOne.subTitle}</p>
        </Link>
        <div className={styles.bottom}>
          <span>{getTimerLocal(newsOne.createdAt, 'DDMMYYHm')}</span>
          <InteractiveBlockNews
            likesCount={newsOne.likesCount}
            isLikedByUser={newsOne.isLikedByUser}
            idNews={idNews}
            viewsCount={newsOne.viewsCount}
          />
        </div>
      </div>
    </div>
  );
}
