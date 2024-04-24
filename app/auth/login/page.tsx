'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import AuthBlock from '@/UI/AuthBlock/AuthBlock';
import BoxInputAuth from '@/UI/BoxInputAuth/BoxInputAuth';
import BoxButtonAuth from '@/UI/BoxButtonAuth/BoxButtonAuth';
import { validatePassword, validateUsername } from '../../../utils/validatorService';
import styles from '../auth.module.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Inputs = {
  username: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  // данные валидации с сервера
  const [validationAll, setValidationAll] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'all' });

  const onSubmit: SubmitHandler<Inputs> = async (dataForm) => {
    const response = await signIn('credentials', { ...dataForm, redirect: false });

    if (!response?.ok) {
      setValidationAll('Неверный логин или пароль');
    } else {
      router.back();
      setValidationAll('');
    }
  };

  return (
    <AuthBlock>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>Вход на Bike-Caucasus</h2>
        <BoxInputAuth
          id="username"
          autoComplete="username"
          type="text"
          register={validateUsername(register)}
          label="Логин"
          validationText={errors.username ? errors.username.message : ''}
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
          help="Впервые на сайте?"
          linkLabel="Создать аккаунт!"
          link="registration"
          validationText={validationAll}
        >
          Вход
        </BoxButtonAuth>
      </form>
    </AuthBlock>
  );
}
