'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import cn from 'classnames';

import { ResponseServer, TFormCalendar, TOptions } from '@/types/index.interface';
import { useLoadingStore } from '@/store/loading';
import { TNewsGetOneDto } from '@/types/dto.types';
import { handlerDateForm } from '@/libs/utils/date';
import Button from '../../Button/Button';
import SelectCustom from '../../SelectCustom/SelectCustom';
import BoxInput from '../../BoxInput/BoxInput';
import styles from '../Form.module.css';
import { serializationCalendarCreate } from '@/libs/utils/serialization/calendar';
import { bikeTypes as optionsBikeTypes } from '@/constants/trail';

type Props = {
  // eslint-disable-next-line no-unused-vars
  fetchTrailCreated: (formData: FormData) => Promise<ResponseServer<null>>;
  news:
    | {
        news: TNewsGetOneDto[];
        currentPage: number;
        quantityPages: number;
      }
    | null
    | undefined;
};

/**
 * Форма добавления событий в Календарь на основе новостей.
 */
export default function FormCalendar({ fetchTrailCreated, news }: Props) {
  // Сообщение об отсутствии новостей для формирования событий.
  if (!news) {
    toast.error('Не получены новости, для формирования событий Календаря');
  }

  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TFormCalendar>({ mode: 'all' });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormCalendar> = async (dataForm) => {
    // Старт отображение спинера загрузки.
    setLoading(true);

    // Сериализация данных перед отправкой на сервер.
    const dataSerialized = serializationCalendarCreate(dataForm);

    // Отправка данных на сервер и получение ответа после завершения операции.
    const res = await fetchTrailCreated(dataSerialized);

    // Завершение отображение спинера загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (res.ok) {
      reset();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  // Создание массива опция для SelectCustom выбора новости для События.
  const createOptions = (news: TNewsGetOneDto[]): TOptions[] => {
    const options = news.map((newsOne, index) => ({
      id: index,
      translation: newsOne.title,
      name: newsOne.urlSlug,
    }));

    return options;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок ввода Названия */}
      <BoxInput
        label="Название события (не больше 10 символов):*"
        id="title"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('title', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 2, message: 'Название события должно быть больше 1х символа' },
          maxLength: {
            value: 15,
            message: 'Название события не может быть больше 15 символов',
          },
        })}
        validationText={errors.title ? errors.title.message : ''}
      />

      {/* Блок ввода даты старта */}
      <BoxInput
        label="Дата старта События:*"
        id="date"
        autoComplete="off"
        type="date"
        min="2024-06-01"
        max="2029-01-01"
        defaultValue={handlerDateForm.getFormDate(new Date())}
        loading={isLoading}
        register={register('date', {
          required: true,
          pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
        })}
        validationText={errors.date && 'Введите корректную дату'}
      />

      {/* Блок выбора новости Анонса события, для прикрепления url новости к Событию в календаре */}
      <div className={styles.full__width}>
        <Controller
          name="urlSlug"
          control={control}
          defaultValue=""
          rules={{ required: 'Обязательно к заполнению' }}
          render={({ field }) => (
            <SelectCustom
              state={field.value}
              setState={field.onChange}
              options={createOptions(news ? news.news : [])}
              label="Выберите новость анонса события:*"
              defaultValue="нет фильтров"
              validationText={errors.urlSlug && errors.urlSlug.message}
            />
          )}
        />
      </div>

      {/* Блок выбора новости Анонса события, для прикрепления url новости к Событию в календаре */}
      <div className={styles.full__width}>
        <Controller
          name="bikeType"
          control={control}
          defaultValue=""
          rules={{ required: 'Обязательно к заполнению' }}
          render={({ field }) => (
            <SelectCustom
              state={field.value}
              setState={field.onChange}
              options={optionsBikeTypes}
              label="Выберите тип велосипеда:*"
              defaultValue="нет фильтров"
              validationText={errors.bikeType && errors.bikeType.message}
            />
          )}
        />
      </div>

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name="Добавить" theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
