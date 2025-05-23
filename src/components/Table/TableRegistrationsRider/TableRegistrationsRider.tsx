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
import Image from 'next/image';
import Link from 'next/link';

import BlockStartNumber from '../Td/BlockStartNumber';
import BlockRegRaceStatus from '@/components/BlockRegRaceStatus/BlockRegRaceStatus';
import { getDateTime } from '@/libs/utils/calendar';
import { blurBase64 } from '@/libs/image';
import type { TRegistrationRiderDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  registrationsRider: TRegistrationRiderDto[];
  userIdDbFromSession: string | undefined;
  docsOnPage?: number;
};

const columns: ColumnDef<TRegistrationRiderDto & { index: number }>[] = [
  {
    header: 'Дата старта',
    accessorKey: 'championship.startDate',
    cell: (props: any) => getDateTime(new Date(props.getValue())).dateDDMMYYYY,
  },
  {
    header: 'Логотип',
    accessorKey: 'championship.posterUrl',
    cell: (props: any) => (
      <Image
        width={64}
        height={46}
        src={props.getValue()}
        alt={'Логотип'}
        placeholder="blur"
        blurDataURL={blurBase64}
        className={styles.img}
      />
    ),
  },
  {
    header: 'Название',
    accessorKey: 'championship.name',
    cell: (props: any) => {
      const urlSlug = props.row.original.championship.urlSlug;
      return (
        <Link className="link__news" href={`/championships/${urlSlug}`}>
          {props.getValue()}
        </Link>
      );
    },
  },
  {
    header: 'Название заезда',
    accessorKey: 'championship.race.name',
  },
  {
    header: 'Дистанция, км',
    accessorKey: 'championship.race.distance',
  },
  {
    header: 'Общий набор, м',
    accessorKey: 'championship.race.ascent',
  },
  {
    header: 'Номер',
    accessorKey: 'startNumber',
    cell: (props: any) => <BlockStartNumber startNumber={props.getValue()} />,
  },
  {
    header: 'Статус',
    accessorKey: 'status',
    cell: (props: any) => (
      <BlockRegRaceStatus
        status={props.getValue()}
        userIdDb={props.row.original.riderId}
        showBtn={
          props.row.original.userIdDbFromSession &&
          props.row.original.userIdDbFromSession === props.row.original.riderId
        }
        championshipId={props.row.original.championship._id}
        raceId={props.row.original.raceId}
      />
    ),
  },
];

/**
 * Таблица Чемпионатов.
 */
export default function TableRegistrationsRider({
  registrationsRider,
  userIdDbFromSession,
  docsOnPage = 10,
}: Props) {
  const data = useMemo(() => {
    return [...registrationsRider]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((riderReg, index) => ({ ...riderReg, index: index + 1, userIdDbFromSession }));
  }, [registrationsRider, userIdDbFromSession]);

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
          <caption className={cx('caption', 'hidden')}>
            Велогонки в которых Райдер зарегистрировался для участия
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
        </table>
      </div>
    </div>
  );
}
