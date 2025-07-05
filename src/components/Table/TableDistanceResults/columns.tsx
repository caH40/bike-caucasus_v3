import {
  IconChronometer,
  IconGapLeader,
  IconGapPrev,
  IconPodium,
  IconRider,
  IconSpeed,
} from '@/components/Icons';
import TdDistanceResultDate from '../Td/TdDistanceResultDate';
import { TDistanceResultDto } from '@/types/dto.types';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import Medal from '../Td/Medal';
import TdRider from '../Td/TdRider';
import Time from '../Td/Time';
import TdGap from '@/components/GapInProtocol/GapInProtocol';
import styles from '../TableCommon.module.css';

type TCellProps = CellContext<TDistanceResultDto & { id: number }, string | number>;

export function getColumnsForDistanceResultsTable(): ColumnDef<
  TDistanceResultDto & { id: number },
  any
>[] {
  const columnsForModeration = [
    {
      header: () => (
        <IconPodium tooltip={{ text: 'Занятое место в общем зачете', id: 'placeAbsolute' }} />
      ),
      accessorKey: 'position',
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
      accessorKey: 'rider',
      cell: (props: any) => {
        const { rider } = props.row.original;
        return <TdRider rider={rider} showPatronymic={true} />;
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
    {
      header: () => (
        <IconGapLeader
          tooltip={{
            text: 'Отставание от лидера',
            id: 'gapToLeader',
          }}
        />
      ),
      accessorKey: 'gaps.toLeader',
      cell: (props: any) => <TdGap gap={props.row.original.gaps?.absolute?.toLeader} />,
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
      accessorKey: 'gaps.toPrev',
      cell: (props: any) => <TdGap gap={props.row.original.gaps?.absolute?.toPrev} />,
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
      header: 'Дата',
      accessorKey: 'startDate',
      cell: (props: TCellProps) => (
        <TdDistanceResultDate
          date={String(props.getValue())}
          championshipUrlSlug={props.row.original.championshipUrlSlug}
        />
      ),
    },
  ];

  return columnsForModeration;
}
