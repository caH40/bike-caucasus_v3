/* eslint-disable @next/next/no-img-element */
import cn from 'classnames/bind';

import styles from './CardEvent.module.css';

const cx = cn.bind(styles);

type Props = {
  title: string;
  bgColor?: string;
};

/**
 * Карточка события в календаре событий.
 * Отображается в ячейке календаря когда стартует текущие Событие.
 */
export default function CardLesson({ title, bgColor = 'white' }: Props) {
  return (
    <div
      className={cx('wrapper')}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className={styles.inner}>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
}
