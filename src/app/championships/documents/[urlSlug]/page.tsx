import { Metadata } from 'next';

import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';

import styles from './ChampionshipDocuments.module.css';

// Создание динамических meta данных.
export async function generateMetadata(props: Props): Promise<Metadata> {}

type Props = {
  params: {
    urlSlug: string;
  };
};

export default async function ChampionshipDocuments({ params: { urlSlug } }: Props) {
  const buttons = buttonsMenuChampionshipPage(urlSlug);
  const data = [];
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {data && (
          <>
            <TitleAndLine hSize={1} title={`Документы Чемпионата`} />
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
