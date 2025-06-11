// types
import { TClientMeta, TDeserializedCategories } from '@/types/index.interface';

/**
 * Функция для десериализации данных при изменении категорий Чемпионата.
 * @param data - FormData, полученная с клиента.
 * @returns Десериализованный объект конфигурации категорий.
 */
export function deserializeCategories(data: FormData): {
  categoriesConfigs: TDeserializedCategories[];
  client?: TClientMeta;
} {
  const categoriesConfigs = data.get('categoriesConfigs');

  if (!categoriesConfigs) {
    throw new Error('Не получены обновлённые данные по категориям с клиента!');
  }

  const parsedData = JSON.parse(categoriesConfigs as string) as TDeserializedCategories[];

  const clientData = data.get('client');

  let parsedClient = {} as TClientMeta;
  if (clientData && typeof clientData === 'string') {
    parsedClient = JSON.parse(clientData);
  }

  return { categoriesConfigs: parsedData, client: parsedClient };
}
