import MenuAccountProfile from '@/components/UI/menu/MenuAccountProfile/MenuAccountProfile';
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
      <div>{children}</div>
    </div>
  );
}
