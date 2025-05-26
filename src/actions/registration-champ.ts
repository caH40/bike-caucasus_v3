'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { RegistrationChampService } from '@/services/RegistrationChamp';
import type {
  TChampRegistrationRiderDto,
  TCheckRegisteredInChampDto,
  TRaceRegistrationDto,
  TRegistrationRiderDto,
} from '@/types/dto.types';
import type {
  ServerResponse,
  TChampionshipForRegisteredClient,
  TRegistrationRaceDataFromForm,
} from '@/types/index.interface';
import type { TRaceRegistrationStatus } from '@/types/models.interface';

const regService = new RegistrationChampService();

/**
 * Экшен Регистрации на Чемпионат.
 */
export async function registerForChampionship({
  championshipId,
  raceId,
  startNumber,
  teamVariable,
}: TRegistrationRaceDataFromForm): Promise<ServerResponse<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const riderId = session?.user.idDB;
    if (!riderId) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    const response = await regService.post({
      championshipId,
      raceId,
      riderId,
      startNumber,
      teamVariable,
    });

    revalidatePath('championships');

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получение зарегистрированных Райдеров на Заезд Чемпионата.
 */
export async function getRegisteredRidersRace(
  raceId: string
): Promise<ServerResponse<TRaceRegistrationDto[] | null>> {
  'use server';
  try {
    const response = await regService.getRidersRace(raceId);

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получение зарегистрированных Райдеров на Этап/Соревнования во всех Заездах.
 * Или в конкретном raceNumber.
 */
export async function getRegisteredRidersChamp({
  urlSlug,
  raceId,
}: {
  urlSlug: string;
  raceId?: string;
}): Promise<
  ServerResponse<{
    champRegistrationRiders: TChampRegistrationRiderDto[];
    championship: TChampionshipForRegisteredClient;
  } | null>
> {
  try {
    const response = await regService.getRegisteredInChampRiders({
      urlSlug,
      raceId,
    });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен обновления данных по регистрации Райдера в Заезд Чемпионата.
 */
export async function putRegistrationRiderChamp({
  championshipId,
  raceId,
  riderId,
  updates,
}: {
  championshipId: string;
  raceId: string;
  riderId: string;
  updates: { status: TRaceRegistrationStatus };
}): Promise<ServerResponse<TChampRegistrationRiderDto[] | null>> {
  'use server';
  try {
    if (!raceId || !championshipId || !riderId) {
      throw new Error('Получены не все данные для обновления Регистрации райдера на Заезд!');
    }

    const response = await regService.put({
      championshipId,
      raceId,
      riderId,
      updates,
    });

    revalidatePath('/championships');

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получение всех текущих (upcoming) регистраций запрашиваемого райдера.
 */
export async function getRegistrationsRider({
  riderId,
}: {
  riderId: string;
}): Promise<ServerResponse<TRegistrationRiderDto[] | null>> {
  'use server';
  try {
    const registrationsRider = await regService.getCurrentRider({
      riderId,
    });

    return registrationsRider;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Проверка активной регистрации райдера в запрашиваемом Чемпионате во всех заездах.
 * Если есть регистрация, то возвращаются данные Заезда.
 */
export async function checkRegisteredInChamp({
  idRiderDB,
  champId,
}: {
  idRiderDB: string | undefined;
  champId: string;
}): Promise<ServerResponse<TCheckRegisteredInChampDto | null>> {
  'use server';
  try {
    if (!idRiderDB) {
      return {
        data: null,
        ok: true,
        message: 'Не авторизован!',
      };
    }
    const registeredInChamp = await regService.checkRegisteredInChamp({
      idRiderDB,
      champId,
    });

    return registeredInChamp;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
