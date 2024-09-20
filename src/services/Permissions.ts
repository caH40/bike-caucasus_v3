import mongoose from 'mongoose';

import { connectToMongo } from '@/database/mongodb/mongoose';
import { errorLogger } from '@/errors/error';
import { ResponseServer, TFormRole } from '@/types/index.interface';
import { handlerErrorDB } from './mongodb/error';
import { Permission as PermissionModel } from '@/database/mongodb/Models/Permission';
import { dtoPermission, dtoPermissions, dtoRole, dtoRoles } from '@/dto/permissions';
import type { TPermissionDocument, TRoleModel } from '@/types/models.interface';
import type { TPermissionDto, TRoleDto } from '@/types/dto.types';
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
      this.errorLogger(error);
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
      this.errorLogger(error);
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
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Удаление Разрешения с _id.
   */
  public async delete({ _id }: { _id: string }): Promise<ResponseServer<null>> {
    try {
      // Проверка строки _id на валидность
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error(`Неверный формат _id: ${_id}`);
      }
      // Подключение к БД.
      await this.dbConnection();

      // Удаление Разрешения.
      const permissionDB: { _id: mongoose.Types.ObjectId; name: string } | null =
        await PermissionModel.findOneAndDelete({ _id }, { _id: true, name: true }).lean();

      if (!permissionDB) {
        throw new Error(`Не найдено Разрешение с _id:${_id}`);
      }

      // Удаление удаленного Разрешения из массива разрешений в Ролях.
      const rolesDB = await RoleModel.updateMany(
        { permissions: permissionDB.name },
        { $pull: { permissions: permissionDB.name } }
      );

      if (!rolesDB.acknowledged) {
        throw new Error(`Ошибки при удалении Разрешения ${permissionDB.name} из Ролей`);
      }

      return {
        data: null,
        ok: true,
        message: `Удалено Разрешение "${permissionDB.name}"`,
      };
    } catch (error) {
      this.errorLogger(error);
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
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение Роли пользователей на сайте.
   */
  public async getRole({ _id }: { _id: string }): Promise<ResponseServer<TRoleDto | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const roleDB: TRoleModel | null = await RoleModel.findOne({ _id }).lean();

      if (!roleDB) {
        throw new Error(`Не найдена запрашиваемая Роль с _id:${_id}`);
      }

      const roleAfterDto = dtoRole(roleDB);
      return {
        data: roleAfterDto,
        ok: true,
        message: 'Запрашиваемая Роль на сайте.',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех Ролей пользователей на сайте.
   */
  public async getRoles(): Promise<ResponseServer<TRoleDto[] | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const rolesDB: TRoleModel[] = await RoleModel.find().lean();

      const rolesAfterDto = dtoRoles(rolesDB);
      return {
        data: rolesAfterDto,
        ok: true,
        message: 'Все существующие Роли на сайте.',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение всех Ролей пользователей на сайте.
   */
  public async deleteRole({ _id }: { _id: string }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const res: { _id: mongoose.Types.ObjectId; name: string } | null =
        await RoleModel.findOneAndDelete({ _id }, { _id: true, name: true }).lean();

      if (!res) {
        throw new Error(`Не найдена Роль с _id:${_id}`);
      }

      return {
        data: null,
        ok: true,
        message: `Удалена Роль "${res.name}"`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление данных Роли.
   */
  public async putRole({
    roleEdited,
  }: {
    roleEdited: TFormRole;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();
      const res = await RoleModel.findOneAndUpdate(
        { _id: roleEdited._id },
        { $set: { description: roleEdited.description, permissions: roleEdited.permissions } }
      );

      if (!res) {
        throw new Error(`Роль с _id ${roleEdited._id} не найдена!`);
      }

      return {
        data: null,
        ok: true,
        message: `Данные Роли ${roleEdited.name} успешно обновлены!`,
      };
    } catch (error) {
      this.errorLogger(error);
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
