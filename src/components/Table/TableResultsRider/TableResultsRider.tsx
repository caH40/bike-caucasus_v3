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
import Link from 'next/link';

import { getDateTime } from '@/libs/utils/calendar';
import { TRiderRaceResultDto } from '@/types/dto.types';
import IconPodium from '@/components/Icons/IconPodium';
import IconChronometer from '@/components/Icons/IconChronometer';
import IconSpeed from '@/components/Icons/IconSpeed';
import IconDate from '@/components/Icons/IconDate';
import IconTitle from '@/components/Icons/IconTitle';
import IconDistance from '@/components/Icons/IconDistance';
import IconAscent from '@/components/Icons/IconAscent';
import Medal from '../Td/Medal';
import Time from '../Td/Time';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  results: TRiderRaceResultDto[];
  docsOnPage?: number;
};

const columns: ColumnDef<TRiderRaceResultDto & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: () => (
      <IconDate tooltip={{ text: 'Дата проведения', id: 'date-TableResultsRider' }} />
    ),
    accessorKey: 'championship.endDate',
    cell: (props: any) => getDateTime(new Date(props.getValue())).dateDDMMYYYY,
  },
  {
    header: () => (
      <IconPodium
        tooltip={{
          text: 'Занятое место в возрастной категории',
          id: 'placeCategoryAge-TableResultsRider',
        }}
      />
    ),
    accessorKey: 'positions.category',
    cell: (props: any) => {
      return (
        <div className={cx('box__value', 'box__value-position')}>
          <Medal position={props.getValue()} />
          <span className={styles.dimension}>
            ({props.row.original.quantityRidersFinished.category})
          </span>
        </div>
      );
    },
  },
  {
    header: () => (
      <IconPodium
        tooltip={{
          text: 'Занятое место в общем зачете',
          id: 'placeAbsolute-TableResultsRider',
        }}
      />
    ),
    accessorKey: 'positions.absolute',
    cell: (props: any) => (
      <div className={cx('box__value', 'box__value-position')}>
        <Medal position={props.getValue()} />
        <span className={styles.dimension}>
          ({props.row.original.quantityRidersFinished.absolute})
        </span>
      </div>
    ),
  },

  {
    header: () => (
      <IconTitle tooltip={{ text: 'Название', id: 'nameChamp-TableResultsRider' }} />
    ),
    accessorKey: 'championship.name',
    cell: (props: any) => {
      const urlSlug = props.row.original.championship.urlSlug;
      return (
        <Link className="link" href={`/championships/${urlSlug}`}>
          {props.getValue()}
        </Link>
      );
    },
  },
  {
    header: () => (
      <IconChronometer
        tooltip={{
          text: 'Финишное время',
          id: 'finishTime-TableResultsRider',
        }}
      />
    ),
    accessorKey: 'raceTimeInMilliseconds',
    cell: (props: any) => <Time timeInMilliseconds={props.getValue()} />,
  },
  {
    header: () => (
      <IconSpeed
        tooltip={{
          text: 'Средняя скорость на дистанции',
          id: 'speed-TableResultsRider',
        }}
      />
    ),
    accessorKey: 'averageSpeed',
    cell: (props: any) => (
      <div className={styles.box__value}>
        {props.getValue() && props.getValue().toFixed(1)}
        <span className={styles.dimension}>км/ч</span>
      </div>
    ),
  },
  {
    header: () => (
      <IconTitle tooltip={{ text: 'Название заезда', id: 'nameRaceChamp-TableResultsRider' }} />
    ),
    accessorKey: 'championship.race.name',
  },
  {
    header: () => (
      <IconDistance
        tooltip={{
          text: 'Дистанция',
          id: 'distance-TableResultsRider',
        }}
      />
    ),
    accessorKey: 'championship.race.distance',
    cell: (props: any) => (
      <div className={styles.box__value}>
        {props.getValue()}
        <span className={styles.dimension}>км</span>
      </div>
    ),
  },
  {
    header: () => (
      <IconAscent
        tooltip={{
          text: 'Общий набор',
          id: 'ascent-TableResultsRider',
        }}
      />
    ),
    accessorKey: 'championship.race.ascent',
    cell: (props: any) => (
      <div className={styles.box__value}>
        {props.getValue()}
        <span className={styles.dimension}>м</span>
      </div>
    ),
  },
];

/**
 * Таблица результатов Райдера в заездах (соревнованиях).
 */
export default function TableResultsRider({ results, docsOnPage = 10 }: Props) {
  const data = useMemo(() => {
    return [...results]
      .sort(
        (a, b) =>
          new Date(b.championship.endDate).getTime() -
          new Date(a.championship.endDate).getTime()
      )
      .map((result, index) => ({ ...result, index: index + 1 }));
  }, [results]);

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
            Велогонки в которых Райдер принимал участие
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
              <tr className={cx('tr', 'tr-hover')} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    className={cx('td', {
                      number: ['positions_absolute', 'positions_category'].includes(
                        cell.column.id
                      ),
                    })}
                    key={cell.id}
                  >
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
