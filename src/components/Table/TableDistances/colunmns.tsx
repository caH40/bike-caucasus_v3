import BlockTableControlDistance from '@/components/UI/BlockTableControlDistance/BlockTableControlDistance';
import { getTimerLocal } from '@/libs/utils/date-local';
import { TDistanceDto } from '@/types/dto.types';
import { ColumnDef } from '@tanstack/react-table';

export function getColumnsForDistanceTable(): ColumnDef<TDistanceDto & { id: number }, any>[] {
  return [
    {
      header: '#',
      accessorKey: 'id',
      cell: (props: any) => <span>{props.getValue()}</span>,
    },
    {
      header: 'Название',
      accessorKey: 'name',
      cell: (props: any) => <span>{props.getValue()}</span>,
    },
    {
      header: 'Описание',
      accessorKey: 'description',
      cell: (props: any) => <span>{props.getValue()}</span>,
    },
    {
      header: 'Дистанция',
      accessorKey: 'distanceInMeter',
      cell: (props: any) => <span>{props.getValue()}</span>,
    },
    {
      header: 'Общий набор',
      accessorKey: 'ascentInMeter',
      cell: (props: any) => <span>{props.getValue()}</span>,
    },
    {
      header: 'Тип покрытия',
      accessorKey: 'surfaceType',
      cell: (props: any) => <span>{props.getValue()}</span>,
    },
    {
      header: 'Дата создания',
      accessorKey: 'createdAt',
      cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
    },
    {
      header: 'Модерация',
      accessorKey: '_id',
      cell: (props) => (
        <BlockTableControlDistance
          urlSlug={props.row.original.urlSlug}
          name={props.row.original.name}
        />
      ),
    },
  ];
}
