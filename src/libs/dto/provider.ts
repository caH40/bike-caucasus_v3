type ProviderProfile = {
  provider: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  birthday?: string;
  gender?: string;
};
type Yandex = {
  id: string;
  login: string;
  client_id: string;
  display_name: string;
  real_name: string;
  first_name: string;
  last_name: string;
  sex: string;
  default_email: string;
  emails: [string];
  default_avatar_id: string;
  is_avatar_empty: boolean;
  psuid: string;
};
type Google = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
};
type Vk = {
  response: [
    {
      id: number;
      photo_100: string;
      first_name: string;
      last_name: string;
      can_access_closed: boolean;
      is_closed: boolean;
    }
  ];
};

/**
 * DTO для профиля получаемого с провайдеров yandex, vk, google
 */
export function getProviderProfileDto(profileData: unknown, provider: string): ProviderProfile {
  if (provider === 'yandex') {
    // Используем оператор as для приведения типа profileData к типу Yandex
    const yandexData = profileData as Yandex;
    return {
      provider: 'yandex',
      firstName: yandexData.first_name || '',
      lastName: yandexData.last_name || '',
      gender: yandexData.sex,
    };
  }

  if (provider === 'google') {
    // Используем оператор as для приведения типа profileData к типу Yandex
    const googleData = profileData as Google;
    return {
      provider: 'google',
      firstName: googleData.given_name || '',
      lastName: googleData.family_name || '',
    };
  }

  if (provider === 'vk') {
    // Используем оператор as для приведения типа profileData к типу Yandex
    const vkData = profileData as Vk;

    return {
      provider: 'vk',
      firstName: vkData.response[0]?.first_name || '',
      lastName: vkData.response[0]?.last_name || '',
    };
  }

  return {
    provider: 'не зарегистрированный провайдер',
    firstName: 'нет данных',
    lastName: 'нет данных',
  };
}
