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

import type { TChampRegistrationRiderDto, TRaceRegistrationDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import TdRider from '../Td/TdRider';
import BlockStartNumber from '@/components/BlockStartNumber/BlockStartNumber';

import BlockRegRaceStatus from '@/components/BlockRegRaceStatus/BlockRegRaceStatus';
import { getDateTime } from '@/libs/utils/calendar';
import IconPdf from '@/components/Icons/IconPDF';

const cx = cn.bind(styles);

type Props = {
  registeredRidersInRace: TChampRegistrationRiderDto;
  docsOnPage?: number;
};

const columns: ColumnDef<TRaceRegistrationDto & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'Номер',
    accessorKey: 'startNumber',
    cell: (props: any) => <BlockStartNumber startNumber={props.getValue()} />,
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
}: Props) {
  const data = useMemo(() => {
    return [...registeredRidersInRace.raceRegistrationRider]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((riderReg, index) => ({ ...riderReg, index: index + 1 }));
  }, [registeredRidersInRace.raceRegistrationRider]);

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

  // Скачивание PDF файла таблицы
  const getPdf = () => {
    console.log('pdf');
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
                  <td className={cx('td')} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className={cx('footer')}>
            <tr>
              <td colSpan={table.getHeaderGroups()[0].headers.length}>
                <div className={styles.footer__files}>
                  <IconPdf
                    squareSize={24}
                    getClick={getPdf}
                    tooltip={{ id: 'dlPdf', text: 'Скачать файл с таблицей в формате Pdf' }}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
