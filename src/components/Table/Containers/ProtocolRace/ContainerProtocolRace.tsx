'use client';

import { TResultRaceDto } from '@/types/dto.types';
import TableProtocolRace from '../../TableProtocolRace/TableProtocolRace';

type Props = {
  protocol: TResultRaceDto[];
  showFooter?: boolean;
  handlerUpdateProtocolRace: () => Promise<string | number | undefined>;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerProtocolRace({
  protocol,
  showFooter,
  handlerUpdateProtocolRace,
}: Props) {
  return (
    <>
      {/* Таблица */}
      <TableProtocolRace
        protocol={protocol}
        docsOnPage={15}
        showFooter={showFooter}
        handlerUpdateProtocolRace={handlerUpdateProtocolRace}
      />
    </>
  );
}
