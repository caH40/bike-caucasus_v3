'use client';

import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import cn from 'classnames';

import BoxInput from '../../BoxInput/BoxInput';
import Button from '../../Button/Button';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BlockUploadImage from '../../BlockUploadImage/BlockUploadImage';
import { optionsRegisterEmail } from '@/libs/utils/validatorService';
import { useLoadingStore } from '@/store/loading';
import { serializationOrganizerCreate } from '@/libs/utils/serialization/organizer';
import type { ResponseServer, TFormOrganizerCreate } from '@/types/index.interface';
import type { TDtoOrganizer } from '@/types/dto.types';
import styles from '../Form.module.css';

type Props = {
  fetchOrganizerCreated?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  // fetchTrailEdited?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  organizerForEdit?: TDtoOrganizer;
};

export default function FromOrganizer({ fetchOrganizerCreated, organizerForEdit }: Props) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Постер Организатора в формате File.
  // const [poster, setPoster] = useState<File | null>(null);

  // Постер Организатора существует при редактировании, url на изображение.
  const [posterUrl, setPosterUrl] = useState<string | null>(
    organizerForEdit ? organizerForEdit.posterUrl : null
  );

  // Триггер очистки форм и Локального хранилища.
  const [resetData, setResetData] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TFormOrganizerCreate>({ mode: 'all' });

  // Обработка формы после нажатия кнопки "Отправить".
  const onSubmit: SubmitHandler<TFormOrganizerCreate> = async (dataForm) => {
    // Старт отображение спинера загрузки.
    setLoading(true);

    // Сериализация данных перед отправкой на сервер.
    const dataSerialized = serializationOrganizerCreate(dataForm);

    // Отправка данных на сервер и получение ответа после завершения операции.
    let res = {} as ResponseServer<null>;
    if (fetchOrganizerCreated) {
      res = await fetchOrganizerCreated(dataSerialized);
    } else {
      return toast.error('Нет функций отправки для создания или редактирования Организатора.');
    }

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок ввода Названия */}
      <BoxInput
        label="Название должно быть уникальным:*"
        id="title"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('name', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 3, message: 'Название должно быть больше 2х символов' },
          maxLength: {
            value: 25,
            message: 'Название не может быть больше 25 символов',
          },
        })}
        validationText={errors.name ? errors.name.message : ''}
      />

      {/* Блок ввода Названия */}
      <BoxTextarea
        label="Описание:*"
        id="title"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('description', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 25, message: 'В описании должно быть больше 25х символов' },
          maxLength: {
            value: 500,
            message: 'В описании не может быть больше 500 символов',
          },
        })}
        validationText={errors.description ? errors.description.message : ''}
      />

      {/* Блок ввода Электронной почты */}
      <BoxInput
        label="Электронная почта:*"
        id="contactInfoEmail"
        autoComplete="email"
        type="email"
        defaultValue={''}
        loading={isLoading}
        register={register('contactInfo.email', optionsRegisterEmail)}
        validationText={errors.contactInfo?.email ? errors.contactInfo?.email.message : ''}
      />

      {/* Блок ввода Контактного телефона */}
      <BoxInput
        label="Контактный телефон:"
        id="contactInfoPhone"
        autoComplete="off"
        type="tel"
        defaultValue={''}
        loading={isLoading}
        register={register('contactInfo.phone', {
          minLength: {
            value: 10,
            message: 'Номер телефона должен содержать минимум 10 цифр',
          },
          maxLength: {
            value: 15,
            message: 'Номер телефона не может содержать больше 15 цифр',
          },
          pattern: {
            value: /^[0-9]+$/,
            message: 'Номер телефона должен содержать только цифры',
          },
        })}
        validationText={errors.contactInfo?.phone ? errors.contactInfo?.phone.message : ''}
      />

      {/* Блок загрузки Главного изображения (обложки) */}
      <Controller
        name="posterFile"
        control={control}
        defaultValue={null}
        rules={{ required: 'Обязательно к заполнению' }}
        render={({ field }) => (
          <BlockUploadImage
            title={'Главное изображение (обложка):*'}
            poster={field.value}
            setPoster={field.onChange}
            resetData={resetData}
            posterUrl={posterUrl}
            setPosterUrl={setPosterUrl}
          />
        )}
      />

      {/* Блок загрузки Главного изображения (обложки) */}
      <Controller
        name="logoFile"
        control={control}
        defaultValue={null}
        rules={{ required: 'Обязательно к заполнению' }}
        render={({ field }) => (
          <BlockUploadImage
            title={'Логотип Организатора, желательно квадратный:*'}
            poster={field.value}
            setPoster={field.onChange}
            resetData={resetData}
            posterUrl={posterUrl}
            setPosterUrl={setPosterUrl}
            isSquare={true}
          />
        )}
      />

      <TitleAndLine title="Социальные сети" hSize={2} hideLine={true} />

      {/* Блок ввода Вебсайта */}
      <BoxInput
        label="Вебсайт:"
        id="contactInfoWebsite"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('contactInfo.website', {
          maxLength: {
            value: 200,
            message: 'Не больше 200 символов',
          },
        })}
        validationText={errors.contactInfo?.website ? errors.contactInfo?.website.message : ''}
      />

      {/* Блок ввода Страницы в VK */}
      <BoxInput
        label="Страница в VK:"
        id="contactInfoVk"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('contactInfo.socialMedia.vk', {
          maxLength: {
            value: 200,
            message: 'Не больше 200 символов',
          },
        })}
        validationText={
          errors.contactInfo?.socialMedia?.vk ? errors.contactInfo?.socialMedia?.vk.message : ''
        }
      />

      {/* Блок ввода Группа/канал в Телеграм */}
      <BoxInput
        label="Группа/канал в Телеграм:"
        id="contactInfoTelegram"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('contactInfo.socialMedia.telegram', {
          maxLength: {
            value: 200,
            message: 'Не больше 200 символов',
          },
        })}
        validationText={
          errors.contactInfo?.socialMedia?.telegram
            ? errors.contactInfo?.socialMedia?.telegram.message
            : ''
        }
      />

      <TitleAndLine title="Адрес" hSize={2} hideLine={true} />

      {/* Блок ввода Города */}
      <BoxInput
        label="Город:*"
        id="addressCity"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('address.city', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 2, message: 'Минимум 2х символа' },
          maxLength: {
            value: 20,
            message: 'Максимум 20 символов',
          },
        })}
        validationText={errors.address?.city ? errors.address?.city.message : ''}
      />

      {/* Блок ввода Страны */}
      <BoxInput
        label="Страна:"
        id="addressCountry"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('address.country', {
          minLength: { value: 3, message: 'Минимум 3х символа' },
          maxLength: {
            value: 20,
            message: 'Максимум 20 символов',
          },
        })}
        validationText={errors.address?.country ? errors.address?.country.message : ''}
      />

      {/* Блок ввода Области/края */}
      <BoxInput
        label="Область/край:"
        id="addressState"
        autoComplete="off"
        type="text"
        defaultValue={''}
        loading={isLoading}
        register={register('address.state', {
          minLength: { value: 3, message: 'Минимум 3х символа' },
          maxLength: {
            value: 30,
            message: 'Максимум 30 символов',
          },
        })}
        validationText={errors.address?.state ? errors.address?.state.message : ''}
      />

      {/* Блок ввода Почтового индекса */}
      <BoxInput
        label="Почтовый индекс:"
        id="addressPostalCode"
        autoComplete="off"
        type="number"
        defaultValue={''}
        loading={isLoading}
        register={register('address.postalCode', {
          pattern: {
            value: /^\d{6}$/, // Регулярное выражение для проверки ровно 6 цифр
            message: 'Почтовый индекс должен состоять ровно из 6 цифр',
          },
        })}
        validationText={errors.address?.postalCode ? errors.address?.postalCode.message : ''}
      />

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button name="Добавить" theme="green" loading={isLoading} />
      </div>
    </form>
  );
}
