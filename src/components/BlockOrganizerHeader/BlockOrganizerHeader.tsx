import Image from 'next/image';

import type { TDtoOrganizer } from '@/types/dto.types';
import styles from './BlockOrganizerHeader.module.css';
import { blurBase64 } from '@/libs/image';

type Props = { organizer: TDtoOrganizer };

/**
 * Блок-заголовок для страницы Организатора Чемпионатов.
 */
export default function BlockOrganizerHeader({ organizer }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box__poster}>
        <Image src={organizer.posterUrl} className={styles.poster} fill={true} alt={'poster'} />
      </div>

      <div className={styles.box__logo}>
        <Image
          src={organizer.logoUrl}
          className={styles.logo}
          width={90}
          height={90}
          alt={'logo'}
          sizes="(max-width: 992px) 100vw, 20vw"
          priority={true}
          placeholder="blur"
          blurDataURL={blurBase64}
        />
      </div>

      <section className={styles.block__text}>
        <div className={styles.box__title}>
          <h1 className={styles.title}>{organizer.name}</h1>
        </div>

        <div className={styles.description}>{organizer.description}</div>
      </section>
    </div>
  );
}
