'use client';

import { TResultRaceDto } from '@/types/dto.types';
import TableProtocolRace from '../../TableProtocolRace/TableProtocolRace';

type Props = {
  protocol: TResultRaceDto[];
  showFooter?: boolean;
  handlerUpdateProtocolRace: () => Promise<string | number | undefined>;
  hiddenColumnHeaders: string[]; // Массив названий столбцов, которых необходимо скрыть.
  captionTitle: string; // Название таблицы.
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerProtocolRace({
  protocol,
  showFooter,
  handlerUpdateProtocolRace,
  hiddenColumnHeaders,
  captionTitle,
}: Props) {
  return (
    <>
      {/* Таблица */}
      <TableProtocolRace
        protocol={protocol}
        showFooter={showFooter}
        handlerUpdateProtocolRace={handlerUpdateProtocolRace}
        hiddenColumnHeaders={hiddenColumnHeaders}
        captionTitle={captionTitle}
      />
    </>
  );
}
