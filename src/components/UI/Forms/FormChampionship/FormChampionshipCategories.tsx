'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import { useSubmitChampionshipCategories } from './useSubmitChampionshipCategories';
import Button from '../../Button/Button';
import CategoriesSet from '@/components/CategoriesSet/CategoriesSet';
import t from '@/locales/ru/moderation/championship.json';
import styles from '../Form.module.css';

// types
import type {
  TCategoriesConfigsClient,
  TFormChampionshipCategoriesProps,
} from '@/types/index.interface';

/**
 * Форма редактирования категорий Чемпионата.
 */
export default function FormChampionshipCategories({
  organizerId,
  putCategories,
  categoriesConfigs,
  urlSlug,
  setIsFormDirty,
}: TFormChampionshipCategoriesProps) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  // console.log(categoriesConfigs);

  // Используем хук useForm из библиотеки react-hook-form для управления состоянием формы.
  const {
    register, // Функция для регистрации поля формы.
    handleSubmit, // Функция для обработки отправки формы.
    control, // Объект контроля для работы с динамическими полями (например, с массивами полей).
    watch, // Функция для наблюдения за изменениями значений полей формы.
    formState: { errors }, // Объект состояния формы, содержащий ошибки валидации.
  } = useForm<{ categories: TCategoriesConfigsClient[] }>({
    mode: 'all',
    defaultValues: {
      categories: categoriesConfigs,
    },
  });

  const {
    fields: categoriesFields,
    append: appendCategories,
    remove: removeCategories,
  } = useFieldArray({
    control,
    name: 'categories', // корневой массив
  });

  // Функция отправки формы редактирования категорий Чемпионата.
  const onSubmit = useSubmitChampionshipCategories({
    organizerId,
    putCategories,
    urlSlug,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {categoriesFields.map((field, categoriesIndex) => (
        <div className={styles.wrapper__block} key={categoriesIndex}>
          <CategoriesSet
            isDefault={field.name === 'Стандартный'}
            categories={field}
            register={register}
            appendCategories={appendCategories}
            removeCategories={removeCategories}
            control={control}
            errors={errors}
            categoriesIndex={categoriesIndex}
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
