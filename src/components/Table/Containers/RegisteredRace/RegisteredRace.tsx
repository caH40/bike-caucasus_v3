'use client';

import { useRegistrationRace } from '@/store/registration-race';
import TableRegisteredRace from '../../TableRegisteredRace/TableRegisteredRace';
// import styles from './ContainerTableChampionshipModeration.module.css';

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 * Таблица
 */
export default function ContainerTableRegisteredRace() {
  const registeredRiders = useRegistrationRace((state) => state.registeredRiders);

  return (
    <>
      {/* Таблица */}
      <TableRegisteredRace
        registeredRidersInRace={{
          raceRegistrationRider: registeredRiders,
          raceNumber: registeredRiders[0]?.raceNumber || 0,
          raceName: '',
        }}
        docsOnPage={10}
      />
    </>
  );
}
