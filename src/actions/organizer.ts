'use server';

import { OrganizerService } from '@/services/Organizer';
import type { TDtoOrganizer } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';

/**
 * Получение данных организатора или по _id Организатора или по _id(creatorId) создателя Организатора.
 */
export async function getOrganizer({
  _id,
  creatorId,
}: {
  _id?: string;
  creatorId?: string;
}): Promise<ResponseServer<TDtoOrganizer | null>> {
  try {
    // Проверка, что только один параметр предоставлен
    if ((!_id && !creatorId) || (_id && creatorId)) {
      throw new Error('Необходимо передать только один из параметров: _id или creatorId.');
    }

    let query = {} as { _id: string } | { creatorId: string };

    if (_id) {
      query = { _id };
    } else if (creatorId) {
      query = { creatorId };
    }

    const organizerService = new OrganizerService();
    const res = await organizerService.getOne(query);

    return res;
  } catch (error) {
    const errorParsed = parseError(error);
    errorHandlerClient(errorParsed);
    return { data: null, ok: false, message: errorParsed.message };
  }
}
