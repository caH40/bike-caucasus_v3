'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { TRoleDto } from '@/types/dto.types';
import { lcRecordsOnPage } from '@/constants/local-storage';
import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import styles from './ContainerTableRoles.module.css';
import TableRoles from '../../TableRoles/TableRoles';

type Props = {
  roles: TRoleDto[];
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableRoles({ roles }: Props) {
  // Строка поиска разрешения.
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const isMounting = useRef(true);

  const [rolesFiltered, setRolesFiltered] = useState(roles || []);

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
    if (!roles) {
      return;
    }
    setRolesFiltered(
      roles.filter((elm) => {
        const nameFiltered = elm.name.toLowerCase().includes(search.toLowerCase());
        const descFiltered = elm.description?.toLowerCase().includes(search.toLowerCase());

        return nameFiltered || descFiltered;
      })
    );
  }, [search, roles]);

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
      <TableRoles roles={rolesFiltered} docsOnPage={docsOnPage} />
    </>
  );
}
