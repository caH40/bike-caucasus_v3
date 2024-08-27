'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import cn from 'classnames/bind';

import { getTimerLocal } from '@/libs/utils/date-local';
import { TUserDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import Pagination from '@/components/UI/Pagination/Pagination';
import TdRider from '../Td/TdRider';

const cx = cn.bind(styles);

type Props = {
  users: TUserDto[];
  docsOnPage: number;
};

const columns: ColumnDef<TUserDto>[] = [
  {
    header: '#',
    cell: (props) => {
      return props.row.index + 1;
    },
  },
  {
    header: 'Участник',
    accessorKey: 'rider',
    cell: (props: any) => {
      const data = props.row.original;
      const rider = {
        firstName: data.person.firstName,
        lastName: data.person.lastName,
        image: data.image,
        id: data.id,
      };

      return <TdRider rider={rider} linkAdditional={`/admin/users/${data.id}`} />;
    },
    accessorFn: (row) => row.person.lastName, // Функция для доступа к значению lastName
    sortingFn: 'text', // Используем встроенную сортировку по тексту
  },
  {
    header: 'bcId',
    accessorKey: 'id',
    cell: (props) => <span>{props.getValue<string>()}</span>,
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
    // enableSorting: false, // Исключить столбец из сортировки.
  },
  {
    header: 'Дата',
    accessorKey: 'createdAt',
    cell: (props) => <span>{getTimerLocal(props.getValue<Date>(), 'DDMMYYHm')}</span>,
  },
];

export default function TableUsersAdmin({ users, docsOnPage = 5 }: Props) {
  const data = useMemo(() => {
    return [...users].map((user) => ({ ...user }));
  }, [users]);

  const table = useReactTable({
    getSortedRowModel: getSortedRowModel(), // Добавьте это для сортировки.
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      sorting: [{ id: 'id', desc: false }],
      pagination: {
        pageIndex: 0, //custom initial page index.
        pageSize: docsOnPage, //custom default page size.
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
          <caption className={styles.caption}>Таблица логов ошибок</caption>

          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={cx('trh')} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={styles.th}
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()} // Для сортировки.
                  >
                    <div className={styles.box__sorting}>
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {header.column.id !== '#' && // Проверка, чтобы эмоджи не показывались для первого столбца
                        (header.column.getIsSorted()
                          ? header.column.getIsSorted() === 'asc'
                            ? ' 🔺'
                            : ' 🔻'
                          : ' 🟦')}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr className={cx('tr')} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className={styles.td} key={cell.id}>
                    {/* Фиксация нумерации в первом столбце */}
                    {cell.column.id === '#'
                      ? index + 1
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
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
