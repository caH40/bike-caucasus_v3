import type { TLogsErrorParsed } from '@/types/index.interface';

/**
 * Обработка полей получаемого error и возврат в нужном формате
 */
export const parseError = (error: unknown): TLogsErrorParsed => {
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
