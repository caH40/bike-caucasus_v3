import mongoose, { ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { ServerResponse, TFormRole } from '@/types/index.interface';
import { handlerErrorDB } from './mongodb/error';
import { Permission as PermissionModel } from '@/database/mongodb/Models/Permission';
import { dtoPermission, dtoPermissions, dtoRole, dtoRoles } from '@/dto/permissions';
import type { TPermissionDocument, TRoleModel } from '@/types/models.interface';
import type { TPermissionDto, TRoleDto } from '@/types/dto.types';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { Trail as TrailModel } from '@/database/mongodb/Models/Trail';
import { News as NewsModel } from '@/database/mongodb/Models/News';
import { Role as RoleModel } from '@/database/mongodb/Models/Role';
import { Document } from 'mongoose';

/**
 * Класс работы с разрешениями (доступами) к ресурсам сайта.
 */
export class PermissionsService {
  private errorLogger: (error: unknown) => Promise<void>; // eslint-disable-line no-unused-vars
  private handlerErrorDB: (error: unknown) => ServerResponse<null>; // eslint-disable-line no-unused-vars

  constructor() {
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
  }): Promise<ServerResponse<null>> {
    try {
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
  }): Promise<ServerResponse<null>> {
    try {
      const res = await PermissionModel.findOneAndUpdate({ _id }, { $set: { description } });

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
  public async getMany(): Promise<ServerResponse<TPermissionDto[] | null>> {
    try {
      const permissionsDB = await PermissionModel.find().lean<TPermissionDocument[]>();

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
  }): Promise<ServerResponse<TPermissionDto | null>> {
    try {
      if (!_id) {
        throw new Error('Не передан _id Разрешения!');
      }

      const permissionDB = await PermissionModel.findOne({
        _id,
      }).lean<TPermissionDocument>();

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
  public async delete({ _id }: { _id: string }): Promise<ServerResponse<null>> {
    try {
      // Проверка строки _id на валидность
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error(`Неверный формат _id: ${_id}`);
      }

      // Удаление Разрешения.
      const permissionDB = await PermissionModel.findOneAndDelete(
        { _id },
        { _id: true, name: true }
      ).lean<{ _id: mongoose.Types.ObjectId; name: string }>();

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
  public async postRole({ newRole }: { newRole: TFormRole }): Promise<ServerResponse<null>> {
    try {
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
  public async getRole({ _id }: { _id: string }): Promise<ServerResponse<TRoleDto | null>> {
    try {
      const roleDB = await RoleModel.findOne({ _id }).lean<TRoleModel>();

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
  public async getRoles(): Promise<ServerResponse<TRoleDto[] | null>> {
    try {
      const rolesDB = await RoleModel.find().lean<TRoleModel[]>();

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
  public async deleteRole({ _id }: { _id: string }): Promise<ServerResponse<null>> {
    try {
      // Получение id Роли User.
      const roleUser = await RoleModel.findOne({ name: 'user' }, { _id: true }).lean<{
        _id: ObjectId;
      }>();

      if (!roleUser) {
        throw new Error(
          'Не найдена роль user для использования её в качестве замены удаляемой роли у пользователей!'
        );
      }

      // Удаление Роли.
      const roleDB: ({ _id: mongoose.Types.ObjectId; name: string } & Document) | null =
        await RoleModel.findOne({ _id }, { _id: true, name: true });

      if (!roleDB) {
        throw new Error(`Не найдена Роль с _id:${_id}`);
      }

      if (['admin', 'user'].includes(roleDB.name)) {
        throw new Error('Нельзя удалять роли "admin" или "user"!');
      }

      await roleDB.deleteOne();

      const usersDB = await UserModel.updateMany(
        { role: roleDB._id },
        { $set: { role: roleUser._id } }
      );

      if (!usersDB.acknowledged) {
        throw new Error(
          `Ошибки при замене Роли ${roleDB.name} в документах User на роль "user"`
        );
      }

      return {
        data: null,
        ok: true,
        message: `Удалена Роль "${roleDB.name}"`,
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
  }): Promise<ServerResponse<null>> {
    try {
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
  }): Promise<ServerResponse<null>> {
    try {
      // Проверка, является ли модератор, удаляющий,редактирующий новость, администратором.
      const user = await UserModel.findOne({ _id: idUserDB }, { role: true })
        .populate({ path: 'role', select: ['permissions', 'name', '-_id'] })
        .lean<{ role: { name: string; permissions: string[] } }>();

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
  }): Promise<ServerResponse<null>> {
    try {
      const userDB = await UserModel.findOne({ _id: userIdDB }, { _id: false, role: true })
        .populate({ path: 'role', select: ['name', '-_id'] })
        .lean<{ role: { name: string } }>();

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
