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
import { TNewsGetOneDto } from '@/types/dto.types';
import Pagination from '@/components/UI/Pagination/Pagination';
import IconDelete from '@/components/Icons/IconDelete';
import IconEdit from '@/components/Icons/IconEdit';
import BlockInteractive from '@/components/BlockInteractive/BlockInteractive';

import styles from '../TableCommon.module.css';
import { deleteNews } from '@/actions/news';

const cx = cn.bind(styles);

type Props = {
  news: TNewsGetOneDto[];
  idUserDB: string | undefined; // _id Пользователя в БД.
};

const columns: ColumnDef<TNewsGetOneDto>[] = [
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
    header: 'Дата изменения',
    accessorKey: 'updatedAt',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
  {
    header: 'Заголовок',
    accessorKey: 'title',
  },
  {
    header: 'Удаление новости',
    accessorKey: 'urlSlug',
    cell: (props) => <InteractiveBlock props={props} />,
  },
];

/**
 * Таблица логов ошибок, зафиксированных на сайте.
 */
export default function TableNewsList({ news, idUserDB }: Props) {
  const data = useMemo(() => {
    return [...news]
      .filter((newsOne) => newsOne.author._id === idUserDB)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((newsOne, index) => ({ ...newsOne, index }));
  }, [news, idUserDB]);

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
            Таблица новостей, доступных для редактирования
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

function InteractiveBlock({
  props,
}: {
  props: CellContext<TNewsGetOneDto, unknown>;
}): JSX.Element {
  const router = useRouter();

  const urlSlug = props.row.original.urlSlug;

  const getNavigate = (id: string) => {
    if (id === 'undefined') {
      return toast.error('Не получен urlSlug новости!');
    }

    router.push(`/moderation/news/edit/${id}`);
  };

  /**
   * Обработка клика на удаление новости.
   */
  const getDeleteNews = async () => {
    const confirmed = window.confirm(
      `Вы действительно хотите удалить новость c urlSlug:${urlSlug}?`
    );
    if (!confirmed) {
      return toast.warning('Отменён запрос на удаление новости!');
    }
    const res = await deleteNews(urlSlug);
    if (res.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  // Иконки управления новостью.
  const icons = [
    { id: 0, icon: IconEdit, getClick: () => getNavigate(props.row.original.urlSlug) },
    { id: 1, icon: IconDelete, getClick: () => getDeleteNews() },
  ];

  return <BlockInteractive icons={icons} />;
}
