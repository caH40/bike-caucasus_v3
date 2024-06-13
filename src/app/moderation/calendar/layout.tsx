import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuModerationCalendarPage } from '@/constants/menu';
import styles from './layout.module.css';
import Calendar from '@/components/UI/Calendar/Calendar';
import { getCalendarEvents } from '@/actions/calendar';

export const dynamic = 'force-dynamic';

/**
 * Страница создания/редактирования/удаления новости
 */
export default async function ModerationCalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const events = await getCalendarEvents();
  return (
    <div className={styles.wrapper}>
      {/* левая боковая панель */}
      <aside className={styles.wrapper__aside}>
        <MenuOnPage buttons={buttonsMenuModerationCalendarPage} />
      </aside>

      {/* основное тело страницы */}
      <div className={styles.wrapper__main}>
        {children}

        <div className={styles.wrapper__calendar}>
          <Calendar events={events} />
        </div>
      </div>
    </div>
  );
}
