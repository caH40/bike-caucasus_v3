'use server';
// Экшены для работы с финишным протоколом Заезда.

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ResponseServer } from '@/types/index.interface';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { ResultRaceService } from '@/services/ResultRace';

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

    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.post({
      dataFromFormSerialized,
      creatorId: session.user.idDB,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
