import BlockMessage from '../BlockMessage/BlockMessage';
import { TCheckRegisteredInChampDto } from '@/types/dto.types';
import styles from './BlockRegistered.module.css';

type Props = { registeredInChamp: TCheckRegisteredInChampDto };

export default function BlockRegistered({ registeredInChamp }: Props) {
  return (
    <BlockMessage>
      <>
        <h3 className={styles.title}>Вы зарегистрированы в данном Чемпионате в заезде:</h3>
        <dl className={styles.list}>
          <dt className={styles.desc__title}>Название</dt>
          <dd className={styles.desc__detail}>{registeredInChamp.race.name}</dd>

          <dt className={styles.desc__title}>Дистанция</dt>
          <dd className={styles.desc__detail}>{registeredInChamp.race.distance} км</dd>

          {registeredInChamp.race.ascent && (
            <>
              <dt className={styles.desc__title}>Общий набор</dt>
              <dd className={styles.desc__detail}>{registeredInChamp.race.ascent} м</dd>
            </>
          )}
        </dl>
      </>
    </BlockMessage>
  );
}
