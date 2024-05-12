import { revalidatePath } from 'next/cache';

import { connectToMongo } from '@/database/mongodb/mongoose';
import { handlerDateForm } from '@/libs/utils/date';
import { getGender } from '@/libs/utils/handler-data';
import { Cloud } from '../cloud';
import { User } from '@/database/mongodb/Models/User';
import { handlerErrorDB } from './error';
import type { MessageServiceDB, TFormProfile } from '@/types/index.interface';
import type { IUserModel } from '@/types/models.interface';
import type { IProfileForClient } from '@/types/fetch.interface';

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
        'credentials._id': false,
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
   * Обновляет профиль пользователя в базе данных и загружает новое изображение профиля, если оно было изменено.
   * @param {FormData} profileEdited - Данные профиля, включая измененные поля.
   * @param {Object} options - Объект с параметрами для загрузки изображения. Для `https://${bucketName}.${domainCloudName}/${fileName}
   * @param options.cloudName - Название облачного сервиса для загрузки изображения (должно быть 'vk').
   * @param options.bucketName - Название бакета для загрузки изображения.
   * @param options.domainCloudName - Доменное имя облачного сервиса для формирования URL изображения.
   * @returns Объект с результатом операции или ошибкой.
   */
  async putProfile(
    profileEdited: FormData,
    {
      cloudName,
      bucketName,
      domainCloudName,
    }: { cloudName: 'vk'; bucketName: string; domainCloudName: string }
  ): Promise<MessageServiceDB<any>> {
    try {
      const profile = {} as TFormProfile;

      for (const [key, value] of [...profileEdited]) {
        profile[key] = value;
      }

      // Выброс ошибки, если отсутствует идентификатор пользователя в профиле.
      if (!profile.id) {
        throw new Error('Нет id пользователя');
      }
      // Подключение к БД.
      await this.dbConnection();

      // Сохранение изображения для профиля, если оно загружено.
      let fileNameFull = ''; // Название файла с расширением
      if (!!profile.image) {
        const file = profile.image;
        if (!file.type.startsWith('image/')) {
          throw new Error('Загружаемый файл не является изображением');
        }

        // Название файла без расширения
        const fileName = `user_${profile.id}_logo`;

        // создание объекта для управления файлами в облаке
        const cloud = new Cloud(cloudName);

        // удаление предыдущих файлов лого пользователя
        await cloud.deleteFiles(bucketName, fileName);

        const extension = file.name.split('.').pop();
        if (!extension) {
          throw new Error('Нет расширения у загружаемого изображения');
        }
        fileNameFull = `${fileName}.${extension}`;
        await cloud.saveFile(file, bucketName, fileNameFull);
      }

      // Получение значения пола в нужной форме.
      const gender = getGender[profile.gender];

      // Преобразование даты рождения в ISO формат.
      const birthday = handlerDateForm.getIsoDate(profile.birthday);

      // Формирование запроса для обновления профиля в базе данных.
      const query: any = {
        'person.lastName': profile.lastName,
        'person.firstName': profile.firstName,
        'person.patronymic': profile.patronymic,
        'person.birthday': birthday,
        'person.gender': gender,
        'person.bio': profile.bio,
        city: profile.city,
        imageFromProvider: profile.imageFromProvider === 'true',
      };

      //если загружалась новая фотография
      if (profile.image) {
        query.image = `https://${bucketName}.${domainCloudName}/${fileNameFull}`;
      }

      await User.findOneAndUpdate(
        { id: profile.id },
        {
          $set: query,
        }
      );
      revalidatePath('/');
      return { data: null, ok: true, message: 'Обновленные данные профиля сохранены!' };
    } catch (error) {
      return handlerErrorDB(error);
    }
  }
}
