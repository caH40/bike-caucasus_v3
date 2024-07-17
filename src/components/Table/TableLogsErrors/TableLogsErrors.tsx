'use client';

import { useRouter } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { getTimerLocal } from '@/libs/utils/date-local';
import Pagination from '@/components/UI/Pagination/Pagination';
import { TGetErrorsDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

type Props = {
  logs: TGetErrorsDto[];
  docsOnPage: number;
};

const columns = [
  {
    header: '#',
    accessorKey: 'id',
    cell: (props: any) => <span>{props.getValue()}</span>,
  },
  {
    header: 'Дата создания',
    accessorKey: 'createdAt',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
  {
    header: 'Сообщение ошибки',
    accessorKey: 'message',
    cell: (props: any) => <span>{props.getValue()}</span>,
  },
  {
    header: 'id в базе данных',
    accessorKey: '_id',
    cell: (props: any) => <span>{props.getValue()}</span>,
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableLogsErrors({ logs, docsOnPage = 5 }: Props) {
  const data = useMemo(() => logs, [logs]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
  });

  const router = useRouter();
  const getLink = (id: string) => {
    if (id === 'undefined') {
      toast.error('Не получен _id ошибки!');
    }

    router.push(`/admin/logs/errors/${id}`);
  };

  useEffect(() => {
    table.setPageSize(docsOnPage);
    table.setPageIndex(0);
  }, [docsOnPage, table]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={styles.caption}>Таблица логов ошибок</caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={styles.trh} key={headerGroup.id}>
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
              <tr
                className={styles.tr}
                key={row.id}
                onClick={() => getLink(String(row.getVisibleCells()[3]?.getValue()))}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className={styles.td} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select> */}
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
