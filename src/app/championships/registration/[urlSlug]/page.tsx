import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { getChampionship } from '@/actions/championship';
import { getChampionshipPagesTitleName } from '../../utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getProfileForReg } from '@/actions/user';
import { generateMetadataChampRegistration } from '@/meta/meta';
import { checkRegisteredInChamp } from '@/actions/registration-champ';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormRaceRegistration from '@/components/UI/Forms/FormRaceRegistration/FormRaceRegistration';
import ContainerTableRegisteredRace from '@/components/Table/Containers/RegisteredRace/RegisteredRace';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import AdContainer from '@/components/AdContainer/AdContainer';
import BlockRegistered from '@/components/BlockRegistered/BlockRegistered';
import BlockMessage from '@/components/BlockMessage/BlockMessage';
import getChampionshipPageData from '@/libs/utils/championship/getChampionshipPageData';
import styles from './Registration.module.css';

// Создание динамических meta данных.
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataChampRegistration(props);
}

type Props = {
  params: Promise<{
    urlSlug: string;
  }>;
};

/**
 * Страница регистрации на Соревнование/Этап.
 */
export default async function Registration(props: Props) {
  const params = await props.params;

  const { urlSlug } = params;

  const session = await getServerSession(authOptions);
  const idRiderDB = session?.user?.idDB;

  const [profile, championshipResponse] = await Promise.all([
    getProfileForReg({ idDB: idRiderDB }),
    getChampionship({ urlSlug }),
  ]);

  const { data: championship } = championshipResponse;
  if (!championship) {
    return <h2>Не получены данные с сервера о Чемпионате </h2>;
  }

  // Возвращает необходимые сущности для страниц чемпионата/
  const { buttons } = getChampionshipPageData({
    parentChampionshipUrlSlug: championshipResponse?.data?.parentChampionship?.urlSlug,
    parentChampionshipType: championshipResponse?.data?.parentChampionship?.type,
    urlSlug,
    championshipType: championship.type,
  });

  const registeredInChamp = await checkRegisteredInChamp({
    idRiderDB,
    champId: championship._id,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__main}>
        {['completed', 'cancelled'].includes(championship.status) ? (
          <BlockMessage>
            <h3 className={styles.error}>{'Регистрация закрыта!'}</h3>
          </BlockMessage>
        ) : (
          <>
            <div className={styles.spacer__form}>
              <TitleAndLine
                hSize={1}
                title={getChampionshipPagesTitleName({
                  name: championship.name,
                  parentChampionship: championship.parentChampionship,
                  type: championship.type,
                  stageOrder: championship.stageOrder,
                  pageName: 'Регистрация на',
                })}
              />

              {profile ? (
                registeredInChamp.data ? (
                  <BlockRegistered registeredInChamp={registeredInChamp.data} />
                ) : championship.races.length > 0 ? (
                  <FormRaceRegistration
                    profile={profile}
                    championshipId={championship._id}
                    races={championship.races}
                    categoriesConfigs={championship.categoriesConfigs}
                  />
                ) : (
                  <BlockMessage>
                    <h3 className={styles.error}>
                      {'Не найдены заезды для данного Чемпионата!'}
                    </h3>
                  </BlockMessage>
                )
              ) : (
                <BlockMessage>
                  <h3 className={styles.error}>
                    Для участия в Чемпионатах требуется регистрация на сайте. Если у вас ещё нет
                    учётной записи, необходимо её создать. При наличии аккаунта следует
                    авторизоваться в системе.
                  </h3>
                </BlockMessage>
              )}
            </div>

            {profile && !registeredInChamp.data && (
              <div className={styles.spacer}>
                <TitleAndLine hSize={2} title="Зарегистрированные участники" />
                <ContainerTableRegisteredRace />
              </div>
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
