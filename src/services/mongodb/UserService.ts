import { User } from '@/database/mongodb/Models/User';
import type { MessageServiceDB } from '@/types/index.interface';
import type { IUserModel, IUserProfile } from '@/types/models.interface';
import { handlerErrorDB } from './error';
import { connectToMongo } from '@/database/mongodb/mongoose';

type ParamsGetProfile = {
  idDB?: string;
  id?: Number;
  isPrivate?: boolean;
};

/**
 * Запросы связанные с моделью User
 */
export class UserService {
  private dbConnection: () => Promise<void>;

  constructor() {
    this.dbConnection = connectToMongo;
  }

  // получение данных профиля
  async getProfile({
    idDB,
    id,
    isPrivate = false,
  }: ParamsGetProfile): Promise<MessageServiceDB<IUserProfile>> {
    try {
      // подключение к БД
      await this.dbConnection();

      // Проверка, должен быть один из параметров: только id, или только idDB
      if (!id === !idDB) {
        throw new Error(
          'Обязательно должен быть один из параметров: только id, или только idDB'
        );
      }

      const query = id ? { id } : { _id: idDB };
      const userDB: IUserModel | null = await User.findOne(query, {
        _id: false,
        'provider.id': false,
        'credentials.password': false,
        createdAt: false,
        updatedAt: false,
        __v: false,
      }).lean();

      if (!userDB) {
        throw new Error('Пользователь не найден');
      }

      // функция получения возрастной категории из даты рождения
      const ageCategory = userDB.person?.birthday;

      const person = { ...userDB.person, ageCategory };

      const profile: IUserProfile = { ...userDB, person };
      if (!isPrivate) {
        delete profile.person.birthday;
        delete profile.email;
        delete profile.phone;
        delete profile.credentials;
      }

      return { data: profile, ok: true, message: 'Публичные данные профиля пользователя' };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }
}
