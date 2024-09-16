'use client';

import { useRef, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import cn from 'classnames';
import { useRouter } from 'next/navigation';

import { useLoadingStore } from '@/store/loading';
import { content, TextValidationService } from '@/libs/utils/text';
import { getDateTime } from '@/libs/utils/calendar';
import { championshipTypes } from '@/constants/championship';
import { bikeTypes } from '@/constants/trail';
import { serializationChampionship } from '@/libs/utils/serialization/championship';
import { formateAndStripContent, getRacesInit } from './utils';
import { useShowChampionshipForm } from '@/hooks/useShowChampionshipForm';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import BoxInput from '../../BoxInput/BoxInput';
import Button from '../../Button/Button';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import BoxSelectNew from '../../BoxSelect/BoxSelectNew';
import SelectCustom from '../../SelectCustom/SelectCustom';
import BlockRaceAdd from '../../BlockRaceAdd/BlockRaceAdd';
import type {
  ResponseServer,
  TFormChampionshipCreate,
  TOptions,
} from '@/types/index.interface';
import type { TDtoChampionship, TDtoOrganizer } from '@/types/dto.types';
import t from '@/locales/ru/moderation/championship.json';
import styles from '../Form.module.css';
import { formatCategoriesFields } from './categories-format';

type Props = {
  organizer: TDtoOrganizer;
  fetchChampionshipCreated?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  putChampionship?: (serializedFormData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  championshipForEdit?: TDtoChampionship;
  parentChampionships: { _id: string; name: string; availableStage: number[] }[];
};

/**
 * Форма создания/редактирования Чемпионата.
 */
export default function FromChampionship({
  organizer,
  fetchChampionshipCreated,
  putChampionship,
  championshipForEdit,
  parentChampionships,
}: Props) {
  const router = useRouter();

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const isEditing = !!championshipForEdit;

  // Постер Чемпионата существует при редактировании, url на изображение.
  const [posterUrl, setPosterUrl] = useState<string | null>(
    championshipForEdit ? championshipForEdit.posterUrl : null
  );
  // console.log(championshipForEdit);

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

  const initParentChampionship = parentChampionships.find(
    (elm) => elm._id === championshipForEdit?.parentChampionship?._id
  );

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormChampionshipCreate> = async (dataForm) => {
    const racesWithCategoriesFormatted = dataForm.races.map((race) => {
      const { categoriesAgeFemale, categoriesAgeMale } = formatCategoriesFields({
        categoriesAgeFemale: race.categoriesAgeFemale,
        categoriesAgeMale: race.categoriesAgeMale,
      });

      return { ...race, categoriesAgeFemale, categoriesAgeMale };
    });

    dataForm.races = racesWithCategoriesFormatted;

    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных перед отправкой на сервер.
    const championshipId = championshipForEdit?._id;
    const parentChampionshipId = dataForm.parentChampionship?._id;

    // Обработка текстов.
    const { nameStripedHtmlTags, descriptionFormatted } = formateAndStripContent({
      name: dataForm.name,
      description: dataForm.description,
    });

    // Если Серия или Тур, то убрать объект инициализации из races.
    if (isSeriesOrTourInForm) {
      dataForm.races = [];
    }

    const dataSerialized = serializationChampionship({
      dataForm: {
        ...dataForm,
        name: nameStripedHtmlTags,
        description: descriptionFormatted,
      },
      championshipId,
      parentChampionshipId,
      organizerId: organizer._id,
      isEditing,
      urlTracksForDel: urlTracksForDel.current,
    });

    // Отправка данных на сервер и получение ответа после завершения операции.
    const messageErr = t.errors.hasNotPropsFunction;
    let response = {
      data: null,
      ok: false,
      message: messageErr,
    };

    if (fetchChampionshipCreated) {
      response = await fetchChampionshipCreated(dataSerialized);
    } else if (putChampionship) {
      response = await putChampionship(dataSerialized);
    } else {
      return toast.error(messageErr);
    }

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      reset();
      toast.success(response.message);

      router.push('/moderation/championship/list');
    } else {
      toast.error(response.message);
    }
  };

  const textValidation = new TextValidationService();

  const validateDates = (startDate: string, endDate: string) => {
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      return t.validation.texts.endDate;
    }
    return true;
  };

  /**
   * Создание массива опция для SelectCustom выбора Родительского Чемпионата.
   */
  const createParentOptions = (): TOptions[] => {
    const options = parentChampionships.map((elm, index) => ({
      id: index,
      translation: elm.name,
      name: elm._id,
    }));

    return options;
  };

  /**
   * Создание массива Этапов.
   */
  const createStageNumbers = (): TOptions[] => {
    // В массиве Туров и Серий находим выбранный parentChampionship.
    // Если не найден такой Тур или Серия, это ошибка.
    const parentChampionship = parentChampionships.find(
      (elm) =>
        elm._id ===
        (watch('parentChampionship')?._id || championshipForEdit?.parentChampionship)
    );

    if (!parentChampionship) {
      return [];
    }

    const options = parentChampionship.availableStage.map((elm) => ({
      id: elm,
      translation: String(elm),
      name: String(elm),
    }));

    // Добавление текущего номера Этапа в Общий массив всех Свободных номеров Этапов в Серии или Туре.
    if (championshipForEdit?.stage) {
      options.push({
        id: championshipForEdit?.stage,
        translation: String(championshipForEdit?.stage),
        name: String(championshipForEdit?.stage),
      });
      options.sort((a, b) => +a.name - +b.name);
    }

    return options;
  };

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
                    options={createParentOptions()}
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
            options={createStageNumbers()}
            defaultValue={championshipForEdit?.stage ? String(championshipForEdit.stage) : '1'}
            loading={isLoading}
            register={register('stage', {
              ...(!championshipForEdit ? { required: t.required } : {}),
            })}
            disabled={!createStageNumbers().length}
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
          // min={getDateTime(new Date()).isoDate}
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
          defaultValue={
            championshipForEdit ? championshipForEdit.endDate : getDateTime(new Date()).isoDate
          }
          loading={isLoading}
          register={register('endDate', {
            required: t.required,
            validate: (value) => validateDates(watch('startDate'), value),
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
