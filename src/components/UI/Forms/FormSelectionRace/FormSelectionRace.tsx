'use client';

import { Dispatch, SetStateAction } from 'react';

import { TOptions } from '@/types/index.interface';
import Select from '../../Select/Select';

type Props = {
  options: TOptions[];
  raceNumber: string;
  setRaceNumber: Dispatch<SetStateAction<string>>;
  label: string;
};

/**
 * Форма выбора Заезда для добавления финишного протокола в него.
 */
export default function FormSelectionRace({
  label,
  options,
  raceNumber,
  setRaceNumber,
}: Props) {
  return (
    <form>
      <Select
        label={label}
        id={'selectRaceNumber'}
        name={'selectRaceNumber'}
        options={options}
        state={raceNumber}
        setState={setRaceNumber}
        disabledEmpty={true}
      />
    </form>
  );
}
