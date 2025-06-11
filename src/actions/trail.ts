'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { Trail } from '@/services/Trail';
import { handlerErrorDB } from '@/services/mongodb/error';
import { errorLogger } from '@/errors/error';
import { TWeatherForecast } from '@/types/weather.types';
import { getGPSData } from './gpx';
import { WeatherService } from '@/services/Weather';
import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { PermissionsService } from '@/services/Permissions';

// types
import type { TNewsInteractiveDto, TTrailDto } from '@/types/dto.types';
import type { ServerResponse, TClientMeta } from '@/types/index.interface';

type TGetTrails = {
  bikeType: string | null;
  region: string | null;
  difficultyLevel: string | null;
  search: string;
};

export async function getTrails({ bikeType, region, difficultyLevel, search }: TGetTrails) {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const trailService = new Trail();
    const trails = await trailService.getMany({
      bikeType,
      region,
      difficultyLevel,
      idUserDB: session?.user.idDB,
      search,
    });
    return trails;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Получение данных маршрута с БД.
 */
export async function getTrail(urlSlug: string): Promise<TTrailDto | null | undefined> {
  'use server';
  const session = await getServerSession(authOptions);

  const idUserDB = session?.user.idDB;

  const trailsService = new Trail();
  const response = await trailsService.getOne(urlSlug, idUserDB);

  if (!response.ok) {
    return null;
  }

  return response.data;
}

/**
 * Получение данных маршрута с БД.
 */
export async function deleteTrail({
  urlSlug,
  client,
}: {
  urlSlug: string;
  client: TClientMeta;
}): Promise<ServerResponse<null>> {
  try {
    // Получаем текущую сессию пользователя с использованием next-auth.
    const session = await getServerSession(authOptions);

    // Проверяем, есть ли у пользователя ID в базе данных.
    const idUserDB = session?.user.idDB;
    if (!idUserDB) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверяем, что urlSlug существует и имеет тип строки.
    if (!urlSlug || typeof urlSlug !== 'string') {
      throw new Error('Некорректный или отсутствующий urlSlug!');
    }

    // Определяем требуемое разрешение для редактирования новости.
    const permission = 'moderation.trails.delete';

    const res = await PermissionsService.checkPermission({
      entity: 'trail',
      urlSlug,
      idUserDB,
      permission,
    });

    // Если прав недостаточно, возвращаем ошибку.
    if (!res.ok) {
      throw new Error(res.message);
    }

    const trailsService = new Trail();
    const response = await trailsService.delete({ urlSlug, moderator: idUserDB, client });

    revalidatePath('moderation/trails');
    return response;
  } catch (error) {
    errorLogger(error);
    return handlerErrorDB(error);
  }
}

/**
 * Установка/снятие лайка для маршрута.
 */
export async function setLike(idDocument: string): Promise<ServerResponse<null>> {
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    // Проверка, что новость загружена с сервера.
    if (!idDocument) {
      throw new Error('Не найден маршрут!');
    }

    // Проверка авторизации пользователя.
    if (!idUserDB) {
      throw new Error('Необходима авторизация и наличие idUserDB!');
    }

    const trail = new Trail();

    const res = await trail.countLike({ idUserDB, idTrail: idDocument });
    return res;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Серверный экшен, получает данные для интерактивного блока маршрута idNews.TNewsInteractiveDto
 */
export async function getInteractive(
  idDocument: string
): Promise<ServerResponse<null> | ServerResponse<TNewsInteractiveDto>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);
    const idUserDB = session?.user.idDB;

    const trailService = new Trail();
    const response = await trailService.getInteractive({ idUserDB, idTrail: idDocument });

    return response;
  } catch (error) {
    return handlerErrorDB(error);
  }
}

/**
 * Запрос прогноза погоды на 6ть дней.
 */
export async function getForecastWeather({
  urlTrack,
}: {
  urlTrack: string;
}): Promise<TWeatherForecast | null> {
  try {
    const data = await getGPSData(urlTrack);

    const positionsParsed = () => {
      const startPoint = data.gpx.trk[0].trkseg[0].trkpt[0];
      return {
        lat: parseFloat(startPoint.$.lat),
        lon: parseFloat(startPoint.$.lon),
      };
    };

    // Координаты старта.
    const { lat, lon } = positionsParsed();

    const weatherService = new WeatherService();
    const res: ServerResponse<TWeatherForecast | null> = await weatherService.getRaw({
      lat,
      lon,
      type: 'forecast',
    });

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res.data;
  } catch (error) {
    return null;
  }
}

/**
 * Создание маршрута.
 */
export async function postTrail(formData: FormData): Promise<ServerResponse<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const author = session?.user.idDB;
    if (!author) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Разрешение для создание маршрута.
    const permission = 'moderation.trails.create';
    const permissionAdmin = 'all';

    // Проверка наличия прав на создание маршрута.
    if (
      !session.user.role.permissions.some(
        (elm) => elm === permission || elm === permissionAdmin
      )
    ) {
      throw new Error('У вас нет прав для создания маршрута!');
    }

    const trailService = new Trail();
    const response = await trailService.post({ formData, author });

    revalidatePath(`/trails`);

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Обновление данных маршрута.
 */
export const putTrail = async (formData: FormData) => {
  try {
    // Получаем текущую сессию пользователя с использованием next-auth.
    const session = await getServerSession(authOptions);

    // Проверяем, есть ли у пользователя ID в базе данных.
    const idUserDB = session?.user.idDB;
    if (!idUserDB) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Извлекаем urlSlug (уникальный идентификатор страницы) из formData.
    const urlSlug = formData.get('urlSlug');
    // Проверяем, что urlSlug существует и имеет тип строки.
    if (!urlSlug || typeof urlSlug !== 'string') {
      throw new Error('Некорректный или отсутствующий urlSlug!');
    }

    // Определяем требуемое разрешение для редактирования новости.
    const permission = 'moderation.trails.edit';

    const res = await PermissionsService.checkPermission({
      entity: 'trail',
      urlSlug,
      idUserDB,
      permission,
    });

    // Если прав недостаточно, возвращаем ошибку.
    if (!res.ok) {
      throw new Error(res.message);
    }

    const trailService = new Trail();
    const response = await trailService.put({ formData, moderator: idUserDB });

    revalidatePath(`/`);

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
};
