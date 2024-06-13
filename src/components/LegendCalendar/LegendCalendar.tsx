import cn from 'classnames/bind';

import type { TOptions } from '@/types/index.interface';
import styles from './LegendCalendar.module.css';

type Props = {
  eventTypes: TOptions[];
};

const cx = cn.bind(styles);

export default function LegendCalendar({ eventTypes }: Props) {
  return (
    <dl className={styles.legend}>
      {eventTypes.map((type) => (
        <div className={styles.legend__item} key={type.id}>
          <dt className={cx('legend__term', type.name)} />
          <dd className={styles.legend__description}>{type.translation}</dd>
        </div>
      ))}
    </dl>
  );
}
