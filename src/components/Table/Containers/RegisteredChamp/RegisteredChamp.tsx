'use client';

import TableRegisteredRace from '../../TableRegisteredRace/TableRegisteredRace';
import { TChampRegistrationRiderDto } from '@/types/dto.types';

type Props = { registeredRidersInRace: TChampRegistrationRiderDto };

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableRegisteredChamp({ registeredRidersInRace }: Props) {
  return (
    <>
      {/* Таблица */}
      <TableRegisteredRace registeredRidersInRace={registeredRidersInRace} docsOnPage={10} />
    </>
  );
}
