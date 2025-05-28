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

import styles from '../TableCommon.module.css';

import { TRacePointsTableDto } from '@/types/dto.types';
import { getDateTime } from '@/libs/utils/calendar';
import { TRacePointsRule } from '@/types/models.interface';

const cx = cn.bind(styles);

type Props = {
  racePointsTable: TRacePointsTableDto;
  docsOnPage?: number;
};

const columns: ColumnDef<TRacePointsRule, any>[] = [
  {
    header: 'Место',
    accessorKey: 'place',
  },
  {
    header: 'Количество очков',
    accessorKey: 'points',
  },
];

/**
 * Таблица созданных таблиц начисления очков за этап серии заездов.
 */
export default function TableRacePointsTable({ racePointsTable, docsOnPage = 100 }: Props) {
  const { rules } = racePointsTable;

  const data = useMemo(() => {
    return [...rules].sort((a, b) => a.place - b.place);
  }, [rules]);

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
            <span>{racePointsTable.name}</span>
          </caption>

          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={cx('trh')} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className={styles.th_center} key={header.id}>
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
                  <td className={styles.td_center} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot className={styles.footer}>
            <tr>
              <td colSpan={2}>
                <dl className={styles.footerList}>
                  <div className={styles.footerRow}>
                    <dt className={styles.dt}>Описание:</dt>
                    <dd className={styles.dd}>{racePointsTable.description}</dd>
                  </div>
                  <div className={styles.footerRow}>
                    <dt className={styles.dt}>Создано:</dt>
                    <dd className={styles.dd}>
                      {getDateTime(new Date(racePointsTable.createdAt)).dateDDMMYYYY}
                    </dd>
                  </div>
                  <div className={styles.footerRow}>
                    <dt className={styles.dt}>Обновлено:</dt>
                    <dd className={styles.dd}>
                      {getDateTime(new Date(racePointsTable.updatedAt)).dateDDMMYYYY}
                    </dd>
                  </div>
                  {racePointsTable.isDefault && (
                    <div className={styles.footerRow}>
                      <dt className={styles.dt}>По умолчанию:</dt>
                      <dd className={styles.dd}>Да</dd>
                    </div>
                  )}
                </dl>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
