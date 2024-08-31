'use server';
// Экшены для работы с финишным протоколом Заезда.

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ResponseServer } from '@/types/index.interface';
import { ProtocolRaceService } from '@/services/ProtocolRace';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';

/**
 * Сохранение результата райдера в Заезде Чемпионата.
 */
export async function postResultRaceRider({
  dataFromFormSerialized,
}: {
  dataFromFormSerialized: FormData;
}): Promise<ResponseServer<null>> {
  try {
    const session = await getServerSession(authOptions);

    // Проверка наличия прав на редактирование Чемпионатов.
    if (
      !session?.user.role.permissions.some(
        (elm) => elm === 'moderation.championship.protocol' || elm === 'all'
      )
    ) {
      throw new Error('У вас нет прав для добавления результата райдера в Заезде!');
    }

    const protocolRaceService = new ProtocolRaceService();
    const res = await protocolRaceService.post({
      dataFromFormSerialized,
      creatorId: session.user.idDB,
    });

    if (!res.ok) {
      throw new Error('Ошибка при добавлении результата райдера в Заезде');
    }

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
