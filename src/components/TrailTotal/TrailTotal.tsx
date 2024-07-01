import { TTrailDto } from '@/types/dto.types';

import styles from './TrailTotal.module.css';
import Link from 'next/link';
import { difficultyLevel, regions } from '@/constants/trail';

type Props = {
  trail: TTrailDto;
};

export default function TrailTotal({ trail }: Props) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Сводные данные по маршруту:</h3>
      <dl className={styles.list}>
        <div className={styles.box__list}>
          <dt className={styles.term}>Старт</dt>
          <dd className={styles.description}>{trail.startLocation}</dd>
        </div>

        <div className={styles.box__list}>
          <dt className={styles.term}>Разворот</dt>
          <dd className={styles.description}>{trail.turnLocation}</dd>
        </div>

        <div className={styles.box__list}>
          <dt className={styles.term}>Финиш</dt>
          <dd className={styles.description}>{trail.finishLocation}</dd>
        </div>

        <div className={styles.box__list}>
          <dt className={styles.term}>Дистанция</dt>
          <dd className={styles.description}>
            {trail.distance}
            {'км'}
          </dd>
        </div>

        <div className={styles.box__list}>
          <dt className={styles.term}>Набор высоты</dt>
          <dd className={styles.description}>
            {trail.ascent}
            {'м'}
          </dd>
        </div>

        <div className={styles.box__list}>
          <dt className={styles.term}>Уровень сложности</dt>
          <dd className={styles.description}>
            {difficultyLevel.find((level) => level.name === trail.difficultyLevel)
              ?.translation || 'нет данных'}
          </dd>
        </div>

        <div className={styles.box__list}>
          <dt className={styles.term}>Регион</dt>
          <dd className={styles.description}>
            {regions.find((region) => region.name === trail.region)?.translation ||
              'нет данных'}
          </dd>
        </div>

        {trail.garminConnect && (
          <div className={styles.box__list}>
            <dt className={styles.term}>Garmin Connect</dt>
            <dd className={styles.description}>
              <Link
                className={styles.link}
                target="blank"
                href={trail.garminConnect}
                rel="noreferrer"
              >
                Ссылка на маршрут
              </Link>
            </dd>
          </div>
        )}

        {trail.komoot && (
          <div className={styles.box__list}>
            <dt className={styles.term}>Komoot</dt>
            <dd className={styles.description}>
              <Link className={styles.link} target="blank" href={trail.komoot} rel="noreferrer">
                Ссылка на маршрут
              </Link>
            </dd>
          </div>
        )}

        {trail.trackGPX && (
          <div className={styles.box__list}>
            <dt className={styles.term}>Трэк GPX</dt>
            <dd className={styles.description}>
              <Link
                className={styles.link}
                target="blank"
                href={trail.trackGPX}
                rel="noreferrer"
              >
                Скачать GPX
              </Link>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
