'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import AuthBlock from '../../../components/UI/AuthBlock/AuthBlock';
import BoxInputAuth from '../../../components/UI/BoxInputAuth/BoxInputAuth';
import BoxButtonAuth from '../../../components/UI/BoxButtonAuth/BoxButtonAuth';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../../../utils/validatorService';
import styles from '../auth.module.css';

type Inputs = {
  username: string;
  email: string;
  password: string;
};

export default function RegistrationPage() {
  const [validationAll, setValidationAll] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'all' });

  const onSubmit: SubmitHandler<Inputs> = async (dataForm) => {
    // console.log(dataForm);
    // const response = await postAuthorization(dataForm); API REGestration
    // if (response.status !== 201) {
    //   setValidationAll(response.data);
    //   return;
    // }
    // if (response.data.status === 'wrong') {
    //   setValidationAll(response.data.message);
    //   return;
    // }
    // if (response.data.accessToken) {
    //   console.log({ message: 'Успешная авторизация!', type: 'success', isOpened: true });
    // }
  };

  return (
    <AuthBlock>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.block}>
        <h2 className={styles.title}>Регистрация аккаунта</h2>
        <BoxInputAuth
          id="username"
          autoComplete="username"
          type="text"
          register={validateUsername(register)}
          label="Логин"
          validationText={errors.username ? errors.username.message : ''}
        />
        <BoxInputAuth
          id="email"
          autoComplete="email"
          type="text"
          register={validateEmail(register)}
          label="Email"
          validationText={errors.email ? errors.email.message : ''}
        />
        <BoxInputAuth
          id="password"
          autoComplete="current-password"
          type="password"
          register={validatePassword(register)}
          label="Пароль"
          linkLabel="Забыли пароль?"
          validationText={errors.password ? errors.password.message : ''}
        />
        <BoxButtonAuth
          help="Уже есть аккаунт?"
          linkLabel="Вход!"
          link="authentication"
          validationText={validationAll}
        >
          Регистрация
        </BoxButtonAuth>
      </form>
    </AuthBlock>
  );
}
