import { connectToMongo } from '@/database/mongodb/mongoose';
import { errorLogger } from '@/errors/error';
import { ResponseServer } from '@/types/index.interface';
import { handlerErrorDB } from './mongodb/error';
import { Permission as PermissionModel } from '@/database/mongodb/Models/Permission';
import { dtoPermission, dtoPermissions } from '@/dto/permissions';
import type { TPermissionDocument } from '@/types/models.interface';
import type { TPermissionDto } from '@/types/dto.types';
import mongoose from 'mongoose';

/**
 * Класс работы с разрешениями (доступами) к ресурсам сайта.
 */
export class PermissionsService {
  private dbConnection: () => Promise<void>;
  private errorLogger: (error: unknown) => Promise<void>; // eslint-disable-line no-unused-vars
  private handlerErrorDB: (error: unknown) => ResponseServer<null>; // eslint-disable-line no-unused-vars

  constructor() {
    this.dbConnection = connectToMongo;
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
  }

  /**
   * Создание нового разрешения.
   */
  public async post({
    name,
    description,
  }: {
    name: string;
    description: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();
      const res = await PermissionModel.create({ name, description });

      if (!res) {
        throw new Error(`Разрешение (permission) ${name} не создано`);
      }

      return {
        data: null,
        ok: true,
        message: `Разрешение (permission) ${name} успешно создано!`,
      };
    } catch (error) {
      await this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление данных разрешения.
   */
  public async put({
    _id,
    name,
    description,
  }: {
    _id: string;
    name: string;
    description: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();
      const res = await PermissionModel.findOneAndUpdate(
        { _id },
        { $set: { name, description } }
      );

      if (!res) {
        throw new Error(`Разрешение (permission) ${name} не найдено!`);
      }

      return {
        data: null,
        ok: true,
        message: `Данные Разрешения (permission) ${name} успешно обновлены!`,
      };
    } catch (error) {
      await this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех разрешений.
   */
  public async getMany(): Promise<ResponseServer<TPermissionDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();
      const permissionsDB: TPermissionDocument[] = await PermissionModel.find().lean();

      return {
        data: dtoPermissions(permissionsDB),
        ok: true,
        message: 'Список всех разрешение (permission) для доступа к ресурсам сайта.',
      };
    } catch (error) {
      await this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение одного разрешения.
   */
  public async getOne({
    _id,
  }: {
    _id: string;
  }): Promise<ResponseServer<TPermissionDto | null>> {
    try {
      if (!_id) {
        throw new Error('Не передан _id Разрешения!');
      }

      // Подключение к БД.
      await this.dbConnection();
      const permissionDB: TPermissionDocument | null = await PermissionModel.findOne({
        _id,
      }).lean();

      if (!permissionDB) {
        throw new Error(`Разрешение (permission) _id:${_id} не найдено!`);
      }

      return {
        data: dtoPermission(permissionDB),
        ok: true,
        message: `Разрешение с _id:${_id}`,
      };
    } catch (error) {
      await this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление Разрешения с _id.
   */
  public async delete({ _id }: { _id: string }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();
      const res: { _id: mongoose.Types.ObjectId; name: string } | null =
        await PermissionModel.findOneAndDelete({ _id }, { _id: true, name: true }).lean();

      if (!res) {
        throw new Error(`Не найдено Разрешение с _id:${_id}`);
      }

      return {
        data: null,
        ok: true,
        message: `Удалено Разрешение "${res.name}"`,
      };
    } catch (error) {
      await this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}