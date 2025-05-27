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
import Image from 'next/image';

import { getTimerLocal } from '@/libs/utils/date-local';
import Pagination from '@/components/UI/Pagination/Pagination';
import { bikeTypes } from '@/constants/trail';
import { blurBase64 } from '@/libs/image';
import BlockModeration from '@/components/UI/BlockModeration/BlockModeration';
import type { TDtoChampionship } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import { championshipStatus, championshipTypes } from '@/constants/championship';
import Link from 'next/link';

const cx = cn.bind(styles);

type Props = {
  championships: TDtoChampionship[];
  docsOnPage?: number;
};

const columns: ColumnDef<TDtoChampionship & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'Постер',
    accessorKey: 'posterUrl',
    cell: (props: any) => (
      <Image
        width={64}
        height={40}
        src={props.getValue()}
        alt={'Постер для Чемпионата'}
        placeholder="blur"
        blurDataURL={blurBase64}
        className={styles.img}
      />
    ),
  },
  {
    header: 'Название',
    accessorKey: 'name',
    cell: (props: any) => {
      const urlSlug = props.row.original.urlSlug;
      return (
        <Link className="link__news" href={`/championships/${urlSlug}`}>
          {props.getValue()}
        </Link>
      );
    },
  },
  {
    header: 'Тип',
    accessorKey: 'type',
    cell: (props: any) => (
      <span>
        {championshipTypes.find((type) => type.name === props.getValue())?.translation ||
          'не задан'}
      </span>
    ),
  },
  {
    header: 'Номер Этапа',
    accessorKey: 'stage',
  },
  {
    header: 'Название серии',
    accessorKey: 'parentChampionship.name',
    cell: (props: any) => props.getValue(),
  },
  {
    header: 'Тип велосипеда',
    accessorKey: 'bikeType',
    cell: (props: any) => (
      <span>
        {bikeTypes.find((bt) => bt.name === props.getValue())?.translation || 'не задан'}
      </span>
    ),
  },
  {
    header: 'Статус',
    accessorKey: 'status',
    cell: (props: any) => (
      <span>
        {championshipStatus.find((status) => status.name === props.getValue())?.translation ||
          'не задан'}
      </span>
    ),
  },
  {
    header: 'Дата старта',
    accessorKey: 'startDate',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYY')}</span>,
  },
  {
    header: 'Дата завершения чемпионата',
    accessorKey: 'endDate',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYY')}</span>,
  },
  {
    header: 'Модерация',
    accessorKey: 'urlSlug',
    cell: (props) => <BlockModeration propsTable={props} type={'championship'} />,
  },
];

/**
 * Таблица Чемпионатов.
 */
export default function TableChampionship({ championships, docsOnPage = 10 }: Props) {
  const data = useMemo(() => {
    return [...championships]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((trail, index) => ({ ...trail, index: index + 1 }));
  }, [championships]);

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
          <caption className={styles.caption}>Таблица созданных Чемпионатов</caption>
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
