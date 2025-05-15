'use client';

import { serializationChampionshipCategories } from '@/libs/utils/serialization/championshipCategories';
import { useLoadingStore } from '@/store/loading';
import {
  TCategoriesConfigsClient,
  TUseSubmitChampionshipCategoriesParams,
} from '@/types/index.interface';
import { toast } from 'sonner';

/**
 * Отправка формы категории при редактировании Чемпионата.
 */
export const useSubmitChampionshipCategories = ({
  putCategories,
  organizerId,
  reset,
  setIsFormDirty,
  urlSlug,
}: TUseSubmitChampionshipCategoriesParams) => {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const onSubmit = async (formData: { categories: TCategoriesConfigsClient[] }) => {
    // console.log(formData.categories);

    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationChampionshipCategories(formData.categories);

    // В зависимости от типа формы (редактирование/создание Чемпионата) выбирается соответствующий обработчик.

    const response = await putCategories({ dataSerialized, organizerId, urlSlug });

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      reset();
      toast.success(response.message);
      setIsFormDirty(false);
    } else {
      toast.error(response.message);
    }
  };

  return onSubmit;
};
