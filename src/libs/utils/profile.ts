// утилиты для работы с профилем пользователя

import { TGetUserFullNameParams } from '@/types/index.interface';

/**
 * Получение src до изображения
 */
export const getLogoProfile = (
  isLogoProvider: boolean | undefined,
  imageProvider: string | undefined,
  image: string | undefined
): string => {
  const noImage = '/images/icons/noimage.svg';
  const imageCurrent = (isLogoProvider ? imageProvider : image) || noImage;
  return imageCurrent;
};

/**
 * Формирует отображаемое имя пользователя.
 *
 * @param params - Объект с параметрами, включая ФИО и флаг отображения отчества.
 * @returns Отформатированное имя.
 */
export function getUserFullName({
  person,
  showPatronymic = false,
}: TGetUserFullNameParams): string {
  const { lastName, firstName, patronymic } = person;
  return `${lastName} ${firstName}${showPatronymic && patronymic ? ` ${patronymic}` : ''}`;
}
