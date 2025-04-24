'use client';

import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';

import AuthBlock from '@/components/UI/AuthBlock/AuthBlock';
import FormNewPassword from '@/components/UI/Forms/FormNewPassword/FormNewPassword';
import { parseError } from '@/errors/parse';
import { errorHandlerClient } from '@/actions/error-handler';
import { type IRegistrationForm } from '@/types/index.interface';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

/**
 * Страница создание нового пароля
 * id hash для смены пароля у пользователя
 */
export default function CreateNewPassword(props: Params) {
  const params = use(props.params);

  const {
    id
  } = params;

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
    try {
      const url = `${server}/api/auth/create-new-password`;
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ ...dataForm, userId }),
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
      setShowForm(false);
      toast.success(data.message);
      router.push('/');
    } catch (error) {
      errorHandlerClient(parseError(error));
    }
  };

  return (
    showForm && (
      <AuthBlock>
        <FormNewPassword onSubmit={onSubmit} validationAll={validationAll} />
      </AuthBlock>
    )
  );
}
