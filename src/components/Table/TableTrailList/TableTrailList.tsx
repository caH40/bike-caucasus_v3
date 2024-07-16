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
import useHasAccess from '@/hooks/useHasAccess';
import { bikeTypes } from '@/constants/trail';
import { blurBase64 } from '@/libs/image';
import BlockModeration from '@/components/UI/BlockModeration/BlockModeration';
import type { TTrailDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  trails: TTrailDto[];
  docsOnPage: number;
  idUserDB: string | undefined; // _id Пользователя в БД.
};

const columns: ColumnDef<TTrailDto & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'Постер',
    accessorKey: 'poster',
    cell: (props: any) => (
      <Image
        width={64}
        height={40}
        src={props.getValue()}
        alt={'Постер для маршрута'}
        placeholder="blur"
        blurDataURL={blurBase64}
        className={styles.img}
      />
    ),
  },
  {
    header: 'Название',
    accessorKey: 'title',
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
    header: 'Автор',
    accessorFn: (row) =>
      `id:${row.author.id}, ${row.author.person.lastName}  ${row.author.person.firstName}`,
  },
  {
    header: 'Дата создания',
    accessorKey: 'createdAt',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
  {
    header: 'Модерация',
    accessorKey: 'urlSlug',
    cell: (props) => <BlockModeration propsTable={props} type={'trails'} />,
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableTrailList({ trails, docsOnPage, idUserDB }: Props) {
  const isAdmin = useHasAccess('all'); // Админ может модерировать любые маршруты
  const data = useMemo(() => {
    return [...trails]
      .filter((trail) => trail.author._id === idUserDB || isAdmin)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((trail, index) => ({ ...trail, index: index + 1 }));
  }, [trails, idUserDB, isAdmin]);

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
            Таблица Маршрутов, доступных для редактирования
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
