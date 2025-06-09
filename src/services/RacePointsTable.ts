import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

// types
import type {
  ServerResponse,
  TRacePointsTableForm,
  TServiceEntity,
} from '@/types/index.interface';
import { RacePointsTableModel } from '@/database/mongodb/Models/RacePointsTable';
import { TRacePointsTable } from '@/types/models.interface';
import { TRacePointsTableDto } from '@/types/dto.types';
import { racePointsTableDto } from '@/dto/race-points-table';
import { ModeratorActionLogService } from './ModerationActionLog';

/**
 * Класс работы с сущностью Таблицы начисления очков за заезд для серии заездов (Series).
 */
export class RacePointsTableService {
  private errorLogger;
  private handlerErrorDB;
  private entity: TServiceEntity;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.entity = 'racePointsTable';
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
  public async create({
    racePointsTableForm,
    moderator,
  }: {
    racePointsTableForm: TRacePointsTableForm;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      const response = await RacePointsTableModel.create(racePointsTableForm);

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Создание таблицы начисления очков за этапы серии заездов: "${response.name}"`,
          params: {
            racePointsTableForm,
            moderator,
          },
        },
        action: 'create',
        entity: this.entity,
        entityIds: [response._id.toString()],
      });

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
  public async update({
    racePointsTableForm,
    moderator,
  }: {
    racePointsTableForm: TRacePointsTableForm & { _id: string };
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      const { _id, ...updateFields } = racePointsTableForm;

      const response = await RacePointsTableModel.findOneAndUpdate(
        { _id },
        { $set: updateFields },
        { new: true }
      ).lean<TRacePointsTable>();

      if (!response) {
        throw new Error(
          `Не найдена таблица начисления очков с _id: ${racePointsTableForm._id}`
        );
      }

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Обновление данных таблицы начисления очков за этапы серии заездов: "${response.name}"`,
          params: {
            racePointsTableForm,
            moderator,
          },
        },
        action: 'update',
        entity: this.entity,
        entityIds: [response._id.toString()],
      });

      return {
        data: null,
        ok: true,
        message: `Обновлены данные таблицы очков "${response.name}".`,
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
    moderator,
  }: {
    racePointsTableId: string;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      const response = await RacePointsTableModel.findByIdAndDelete(
        racePointsTableId
      ).lean<TRacePointsTable>();

      if (!response) {
        throw new Error(`Не найдена таблица начисления очков с _id: ${racePointsTableId}`);
      }

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Удаление таблицы начисления очков за этапы серии заездов: "${response.name}"`,
          params: {
            racePointsTableId,
            moderator,
          },
        },
        action: 'delete',
        entity: this.entity,
        entityIds: [response._id.toString()],
      });

      return {
        data: null,
        ok: true,
        message: `Удалена таблица очков "${response.name}".`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
