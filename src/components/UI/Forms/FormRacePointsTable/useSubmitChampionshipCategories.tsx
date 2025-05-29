'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useLoadingStore } from '@/store/loading';

// types
import {
  ServerResponse,
  TFormCRacePointsTableProps,
  TRacePointsTableForm,
} from '@/types/index.interface';
import { createRacePointsTable } from '@/actions/race-points-table';

type Props = Omit<TFormCRacePointsTableProps, 'racePointsTable' | 'organizerId'>;

/**
 * Отправка формы таблицы начисления очков за этапы серии заездов.
 */
export const useSubmitRacePointsTable = ({
  action,
  setIsFormDirty,
  setRacePointsTable,
}: Props) => {
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const onSubmit = async (formData: TRacePointsTableForm) => {
    // Старт отображение статуса загрузки.
    setLoading(true);

    // В зависимости от типа формы (редактирование/создание Чемпионата) выбирается соответствующий обработчик.
    let response = {} as ServerResponse<null>;

    switch (action) {
      case 'create':
        response = await createRacePointsTable(formData);

        break;

      default:
        toast.error('Не получен валидный action для отправки формы на сервер!');
        return;
    }

    // Завершение отображение статуса загрузки.
    setLoading(false);

    // Отображение статуса сохранения События в БД.
    if (response.ok) {
      toast.success(response.message);
      setIsFormDirty(false);

      setRacePointsTable(null);

      // Обновляем родительский серверный компонент.
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return onSubmit;
};
