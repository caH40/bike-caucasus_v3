import { Logger } from '../logger';
import { handlerErrorDB } from '../mongodb/error';
import { errorLogger } from '@/errors/error';
import type { TGetErrorsDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';

/**
 * Серверный экшен, получает лог ошибки с id.
 */
export async function getLogError({
  id,
}: {
  id: string;
}): Promise<ResponseServer<null> | ResponseServer<TGetErrorsDto>> {
  'use server';
  try {
    const loggerService = new Logger();
    const response = await loggerService.getError(id);

    return response;
  } catch (error) {
    errorLogger(error);
    return handlerErrorDB(error);
  }
}
