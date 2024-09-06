import { FieldErrors, UseFormRegister } from 'react-hook-form';

import BoxInput from '../../../BoxInput/BoxInput';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { TFormResultRace } from '@/types/index.interface';
import styles from './BlockInputs.module.css';
import BoxSelectNew from '@/components/UI/BoxSelect/BoxSelectNew';
import { genderOptions } from '@/constants/other';

type Props = {
  register: UseFormRegister<TFormResultRace>;
  errors: FieldErrors<TFormResultRace>;
};

/**
 * Форма для ввода времени с полями для каждой части времени (чч,мм,сс,млс).
 */
export default function BlockInputsRegisteredRider({ register, errors }: Props) {
  return (
    <div className={styles.wrapper}>
      <TitleAndLine hSize={3} title="Данные участника" />

      <div className={styles.wrapper__inputs}>
        <div className={styles.wrapper__hor}>
          <BoxInput
            label={'Фамилия:*'}
            id="riderLastName"
            autoComplete="off"
            type="text"
            defaultValue={''}
            register={register('rider.lastName', {
              required: 'заполните',
              minLength: { value: 2, message: '> 1' },
              maxLength: { value: 25, message: '< 25' },
            })}
            validationText={errors.rider?.lastName?.message}
            hideCheckmark={true}
          />

          <BoxInput
            label={'Имя:*'}
            id="riderFirstName"
            autoComplete="off"
            type="text"
            defaultValue={''}
            register={register('rider.firstName', {
              required: 'заполните',
              minLength: { value: 2, message: '> 1' },
              maxLength: { value: 20, message: '< 20' },
            })}
            validationText={errors.rider?.firstName?.message}
            hideCheckmark={true}
          />

          <BoxInput
            label={'Отчество:'}
            id="riderPatronymic"
            autoComplete="off"
            type="text"
            defaultValue={''}
            register={register('rider.patronymic', {})}
            hideCheckmark={true}
          />
        </div>

        <BoxInput
          label={'Новый стартовый номер:'}
          id="newStartNumber"
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

        <div className={styles.wrapper__hor}>
          <BoxSelectNew
            label="Пол:*"
            id="gender"
            defaultValue={'мужской'}
            // loading={loading}
            options={genderOptions}
            register={register('rider.gender')}
            validationText={errors.rider?.gender?.message}
            hideCheckmark={true}
          />

          <BoxInput
            label="Год рождения:*"
            id="birthday"
            autoComplete="off"
            type="number"
            // loading={loading}
            register={register('rider.yearBirthday', {
              required: 'заполните',
              pattern: {
                value: /^([1-2][0-1,9][0-9][0-9])$/,
                message: 'YYYY',
              },
            })}
            validationText={errors.rider?.yearBirthday?.message}
            hideCheckmark={true}
          />
        </div>
        <div className={styles.wrapper__hor}>
          <BoxInput
            label="Город:*"
            id="city"
            autoComplete="offered"
            type="text"
            defaultValue={''}
            // loading={loading}
            register={register('rider.city', {
              required: 'заполните',
              minLength: { value: 2, message: '> 1' },
              maxLength: { value: 30, message: '< 30' },
            })}
            validationText={errors.rider?.city?.message}
            hideCheckmark={true}
          />

          <BoxInput
            label="Команда:"
            id="team"
            autoComplete="offered"
            type="text"
            defaultValue={''}
            // loading={loading}
            register={register('rider.team', {
              minLength: { value: 2, message: '> 1' },
              maxLength: { value: 30, message: '< 30' },
            })}
            validationText={errors.rider?.team?.message}
            hideCheckmark={true}
          />
        </div>
      </div>
    </div>
  );
}
