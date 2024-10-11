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
import { toast } from 'sonner';

import TdRider from '../Td/TdRider';
import BlockStartNumber from '../Td/BlockStartNumber';
import BlockRegRaceStatus from '@/components/BlockRegRaceStatus/BlockRegRaceStatus';
import IconPdf from '@/components/Icons/IconPDF';
import { getDateTime } from '@/libs/utils/calendar';
import { getPdfRegistered } from '@/libs/pdf/registeredRace';
import { getPdfBlankForProtocol } from '@/libs/pdf/blankForProtocol';
import type { TChampRegistrationRiderDto, TRaceRegistrationDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import { TChampionshipForRegisteredClient } from '@/types/index.interface';
import { getDateChampionship } from '@/libs/utils/date';

const cx = cn.bind(styles);

// Данных champ может не быть в случае создании таблицы зарегистрированных участников
// для страницы Регистрации. Данные по Чемпионату берутся из другого запроса.
type Props = {
  registeredRidersInRace: TChampRegistrationRiderDto;
  docsOnPage?: number;
  champ?: TChampionshipForRegisteredClient;
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
    cell: (props: any) => <BlockStartNumber startNumber={props.getValue()} />,
    sortUndefined: 'last', // Все неопределенные значения должны быть внизу.
  },
  {
    header: 'Участник',
    accessorKey: 'rider',
    cell: (props: any) => <TdRider rider={props.getValue()} />,
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
        raceNumber={props.row.original.raceNumber}
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
  champ,
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

  // Скачивание PDF файла таблицы с зарегистрированными райдерами.
  const handlerClickRegistered = () => {
    if (!champ) {
      toast.error('Не получены данные Чемпионата');
      return;
    }

    const subTitles = [
      champ.name,
      `Заезд: ${registeredRidersInRace.raceName}`,
      `Дата: ${getDateChampionship({ startDate: champ.startDate, endDate: champ.endDate })}`,
    ];

    // Получение отсортированных данных из таблицы
    const sortedData = table.getRowModel().rows.map((row) => row.original);

    const columnsWithIndex = columns.map((column) =>
      column.header === '#' ? { accessorKey: 'index', header: '#' } : column
    );

    getPdfRegistered({ columns: columnsWithIndex, data: sortedData, subTitles });
  };

  // Скачивание PDF файла таблицы бланка протокола с участниками для фиксации результатов.
  const handlerClickBlankProtocol = () => {
    if (!champ) {
      toast.error('Не получены данные Чемпионата');
      return;
    }

    const subTitles = [
      champ.name,
      `Заезд: ${registeredRidersInRace.raceName}`,
      `Дата: ${getDateChampionship({ startDate: champ.startDate, endDate: champ.endDate })}`,
    ];
    getPdfBlankForProtocol({ subTitles });
  };

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
              <tr>
                <td colSpan={table.getHeaderGroups()[0].headers.length}>
                  {registeredRidersInRace.raceName && (
                    <div className={styles.footer__files}>
                      <IconPdf
                        squareSize={24}
                        getClick={handlerClickBlankProtocol}
                        tooltip={{
                          id: `dlPdfProtocol-${registeredRidersInRace.raceNumber}`,
                          text: 'Бланк протокола для фиксации результатов участников, pdf',
                        }}
                      />
                      <IconPdf
                        squareSize={24}
                        getClick={handlerClickRegistered}
                        tooltip={{
                          id: `dlPdfRegistered-${registeredRidersInRace.raceNumber}`,
                          text: 'Таблица зарегистрированных участников, pdf',
                        }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
