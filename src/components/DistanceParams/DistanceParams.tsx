import IconParamsDistance from '../Icons/IconParamsDistance';
import IconParamsAscent from '../Icons/IconParamsAscent';
import IconParamsLap from '../Icons/IconParamsLap';
import styles from './DistanceParams.module.css';
import { TSurfaceType } from '@/types/index.interface';
import IconParamsLow from '../Icons/IconParamsLow';
import IconParamsHight from '../Icons/IconParamsHight';
import IconRoad from '../Icons/IconRoad';
import { IconArrowTrendingUp } from '../Icons';
import { SURFACE_TYPE_TRANSLATIONS } from '@/constants/translations';

type Props = {
  distance: {
    distanceInMeter: number;
    ascentInMeter?: number;
    laps?: number;
    avgGrade?: number;
    lowestElev?: number;
    highestElev?: number;
    surfaceType?: TSurfaceType;
  };
  laps?: number;
  hideLaps?: boolean;
};

// отображение блока основных параметров Эвента
export default function DistanceParams({
  distance: { distanceInMeter, ascentInMeter, avgGrade, lowestElev, highestElev, surfaceType },
  laps = 1,
  hideLaps,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <IconParamsDistance squareSize={24} />
        <div className={styles.description}>
          <h4 className={styles.title}>{(Math.round(distanceInMeter / 100) / 10) * laps} км</h4>
          <p className={styles.title__sub}>РАССТОЯНИЕ</p>
        </div>
      </div>

      {ascentInMeter != null && (
        <div className={styles.box}>
          <IconParamsAscent squareSize={24} />
          <div className={styles.description}>
            <h4 className={styles.title}>{ascentInMeter * laps} м</h4>
            <p className={styles.title__sub}>НАБОР ВЫСОТЫ</p>
          </div>
        </div>
      )}

      {!hideLaps && laps && (
        <div className={styles.box}>
          <IconParamsLap squareSize={24} />
          <div className={styles.description}>
            <h4 className={styles.title}>{laps}</h4>
            <p className={styles.title__sub}>КРУГИ</p>
          </div>
        </div>
      )}

      {avgGrade && (
        <div className={styles.box}>
          <IconArrowTrendingUp squareSize={24} />
          <div className={styles.description}>
            <h4 className={styles.title}>{avgGrade} %</h4>
            <p className={styles.title__sub}>Ср. градиент</p>
          </div>
        </div>
      )}

      {lowestElev && (
        <div className={styles.box}>
          <IconParamsLow squareSize={24} />
          <div className={styles.description}>
            <h4 className={styles.title}>{lowestElev} м</h4>
            <p className={styles.title__sub}>Мин. высота</p>
          </div>
        </div>
      )}

      {highestElev && (
        <div className={styles.box}>
          <IconParamsHight squareSize={24} />
          <div className={styles.description}>
            <h4 className={styles.title}>{highestElev} м</h4>
            <p className={styles.title__sub}>Макс. высота</p>
          </div>
        </div>
      )}

      {surfaceType && (
        <div className={styles.box}>
          <IconRoad squareSize={24} />
          <div className={styles.description}>
            <h4 className={styles.title}>{SURFACE_TYPE_TRANSLATIONS[surfaceType]}</h4>
            <p className={styles.title__sub}>Тип покрытия</p>
          </div>
        </div>
      )}
    </div>
  );
}
