import BlockTableControlDistance from '@/components/UI/BlockTableControlDistance/BlockTableControlDistance';
import { SURFACE_TYPE_TRANSLATIONS } from '@/constants/translations';
import { getTimerLocal } from '@/libs/utils/date-local';
import { TDistanceDto } from '@/types/dto.types';
import { TSurfaceType } from '@/types/index.interface';
import { CellContext, ColumnDef } from '@tanstack/react-table';

// Универсальный рендер для простых текстовых ячеек
const renderCell = (props: CellContext<TDistanceDto & { id: number }, string | number>) => (
  <span>{props.getValue()}</span>
);

export function getColumnsForDistanceTable(
  forModeration?: boolean
): ColumnDef<TDistanceDto & { id: number }, any>[] {
  const columnsForModeration = [
    {
      header: '#',
      accessorKey: 'id',
      cell: renderCell,
    },
    {
      header: 'Название',
      accessorKey: 'name',
      cell: renderCell,
    },
    {
      header: 'Описание',
      accessorKey: 'description',
      cell: renderCell,
    },
    {
      header: 'Дистанция, км',
      accessorKey: 'distanceInMeter',
      cell: (props: CellContext<TDistanceDto & { id: number }, string | number>) => (
        <span>{Math.round(+props.getValue() / 100) / 10}</span>
      ),
    },
    {
      header: 'Общий набор, м',
      accessorKey: 'ascentInMeter',
      cell: renderCell,
    },
    {
      header: 'Тип покрытия',
      accessorKey: 'surfaceType',
      cell: (props: CellContext<TDistanceDto & { id: number }, string | number>) => {
        const surfaceType = props.getValue();
        const value =
          typeof surfaceType === 'string' && surfaceType in SURFACE_TYPE_TRANSLATIONS
            ? SURFACE_TYPE_TRANSLATIONS[surfaceType as TSurfaceType]
            : surfaceType;

        return <span>{value}</span>;
      },
    },
    {
      header: 'Дата создания',
      accessorKey: 'createdAt',
      cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
    },
    {
      header: 'Модерация',
      accessorKey: '_id',
      cell: (props: any) => (
        <BlockTableControlDistance
          urlSlug={props.row.original.urlSlug}
          name={props.row.original.name}
        />
      ),
    },
  ];

  return forModeration
    ? columnsForModeration
    : columnsForModeration.filter((c) => !['Модерация'].includes(c.header));
}
