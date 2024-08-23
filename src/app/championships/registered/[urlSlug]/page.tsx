import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';
import { getRegisteredRidersChamp } from '@/actions/championship';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import ContainerTableRegisteredChamp from '@/components/Table/Containers/RegisteredChamp/RegisteredChamp';
import styles from './ChampionshipRegistered.module.css';

type Props = {
  params: {
    urlSlug: string;
  };
};

export default async function ChampionshipRegistered({ params: { urlSlug } }: Props) {
  const registrationData = await getRegisteredRidersChamp({ urlSlug });

  const buttons = buttonsMenuChampionshipPage(urlSlug);
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {registrationData.data && (
          <>
            <TitleAndLine
              hSize={1}
              title={`Зарегистрированные участники: ${registrationData.data.championshipName}`}
            />
            {registrationData.data.champRegistrationRiders.map((race) => (
              <div className={styles.wrapper__table} key={race.raceName}>
                <ContainerTableRegisteredChamp registeredRidersInRace={race} />
              </div>
            ))}
          </>
        )}
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
