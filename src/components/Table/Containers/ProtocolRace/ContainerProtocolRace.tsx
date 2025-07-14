'use client';

import { TResultRaceDto } from '@/types/dto.types';
import TableProtocolRace from '../../TableProtocolRace/TableProtocolRace';
import { TCategoriesEntity } from '@/types/index.interface';

type Props = {
  protocol: TResultRaceDto[];
  showFooter?: boolean;
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  captionTitle: string; // Название таблицы.
  raceInfo: { championshipId: string; championshipUrlSlug: string; raceId: string };
  categoryEntity: TCategoriesEntity;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerProtocolRace({
  protocol,
  showFooter,
  hiddenColumnHeaders,
  captionTitle,
  raceInfo,
  categoryEntity,
}: Props) {
  return (
    <>
      {/* Таблица */}
      <TableProtocolRace
        protocol={protocol}
        showFooter={showFooter}
        raceInfo={raceInfo}
        hiddenColumnHeaders={hiddenColumnHeaders}
        captionTitle={captionTitle}
        categoryEntity={categoryEntity}
      />
    </>
  );
}
