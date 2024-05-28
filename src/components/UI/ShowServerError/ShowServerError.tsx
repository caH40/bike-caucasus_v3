'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
  ok: boolean;
  message: string;
};

/**
 * Для Серверного компонента.
 * Отображает всплывающий pop-up toast при ошибке, получаемой с ответом на запрос с сервера.
 * @param {Props} param0 - Параметры компонента.
 * @returns {JSX.Element | null} Пустой элемент.
 */
export default function ShowServerError({ ok, message }: Props): JSX.Element | null {
  useEffect(() => {
    if (ok) {
      return;
    }

    toast.error(message);
  }, [ok, message]);
  return null;
}
