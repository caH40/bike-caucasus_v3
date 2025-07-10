import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import styles from './DefaultLayout.module.css';

// types
import { TMenuOnPage } from '@/types/index.interface';

/**
 * Лейаут по умолчанию.
 */
export default function DefaultLayout({
  children,
  buttonsMenu,
  buttonAdditional,
}: Readonly<{
  children: React.ReactNode;
  buttonsMenu: TMenuOnPage[];
  buttonAdditional?: {
    name: string; // Название кнопки.
    path: string; // Путь адреса навигации.
  };
}>) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenu} buttonAdditional={buttonAdditional} />
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
