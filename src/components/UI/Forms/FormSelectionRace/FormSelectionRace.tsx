'use client';

import { Dispatch, SetStateAction } from 'react';

import { TOptions } from '@/types/index.interface';
import Select from '../../Select/Select';

type Props = {
  options: TOptions[];
  raceId: string;
  setRaceId: Dispatch<SetStateAction<string>>;
  label: string;
};

/**
 * Форма выбора Заезда для добавления финишного протокола в него.
 */
export default function FormSelectionRace({ label, options, raceId, setRaceId }: Props) {
  return (
    <form>
      <Select
        label={label}
        id={'selectRaceNumber'}
        name={'selectRaceNumber'}
        options={options}
        state={raceId}
        setState={setRaceId}
        disabledEmpty={true}
      />
    </form>
  );
}
