'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';

import Button from '../../Button/Button';

import t from '@/locales/ru/moderation/championship.json';
import styles from '../Form.module.css';

// types
import type {
  TCategoriesConfigsClient,
  TFormChampionshipCategoriesProps,
} from '@/types/index.interface';

import { useSubmitChampionshipCategories } from './useSubmitChampionshipCategories';
import BlockCategorySet from '../../BlockCategorySet/BlockCategorySet';
import BoxInput from '../../BoxInput/BoxInput';
import { TextValidationService } from '@/libs/utils/text';

import AddSquareButton from '../../Buttons/AddSquareButton';
import AddRemoveSquareButtonGroup from '../../../AddRemoveSquareButtonGroup/AddRemoveSquareButtonGroup';
import AddRemoveSquareButton from '../../Buttons/AddRemoveSquareButton';
import CategoriesSet from '@/components/CategoriesSet/CategoriesSet';
// import BlockCategorySet from '../../BlockCategorySet/BlockCategorySet';

const textValidation = new TextValidationService();

/**
 * Форма редактирования категорий Чемпионата.
 */
export default function FormChampionshipCategories({
  putCategories,
  categoriesConfigs,
  setIsFormDirty,
  championshipName,
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

  console.log(categoriesFields);

  // Функция отправки формы редактирования категорий Чемпионата.
  const onSubmit = useSubmitChampionshipCategories();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {categoriesFields.map((field, categoriesIndex) => (
        <div className={styles.wrapper__block} key={categoriesIndex}>
          <CategoriesSet
            isDefault={field.name === 'Стандартный'}
            appendCategories={appendCategories}
            removeCategories={removeCategories}
            control={control}
            categoriesIndex={categoriesIndex}
          />
        </div>
      ))}

      <div className={styles.wrapper__block}>
        {/* Кнопка отправки формы. */}
        <div className={styles.box__button}>
          <Button name={t.btn.save} theme="green" loading={isLoading} />
        </div>
      </div>
    </form>
  );
}
