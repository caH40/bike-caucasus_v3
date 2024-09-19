import mongoose from 'mongoose';

import { connectToMongo } from '@/database/mongodb/mongoose';
import { errorLogger } from '@/errors/error';
import { ResponseServer, TFormRole } from '@/types/index.interface';
import { handlerErrorDB } from './mongodb/error';
import { Permission as PermissionModel } from '@/database/mongodb/Models/Permission';
import { dtoPermission, dtoPermissions } from '@/dto/permissions';
import type { TPermissionDocument } from '@/types/models.interface';
import type { TPermissionDto } from '@/types/dto.types';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { Trail as TrailModel } from '@/database/mongodb/Models/Trail';
import { News as NewsModel } from '@/database/mongodb/Models/News';
import { Role as RoleModel } from '@/database/mongodb/Models/Role';

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

  /**
   * Создание нового Роли.
   */
  public async postRole({ newRole }: { newRole: TFormRole }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const checkedDuplicate = await RoleModel.findOne({ name: newRole.name }).lean();

      if (checkedDuplicate) {
        throw new Error('Роль с таким названием уже существует!');
      }

      const res = await RoleModel.create(newRole);

      if (!res) {
        throw new Error('Неизвестная ошибка при создании роли');
      }

      return {
        data: null,
        ok: true,
        message: `Роль ${res.name} успешно создана!`,
      };
    } catch (error) {
      await this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Проверка на наличие разрешений у пользователя для удаления, редактирование новости.
   * Удалять, редактировать может админ или пользователь, создавший новость.
   */
  static async checkPermission({
    entity,
    urlSlug,
    idUserDB,
    permission,
  }: {
    entity: 'news' | 'trail';
    urlSlug: string;
    idUserDB: string;
    permission: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await connectToMongo();

      // Проверка, является ли модератор, удаляющий,редактирующий новость, администратором.
      const user: { role: { name: string; permissions: string[] } } | null =
        await UserModel.findOne({ _id: idUserDB }, { role: true })
          .populate({ path: 'role', select: ['permissions', 'name', '-_id'] })
          .lean();

      // Проверка наличия пользователя и его разрешений.
      if (!user) {
        throw new Error('Пользователь не найден!');
      }

      // Ответ на успешную проверку разрешения на выполняемую модерацию.
      const responseSuccess = {
        data: null,
        ok: true,
        message: `Получено разрешение на модерацию ${
          entity === 'news' ? 'новости' : 'маршрута'
        } с urlSlug:${urlSlug}!`,
      };

      // Администраторы могут модифицировать любую новость.
      if (user.role.name === 'admin') {
        return responseSuccess;
      }

      if (!user.role.permissions.includes(permission)) {
        throw new Error('У вас нет прав на выполнение данной операции!');
      }

      // Универсальный поиск по типу сущности
      const Model = entity === 'news' ? NewsModel : TrailModel;
      const nameEntity = entity === 'news' ? 'новости' : 'маршрута';

      const response = await Model.findOne({ urlSlug, author: idUserDB }, { _id: true });

      if (!response) {
        throw new Error(`У вас нет прав на модерацию данного ${nameEntity}!`);
      }

      return responseSuccess;
    } catch (error) {
      errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Проверка на соответствие Организатора, который создал модерируемы Чемпионат и Организатора с userId пользователя, который запрашивает действие на модерацию. Модерировать может администратор.
   */
  static async checkPermissionOrganizer({
    organizerId,
    championshipId,
    userIdDB,
  }: {
    organizerId: string;
    championshipId: string;
    userIdDB: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await connectToMongo();

      const userDB: { role: { name: string } } | null = await UserModel.findOne(
        { _id: userIdDB },
        { _id: false, role: true }
      )
        .populate({ path: 'role', select: ['name', '-_id'] })
        .lean();

      // Проверка найденного пользователя.
      if (!userDB) {
        throw new Error(
          `Не найден пользователь, запрашиваемый модерацию, в БД с _id${userIdDB}`
        );
      }

      // Ответ на успешную проверку разрешения на выполняемую модерацию.
      const responseSuccess = {
        data: null,
        ok: true,
        message: 'Модерация разрешена',
      };

      // Администратор может модерировать любые чемпионаты.
      if (userDB.role.name === 'admin') {
        return responseSuccess;
      }

      if (organizerId !== championshipId) {
        throw new Error(
          'Вы не являетесь Организатором или модератором для данного Чемпионата!'
        );
      }

      // Ответ на успешную проверку разрешения на выполняемую модерацию.
      return responseSuccess;
    } catch (error) {
      errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }
}
