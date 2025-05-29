import { UseFormRegister } from 'react-hook-form';
import styles from './BlockRacePointsInput.module.css';

// types
import { TRacePointsTableForm } from '@/types/index.interface';

type Props = {
  register: UseFormRegister<TRacePointsTableForm>;
  index: number;
};

/**
 * Блок ввода данных место-очки за этап серии заездов.
 */
export default function BlockRacePointsInput({ register, index }: Props) {
  return (
    <div className={styles.wrapper}>
      <input
        id={`rules.${index}.place`}
        autoComplete="off"
        type="number"
        step={1}
        readOnly
        {...register(`rules.${index}.place`)}
        className={styles.input}
      />
      <input
        id={`rules.${index}.points`}
        autoComplete="off"
        type="number"
        step={1}
        min={0}
        {...register(`rules.${index}.points`)}
        className={styles.input}
      />
    </div>
  );
}
