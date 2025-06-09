'use server';

import { errorHandlerClient } from './error-handler';
import { parseError } from '@/errors/parse';
import { handlerErrorDB } from '@/services/mongodb/error';
import { RacePointsTableService } from '@/services/RacePointsTable';
import { checkIsOrganizer, checkUserAccess } from '@/libs/utils/auth/checkUserPermission';

// types
import type { ServerResponse, TRacePointsTableForm } from '@/types/index.interface';
import { TRacePointsTableDto } from '@/types/dto.types';

/**
 * Экшен получения данных по таблице начисления очков за этап серии по _id.
 */
export async function getRacePointsTable({
  racePointsTableId,
}: {
  racePointsTableId: string;
}): Promise<ServerResponse<TRacePointsTableDto | null>> {
  try {
    const racePointsTableService = new RacePointsTableService();
    const racePointsTable = await racePointsTableService.getOne({ racePointsTableId });

    if (!racePointsTable.ok) {
      throw new Error(racePointsTable.message);
    }

    return racePointsTable;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен получения всех таблиц начисления очков за этап серии, созданных организатором.
 * Если organizerId не передан, значит возвращаются все таблице из БД.
 */
export async function getRacePointsTables(): Promise<
  ServerResponse<TRacePointsTableDto[] | null>
> {
  try {
    // Проверка, есть ли у пользователя разрешение на модерацию чемпионата.
    const user = await checkUserAccess('moderation.championship');

    // Проверка, является ли пользователь userIdDB организатором.
    const organizer = await checkIsOrganizer(user.userIdDB);

    const racePointsTableService = new RacePointsTableService();
    const racePointsTables = await racePointsTableService.getAll({
      organizerId: organizer._id,
    });

    if (!racePointsTables.ok) {
      throw new Error(racePointsTables.message);
    }

    return racePointsTables;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен создания таблицы начисления очков за этап серии.
 */
export async function createRacePointsTable(
  racePointsTableForm: TRacePointsTableForm
): Promise<ServerResponse<null>> {
  try {
    // Проверка, есть ли у пользователя разрешение на модерацию чемпионата.
    const { userIdDB } = await checkUserAccess('moderation.championship');

    // Проверка, является ли пользователь userIdDB организатором.
    await checkIsOrganizer(userIdDB);

    const racePointsTableService = new RacePointsTableService();
    const created = await racePointsTableService.create({
      racePointsTableForm,
      moderator: userIdDB,
    });

    if (!created.ok) {
      throw new Error(created.message);
    }

    return created;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен обновления таблицы начисления очков за этап серии.
 */
export async function updateRacePointsTable(
  racePointsTableForm: TRacePointsTableForm
): Promise<ServerResponse<null>> {
  try {
    // Проверка, есть ли у пользователя разрешение на модерацию чемпионата.
    const { userIdDB } = await checkUserAccess('moderation.championship');

    if (!racePointsTableForm._id) {
      throw new Error('Не получен _id таблицы!');
    }

    // Проверка, есть ли у пользователя разрешение на модерацию чемпионата.
    const res = await checkUserAccess('moderation.championship');

    // Проверка, является ли пользователь userIdDB организатором.
    await checkIsOrganizer(res.userIdDB);

    const racePointsTableService = new RacePointsTableService();
    const created = await racePointsTableService.update({
      racePointsTableForm: {
        ...racePointsTableForm,
        _id: racePointsTableForm._id,
      },
      moderator: userIdDB,
    });

    if (!created.ok) {
      throw new Error(created.message);
    }

    return created;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Экшен удаления таблицы начисления очков за этап серии.
 */
export async function deleteRacePointsTable(
  racePointsTableId: string
): Promise<ServerResponse<null>> {
  try {
    // Проверка, есть ли у пользователя разрешение на модерацию чемпионата.
    const { userIdDB } = await checkUserAccess('moderation.championship');

    // Проверка, является ли пользователь userIdDB организатором.
    await checkIsOrganizer(userIdDB);

    const racePointsTableService = new RacePointsTableService();
    const created = await racePointsTableService.delete({
      racePointsTableId,
      moderator: userIdDB,
    });

    if (!created.ok) {
      throw new Error(created.message);
    }

    return created;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}
