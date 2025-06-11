'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { serializationChampionshipCategories } from '@/libs/utils/serialization/championshipCategories';
import { useLoadingStore } from '@/store/loading';
import {
  TCategoriesConfigsForm,
  TUseSubmitChampionshipCategoriesParams,
} from '@/types/index.interface';
import { useUserData } from '@/store/userdata';

/**
 * Отправка формы категории при редактировании Чемпионата.
 */
export const useSubmitChampionshipCategories = ({
  putCategories,
  organizerId,
  setIsFormDirty,
  urlSlug,
}: TUseSubmitChampionshipCategoriesParams) => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Мета данные по client.
  const location = useUserData((s) => s.location);
  const deviceInfo = useUserData((s) => s.deviceInfo);

  const onSubmit = async (formData: { categories: TCategoriesConfigsForm[] }) => {
    // console.log(formData.categories);

    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationChampionshipCategories({
      dataForm: formData.categories,
      client: {
        location,
        deviceInfo,
      },
    });

    // В зависимости от типа формы (редактирование/создание Чемпионата) выбирается соответствующий обработчик.

    const response = await putCategories({ dataSerialized, organizerId, urlSlug });

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      toast.success(response.message);
      setIsFormDirty(false);

      // Обновляем родительский серверный компонент.
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return onSubmit;
};
