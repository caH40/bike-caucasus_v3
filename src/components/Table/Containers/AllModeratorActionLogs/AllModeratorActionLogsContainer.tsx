'use client';

import { useEffect, useRef, useState } from 'react';

import { lcRecordsOnPage } from '@/constants/local-storage';
import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import TableAllModeratorActionLogs from '../../TableAllModeratorActionLogs/TableAllModeratorActionLogs';
import styles from './AllModeratorActionLogsContainer.module.css';

// types
import { TGetModeratorActionLogDto } from '@/types/dto.types';

type Props = {
  logs: TGetModeratorActionLogDto[];
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function AllModeratorActionLogsContainer({ logs }: Props) {
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const isMounting = useRef(true);

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

  // Поиск по логам модерации пока не реализован: search не участвует в выборке.
  const logsFiltered = logs;

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
      <TableAllModeratorActionLogs logs={logsFiltered} docsOnPage={docsOnPage} />
    </>
  );
}
