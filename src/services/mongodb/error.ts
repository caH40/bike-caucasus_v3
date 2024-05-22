import { ResponseServer } from '@/types/index.interface';

/**
 * Обработчик ошибок для сервисов работы с БД
 */
export function handlerErrorDB(error: unknown): ResponseServer<null> {
  if (error instanceof Error) {
    return { data: null, ok: false, message: error.message };
  }
  return { data: null, ok: false, message: 'Непредвиденная ошибка в сервисе работы с БД' };
}
