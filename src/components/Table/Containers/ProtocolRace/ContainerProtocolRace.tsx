'use client';

import { TResultRaceDto } from '@/types/dto.types';
import TableProtocolRace from '../../TableProtocolRace/TableProtocolRace';

type Props = {
  protocol: TResultRaceDto[];
  showFooter?: boolean;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerProtocolRace({ protocol, showFooter }: Props) {
  return (
    <>
      {/* Таблица */}
      <TableProtocolRace protocol={protocol} docsOnPage={10} showFooter={showFooter} />
    </>
  );
}
