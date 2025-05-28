import { toast } from 'sonner';

import { deleteRacePointsTable } from '@/actions/race-points-table';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type Params = {
  _id: string;
  name: string;
  router: AppRouterInstance;
};

/**
 * Обработка клика на удаление таблицы начисления очков за этап серии.
 */
export const deleteItem = async ({ _id, name, router }: Params) => {
  const confirmed = window.confirm(
    `Вы действительно хотите удалить таблицу начисления очков за этап серии "${name}"?`
  );
  if (!confirmed) {
    return toast.warning(
      `Отменён запрос на удаление таблицы начисления очков за этап серии "${name}"!`
    );
  }

  try {
    const res = await deleteRacePointsTable(_id);

    if (!res.ok) {
      throw new Error(res.message);
    }

    router.refresh();
    toast.success(res.message);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};
