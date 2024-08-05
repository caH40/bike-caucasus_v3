import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import IconOrganizers from '@/components/Icons/IconOrganizers';
import styles from './layout.module.css';

export default function ModerationOrganizerPage() {
  return (
    <div className={styles.content}>
      <TitleAndLine
        hSize={1}
        title="Управление и настройка Организатора"
        Icon={IconOrganizers}
      />
      <h2>Добро пожаловать на страницу модерации Организатора чемпионатов (соревнований)</h2>
    </div>
  );
}
