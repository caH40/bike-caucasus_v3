'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { serializationChampionshipRaces } from '@/libs/utils/serialization/championshipRaces';
import { useLoadingStore } from '@/store/loading';
import { TRaceForForm, TUseSubmitChampionshipRacesParams } from '@/types/index.interface';

export const useSubmitChampionshipRaces = ({
  putRaces,
  organizerId,
  setIsFormDirty,
  urlSlug,
  urlTracksForDel,
}: TUseSubmitChampionshipRacesParams) => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const onSubmit = async (formData: { races: TRaceForForm[] }) => {
    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationChampionshipRaces({
      dataForm: { races: formData.races },
      urlTracksForDel,
    });

    // Вызывается серверный экшен.
    const response = await putRaces({ dataSerialized, organizerId, urlSlug });

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
