/**
 * Обработчик ошибок для сервисов работы с БД
 */
export function handlerErrorDB(error: unknown) {
  if (error instanceof Error) {
    return { ok: false, message: error.message };
  }
  return { ok: false, message: 'Непредвиденная ошибка в сервисе работы с БД' };
}
