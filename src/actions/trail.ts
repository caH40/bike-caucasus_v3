import { errorLogger } from '@/errors/error';
import { Trail } from '@/services/Trail';
import { TTrailDto } from '@/types/dto.types';

/**
 * Получение данных маршрута с БД.
 */
export async function getTrail(urlSlug: string): Promise<TTrailDto | null | undefined> {
  'use server';
  try {
    const trailsService = new Trail();
    const response = await trailsService.getOne(urlSlug);

    if (!response.ok) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    errorLogger(error);
  }
}
