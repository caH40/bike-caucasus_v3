import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuModerationTrailsPage } from '@/constants/menu';
import styles from './layout.module.css';

/**
 * Страница создания/редактирования/удаления новости
 */
export default function ModerationNewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      {/* левая боковая панель */}
      <aside className={styles.wrapper__aside}>
        <MenuOnPage buttons={buttonsMenuModerationTrailsPage} />
      </aside>

      {/* основное тело страницы */}
      <div className={styles.wrapper__main}>{children}</div>
    </div>
  );
}
