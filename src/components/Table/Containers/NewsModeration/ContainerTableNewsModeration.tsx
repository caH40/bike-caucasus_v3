'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { lcRecordsOnPage } from '@/constants/local-storage';
import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import { TNewsGetOneDto } from '@/types/dto.types';
import TableNewsList from '../../TableNewsList/TableNewsList';
import styles from './ContainerTableNewsModeration.module.css';

type Props = {
  news: TNewsGetOneDto[] | null;
  idUserDB: string | undefined;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableNewsModeration({ news, idUserDB }: Props) {
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const isMounting = useRef(true);

  const [newsFiltered, settNewsFiltered] = useState(news || []);

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
    if (!news) {
      return;
    }
    settNewsFiltered(
      news.filter(
        (elm) =>
          elm.author.person.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          elm.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, news]);

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
      <TableNewsList news={newsFiltered} docsOnPage={docsOnPage} idUserDB={idUserDB} />
    </>
  );
}
