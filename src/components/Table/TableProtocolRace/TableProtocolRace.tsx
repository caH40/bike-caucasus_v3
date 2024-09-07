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
import { TResultRaceDto } from '@/types/dto.types';
import TdRider from '../Td/TdRider';
import styles from '../TableCommon.module.css';
import { formatTimeToStr } from '@/libs/utils/timer';

const cx = cn.bind(styles);

type Props = {
  protocol: TResultRaceDto[];
  docsOnPage?: number;
  showFooter?: boolean;
};

const columns: ColumnDef<TResultRaceDto & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'Место',
    accessorKey: '',
  },
  {
    header: 'Номер',
    accessorKey: 'startNumber',
  },
  {
    header: 'Участник',
    accessorKey: 'profile',
    cell: (props: any) => {
      const data = props.row.original;

      // Изображение из провайдера или загруженное.
      const image = data.rider?.imageFromProvider
        ? data.rider?.provider?.image
        : data.rider?.image;

      const rider = {
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        image,
        id: data.rider?.id,
      };

      return <TdRider rider={rider} />;
    },
  },
  {
    header: 'Время',
    accessorKey: 'raceTimeInMilliseconds',
    cell: (props: any) => formatTimeToStr(props.getValue() || 0),
  },
  {
    header: 'Команда',
    accessorKey: 'profile.team',
    cell: (props: any) => props.row.original.profile?.team ?? 'нет', // Безопасный доступ
  },
  {
    header: 'Город',
    accessorKey: 'profile.city',
  },
  {
    header: 'Категория',
    accessorKey: 'categoryAge',
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableProtocolRace({ protocol, showFooter, docsOnPage = 5 }: Props) {
  const data = useMemo(() => {
    return [...protocol].map((newsOne, index) => ({ ...newsOne, index: index + 1 }));
  }, [protocol]);

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
          <caption className={styles.caption}>Протокол заезда</caption>
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
