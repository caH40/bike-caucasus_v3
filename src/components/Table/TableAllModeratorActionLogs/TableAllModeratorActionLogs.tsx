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

import { getTimerLocal } from '@/libs/utils/date-local';
import Pagination from '@/components/UI/Pagination/Pagination';
import TdRider from '../Td/TdRider';
import styles from '../TableCommon.module.css';

// types
import { TGetModeratorActionLogDto } from '@/types/dto.types';

type Props = {
  logs: TGetModeratorActionLogDto[];
  docsOnPage: number;
};

const cx = cn.bind(styles);

const columns = [
  {
    header: '#',
    accessorKey: 'id',
    cell: (props: any) => <span>{props.getValue()}</span>,
  },
  {
    header: 'Дата создания',
    accessorKey: 'timestamp',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
  {
    header: 'Модератор',
    accessorKey: 'profile',
    cell: (props: any) => {
      const data = props.row.original as TGetModeratorActionLogDto;

      // Изображение из провайдера или загруженное.
      const image = data.moderator.imageFromProvider
        ? data.moderator.provider.image
        : data.moderator?.image;

      const rider = {
        firstName: data.moderator.person.firstName,
        lastName: data.moderator.person.lastName,
        image,
      };

      return <TdRider rider={rider} showPatronymic={true} />;
    },
  },
  {
    header: 'Роль',
    accessorKey: 'moderator.role.name',
    cell: (props: any) => <span>{props.getValue()}</span>,
  },
  {
    header: 'Сущность',
    accessorKey: 'entity',
    cell: (props: any) => <span>{props.getValue()}</span>,
  },
  {
    header: 'Действие',
    accessorKey: 'action',
    cell: (props: any) => {
      const value = props.getValue();
      return <span className={cx({ danger: value === 'delete' })}>{value}</span>;
    },
  },
];

/**
 * Таблица логов действий модераторов на сайте.
 */
export default function TableAllModeratorActionLogs({ logs, docsOnPage = 5 }: Props) {
  const data = useMemo(
    () => [...logs].map((log, index) => ({ ...log, id: index + 1 })),
    [logs]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const router = useRouter();
  const getLink = (id: string) => {
    if (id === 'undefined') {
      toast.error('Не получен _id ошибки!');
    }

    router.push(`/admin/logs/moderators/${id}`);
  };

  useEffect(() => {
    table.setPageSize(docsOnPage);
    table.setPageIndex(0);
  }, [docsOnPage, table]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={styles.caption}>Таблица логов действий модераторов</caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={styles.trh} key={headerGroup.id}>
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
                className={cx('tr', 'tr-hover', 'tr__link')}
                key={row.id}
                onClick={() => getLink(row.original._id)}
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
