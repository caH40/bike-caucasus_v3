import { toast } from 'sonner';

import { deleteNews } from '@/actions/news';
import { deleteTrail } from '@/actions/trail';
import { translationForModeration } from '@/constants/texts';
import { ServerResponse, TClientMeta } from '@/types/index.interface';
import { deleteChampionship } from '@/actions/championship';

type Params = {
  type: string;
  urlSlug: string;
  client: TClientMeta;
};

/**
 * Обработка клика на удаление новости/маршрута.
 */
export const deleteItem = async ({ type, urlSlug, client }: Params) => {
  const confirmed = window.confirm(
    `Вы действительно хотите удалить ${translationForModeration[type]?.m} c urlSlug:${urlSlug}?`
  );
  if (!confirmed) {
    return toast.warning(`Отменён запрос на удаление ${translationForModeration[type]?.a}!`);
  }

  try {
    let res = {} as ServerResponse<null>;
    switch (type) {
      case 'trails':
        res = await deleteTrail(urlSlug);
        break;
      case 'news':
        res = await deleteNews({ urlSlug, client });
        break;
      case 'championship':
        res = await deleteChampionship({ urlSlug, client });
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
