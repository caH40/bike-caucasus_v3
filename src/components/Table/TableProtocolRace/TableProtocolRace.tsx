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
import TdRider from '../Td/TdRider';
import PermissionCheck from '@/hoc/permission-check';
import IconRefresh from '@/components/Icons/IconRefresh';
import { formatTimeToStr } from '@/libs/utils/timer';
import { replaceCategorySymbols } from '@/libs/utils/championship';
import { TResultRaceDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  protocol: TResultRaceDto[];
  docsOnPage?: number;
  showFooter?: boolean;
  handlerUpdateProtocolRace: () => Promise<string | number | undefined>;
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  captionTitle: string; // Название таблицы.
};

const allColumns: (ColumnDef<TResultRaceDto & { index: number }> & { uniqueName?: string })[] =
  [
    {
      header: '#',
      accessorKey: 'index',
      uniqueName: '#',
    },
    {
      header: 'Место',
      accessorKey: 'positions.absolute',
      uniqueName: 'Место в абсолюте',
    },
    {
      header: 'Место',
      accessorKey: 'positions.category',
      uniqueName: 'Место в категории',
    },
    {
      header: 'Место',
      accessorKey: 'positions.absoluteGender',
      uniqueName: 'Место в абсолюте по полу',
    },
    {
      header: 'Номер',
      accessorKey: 'startNumber',
    },
    {
      header: 'Участник',
      accessorKey: 'profile',
      cell: (props: any) => {
        const data = props.row.original;

        // Изображение из провайдера или загруженное.
        const image = data.rider?.imageFromProvider
          ? data.rider?.provider?.image
          : data.rider?.image;

        const rider = {
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          image,
          id: data.rider?.id,
        };

        return <TdRider rider={rider} />;
      },
    },
    {
      header: 'Время',
      accessorKey: 'raceTimeInMilliseconds',
      cell: (props: any) => formatTimeToStr(props.getValue() || 0),
    },
    {
      header: 'Ср. скорость',
      accessorKey: 'averageSpeed',
      cell: (props: any) => props.getValue() && props.getValue().toFixed(1) + ' км/ч',
    },
    {
      header: 'Команда',
      accessorKey: 'profile.team',
      cell: (props: any) => props.row.original.profile?.team ?? 'нет', // Безопасный доступ
    },
    {
      header: 'Город',
      accessorKey: 'profile.city',
    },
    {
      header: 'Категория',
      accessorKey: 'categoryAge',
      cell: (props: any) => replaceCategorySymbols(props.getValue()),
      uniqueName: 'Категория',
    },
  ];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableProtocolRace({
  protocol,
  showFooter,
  docsOnPage = 15,
  handlerUpdateProtocolRace,
  hiddenColumnHeaders = [],
  captionTitle,
}: Props) {
  const data = useMemo(() => {
    return [...protocol].map((elm, index) => ({ ...elm, index: index + 1 }));
  }, [protocol]);

  // Скрытие столбцов которые есть в массиве hide
  const columns = allColumns.filter((column) => {
    // Проверяем, что column.header — строка, и только тогда сравниваем с hideColumns.
    if (column.uniqueName) {
      return !hiddenColumnHeaders.includes(column.uniqueName);
    }
    return true;
  });

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
          <caption className={cx('caption')}>
            <div className={styles.caption__inner}>
              <span>{captionTitle}</span>

              {/* popup меня управления новостью */}
              <PermissionCheck permission={'admin'}>
                <IconRefresh
                  squareSize={20}
                  colors={{ default: 'green', hover: 'orange' }}
                  tooltip={{
                    text: 'Обновление категорий участников, мест во всех категориях и протоколах.',
                    id: 'refreshProtocol',
                  }}
                  getClick={handlerUpdateProtocolRace}
                />
              </PermissionCheck>
            </div>
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

          {showFooter && (
            <tfoot className={cx('footer')}>
              <tr>
                <td colSpan={table.getHeaderGroups()[0].headers.length}>
                  <div className={styles.footer__files}></div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {docsOnPage < data.length && (
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
