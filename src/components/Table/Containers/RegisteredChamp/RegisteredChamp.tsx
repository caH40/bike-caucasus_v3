'use client';

import TableRegisteredRace from '../../TableRegisteredRace/TableRegisteredRace';
import { TChampRegistrationRiderDto } from '@/types/dto.types';

type Props = {
  registeredRidersInRace: TChampRegistrationRiderDto;
  showFooter?: boolean;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableRegisteredChamp({
  registeredRidersInRace,
  showFooter,
}: Props) {
  return (
    <>
      {/* Таблица */}
      <TableRegisteredRace
        registeredRidersInRace={registeredRidersInRace}
        docsOnPage={10}
        showFooter={showFooter}
      />
    </>
  );
}
