'use client';

import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import { useShowChampionshipForm } from '@/hooks/useShowChampionshipForm';
import { useSubmitChampionshipMain } from './useSubmitChampionshipMain';
import { content, TextValidationService } from '@/libs/utils/text';
import { getDateTime } from '@/libs/utils/calendar';
import { championshipTypes } from '@/constants/championship';
import { bikeTypes } from '@/constants/trail';
import { createParentOptions, createStageNumbers } from './utils';
import { validateEndDateNotBeforeStartDate } from '@/libs/utils/date';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import BoxInput from '../../BoxInput/BoxInput';
import Button from '../../Button/Button';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import SelectCustom from '../../SelectCustom/SelectCustom';
import t from '@/locales/ru/moderation/championship.json';
import styles from '../Form.module.css';

// types
import type { TFormChampionshipCreate, TFormChampionshipProps } from '@/types/index.interface';
import useParentChampionshipDates from '@/hooks/useParentChampionshipDates';

import BlockGC from '../../BlockGC/BlockGC';
import CheckboxRounded from '../../CheckboxRounded/CheckboxRounded';

/**
 * Форма создания/редактирования Чемпионата.
 */
export default function FormChampionshipMain({
  organizer,
  championshipForEdit,
  parentChampionships,
  setIsFormDirty,
  racePointsTables,
}: TFormChampionshipProps) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  // console.log(championshipForEdit);

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
      awardedProtocols: championshipForEdit
        ? championshipForEdit.awardedProtocols
        : { category: true, absolute: false, absoluteGender: false },
      isCountedStageInGC: championshipForEdit ? championshipForEdit.isCountedStageInGC : true,
      requiredStage: championshipForEdit ? championshipForEdit.requiredStage : false,
      type: championshipForEdit ? championshipForEdit.type : 'single',
      racePointsTable: championshipForEdit?.racePointsTable?._id
        ? championshipForEdit.racePointsTable?._id
        : '',
      startNumbers: championshipForEdit?.startNumbers
        ? championshipForEdit.startNumbers
        : { start: 1, end: 100 },
    },
  });

  // Контроль были ли внесены изменения в форму или нет.
  // useEffect(() => {
  //   setIsFormDirty?.(isDirty);
  // }, [isDirty, setIsFormDirty]);

  // Получения дат старта и финиша родительского чемпионата, если создаются этапы для него.
  const parentId = watch('parentChampionship._id');
  const championshipType = watch('type'); // Получаем значение типа
  const parentChampDates = useParentChampionshipDates(
    parentChampionships,
    parentId,
    championshipType
  );

  const urlTracksForDel = useRef<string[]>([]);

  // Отображения блоков в зависимости от использования формы и вводимых значений.
  const { showQuantityStage, showNumberStage } = useShowChampionshipForm({
    typeInInput: championshipType,
    typeInDB: championshipForEdit?.type,
    isCreatingForm: !championshipForEdit,
  });

  // Функция отправки формы создания/редактирования Чемпионата.
  const onSubmit = useSubmitChampionshipMain({
    championshipForEdit,
    organizerId: organizer._id,
    urlTracksForDel,
    reset,
    setIsFormDirty,
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

        {watch('type') === 'stage' && (
          <>
            <Controller
              name="isCountedStageInGC"
              control={control}
              render={({ field }) => {
                return (
                  <CheckboxRounded
                    id="requiredStage"
                    label="Учитывать результаты этапа в генеральной классификации"
                    value={field.value ?? false}
                    setValue={field.onChange}
                    functional={false}
                  />
                );
              }}
            />

            <Controller
              name="requiredStage"
              control={control}
              render={({ field }) => {
                return (
                  <CheckboxRounded
                    id="requiredStage"
                    label="Обязательный этап для участия в генеральной классификации"
                    value={field.value ?? false}
                    setValue={field.onChange}
                    functional={false}
                  />
                );
              }}
            />
          </>
        )}

        {/* Блок выбора номера Этапа */}
        {showNumberStage && (
          <BoxSelectNew
            label={t.labels.stage}
            id="stageOrder"
            options={stageNumbers}
            defaultValue={
              championshipForEdit?.stageOrder ? String(championshipForEdit.stageOrder) : '1'
            }
            loading={isLoading}
            register={register('stageOrder', {
              ...(!championshipForEdit ? { required: t.required } : {}),
            })}
            disabled={!stageNumbers.length}
            validationText={errors.stageOrder ? errors.stageOrder.message : ''}
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
              value: 100,
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

        {/* не отображать для Серии и Тура. Будет устанавливаться в каждом этапе */}
        {!showQuantityStage && (
          <>
            {/* Блок ввода начала диапазона стартовых номеров */}
            <BoxInput
              label={t.labels.startNumbersStart}
              id="startNumbers-start"
              autoComplete="off"
              step={1}
              min={1}
              type="number"
              loading={isLoading}
              register={register('startNumbers.start', {
                required: t.required,
              })}
              validationText={errors.startNumbers?.start?.message || ''}
            />

            {/* Блок ввода конца диапазона стартовых номеров */}
            <BoxInput
              label={t.labels.startNumbersEnd}
              id="startNumbers-end"
              autoComplete="off"
              step={1}
              min={2}
              type="number"
              loading={isLoading}
              register={register('startNumbers.end', {
                required: t.required,
                validate: (endValue) => {
                  const start = watch('startNumbers.start');
                  if (Number(endValue) <= Number(start)) {
                    return 'Конечное число должно быть больше начального';
                  }
                  return true;
                },
              })}
              validationText={errors.startNumbers?.end?.message || ''}
            />
          </>
        )}
      </div>

      {showQuantityStage && (
        <div className={styles.wrapper__block}>
          <BlockGC
            championshipForEdit={championshipForEdit}
            control={control}
            errors={errors}
            register={register}
            championshipType={championshipType}
            racePointsTables={racePointsTables}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button
          name={championshipForEdit ? t.btn.save : t.btn.add}
          theme="green"
          loading={isLoading}
        />
      </div>
    </form>
  );
}
