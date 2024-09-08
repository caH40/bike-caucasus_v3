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
import { toast } from 'sonner';

import Pagination from '@/components/UI/Pagination/Pagination';
import { TResultRaceDto } from '@/types/dto.types';
import TdRider from '../Td/TdRider';
import { formatTimeToStr } from '@/libs/utils/timer';
import { updateProtocolRace } from '@/actions/result-race';
import IconRefresh from '@/components/Icons/IconRefresh';
import styles from '../TableCommon.module.css';

const cx = cn.bind(styles);

type Props = {
  protocol: TResultRaceDto[];
  docsOnPage?: number;
  showFooter?: boolean;
};

const columns: ColumnDef<TResultRaceDto & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'absolute',
    accessorKey: 'positions.absolute',
  },
  {
    header: 'category',
    accessorKey: 'positions.category',
  },
  {
    header: 'absoluteGender',
    accessorKey: 'positions.absoluteGender',
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
    cell: (props: any) => {
      const value = props.getValue();

      if (value.includes('F')) {
        return value.replace('F', 'Ж');
      } else if (value.includes('M')) {
        return value.replace('M', 'М');
      } else {
        return value;
      }
    },
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableProtocolRace({ protocol, showFooter, docsOnPage = 5 }: Props) {
  const data = useMemo(() => {
    return [...protocol].map((newsOne, index) => ({ ...newsOne, index: index + 1 }));
  }, [protocol]);

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

  const handlerUpdateProtocolRace = async () => {
    const championshipId = protocol[0]?.championship;
    const raceNumber = protocol[0]?.raceNumber;

    if (!championshipId || !raceNumber) {
      return toast.error('Нет данных об Чемпионате, или в протоколе нет ни одного результата!');
    }

    const response = await updateProtocolRace({
      championshipId,
      raceNumber,
    });

    if (response.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={cx('caption')}>
            <div className={styles.caption__inner}>
              <span>Протокол заезда</span>
              <IconRefresh
                squareSize={20}
                colors={{ default: 'green', hover: 'orange' }}
                tooltip={{
                  text: 'Обновление категорий участников, мест во всех категориях и протоколах.',
                  id: 'refreshProtocol',
                }}
                getClick={handlerUpdateProtocolRace}
              />
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
