'use client';

import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

import Modal from '@/components/UI/Modal/Modal';
import { parseError } from '@/errors/parse';
import { errorHandlerClient } from '@/actions/error-handler';
import { useModalStore } from '@/store/modal';
import AuthBlock from '@/components/UI/AuthBlock/AuthBlock';
import FormResetPassword from '@/components/UI/Forms/FormResetPassword/FormResetPassword';
import { type IRegistrationForm } from '@/types/index.interface';

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

export default function PasswordReset() {
  const [showForm, setShowForm] = useState(true);
  const setModal = useModalStore((state) => state.setModal);
  const isActive = useModalStore((state) => state.isActive);

  const onSubmit: SubmitHandler<IRegistrationForm> = async (dataForm) => {
    try {
      const url = `${server}/api/auth/reset-password`;
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataForm),
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });

      if (!response.ok) {
        // Обработка HTTP ошибок
        const errorText = await response.text();

        toast.error(errorText);

        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText} - ${errorText}, urlRequest:${url}`
        );
      }

      const data = await response.json();
      setShowForm(false);
      setModal('Сброс пароля!', <Answer email={data.email} />);
    } catch (error) {
      errorHandlerClient(parseError(error));
    }
  };

  return (
    <>
      {isActive && <Modal />}
      {showForm && (
        <AuthBlock>
          <FormResetPassword onSubmit={onSubmit} />
        </AuthBlock>
      )}
    </>
  );
}

function Answer({ email }: { email: string }) {
  return (
    <>
      На Вашу почту <b>{email}</b> отправлено письмо с инструкцией по сбросу пароля. Ссылка
      активна в течении 3 суток.
    </>
  );
}
