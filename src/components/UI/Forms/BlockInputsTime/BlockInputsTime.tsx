import { SubmitHandler, useForm } from 'react-hook-form';

import styles from './BlockInputsTime.module.css';
import BoxInput from '../../BoxInput/BoxInput';

type TFormTime = {
  time: { hours: number; minutes: number; seconds: number; milliseconds: number };
};
type Props = {};

/**
 * Форма для ввода времени с полями для каждой части времени (чч,мм,сс,млс).
 */
export default function FormTime({}: Props) {
  const {
    register, // Функция для регистрации поля формы.
    handleSubmit, // Функция для обработки отправки формы.
    control, // Объект контроля для работы с динамическими полями (например, с массивами полей).
    reset, // Функция для сброса формы до значений по умолчанию.
    watch, // Функция для наблюдения за изменениями значений полей формы.
    formState: { errors }, // Объект состояния формы, содержащий ошибки валидации.
  } = useForm<TFormTime>({
    mode: 'all', // Режим валидации: 'all' означает, что валидация будет происходить при каждом изменении любого из полей.
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<TFormTime> = async (dataFromForm) => {
    console.log(dataFromForm);
  };
  return (
    <block className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
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
    </block>
  );
}
