'use client';

import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'sonner';

import BoxInput from '../../BoxInput/BoxInput';
import BoxSelect from '../../BoxSelect/BoxSelect';
import FormWrapper from '../FormWrapper/FormWrapper';
import {
  validateBirthday,
  validateCity,
  validateFirstName,
  validateLastName,
  validatePatronymic,
} from '@/libs/utils/validatorService';

import Button from '../../Button/Button';
import InputFile from '../../InputFile/InputFile';
import { handlerDateForm } from '@/libs/utils/date';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import Checkbox from '../../Checkbox/Checkbox';
import type { IProfileForClient } from '@/types/fetch.interface';
import type { MessageServiceDB, TFormProfile } from '@/types/index.interface';
import styles from './FormProfile.module.css';

type Props = {
  formData: IProfileForClient;
  putProfile: (params: FormData) => Promise<MessageServiceDB<any>>; // eslint-disable-line
  idUser: string;
};

/**
 * Форма для изменения данных Пользователя в профиле
 */
export default function FormProfile({ formData, putProfile, idUser }: Props) {
  const [imageFromProvider, setImageFromProvider] = useState<boolean>(
    !!formData.imageFromProvider
  );
  const [file, setFile] = useState<File | null>(null);
  const [urlFile, setUrlFile] = useState<string | undefined>(formData.image);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormProfile>({ mode: 'all' });

  const onSubmit: SubmitHandler<TFormProfile> = async (dataForm) => {
    const dataToForm = new FormData();
    if (file) {
      dataToForm.set('image', file);
    }
    dataToForm.set('imageFromProvider', String(imageFromProvider));
    dataToForm.set('id', idUser);
    for (const key in dataForm) {
      if (dataForm.hasOwnProperty(key)) {
        dataToForm.set(key, dataForm[key]);
      }
    }

    const { ok, message } = await putProfile(dataToForm);

    if (ok) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const getPictures = (event: ChangeEvent<HTMLInputElement>) => {
    setImageFromProvider(false);
    const fileFromForm = event.target.files?.[0] || null;
    if (!fileFromForm) {
      return;
    }

    if (!fileFromForm.type.startsWith('image/')) {
      return toast.error('Выбранный файл не является изображением');
    }

    // если уже был url картинки, то убираем, что бы поместить новый url
    if (urlFile) {
      URL.revokeObjectURL(urlFile);
    }

    // создание временного url картинки в памяти для отображения в Image
    const url = URL.createObjectURL(fileFromForm);
    setUrlFile(url);
    setFile(fileFromForm);
  };

  return (
    <FormWrapper title="Профиль">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <section className={styles.block__image}>
          <Image
            width={100}
            height={100}
            alt="Image profile"
            src={
              (imageFromProvider ? formData.provider?.image : urlFile) ??
              '/images/icons/noimage.svg'
            }
            className={styles.profile__image}
          />

          <div className={styles.block__image__control}>
            <Checkbox
              value={imageFromProvider}
              setValue={setImageFromProvider}
              label={'Загруженная картинка'}
              id="imageFromProvider"
            />
            <InputFile
              name="uploadImage"
              label="Загрузить"
              accept=".jpg, .jpeg, .png, .webp"
              getChange={getPictures}
            />
          </div>
        </section>

        <BoxInput
          label="Фамилия:*"
          id="lastName"
          autoComplete="family-name"
          type="text"
          defaultValue={formData.person.lastName}
          register={validateLastName(register)}
          validationText={errors.lastName ? errors.lastName.message : ''}
        />
        <BoxInput
          label="Имя:*"
          id="firstName"
          autoComplete="name"
          type="text"
          defaultValue={formData.person.firstName}
          register={validateFirstName(register)}
          validationText={errors.firstName ? errors.firstName.message : ''}
        />
        <BoxInput
          label="Отчество:"
          id="patronymic"
          autoComplete="offered"
          type="text"
          defaultValue={formData.person.patronymic}
          register={validatePatronymic(register)}
          validationText={errors.patronymic ? errors.patronymic.message : ''}
        />
        <BoxSelect
          label="Пол:"
          id="gender"
          autoComplete="offered"
          type="text"
          defaultValue={formData.person.patronymic || 'мужской'}
          register={register('gender')}
          validationText={errors.gender ? errors.gender.message : ''}
        />
        <BoxInput
          label="Дата рождения:*"
          id="birthday"
          autoComplete="off"
          type="date"
          min="1920-01-01"
          max="2020-01-01"
          defaultValue={handlerDateForm.getFormDate(formData.person.birthday)}
          register={validateBirthday(register)}
          validationText={errors.birthday && 'Введите корректную дату'}
        />
        <BoxInput
          label="Город:"
          id="city"
          autoComplete="offered"
          type="text"
          defaultValue={formData.city}
          register={validateCity(register)}
          validationText={errors.city ? errors.city.message : ''}
        />
        <BoxTextarea
          label="О себе:"
          id="bio"
          autoComplete="offered"
          type="text"
          defaultValue={formData.person.bio}
          register={{ ...register('bio') }}
          validationText={errors.bio ? errors.bio.message : ''}
        />
        <div className={styles.box__button}>
          <Button name="Сохранить" theme="green" />
        </div>
      </form>
    </FormWrapper>
  );
}
