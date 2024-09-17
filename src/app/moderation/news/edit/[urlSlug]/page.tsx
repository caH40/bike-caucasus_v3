import { revalidatePath } from 'next/cache';

import { getNewsOne, putNewsOne } from '@/actions/news';
import FormNews from '@/components/UI/Forms/FormNews/FormNews';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import type { TNewsGetOneDto } from '@/types/dto.types';

type Props = {
  params: { urlSlug: string };
};

/**
 * Страница редактирования новости.
 */
export default async function NewsEditCurrentPage({ params }: Props) {
  revalidatePath(`/`); // ????????!!!!!!!!! Зачем???


  // !!!! Изменить логику удаления старого постера.
  const { urlSlug } = params;
  const news: (TNewsGetOneDto & { posterOldUrl?: string }) | null | undefined =
    await getNewsOne({ urlSlug });
  if (news) {
    // posterOldUrl старого постера, необходим для удаления файла из облака,
    // если был изменен при редактировании новости.
    news.posterOldUrl = news?.poster;
  }

  return (
    <>
      <TitleAndLine title="Редактирование новости" hSize={1} />
      {news ? (
        <FormNews putNewsOne={putNewsOne} newsForEdit={news} />
      ) : (
        <span>Не получены данные Новости для редактирования</span>
      )}
    </>
  );
}
