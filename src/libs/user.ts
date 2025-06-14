import { TClientUser } from '@/types/index.interface';

/**
 * Формирование структуры данных для отображение данных райдера с выбором изображения в зависимости от настроек.
 */
export function getUserDataDto({
  imageFromProvider,
  downloadedImage,
  providerImage,
  profile,
  id,
}: {
  profile: any;
  imageFromProvider: boolean;
  downloadedImage?: string;
  providerImage?: string;
  id?: string;
}): TClientUser {
  // Изображение из провайдера или загруженное.
  const image = imageFromProvider ? providerImage : downloadedImage;

  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    patronymic: profile.patronymic,
    image,
    id: id,
  };
}
