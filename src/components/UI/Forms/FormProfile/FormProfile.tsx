'use client';

import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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

import type { IProfileForClient } from '@/types/fetch.interface';
import type { TFormProfile } from '@/types/index.interface';
import styles from './FormProfile.module.css';
import Button from '../../Button/Button';
import Image from 'next/image';
import InputFile from '../../InputFile/InputFile';

type Props = {
  formData: IProfileForClient;
  getDataClient: (params: FormData) => Promise<void>; // eslint-disable-line
};

export default function FormProfile({ formData, getDataClient }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [urlFile, setUrlFile] = useState<string | undefined>(formData.image);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormProfile>({ mode: 'all' });

  const onSubmit: SubmitHandler<TFormProfile> = async (dataForm) => {
    const formData = new FormData();
    if (file) {
      formData.set('image', file);
    }
    for (const key in dataForm) {
      if (dataForm.hasOwnProperty(key)) {
        formData.set(key, dataForm[key]);
      }
    }

    await getDataClient(formData);
  };

  const getPictures = (event: ChangeEvent<HTMLInputElement>) => {
    const fileFromForm = event.target.files?.[0] || null;
    if (!fileFromForm) {
      return;
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
            src={urlFile || '/images/icons/noimage.svg'}
            className={styles.profile__image}
          />

          <InputFile
            name="Загрузить фото"
            accept=".jpg, .jpeg, .png, .webp"
            getChange={getPictures}
          />
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
          defaultValue={formData.person.birthday}
          register={validateBirthday(register)}
          validationText={errors.birthday && 'Введите корректную дату'}
        />
        <BoxInput
          label="Город:"
          id="city"
          autoComplete="offered"
          type="text"
          register={validateCity(register)}
          validationText={errors.city ? errors.city.message : ''}
        />
        <div className={styles.box__button}>
          <Button name="Сохранить" theme="green" />
        </div>
      </form>
    </FormWrapper>
  );
}
