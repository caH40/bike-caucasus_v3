'use client';

import { useRegistrationRace } from '@/store/registration-race';
import TableRegisteredRace from '../../TableRegisteredRace/TableRegisteredRace';
// import styles from './ContainerTableChampionshipModeration.module.css';

/**
 * Блок для таблиц и их управления, что бы был один клиентский компонент.
 */
export default function ContainerTableRegisteredRace() {
  const registeredRiders = useRegistrationRace((state) => state.registeredRiders);

  return (
    <>
      {/* Таблица */}
      <TableRegisteredRace registeredRiders={registeredRiders} docsOnPage={10} />
    </>
  );
}
