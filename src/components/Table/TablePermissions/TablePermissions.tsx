'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import cn from 'classnames/bind';

import BlockTableControlPermissions from '@/components/UI/BlockTableControlPermissions/BlockTableControlPermissions';
import Pagination from '@/components/UI/Pagination/Pagination';
import { TPermissionDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import BlockTableAddPermissions from '@/components/UI/BlockTableAddPermissions/BlockTableAddPermissions';

const cx = cn.bind(styles);

type Props = {
  permissions: TPermissionDto[];
  docsOnPage: number;
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  captionTitle: string; // Название таблицы.
};

const allColumns: (ColumnDef<TPermissionDto & { index: number }> & { uniqueName?: string })[] =
  [
    {
      header: '#',
      accessorKey: 'index',
    },
    {
      header: 'Название',
      accessorKey: 'name',
    },
    {
      header: 'Описание разрешения',
      accessorKey: 'description',
    },
    {
      header: 'Модерация',
      accessorKey: 'urlSlug',
      cell: (props) => <BlockTableControlPermissions propsTable={props} type={'permissions'} />,
      uniqueName: 'Модерация разрешений',
    },
    {
      header: 'Добавить',
      accessorKey: 'urlSlug',
      cell: (props) => <BlockTableAddPermissions propsTable={props} isAddBlock={true} />,
      uniqueName: 'Выбор разрешений для добавления',
    },
    {
      header: 'Удалить',
      accessorKey: 'urlSlug',
      cell: (props) => <BlockTableAddPermissions propsTable={props} isAddBlock={false} />,
      uniqueName: 'Выбор разрешений для удаления',
    },
  ];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TablePermissions({
  permissions,
  docsOnPage = 5,
  hiddenColumnHeaders = [],
  captionTitle,
}: Props) {
  const data = useMemo(() => {
    return [...permissions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((newsOne, index) => ({ ...newsOne, index: index + 1 }));
  }, [permissions]);

  // Скрытие столбцов которые есть в массиве hide
  const columns = allColumns.filter((column) => {
    // Проверяем, что column.header — строка, и только тогда сравниваем с hideColumns.
    if (column.uniqueName) {
      return !hiddenColumnHeaders.includes(column.uniqueName);
    }
    return true;
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: docsOnPage, //custom default page size
      },
    },
  });

  useEffect(() => {
    table.setPageSize(docsOnPage);
    table.setPageIndex(0);
  }, [docsOnPage, table]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            <span>{captionTitle}</span>
          </caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={cx('trh')} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className={styles.th} key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className={styles.tr} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className={styles.td} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Отображать, когда две страницы и более */}
      {permissions.length > docsOnPage && (
        <Pagination
          isFirstPage={!table.getCanPreviousPage()}
          isLastPage={!table.getCanNextPage()}
          quantityPages={table.getPageCount()}
          page={table.getState().pagination.pageIndex}
          setPage={table.setPageIndex}
        />
      )}
    </div>
  );
}
