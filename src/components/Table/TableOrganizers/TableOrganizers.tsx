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
import Link from 'next/link';

import Pagination from '@/components/UI/Pagination/Pagination';
import { TDtoOrganizer } from '@/types/dto.types';
import { blurBase64 } from '@/libs/image';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  organizers: TDtoOrganizer[];
  docsOnPage?: number;
};

const columns: ColumnDef<TDtoOrganizer & { index: number }>[] = [
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
        height={46}
        src={props.getValue()}
        alt={'Логотип'}
        placeholder="blur"
        blurDataURL={blurBase64}
        className={styles.img}
      />
    ),
  },
  {
    header: 'Логотип',
    accessorKey: 'logoUrl',
    cell: (props: any) => (
      <Image
        width={46}
        height={46}
        src={props.getValue()}
        alt={'Логотип'}
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
        <Link className="link__news" href={`/organizers/${urlSlug}`}>
          {props.getValue()}
        </Link>
      );
    },
  },
  {
    header: 'Город',
    accessorKey: 'address.city',
  },
  {
    header: 'Группа в Телеграмм',
    accessorKey: 'contactInfo.socialMedia.telegramGroup',
    cell: (props: any) => {
      const url = props.getValue();
      return url ? (
        <a className="link__news" href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ) : (
        <span>нет</span>
      );
    },
  },
  {
    header: 'Электронная почта',
    accessorKey: 'contactInfo.email',
    cell: (props: any) => {
      const email = props.getValue();
      return email ? (
        <a className="link__news" href={`mailto:${email}`} rel="noopener noreferrer">
          {email}
        </a>
      ) : (
        <span>нет</span>
      );
    },
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableOrganizers({ organizers, docsOnPage = 5 }: Props) {
  const data = useMemo(() => {
    return [...organizers]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((newsOne, index) => ({ ...newsOne, index: index + 1 }));
  }, [organizers]);

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
            Организаторы Чемпионатов (соревнования, гонки-тренировки)
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
