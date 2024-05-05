/**
 * Данные профиля
 */
export interface IProfileForClient {
  id: number;
  username: string;
  email?: string; // не всегда отправляется
  emailConfirm?: boolean; // не всегда отправляется
  image?: string;
  person: {
    firstName: string;
    patronymic?: string;
    lastName: string;
    ageCategory: string; // вместо даты рождения возвращается возрастная категория
    gender: string;
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
