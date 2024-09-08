import { Metadata } from 'next';

import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import WrapperResultsRace from '@/components/WrapperResultsRace/WrapperResultsRace';
import { generateMetadataResultsRace } from '@/meta/meta';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';
import { getChampionship } from '@/actions/championship';
import { TOptions } from '@/types/index.interface';
import styles from './ChampionshipResults.module.css';

// Создание динамических meta данных
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataResultsRace(props);
}

type Props = {
  params: {
    urlSlug: string;
  };
};

export default async function ChampionshipResults({ params: { urlSlug } }: Props) {
  const buttons = buttonsMenuChampionshipPage(urlSlug);

  const championship = await getChampionship({ urlSlug });

  if (!championship.data) {
    return (
      <>
        <h2>Не найден запрашиваемый Чемпионат!</h2>
        <p>{championship.message}</p>
      </>
    );
  }

  const options: TOptions[] = championship.data.races.map((race) => ({
    id: race.number,
    translation: `Заезд №${race.number}: ${race.name}`,
    name: String(race.number),
  }));
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <TitleAndLine hSize={1} title={`Результаты «${championship.data.name}»`} />
        <WrapperResultsRace championship={championship.data} options={options} />
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
