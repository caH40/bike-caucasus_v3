'use client';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import { getCategoriesSelectOptions, getRacesInit } from './utils';
import { useSubmitChampionshipRaces } from './useSubmitChampionshipRaces';
import Button from '../../Button/Button';
import BlockRaceAdd from '../../BlockRaceAdd/BlockRaceAdd';
import t from '@/locales/ru/moderation/championship.json';
import styles from '../Form.module.css';

// types
import type { TFormChampionshipRacesProps, TRaceForFormNew } from '@/types/index.interface';
import { createDistanceOptions } from '@/libs/utils/championship/distance';

/**
 * Форма создания/редактирования заездов Чемпионата.
 */
export default function FormChampionshipRaces({
  organizerId,
  categoriesConfigs,
  races,
  urlSlug,
  setIsFormDirty,
  distances,
}: TFormChampionshipRacesProps) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  // Используем хук useForm из библиотеки react-hook-form для управления состоянием формы.
  const {
    register, // Функция для регистрации поля формы.
    handleSubmit, // Функция для обработки отправки формы.
    control, // Объект контроля для работы с динамическими полями (например, с массивами полей).
    reset, // Функция для сброса формы до значений по умолчанию.
    setValue,
    formState: { errors }, // Объект состояния формы, содержащий ошибки валидации.
  } = useForm<{ races: TRaceForFormNew[] }>({
    mode: 'all', // Режим валидации: 'all' означает, что валидация будет происходить при каждом изменении любого из полей.
    defaultValues: {
      races: getRacesInit(races),
    },
  });

  // Используем хук useFieldArray для работы с динамическими массивами полей в форме.
  const { fields, append, remove } = useFieldArray({
    control, // Передаем объект контроля, полученный из useForm, для управления динамическими полями.
    name: 'races', // Имя поля, которое соответствует массиву гонок в форме.
  });

  // Функция отправки формы создания/редактирования Чемпионата.
  const onSubmit = useSubmitChampionshipRaces({
    organizerId,
    setIsFormDirty,
    urlSlug,
  });

  // Обновление состояние формы при обновлении данных races из пропсов.
  // FIXME: необходимы тесты, могут быть баги при непредвиденном запуске reset.
  useEffect(() => {
    // При монтировании не обновлять
    if (races.length === 0) {
      return;
    }

    if (races) {
      reset({ races: getRacesInit(races) });
    }
  }, [races, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок добавления Race Заездов (Дистанций)*/}
      {/* Заезд (дистанция) необходим только для страницы Одиночного Чемпионата или Этапа.
       В Серии и туре только общее описание */}
      {fields.map((field, index) => (
        <div className={styles.wrapper__block} key={field.id}>
          <BlockRaceAdd
            race={field}
            races={fields}
            index={index}
            register={register}
            append={append}
            remove={remove}
            errors={errors}
            control={control}
            isLoading={isLoading}
            categories={getCategoriesSelectOptions(categoriesConfigs)}
            distanceOptions={createDistanceOptions(distances)}
            distances={distances}
            setValue={setValue}
          />
        </div>
      ))}

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name={t.btn.save} theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
