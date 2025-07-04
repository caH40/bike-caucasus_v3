'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { serializationChampionshipCategories } from '@/libs/utils/serialization/championshipCategories';
import { useLoadingStore } from '@/store/loading';
import {
  TFormChampionshipCategories,
  TUseSubmitChampionshipCategoriesParams,
} from '@/types/index.interface';
import { useUserData } from '@/store/userdata';
import { validateCategoriesBeforePost } from '@/libs/utils/championship/category';
import { putCategories } from '@/actions/championship';

/**
 * Отправка формы категории при редактировании Чемпионата.
 */
export const useSubmitChampionshipCategories = ({
  organizerId,
  setIsFormDirty,
  urlSlug,
}: TUseSubmitChampionshipCategoriesParams) => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Мета данные по client.
  const location = useUserData((s) => s.location);
  const deviceInfo = useUserData((s) => s.deviceInfo);

  const onSubmit = async (formData: TFormChampionshipCategories) => {
    const { hasEmptyCategory, hasOverlappingCategory } = validateCategoriesBeforePost(
      formData.categories
    );

    if (hasEmptyCategory) {
      toast.error(
        'Обнаружены пропущенные года между возрастными категориями. Проверьте границы и добавьте недостающие.'
      );
      return;
    }

    if (hasOverlappingCategory) {
      toast.error(
        'Возрастные категории пересекаются. Убедитесь, что границы категорий не перекрываются.'
      );
      return;
    }

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
