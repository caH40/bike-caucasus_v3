// types
import { TDeserializedCategories } from '@/types/index.interface';

/**
 * Функция для десериализации данных при изменении категорий Чемпионата.
 * @param data - FormData, полученная с клиента.
 * @returns Десериализованный объект конфигурации категорий.
 */
export function deserializeCategories(data: FormData): TDeserializedCategories[] {
  const categoriesConfigs = data.get('categoriesConfigs');

  if (!categoriesConfigs) {
    throw new Error('Не получены обновлённые данные по категориям с клиента!');
  }

  const parsed = JSON.parse(categoriesConfigs as string) as TDeserializedCategories[];

  return parsed;
}
