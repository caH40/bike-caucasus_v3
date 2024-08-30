'use client';

import { useState } from 'react';

import { TOptions } from '@/types/index.interface';
import FormSelectionRace from '../UI/Forms/FormSelectionRace/FormSelectionRace';
import { TDtoChampionship } from '@/types/dto.types';
import BlockRaceInfo from '../BlockRaceInfo/BlockRaceInfo';
import styles from './WrapperProtocolRace.module.css';

type Props = {
  options: TOptions[];
  championship: TDtoChampionship;
};

/**
 * Обертка для клиентских компонентов страницы работы с финишным протоколом Заезда.
 */
export default function WrapperProtocolRace({ options, championship }: Props) {
  const [raceNumber, setRaceNumber] = useState<string>('1');
  const race = championship.races.find((race) => race.number === +raceNumber);
  console.log(options);

  return (
    <div className={styles.wrapper}>
      <FormSelectionRace
        options={options}
        raceNumber={raceNumber}
        setRaceNumber={setRaceNumber}
      />

      <BlockRaceInfo raceNumber={raceNumber} race={race} />
    </div>
  );
}
