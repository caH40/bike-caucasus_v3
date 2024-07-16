'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { lcRecordsOnPage } from '@/constants/local-storage';
import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import TableTrailList from '../../TableTrailList/TableTrailList';
import { TTrailDto } from '@/types/dto.types';
import styles from './ContainerTableTrailsModeration.module.css';

type Props = {
  trails: TTrailDto[] | null;
  idUserDB: string | undefined;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableTrailsModeration({ trails, idUserDB }: Props) {
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const isMounting = useRef(true);

  const [trailsFiltered, settTailsFiltered] = useState(trails || []);

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
    if (!trails) {
      return;
    }
    settTailsFiltered(
      trails.filter(
        (elm) =>
          elm.author.person.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          elm.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, trails]);

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
      <TableTrailList trails={trailsFiltered} docsOnPage={docsOnPage} idUserDB={idUserDB} />
    </>
  );
}
