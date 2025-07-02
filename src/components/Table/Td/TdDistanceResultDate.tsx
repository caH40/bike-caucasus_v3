import Link from 'next/link';

import styles from './Td.module.css';
import { getTimerLocal } from '@/libs/utils/date-local';

type Props = {
  date: string;
  championshipUrlSlug: string;
};

/**
 * Ячейка даты в таблице результаты на дистанции.
 */
export default function TdDistanceResultDate({ championshipUrlSlug, date }: Props) {
  return (
    <Link href={`/championships/${championshipUrlSlug}`} className={styles.link__news}>
      {getTimerLocal(date, 'DDMMYY')}
    </Link>
  );
}
