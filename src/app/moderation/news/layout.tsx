import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import styles from './layout.module.css';
import { buttonsMenuModerationNewsPage } from '@/constants/menu';

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
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenuModerationNewsPage} />
      </aside>

      {/* основное тело страницы */}
      <div className={styles.main}>{children}</div>
    </div>
  );
}