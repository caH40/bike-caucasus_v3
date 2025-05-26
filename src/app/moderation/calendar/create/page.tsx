import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

import { errorHandlerClient } from '@/actions/error-handler';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { parseError } from '@/errors/parse';
import { ServerResponse } from '@/types/index.interface';
import { handlerErrorDB } from '@/services/mongodb/error';
import FormCalendar from '@/components/UI/Forms/FormCalendar/FormCalendar';
import { getNews } from '@/actions/news';
import { CalendarService } from '@/services/Calendar';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconCalendar from '@/components/Icons/IconCalendar';

async function fetchCalendarCreated(formData: FormData): Promise<ServerResponse<null>> {
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
    const calendarService = new CalendarService();

    const response = await calendarService.addEvent(formData, author);

    revalidatePath(`/calendar`);

    return response;
  } catch (error) {
    errorHandlerClient(parseError(error));
    return handlerErrorDB(error);
  }
}

/**
 * Страница добавления события в Календарь.
 */
export default async function CalendarCreatePage() {
  const news = await getNews({ docsOnPage: 50 });

  return (
    <>
      <TitleAndLine
        title="Добавление нового События в календарь"
        hSize={1}
        Icon={IconCalendar}
      />
      <FormCalendar fetchTrailCreated={fetchCalendarCreated} news={news} />
    </>
  );
}
