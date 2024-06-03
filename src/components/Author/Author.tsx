import Image from 'next/image';
import Link from 'next/link';

import { getTimerLocal } from '@/libs/utils/date-local';
import { getLogoProfile } from '@/libs/utils/profile';
import styles from './Author.module.css';
import type { TAuthor } from '@/types/dto.types';

type Props = {
  data: {
    author: TAuthor;
    createdAt: Date;
  };
};

/**
 * Автор статьи, новости, маршрута и т.д.
 */
export default function Author({ data }: Props) {
  return (
    <div className={styles.wrapper}>
      <Link href={`/profile/${data.author?.id}`} className={styles.author__name}>
        <Image
          width={24}
          height={24}
          alt={'Постер новости'}
          src={getLogoProfile(
            data.author?.imageFromProvider,
            data.author?.provider.image,
            data.author?.image
          )}
          className={styles.author__img}
          priority={true}
        />
      </Link>
      {data.author ? (
        <Link href={`/profile/${data.author?.id}`} className={styles.author__name}>
          {data.author?.person.firstName} {data.author?.person.lastName}
        </Link>
      ) : (
        <span>Неизвестный</span>
      )}

      <span className={styles.author__date}>{getTimerLocal(data.createdAt, 'DDMMYYHm')}</span>
    </div>
  );
}
