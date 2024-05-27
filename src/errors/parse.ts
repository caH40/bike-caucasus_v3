import type { TLogsErrorModel } from '@/types/models.interface';

/**
 * Обработка получаемого error и возврат в нужном формате
 */
export const parseError = (error: unknown): Omit<TLogsErrorModel, 'timestamp'> => {
  if (error instanceof Error) {
    const message = error?.message || 'Нет описания ошибки';

    switch (error.name) {
      default:
        return { stack: error.stack, message };
    }
  } else {
    return { message: 'Сгенерированная ошибка не типа Error' };
  }
};
