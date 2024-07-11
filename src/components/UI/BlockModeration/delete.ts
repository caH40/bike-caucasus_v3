import { toast } from 'sonner';

import { deleteNews } from '@/actions/news';
import { deleteTrail } from '@/actions/trail';
import { translationForModeration } from '@/constants/texts';
import { ResponseServer } from '@/types/index.interface';

type Params = {
  type: string;
  urlSlug: string;
};

/**
 * Обработка клика на удаление новости/маршрута.
 */
export const deleteItem = async ({ type, urlSlug }: Params) => {
  const confirmed = window.confirm(
    `Вы действительно хотите удалить ${translationForModeration[type]?.m} c urlSlug:${urlSlug}?`
  );
  if (!confirmed) {
    return toast.warning(`Отменён запрос на удаление ${translationForModeration[type]?.a}!`);
  }

  try {
    let res = {} as ResponseServer<null>;
    switch (type) {
      case 'trails':
        res = await deleteTrail(urlSlug);
        break;
      case 'news':
        res = await deleteNews(urlSlug);
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
