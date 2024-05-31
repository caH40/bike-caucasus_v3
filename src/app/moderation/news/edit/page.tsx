import styles from './NewsEditPage.module.css';

export default function NewsEditPage() {
  return (
    <>
      <h1 className={styles.title}>Страница редактирования ранее созданной новости</h1>
      <p className={styles.paragraph}>
        Модератор может удалять и редактировать только созданные им новости.
      </p>
      <p className={styles.paragraph}>
        Редактировать и удалять новость можно в течении 3х дней после её создания.
      </p>
      <p className={styles.paragraph}>
        Выберите новость для редактирования на странице &quot;<big>Список новостей</big>
        &quot;
      </p>
    </>
  );
}
