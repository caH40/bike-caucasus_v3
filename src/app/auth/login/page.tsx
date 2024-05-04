'use client';

import { Transition } from 'react-transition-group';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Suspense, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import { type SubmitHandler } from 'react-hook-form';
import AuthBlock from '../../../components/UI/AuthBlock/AuthBlock';
import FormLogin from '@/components/UI/Forms/FormLogin/FormLogin';
import { IRegistrationForm } from '@/types/index.interface';
import AuthProviderBlock from '@/components/AuthProviderBlock/AuthProviderBlock';

import styles from './page.module.css';
import Button from '@/components/UI/Button/Button';

const cx = classNames.bind(styles);
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
  const [showCredentials, setShowCredentials] = useState(false);
  // данные валидации с сервера
  const [validationAll, setValidationAll] = useState('');
  const router = useRouter();
  const nodeRef = useRef(null);

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

  const openCredentials = () => {
    setShowCredentials((prev) => !prev);
  };

  return (
    <AuthBlock>
      <h2 className={styles.title}>Вход на Bike-Caucasus</h2>
      <section className={styles.block}>
        <Suspense>
          <AuthWithSearchParams />
        </Suspense>
      </section>
      <hr className={styles.line} />
      <div className={styles.block__btn}>
        <Button
          name={showCredentials ? 'закрыть' : 'логин/пароль'}
          getClick={openCredentials}
        />
      </div>

      <Transition in={showCredentials} timeout={300} nodeRef={nodeRef}>
        {(state) => (
          <div ref={nodeRef} className={cx('credentials', state)}>
            {showCredentials && <FormLogin onSubmit={onSubmit} validationAll={validationAll} />}
          </div>
        )}
      </Transition>
    </AuthBlock>
  );
}
