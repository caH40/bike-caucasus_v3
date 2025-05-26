import { errorLogger } from '@/errors/error';
import { Logger } from '@/services/logger';
import { handlerErrorDB } from '@/services/mongodb/error';
import type { TGetErrorsDto } from '@/types/dto.types';
import type { ServerResponse } from '@/types/index.interface';

/**
 * Серверный экшен, получает лог ошибки с id.
 */
export async function getLogError({
  id,
}: {
  id: string;
}): Promise<ServerResponse<null> | ServerResponse<TGetErrorsDto>> {
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
