import { Dispatch } from 'react';
import styles from './PaginationSelect.module.css';
import { records } from '@/constants/other';

type Props = {
  docsOnPage: number;
  setDocsOnPage: Dispatch<React.SetStateAction<number>>;
  placeholder?: string;
};

export default function PaginationSelect({ docsOnPage, setDocsOnPage }: Props) {
  return (
    <>
      <select
        value={docsOnPage}
        className={styles.select}
        onChange={(e) => {
          setDocsOnPage(+e.target.value);
        }}
      >
        {records.map((record) => (
          <option
            className={styles.option}
            value={record.value}
            label={String(record.value)}
            key={record.id}
          />
        ))}
      </select>
    </>
  );
}
