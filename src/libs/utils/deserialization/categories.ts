// types
import { TClientMeta, TDeserializedCategories } from '@/types/index.interface';
import { validateCategoriesBeforePost } from '../championship/category';

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

  // Валидация категорий
  const { hasEmptyCategory, hasOverlappingCategory } = validateCategoriesBeforePost(parsedData);

  if (hasEmptyCategory) {
    throw new Error(
      'Обнаружены пропущенные года между возрастными категориями. Проверьте границы и добавьте недостающие.'
    );
  }

  if (hasOverlappingCategory) {
    throw new Error(
      'Возрастные категории пересекаются. Убедитесь, что границы категорий не перекрываются.'
    );
  }

  return { categoriesConfigs: parsedData, client: parsedClient };
}
