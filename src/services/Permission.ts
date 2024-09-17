import { connectToMongo } from '@/database/mongodb/mongoose';
import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { News as NewsModel } from '@/database/mongodb/Models/News';
import { Trail as TrailModel } from '@/database/mongodb/Models/Trail';
import { ResponseServer } from '@/types/index.interface';

/**
 * Сервисы с разрешениями.
 */
export class PermissionService {
  private static errorLogger = errorLogger;
  private static handlerErrorDB = handlerErrorDB;

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
      PermissionService.errorLogger(error); // логирование
      return PermissionService.handlerErrorDB(error);
    }
  }
}
