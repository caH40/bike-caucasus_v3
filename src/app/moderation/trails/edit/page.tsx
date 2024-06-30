import IconRoute from '@/components/Icons/IconRoute';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import styles from './TrailEditPage.module.css';

export default function TrailEditPage() {
  return (
    <>
      <TitleAndLine title="Страница редактирования Маршрута" hSize={1} Icon={IconRoute} />
      <p className={styles.paragraph}>
        Пользователь может удалять и редактировать только созданные им маршруты.
      </p>
      <p className={styles.paragraph}>Админ и модератор может только удалять маршруты.</p>
      <p className={styles.paragraph}>
        Выберите Маршрут для редактирования на странице &quot;<big>Список маршрутов</big>
        &quot;
      </p>
    </>
  );
}
