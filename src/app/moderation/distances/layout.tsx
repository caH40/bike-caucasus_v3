import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuModerationDistancesPage } from '@/constants/menu';
import styles from './layout.module.css';

export const dynamic = 'force-dynamic';

/**
 * Страница создания/редактирования/удаления Дистанции.
 */
export default async function ModerationChampionshipLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      {/* левая боковая панель */}
      <aside className={styles.wrapper__aside}>
        <MenuOnPage
          buttons={buttonsMenuModerationDistancesPage}
          buttonAdditional={{
            name: 'Главное меню',
            path: '/moderation',
          }}
        />
      </aside>

      {/* основное тело страницы */}
      <div className={styles.wrapper__main}>{children}</div>
    </div>
  );
}
