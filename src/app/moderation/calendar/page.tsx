import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './layout.module.css';
import IconCalendar from '@/components/Icons/IconCalendar';

export default function ModerationCalendarPage() {
  return (
    <div className={styles.content}>
      <TitleAndLine hSize={1} title="Управление Календарем событий" Icon={IconCalendar} />
      <h2>Добро пожаловать на страницу модерации Календаря событий</h2>
      {/* <div>
        <h3>Календарь</h3>
        <p>Календарь.</p>
      </div> */}
    </div>
  );
}
