/**
 * Описание (обязательно: карта с местом старта)
 * Ссылка на зарегистрированных
 * Ссылка на результаты
 * !! Судьи и помощники в Чемпионате, для формирования итогового протокола Чемпионата
 */
import { Metadata } from 'next';

import { getChampionship, getChampionships } from '@/actions/championship';
import { ChampionshipService } from '@/services/Championship';
import BlockChampionshipHeader from '@/components/BlockChampionshipHeader/BlockChampionshipHeader';
import ChampionshipCard from '@/components/ChampionshipCard/ChampionshipCard';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BlockOrganizerContacts from '@/components/BlockOrganizerContacts/BlockOrganizerContacts';
import BlockRaces from '@/components/BlockRaces/BlockRaces';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import AdContainer from '@/components/AdContainer/AdContainer';
import { generateMetadataChampionship } from '@/meta/meta';
import ChampionshipMenuPopup from '@/components/UI/Menu/MenuControl/ChampionshipMenuPopup';
import getChampionshipPageData from '@/libs/utils/championship/getChampionshipPageData';
import styles from './Championship.module.css';
import { isChampionshipWithStages } from '@/libs/utils/championship/championship';
import TableRacePointsTable from '@/components/Table/TableRacePointsTable/TableRacePointsTable';

// Создание динамических meta данных.
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataChampionship(props);
}

type Props = { params: Promise<{ urlSlug: string }> };

/**
 * Страница описания Чемпионата как отдельного, так и серии заездов.
 */
export default async function ChampionshipPage(props: Props) {
  const params = await props.params;

  const { urlSlug } = params;

  const [{ data: championship, message: championshipMessage }, stagesResponse] =
    await Promise.all([
      getChampionship({ urlSlug }),
      getChampionships({ needTypes: ['stage'] }),
    ]);

  // Обновление статуса чемпионата.
  const champService = new ChampionshipService();
  await champService.updateStatusChampionship();

  // !!! Продумать обработку или отображение ошибки.
  if (!stagesResponse.ok) {
    throw new Error(stagesResponse.message);
  }
  if (!championship) {
    throw new Error(championshipMessage);
  }

  // Проверка наличия данных Этапов и их сортировка по возрастанию.
  const stages = stagesResponse.data
    ? stagesResponse.data.toSorted((a, b) => {
        if (!a.stageOrder || !b.stageOrder) {
          return 0;
        }
        return a.stageOrder - b.stageOrder;
      })
    : [];

  // Возвращает необходимые сущности для страниц чемпионата/
  const { hiddenItemNames, buttons } = getChampionshipPageData({
    parentChampionshipUrlSlug: championship.parentChampionship?.urlSlug,
    parentChampionshipType: championship.parentChampionship?.type,
    urlSlug,
  });

  // Показывать блоки только для чемпионата типа Серия или Тур.
  const showForSeriesOrTour = isChampionshipWithStages(championship.type);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        <>
          <div className={styles.block__header}>
            <div className={styles.ellipsis} id="popup-control-menu-championship">
              {/* popup меня управления чемпионатом */}
              <ChampionshipMenuPopup
                urlSlug={championship.urlSlug}
                raceId={championship.races[0]?._id}
                championshipId={championship._id}
                hiddenItemNames={hiddenItemNames}
              />
            </div>
            <BlockChampionshipHeader championship={championship} />
          </div>

          <div className={styles.wrapper__contacts}>
            <BlockOrganizerContacts organizer={championship.organizer.contactInfo} />
          </div>

          {!showForSeriesOrTour && (
            <div className={styles.wrapper__races}>
              <BlockRaces
                races={championship.races}
                registrationData={{
                  type: championship.type,
                  status: championship.status,
                  urlSlugChamp: championship.urlSlug,
                }}
              />
            </div>
          )}

          {showForSeriesOrTour && (
            <>
              <TitleAndLine hSize={2} title="Этапы" />
              <div className={styles.wrapper__cards}>
                {stages.map((champ) => (
                  <ChampionshipCard championship={champ} key={champ._id} simple={true} />
                ))}
              </div>

              {championship.racePointsTable && (
                <>
                  <TitleAndLine hSize={2} title="Таблицы начисления очков за этапы" />
                  <TableRacePointsTable
                    racePointsTable={championship.racePointsTable}
                    isPublic={true}
                  />
                </>
              )}
            </>
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
