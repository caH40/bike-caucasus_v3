import Link from 'next/link';

import { getTimerLocal } from '@/libs/utils/date-local';
import { TNews } from '@/types/models.interface';
import styles from './NewsShort.module.css';

type Props = {
  news: TNews[] | null | undefined;
};

/**
 * Отображает блок со списком заголовков новостей.
 * @async
 * @param props - Объект с параметрами.
 * @param props.news - Массив новостей или null/undefined, если новости отсутствуют.
 * @returns - JSX элемент списка новостей или null, если новости отсутствуют.
 */
export default async function NewsShort({ news }: Props): Promise<false | JSX.Element> {
  return (
    !!news?.length && (
      <article className={styles.wrapper}>
        <ul className={styles.list}>
          {news.map((elm) => (
            <li className={styles.item} key={String(elm._id)}>
              <span className={styles.date}>{getTimerLocal(elm.createdAt, 'DDMMYY')}</span>
              <Link href={`/news/${elm.urlSlug}`} className={styles.link}>
                {elm.title}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    )
  );
}
