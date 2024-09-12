'use server';
// Экшены для работы с результатами райдеров в заездах.

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ResponseServer } from '@/types/index.interface';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { ResultRaceService } from '@/services/ResultRace';
import { TResultRaceDto, TResultRaceRiderDto } from '@/types/dto.types';

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

/**
 * Получение протокола Заезда Чемпионата и списка категорий в заезде.
 */
export async function getProtocolRace({
  championshipId,
  raceNumber,
}: {
  championshipId: string;
  raceNumber: number;
}): Promise<ResponseServer<{ protocol: TResultRaceDto[]; categories: string[] } | null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.getProtocolRace({
      championshipId,
      raceNumber,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получение протокола Заезда Чемпионата.
 */
export async function updateProtocolRace({
  championshipId,
  raceNumber,
}: {
  championshipId: string;
  raceNumber: number;
}): Promise<ResponseServer<null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.updateProtocolRace({
      championshipId,
      raceNumber,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получение протокола Заезда Чемпионата.
 */
export async function getResultsRaceForRider({
  riderId,
}: {
  riderId: string;
}): Promise<ResponseServer<TResultRaceRiderDto[] | null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.getForRider({
      riderId,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получение протокола Заезда Чемпионата.
 */
export async function getResultRaceForRider({
  resultId,
}: {
  resultId: string;
}): Promise<ResponseServer<TResultRaceRiderDto | null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.getOne({
      resultId,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Удаление результата Заезда райдера из протокола.
 */
export async function deleteResult({ _id }: { _id: string }): Promise<ResponseServer<null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.delete({
      _id,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Обновление данных результата райдера в протоколе.
 */
export async function putResultRaceRider({
  result,
}: {
  result: FormData;
}): Promise<ResponseServer<null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.update({ result });

    if (res.ok) {
      return { data: null, ok: true, message: res.message };
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
