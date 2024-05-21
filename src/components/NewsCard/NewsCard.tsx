import Image from 'next/image';
import Link from 'next/link';

import { getTimerLocal } from '@/libs/utils/date-local';
import InteractiveNewsCard from '../UI/InteractiveNewsCard/InteractiveNewsCard';
import type { TNews } from '@/types/models.interface';
import styles from './NewsCard.module.css';

type Props = {
  newsOne: TNews;
};

export default function NewsCard({ newsOne }: Props) {
  // console.log(newsOne);

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
          <InteractiveNewsCard likes={20} messages={30} />
        </div>
      </div>
    </div>
  );
}
