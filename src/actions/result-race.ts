'use server';
// Экшены для работы с результатами райдеров в заездах.

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { ServerResponse, TProtocolRace } from '@/types/index.interface';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { ResultRaceService } from '@/services/ResultRace';
import { TResultRaceDto, TRiderRaceResultDto } from '@/types/dto.types';
import { revalidatePath } from 'next/cache';
import { ChampionshipService } from '@/services/Championship';

/**
 * Сохранение результата райдера в Заезде Чемпионата.
 */
export async function postRiderRaceResult({
  dataFromFormSerialized,
}: {
  dataFromFormSerialized: FormData;
}): Promise<ServerResponse<null>> {
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
export async function getRaceProtocol({
  raceId,
}: {
  raceId: string;
}): Promise<ServerResponse<{ protocol: TResultRaceDto[]; categories: string[] } | null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.getRaceProtocol({ raceId });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получение всех протоколов Заездов Чемпионата и списка категорий в заезде.
 */
export async function getRaceProtocols({
  urlSlug,
}: {
  urlSlug: string;
}): Promise<ServerResponse<TProtocolRace[] | null>> {
  try {
    const championshipService = new ChampionshipService();
    const { data, message } = await championshipService.getOne({ urlSlug });

    if (!data) {
      throw new Error(message);
    }
    const resultRaceService = new ResultRaceService();

    const responseProtocols = await Promise.all(
      data.races.map((race) => resultRaceService.getRaceProtocol({ raceId: race._id }))
    );

    // Не используется filter и map так как не проходил проверку типизации при билдинге приложения!!!
    const protocols = [] as TProtocolRace[];
    responseProtocols.forEach((elm) => {
      if (elm.data !== null) {
        protocols.push(elm.data);
      }
    });

    return { data: protocols, ok: true, message: 'Все протоколы заездов Чемпионата' };
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Обновление протокола Заезда Чемпионата.
 */
export async function updateProtocolRace({
  championshipId,
  raceId,
}: {
  championshipId: string;
  raceId: string;
}): Promise<ServerResponse<null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.updateRaceProtocol({
      championshipId,
      raceId,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получение протоколов Заездов Чемпионатов в которых участвовал райдер riderId.
 */
export async function getResultsRaceForRider({
  riderId,
}: {
  riderId: string;
}): Promise<ServerResponse<TRiderRaceResultDto[] | null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.getRiderRaceResults({
      riderId,
    });

    return res;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Получение протокола Заезда Чемпионата в котором участвовал райдер riderId
 */
export async function getResultRaceForRider({
  resultId,
}: {
  resultId: string;
}): Promise<ServerResponse<TRiderRaceResultDto | null>> {
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
export async function deleteResult({ _id }: { _id: string }): Promise<ServerResponse<null>> {
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
}): Promise<ServerResponse<null>> {
  try {
    const resultRaceService = new ResultRaceService();
    const res = await resultRaceService.update({ result });

    if (res.ok) {
      revalidatePath('/moderation/championship/protocol/edit');
      return { data: null, ok: true, message: res.message };
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
