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
import { TDistanceStatsForClient } from '@/types/index.interface';
import { getTimerLocal } from '@/libs/utils/date-local';

type Props = {
  results: TDistanceResultDto[];
  distanceId: string;
  docsOnPage?: number;
  distanceStats?: Omit<TDistanceStatsForClient, 'bestResultMaleId' | 'bestResultFemaleId'>;
  handleClickUpdateTable: (distanceId: string) => Promise<void>;
};

const cx = cn.bind(styles);

/**
 * Таблица результатов на дистанции.
 */
export default function TableDistanceResults({
  results,
  distanceStats,
  distanceId,
  handleClickUpdateTable,
  docsOnPage = 15,
}: Props) {
  const data = useMemo(() => results.map((d, i) => ({ ...d, id: i + 1 })), [results]);

  const columns = getColumnsForDistanceResultsTable();

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

  useEffect(() => {
    table.setPageSize(docsOnPage);
    table.setPageIndex(0);
  }, [docsOnPage, table]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={cx('caption')}>
            <div className={cx('caption__inner')}>
              <span>Общий</span>
              {distanceStats && (
                <dl className={styles.captionList}>
                  <div className={styles.footerRow}>
                    <dt className={styles.dt}>Участники:</dt>
                    <dd className={styles.dd}>{distanceStats.uniqueRidersCount}</dd>
                  </div>

                  <div className={styles.footerRow}>
                    <dt className={styles.dt}>Попытки:</dt>
                    <dd className={styles.dd}>{distanceStats.totalAttempts}</dd>
                  </div>
                </dl>
              )}
            </div>
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

          <tfoot className={cx('footer')}>
            <tr>
              <td colSpan={columns.length}>
                <dl className={styles.footerList}>
                  {distanceStats && (
                    <div className={styles.footerRow}>
                      <dt className={styles.dt}>Обновлено:</dt>
                      <dd className={styles.dd}>
                        {getTimerLocal(new Date(distanceStats.lastResultsUpdate), 'DDMMYYHms')}
                      </dd>
                    </div>
                  )}

                  <div className={styles.footerRow}>
                    <dt className={styles.dt}>Обновить:</dt>
                    <dd className={styles.dd}>
                      <span
                        className={'link'}
                        onClick={() => handleClickUpdateTable(distanceId)}
                      >
                        Запрос
                      </span>
                    </dd>
                  </div>
                </dl>
              </td>
            </tr>
          </tfoot>
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
