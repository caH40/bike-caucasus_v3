'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { Trail } from '@/services/Trail';
import { handlerErrorDB } from '@/services/mongodb/error';
import type { TNewsInteractiveDto, TTrailDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';
import { errorLogger } from '@/errors/error';
import { revalidatePath } from 'next/cache';
import { TWeatherForecast } from '@/types/weather.types';
import { getGPSData } from './gpx';
import { WeatherService } from '@/services/Weather';

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
export async function deleteTrail(urlSlug: string): Promise<ResponseServer<null>> {
  try {
    const session = await getServerSession(authOptions);

    const idUserDB = session?.user.idDB;

    const trailsService = new Trail();
    const response = await trailsService.delete({ urlSlug, idUserDB });

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
export async function setLike(idDocument: string): Promise<ResponseServer<null>> {
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
): Promise<ResponseServer<null> | ResponseServer<TNewsInteractiveDto>> {
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
    const res: ResponseServer<TWeatherForecast | null> = await weatherService.getRaw({
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
