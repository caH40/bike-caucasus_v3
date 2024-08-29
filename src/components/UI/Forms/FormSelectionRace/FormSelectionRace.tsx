'use client';

import { TOptions } from '@/types/index.interface';

import { useRaceProtocol } from '@/store/protocol';
import styles from '@/UI/Select/Select.module.css';

type Props = { options: TOptions[] };

/**
 * Форма выбора Заезда для добавления финишного протокола в него.
 */
export default function FormSelectionRace({ options }: Props) {
  const raceNumber = useRaceProtocol((state) => state.raceNumber);
  const setRaceNumber = useRaceProtocol((state) => state.setRaceNumber);

  return (
    <form>
      <label className={styles.label} htmlFor={'selectRace'}>
        Выбор заезда для добавления результатов:
      </label>
      <select
        className={styles.select}
        id="selectRace"
        value={raceNumber}
        onChange={(e) => setRaceNumber(isNaN(+e.target.value) ? 1 : +e.target.value)}
      >
        {options.map((elm) => (
          <option key={elm.id} value={elm.name} className={styles.option}>
            {elm.translation}
          </option>
        ))}
      </select>
    </form>
  );
}
