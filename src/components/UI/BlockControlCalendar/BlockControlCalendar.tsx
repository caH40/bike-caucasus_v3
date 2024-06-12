import IconArrowLeft from '@/components/Icons/IconArrowLeft';
import IconArrowRight from '@/components/Icons/IconArrowRight';
import { useCalendarStore } from '@/store/calendar';

import styles from './BlockControlCalendar.module.css';

type Props = {};

export default function BlockControlCalendar({}: Props) {
  const { getMonth, getCurrentMonth } = useCalendarStore();
  return (
    <div className={styles.wrapper}>
      <button className={styles.btn} onClick={() => getCurrentMonth()}>
        Сегодня
      </button>

      <button
        className={styles.btn}
        onClick={() => {
          getMonth({ target: 'prev' });
        }}
      >
        <IconArrowLeft squareSize={20} />
      </button>

      {/* Следующий месяц. */}
      <button
        className={styles.btn}
        onClick={() => {
          getMonth({ target: 'next' });
        }}
      >
        <IconArrowRight squareSize={20} />
      </button>
    </div>
  );
}
