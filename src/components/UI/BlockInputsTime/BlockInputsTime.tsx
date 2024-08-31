import styles from './BlockInputsTime.module.css';
import BoxInput from '../BoxInput/BoxInput';

type TFormTime = {
  time: { hours: number; minutes: number; seconds: number; milliseconds: number };
};
type Props = { register: any; errors: any };

/**
 * Форма для ввода времени с полями для каждой части времени (чч,мм,сс,млс).
 */
export default function FormTime({ register, errors }: Props) {
  return (
    <div className={styles.wrapper}>
      <BoxInput
        label="часы"
        id="hours"
        autoComplete="off"
        type="number"
        defaultValue={'0'}
        register={register('time.hours', {
          max: {
            value: 3,
            message: 'Максимум 3 цифры',
          },
        })}
        validationText={errors.time?.hours?.message}
        hideCheckmark={true}
      />
      <BoxInput
        label="минуты"
        id="minutes"
        autoComplete="off"
        type="number"
        defaultValue={'0'}
        register={register('time.minutes', {
          pattern: {
            value: /^([0-9]|[1-5][0-9])$/,
            message: 'Допустимое число 0-59',
          },
        })}
        validationText={errors.time?.minutes?.message}
        hideCheckmark={true}
      />
      <BoxInput
        label="секунды"
        id="seconds"
        autoComplete="off"
        type="number"
        defaultValue={'0'}
        register={register('time.seconds', {
          pattern: {
            value: /^([0-9]|[1-5][0-9])$/,
            message: 'Допустимое число 0-59',
          },
        })}
        validationText={errors.time?.seconds?.message}
        hideCheckmark={true}
      />
      <BoxInput
        label="секунды"
        id="milliseconds"
        autoComplete="off"
        type="number"
        defaultValue={'000'}
        register={register('time.milliseconds', {
          max: {
            value: 3,
            message: 'Максимум 3 цифры',
          },
        })}
        validationText={errors.time?.milliseconds?.message}
        hideCheckmark={true}
      />
    </div>
  );
}
