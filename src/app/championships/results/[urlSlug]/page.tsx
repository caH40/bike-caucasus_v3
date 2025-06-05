import { Metadata } from 'next';

import { generateMetadataResultsRace } from '@/meta/meta';
import { getChampionship } from '@/actions/championship';
import { isChampionshipWithStages } from '@/libs/utils/championship/championship';
import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import getChampionshipPageData from '@/libs/utils/championship/getChampionshipPageData';
import ResultsPage from './ResultsPage';
import SeriesResultsPage from './SeriesResultsPage';
import styles from './ChampionshipResults.module.css';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { getChampionshipPagesTitleName } from '../../utils';

// Создание динамических meta данных
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataResultsRace(props);
}

type Props = {
  params: Promise<{
    urlSlug: string;
  }>;
};

export default async function ChampionshipResults(props: Props) {
  const params = await props.params;

  const { urlSlug } = params;

  const championship = await getChampionship({ urlSlug });

  if (!championship.data) {
    return (
      <>
        <h2>Не найден запрашиваемый Чемпионат!</h2>
        <p>{championship.message}</p>
      </>
    );
  }

  // Возвращает необходимые сущности для страниц чемпионата/
  const { buttons } = getChampionshipPageData({
    parentChampionshipUrlSlug: championship?.data?.parentChampionship?.urlSlug,
    parentChampionshipType: championship?.data?.parentChampionship?.type,
    urlSlug,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <TitleAndLine
          hSize={1}
          title={getChampionshipPagesTitleName({
            name: championship.data.name,
            parentChampionship: championship.data.parentChampionship,
            type: championship.data.type,
            stageOrder: championship.data.stageOrder,
            pageName: 'Результаты',
          })}
        />
        {isChampionshipWithStages(championship.data.type) ? (
          <SeriesResultsPage championship={championship.data} />
        ) : (
          <ResultsPage championship={championship.data} />
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
