import AdContainer from '@/components/AdContainer/AdContainer';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import Calendar from '@/components/UI/Calendar/Calendar';
import { getCalendarEvents } from '@/actions/calendar';
import styles from './CalendarPage.module.css';

export const dynamic = 'force-dynamic';

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
