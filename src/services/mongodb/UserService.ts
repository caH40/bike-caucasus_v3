import { User } from '@/database/mongodb/Models/User';
import { handlerErrorDB } from './error';
import { connectToMongo } from '@/database/mongodb/mongoose';

import type { MessageServiceDB, TFormProfile } from '@/types/index.interface';
import type { IUserModel } from '@/types/models.interface';
import type { IProfileForClient } from '@/types/fetch.interface';
import path from 'path';
import { writeFile } from 'fs/promises';
import { handlerDateForm } from '@/libs/utils/date';
import { getGender } from '@/libs/utils/handler-data';

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
  private rootDir: string;

  constructor() {
    this.dbConnection = connectToMongo;
    this.rootDir = path.resolve(process.cwd());
  }

  // получение данных профиля
  async getProfile({
    idDB,
    id,
    isPrivate = false,
  }: ParamsGetProfile): Promise<MessageServiceDB<IProfileForClient>> {
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

      const profile: IProfileForClient = { ...userDB, person };
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

  /**
   * Сохранение данных профиля из формы account/profile
   */
  async putProfile(profileEdited: FormData) {
    try {
      const profile = {} as TFormProfile;

      profileEdited.forEach((value, key) => (profile[key] = value));

      if (!profile.id) {
        throw new Error('Нет id пользователя');
      }
      // подключение к БД
      await this.dbConnection();

      // сохранение изображения для профиля
      if (!!profile.image) {
        const bytes = await profile.image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const extension = profile.image.name?.split('.')?.at(-1) ?? 'jpg';

        const pathImageProfile = `/public/uploads/profiles/user_${profile.id}`;
        const pathCurrent = path.join(this.rootDir, pathImageProfile, `avatar.${extension}`);

        await writeFile(pathCurrent, buffer);
      }

      const gender = getGender[profile.gender];
      const birthday = handlerDateForm.getIsoDate(profile.birthday);

      await User.findOneAndUpdate(
        { id: profile.id },
        {
          $set: {
            'person.lastName': profile.lastName,
            'person.firstName': profile.firstName,
            'person.patronymic': profile.patronymic,
            'person.birthday': birthday,
            'person.gender': gender,
            city: profile.city,
            bio: profile.bio,
          },
        }
      );

      // console.log(savedData);

      return { data: null, ok: true, message: 'Обновленные данные профиля сохранены!' };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }
}
