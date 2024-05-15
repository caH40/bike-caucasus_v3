import MenuAccountProfile from '@/components/UI/Menu/MenuAccountProfile/MenuAccountProfile';
import styles from './Account.module.css';

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuAccountProfile />
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
