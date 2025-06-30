import { toast } from 'sonner';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type Params = {
  urlSlug: string;
  name: string;
  router: AppRouterInstance;
};

/**
 * Обработка клика на удаление таблицы начисления очков за этап серии.
 */
export const deleteItem = async ({ urlSlug, name, router }: Params) => {
  const confirmed = window.confirm(`Вы действительно хотите удалить дистанцию "${name}"?`);
  if (!confirmed) {
    return toast.warning(`Отменён запрос на удаление дистанции "${name}"!`);
  }

  try {
    router.refresh();
    toast.warning(`В разработке удаление дистанции с urlSlug:${urlSlug}`);
    // toast.success(res.message);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};
