'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';

import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import { createOptionsRaces } from '@/app/championships/registration/[urlSlug]/utils';
import { useLoadingStore } from '@/store/loading';
import Button from '../../Button/Button';
import { registerForChampionship } from '@/actions/championship';
import { useRegistrationRace } from '@/store/registration-race';
import { useRegisteredRiders } from '@/hooks/useRegisteredRiders';
import BoxInput from '../../BoxInput/BoxInput';
import { TextValidationService } from '@/libs/utils/text';
import { TProfileForRegistration, TProfileKey } from '@/types/index.interface';
import { TRace } from '@/types/models.interface';
import styles from '../Form.module.css';
import { getDefaultValue, validateRequiredFields } from './utils';

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

      reset();
      toast.success(response.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

      {/* Блок ввода*/}
      <div className={styles.box__input}>
        <label className={styles.label} htmlFor="riderName">
          Имя участника (данные из аккаунта):*
        </label>
        <input
          name={'riderName'}
          value={getDefaultValue(profile.firstName, 'firstName')}
          className={styles.input}
          disabled={true}
        />
      </div>

      {/* Блок ввода*/}
      <div className={styles.box__input}>
        <label className={styles.label} htmlFor="riderName">
          Фамилия участника (данные из аккаунта):*
        </label>
        <input
          name={'riderName'}
          value={getDefaultValue(profile.lastName, 'lastName')}
          className={styles.input}
          disabled={true}
        />
      </div>

      {/* Блок ввода*/}
      <div className={styles.box__input}>
        <label className={styles.label} htmlFor="ageCategory">
          Возрастная категория (данные из аккаунта):*
        </label>
        <input
          name={'ageCategory'}
          value={getDefaultValue(profile.ageCategory, 'ageCategory')}
          className={styles.input}
          disabled={true}
        />
      </div>

      {/* Блок ввода*/}
      <div className={styles.box__input}>
        <label className={styles.label} htmlFor="gender">
          Пол (данные из аккаунта):*
        </label>
        <input
          name={'gender'}
          value={getDefaultValue(profile.gender, 'gender')}
          className={styles.input}
          disabled={true}
        />
      </div>

      {/* Блок ввода*/}
      <div className={styles.box__input}>
        <label className={styles.label} htmlFor="city">
          Город (данные из аккаунта):*
        </label>
        <input
          name={'city'}
          value={getDefaultValue(profile.city, 'city')}
          className={styles.input}
          disabled={true}
        />
      </div>

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Зарегистрироваться'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
