import { toast } from 'sonner'; // Импорт функции toast из библиотеки sonner

import type { MessageServiceDB } from '@/types/index.interface'; // Импорт интерфейса MessageServiceDB

/**
 * Обрабатывает ответ от сервера, выводя сообщение об успехе или ошибке с помощью библиотеки sonner.
 * @param response - Ответ от сервера.
 */
export function handlerResponse(response: MessageServiceDB<any>): void {
  if (response.ok) {
    toast.success(response.message ?? 'Ответ с сервера без сообщения');
  } else {
    toast.error(response.message ?? 'Непредвиденная ошибка на сервере');
  }
}
