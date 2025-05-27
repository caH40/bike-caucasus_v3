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
export class RacePointsTable {
  private errorLogger;
  private handlerErrorDB;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Получение данных по очковой таблицы по _id - racePointsTableId.
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

      const racePointsAfterDto = racePointsTableDto(pTableDB);

      return {
        data: racePointsAfterDto,
        ok: true,
        message: 'Данные таблицы начисления очков в заездах для Series',
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
