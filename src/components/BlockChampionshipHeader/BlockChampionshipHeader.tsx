import Image from 'next/image';

import type { TDtoChampionship } from '@/types/dto.types';
import styles from './BlockChampionshipHeader.module.css';
import { blurBase64 } from '@/libs/image';
import { getH1Championship } from '@/app/championships/utils';
import PeriodDates from '../PeriodDates/PeriodDates';

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
        <PeriodDates startDate={championship.startDate} endDate={championship.endDate} />
      </div>

      <section className={styles.block__text}>
        <div className={styles.box__title}>
          <h1 className={styles.title}>{getH1Championship(championship)}</h1>
        </div>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: championship.description }}
        />
      </section>
    </div>
  );
}
