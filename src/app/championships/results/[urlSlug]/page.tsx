import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';
import styles from './ChampionshipResults.module.css';
import Wrapper from '@/components/Wrapper/Wrapper';

type Props = {
  params: {
    urlSlug: string;
  };
};

export default function ChampionshipResults({ params: { urlSlug } }: Props) {
  const buttons = buttonsMenuChampionshipPage(urlSlug);
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <Wrapper hSize={1} title="Результаты заездов Чемпионата">
          Тут будут результаты. В разработке...
        </Wrapper>
      </div>

      {/* левая боковая панель */}
      <aside className={styles.wrapper__aside}>
        <div className={styles.spacer__menu}>
          <MenuOnPage buttons={buttons} />
        </div>
        <AdContainer adsNumber={6} />
      </aside>
    </div>
  );
}
