'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import type { ResponseServer, TFormOChampionshipCreate } from '@/types/index.interface';
import { TDtoChampionship } from '@/types/dto.types';
import { TextValidationService } from '@/libs/utils/text';
import styles from '../Form.module.css';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import BoxInput from '../../BoxInput/BoxInput';
import Button from '../../Button/Button';
import { getDateTime } from '@/libs/utils/calendar';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import { championshipTypes } from '@/constants/championship';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import { bikeTypes } from '@/constants/trail';
import BlockUploadTrack from '../../BlockUploadTrack/BlockUploadTrack';

type Props = {
  fetchChampionshipCreated?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  fetchChampionshipEdited?: ({
    // eslint-disable-next-line no-unused-vars
    dataSerialized,
    // eslint-disable-next-line no-unused-vars
    organizerId,
  }: {
    dataSerialized: FormData;
    organizerId: string;
  }) => Promise<ResponseServer<any>>;
  championshipForEdit?: TDtoChampionship;
};

/**
 * Форма создания/редактирования Чемпионата.
 */
export default function FromChampionship({
  // fetchChampionshipCreated,
  // fetchChampionshipEdited,
  championshipForEdit,
}: Props) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Постер Чемпионата существует при редактировании, url на изображение.
  const [posterUrl, setPosterUrl] = useState<string | null>(
    championshipForEdit ? championshipForEdit.posterUrl : null
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<TFormOChampionshipCreate>({ mode: 'all' });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormOChampionshipCreate> = async (dataForm) => {
    console.log(dataForm);
  };

  const textValidation = new TextValidationService();

  const validateDates = (startDate: string, endDate: string) => {
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      return 'Дата завершения не может быть меньше даты старта';
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок ввода Названия */}
      <BoxInput
        label="Название должно быть уникальным:*"
        id="name"
        autoComplete="off"
        type="text"
        defaultValue={championshipForEdit ? championshipForEdit.name : ''}
        loading={isLoading}
        register={register('name', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 3, message: 'Название должно быть больше 2х символов' },
          maxLength: {
            value: 35,
            message: 'Название не может быть больше 35 символов',
          },
          validate: textValidation.spaces,
        })}
        validationText={errors.name ? errors.name.message : ''}
      />

      {/* Блок ввода Описания */}
      <BoxTextarea
        label="Описание:*"
        id="description"
        autoComplete="off"
        type="text"
        defaultValue={championshipForEdit ? championshipForEdit.description : ''}
        loading={isLoading}
        register={register('description', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 25, message: 'В описании должно быть больше 25х символов' },
          maxLength: {
            value: 500,
            message: 'В описании не может быть больше 500 символов',
          },
          validate: textValidation.spaces,
        })}
        validationText={errors.description ? errors.description.message : ''}
      />

      {/* Блок ввода Даты старта */}
      <BoxInput
        label="Дата старта:*"
        id="startDate"
        autoComplete="off"
        type="date"
        defaultValue={
          championshipForEdit ? championshipForEdit.startDate : getDateTime(new Date()).isoDate
        }
        loading={isLoading}
        register={register('startDate', {
          required: 'Это обязательное поле для заполнения',
        })}
        validationText={errors.startDate ? errors.startDate.message : ''}
      />

      {/* Блок ввода Даты старта */}
      <BoxInput
        label="Дата завершения (последнего этапа):*"
        id="endDate"
        autoComplete="off"
        type="date"
        defaultValue={
          championshipForEdit ? championshipForEdit.endDate : getDateTime(new Date()).isoDate
        }
        loading={isLoading}
        register={register('endDate', {
          required: 'Это обязательное поле для заполнения',
          validate: (value) => validateDates(watch('startDate'), value),
        })}
        validationText={errors.endDate ? errors.endDate.message : ''}
      />

      {/* Блок загрузки Главного изображения (обложки) */}
      <Controller
        name="posterFile"
        control={control}
        defaultValue={null}
        rules={{ required: 'Файл изображения обязателен' }}
        render={({ field }) => (
          <BlockUploadImage
            title={'Главное изображение (обложка):*'}
            poster={field.value}
            setPoster={field.onChange}
            posterUrl={posterUrl}
            setPosterUrl={setPosterUrl}
            validationText={errors.posterFile?.message ? errors.posterFile.message : ''}
          />
        )}
      />

      {/* Блок выбора типа Чемпионата */}
      <BoxSelectNew
        label="Тип Чемпионата:*"
        id="championshipType"
        options={championshipTypes}
        defaultValue={championshipForEdit ? championshipForEdit.championshipType : 'single'}
        loading={isLoading}
        register={register('championshipType', {
          required: 'Это обязательное поле для заполнения',
        })}
        validationText={errors.championshipType ? errors.championshipType.message : ''}
      />

      {/* Блок выбора типа Велосипеда на котором проводится Заезд */}
      <BoxSelectNew
        label="Тип используемого велосипеда:*"
        id="bikeType"
        options={bikeTypes}
        defaultValue={championshipForEdit ? championshipForEdit.bikeType : 'road'}
        loading={isLoading}
        register={register('bikeType', {
          required: 'Это обязательное поле для заполнения',
        })}
        validationText={errors.bikeType ? errors.bikeType.message : ''}
      />

      {/* Блок загрузки GPX трэка*/}
      <Controller
        name="trackGPXUrl"
        control={control}
        defaultValue={null}
        rules={{ required: 'Файл трека обязателен' }}
        render={({ field }) => (
          <BlockUploadTrack
            title={'Трэк заезда:'}
            setTrack={field.onChange}
            isLoading={isLoading}
            resetData={false}
            isEditing={!!championshipForEdit}
            validationText={errors.trackGPXUrl?.message ? errors.trackGPXUrl.message : ''}
          />
        )}
      />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button
          name={championshipForEdit ? 'Обновить' : 'Добавить'}
          theme="green"
          loading={isLoading}
        />
      </div>
    </form>
  );
}
