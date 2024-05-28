'use client';

// import { useRouter } from 'next/navigation';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';

import { getTimerLocal } from '@/libs/utils/date-local';

import styles from '../TableCommon.module.css';
// import { toast } from 'sonner';
import { IUserModel } from '@/types/models.interface';

type Props = {
  users: IUserModel[] | null;
};

const columns = [
  // {
  //   header: '#',
  //   accessorKey: 'id',
  //   cell: (props: any) => <span>{props.getValue()}</span>,
  // },
  {
    header: 'email',
    accessorKey: 'email',
    cell: (props: any) => <span>{props.getValue()}</span>,
  },
  {
    header: 'Дата создания',
    accessorKey: 'createdAt',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
  {
    header: '_id',
    accessorKey: '_id',
    cell: (props: any) => <span>{String(props.getValue())}</span>,
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableUsersAdmin({ users }: Props) {
  const data = useMemo(() => {
    if (!users) {
      return [];
    }
    return users;
  }, [users]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  // const router = useRouter();
  // const getLink = (id: string) => {
  //   if (id === 'undefined') {
  //     toast.error('Не получен _id ошибки!');
  //   }

  //   router.push(`/admin/logs/errors/${id}`);
  // };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>Таблица логов ошибок</caption>
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
              className={styles.tr}
              key={row.id}
              // onClick={() => getLink(String(row.getVisibleCells()[3]?.getValue()))}
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
  );
}
