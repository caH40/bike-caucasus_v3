'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Suspense, useState } from 'react';

import { type SubmitHandler } from 'react-hook-form';
import AuthBlock from '../../../components/UI/AuthBlock/AuthBlock';
import FormLogin from '@/components/UI/Forms/FormLogin/FormLogin';
import { IRegistrationForm } from '@/types/index.interface';
import AuthProviderBlock from '@/components/AuthProviderBlock/AuthProviderBlock';

import styles from './page.module.css';

/**
 * при использовании useSearchParams помещается в Suspense
 */
function AuthWithSearchParams() {
  // получение страницы с которой осуществился вход для последующего возвращения
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  return <AuthProviderBlock callbackUrl={callbackUrl} />;
}

/**
 * Страница аутентификации
 */
export default function LoginPage() {
  // данные валидации с сервера
  const [validationAll, setValidationAll] = useState('');
  const router = useRouter();

  const onSubmit: SubmitHandler<IRegistrationForm> = async (dataForm) => {
    const response = await signIn('credentials', { ...dataForm, redirect: false });

    if (!response?.ok) {
      toast.error('Неверный логин или пароль');
      setValidationAll('Неверный логин или пароль');
    } else {
      toast.success('Успешная аутентификация');
      router.back();

      setValidationAll('');
    }
  };

  return (
    <AuthBlock>
      <FormLogin onSubmit={onSubmit} validationAll={validationAll} />
      <section className={styles.block}>
        <hr className={styles.line} />
        <Suspense>
          <AuthWithSearchParams />
        </Suspense>
      </section>
    </AuthBlock>
  );
}