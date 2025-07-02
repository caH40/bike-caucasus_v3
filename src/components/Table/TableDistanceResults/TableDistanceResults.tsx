'use client';

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';

import cn from 'classnames/bind';

import Pagination from '@/components/UI/Pagination/Pagination';
import { TDistanceResultDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

import { getColumnsForDistanceResultsTable } from './columns';

type Props = {
  results: TDistanceResultDto[];
  docsOnPage?: number;
};

const cx = cn.bind(styles);

/**
 * Таблица результатов на дистанции.
 */
export default function TableDistanceResults({ results, docsOnPage = 15 }: Props) {
  const data = useMemo(() => results.map((d, i) => ({ ...d, id: i + 1 })), [results]);

  const table = useReactTable({
    data,
    columns: getColumnsForDistanceResultsTable(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
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
          <caption className={styles.caption}>Общий</caption>
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
              <tr className={cx('tr', 'tr-hover')} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    className={cx('td', {
                      number: ['positions_absolute'].includes(cell.column.id),
                    })}
                    key={cell.id}
                  >
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
