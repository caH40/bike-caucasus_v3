import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { errorHandlerClient } from '@/actions/error-handler';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import FormTrail from '@/components/UI/Forms/FromTrail/FormTrail';
import { parseError } from '@/errors/parse';
import { ResponseServer } from '@/types/index.interface';
import { handlerErrorDB } from '@/services/mongodb/error';
import { Trail } from '@/services/Trail';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconRoute from '@/components/Icons/IconRoute';

async function fetchTrailCreated(formData: FormData): Promise<ResponseServer<null>> {
  'use server';
  try {
    const session = await getServerSession(authOptions);

    // Проверка авторизации и наличия idUserDB.
    const author = session?.user.idDB;
    if (!author) {
      throw new Error('Нет авторизации, нет idDB!');
    }

    // Проверка наличия прав на создание маршрута.
    if (
      !session.user.role.permissions.some((elm) => elm === 'moderation.create' || elm === 'all')
    ) {
      throw new Error('У вас нет прав для создания маршрута!');
    }

    const trailService = new Trail();
    const response = await trailService.post({ formData, author });

    revalidatePath(`/trails`);

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

export default function TrailsCreatePage() {
  return (
    <>
      <TitleAndLine title="Создание нового маршрута" hSize={1} Icon={IconRoute} />
      <FormTrail fetchTrailCreated={fetchTrailCreated} />
    </>
  );
}
