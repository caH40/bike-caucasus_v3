import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import styles from './NewsEditPage.module.css';
import IconNewspaper from '@/components/Icons/IconNewspaper';

export default function NewsEditPage() {
  return (
    <>
      <TitleAndLine
        hSize={1}
        Icon={IconNewspaper}
        title="Страница редактирования ранее созданной новости"
      />
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
