// import { Metadata } from 'next';

import AdContainer from '@/components/AdContainer/AdContainer';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

import { getRegisteredRidersChamp } from '@/actions/registration-champ';
import ContainerDownloadRegistered from '@/components/ClientContainers/ContainerDownloadRegistered/ContainerDownloadRegistered';
import ContainerDownloadRaceProtocol from '@/components/ClientContainers/ContainerDownloadRaceProtocol/ContainerDownloadRaceProtocol';
import { getRaceProtocols } from '@/actions/result-race';
import { getChampionship } from '@/actions/championship';
import getChampionshipPageData from '@/libs/utils/championship/getChampionshipPageData';
import styles from './ChampionshipDocuments.module.css';

// Создание динамических meta данных.
// export async function generateMetadata(props: Props): Promise<Metadata> {}

type Props = {
  params: Promise<{
    urlSlug: string;
  }>;
};

export default async function ChampionshipDocuments(props: Props) {
  const params = await props.params;

  const { urlSlug } = params;

  const [championship, registeredRidersChamp, protocols] = await Promise.all([
    getChampionship({ urlSlug }),
    getRegisteredRidersChamp({ urlSlug }),
    getRaceProtocols({ urlSlug }),
  ]);

  if (!registeredRidersChamp.data) {
    return <h2>{registeredRidersChamp.message}</h2>;
  }

  if (!championship.data) {
    throw new Error(championship.message);
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
        <>
          <TitleAndLine
            hSize={1}
            title={`Документы "${registeredRidersChamp.data.championship.name}"`}
          />
          <p className={styles.description}>
            На данной странице представлены документы для скачивания, включая стартовые и
            регистрационные протоколы участников, финишные протоколы с результатами велосипедных
            соревнований, а также общие положения, описывающие правила и условия проведения
            мероприятия.
          </p>

          <section className={styles.spacer__section}>
            <TitleAndLine hSize={2} title={'Регистрация'} />

            <ContainerDownloadRegistered
              championship={registeredRidersChamp.data.championship}
              champRegistrationRiders={registeredRidersChamp.data.champRegistrationRiders}
            />
          </section>

          {protocols.data && (
            <section className={styles.spacer__section}>
              <TitleAndLine hSize={2} title={'Финишные протоколы'} />

              <ContainerDownloadRaceProtocol
                championship={registeredRidersChamp.data.championship}
                protocols={protocols.data}
              />
            </section>
          )}
        </>
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
