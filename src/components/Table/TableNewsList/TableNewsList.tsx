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

import { getTimerLocal } from '@/libs/utils/date-local';
import { TNewsGetOneDto } from '@/types/dto.types';
import Pagination from '@/components/UI/Pagination/Pagination';
import styles from '../TableCommon.module.css';

import IconDelete from '@/components/Icons/IconDelete';
import IconEdit from '@/components/Icons/IconEdit';
import BlockInteractive from '@/components/BlockInteractive/BlockInteractive';

type Props = {
  news: TNewsGetOneDto[];
  userDbId: string | undefined; // _id Пользователя в БД.
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
export default function TableNewsList({ news, userDbId }: Props) {
  const data = useMemo(() => {
    return [...news]
      .filter((newsOne) => newsOne.author._id === userDbId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((newsOne, index) => ({ ...newsOne, index }));
  }, [news, userDbId]);

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
      <table className={styles.table}>
        <caption className={styles.caption}>
          Таблица новостей, доступных для редактирования
        </caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={styles.trh} key={headerGroup.id}>
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

      {/* <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select> */}

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
  const getNavigate = (id: string) => {
    if (id === 'undefined') {
      return toast.error('Не получен urlSlug новости!');
    }

    router.push(`/moderation/news/edit/${id}`);
  };
  const deleteNews = () => props.row.original.urlSlug;
  const icons = [
    { id: 0, icon: IconEdit, getClick: () => getNavigate(props.row.original.urlSlug) },
    { id: 1, icon: IconDelete, getClick: () => deleteNews() },
  ];

  return <BlockInteractive icons={icons} />;
}
