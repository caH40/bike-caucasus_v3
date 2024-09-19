import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import styles from './layout.module.css';
import { buttonsMenuAdminRolesPage } from '@/constants/menu';

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
        <MenuOnPage
          buttons={buttonsMenuAdminRolesPage}
          buttonAdditional={{
            name: 'Главное меню',
            path: '/admin',
          }}
        />
      </aside>

      {/* основное тело страницы */}
      <div className={styles.wrapper__main}>{children}</div>
    </div>
  );
}
