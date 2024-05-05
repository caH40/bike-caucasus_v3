import { User } from '@/database/mongodb/Models/User';
import { connectToMongo } from '@/database/mongodb/mongoose';

import { type IProfileForClient } from '@/types/fetch.interface';
import { type IUserProfile, type IUserModel } from '@/types/models.interface';

/**
 * Сервис получение данных пользователя
 */
export async function fetchProfileService(
  id: number,
  isPublic = true
): Promise<IProfileForClient | null> {
  await connectToMongo();
  const userDB: IUserModel | null = await User.findOne(
    { id },
    {
      _id: false,
      'provider.id': false,
      'credentials.password': false,
      phone: false,
      email: false,
      createdAt: false,
      updatedAt: false,
      __v: false,
    }
  ).lean();

  if (!userDB) {
    throw new Error('Пользователь не найден');
  }

  // функция получения возрастной категории из даты рождения
  const ageCategory = userDB.person?.birthday;

  const person = { ...userDB.person, ageCategory };

  const profile: IUserProfile = { ...userDB, person };
  if (isPublic) {
    delete profile.person.birthday;
    delete profile.credentials;
  }

  return profile;
}
