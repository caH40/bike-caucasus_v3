'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { TUserDto } from '@/types/dto.types';
import { lcRecordsOnPage } from '@/constants/local-storage';

import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import styles from './ContainerTableUsers.module.css';
import TableUsersAdmin from '../../TableUsersAdmin/TableUsersAdmin';

type Props = { users: TUserDto[] | null };

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableUsers({ users }: Props) {
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const isMounting = useRef(true);

  const [usersFiltered, setUsersFiltered] = useState(users || []);

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
    if (!users) {
      return;
    }
    setUsersFiltered(
      users.filter(
        (elm) =>
          elm.person.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          elm.person.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          !elm.person.firstName
      )
    );
  }, [search, users]);

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
      <TableUsersAdmin users={usersFiltered} docsOnPage={docsOnPage} />
    </>
  );
}
