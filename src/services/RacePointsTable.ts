import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

// types
import type { ServerResponse } from '@/types/index.interface';
import { RacePointsTableModel } from '@/database/mongodb/Models/RacePointsTable';
import { TRacePointsTable } from '@/types/models.interface';
import { TRacePointsTableDto } from '@/types/dto.types';
import { racePointsTableDto } from '@/dto/race-points-table';

/**
 * Класс работы с сущностью Таблицы начисления очков за заезд для серии заездов (Series).
 */
export class RacePointsTableService {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение данных по таблице начисления очков за этап серии по _id - racePointsTableId.
   */
  public async getOne({
    racePointsTableId,
  }: {
    racePointsTableId: string;
  }): Promise<ServerResponse<TRacePointsTableDto | null>> {
    try {
      const pTableDB = await RacePointsTableModel.findById(
        racePointsTableId
      ).lean<TRacePointsTable>();

      if (!pTableDB) {
        throw new Error(
          `Не найдена таблица начисления очков за заезд с _id: ${racePointsTableId}`
        );
      }

      const racePointsTableAfterDto = racePointsTableDto(pTableDB);

      return {
        data: racePointsTableAfterDto,
        ok: true,
        message: 'Данные таблицы начисления очков в заездах для Series',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех таблиц начисления очков за этап серии.
   */
  public async getAll({
    organizerId,
  }: {
    organizerId?: string;
  }): Promise<ServerResponse<TRacePointsTableDto[] | null>> {
    try {
      const query = organizerId ? { organizer: organizerId } : {};
      const pTablesDB = await RacePointsTableModel.find(query).lean<TRacePointsTable[]>();

      const racePointsTablesAfterDto = pTablesDB.map((pTable) => racePointsTableDto(pTable));

      return {
        data: racePointsTablesAfterDto,
        ok: true,
        message: organizerId
          ? 'Таблицы начисления очков для указанного организатора.'
          : 'Все таблицы начисления очков за этапы серии.',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Создание очковой таблицы.
   */
  public async create(): Promise<ServerResponse<null>> {
    try {
      return {
        data: null,
        ok: true,
        message: 'Создана очковая таблица',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление очковой таблицы.
   */
  public async update(): Promise<ServerResponse<null>> {
    try {
      return {
        data: null,
        ok: true,
        message: 'Обновлены данные очковой таблицы',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление очковой таблицы.
   */
  public async delete({
    racePointsTableId,
  }: {
    racePointsTableId: string;
  }): Promise<ServerResponse<null>> {
    try {
      return {
        data: null,
        ok: true,
        message: 'Удалена очковая таблица',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
