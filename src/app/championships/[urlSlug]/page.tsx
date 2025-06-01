/**
 * Описание (обязательно: карта с местом старта)
 * Ссылка на зарегистрированных
 * Ссылка на результаты
 * !! Судьи и помощники в Чемпионате, для формирования итогового протокола Чемпионата
 */
import { Metadata } from 'next';

import { getChampionship, getChampionships } from '@/actions/championship';
import { ChampionshipService } from '@/services/Championship';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';
import BlockChampionshipHeader from '@/components/BlockChampionshipHeader/BlockChampionshipHeader';
import ChampionshipCard from '@/components/ChampionshipCard/ChampionshipCard';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import BlockOrganizerContacts from '@/components/BlockOrganizerContacts/BlockOrganizerContacts';
import BlockRaces from '@/components/BlockRaces/BlockRaces';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import AdContainer from '@/components/AdContainer/AdContainer';
import { generateMetadataChampionship } from '@/meta/meta';
import styles from './Championship.module.css';
import ChampionshipMenuPopup from '@/components/UI/Menu/MenuControl/ChampionshipMenuPopup';

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

  const [championship, championships] = await Promise.all([
    getChampionship({ urlSlug }),
    getChampionships({ needTypes: ['stage'] }),
  ]);

  const champService = new ChampionshipService();
  await champService.updateStatusChampionship();

  // !!! Продумать обработку или отображение ошибки.
  if (!championships.ok) {
    throw new Error(championships.message);
  }

  // Проверка наличия данных Этапов и их сортировка по возрастанию.
  const stages = championships.data
    ? championships.data.toSorted((a, b) => {
        if (!a.stage || !b.stage) {
          return 0;
        }
        return a.stage - b.stage;
      })
    : [];

  const buttons = buttonsMenuChampionshipPage(urlSlug);

  const hiddenItemNames =
    championship.data && ['series', 'tour'].includes(championship.data.type)
      ? ['Финишные протоколы']
      : [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {championship.data && (
          <>
            <div className={styles.block__header}>
              <div className={styles.ellipsis} id="popup-control-menu-championship">
                {/* popup меня управления чемпионатом */}
                <ChampionshipMenuPopup
                  urlSlug={championship.data.urlSlug}
                  raceId={championship.data.races[0]?._id}
                  hiddenItemNames={hiddenItemNames}
                />
              </div>
              <BlockChampionshipHeader championship={championship.data} />
            </div>

            <div className={styles.wrapper__contacts}>
              <BlockOrganizerContacts organizer={championship.data.organizer.contactInfo} />
            </div>

            {['single', 'stage'].includes(championship.data.type) && (
              <div className={styles.wrapper__races}>
                <BlockRaces
                  races={championship.data.races}
                  registrationData={{
                    type: championship.data.type,
                    status: championship.data.status,
                    urlSlugChamp: championship.data.urlSlug,
                  }}
                />
              </div>
            )}

            {['series', 'tour'].includes(championship.data.type) && (
              <>
                <TitleAndLine hSize={2} title="Этапы" />
                <div className={styles.wrapper__cards}>
                  {stages.map((champ) => (
                    <ChampionshipCard championship={champ} key={champ._id} simple={true} />
                  ))}
                </div>
              </>
            )}
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
