import { formatDateInterval } from '@/libs/utils/calendar';

import styles from './PeriodDates.module.css';

type Props = {
  startDate: string;
  endDate: string;
};

/**
 * Бокс отображения даты на постере.
 */
export default function PeriodDates({ startDate, endDate }: Props) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title__date}>
        {formatDateInterval({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        })}
      </h3>
    </div>
  );
}
