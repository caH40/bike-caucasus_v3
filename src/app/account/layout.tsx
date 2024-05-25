import MenuOnPage from '@/components/UI/MenuM/MenuOnPage/MenuOnPage';
import styles from './Account.module.css';
import { buttonsMenuAccountPage } from '@/constants/menu';

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage needBack={true} buttons={buttonsMenuAccountPage} />
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
