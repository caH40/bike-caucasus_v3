'use client';

import TableRegisteredRace from '../../TableRegisteredRace/TableRegisteredRace';
import { TChampRegistrationRiderDto } from '@/types/dto.types';

type Props = {
  registeredRidersInRace: TChampRegistrationRiderDto;
  champ: { championshipName: string; championshipType: string };
  showFooter?: boolean;
};

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableRegisteredChamp({
  registeredRidersInRace,
  champ,
  showFooter,
}: Props) {
  return (
    <>
      {/* Таблица */}
      <TableRegisteredRace
        registeredRidersInRace={registeredRidersInRace}
        champ={champ}
        docsOnPage={10}
        showFooter={showFooter}
      />
    </>
  );
}
