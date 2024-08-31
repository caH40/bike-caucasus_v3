import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';

import BoxInput from '../../../BoxInput/BoxInput';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { TFormResultRace } from '@/types/index.interface';
import { getFullName } from '@/libs/utils/text';
import { TRaceRegistrationDto } from '@/types/dto.types';
import Select from '@/components/UI/Select/Select';
import styles from './BlockInputsRegisteredRider.module.css';

type Props = {
  register: UseFormRegister<TFormResultRace>;
  errors: FieldErrors<TFormResultRace>;
  control: Control<TFormResultRace>;
  registeredRiders: TRaceRegistrationDto[];
};

/**
 * Форма для ввода времени с полями для каждой части времени (чч,мм,сс,млс).
 */
export default function BlockInputsRegisteredRider({
  registeredRiders,
  register,
  control,
  errors,
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
    translation: getFullName(elm.rider),
    name: getFullName(elm.rider),
  }));

  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={3} title="Зарегистрированный участник" />

      <div className={styles.wrapper__rider}>
        <div className={styles.box__startNumber}>
          <Controller
            name="startNumber"
            control={control}
            rules={{
              required: 'Обязательное поле',
            }}
            render={({ field }) => (
              <Select
                state={field.value}
                setState={field.onChange}
                name={'startNumber'}
                label={'Номер'}
                options={optionsStartNumber}
              />
            )}
          />
        </div>

        <Controller
          name="fullName"
          control={control}
          rules={{
            required: 'Обязательное поле',
          }}
          render={({ field }) => (
            <Select
              state={field.value}
              setState={field.onChange}
              name={'fullName'}
              label="Участник заезда"
              options={optionsRiderName}
            />
          )}
        />

        <div className={styles.box__startNumber_new}>
          <BoxInput
            label={'Изм. №'}
            id="name"
            autoComplete="off"
            type="number"
            defaultValue={'0'}
            register={register('newStartNumber', {
              pattern: {
                value: /^([0-9]|[0-9][0-9]|[0-9][0-9][0-9]|[0-9][0-9][0-9][0-9])$/,
                message: '0-9999',
              },
            })}
            hideCheckmark={true}
          />
        </div>
      </div>

      <div className={styles.validate}>
        {errors.startNumber?.message && (
          <span>стартовый номер: {errors.startNumber?.message}, </span>
        )}
        {errors.fullName?.message && <span>участник: {errors.fullName?.message}, </span>}
        {errors.newStartNumber?.message && (
          <span>новый стартовый номер: {errors.newStartNumber?.message}, </span>
        )}
      </div>
    </div>
  );
}
