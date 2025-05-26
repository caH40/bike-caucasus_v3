import { revalidatePath } from 'next/cache';

import { handlerDateForm } from '@/libs/utils/date';
import { getGender } from '@/libs/utils/handler-data';
import { Cloud } from './cloud';
import { User } from '@/database/mongodb/Models/User';
import { handlerErrorDB } from './mongodb/error';
import { getCategoryAgeProfile } from '@/libs/utils/age-category';
import { errorLogger } from '@/errors/error';
import { TProfileSimpleDto, TUserDto, TUserDtoPublic } from '@/types/dto.types';
import { dtoGetUser, dtoGetUserPublic, dtoGetUsersSimplePublic } from '@/dto/user';
import type {
  ResponseServer,
  TFormAccount,
  TFormProfile,
  TProfileSimpleFromDB,
  TUserModeratedData,
} from '@/types/index.interface';
import type { IUserModel, TRoleModel } from '@/types/models.interface';

type ParamsGetProfile = {
  idDB?: string;
  id?: Number;
  isPrivate?: boolean;
  ageCategoryVersion?: string; // Название версии категоризации по возрасту
};

/**
 * Запросы связанные с моделью User
 */
export class UserService {
  // eslint-disable-next-line no-unused-vars
  private errorLogger: (error: unknown) => Promise<void>;

  constructor() {
    this.errorLogger = errorLogger;
  }

  // получение данных профиля
  async getProfile({
    idDB,
    id,
    isPrivate = false,
    ageCategoryVersion = 'simple',
  }: ParamsGetProfile): Promise<ResponseServer<TUserDto | TUserDtoPublic | null>> {
    try {
      // подключение к БД

      // Проверка, должен быть один из параметров: только id, или только idDB.
      if (!id === !idDB) {
        throw new Error(
          'Обязательно должен быть один из параметров: только id, или только idDB'
        );
      }

      const query = id ? { id } : { _id: idDB };
      const userDB = await User.findOne(query, {
        'provider.id': false,
        'credentials.password': false,
        'credentials._id': false,
        'social._id': false,
        createdAt: false,
        updatedAt: false,
        __v: false,
      })
        .populate({ path: 'role', select: ['name', 'description', 'permissions'] })
        .lean<Omit<IUserModel, 'role'> & { role: TRoleModel }>();

      if (!userDB) {
        throw new Error('Пользователь не найден');
      }

      // Функция получения возрастной категории из даты рождения.
      const ageCategory = await getCategoryAgeProfile({
        birthday: userDB.person?.birthday,
        ageCategoryVersion,
        gender: userDB.person.gender,
      });

      const userPrivate = dtoGetUser(userDB);

      // Заполнение Имени и Фамилии данными, если они не заданны.
      const userFilledName = {
        ...userPrivate,
        person: {
          ...userPrivate.person,
          firstName: userPrivate.person.firstName,
          lastName: userPrivate.person.lastName,
        },
      };

      const profile = isPrivate ? userPrivate : dtoGetUserPublic(userFilledName, ageCategory);

      return { data: profile, ok: true, message: 'Данные профиля пользователя' };
    } catch (error) {
      this.errorLogger(error);
      return handlerErrorDB(error);
    }
  }

  /**
   * Получает все профили зарегистрированных пользователей.
   */
  async getProfiles(): Promise<ResponseServer<TUserDto[] | null>> {
    try {
      // Подключение к базе данных

      // Получение всех пользователей из базы данных и преобразование результата в простой объект JavaScript
      const usersDB = await User.find(
        {},
        {
          'provider.id': false,
          'provider._id': false,
          'credentials.password': false,
          'credentials._id': false,
          'social._id': false,
        }
      )
        .populate('role')
        .lean<(Omit<IUserModel, 'role'> & { role: TRoleModel })[]>();

      // Заполнение Имени и Фамилии данными, если они не заданны.
      const usersFilledName = usersDB.map((user) => ({
        ...user,
        person: {
          ...user.person,
          firstName: user.person.firstName || 'Имя',
          lastName: user.person.lastName || 'Фамилия',
        },
      }));

      const users = usersFilledName.map((user) => dtoGetUser(user));

      // Возвращение данных всех пользователей с успешным статусом
      return { data: users, ok: true, message: 'Данные всех пользователей.' };
    } catch (error) {
      this.errorLogger(error);
      return handlerErrorDB(error);
    }
  }

  /**
   * Получает все профили зарегистрированных пользователей.
   */
  async putUserModeratedData({
    user,
  }: {
    user: TUserModeratedData;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к базе данных

      const query = {
        role: user.roleId,
        ...(user.person.firstName && { 'person.firstName': user.person.firstName }),
        ...(user.person.lastName && { 'person.lastName': user.person.lastName }),
        ...(user.person.patronymic && { 'person.patronymic': user.person.patronymic }),
        ...(user.person.gender && { 'person.gender': user.person.gender }),
        ...(user.city && { city: user.city }),
      };

      const userDB = await User.findOneAndUpdate({ id: user.id }, { ...query });

      if (!userDB) {
        throw new Error(`Не найден пользователь для изменения данных с id:${user.id}`);
      }

      // Возвращение данных всех пользователей с успешным статусом
      return { data: null, ok: true, message: 'Данные всех пользователей.' };
    } catch (error) {
      this.errorLogger(error);
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
  async putProfile(profileEdited: FormData): Promise<ResponseServer<null>> {
    try {
      const profile = {} as TFormProfile;

      for (const [key, value] of [...profileEdited]) {
        profile[key] = value;
      }

      // Выброс ошибки, если отсутствует идентификатор пользователя в профиле.
      if (!profile.id) {
        throw new Error('Нет id пользователя');
      }

      // Сохранение изображения для профиля, если оно загружено.
      let imageUrlForSave = ''; // URL до изображении, сохраненного в облаке.
      if (!!profile.image) {
        const file = profile.image;
        if (!file.type.startsWith('image/')) {
          throw new Error('Загружаемый файл не является изображением');
        }

        // Название файла без расширения
        const fileNamePrefix = `user_${profile.id}_logo`;

        // создание объекта для управления файлами в облаке
        const cloud = new Cloud();

        const extension = file.name.split('.').pop();
        if (!extension) {
          throw new Error('Нет расширения у загружаемого изображения');
        }

        // Удаление предыдущих файлов лого пользователя.
        // !!! Если будет ошибка при сохранении файла, то предыдущий удалится, а новый не сохраниться.
        await cloud.deleteFiles({ prefix: fileNamePrefix });

        const suffix = Date.now();
        // Название файла.
        const fileNameFull = `${fileNamePrefix}-${suffix}.${extension}`;

        const { data } = await cloud.postFile({ file, fileName: fileNameFull });
        if (!data) {
          throw new Error('Нет данных сохраненного изображения в Облаке');
        }
        imageUrlForSave = `https://${data.file.bucketName}.${data.file.endpointDomain}/${fileNameFull}`;
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
        query.image = imageUrlForSave;
      }

      await User.findOneAndUpdate(
        { id: profile.id },
        {
          $set: query,
        }
      );

      // Обновления ревалидация данных на указанных страницах.
      revalidatePath(`/profile/${profile.id}`);
      // revalidatePath('/admin/users'); // эта страница с 'force-dynamic'
      return { data: null, ok: true, message: 'Обновленные данные профиля сохранены!' };
    } catch (error) {
      // this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Обновляет информацию об аккаунте пользователя.
   * @param accountEdited - Отредактированные данные аккаунта пользователя.
   * @returns Промис, содержащий информацию об успешном выполнении операции или об ошибке.
   */
  public async putAccount(accountEdited: TFormAccount): Promise<ResponseServer<null>> {
    try {
      // Выбрасывается ошибка, если отсутствует идентификатор пользователя в профиле.
      if (!accountEdited.id) {
        throw new Error('Нет id пользователя');
      }

      // Подключение к базе данных.

      // Формирование запроса для обновления профиля в базе данных.
      const query: any = {
        'social.telegram': accountEdited.social.telegram,
        'social.vk': accountEdited.social.vk,
        'social.strava': accountEdited.social.strava,
        'social.komoot': accountEdited.social.komoot,
        'social.whatsapp': accountEdited.social.whatsapp,
        'social.garminConnect': accountEdited.social.garminConnect,
        phone: accountEdited.phone,
        'preferences.showPatronymic': accountEdited.preferences.showPatronymic,
      };

      // Обновление данных профиля в базе данных.
      await User.findOneAndUpdate(
        { id: accountEdited.id },
        {
          $set: query,
        }
      );

      // Обновление пути валидации.
      revalidatePath(`/account`);

      return { data: null, ok: true, message: 'Обновленные данные профиля сохранены!' };
    } catch (error) {
      this.errorLogger(error); // логирование
      return handlerErrorDB(error);
    }
  }

  /**
   * Получение списка пользователей по поисковой фразе для фамилии.
   */
  public async findUsers(
    lastNameSearch: string
  ): Promise<ResponseServer<TProfileSimpleDto[] | null>> {
    try {
      // Выбрасывается ошибка, если отсутствует идентификатор пользователя в профиле.
      if (lastNameSearch?.length < 3) {
        throw new Error('Поиск осуществляется по запросу больше чем 2 символа!');
      }

      // Подключение к базе данных.

      // Обновление данных профиля в базе данных.
      const usersDB: TProfileSimpleFromDB[] = await User.find(
        {
          'person.lastName': { $regex: lastNameSearch, $options: 'i' },
        },
        {
          _id: false,
          id: true,
          'person.firstName': true,
          'person.lastName': true,
          'person.patronymic': true,
          'person.birthday': true,
          'person.gender': true,
          city: true,
        }
      );

      const usersDto = dtoGetUsersSimplePublic(usersDB);

      return { data: usersDto, ok: true, message: 'Обновленные данные профиля сохранены!' };
    } catch (error) {
      this.errorLogger(error);
      return handlerErrorDB(error);
    }
  }
}
