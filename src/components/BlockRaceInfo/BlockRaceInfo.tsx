import { TRaceForForm } from '@/types/index.interface';
import BlockMessage from '../BlockMessage/BlockMessage';
import styles from './BlockRaceInfo.module.css';

type Props = {
  race: TRaceForForm;
};

export default function BlockRaceInfo({ race }: Props) {
  return (
    <BlockMessage>
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
    </BlockMessage>
  );
}
