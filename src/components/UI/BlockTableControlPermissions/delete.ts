import { toast } from 'sonner';

import { translationForModeration } from '@/constants/texts';
import { ServerResponse } from '@/types/index.interface';
import { deletePermission, deleteRole } from '@/actions/permissions';

type Params = {
  type: string;
  _id: string;
};

/**
 * Обработка клика на удаление Разрешения (доступа) к ресурсам сайта.
 */
export const deleteItem = async ({ type, _id }: Params) => {
  const confirmed = window.confirm(
    `Вы действительно хотите удалить ${translationForModeration[type]?.m} c _id:${_id}?`
  );
  if (!confirmed) {
    return toast.warning(`Отменён запрос на удаление ${translationForModeration[type]?.a}!`);
  }

  try {
    let res = {} as ServerResponse<null>;
    switch (type) {
      case 'permissions':
        res = await deletePermission({ _id });
        break;

      case 'roles':
        res = await deleteRole({ _id });
        break;

      default:
        throw new Error('Не передан тип таблицы type');
    }

    if (!res.ok) {
      throw new Error(res.message);
    }

    toast.success(res.message);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};
