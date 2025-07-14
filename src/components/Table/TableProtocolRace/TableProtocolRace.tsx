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
import ProtocolMenuPopup from '@/components/UI/Menu/MenuControl/ProtocolMenuPopup';
import { protocolColumns } from './columns';
import styles from '../TableCommon.module.css';

import { TResultRaceDto } from '@/types/dto.types';

const cx = cn.bind(styles);

type Props = {
  protocol: TResultRaceDto[];
  docsOnPage?: number;
  showFooter?: boolean;
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  captionTitle: string; // Название таблицы.
  raceInfo: { championshipId: string; championshipUrlSlug: string; raceId: string };
};

/**
 * Таблица финишных протоколов заездов.
 */
export default function TableProtocolRace({
  protocol,
  showFooter,
  docsOnPage = 50,
  hiddenColumnHeaders = [],
  captionTitle,
  raceInfo,
}: Props) {
  const data = useMemo(() => {
    return [...protocol].map((elm, index) => ({ ...elm, index: index + 1 }));
  }, [protocol]);

  // Скрытие столбцов которые есть в массиве hide
  const columns = protocolColumns.filter((column) => {
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
          <caption className={cx('caption')}>
            <div className={styles.caption__inner}>
              <span>{captionTitle}</span>

              {/* popup меня управления протоколом */}
              <div className={styles.menu__control}>
                <ProtocolMenuPopup raceInfo={raceInfo} />
              </div>
            </div>
          </caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={cx('trh')} key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className={cx('th', {
                        number: [
                          'positions_absolute',
                          'positions_category',
                          'startNumber',
                        ].includes(header.id),
                        profile: header.id === 'profile',
                        raceTimeInMilliseconds: header.id === 'raceTimeInMilliseconds',
                        averageSpeed: header.id === 'averageSpeed',
                      })}
                      key={header.id}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className={cx('tr', 'tr-hover')} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      className={cx('td', {
                        number: [
                          'positions_absolute',
                          'positions_category',
                          'startNumber',
                        ].includes(cell.column.id),
                      })}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {showFooter && (
            <tfoot className={cx('footer')}>
              <tr>
                <td colSpan={table.getHeaderGroups()[0].headers.length}>
                  <div className={styles.footer__files}></div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {docsOnPage < data.length && (
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
