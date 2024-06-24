import Image from 'next/image';
import Link from 'next/link';

import InteractiveBlock from '../UI/InteractiveBlock/InteractiveBlock';
import { getTimerLocal } from '@/libs/utils/date-local';
import { blurBase64 } from '@/libs/image';
import type { TNewsGetOneDto } from '@/types/dto.types';
import styles from './NewsCard.module.css';

type Props = {
  newsOne: TNewsGetOneDto;
};

export default function NewsCard({ newsOne }: Props) {
  const idNews = newsOne._id;

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
            placeholder="blur"
            blurDataURL={blurBase64}
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
          <InteractiveBlock
            likesCount={newsOne.likesCount}
            isLikedByUser={newsOne.isLikedByUser}
            idDocument={idNews}
            viewsCount={newsOne.viewsCount}
            commentsCount={newsOne.commentsCount}
            target="news"
          />
        </div>
      </div>
    </div>
  );
}
