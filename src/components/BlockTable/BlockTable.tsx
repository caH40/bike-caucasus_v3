'use client';

import { TPermissionDto } from '@/types/dto.types';
import TablePermissions from '../Table/TablePermissions/TablePermissions';
import FilterBoxForTable from '../UI/FilterBoxForTable/FilterBoxForTable';
import { useEffect, useRef, useState } from 'react';

import styles from './BlockTable.module.css';
import { lcRecordsOnPage } from '@/constants/local-storage';

type Props = { permissions: TPermissionDto[] | null };

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function BlockTable({ permissions }: Props) {
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
      <TablePermissions permissions={permissions || []} docsOnPage={docsOnPage} />
    </>
  );
}
