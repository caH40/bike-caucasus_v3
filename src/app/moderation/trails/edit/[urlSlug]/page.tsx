import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

import { TTrailDto } from '@/types/dto.types';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { getTrail } from '@/actions/trail';

import { Trail } from '@/services/Trail';
import FormTrail from '@/components/UI/Forms/FromTrail/FormTrail';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

type Props = {
  params: { urlSlug: string };
};

/**
 * Страница редактирования Маршрута.
 */
export default async function TrailEditCurrentPage({ params }: Props) {
  revalidatePath(`/`);
  const session = await getServerSession(authOptions);

  const author = session?.user.idDB;
  if (!author) {
    throw new Error('Нет авторизации, нет idDB!');
  }

  const { urlSlug } = params;
  const trail: (TTrailDto & { posterOldUrl?: string }) | null | undefined = await getTrail(
    urlSlug
  );

  if (trail) {
    // posterOldUrl старого постера, необходим для удаления файла из облака,
    // если был изменен при редактировании новости.
    trail.posterOldUrl = trail?.poster;
  }

  /**
   * Отправка заполненной формы обновления новости на сервер.
   */
  const fetchTrailEdited = async (formData: FormData) => {
    'use server';

    const trailService = new Trail();
    const response = await trailService.put(formData, {
      cloudName: 'vk',
      domainCloudName: 'hb.vkcs.cloud',
      bucketName,
    });

    revalidatePath(`/`);

    return response;
  };

  return (
    <>
      <TitleAndLine title="Редактирование Маршрута" hSize={1} />
      {trail ? (
        <FormTrail fetchTrailEdited={fetchTrailEdited} trailForEdit={trail} />
      ) : (
        <span>Не получены данные Новости для редактирования</span>
      )}
    </>
  );
}
