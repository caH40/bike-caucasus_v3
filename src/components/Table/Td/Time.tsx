import { formatTimeToStr } from '@/libs/utils/timer';
import styles from './Td.module.css';

type Props = {
  timeInMilliseconds: number;
};

export default function Time({ timeInMilliseconds = 0 }: Props) {
  const timeStr = formatTimeToStr(timeInMilliseconds);

  const [time, milliseconds] = timeStr.split('.');

  return (
    <div className={styles.box__value}>
      <span>{time}</span>
      <span className={styles.dimension}>{+milliseconds > 0 && '.' + milliseconds}</span>
    </div>
  );
}
