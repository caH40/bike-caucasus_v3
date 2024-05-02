'use client';

import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import AuthBlock from '@/components/UI/AuthBlock/AuthBlock';
import FormResetPassword from '@/components/UI/Forms/FormResetPassword/FormResetPassword';
import { type IRegistrationForm } from '@/types/index.interface';
import { useModalStore } from '@/store/modal';
import { toast } from 'sonner';

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

export default function PasswordReset() {
  const [validationAll, setValidationAll] = useState('');
  const [showForm, setShowForm] = useState(true);
  const setModal = useModalStore((state) => state.setModal);

  const onSubmit: SubmitHandler<IRegistrationForm> = async (dataForm) => {
    const response = await fetch(`${server}/api/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify(dataForm),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      const data = await response.json();
      setValidationAll(data.message);
      toast.error(data.message);
      return;
    }

    const data = await response.json();
    setShowForm(false);
    setModal('Сброс пароля!', <Answer email={data.email} />);
  };
  return (
    showForm && (
      <AuthBlock>
        <FormResetPassword onSubmit={onSubmit} validationAll={validationAll} />
      </AuthBlock>
    )
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
