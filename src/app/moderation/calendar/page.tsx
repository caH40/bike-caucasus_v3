import Wrapper from '@/components/Wrapper/Wrapper';

import styles from './layout.module.css';

export default function ModerationCalendarPage() {
  return (
    <div className={styles.content}>
      <Wrapper title="Управление Календарем событий">
        <h2>Добро пожаловать на страницу модерации Календаря событий</h2>
        <div>
          <h3>Календарь</h3>
          <p>Календарь.</p>
        </div>
      </Wrapper>
    </div>
  );
}
