'use client';

import { useRouter } from 'next/navigation';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  CellContext,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { toast } from 'sonner';
import cn from 'classnames/bind';

import { getTimerLocal } from '@/libs/utils/date-local';
import Pagination from '@/components/UI/Pagination/Pagination';
import IconDelete from '@/components/Icons/IconDelete';
import IconEditOld from '@/components/Icons/IconEditOld';
import BlockInteractive from '@/components/BlockInteractive/BlockInteractive';
import type { TTrailDto } from '@/types/dto.types';
import styles from '../TableCommon.module.css';
import useHasAccess from '@/hooks/useHasAccess';
import { bikeTypes } from '@/constants/trail';
import { deleteTrail } from '@/actions/trail';
import Image from 'next/image';
import { blurBase64 } from '@/libs/image';

const cx = cn.bind(styles);

type Props = {
  trails: TTrailDto[];
  idUserDB: string | undefined; // _id Пользователя в БД.
};

const columns: ColumnDef<TTrailDto & { index: number }>[] = [
  {
    header: '#',
    accessorKey: 'index',
  },
  {
    header: 'Постер',
    accessorKey: 'poster',
    cell: (props: any) => (
      <Image
        width={64}
        height={40}
        src={props.getValue()}
        alt={'Постер для маршрута'}
        placeholder="blur"
        blurDataURL={blurBase64}
        className={styles.img}
      />
    ),
  },
  {
    header: 'Название',
    accessorKey: 'title',
  },
  {
    header: 'Тип велосипеда',
    accessorKey: 'bikeType',
    cell: (props: any) => (
      <span>
        {bikeTypes.find((bt) => bt.name === props.getValue())?.translation || 'не задан'}
      </span>
    ),
  },
  {
    header: 'Автор',
    accessorFn: (row) =>
      `id:${row.author.id}, ${row.author.person.lastName}  ${row.author.person.firstName}`,
  },
  {
    header: 'Дата создания',
    accessorKey: 'createdAt',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
  {
    header: 'Модерация маршрута',
    accessorKey: 'urlSlug',
    cell: (props) => <InteractiveBlock props={props} />,
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableTrailList({ trails, idUserDB }: Props) {
  const isAdmin = useHasAccess('all'); // Админ может модерировать любые маршруты
  const data = useMemo(() => {
    return [...trails]
      .filter((trail) => trail.author._id === idUserDB || isAdmin)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((trail, index) => ({ ...trail, index: index + 1 }));
  }, [trails, idUserDB, isAdmin]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__wide}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            Таблица Маршрутов, доступных для редактирования
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
                className={styles.tr}
                key={row.id}
                // onClick={() => getLink(String(row.getValue('title')))}
                // onClick={() => getLink(String(row.original.urlSlug))}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className={cx('td', 'tdWithImg')} key={cell.id}>
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

/**
 * Блок Модерации маршрутом.
 */
function InteractiveBlock({
  props,
}: {
  props: CellContext<TTrailDto & { index: number }, unknown>;
}): JSX.Element {
  const router = useRouter();

  const urlSlug = props.row.original.urlSlug;

  const getNavigate = (id: string) => {
    if (id === 'undefined') {
      return toast.error('Не получен urlSlug новости!');
    }

    router.push(`/moderation/trails/edit/${id}`);
  };

  /**
   * Обработка клика на удаление новости.
   */
  const getDeleteTrail = async () => {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить маршрут c urlSlug:${urlSlug}?`
    );
    if (!confirmed) {
      return toast.warning('Отменён запрос на удаление маршрута!');
    }
    const res = await deleteTrail(urlSlug);
    if (res.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  // Иконки управления новостью.
  const icons = [
    { id: 0, icon: IconEditOld, getClick: () => getNavigate(props.row.original.urlSlug) },
    { id: 1, icon: IconDelete, getClick: () => getDeleteTrail() },
  ];

  return <BlockInteractive icons={icons} />;
}
