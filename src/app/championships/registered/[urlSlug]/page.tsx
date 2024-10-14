import { Metadata } from 'next';

import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import ContainerTableRegisteredChamp from '@/components/Table/Containers/RegisteredChamp/RegisteredChamp';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';
import { getRegisteredRidersChamp } from '@/actions/registration-champ';
import { generateMetadataChampRegistered } from '@/meta/meta';
import styles from './ChampionshipRegistered.module.css';

// Создание динамических meta данных.
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataChampRegistered(props);
}

type Props = {
  params: {
    urlSlug: string;
  };
};

export default async function ChampionshipRegistered({ params: { urlSlug } }: Props) {
  const { data } = await getRegisteredRidersChamp({ urlSlug });

  const buttons = buttonsMenuChampionshipPage(urlSlug);
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {data && (
          <>
            <TitleAndLine
              hSize={1}
              title={`Зарегистрированные участники: ${data.championship.name}`}
            />
            {data.champRegistrationRiders.map((race) => (
              <div className={styles.wrapper__table} key={race.raceName}>
                <ContainerTableRegisteredChamp
                  registeredRidersInRace={race}
                  showFooter={true}
                />
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
