'use server';

import { errorLogger } from '@/errors/error';
import { checkUserAccess } from '@/libs/utils/auth/checkUserPermission';
import { LogService } from '@/services/LogService';
import { handlerErrorDB } from '@/services/mongodb/error';
import type { TGetErrorsDto, TGetModeratorActionLogDto } from '@/types/dto.types';
import type { ServerResponse } from '@/types/index.interface';

/**
 * Серверный экшен, получает лог ошибки с id.
 */
export async function getLogError({
  id,
}: {
  id: string;
}): Promise<ServerResponse<null> | ServerResponse<TGetErrorsDto>> {
  try {
    const logService = new LogService();
    const response = await logService.getError(id);

    return response;
  } catch (error) {
    errorLogger(error);
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен, получает логи всех действий модераторов.
 */
export async function geAllModeratoActionLogsError(): Promise<
  ServerResponse<TGetModeratorActionLogDto[] | null>
> {
  try {
    await checkUserAccess('admin');

    const logService = new LogService();
    const response = await logService.getAllModeratorActions();

    return response;
  } catch (error) {
    errorLogger(error);
    return handlerErrorDB(error);
  }
}
