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
import styles from '../TableCommon.module.css';

import { TRacePointsTableDto } from '@/types/dto.types';
import { getDateTime } from '@/libs/utils/calendar';
import BlockTableControlTableRacePointsTable from '@/components/UI/BlockTableControlTableRacePointsTable/BlockTableControlTableRacePointsTable';
import { THandleClickRacePointTable, TRacePointsTableAction } from '@/types/index.interface';

const cx = cn.bind(styles);

type Props = {
  racePointsTables: TRacePointsTableDto[];
  docsOnPage?: number;
  handleClick: THandleClickRacePointTable;
};

function getColumns(
  handleClick: (_id: string, action: TRacePointsTableAction) => void
): ColumnDef<TRacePointsTableDto & { index: number }, any>[] {
  return [
    {
      header: '#',
      accessorKey: 'index',
    },
    {
      header: 'Название',
      accessorKey: 'name',
    },
    {
      header: 'Описание',
      accessorKey: 'description',
    },
    {
      header: 'Дата создания',
      accessorKey: 'createdAt',
      cell: (props: any) => getDateTime(new Date(props.getValue())).dateDDMMYYYY,
    },
    {
      header: 'Дата изменения',
      accessorKey: 'updatedAt',
      cell: (props: any) => getDateTime(new Date(props.getValue())).dateDDMMYYYY,
    },
    {
      header: 'Модерация',
      accessorKey: '_id',
      cell: (props) => (
        <BlockTableControlTableRacePointsTable
          _id={props.row.original._id}
          name={props.row.original.name}
          handleClick={handleClick}
        />
      ),
    },
  ];
}

/**
 * Таблица созданных таблиц начисления очков за этап серии заездов.
 */
export default function TableModerateRacePointsTable({
  racePointsTables,
  handleClick,
  docsOnPage = 10,
}: Props) {
  const data = useMemo(() => {
    return [...racePointsTables]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((racePointsTable, index) => ({ ...racePointsTable, index: index + 1 }));
  }, [racePointsTables]);

  const table = useReactTable({
    data,
    columns: getColumns(handleClick),
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
            <span>Таблицы с начисляемыми очками за места на этапах серии заездов</span>
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
                className={cx('tr', 'tr__link', 'tr-hover')}
                key={row.id}
                onClick={() => handleClick(row.original._id, 'view')}
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

      {/* Отображать, когда две страницы и более */}
      {racePointsTables.length > docsOnPage && (
        <Pagination
          isFirstPage={!table.getCanPreviousPage()}
          isLastPage={!table.getCanNextPage()}
          quantityPages={table.getPageCount()}
          page={table.getState().pagination.pageIndex}
          setPage={table.setPageIndex}
        />
      )}
    </div>
  );
}
