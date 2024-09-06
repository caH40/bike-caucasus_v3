'use client';

import { Dispatch, SetStateAction } from 'react';

import { TOptions } from '@/types/index.interface';
import Select from '../../Select/Select';

type Props = {
  options: TOptions[];
  raceNumber: string;
  setRaceNumber: Dispatch<SetStateAction<string>>;
};

/**
 * Форма выбора Заезда для добавления финишного протокола в него.
 */
export default function FormSelectionRace({ options, raceNumber, setRaceNumber }: Props) {
  return (
    <form>
      <Select
        label={' Выбор заезда для добавления результатов:'}
        id={'selectRaceNumber'}
        name={'selectRaceNumber'}
        options={options}
        state={raceNumber}
        setState={setRaceNumber}
      />
    </form>
  );
}
