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

import Pagination from '@/components/UI/Pagination/Pagination';

import type { TRaceRegistrationDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import TdRider from '../Td/TdRider';
import BlockStartNumber from '@/components/BlockStartNumber/BlockStartNumber';

import BlockRegRaceStatus from '@/components/BlockRegRaceStatus/BlockRegRaceStatus';

const cx = cn.bind(styles);

type Props = {
  registeredRiders: TRaceRegistrationDto[];
  docsOnPage?: number;
};

const columns: ColumnDef<TRaceRegistrationDto & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'Номер',
    accessorKey: 'startNumber',
    cell: (props: any) => <BlockStartNumber startNumber={props.getValue()} />,
  },
  {
    header: 'Участник',
    accessorKey: 'rider',
    cell: (props: any) => <TdRider rider={props.getValue()} />,
  },
  {
    header: 'Команда',
    accessorKey: 'rider.team',
  },
  {
    header: 'Город',
    accessorKey: 'rider.city',
  },
  {
    header: 'Год рождения',
    accessorKey: 'rider.yearBirthday',
  },
  {
    header: 'Статус',
    accessorKey: 'status',
    cell: (props: any) => (
      <BlockRegRaceStatus status={props.getValue()} userIdDb={props.row.original.rider._id} />
    ),
  },
];

/**
 * Таблица Чемпионатов.
 */
export default function TableRegisteredRace({ registeredRiders, docsOnPage = 10 }: Props) {
  const data = useMemo(() => {
    return [...registeredRiders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((trail, index) => ({ ...trail, index: index + 1 }));
  }, [registeredRiders]);

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
          <caption className={cx('caption', 'hidden')}>Зарегистрированные участники</caption>
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
              <tr
                className={styles.tr}
                key={row.id}
                // onClick={() => getLink(String(row.getValue('title')))}
                // onClick={() => getLink(String(row.original.urlSlug))}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className={cx('td', 'tdWithImg')} key={cell.id}>
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
