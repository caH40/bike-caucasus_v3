'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { TGetErrorsDto } from '@/types/dto.types';
import { lcRecordsOnPage } from '@/constants/local-storage';

import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import styles from './ContainerTableLogsError.module.css';
import TableLogsErrors from '../../TableLogsErrors/TableLogsErrors';

type Props = {
  logs: TGetErrorsDto[] | null;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableLogsError({ logs }: Props) {
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const isMounting = useRef(true);

  const [logsFiltered, setLogsFiltered] = useState(logs || []);

  useEffect(() => {
    const initialDocsOnPage = parseInt(localStorage.getItem(lcRecordsOnPage) || '5', 10);
    setDocsOnPage(initialDocsOnPage);
  }, []);

  useEffect(() => {
    // Если происходит монтирование компонента, то не записывать данные в Локальное хранилище.
    if (isMounting.current) {
      isMounting.current = false;
      return;
    }

    localStorage.setItem(lcRecordsOnPage, String(docsOnPage));
  }, [docsOnPage]);

  useMemo(() => {
    if (!logs) {
      return;
    }
    setLogsFiltered(
      logs.filter(
        (elm) =>
          elm.message.toLowerCase().includes(search.toLowerCase()) ||
          elm.stack?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, logs]);

  return (
    <>
      <div className={styles.block__filter}>
        <FilterBoxForTable
          docsOnPage={docsOnPage}
          setDocsOnPage={setDocsOnPage}
          search={search}
          setSearch={setSearch}
          placeholder={'поиск'}
        />
      </div>

      {/* Таблица */}
      <TableLogsErrors logs={logsFiltered} docsOnPage={docsOnPage} />
    </>
  );
}
