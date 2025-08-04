import { getServerSession } from 'next-auth';

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormTrail from '@/components/UI/Forms/FromTrail/FormTrail';
import IconRoute from '@/components/Icons/IconRoute';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getTrail, putTrail } from '@/actions/trail';
import { TTrailDto } from '@/types/dto.types';

type Props = {
  params: Promise<{ urlSlug: string }>;
};

/**
 * Страница редактирования Маршрута.
 */
export default async function TrailEditCurrentPage(props: Props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  const author = session?.user.idDB;
  if (!author) {
    throw new Error('Нет авторизации, нет idDB!');
  }

  const { urlSlug } = params;
  const trail: (TTrailDto & { posterOldUrl?: string }) | null | undefined = await getTrail({
    urlSlug,
  });

  if (trail) {
    // posterOldUrl старого постера, необходим для удаления файла из облака,
    // если был изменен при редактировании новости.
    trail.posterOldUrl = trail?.poster;
  }

  return (
    <>
      <TitleAndLine
        title={`Редактирование маршрута "${trail?.title}"`}
        hSize={1}
        Icon={IconRoute}
      />
      {trail ? (
        <FormTrail putTrail={putTrail} trailForEdit={trail} />
      ) : (
        <span>Не получены данные Новости для редактирования</span>
      )}
    </>
  );
}
