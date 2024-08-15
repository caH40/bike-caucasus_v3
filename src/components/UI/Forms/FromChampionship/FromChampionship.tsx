'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import cn from 'classnames';

import { useLoadingStore } from '@/store/loading';
import type {
  ResponseServer,
  TFormChampionshipCreate,
  TOptions,
} from '@/types/index.interface';
import { TDtoChampionship, TDtoOrganizer } from '@/types/dto.types';
import { content, TextValidationService } from '@/libs/utils/text';
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
import { serializationChampionship } from '@/libs/utils/serialization/championship';
import { useRouter } from 'next/navigation';
import { formateAndStripContent, shouldShowTrackInput } from './utils';
import SelectCustom from '../../SelectCustom/SelectCustom';

type Props = {
  organizer: TDtoOrganizer;
  fetchChampionshipCreated?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  putChampionship?: (serializedFormData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  championshipForEdit?: TDtoChampionship;
  parentChampionships: { _id: string; name: string }[];
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

  // Состояние, указывающее удалять или нет текущий трек.
  const [needDelTrack, setNeedDelTrack] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<TFormChampionshipCreate>({ mode: 'all' });

  // Условие отображения блока выбора родительского Чемпионата для серии.
  const showTrackInput = shouldShowTrackInput({
    typeInInput: watch('type'),
    typeInDB: championshipForEdit?.type,
    isCreatingForm: !championshipForEdit,
  });

  const initParentChampionshipId = parentChampionships.find(
    (elm) => elm._id === championshipForEdit?.parentChampionship
  )?._id;

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormChampionshipCreate> = async (dataForm) => {
    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных перед отправкой на сервер.
    const championshipId = championshipForEdit?._id;
    const parentChampionshipId = dataForm.parentChampionship?._id;

    const { nameStripedHtmlTags, descriptionStripedHtmlTags } = formateAndStripContent({
      name: dataForm.name,
      description: dataForm.description,
    });

    const dataSerialized = serializationChampionship({
      dataForm: {
        ...dataForm,
        name: nameStripedHtmlTags,
        description: descriptionStripedHtmlTags,
      },
      championshipId,
      parentChampionshipId,
      organizerId: organizer._id,
      needDelTrack,
      isEditing,
    });

    // Отправка данных на сервер и получение ответа после завершения операции.
    const messageErr = 'Не передана ни функция обновления, ни создания маршрута!';
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
      return 'Дата завершения не может быть меньше даты старта';
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок ввода Названия */}
      <div className={styles.box__input}>
        <label className={styles.label} htmlFor="organizer">
          Организатор Чемпионата:
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
        label="Тип Чемпионата:*"
        id="type"
        options={championshipTypes}
        defaultValue={championshipForEdit ? championshipForEdit.type : 'single'}
        loading={isLoading}
        register={
          !championshipForEdit
            ? register('type', {
                required: 'Это обязательное поле для заполнения',
              })
            : undefined
        }
        disabled={!!championshipForEdit}
        validationText={errors.type ? errors.type.message : ''}
      />

      {/* Выбор родительской страницы Чемпионата только когда это Одиночное соревнование или Этап*/}
      {watch('type') === 'stage' &&
        // Проверка на наличие созданных Туров или Серий у Организатора
        (!!parentChampionships?.length ? (
          <div className={styles.full__width}>
            <Controller
              name="parentChampionship._id"
              control={control}
              defaultValue={initParentChampionshipId ? initParentChampionshipId : ''}
              rules={{
                required: 'Обязательно к заполнению',
              }}
              render={({ field }) => (
                <SelectCustom
                  state={field.value}
                  setState={field.onChange}
                  options={createParentOptions()}
                  label="Выберите Родительский Чемпионат для Этапа:*"
                  defaultValue={'нет фильтров'}
                  validationText={
                    errors.parentChampionship?._id && errors.parentChampionship._id.message
                  }
                />
              )}
            />
          </div>
        ) : (
          <h3 className={styles.error}>
            Для этапа необходим родительский Чемпионат, сначала создайте Тур или Серию, а затем
            этапы к ним!
          </h3>
        ))}

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
            value: 50,
            message: 'Название не может быть больше 50 символов',
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
        defaultValue={
          championshipForEdit ? content.replaceBRtoCRLF(championshipForEdit.description) : ''
        }
        loading={isLoading}
        register={register('description', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 25, message: 'В описании должно быть больше 25х символов' },
          maxLength: {
            value: 4000,
            message: 'В описании не может быть больше 4000 символов',
          },
          // validate: textValidation.spaces,
        })}
        validationText={errors.description ? errors.description.message : ''}
      />

      {/* Блок ввода Даты старта */}
      <BoxInput
        label="Дата старта:*"
        id="startDate"
        autoComplete="off"
        type="date"
        min={getDateTime(new Date()).isoDate}
        defaultValue={
          championshipForEdit ? championshipForEdit.startDate : getDateTime(new Date()).isoDate
        }
        loading={isLoading}
        register={register('startDate', {
          required: 'Это обязательное поле для заполнения',
        })}
        validationText={errors.startDate ? errors.startDate.message : ''}
      />

      {/* Блок ввода Даты завершения Чемпионата/этапа */}
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
        // Если происходит редактирование, то Постер уже есть, поэтому не обязательно выбирать Постер.
        rules={!!championshipForEdit ? {} : { required: 'Файл изображения обязателен' }}
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

      {/* Блок загрузки GPX трека*/}
      {/* Трек необходим только для страницы Одиночного Чемпионата или этапа. В Серии и туре только общее описание */}
      {showTrackInput && (
        <Controller
          name="trackGPXFile"
          control={control}
          defaultValue={null}
          // rules={{ required: 'Файл трека обязателен' }}
          render={({ field }) => (
            <BlockUploadTrack
              title={'Трек заезда:'}
              setTrack={field.onChange}
              isLoading={isLoading}
              resetData={false}
              isRequired={false}
              value={
                championshipForEdit?.trackGPX?.url ? championshipForEdit.trackGPX?.url : 'нет'
              }
              validationText={errors.trackGPXFile?.message ? errors.trackGPXFile.message : ''}
              needDelTrack={needDelTrack}
              setNeedDelTrack={setNeedDelTrack}
            />
          )}
        />
      )}

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
