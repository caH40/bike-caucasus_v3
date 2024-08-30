'use client';

import { useEffect, useState } from 'react';

import { TOptions } from '@/types/index.interface';
import FormSelectionRace from '../UI/Forms/FormSelectionRace/FormSelectionRace';
import { TDtoChampionship, TRaceRegistrationDto } from '@/types/dto.types';
import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import styles from './WrapperProtocolRace.module.css';
import FormResultAdd from '../UI/Forms/FormResultAdd/FormResultAdd';
import { getRegisteredRidersChamp } from '@/actions/registration-champ';

type Props = {
  options: TOptions[];
  championship: TDtoChampionship;
};

/**
 * Обертка для клиентских компонентов страницы работы с финишным протоколом Заезда.
 */
export default function WrapperProtocolRace({ options, championship }: Props) {
  const [raceNumber, setRaceNumber] = useState<string>('1');
  const [registeredRiders, setRegisteredRiders] = useState<TRaceRegistrationDto[]>([]);
  const race = championship.races.find((race) => race.number === +raceNumber);
  // console.log(registeredRiders);

  useEffect(() => {
    getRegisteredRidersChamp({ urlSlug: championship.urlSlug, raceNumber: +raceNumber }).then(
      (res) => {
        if (res.data) {
          // Берем 0 элемент, так как запрашиваем один конкретный заезд с номером raceNumber.
          setRegisteredRiders(res.data.champRegistrationRiders[0].raceRegistrationRider);
        }
      }
    );
  }, [raceNumber, championship.urlSlug]);

  return (
    <div className={styles.wrapper}>
      <FormSelectionRace
        options={options}
        raceNumber={raceNumber}
        setRaceNumber={setRaceNumber}
      />

      <BlockRaceInfo raceNumber={raceNumber} race={race} />

      <FormResultAdd registeredRiders={registeredRiders} />
    </div>
  );
}
