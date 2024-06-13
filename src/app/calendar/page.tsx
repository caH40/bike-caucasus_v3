import AdContainer from '@/components/AdContainer/AdContainer';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './CalendarPage.module.css';
import Calendar from '@/components/UI/Calendar/Calendar';
import { CalendarService } from '@/services/Calendar';

export const dynamic = 'force-dynamic';

const getCalendarEvents = async () => {
  'use server';
  try {
    const calendarService = new CalendarService();
    const events = await calendarService.getMany();

    return events.data || [];
  } catch (error) {
    // В случае ошибки возвращаем пустой массив. Нет нужды в обработке ошибки.
    // Если была ошибка, то она сохраняется в логах сервера.
    return [];
  }
};

/**
 * Страница Календаря событий.
 */
export default async function CalendarPage() {
  const events = await getCalendarEvents();
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <TitleAndLine hSize={1} title="Календарь соревнований по велоспорту на Кавказе" />
        <Calendar events={events} />
      </div>

      {/* Боковая панель. */}
      <aside className={styles.wrapper__aside}>
        <AdContainer adsNumber={5} />
      </aside>
    </div>
  );
}
