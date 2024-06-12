/* eslint-disable @next/next/no-img-element */
import cn from 'classnames/bind';

import styles from './CardLesson.module.css';

const cx = cn.bind(styles);

type Props = {
  time: string;
  lessonName: string;
  notPaid?: boolean;
  borderColorOutside: string;
  borderColorInside?: string; // Если нет, то нет границы.
  bgColor?: string;
  isLineThrough?: boolean;
};

export default function CardLesson({
  lessonName,
  time,
  notPaid,
  borderColorOutside,
  borderColorInside,
  bgColor = 'white',
  isLineThrough,
}: Props) {
  const borderOutside = `${borderColorInside ? '1px' : '0.5px'} solid ${borderColorOutside}`;
  return (
    <div
      className={cx('wrapper')}
      style={{
        border: borderOutside,
        backgroundColor: bgColor,
      }}
    >
      <div
        className={styles.inner}
        style={{
          borderColor: borderColorInside ? borderColorInside : 'transparent',
          textDecoration: isLineThrough ? 'line-through' : 'unset',
        }}
      >
        <span className={styles.time}>{time}</span>
        <span className={styles.lesson}>{lessonName}</span>
        {notPaid && <img src="/icons/wallet-red.svg" alt="Not paid" className={styles.icon} />}
      </div>
    </div>
  );
}
