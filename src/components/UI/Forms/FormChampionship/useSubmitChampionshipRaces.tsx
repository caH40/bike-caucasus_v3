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
}: TUseSubmitChampionshipRacesParams) => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const onSubmit = async (formData: { races: TRaceForForm[] }) => {
    // console.log(formData.categories);

    // Старт отображение статуса загрузки.
    setLoading(true);

    // Сериализация данных в FormData перед отправкой на сервер.
    const dataSerialized = serializationChampionshipRaces({ races: formData.races });

    // В зависимости от типа формы (редактирование/создание Чемпионата) выбирается соответствующий обработчик.

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
