import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import styles from './Admin.module.css';
import { buttonsMenuAdminPage } from '@/constants/menu';

/**
 * Лейаут для Админ страниц.
 */
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenuAdminPage} />
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
