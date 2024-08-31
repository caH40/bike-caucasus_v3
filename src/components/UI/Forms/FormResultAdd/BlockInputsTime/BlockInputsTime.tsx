import { FieldErrors, UseFormRegister } from 'react-hook-form';

import BoxInput from '../../../BoxInput/BoxInput';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { TFormResultRace } from '@/types/index.interface';
import styles from './BlockInputsTime.module.css';

type Props = {
  register: UseFormRegister<TFormResultRace>;
  errors: FieldErrors<TFormResultRace>;
};

/**
 * Форма для ввода времени с полями для каждой части времени (чч,мм,сс,млс).
 */
export default function BlockInputsTime({ register, errors }: Props) {
  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={3} title="Финишное время" />
      <div className={styles.wrapper__inputs}>
        <BoxInput
          label="часы"
          id="hours"
          autoComplete="off"
          type="number"
          register={register('time.hours', {
            pattern: {
              value: /^([0-9]|[1-9][0-9])$/,
              message: '0-99',
            },
          })}
          hideCheckmark={true}
        />

        <BoxInput
          label="минуты"
          id="minutes"
          autoComplete="off"
          type="number"
          register={register('time.minutes', {
            required: 'обязательное поле',
            pattern: {
              value: /^([0-9]|[1-5][0-9])$/,
              message: '0-59',
            },
          })}
          hideCheckmark={true}
        />

        <BoxInput
          label="секунды"
          id="seconds"
          autoComplete="off"
          type="number"
          register={register('time.seconds', {
            pattern: {
              value: /^([0-9]|[1-5][0-9])$/,
              message: '0-59',
            },
          })}
          hideCheckmark={true}
        />

        <BoxInput
          label="млсекунды"
          id="milliseconds"
          autoComplete="off"
          type="number"
          register={register('time.milliseconds', {
            pattern: {
              value: /^([0-9]|[0-9][0-9]|[0-9][0-9][0-9])$/,
              message: '0-999',
            },
          })}
          hideCheckmark={true}
        />
      </div>

      <div className={styles.validate}>
        {errors.time?.hours?.message && <span>часы: {errors.time?.hours?.message}, </span>}
        {errors.time?.minutes?.message && (
          <span>минуты: {errors.time?.minutes?.message}, </span>
        )}
        {errors.time?.seconds?.message && (
          <span>секунды: {errors.time?.seconds?.message}, </span>
        )}
        {errors.time?.milliseconds?.message && (
          <span>миллисекунды: {errors.time?.milliseconds?.message}, </span>
        )}
      </div>
    </div>
  );
}
