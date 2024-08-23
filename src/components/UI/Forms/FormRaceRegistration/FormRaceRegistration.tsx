'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';

import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import Button from '../../Button/Button';
import BoxInput from '../../BoxInput/BoxInput';
import { createOptionsRaces } from '@/app/championships/registration/[urlSlug]/utils';
import { useLoadingStore } from '@/store/loading';
import { registerForChampionship } from '@/actions/championship';
import { useRegistrationRace } from '@/store/registration-race';
import { useRegisteredRiders } from '@/hooks/useRegisteredRiders';
import { validateRequiredFields } from './utils';
import { TextValidationService } from '@/libs/utils/text';
import { TProfileForRegistration, TProfileKey } from '@/types/index.interface';
import { TRace } from '@/types/models.interface';
import styles from '../Form.module.css';
import BlockProfileRegRace from '@/components/BlockProfileRegRace/BlockProfileRegRace';

type Props = {
  races: TRace[];
  championshipId: string;
  profile: TProfileForRegistration;
};

type TFormRaceRegistration = {
  raceNumber: number;
  startNumber: number;
  teamVariable: string;
};

const textValidation = new TextValidationService();

export default function FormRaceRegistration({ championshipId, races, profile }: Props) {
  const toggleTrigger = useRegistrationRace((state) => state.toggleTrigger);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const selectOptions = useRegistrationRace((state) => state.selectOptions);
  const startNumberFree = useRegistrationRace((state) => state.startNumberFree);

  const {
    register, // Функция для регистрации поля формы.
    handleSubmit, // Функция для обработки отправки формы.
    reset, // Функция для сброса формы до значений по умолчанию.
    watch,
    setValue,
    formState: { errors }, // Объект состояния формы, содержащий ошибки валидации.
  } = useForm<TFormRaceRegistration>({
    mode: 'all',
    defaultValues: {
      raceNumber: 1,
      teamVariable: '',
    },
  });

  // Отслеживание изменения свойства raceNumber в форме.
  const raceNumber = watch('raceNumber');

  // Обновление массива свободных стартовых номеров.
  useEffect(() => {
    if (!startNumberFree) {
      toast.error('Закончились свободные стартовые номера!');
      return;
    }

    setValue('startNumber', startNumberFree);
  }, [startNumberFree, setValue]);

  // Установка данных зарегистрированных райдеров в сторе, и генерация свободны стартовых номеров;
  useRegisteredRiders(raceNumber, championshipId);

  const onSubmit: SubmitHandler<TFormRaceRegistration> = async (dataForm) => {
    try {
      const profileEntries = Object.entries(profile) as [TProfileKey, string | undefined][];

      for (const [key, value] of profileEntries) {
        const res = validateRequiredFields(value, key);

        if (!res.ok) {
          throw new Error(res.message);
        }
      }
      setLoading(true);
      toggleTrigger();
      const response = await registerForChampionship({
        championshipId,
        raceNumber: +dataForm.raceNumber,
        startNumber: +dataForm.startNumber,
        teamVariable: dataForm.teamVariable,
      });

      // Завершение отображение статуса загрузки.
      setLoading(false);

      // Отображение статуса сохранения События в БД.
      if (!response.ok) {
        throw new Error(response.message);
      }

      reset({ teamVariable: '' });
      toast.success(response.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form__registration}>
      <div className={styles.wrapper__inputs}>
        <BoxSelectNew
          label="Выбор заезда:*"
          id="raceNumber"
          options={createOptionsRaces(races)}
          loading={isLoading}
          register={register('raceNumber', {
            required: 'Это обязательное поле для заполнения',
          })}
          validationText={errors.raceNumber?.message || ''}
        />
        <BoxSelectNew
          label="Выбор стартового номера:*"
          id="startNumber"
          options={selectOptions}
          loading={isLoading}
          register={register('startNumber', {
            required: 'Это обязательное поле для заполнения',
          })}
          validationText={errors.startNumber?.message || ''}
        />
        <BoxInput
          label="Название команды:"
          id="teamVariable"
          autoComplete="off"
          type="text"
          loading={isLoading}
          register={register('teamVariable', {
            minLength: { value: 2, message: 'Не меньше 2х символов' },
            maxLength: {
              value: 30,
              message: 'Не больше 30 символов',
            },
            validate: textValidation.spaces,
          })}
          validationText={errors.teamVariable?.message || ''}
        />
      </div>

      {/* Блок отображения данных профиля для регистрации */}
      <BlockProfileRegRace profile={profile} />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button_registration}>
        <Button name={'Зарегистрироваться'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
