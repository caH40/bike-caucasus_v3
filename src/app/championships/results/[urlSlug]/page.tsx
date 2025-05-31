import { Metadata } from 'next';

import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import WrapperProtocolRace from '@/components/WrapperProtocolRace/WrapperProtocolRace';
import { generateMetadataResultsRace } from '@/meta/meta';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';
import { getChampionship } from '@/actions/championship';
import styles from './ChampionshipResults.module.css';

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <TitleAndLine hSize={1} title={`Результаты «${championship.data.name}»`} />
        {/* Отображается только при наличии заезда(ов) */}
        {championship.data.races.length > 0 && (
          <WrapperProtocolRace championship={championship.data} />
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
