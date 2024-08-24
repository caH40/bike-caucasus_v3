'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { RegistrationChampService } from '@/services/RegistrationChamp';
import type { TChampRegistrationRiderDto, TRaceRegistrationDto } from '@/types/dto.types';
import type { ResponseServer, TRegistrationRaceDataFromForm } from '@/types/index.interface';
import type { TChampionshipTypes, TRaceRegistrationStatus } from '@/types/models.interface';

const regService = new RegistrationChampService();

/**
 * Экшен Регистрации на Чемпионат.
 */
export async function registerForChampionship({
  championshipId,
  raceNumber,
  startNumber,
  teamVariable,
}: TRegistrationRaceDataFromForm): Promise<ResponseServer<null>> {
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
      raceNumber,
      riderId,
      startNumber,
      teamVariable,
    });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получение зарегистрированных Райдеров на Заезд Чемпионата.
 */
export async function getRegisteredRidersRace({
  championshipId,
  raceNumber,
}: {
  championshipId: string;
  raceNumber: number;
}): Promise<ResponseServer<TRaceRegistrationDto[] | null>> {
  'use server';
  try {
    const response = await regService.getRidersRace({
      championshipId,
      raceNumber,
    });

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получение зарегистрированных Райдеров на Заезд Чемпионата.
 */
export async function getRegisteredRidersChamp({ urlSlug }: { urlSlug: string }): Promise<
  ResponseServer<{
    champRegistrationRiders: TChampRegistrationRiderDto[];
    championshipName: string;
    championshipType: TChampionshipTypes;
  } | null>
> {
  'use server';
  try {
    const response = await regService.getRidersChamp({
      urlSlug,
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
  raceNumber,
  riderId,
  updates,
}: {
  championshipId: string;
  raceNumber: number;
  riderId: string;
  updates: { status: TRaceRegistrationStatus };
}): Promise<ResponseServer<TChampRegistrationRiderDto[] | null>> {
  'use server';
  try {
    const response = await regService.put({
      championshipId,
      raceNumber,
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
