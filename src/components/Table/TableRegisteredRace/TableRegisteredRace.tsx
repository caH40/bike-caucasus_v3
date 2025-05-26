'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import cn from 'classnames/bind';

import TdRider from '../Td/TdRider';
import BlockStartNumber from '../../BlockStartNumber/BlockStartNumber';
import BlockRegRaceStatus from '@/components/BlockRegRaceStatus/BlockRegRaceStatus';
import { getDateTime } from '@/libs/utils/calendar';
import type { TChampRegistrationRiderDto, TRaceRegistrationDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

// Данных champ может не быть в случае создании таблицы зарегистрированных участников
// для страницы Регистрации. Данные по Чемпионату берутся из другого запроса.
type Props = {
  registeredRidersInRace: TChampRegistrationRiderDto;
  docsOnPage?: number;
  showFooter?: boolean;
};

const columns: ColumnDef<TRaceRegistrationDto & { index: number }>[] = [
  {
    header: '#',
    cell: (props) => props.row.index + 1,
  },
  {
    header: 'Номер',
    accessorKey: 'startNumber',
    cell: (props: any) => (
      <BlockStartNumber
        startNumber={props.getValue()}
        gender={props.row.original.rider.gender}
      />
    ),
    sortUndefined: 'last', // Все неопределенные значения должны быть внизу.
  },
  {
    header: 'Участник',
    accessorKey: 'rider',
    cell: (props: any) => <TdRider rider={props.getValue()} showPatronymic={true} />,
  },
  {
    header: 'Команда',
    accessorKey: 'rider.team',
  },
  {
    header: 'Город',
    accessorKey: 'rider.city',
  },
  {
    header: 'Год рождения',
    accessorKey: 'rider.yearBirthday',
  },
  {
    header: 'Статус',
    accessorKey: 'status',
    cell: (props: any) => (
      <BlockRegRaceStatus
        status={props.getValue()}
        userIdDb={props.row.original.rider._id}
        championshipId={props.row.original.championship}
        raceId={props.row.original.raceId}
      />
    ),
  },
  {
    header: 'Дата',
    accessorKey: 'createdAt',
    cell: (props: any) => getDateTime(new Date(props.getValue())).dateDDMMYYYY,
  },
];

/**
 * Таблица Чемпионатов.
 */
export default function TableRegisteredRace({
  registeredRidersInRace,
  docsOnPage = 10,
  showFooter,
}: Props) {
  const data = useMemo(() => {
    return [...registeredRidersInRace.raceRegistrationRider]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((riderReg, index) => ({
        ...riderReg,
        startNumber: riderReg.startNumber ? riderReg.startNumber : undefined, // Специально устанавливается undefined, чтобы при сортировке не сортировались эти строки (не работает с null).
        index: index + 1,
      }));
  }, [registeredRidersInRace.raceRegistrationRider]);

  const table = useReactTable({
    getSortedRowModel: getSortedRowModel(),
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    initialState: {
      sorting: [{ id: 'startNumber', desc: false }],
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: docsOnPage, //custom default page size
      },
    },
    enableSortingRemoval: false, // Отключено отсутствие сортировки, всегда есть вверх или вниз на одном из столбцов.
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
            {registeredRidersInRace.raceName ? registeredRidersInRace.raceName : ''}
          </caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={cx('trh')} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={styles.th}
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
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
              <tr className={styles.tr} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cx('td')} key={cell.id}>
                    {/* Фиксация нумерации в первом столбце */}
                    {cell.column.id === '#'
                      ? index + 1
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {showFooter && (
            <tfoot className={cx('footer')}>
              <tr></tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
