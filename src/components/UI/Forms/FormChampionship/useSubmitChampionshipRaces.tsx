'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { serializationChampionshipRaces } from '@/libs/utils/serialization/championshipRaces';
import { useLoadingStore } from '@/store/loading';
import { TRaceForFormNew, TUseSubmitChampionshipRacesParams } from '@/types/index.interface';
import { useUserData } from '@/store/userdata';
import { putRaces } from '@/actions/championship';

export const useSubmitChampionshipRaces = ({
  organizerId,
  setIsFormDirty,
  urlSlug,
  urlTracksForDel,
}: TUseSubmitChampionshipRacesParams) => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Мета данные по client.
  const location = useUserData((s) => s.location);
  const deviceInfo = useUserData((s) => s.deviceInfo);

  const onSubmit = async (formData: { races: TRaceForFormNew[] }) => {
    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationChampionshipRaces({
      dataForm: { races: formData.races },
      urlTracksForDel,
      client: {
        location,
        deviceInfo,
      },
    });

    // Вызывается серверный экшен.
    const response = await putRaces({
      dataSerialized,
      organizerId,
      urlSlug,
    });

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
