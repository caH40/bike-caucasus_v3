import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { errorHandlerClient } from '@/actions/error-handler';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import Wrapper from '@/components/Wrapper/Wrapper';
import { parseError } from '@/errors/parse';
import { ResponseServer } from '@/types/index.interface';
import { handlerErrorDB } from '@/services/mongodb/error';
import { Trail } from '@/services/Trail';
import FormCalendar from '@/components/UI/Forms/FormCalendar/FormCalendar';

const bucketName = process.env.VK_AWS_BUCKET_NAME || 'bike-caucasus';

async function fetchCalendarCreated(formData: FormData): Promise<ResponseServer<null>> {
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
      !session.user.role.permissions.some(
        (elm) => elm === 'moderation.calendar' || elm === 'all'
      )
    ) {
      throw new Error('У вас нет прав для добавления событий в Календарь!');
    }

    const trailService = new Trail();
    const response = await trailService.post(
      formData,
      {
        cloudName: 'vk',
        domainCloudName: 'hb.vkcs.cloud',
        bucketName,
      },
      author
    );

    revalidatePath(`/calendar`);

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

export default function CalendarCreatePage() {
  return (
    <Wrapper title="Добавление нового События в календарь">
      <FormCalendar fetchTrailCreated={fetchCalendarCreated} />
    </Wrapper>
  );
}
