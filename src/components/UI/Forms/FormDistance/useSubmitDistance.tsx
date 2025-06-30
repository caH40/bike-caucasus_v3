'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useLoadingStore } from '@/store/loading';
import { TUseSubmitDistanceParams, TFormDistanceCreate } from '@/types/index.interface';
import { useUserData } from '@/store/userdata';
import { serializationDistance } from '@/libs/utils/serialization/dictance';

export const useSubmitDistance = ({
  postDistance,
  putDistance,
  isEditForm,
}: TUseSubmitDistanceParams) => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Мета данные по client.
  const location = useUserData((s) => s.location);
  const deviceInfo = useUserData((s) => s.deviceInfo);

  const onSubmit = async (dataFromForm: TFormDistanceCreate) => {
    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationDistance({
      dataFromForm,
      client: {
        location,
        deviceInfo,
      },
      isEditForm,
    });

    // Выбор обработчика в зависимости от типа формы: создание или редактирование дистанции.
    const handler = isEditForm ? putDistance : postDistance;

    if (!handler) {
      throw new Error(
        `Не получен обработчик сохранения дистанции (${isEditForm ? 'edit' : 'create'})!`
      );
    }

    const response = await handler(dataSerialized);

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      toast.success(response.message);

      // Обновление данных получаемых с сервера на данной странице.
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return onSubmit;
};
