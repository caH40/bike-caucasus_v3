'use client';

import { useRouter } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import cn from 'classnames/bind';

import Pagination from '@/components/UI/Pagination/Pagination';
import { TDistanceDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

import { getColumnsForDistanceTable } from './colunmns';

type Props = {
  distances: TDistanceDto[];
  docsOnPage?: number;
  forModeration?: boolean;
};

const cx = cn.bind(styles);

/**
 * Таблица дистанций.
 */
export default function TableDistances({ distances, forModeration, docsOnPage = 15 }: Props) {
  const data = useMemo(() => distances.map((d, i) => ({ ...d, id: i + 1 })), [distances]);

  const table = useReactTable({
    data,
    columns: getColumnsForDistanceTable(forModeration),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
  });

  const router = useRouter();

  const getLink = (urlSlug: string) => {
    if (!urlSlug) {
      toast.error('Не получен urlSlug!');
    }

    router.push(`/distances/${urlSlug}`);
  };

  useEffect(() => {
    table.setPageSize(docsOnPage);
    table.setPageIndex(0);
  }, [docsOnPage, table]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={styles.caption}>Таблица дистанций для заездов</caption>
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
                className={cx('tr', 'tr__link', 'tr-hover')}
                key={row.id}
                onClick={() => getLink(row.original.urlSlug)}
              >
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
