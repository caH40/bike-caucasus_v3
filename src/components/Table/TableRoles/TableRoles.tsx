'use client';

import {
  CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import cn from 'classnames/bind';

import Pagination from '@/components/UI/Pagination/Pagination';
import { TRoleDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import BlockTableControlRole from '@/components/UI/BlockTableControlPermissions/BlockTableControlRole';

const cx = cn.bind(styles);

type Props = {
  roles: TRoleDto[];
  docsOnPage?: number;
};

const columns: ColumnDef<TRoleDto & { index: number }, any>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'Название',
    accessorKey: 'name',
  },
  {
    header: 'Разрешения',
    accessorKey: 'permissions',
    cell: (props: CellContext<TRoleDto & { index: number }, string[]>) =>
      props
        .getValue()
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((role, index) => <p key={index}>{role}</p>),
  },
  {
    header: 'Описание Роли',
    accessorKey: 'description',
  },
  {
    header: 'Модерация',
    accessorKey: 'urlSlug',
    cell: (props) => <BlockTableControlRole propsTable={props} />,
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableRoles({ roles, docsOnPage = 10 }: Props) {
  const data = useMemo(() => {
    return [...roles]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((newsOne, index) => ({ ...newsOne, index: index + 1 }));
  }, [roles]);

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
            <span>Роли на сайте</span>
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
      {roles.length > docsOnPage && (
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
