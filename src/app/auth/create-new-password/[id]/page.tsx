'use client';

import { useEffect, useState } from 'react';

import AuthBlock from '@/components/UI/AuthBlock/AuthBlock';
import FormNewPassword from '@/components/UI/Forms/FormNewPassword/FormNewPassword';
import { SubmitHandler } from 'react-hook-form';
import { type IRegistrationForm } from '@/types/index.interface';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Params = {
  params: {
    id: string;
  };
};

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

/**
 * Страница создание нового пароля
 * id hash для смены пароля у пользователя
 */
export default function CreateNewPassword({ params: { id } }: Params) {
  const [validationAll, setValidationAll] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (!id) {
      return;
    }
    fetch(`${server}/api/auth/check-request-password`, {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.userId) {
          setShowForm(true);
          setUserId(data.userId);
        } else {
          toast.error(data.message);
        }
      })
      .catch((e) => {
        toast.error(e?.message || 'неизвестная ошибка');
      });
  }, [id]);

  const onSubmit: SubmitHandler<IRegistrationForm> = async (dataForm) => {
    const res = await fetch(`${server}/api/auth/create-new-password`, {
      method: 'POST',
      body: JSON.stringify({ ...dataForm, userId }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setValidationAll(data.message);
      toast.error(data.message);
      return;
    }

    setShowForm(false);
    toast.success(data.message);
    router.push('/');
  };

  return (
    showForm && (
      <AuthBlock>
        <FormNewPassword onSubmit={onSubmit} validationAll={validationAll} />
      </AuthBlock>
    )
  );
}
