import Image from 'next/image';

import type { TDtoChampionship } from '@/types/dto.types';
import styles from './BlockChampionshipHeader.module.css';
import { blurBase64 } from '@/libs/image';
import { formatDateInterval } from '@/libs/utils/calendar';
import { getTitleChampionship } from '@/app/championships/utils';

type Props = { championship: TDtoChampionship };

/**
 * Блок-заголовок для страницы Чемпионата.
 */
export default function BlockChampionshipHeader({ championship }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box__poster}>
        <Image
          src={championship.posterUrl}
          className={styles.poster}
          fill={true}
          alt={'poster'}
          sizes="(max-width: 992px) 100vw, (max-width: 2000px) 70vw, 90vw"
          priority={true}
          placeholder="blur"
          blurDataURL={blurBase64}
        />
      </div>

      <div className={styles.box__logo}>
        <Image
          src={championship.organizer.logoUrl}
          className={styles.logo}
          width={90}
          height={90}
          alt={'logo'}
        />
      </div>

      <div className={styles.box__date}>
        <h3 className={styles.title__date}>
          {formatDateInterval({
            startDate: new Date(championship.startDate),
            endDate: new Date(championship.endDate),
          })}
        </h3>
      </div>

      <section className={styles.block__text}>
        <div className={styles.box__title}>
          <h1 className={styles.title}>{getTitleChampionship(championship)}</h1>
        </div>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: championship.description }}
        />
      </section>
    </div>
  );
}
