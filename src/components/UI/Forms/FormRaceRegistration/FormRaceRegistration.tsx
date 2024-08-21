'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { TRace } from '@/types/models.interface';

import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import { createOptionsRaces } from '@/app/championships/registration/[champName]/utils';
import { useLoadingStore } from '@/store/loading';
import Button from '../../Button/Button';
import { registerForChampionship } from '@/actions/championship';
import { useRegistrationRace } from '@/store/registration-race';
import { useRegisteredRiders } from '@/hooks/useRegisteredRiders';
import BoxInput from '../../BoxInput/BoxInput';
import { TextValidationService } from '@/libs/utils/text';
import styles from '../Form.module.css';
import { useEffect } from 'react';

type Props = {
  races: TRace[];
  championshipId: string;
};

type TFormRaceRegistration = {
  raceNumber: number;
  startNumber: number;
  teamVariable: string;
};

const textValidation = new TextValidationService();

export default function FormRaceRegistration({ championshipId, races }: Props) {
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
    setLoading(true);
    console.log(dataForm);

    const response = await registerForChampionship({
      championshipId,
      raceNumber: +dataForm.raceNumber,
      startNumber: +dataForm.startNumber,
      teamVariable: dataForm.teamVariable,
    });

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      reset();
      toast.success(response.message);
    } else {
      toast.error(response.message);
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

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Зарегистрироваться'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
