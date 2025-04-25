import { TRaceClient } from '@/types/index.interface';
import BlockMessage from '../BlockMessage/BlockMessage';
import styles from './BlockRaceInfo.module.css';

type Props = {
  race: TRaceClient | undefined;
  raceNumber: string;
};

export default function BlockRaceInfo({ race, raceNumber }: Props) {
  return (
    <BlockMessage>
      <>
        {race ? (
          <dl className={styles.list}>
            <dt className={styles.desc__title}>Название</dt>
            <dd className={styles.desc__detail}>{race.name}</dd>

            <dt className={styles.desc__title}>Дистанция</dt>
            <dd className={styles.desc__detail}>{race.distance} км</dd>

            {race.ascent != null && (
              <>
                <dt className={styles.desc__title}>Общий набор</dt>
                <dd className={styles.desc__detail}>{race.ascent} м</dd>
              </>
            )}

            <dt className={styles.desc__title}>Описание</dt>
            <dd className={styles.desc__detail}>{race.description} км</dd>
          </dl>
        ) : (
          `Не найден заезд под номером ${raceNumber}`
        )}
      </>
    </BlockMessage>
  );
}
