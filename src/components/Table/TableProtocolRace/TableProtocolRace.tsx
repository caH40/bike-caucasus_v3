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
import IconStar from '@/components/Icons/IconStar';
import IconTeam from '@/components/Icons/IconTeam';
import IconSpeed from '@/components/Icons/IconSpeed';
import IconRider from '@/components/Icons/IconRider';
import IconCategory from '@/components/Icons/IconCategory';
import IconHomePlace from '@/components/Icons/IconHomePlace';
import { TResultRaceDto } from '@/types/dto.types';
import { replaceCategorySymbols } from '@/libs/utils/championship/championship';
import IconChronometer from '@/components/Icons/IconChronometer';
import Medal from '../Td/Medal';
import styles from '../TableCommon.module.css';
import Time from '../Td/Time';
import BlockStartNumber from '../../BlockStartNumber/BlockStartNumber';
import TdGap from '@/components/GapInProtocol/GapInProtocol';
import IconGapLeader from '@/components/Icons/IconGapLeader';
import IconGapPrev from '@/components/Icons/IconGapPrev';
import BlockModerationResult from '@/components/UI/BlockModeration/BlockModerationResult';
import IconEditOld from '@/components/Icons/IconEditOld';
import ProtocolMenuPopup from '@/components/UI/Menu/MenuControl/ProtocolMenuPopup';
import IconNumber from '@/components/Icons/IconNumber';
import { getUserDataDto } from '@/libs/user';

const cx = cn.bind(styles);

type Props = {
  protocol: TResultRaceDto[];
  docsOnPage?: number;
  showFooter?: boolean;
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  captionTitle: string; // Название таблицы.
  raceInfo: { championshipId: string; championshipUrlSlug: string; raceId: string };
};

const allColumns: (ColumnDef<TResultRaceDto & { index: number }> & { uniqueName?: string })[] =
  [
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
        <IconPodium
          tooltip={{ text: 'Занятое место в возрастной категории', id: 'placeCategoryAge' }}
        />
      ),
      accessorKey: 'positions.category',
      cell: (props: any) => <Medal position={props.getValue()} />,
      uniqueName: 'Место в категории',
    },
    {
      header: () => (
        <IconPodium
          tooltip={{
            text: 'Занятое место в общем зачете с делением по полу',
            id: 'placeAbsoluteGender',
          }}
        />
      ),
      accessorKey: 'positions.absoluteGender',
      cell: (props: any) => <Medal position={props.getValue()} />,
      uniqueName: 'Место в абсолюте по полу',
    },
    {
      header: () => (
        <IconNumber
          colors={{ default: 'darkcyan' }}
          tooltip={{ text: 'Стартовый номер', id: 'startNumberIcon' }}
        />
      ),
      accessorKey: 'startNumber',
      cell: (props: any) => (
        <BlockStartNumber
          startNumber={props.getValue()}
          gender={props.row.original.profile.gender}
        />
      ),
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
        const { rider, profile } = props.row.original;

        const riderData = getUserDataDto({
          imageFromProvider: rider?.imageFromProvider,
          downloadedImage: rider?.image,
          providerImage: rider?.provider?.image,
          profile: profile,
          id: rider?.id,
        });

        return <TdRider rider={riderData} showPatronymic={true} />;
      },
    },
    {
      header: () => (
        <IconChronometer
          tooltip={{
            text: 'Финишное время',
            id: 'finishTime',
          }}
        />
      ),
      accessorKey: 'raceTimeInMilliseconds',
      cell: (props: any) => <Time timeInMilliseconds={props.getValue()} />,
    },
    // ===================== Отставания в общей категории =====================
    {
      header: () => (
        <IconGapLeader
          tooltip={{
            text: 'Отставание от лидера',
            id: 'gapToLeader',
          }}
        />
      ),
      accessorKey: 'gapsInCategories.absolute.toLeader',
      cell: (props: any) => (
        <TdGap gap={props.row.original.gapsInCategories?.absolute?.toLeader} />
      ),
      uniqueName: 'Отставания в общем протоколе',
    },
    {
      header: () => (
        <IconGapPrev
          tooltip={{
            text: 'Отставание от райдера впереди',
            id: 'gapToPrev',
          }}
        />
      ),
      accessorKey: 'gapsInCategories.absolute.toPrev',
      cell: (props: any) => (
        <TdGap gap={props.row.original.gapsInCategories?.absolute?.toPrev} />
      ),
      uniqueName: 'Отставания в общем протоколе',
    },
    // ===================== Отставания в категории =====================
    {
      header: () => (
        <IconGapLeader
          tooltip={{
            text: 'Отставание от лидера в категории',
            id: 'gapToLeader',
          }}
        />
      ),
      accessorKey: 'gapsInCategories.category.toLeader',
      cell: (props: any) => (
        <TdGap gap={props.row.original.gapsInCategories?.category?.toLeader} />
      ),
      uniqueName: 'Отставания в категории',
    },
    {
      header: () => (
        <IconGapPrev
          tooltip={{
            text: 'Отставание от райдера впереди',
            id: 'gapToPrev',
          }}
        />
      ),
      accessorKey: 'gapsInCategories.category.toPrev',
      cell: (props: any) => (
        <TdGap gap={props.row.original.gapsInCategories?.category?.toPrev} />
      ),
      uniqueName: 'Отставания в категории',
    },
    // ===================== Отставания в общей женской категории =====================
    {
      header: () => (
        <IconGapLeader
          tooltip={{
            text: 'Отставание от лидера общей женской категории',
            id: 'gapToLeaderFemale',
          }}
        />
      ),
      accessorKey: 'gapsInCategories.absoluteGenderFemale.toLeader',
      cell: (props: any) => (
        <TdGap gap={props.row.original.gapsInCategories?.absoluteGenderFemale?.toLeader} />
      ),
      uniqueName: 'Отставания в общей женской категории',
    },
    {
      header: () => (
        <IconGapPrev
          tooltip={{
            text: 'Отставание от райдера впереди',
            id: 'gapToPrev',
          }}
        />
      ),
      accessorKey: 'gapsInCategories.absoluteGenderFemale.toPrev',
      cell: (props: any) => (
        <TdGap gap={props.row.original.gapsInCategories?.absoluteGenderFemale?.toPrev} />
      ),
      uniqueName: 'Отставания в общей женской категории',
    },
    {
      header: () => (
        <IconSpeed
          tooltip={{
            text: 'Средняя скорость на дистанции',
            id: 'speed',
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
        <IconTeam
          tooltip={{
            text: 'Команда',
            id: 'team',
          }}
        />
      ),
      accessorKey: 'profile.team',
      cell: (props: any) => props.row.original.profile?.team ?? 'нет', // Безопасный доступ
    },
    {
      header: () => (
        <IconHomePlace
          tooltip={{
            text: 'Город',
            id: 'city',
          }}
        />
      ),
      accessorKey: 'profile.city',
    },
    {
      header: () => (
        <IconCategory
          squareSize={24}
          tooltip={{
            text: 'Категория',
            id: 'category',
          }}
        />
      ),
      accessorKey: 'categoryAge', // Не важно значение, так как данные берутся из origin.
      cell: (props: any) => {
        const row = props.row.original;

        return row.categorySkillLevel ? (
          row.categorySkillLevel
        ) : (
          <span className={styles.nowrap}>{replaceCategorySymbols(row.categoryAge)}</span>
        );
      },
      uniqueName: 'Категория',
    },
    {
      header: () => (
        <IconStar
          colors={{ default: '#d7d700' }}
          tooltip={{
            text: 'Очки за заезд в категории',
            id: 'points',
          }}
        />
      ),
      accessorKey: 'points.category',
      cell: (props: any) => props.getValue(),
      uniqueName: 'Очки',
    },
    {
      header: () => (
        <IconEditOld
          squareSize={24}
          tooltip={{
            text: 'Модерация',
            id: 'moderation-TableProtocolRace',
          }}
        />
      ),
      accessorKey: 'urlSlug',
      cell: (props) => <BlockModerationResult resultIdDB={props.row.original._id} />,
      uniqueName: 'Модерация',
    },
  ];

/**
 * Таблица финишных протоколов заездов.
 */
export default function TableProtocolRace({
  protocol,
  showFooter,
  docsOnPage = 50,
  hiddenColumnHeaders = [],
  captionTitle,
  raceInfo,
}: Props) {
  const data = useMemo(() => {
    return [...protocol].map((elm, index) => ({ ...elm, index: index + 1 }));
  }, [protocol]);

  // Скрытие столбцов которые есть в массиве hide
  const columns = allColumns.filter((column) => {
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

              {/* popup меня управления протоколом */}
              <div className={styles.menu__control}>
                <ProtocolMenuPopup raceInfo={raceInfo} />
              </div>
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
