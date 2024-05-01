'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import AuthBlock from '../../../components/UI/AuthBlock/AuthBlock';
import BoxInputAuth from '../../../components/UI/BoxInputAuth/BoxInputAuth';
import BoxButtonAuth from '../../../components/UI/BoxButtonAuth/BoxButtonAuth';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../../../libs/utils/validatorService';

import type { SubmitHandler } from 'react-hook-form';
import styles from '../auth.module.css';
import { useModalStore } from '@/store/modal';

type Inputs = {
  username: string;
  email: string;
  password: string;
};

export default function RegistrationPage() {
  const [validationAll, setValidationAll] = useState('');
  const [isCreatedUser, setIsCreatedUser] = useState(false);
  const setModal = useModalStore((state) => state.setModal);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'all' });

  const onSubmit: SubmitHandler<Inputs> = async (dataForm) => {
    const response = await fetch('/api/auth/registration', {
      method: 'post',
      body: JSON.stringify({ ...dataForm, role: 'user' }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      setIsCreatedUser(true);
      setModal('Регистрация прошла успешно!', <Answer email={data.email} />);
    } else {
      setValidationAll(data.message);
    }
  };

  return (
    !isCreatedUser && (
      <AuthBlock>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            link="password-reset"
            validationText={errors.password ? errors.password.message : ''}
          />
          <BoxButtonAuth
            help="Уже есть аккаунт?"
            linkLabel="Вход!"
            link="login"
            validationText={validationAll}
          >
            Регистрация
          </BoxButtonAuth>
        </form>
      </AuthBlock>
    )
  );
}

function Answer({ email }: { email: string }) {
  return (
    <>
      На Вашу почту <b>{email}</b> отправлено письмо для активации аккаунта и подтверждения
      e-mail. Ссылка активна в течении 3 суток.
    </>
  );
}
