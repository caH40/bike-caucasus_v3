import Image from 'next/image';
import Link from 'next/link';
import cn from 'classnames/bind';

import { blurBase64 } from '@/libs/image';
import { bikeTypesMap } from '@/constants/trail';
import { championshipTypesMap } from '@/constants/championship';
import { getStagesCompleted, getStatusString } from '@/libs/utils/championship/championship';
import { formatDateInterval } from '@/libs/utils/calendar';
import StagesBox from '../StagesBox/StagesBox';
import BoxRegistrationChamp from '../UI/BoxRegistrationChamp/BoxRegistrationChamp';
import type { TDtoChampionship } from '@/types/dto.types';
import styles from './ChampionshipCard.module.css';
import StageName from '../StageName/StageName';

const cx = cn.bind(styles);

type Props = {
  championship: TDtoChampionship;
  simple?: boolean; // Используется для Этапа
  hasStages?: boolean; // Чемпионат Серия заездов или Тур (есть ли этапы). Отличаются отображаемые поля.
};

export default function ChampionshipCard({ championship, simple, hasStages }: Props) {
  const bike = bikeTypesMap.get(championship.bikeType);
  const IconBike = bike?.icon || null;

  return (
    <div className={cx('wrapper', { 'wrapper-simple': simple })}>
      <Link href={`/championships/${championship.urlSlug}`} className={styles.link}>
        <div className={cx('box__img', { 'box__img-simple': simple })}>
          <Image
            src={championship.posterUrl}
            fill={true}
            sizes="(max-width: 992px) 100vw, 25vw"
            alt={`image ${championship.name}`}
            className={styles.img}
            placeholder="blur"
            blurDataURL={blurBase64}
          />
        </div>
      </Link>

      <div className={styles.wrapper__info}>
        <div>
          <h3 className={styles.title__date}>
            {formatDateInterval({
              startDate: new Date(championship.startDate),
              endDate: new Date(championship.endDate),
            })}
          </h3>

          <Link href={`/championships/${championship.urlSlug}`} className={styles.link}>
            <h2 className={styles.title}>
              {simple ? (
                <StageName name={championship.name} stageOrder={championship.stageOrder} />
              ) : (
                championship.name
              )}
            </h2>
          </Link>
        </div>

        <div className={styles.bike}>
          <dl className={styles.list}>
            {!simple && (
              <>
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
              </>
            )}

            <dt className={styles.list__name}>Тип велосипеда:</dt>
            <dd className={styles.list__desc}>
              {IconBike && (
                <IconBike
                  squareSize={21}
                  tooltip={{
                    text: bike?.translation || 'неизвестно',
                    id: 'ChampionshipCard_IconBike',
                  }}
                  colors={{ default: `var(--${championship.bikeType})` }}
                />
              )}
              {bike?.translation || 'неизвестно'}
            </dd>
            {!simple && (
              <>
                <dt className={styles.list__name}>Тип соревнований:</dt>
                <dd className={styles.list__desc}>
                  {championshipTypesMap.get(championship.type)?.translation || 'неизвестно'}
                </dd>
              </>
            )}

            {/* До появления протокола указывать количество зарегистрировавшихся, после протоколов - количество участвовавших участников */}

            {!hasStages && (
              <>
                {['completed', 'cancelled'].includes(championship.status) ? (
                  <>
                    <dt className={styles.list__name}>Участники:</dt>
                    <dd className={styles.list__desc}>
                      {championship.races.reduce(
                        (acc, cur) => (acc += cur.quantityRidersFinished),
                        0
                      )}
                    </dd>
                  </>
                ) : (
                  <>
                    <dt className={styles.list__name}>Зарегистрировано:</dt>
                    <dd className={styles.list__desc}>
                      {championship.races.reduce(
                        (acc, cur) => (acc += cur.registeredRiders.length),
                        0
                      )}
                    </dd>
                  </>
                )}
              </>
            )}
          </dl>
        </div>
      </div>

      <div
        className={cx('wrapper__stages', {
          'wrapper__stages-simple': simple,
        })}
      >
        <div className={cx('block__stages')}>
          {!simple && <h3 className={styles.title__stages}>Этапы:</h3>}
          <StagesBox stages={championship.stageDateDescription} />
          <div className={styles.stages__completed}>
            <span>{simple ? 'завершено:' : 'завершено этапов: '}</span>
            <span>{getStagesCompleted({ stages: championship.stageDateDescription })}</span>
          </div>
        </div>

        <div className={styles.status}>{getStatusString({ championship })}</div>

        <BoxRegistrationChamp
          type={championship.type}
          status={championship.status}
          urlSlugChamp={championship.urlSlug}
        />
      </div>
    </div>
  );
}
