import { toast } from 'sonner'; // Импорт функции toast из библиотеки sonner

import type { ResponseServer } from '@/types/index.interface'; // Импорт интерфейса ResponseServer

/**
 * Обрабатывает ответ от сервера на клиентской стороне,
 * выводя сообщение об успехе или ошибке с помощью библиотеки sonner.
 * @param response - Ответ от сервера.
 */
export function handlerResponse(response: ResponseServer<any>): void {
  if (response.ok) {
    toast.success(response.message ?? 'Ответ с сервера без сообщения');
  } else {
    toast.error(response.message ?? 'Непредвиденная ошибка на сервере');
  }
}
