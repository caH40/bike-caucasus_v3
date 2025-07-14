import { type ColumnDef } from '@tanstack/react-table';

import { getUserDataDto } from '@/libs/user';
import { replaceCategorySymbols } from '@/libs/utils/championship/championship';
import Time from '../Td/Time';
import BlockStartNumber from '../../BlockStartNumber/BlockStartNumber';
import TdGap from '@/components/GapInProtocol/GapInProtocol';
import IconGapLeader from '@/components/Icons/IconGapLeader';
import IconGapPrev from '@/components/Icons/IconGapPrev';
import BlockModerationResult from '@/components/UI/BlockModeration/BlockModerationResult';
import IconEditOld from '@/components/Icons/IconEditOld';
import TdRider from '../Td/TdRider';
import IconPodium from '@/components/Icons/IconPodium';
import IconStar from '@/components/Icons/IconStar';
import IconTeam from '@/components/Icons/IconTeam';
import IconSpeed from '@/components/Icons/IconSpeed';
import IconRider from '@/components/Icons/IconRider';
import IconCategory from '@/components/Icons/IconCategory';
import IconHomePlace from '@/components/Icons/IconHomePlace';
import IconNumber from '@/components/Icons/IconNumber';
import IconChronometer from '@/components/Icons/IconChronometer';
import Medal from '../Td/Medal';
import Disqualification from '../Td/Disqualification';
import styles from '../TableCommon.module.css';

import { TResultRaceDto } from '@/types/dto.types';

import { TCategoriesEntity } from '@/types/index.interface';

type Props = {
  categoryEntity: TCategoriesEntity;
};

type TColumn = ColumnDef<TResultRaceDto & { index: number }> & {
  uniqueName?: string;
};

export function protocolColumns({ categoryEntity }: Props): TColumn[] {
  return [
    {
      header: '#',
      accessorKey: 'index',
      uniqueName: '#',
    },
    {
      header: () => (
        <IconPodium tooltip={{ text: 'Занятое место в общем зачете', id: 'placeAbsolute' }} />
      ),
      accessorKey: `positions.${categoryEntity}`,
      cell: (props: any) => {
        const { _id, disqualification } = props.row.original;

        if (disqualification) {
          return <Disqualification disqualification={disqualification} resultId={_id} />;
        } else {
          return <Medal position={props.getValue()} />;
        }
      },
      uniqueName: 'Место',
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
}
