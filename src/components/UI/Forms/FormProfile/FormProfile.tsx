'use client';

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

type Props = {
  formData: IProfileForClient;
};

export default function FormProfile({ formData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormProfile>({ mode: 'all' });

  const onSubmit: SubmitHandler<TFormProfile> = async (dataForm) => {
    // if()
    // dataForm.birthday = new Date(dataForm.birthday).toISOString();
    // console.log(errors);
  };

  return (
    <FormWrapper title="Профиль">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
          // defaultValue={formData.person.patronymic}
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
