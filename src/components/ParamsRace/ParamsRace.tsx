import IconParamsDistance from '../Icons/IconParamsDistance';
import IconParamsAscent from '../Icons/IconParamsAscent';
import IconParamsLap from '../Icons/IconParamsLap';
import { TRaceClient } from '@/types/index.interface';
import styles from './ParamsRace.module.css';

type Props = {
  race: TRaceClient;
};

// отображение блока основных параметров Эвента
export default function ParamsRace({ race }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <IconParamsDistance squareSize={24} />
        <div className={styles.description}>
          <h4 className={styles.title}>{race.distance} км</h4>
          <p className={styles.title__sub}>РАССТОЯНИЕ</p>
        </div>
      </div>

      {race.ascent && (
        <div className={styles.box}>
          <IconParamsAscent squareSize={24} />
          <div className={styles.description}>
            <h4 className={styles.title}>{race.ascent} метров</h4>
            <p className={styles.title__sub}>НАБОР ВЫСОТЫ</p>
          </div>
        </div>
      )}

      <div className={styles.box}>
        <IconParamsLap squareSize={24} />
        <div className={styles.description}>
          <h4 className={styles.title}>{race.laps}</h4>
          <p className={styles.title__sub}>КРУГИ</p>
        </div>
      </div>
    </div>
  );
}
