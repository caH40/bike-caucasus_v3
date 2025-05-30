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
import t from '@/locales/ru/authorization.json';

import styles from './page.module.css';
import Button from '@/components/UI/Button/Button';
import { useLoadingStore } from '@/store/loading';
import { LegalNotice } from '@/components/LegalNotice/LegalNotice';

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
  const setLoading = useLoadingStore((state) => state.setLoading);

  // данные валидации с сервера
  const [validationAll, setValidationAll] = useState('');
  const router = useRouter();
  const nodeRef = useRef(null);

  const onSubmit: SubmitHandler<IRegistrationForm> = async (dataForm) => {
    try {
      setLoading(true);
      const response = await signIn('credentials', { ...dataForm, redirect: false });

      if (!response?.ok) {
        throw new Error();
      }

      toast.success(t.login.toast.success);
      router.back();

      setValidationAll('');
    } catch (error) {
      toast.error(t.login.toast.error);
      setValidationAll(t.login.toast.error);
    } finally {
      setLoading(false);
    }
  };

  const openCredentials = () => {
    setShowCredentials((prev) => !prev);
  };

  return (
    <AuthBlock>
      <h2 className={styles.title}>{t.login.title}</h2>
      <section className={styles.block}>
        <Suspense>
          <AuthWithSearchParams />
        </Suspense>
      </section>
      <hr className={styles.line} />
      <div className={styles.block__btn}>
        <Button
          name={showCredentials ? t.login.btn.close : t.login.btn.loginAndPass}
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

      <div className={styles.announcement}>
        <LegalNotice actionText="Нажимая «Вход» или иконки сервисов аутентификации" />
      </div>

      {/* блок информации */}
      {!showCredentials && <div className={styles.announcement}>{t.login.announcement}</div>}
    </AuthBlock>
  );
}
