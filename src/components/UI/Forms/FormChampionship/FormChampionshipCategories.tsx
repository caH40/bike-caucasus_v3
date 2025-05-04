'use client';

import { useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import { useShowChampionshipForm } from '@/hooks/useShowChampionshipForm';
import { useSubmitChampionship } from './useSubmitChampionship';
import { content, TextValidationService } from '@/libs/utils/text';
import { getDateTime } from '@/libs/utils/calendar';
import { championshipTypes } from '@/constants/championship';
import { bikeTypes } from '@/constants/trail';
import { createParentOptions, createStageNumbers, getRacesInit } from './utils';
import { validateEndDateNotBeforeStartDate } from '@/libs/utils/date';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import BoxInput from '../../BoxInput/BoxInput';
import Button from '../../Button/Button';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import SelectCustom from '../../SelectCustom/SelectCustom';
import BlockRaceAdd from '../../BlockRaceAdd/BlockRaceAdd';
import t from '@/locales/ru/moderation/championship.json';
import styles from '../Form.module.css';

// types
import type { TFormChampionshipCreate, TFormChampionshipProps } from '@/types/index.interface';
import useParentChampionshipDates from '@/hooks/useParentChampionshipDates';

/**
 * Форма редактирования категорий Чемпионата.
 */
export default function FormChampionshipCategories({
  organizer,
  fetchChampionshipCreated,
  putChampionship,
  championshipForEdit,
  parentChampionships,
}: TFormChampionshipProps) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  // console.log(parentChampionships);

  // Постер Чемпионата существует при редактировании, url на изображение.
  const [posterUrl, setPosterUrl] = useState<string | null>(
    championshipForEdit ? championshipForEdit.posterUrl : null
  );

  // Используем хук useForm из библиотеки react-hook-form для управления состоянием формы.
  const {
    register, // Функция для регистрации поля формы.
    handleSubmit, // Функция для обработки отправки формы.
    control, // Объект контроля для работы с динамическими полями (например, с массивами полей).
    reset, // Функция для сброса формы до значений по умолчанию.
    watch, // Функция для наблюдения за изменениями значений полей формы.
    formState: { errors }, // Объект состояния формы, содержащий ошибки валидации.
  } = useForm<TFormChampionshipCreate>({
    mode: 'all', // Режим валидации: 'all' означает, что валидация будет происходить при каждом изменении любого из полей.
    defaultValues: {
      races: getRacesInit(championshipForEdit?.races), // Начальное значение массива гонок, полученное из функции getRacesInit.
    },
  });

  // Получения дат старта и финиша родительского чемпионата, если создаются этапы для него.
  const parentId = watch('parentChampionship._id');
  const type = watch('type'); // Получаем значение типа
  const parentChampDates = useParentChampionshipDates(parentChampionships, parentId, type);

  // Используем хук useFieldArray для работы с динамическими массивами полей в форме.
  const { fields, append, remove } = useFieldArray({
    control, // Передаем объект контроля, полученный из useForm, для управления динамическими полями.
    name: 'races', // Имя поля, которое соответствует массиву гонок в форме.
  });

  const urlTracksForDel = useRef<string[]>([]);

  // Отображения блоков в зависимости от использования формы и вводимых значений.
  const { showTrackInput, showQuantityStage, showNumberStage, isSeriesOrTourInForm } =
    useShowChampionshipForm({
      typeInInput: watch('type'),
      typeInDB: championshipForEdit?.type,
      isCreatingForm: !championshipForEdit,
    });

  // Функция отправки формы создания/редактирования Чемпионата.
  const onSubmit = useSubmitChampionship({
    championshipForEdit,
    isSeriesOrTourInForm,
    organizerId: organizer._id,
    urlTracksForDel,
    fetchChampionshipCreated,
    putChampionship,
    reset,
  });

  const initParentChampionship = parentChampionships.find(
    (elm) => elm._id === championshipForEdit?.parentChampionship?._id
  );

  const textValidation = new TextValidationService();

  const stageNumbers = createStageNumbers(parentChampionships, watch, championshipForEdit);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      <div className={styles.wrapper__block}>
        {/* Блок ввода Названия */}
        <div className={styles.box__input}>
          <label className={styles.label} htmlFor="organizer">
            {t.labels.organizer}
          </label>
          <input
            name={'organizer'}
            value={organizer.name}
            className={styles.input}
            disabled={true}
          />
        </div>

        {/* Блок выбора типа Чемпионата. Выбирается при создании, при редактировании не доступен */}
        <BoxSelectNew
          label={t.labels.type}
          id="type-BoxSelectNew"
          options={championshipTypes}
          defaultValue={championshipForEdit ? championshipForEdit.type : 'single'}
          loading={isLoading}
          register={register('type', {
            ...(!championshipForEdit ? { required: t.required } : {}),
          })}
          disabled={!!championshipForEdit}
          validationText={errors.type ? errors.type.message : ''}
          tooltip={{ text: t.tooltips.typeChampionship, id: 'type' }}
        />

        {/* Блок установки количества Этапов в Серии или Туре*/}
        {showQuantityStage && (
          <BoxInput
            label={t.labels.quantityStages}
            id="quantityStages"
            autoComplete="off"
            type="number"
            min="1"
            step="1"
            defaultValue={
              championshipForEdit?.quantityStages
                ? String(championshipForEdit.quantityStages)
                : '2'
            }
            loading={isLoading}
            register={register('quantityStages', {
              required: t.required,
              min: { value: 2, message: t.min.quantityStages },
              max: {
                value: 30,
                message: t.max.quantityStages,
              },
            })}
            validationText={errors.quantityStages ? errors.quantityStages.message : ''}
          />
        )}

        {/* Выбор родительской страницы Чемпионата только когда это Одиночное соревнование или Этап*/}
        {watch('type') === 'stage' &&
          // Проверка на наличие созданных Туров или Серий у Организатора
          (!!parentChampionships?.length ? (
            <div className={styles.full__width}>
              <Controller
                name="parentChampionship._id"
                control={control}
                defaultValue={initParentChampionship?._id ? initParentChampionship._id : ''}
                rules={{
                  required: t.required,
                }}
                render={({ field }) => (
                  <SelectCustom
                    state={field.value}
                    setState={field.onChange}
                    options={createParentOptions(parentChampionships)}
                    label={t.labels.parentChampionshipId}
                    defaultValue={t.hasNotFilters}
                    validationText={
                      errors.parentChampionship?._id && errors.parentChampionship._id.message
                    }
                  />
                )}
              />
            </div>
          ) : (
            <h3 className={styles.error}>{t.needTourAndSeries}</h3>
          ))}

        {/* Блок выбора номера Этапа */}
        {showNumberStage && (
          <BoxSelectNew
            label={t.labels.stage}
            id="stage"
            options={stageNumbers}
            defaultValue={championshipForEdit?.stage ? String(championshipForEdit.stage) : '1'}
            loading={isLoading}
            register={register('stage', {
              ...(!championshipForEdit ? { required: t.required } : {}),
            })}
            disabled={!stageNumbers.length}
            validationText={errors.stage ? errors.stage.message : ''}
          />
        )}

        {/* Блок ввода Названия */}
        <BoxInput
          label={t.labels.nameChampionship}
          id="name"
          autoComplete="off"
          type="text"
          defaultValue={championshipForEdit ? championshipForEdit.name : ''}
          loading={isLoading}
          register={register('name', {
            required: t.required,
            minLength: { value: 3, message: t.min.nameChampionship },
            maxLength: {
              value: 50,
              message: t.max.nameChampionship,
            },
            validate: textValidation.spaces,
          })}
          validationText={errors.name ? errors.name.message : ''}
          tooltip={{ text: t.tooltips.nameChampionship, id: 'nameChampionship' }}
        />

        {/* Блок ввода Описания */}
        <BoxTextarea
          label={t.labels.descriptionChampionship}
          id="description"
          autoComplete="off"
          type="text"
          defaultValue={
            championshipForEdit
              ? content.formatTextForTextarea(championshipForEdit.description)
              : ''
          }
          loading={isLoading}
          register={register('description', {
            required: t.required,
            minLength: { value: 25, message: t.min.descriptionChampionship },
            maxLength: {
              value: 4000,
              message: t.max.descriptionChampionship,
            },
          })}
          validationText={errors.description ? errors.description.message : ''}
          tooltip={{ text: t.tooltips.descriptionChampionship, id: 'descriptionChampionship' }}
        />

        {/* Блок ввода Даты старта */}
        <BoxInput
          label={t.labels.startDate}
          id="startDate"
          autoComplete="off"
          type="date"
          min={parentChampDates && parentChampDates.startDate}
          max={parentChampDates && parentChampDates.endDate}
          defaultValue={
            championshipForEdit
              ? championshipForEdit.startDate
              : getDateTime(new Date()).isoDate
          }
          loading={isLoading}
          register={register('startDate', {
            required: t.required,
          })}
          validationText={errors.startDate ? errors.startDate.message : ''}
        />

        {/* Блок ввода Даты завершения Чемпионата/этапа */}
        <BoxInput
          label={t.labels.endDate}
          id="endDate"
          autoComplete="off"
          type="date"
          min={parentChampDates && parentChampDates.startDate}
          max={parentChampDates && parentChampDates.endDate}
          defaultValue={
            championshipForEdit ? championshipForEdit.endDate : getDateTime(new Date()).isoDate
          }
          loading={isLoading}
          register={register('endDate', {
            required: t.required,
            validate: (value) =>
              validateEndDateNotBeforeStartDate(
                watch('startDate'),
                value,
                t.validation.texts.endDate
              ),
          })}
          validationText={errors.endDate ? errors.endDate.message : ''}
        />

        {/* Блок загрузки Главного изображения (обложки) */}
        <Controller
          name="posterFile"
          control={control}
          defaultValue={null}
          // Если происходит редактирование, то Постер уже есть, поэтому не обязательно выбирать Постер.
          rules={!!championshipForEdit ? {} : { required: t.requiredPoster }}
          render={({ field }) => (
            <BlockUploadImage
              title={t.labels.posterFile}
              poster={field.value}
              setPoster={field.onChange}
              posterUrl={posterUrl}
              setPosterUrl={setPosterUrl}
              validationText={errors.posterFile?.message ? errors.posterFile.message : ''}
              tooltip={{ text: t.tooltips.poster, id: 'posterFile' }}
            />
          )}
        />

        {/* Блок выбора типа Велосипеда на котором проводится Заезд */}
        <BoxSelectNew
          label={t.labels.bikeType}
          id="bikeType-BoxSelectNew"
          options={bikeTypes}
          defaultValue={championshipForEdit ? championshipForEdit.bikeType : 'road'}
          loading={isLoading}
          register={register('bikeType', {
            required: t.required,
          })}
          validationText={errors.bikeType ? errors.bikeType.message : ''}
          tooltip={{ text: t.tooltips.bikeType, id: 'bikeType' }}
        />
      </div>

      {/* Блок добавления Race Заездов (Дистанций)*/}
      {/* Заезд (дистанция) необходим только для страницы Одиночного Чемпионата или Этапа.
       В Серии и туре только общее описание */}
      {showTrackInput &&
        fields.map((race, index) => (
          <div className={styles.wrapper__block} key={race.id}>
            <BlockRaceAdd
              race={race}
              races={fields}
              index={index}
              register={register}
              append={append}
              remove={remove}
              errors={errors}
              control={control}
              isLoading={isLoading}
              urlTracksForDel={urlTracksForDel}
            />
          </div>
        ))}

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button
          name={championshipForEdit ? t.btn.update : t.btn.add}
          theme="green"
          loading={isLoading}
        />
      </div>
    </form>
  );
}
