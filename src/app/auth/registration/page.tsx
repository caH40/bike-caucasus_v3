'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { SubmitHandler } from 'react-hook-form';

import AuthBlock from '@/UI/AuthBlock/AuthBlock';
import { useModalStore } from '@/store/modal';
import FormRegistration from '@/components/UI/Forms/FormRegistration/FormRegistration';
import { type IRegistrationForm } from '@/types/index.interface';
import { errorHandlerClient } from '@/services/server_actions/error-handler';
import Modal from '@/components/UI/Modal/Modal';
import { parseError } from '@/errors/parse';

/**
 * Страница регистрации
 */
export default function RegistrationPage() {
  const [validationAll, setValidationAll] = useState('');
  const [isCreatedUser, setIsCreatedUser] = useState(false);
  const setModal = useModalStore((state) => state.setModal);
  const isActive = useModalStore((state) => state.isActive);

  const onSubmit: SubmitHandler<IRegistrationForm> = async (dataForm) => {
    try {
      const url = '/api/auth/registration';
      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(dataForm),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) {
        // Обработка HTTP ошибок
        const errorText = await response.text();

        toast.error(errorText);
        // дублирование сообщения об ошибке в консоли
        setValidationAll(errorText);

        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText} - ${errorText}, urlRequest:${url}`
        );
      }

      const data = await response.json();
      setIsCreatedUser(true);
      // отображение модального информационного окна при успешной регистрации
      setModal('Регистрация прошла успешно!', <Answer email={data.email} />);
    } catch (error) {
      errorHandlerClient(parseError(error));
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
