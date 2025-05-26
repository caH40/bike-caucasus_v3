import { ServerResponse } from '@/types/index.interface';
import { ErrorCustom } from '../Error';

/**
 * Обработчик ошибок для сервисов с возвратом сообщения на клиент.
 */
export function handlerErrorDB(error: unknown): ServerResponse<null> {
  // Если error является экземпляром ErrorCustom, то дополнительно возвращается пользовательский statusCode.
  if (error instanceof ErrorCustom) {
    return { data: null, ok: false, message: error.message, statusCode: error.statusCode };
  }

  if (error instanceof Error) {
    return { data: null, ok: false, message: error.message };
  }

  return { data: null, ok: false, message: 'Непредвиденная ошибка в сервисе работы с БД' };
}
