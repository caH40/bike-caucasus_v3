import styles from './TrailEditPage.module.css';

export default function TrailEditPage() {
  return (
    <>
      <h1 className={styles.title}>Страница редактирования Маршрута</h1>
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
