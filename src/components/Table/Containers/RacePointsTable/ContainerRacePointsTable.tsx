'use client';

import { useEffect, useRef, useState } from 'react';

import { TRacePointsTableDto } from '@/types/dto.types';
import { lcRecordsOnPage } from '@/constants/local-storage';
import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import styles from './ContainerRacePointsTable.module.css';
import TableRacePointsTable from '../../TableRacePointsTable/TableRacePointsTable';

type Props = {
  racePointsTables: TRacePointsTableDto[];
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerRacePointsTable({ racePointsTables }: Props) {
  // Строка поиска разрешения.
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
      <TableRacePointsTable racePointsTables={racePointsTables} docsOnPage={docsOnPage} />
    </>
  );
}
