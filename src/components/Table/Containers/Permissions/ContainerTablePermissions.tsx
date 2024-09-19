'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { TPermissionDto } from '@/types/dto.types';
import { lcRecordsOnPage } from '@/constants/local-storage';
import TablePermissions from '../../TablePermissions/TablePermissions';
import FilterBoxForTable from '../../../UI/FilterBoxForTable/FilterBoxForTable';
import styles from './ContainerTablePermissions.module.css';
import { usePermissionTable } from '@/store/permission-table';

type Props = {
  permissions: TPermissionDto[] | null;
  hiddenColumnHeaders: string[];
  captionTitle: string;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTablePermissions({
  permissions,
  hiddenColumnHeaders,
  captionTitle,
}: Props) {
  // Id разрешений, добавленных в форме редактирования Роли.
  const permissionsAdded = usePermissionTable((state) => state.permissions);

  // Строка поиска разрешения.
  const [search, setSearch] = useState('');
  const [docsOnPage, setDocsOnPage] = useState(5);
  const isMounting = useRef(true);

  const [permissionsFiltered, setPermissionsFiltered] = useState(permissions || []);

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
    if (!permissions) {
      return;
    }
    setPermissionsFiltered(
      permissions.filter((elm) => {
        const nameFiltered = elm.name.toLowerCase().includes(search.toLowerCase());
        const descFiltered = elm.description.toLowerCase().includes(search.toLowerCase());

        // Удаление Разрешения, которое было добавлено в форме создания Роли.
        const permissionsAddedFiltered = !permissionsAdded.includes(elm.name);

        return (nameFiltered || descFiltered) && permissionsAddedFiltered;
      })
    );
  }, [search, permissions, permissionsAdded]);

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
      <TablePermissions
        permissions={permissionsFiltered}
        docsOnPage={docsOnPage}
        hiddenColumnHeaders={hiddenColumnHeaders}
        captionTitle={captionTitle}
      />
    </>
  );
}
