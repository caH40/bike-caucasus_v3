/**
 * Данные профиля для клиента
 */
export interface IProfileForClient {
  id: number;
  email?: string; // не всегда отправляется
  emailConfirm?: boolean; // не всегда отправляется
  image?: string;
  imageFromProvider: boolean;
  credentials?: {
    username: string; // при регистрации через логин/пароль
  };
  provider: {
    name: string;
    image?: string;
  };
  person: {
    firstName: string;
    patronymic?: string;
    lastName: string;
    birthday?: string;
    ageCategory: string; // вместо даты рождения возвращается возрастная категория
    gender: string;
    bio?: string;
  };
  city?: string;
  phone?: string; // не всегда отправляется
  team?: {
    id?: number;
    name: string;
  };
  role: string; // !!!! изменить структуру данных, добавить разрешения
  social: {
    telegram?: string;
    vk?: string;
    youtube?: string;
    komoot?: string;
    strava?: string;
    whatsapp?: string;
    garminConnect?: string;
  };
}
