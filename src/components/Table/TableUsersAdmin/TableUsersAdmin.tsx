'use client';

// import { useRouter } from 'next/navigation';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import cn from 'classnames/bind';
// import { toast } from 'sonner';

import { getTimerLocal } from '@/libs/utils/date-local';
import { TUserDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  users: TUserDto[] | null;
};

const columns: ColumnDef<TUserDto>[] = [
  {
    header: 'Дата создания',
    accessorKey: 'createdAt',
    cell: (props) => <span>{getTimerLocal(props.getValue<Date>(), 'DDMMYYHm')}</span>,
  },
  {
    header: 'bcId',
    accessorKey: 'id',
    cell: (props) => <span>{props.getValue<string>()}</span>,
  },
  {
    header: 'Спортсмен',
    accessorFn: (row) => `${row.person.firstName} ${row.person.lastName}`,
  },

  {
    header: 'email',
    accessorKey: 'email',
    cell: (props) => <span>{props.getValue<string>()}</span>,
  },
  {
    header: 'Роль',
    accessorKey: 'role.name',
    cell: (props) => <span>{String(props.getValue<string>())}</span>,
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
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={styles.caption}>Таблица логов ошибок</caption>
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
                className={cx('tr', 'tr__link')}
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
    </div>
  );
}
