'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { SubmitHandler } from 'react-hook-form';

import AuthBlock from '@/UI/AuthBlock/AuthBlock';
import { useModalStore } from '@/store/modal';
import FormRegistration from '@/components/UI/Forms/FormRegistration/FormRegistration';
import { type IRegistrationForm } from '@/types/index.interface';

import Modal from '@/components/UI/Modal/Modal';

/**
 * Страница регистрации
 */
export default function RegistrationPage() {
  const [validationAll, setValidationAll] = useState('');
  const [isCreatedUser, setIsCreatedUser] = useState(false);
  const setModal = useModalStore((state) => state.setModal);
  const isActive = useModalStore((state) => state.isActive);

  const onSubmit: SubmitHandler<IRegistrationForm> = async (dataForm) => {
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
      // отображение модального информационного окна при успешной регистрации
      setModal('Регистрация прошла успешно!', <Answer email={data.email} />);
    } else {
      toast.error(data?.message || 'Ошибка при регистрации');
      // дублирование сообщения об ошибке в консоле
      console.error(data); // eslint-disable-line
      setValidationAll(data?.message);
    }
  };

  return (
    <>
      {isActive && <Modal />}
      {!isCreatedUser && (
        <AuthBlock>
          <FormRegistration onSubmit={onSubmit} validationAll={validationAll} />
        </AuthBlock>
      )}
    </>
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
