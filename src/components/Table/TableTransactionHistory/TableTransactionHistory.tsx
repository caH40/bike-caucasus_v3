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
import { TPaymentNotificationDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

import { transactionHistoryTableColumns } from './colunmns';

type Props = {
  paymentHistory: TPaymentNotificationDto[];
  docsOnPage?: number;
};

const cx = cn.bind(styles);

/**
 * Таблица истории платежей.
 */
export default function TableTransactionHistory({ paymentHistory, docsOnPage = 15 }: Props) {
  const data = useMemo(
    () => paymentHistory.map((d, i) => ({ ...d, rowId: i + 1 })),
    [paymentHistory]
  );

  const table = useReactTable({
    data,
    columns: transactionHistoryTableColumns,
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
          <caption className={styles.caption}>Таблица финансовых операций</caption>
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
              <tr className={cx('tr', 'tr__link', 'tr-hover')} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cx('td')} key={cell.id}>
                    <div className={cx({ description: cell.column.id === 'description' })}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
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
