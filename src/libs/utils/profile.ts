// утилиты для работы с профилем пользователя

/**
 * Получение src до изображения
 */

export const getLogoProfile = (
  isLogoProvider: boolean,
  imageProvider: string | undefined,
  image: string | undefined
): string => {
  const noImage = '/images/icons/noimage.svg';
  const imageCurrent = (isLogoProvider ? imageProvider : image) || noImage;
  return imageCurrent;
};
