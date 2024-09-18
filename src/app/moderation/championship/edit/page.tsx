import IconChampionship from '@/components/Icons/IconChampionship';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import styles from './ChampionshipEditPage.module.css';

type Props = {};

export default function ChampionshipEditPage({}: Props) {
  return (
    <>
      <TitleAndLine
        title="Страница редактирования Чемпионата"
        hSize={1}
        Icon={IconChampionship}
      />
      <p className={styles.paragraph}>
        Пользователь может удалять и редактировать Чемпионаты от Организатора, созданного
        текущим пользователем, или пользователями, которые были добавлены в список модераторов
        Организатора. Чемпионат можно удалять до даты его старта. После завершения или отмены,
        редактирование Чемпионата становится недоступным.
      </p>
      <p className={styles.paragraph}>Админ и модератор может только удалять Чемпионаты.</p>
      <p className={styles.paragraph}>
        Выберите Чемпионат для редактирования на странице &quot;<big>Список</big>
        &quot;
      </p>
    </>
  );
}
