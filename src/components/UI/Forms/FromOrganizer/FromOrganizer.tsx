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
import { serializationOrganizer } from '@/libs/utils/serialization/organizer';
import { TextValidationService } from '@/libs/utils/text';
import type { ResponseServer, TFormOrganizerCreate } from '@/types/index.interface';
import type { TDtoOrganizer } from '@/types/dto.types';
import styles from '../Form.module.css';

type Props = {
  fetchOrganizerCreated?: (formData: FormData) => Promise<ResponseServer<any>>; // eslint-disable-line no-unused-vars
  fetchOrganizerEdited?: ({
    // eslint-disable-next-line no-unused-vars
    dataSerialized,
    // eslint-disable-next-line no-unused-vars
    organizerId,
  }: {
    dataSerialized: FormData;
    organizerId: string;
  }) => Promise<ResponseServer<any>>;
  organizerForEdit?: TDtoOrganizer;
};

const textValidation = new TextValidationService();

export default function FromOrganizer({
  fetchOrganizerCreated,
  fetchOrganizerEdited,
  organizerForEdit,
}: Props) {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Постер Организатора существует при редактировании, url на изображение.
  const [posterUrl, setPosterUrl] = useState<string | null>(
    organizerForEdit ? organizerForEdit.posterUrl : null
  );
  // Постер Организатора существует при редактировании, url на изображение.
  const [logoUrl, setLogoUrl] = useState<string | null>(
    organizerForEdit ? organizerForEdit.logoUrl : null
  );

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
    const isEditing = organizerForEdit ? true : false;
    const organizerId = organizerForEdit?._id;
    const posterUrl = organizerForEdit?.posterUrl;
    const logoUrl = organizerForEdit?.logoUrl;
    const dataSerialized = serializationOrganizer({
      dataForm,
      isEditing,
      organizerId,
      posterUrl,
      logoUrl,
    });

    // Отправка данных на сервер и получение ответа после завершения операции.
    const messageErr = 'Не передана ни функция обновления, ни создания маршрута!';
    let response = {
      data: null,
      ok: false,
      message: messageErr,
    };

    if (fetchOrganizerCreated) {
      response = await fetchOrganizerCreated(dataSerialized);
    } else if (fetchOrganizerEdited && organizerId) {
      response = await fetchOrganizerEdited({ dataSerialized, organizerId });
    } else {
      return toast.error(messageErr);
    }

    // Завершение отображение спинера загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      reset();
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form)}>
      {/* Блок ввода Названия */}
      <BoxInput
        label="Название должно быть уникальным:*"
        id="name"
        autoComplete="off"
        type="text"
        defaultValue={organizerForEdit ? organizerForEdit.name : ''}
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
        defaultValue={organizerForEdit ? organizerForEdit.description : ''}
        loading={isLoading}
        register={register('description', {
          required: 'Это обязательное поле для заполнения',
          minLength: { value: 25, message: 'В описании должно быть не меньше 25х символов' },
          maxLength: {
            value: 4000,
            message: 'В описании не может быть больше 4000 символов',
          },
          validate: textValidation.spaces,
        })}
        validationText={errors.description ? errors.description.message : ''}
      />

      {/* Блок ввода Электронной почты */}
      <BoxInput
        label="Электронная почта:*"
        id="contactInfoEmail"
        autoComplete="email"
        type="email"
        defaultValue={organizerForEdit ? organizerForEdit.contactInfo.email : ''}
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
        defaultValue={organizerForEdit ? organizerForEdit.contactInfo.phone : ''}
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

      {/* Блок загрузки Логотипа */}
      <Controller
        name="logoFile"
        control={control}
        defaultValue={null}
        rules={{ required: 'Файл изображения обязателен' }}
        render={({ field }) => (
          <BlockUploadImage
            title={'Логотип Организатора, желательно квадратный:*'}
            poster={field.value}
            setPoster={field.onChange}
            posterUrl={logoUrl}
            setPosterUrl={setLogoUrl}
            isSquare={true}
            validationText={errors.logoFile?.message ? errors.logoFile.message : ''}
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
        defaultValue={organizerForEdit ? organizerForEdit.contactInfo.website : ''}
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
        defaultValue={organizerForEdit ? organizerForEdit.contactInfo.socialMedia?.vk : ''}
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

      {/* Блок ввода контакт Организатора в Телеграм */}
      <BoxInput
        label="Контакт Организатора в Телеграм:"
        id="contactInfoTelegram"
        autoComplete="off"
        type="text"
        defaultValue={
          organizerForEdit ? organizerForEdit.contactInfo.socialMedia?.telegram : ''
        }
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

      {/* Блок ввода Группа/канал в Телеграм */}
      <BoxInput
        label="Группа/канал в Телеграм:"
        id="contactInfoTelegramGroup"
        autoComplete="off"
        type="text"
        defaultValue={
          organizerForEdit ? organizerForEdit.contactInfo.socialMedia?.telegramGroup : ''
        }
        loading={isLoading}
        register={register('contactInfo.socialMedia.telegramGroup', {
          maxLength: {
            value: 200,
            message: 'Не больше 200 символов',
          },
        })}
        validationText={
          errors.contactInfo?.socialMedia?.telegramGroup
            ? errors.contactInfo?.socialMedia?.telegramGroup.message
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
        defaultValue={organizerForEdit ? organizerForEdit.address.city : ''}
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
        defaultValue={organizerForEdit ? organizerForEdit.address.country : ''}
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
        defaultValue={organizerForEdit ? organizerForEdit.address.state : ''}
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

      {/* Кнопка отправки формы. */}
      <div className={styles.box__button}>
        <Button
          name={organizerForEdit ? 'Обновить' : 'Добавить'}
          theme="green"
          loading={isLoading}
        />
      </div>
    </form>
  );
}
