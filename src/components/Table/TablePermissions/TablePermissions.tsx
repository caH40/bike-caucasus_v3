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

import BlockTableControlAdmin from '@/components/UI/BlockTableControlAdmin/BlockTableControlAdmin';
import Pagination from '@/components/UI/Pagination/Pagination';
import { TPermissionDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  permissions: TPermissionDto[];
  docsOnPage: number;
};

const columns: ColumnDef<TPermissionDto & { index: number }>[] = [
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
    cell: (props) => <BlockTableControlAdmin propsTable={props} type={'permissions'} />,
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TablePermissions({ permissions, docsOnPage = 5 }: Props) {
  const data = useMemo(() => {
    return [...permissions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((newsOne, index) => ({ ...newsOne, index: index + 1 }));
  }, [permissions]);

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
            Таблица Разрешений, доступных для редактирования
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

      <Pagination
        isFirstPage={!table.getCanPreviousPage()}
        isLastPage={!table.getCanNextPage()}
        quantityPages={table.getPageCount()}
        page={table.getState().pagination.pageIndex}
        setPage={table.setPageIndex}
      />
    </div>
  );
}
