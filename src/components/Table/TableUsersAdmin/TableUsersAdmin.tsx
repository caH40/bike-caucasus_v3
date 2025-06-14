'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import cn from 'classnames/bind';

import { getTimerLocal } from '@/libs/utils/date-local';
import { TUserDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import Pagination from '@/components/UI/Pagination/Pagination';
import TdRider from '../Td/TdRider';
import { getUserDataDto } from '@/libs/user';

const cx = cn.bind(styles);

type Props = {
  users: TUserDto[];
  docsOnPage: number;
};

const columns: ColumnDef<TUserDto & { tableId?: number }>[] = [
  {
    header: '#',
    accessorKey: 'tableId',
  },
  {
    header: 'Участник',
    accessorKey: 'rider',
    cell: (props: any) => {
      const { person, ...rider } = props.row.original;

      const riderData = getUserDataDto({
        imageFromProvider: rider?.imageFromProvider,
        downloadedImage: rider?.image,
        providerImage: rider?.provider?.image,
        profile: person,
        id: rider?.id,
      });

      return (
        <TdRider
          rider={riderData}
          linkAdditional={`/admin/users/${rider.id}`}
          showPatronymic={true}
        />
      );
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
    return [...users].map((user, index) => ({ ...user, tableId: index + 1 }));
  }, [users]);

  const table = useReactTable({
    getSortedRowModel: getSortedRowModel(), // Добавьте это для сортировки.
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: 'id', desc: false }],
      pagination: {
        pageIndex: 0, //custom initial page index.
        pageSize: 10, //custom default page size.
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
