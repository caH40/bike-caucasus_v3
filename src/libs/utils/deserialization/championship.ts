import { TFormChampionshipCreate } from '@/types/index.interface';

/**
 * Функция для десериализации данных при создании Чемпионата.
 * @param dataForm - Данные формы, которые нужно десериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function deserializeChampionship(serializedFormData: FormData) {
  const championship = {} as TFormChampionshipCreate & {
    needDelTrack: boolean;
    organizerId?: string;
    parentChampionshipId?: string;
  } & {
    [key: string]: any;
  };

  for (const [name, value] of serializedFormData.entries()) {
    switch (name) {
      case 'needDelTrack':
        championship[name] = value === 'true' ? true : false;
        break;

      default:
        championship[name] = value === '' ? null : value;
    }
  }

  return championship;
}
