'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';

import BoxInput from '../../BoxInput/BoxInput';
import BoxSelect from '../../BoxSelect/BoxSelect';
import Wrapper from '../../../Wrapper/Wrapper';
import {
  validateBirthday,
  validateCity,
  validateFirstName,
  validateLastName,
  validatePatronymic,
} from '@/libs/utils/validatorService';
import BlockUploadLogoProfile from '../../BlockUploadLogoProfile/BlockUploadLogoProfile';
import Button from '../../Button/Button';
import { handlerDateForm } from '@/libs/utils/date';
import BoxTextarea from '../../BoxTextarea/BoxTextarea';
import type { TUserDto } from '@/types/dto.types';
import type { ServerResponse, TFormProfile } from '@/types/index.interface';
import { useLoadingStore } from '@/store/loading';
import { handlerResponse } from '@/libs/utils/response';
import styles from '../Form.module.css';

type Props = {
  formData: TUserDto;
  putProfile: (params: FormData) => Promise<ServerResponse<any>>; // eslint-disable-line
  idUser: string;
};

/**
 * Форма для изменения данных Пользователя в профиле
 */
export default function FormProfile({ formData, putProfile, idUser }: Props) {
  const [loading, setLoading] = useState(false);

  // глобальный спиннер
  const setLoadingStore = useLoadingStore((state) => state.setLoading);

  const [imageFromProvider, setImageFromProvider] = useState<boolean>(
    !!formData.imageFromProvider
  );
  const [file, setFile] = useState<File | null>(null);
  const { update } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormProfile>({ mode: 'all' });

  const onSubmit: SubmitHandler<TFormProfile> = async (dataForm) => {
    setLoading(true);
    setLoadingStore(true);
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

    const res = await putProfile(dataToForm);
    handlerResponse(res);
    update();

    setLoading(false);
    setLoadingStore(false);
  };

  return (
    <Wrapper title="Данные профиля">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <BlockUploadLogoProfile
          setFile={setFile}
          imageFromProvider={imageFromProvider}
          setImageFromProvider={setImageFromProvider}
          formData={formData}
          loading={loading}
          maxSizeFileInMBytes={7} // Максимальный разрешенный размер загружаемого файла.
        />
        <BoxInput
          label="Фамилия:*"
          id="lastName-FormProfile"
          autoComplete="family-name"
          type="text"
          defaultValue={formData.person.lastName}
          loading={loading}
          register={validateLastName(register)}
          validationText={errors.lastName ? errors.lastName.message : ''}
        />
        <BoxInput
          label="Имя:*"
          id="firstName-FormProfile"
          autoComplete="name"
          type="text"
          defaultValue={formData.person.firstName}
          loading={loading}
          register={validateFirstName(register)}
          validationText={errors.firstName ? errors.firstName.message : ''}
        />
        <BoxInput
          label="Отчество:"
          id="patronymic-FormProfile"
          autoComplete="offered"
          type="text"
          defaultValue={formData.person.patronymic}
          loading={loading}
          register={validatePatronymic(register)}
          validationText={errors.patronymic ? errors.patronymic.message : ''}
        />
        <BoxSelect
          label="Пол:"
          id="gender-FormProfile"
          autoComplete="offered"
          type="text"
          defaultValue={formData.person.patronymic || 'мужской'}
          loading={loading}
          register={register('gender')}
          validationText={errors.gender ? errors.gender.message : ''}
        />
        <BoxInput
          label="Дата рождения:*"
          id="birthday-FormProfile"
          autoComplete="off"
          type="date"
          min="1920-01-01"
          max="2020-01-01"
          defaultValue={handlerDateForm.getFormDate(formData.person.birthday)}
          loading={loading}
          register={validateBirthday(register)}
          validationText={errors.birthday && 'Введите корректную дату'}
        />
        <BoxInput
          label="Город:"
          id="city-FormProfile"
          autoComplete="offered"
          type="text"
          defaultValue={formData.city}
          loading={loading}
          register={validateCity(register)}
          validationText={errors.city ? errors.city.message : ''}
        />
        <BoxTextarea
          label="О себе:"
          id="bio-FormProfile"
          autoComplete="offered"
          type="text"
          defaultValue={formData.person.bio}
          loading={loading}
          register={{ ...register('bio') }}
          validationText={errors.bio ? errors.bio.message : ''}
        />
        <div className={styles.box__button}>
          <Button name="Сохранить" theme="green" loading={loading} />
        </div>
      </form>
    </Wrapper>
  );
}
