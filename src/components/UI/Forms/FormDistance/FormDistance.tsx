'use client';

import { Controller, useForm } from 'react-hook-form';

import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import Button from '../../Button/Button';
import t from '@/locales/ru/moderation/championship.json';
import styles from '../Form.module.css';

// types
import type {
  TContainerDistanceFormsProps,
  TFormDistanceCreate,
} from '@/types/index.interface';
import BoxInput from '../../BoxInput/BoxInput';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import { distanceSurfaceTypes } from '@/constants/championship';
import { TextValidationService } from '@/libs/utils/text';
import BlockUploadTrack from '../../BlockUploadTrack/BlockUploadTrack';
import { useSubmitDistance } from './useSubmitDistance';

const textValidation = new TextValidationService();

/**
 * Форма создания дистанций для заездов чемпионата.
 */
export default function FormDistance({ postDistance }: TContainerDistanceFormsProps) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  // console.log(championshipForEdit);

  // Используем хук useForm из библиотеки react-hook-form для управления состоянием формы.
  const {
    register, // Функция для регистрации поля формы.
    handleSubmit, // Функция для обработки отправки формы.
    control, // Объект контроля для работы с динамическими полями (например, с массивами полей).
    reset, // Функция для сброса формы до значений по умолчанию.
    formState: { errors }, // Объект состояния формы, содержащий ошибки валидации.
  } = useForm<TFormDistanceCreate>({
    mode: 'all', // Режим валидации: 'all' означает, что валидация будет происходить при каждом изменении любого из полей.
    defaultValues: {
      surfaceType: 'road',
    },
  });

  const onSubmit = useSubmitDistance({ postDistance });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      <div className={styles.wrapper__block}>
        {/* Блок ввода Названия */}
        <BoxInput
          label={t.labels.nameChampionship}
          id="name"
          autoComplete="off"
          type="text"
          loading={isLoading}
          register={register('name', {
            required: t.required,
            minLength: { value: 3, message: 'Минимум 3 символа' },
            maxLength: {
              value: 100,
              message: 'Максимум 100 символов',
            },
            validate: textValidation.spaces,
          })}
          validationText={errors.name?.message || ''}
        />

        {/* Блок ввода Описания */}
        <BoxTextarea
          label={'Краткое описание дистанции'}
          id="description"
          autoComplete="off"
          type="text"
          loading={isLoading}
          register={register('description', {
            required: t.required,
            minLength: { value: 25, message: 'Минимум 25 символов' },
            maxLength: {
              value: 150,
              message: 'Максимум 150 символов',
            },
          })}
          validationText={errors.description?.message || ''}
        />

        {/* Блок выбора типа дорожного покрытия */}
        <BoxSelectNew
          label={'Выберите тип дорожного покрытия'}
          id="type-BoxSelectNew"
          options={distanceSurfaceTypes}
          loading={isLoading}
          register={register('surfaceType')}
          validationText={errors.surfaceType?.message || ''}
        />

        {/* Блок загрузки GPX трека*/}
        <Controller
          name={`trackGPXFile`}
          control={control}
          defaultValue={null}
          rules={{ required: t.trackGPXFile }}
          render={({ field }) => (
            <BlockUploadTrack
              title={t.labels.trackGPXFile}
              setTrack={field.onChange}
              isLoading={isLoading}
              resetData={false}
              isRequired={true}
              value={t.not}
              validationText={errors.trackGPXFile?.message || ''}
              tooltip={{ text: t.tooltips.track, id: 'track' }}
            />
          )}
        />

        {/* Кнопка отправки формы. */}
        <div className={styles.box__button}>
          <Button name={t.btn.add} theme="green" loading={isLoading} />
        </div>
      </div>
    </form>
  );
}
