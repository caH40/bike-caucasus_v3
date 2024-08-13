import Image from 'next/image';
import Link from 'next/link';

import { blurBase64 } from '@/libs/image';
import type { TDtoChampionship } from '@/types/dto.types';
import styles from './ChampionshipCard.module.css';
import { bikeTypesMap } from '@/constants/trail';
import { championshipStatusMap, championshipTypesMap } from '@/constants/championship';
import Button from '../UI/Button/Button';

type Props = {
  championship: TDtoChampionship;
};

export default function ChampionshipCard({ championship }: Props) {
  const bike = bikeTypesMap.get(championship.bikeType);
  const IconBike = bike?.icon || null;

  return (
    <div className={styles.wrapper}>
      <Link href={`/championships/${championship.urlSlug}`} className={styles.link}>
        <div className={styles.box__img}>
          <Image
            src={championship.posterUrl}
            fill={true}
            sizes="(max-width: 992px) 100vw, 25vw"
            alt={`image ${championship.name}`}
            className={styles.img}
            priority={true}
            placeholder="blur"
            blurDataURL={blurBase64}
          />
        </div>
      </Link>

      <div className={styles.wrapper__info}>
        <div>
          <h3 className={styles.title__date}>{championship.startDate}</h3>
          <Link href={`/championships/${championship.urlSlug}`} className={styles.link}>
            <h2 className={styles.title}>{championship.name}</h2>
          </Link>
        </div>

        <div className={styles.bike}>
          <dl className={styles.list}>
            <dt className={styles.list__name}>Организатор:</dt>
            <dd className={styles.list__desc}>
              <Image
                src={championship.organizer.logoUrl}
                width={21}
                height={21}
                alt={`image ${championship.organizer.name}`}
              />
              {championship.organizer.name}
            </dd>

            <dt className={styles.list__name}>Тип велосипеда:</dt>
            <dd className={styles.list__desc}>
              {IconBike && (
                <IconBike
                  squareSize={21}
                  tooltip={bike?.translation || 'неизвестно'}
                  colors={{ default: `var(--${championship.bikeType})` }}
                />
              )}
            </dd>

            <dt className={styles.list__name}>Тип соревнований:</dt>
            <dd className={styles.list__desc}>
              {championshipTypesMap.get(championship.type)?.translation || 'неизвестно'}
            </dd>

            {/* до появления протокола указывать количество зарегистрировавшихся, после протоколов - количество участвовавших участников */}
            <dt className={styles.list__name}>Участники:</dt>
            <dd className={styles.list__desc}>{10} чел. </dd>
          </dl>
        </div>
      </div>

      <div className={styles.wrapper__stages}>
        <div className={styles.block__stages}>Этапы</div>

        <div className={styles.status}>
          {championshipStatusMap.get(championship.status)?.translation}
        </div>

        <Button theme="green" name="Регистрация" />
      </div>
    </div>
  );
}
