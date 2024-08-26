import { Metadata } from 'next';

import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { metadataChampionships } from '@/meta/meta';
import { getChampionships } from '@/actions/championship';
import ChampionshipCard from '@/components/ChampionshipCard/ChampionshipCard';
import AdContainer from '@/components/AdContainer/AdContainer';
import styles from './Championships.module.css';

// Создание meta данных.
export const metadata: Metadata = metadataChampionships;

/**
 * Страница с карточками предстоящих и завершившихся чемпионатов.
 */
export default async function ChampionshipsPage() {
  const championships = await getChampionships({ needTypes: ['series', 'tour', 'single'] });

  return (
    <div className={styles.wrapper}>
      <div>
        <TitleAndLine hSize={1} title="Чемпионаты по велоспорту" />

        <div className={styles.wrapper__cards}>
          {championships.data &&
            championships.data.map((champ) => (
              <ChampionshipCard championship={champ} key={champ._id} />
            ))}
        </div>
      </div>

      <aside className={styles.wrapper__aside}>
        <AdContainer adsNumber={6} />
      </aside>
    </div>
  );
}
