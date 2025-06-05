import { Metadata } from 'next';

import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import ContainerTableRegisteredChamp from '@/components/Table/Containers/RegisteredChamp/RegisteredChamp';
import { getRegisteredRidersChamp } from '@/actions/registration-champ';
import { generateMetadataChampRegistered } from '@/meta/meta';
import styles from './ChampionshipRegistered.module.css';
import getChampionshipPageData from '@/libs/utils/championship/getChampionshipPageData';
import { getChampionship } from '@/actions/championship';
import { getChampionshipPagesTitleName } from '../../utils';

// Создание динамических meta данных.
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataChampRegistered(props);
}

type Props = {
  params: Promise<{
    urlSlug: string;
  }>;
};

export default async function ChampionshipRegistered(props: Props) {
  const params = await props.params;

  const { urlSlug } = params;

  const [championship, { data: registeredRiders }] = await Promise.all([
    getChampionship({ urlSlug }),
    getRegisteredRidersChamp({ urlSlug }),
  ]);

  if (!championship.data) {
    throw new Error(championship.message);
  }

  const { name, parentChampionship, type, stageOrder } = championship.data;

  // Возвращает необходимые сущности для страниц чемпионата/
  const { buttons } = getChampionshipPageData({
    parentChampionshipUrlSlug: parentChampionship?.urlSlug,
    parentChampionshipType: parentChampionship?.type,
    urlSlug,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {registeredRiders && (
          <>
            <TitleAndLine
              hSize={1}
              title={getChampionshipPagesTitleName({
                name,
                parentChampionship,
                type,
                stageOrder,
                pageName: 'Зарегистрированные участники на',
              })}
            />
            {registeredRiders.champRegistrationRiders.map((race) => (
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
