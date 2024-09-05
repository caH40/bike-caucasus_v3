import { Control, Controller } from 'react-hook-form';

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import Select from '@/components/UI/Select/Select';
import { TFormResultRace } from '@/types/index.interface';
import { TRaceRegistrationDto } from '@/types/dto.types';
import styles from './BlockSelectRegisteredRider.module.css';

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
  // Создание массива опций для селекта райдера;
  const optionsStartNumber = registeredRiders.map((elm) => ({
    id: elm.rider.id,
    translation: String(elm.startNumber),
    name: String(elm.startNumber),
  }));

  // Создание массива опций для селекта райдера;
  const optionsRiderName = registeredRiders.map((elm) => ({
    id: elm.rider.id,
    translation: elm.rider.lastName,
    name: elm.rider.lastName,
  }));

  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={3} title="Выбор зарегистрированного в Заезде райдера" />
      <div className={styles.wrapper__select}>
        <Controller
          name="riderRegisteredInRace.startNumber"
          control={control}
          rules={{
            required: 'обязательное поле',
          }}
          render={({ field }) => (
            <Select
              state={field.value}
              setState={field.onChange}
              name={'riderStartNumber'}
              label={'Стартовый номер:'}
              options={optionsStartNumber}
              disabled={String(newStartNumber) !== '0' && String(newStartNumber) !== ''}
            />
          )}
        />

        <Controller
          name="riderRegisteredInRace.lastName"
          control={control}
          rules={{
            required: 'обязательное поле',
          }}
          render={({ field }) => (
            <Select
              state={field.value}
              setState={field.onChange}
              name={'riderLastName'}
              label="Фамилия:*"
              options={optionsRiderName}
            />
          )}
        />
      </div>
    </div>
  );
}
