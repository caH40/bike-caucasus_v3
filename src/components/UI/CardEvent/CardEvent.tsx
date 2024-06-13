/* eslint-disable @next/next/no-img-element */
import cn from 'classnames/bind';

import styles from './CardEvent.module.css';
import Link from 'next/link';

const cx = cn.bind(styles);

type Props = {
  title: string;
  urlSlug: string;
  bikeType?: string;
};

/**
 * Карточка события в календаре событий.
 * Отображается в ячейке календаря когда стартует текущие Событие.
 */
export default function CardEvent({ title, bikeType, urlSlug }: Props) {
  return (
    <Link href={`/news/${urlSlug}`} className={cx('link', bikeType)}>
      <div className={styles.inner}>
        <span className={styles.title}>{title}</span>
      </div>
    </Link>
  );
}
