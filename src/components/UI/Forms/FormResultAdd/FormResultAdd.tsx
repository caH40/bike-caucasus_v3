import { useForm, Controller } from 'react-hook-form';

import BoxInput from '../../BoxInput/BoxInput';
import Select from '../../Select/Select';
import { useAddResultRace } from '@/hooks/useAddResultRace';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { TFormResultRace } from '@/types/index.interface';
import { getFullName } from '@/libs/utils/text';
import styles from './FormResultAdd.module.css';
import BlockInputsTime from '../../BlockInputsTime/BlockInputsTime';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

type Props = {
  registeredRiders: TRaceRegistrationDto[];
};

export default function FormResultAdd({ registeredRiders }: Props) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TFormResultRace>({
    mode: 'all',
    defaultValues: {
      startNumber: 0,
      fullName: '',
      newStartNumber: 0,
    },
  });

  const startNumber = watch('startNumber');
  const fullName = watch('fullName');

  // Синхронизация данных startNumber и fullName при их изменениях.
  useAddResultRace({ startNumber, registeredRiders, fullName, setValue });

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
    <form className={styles.wrapper}>
      <div>
        <TitleAndLine hSize={3} title="Зарегистрированный участник" />

        <div className={styles.block__rider}>
          <div className={styles.box__startNumber}>
            <Controller
              name="startNumber"
              control={control}
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
                maxLength: {
                  value: 5,
                  message: 'Максимум 5 цифр',
                },
              })}
              validationText={errors.newStartNumber?.message}
              hideCheckmark={true}
            />
          </div>
        </div>
      </div>

      <BlockInputsTime register={register} errors={errors} />
    </form>
  );
}
