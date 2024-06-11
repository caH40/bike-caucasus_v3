import Link from 'next/link';

import { getTimerLocal } from '@/libs/utils/date-local';
import TitleAndLine from '../TitleAndLine/TitleAndLine';
import { getNews } from '@/actions/news';
import styles from './NewsShort.module.css';

type Props = {
  idUserDB: string | undefined;
};

/**
 * Отображает блок со списком заголовков новостей.
 * @async
 * @param props - Объект с параметрами.
 * @param props.news - Массив новостей или null/undefined, если новости отсутствуют.
 * @returns - JSX элемент списка новостей или null, если новости отсутствуют.
 */
export default async function NewsShort({ idUserDB }: Props): Promise<false | JSX.Element> {
  // Получение последних новостей в количестве docsOnPage.
  const newsLast = await getNews({ idUserDB, docsOnPage: 10 });

  return (
    !!newsLast?.news.length && (
      <article className={styles.wrapper}>
        <TitleAndLine hSize={2} title="Последние новости" />
        <ul className={styles.list}>
          {newsLast.news.map((elm) => (
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
