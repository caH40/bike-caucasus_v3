import { Control, Controller } from 'react-hook-form';

import Wrapper from '@/components/Wrapper/Wrapper';
import Select from '@/components/UI/Select/Select';
import { TFormResultRace } from '@/types/index.interface';
import { TRaceRegistrationDto } from '@/types/dto.types';
import styles from './BlockSelectRegisteredRider.module.css';
import { createOptionsForRegisteredRiderSelect } from '@/libs/utils/championship/registration';

type Props = {
  control: Control<TFormResultRace>;
  registeredRiders: TRaceRegistrationDto[];
  newStartNumber: number | string;
};

/**
 * Блок выбора зарегистрированного в Заезде райдера.
 */
export default function BlockSelectRegisteredRider({
  registeredRiders,
  control,
  newStartNumber,
}: Props) {
  const { optionsStartNumber, optionsRiderName } =
    createOptionsForRegisteredRiderSelect(registeredRiders);

  return (
    <Wrapper hSize={3} title="Выбор зарегистрированного в Заезде райдера">
      <div className={styles.wrapper__select}>
        <Controller
          name="riderRegisteredInRace.startNumber"
          control={control}
          render={({ field }) => (
            <Select
              state={field.value}
              setState={field.onChange}
              name={'riderStartNumber'}
              id={'riderStartNumberRegisteredRider'}
              label={'Стартовый номер:'}
              options={optionsStartNumber}
              disabled={String(newStartNumber) !== '0' && String(newStartNumber) !== ''}
            />
          )}
        />

        <Controller
          name="riderRegisteredInRace.lastName"
          control={control}
          render={({ field }) => (
            <Select
              state={field.value}
              setState={field.onChange}
              name={'riderLastName'}
              id={'riderLastNameRegisteredRider'}
              label="Фамилия:*"
              options={optionsRiderName}
            />
          )}
        />
      </div>
    </Wrapper>
  );
}
