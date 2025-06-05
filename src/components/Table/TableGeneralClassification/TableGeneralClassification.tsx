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
import IconPodium from '@/components/Icons/IconPodium';
import IconRider from '@/components/Icons/IconRider';
import { TGeneralClassificationDto, TStageClient } from '@/types/dto.types';
import Medal from '../Td/Medal';
import styles from '../TableCommon.module.css';
import IconStar from '@/components/Icons/IconStar';
import { TCategoriesEntity, TStagesForGCTableHeader } from '@/types/index.interface';

const cx = cn.bind(styles);

type Props = {
  generalClassification: TGeneralClassificationDto[];
  docsOnPage?: number;
  showFooter?: boolean;
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  captionTitle: string; // Название таблицы.
  stages: TStagesForGCTableHeader[];
  categoryEntity: TCategoriesEntity;
};

type TColumnsReturn = (ColumnDef<TGeneralClassificationDto & { index: number }> & {
  uniqueName?: string;
})[];

const allColumns = (
  stages: TStagesForGCTableHeader[],
  categoryEntity: TCategoriesEntity
): TColumnsReturn => {
  const firstPart = [
    {
      header: '#',
      accessorKey: 'index',
      uniqueName: '#',
    },
    {
      header: () => (
        <IconPodium tooltip={{ text: 'Занятое место в общем зачете', id: 'placeAbsolute' }} />
      ),
      accessorKey: 'positions.absolute',
      cell: (props: any) => <Medal position={props.getValue()} />,
      uniqueName: 'Место в абсолюте',
    },
    {
      header: () => (
        <IconRider
          squareSize={22}
          tooltip={{
            text: 'Участник',
            id: 'rider',
          }}
        />
      ),
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
          patronymic: data.profile.patronymic,
          image,
          id: data.rider?.id,
        };

        return <TdRider rider={rider} showPatronymic={true} />;
      },
    },
    {
      header: () => (
        <IconStar
          colors={{ default: '#d7d700' }}
          tooltip={{ text: 'Общее количество очков', id: 'totalFinishPointsAbsolute' }}
        />
      ),
      accessorKey: `totalFinishPoints.${categoryEntity}`,
      cell: (props: any) => props.getValue(),
      uniqueName: 'Очки в абсолютном зачете',
    },
  ];

  const secondPath = stages.map((stage) => ({
    header: `Этап ${stage.stageOrder}`,
    accessorFn: (row: any) =>
      row.stages.find((s: TStageClient) => s.order === stage.stageOrder)?.points?.[
        categoryEntity
      ],
  }));

  return [...firstPart, ...secondPath];
};

/**
 * Таблица финишных протоколов заездов.
 */
export default function TableGeneralClassification({
  generalClassification,
  showFooter,
  docsOnPage = 50,
  hiddenColumnHeaders = [],
  captionTitle,
  stages,
  categoryEntity,
}: Props) {
  const data = useMemo(() => {
    return [...generalClassification].map((elm, index) => ({ ...elm, index: index + 1 }));
  }, [generalClassification]);

  // Скрытие столбцов которые есть в массиве hide
  const columns = allColumns(stages, categoryEntity).filter((column) => {
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
            </div>
          </caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={cx('trh')} key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className={cx('th', {
                        number: [
                          'positions_absolute',
                          'positions_category',
                          'startNumber',
                        ].includes(header.id),
                        profile: header.id === 'profile',
                        raceTimeInMilliseconds: header.id === 'raceTimeInMilliseconds',
                        averageSpeed: header.id === 'averageSpeed',
                      })}
                      key={header.id}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className={cx('tr', 'tr-hover')} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      className={cx('td', {
                        number: [
                          'positions_absolute',
                          'positions_category',
                          'startNumber',
                        ].includes(cell.column.id),
                      })}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
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
