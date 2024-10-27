import AdContainer from '@/components/AdContainer/AdContainer';
import styles from './layout.module.css';

/**
 * Лэйаут для Организаторов.
 */
export default function OrganizersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      {/* основное тело страницы */}
      <div className={styles.wrapper__main}>{children}</div>

      {/* левая боковая панель */}
      <aside className={styles.wrapper__aside}>
        <AdContainer adsNumber={6} />
      </aside>

      {/* Рекомендательный виджет (реклама) */}
      <div className={styles.rtb}>
        <AdContainer adsNumber={18} maxWidth={1105} />
      </div>
    </div>
  );
}
