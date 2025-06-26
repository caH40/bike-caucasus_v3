'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useLoadingStore } from '@/store/loading';
import { TUseSubmitDistanceParams, TFormDistanceCreate } from '@/types/index.interface';
import { useUserData } from '@/store/userdata';
import { serializationDistance } from '@/libs/utils/serialization/dictance';

export const useSubmitDistance = ({ postDistance, reset }: TUseSubmitDistanceParams) => {
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
    });

    // Вызывается серверный экшен.
    const response = await postDistance(dataSerialized);

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      toast.success(response.message);

      // Обновляем родительский серверный компонент.
      router.refresh();
      reset();
    } else {
      toast.error(response.message);
    }
  };

  return onSubmit;
};
