import AdContainer from '@/components/AdContainer/AdContainer';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import styles from './CalendarPage.module.css';
import Calendar from '@/components/UI/Calendar/Calendar';

/**
 * Страница популярных вебкамер
 */
export default function CalendarPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <TitleAndLine hSize={1} title="Календарь соревнований по велоспорту на Кавказе" />
        <Calendar />
      </div>

      {/* Боковая панель. */}
      <aside className={styles.wrapper__aside}>
        <AdContainer adsNumber={5} />
      </aside>
    </div>
  );
}
