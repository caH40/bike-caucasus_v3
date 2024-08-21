'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { TRace } from '@/types/models.interface';
import { SubmitHandler, useForm } from 'react-hook-form';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import { createOptionsRaces } from '@/app/championships/registration/[champName]/utils';
import { useLoadingStore } from '@/store/loading';
import Button from '../../Button/Button';
import styles from '../Form.module.css';
import { getRegisteredRiders, registerForChampionship } from '@/actions/championship';

type Props = {
  races: TRace[];
  championshipId: string;
};

type TFormRaceRegistration = {
  raceNumber: number;
  startNumber: number;
};

export default function FormRaceRegistration({ championshipId, races }: Props) {
  const [startNumbersFree, setStartNumbersFree] = useState();
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  console.log({ startNumbersFree });

  const {
    register, // Функция для регистрации поля формы.
    handleSubmit, // Функция для обработки отправки формы.
    reset, // Функция для сброса формы до значений по умолчанию.
    watch,
    formState: { errors }, // Объект состояния формы, содержащий ошибки валидации.
  } = useForm<TFormRaceRegistration>({ mode: 'all', defaultValues: {} });

  useEffect(() => {
    async function start() {
      const registeredRiders = await getRegisteredRiders({
        championshipId,
        raceNumber: watch('raceNumber'),
      });
      if (!registeredRiders.ok) {
        throw new Error(registeredRiders.message);
      } else if (!registeredRiders.data) {
        throw new Error('Данные зарегистрированных пользователей в Заезде не получены!');
      }
      console.log(registeredRiders);

      setStartNumbersFree(registeredRiders.data.map((rider) => rider.startNumber));
    }
    start();
  }, [watch('raceNumber'), championshipId]);

  const onSubmit: SubmitHandler<TFormRaceRegistration> = async (dataForm) => {
    setLoading(true);

    const response = await registerForChampionship({
      championshipId,
      raceNumber: dataForm.raceNumber,
      startNumber: 7,
      // startNumber: dataForm.startNumber,
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
        id="type"
        options={createOptionsRaces(races)}
        defaultValue={'1'}
        loading={isLoading}
        register={register('raceNumber', {
          required: 'Это обязательное поле для заполнения',
        })}
        validationText={errors.raceNumber?.message || ''}
      />

      <BoxSelectNew
        label="Выбор стартового номера:*"
        id="startNumber"
        options={createOptionsRaces(races)}
        defaultValue={undefined}
        loading={isLoading}
        register={register('startNumber', {
          required: 'Это обязательное поле для заполнения',
        })}
        validationText={errors.startNumber?.message || ''}
      />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={'Зарегистрироваться'} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
