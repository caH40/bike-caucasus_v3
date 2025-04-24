import { getServerSession } from 'next-auth';
import { Metadata } from 'next';

import { getChampionship } from '@/actions/championship';
import { getH1ForRegistration } from '../../utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getProfileForReg } from '@/actions/user';
import { buttonsMenuChampionshipPage } from '@/constants/menu-function';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormRaceRegistration from '@/components/UI/Forms/FormRaceRegistration/FormRaceRegistration';
import ContainerTableRegisteredRace from '@/components/Table/Containers/RegisteredRace/RegisteredRace';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import AdContainer from '@/components/AdContainer/AdContainer';
import { generateMetadataChampRegistration } from '@/meta/meta';
import BlockRegistered from '@/components/BlockRegistered/BlockRegistered';
import { checkRegisteredInChamp } from '@/actions/registration-champ';
import styles from './Registration.module.css';
import BlockMessage from '@/components/BlockMessage/BlockMessage';

// Создание динамических meta данных.
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataChampRegistration(/* @next-codemod-error 'props' is passed as an argument. Any asynchronous properties of 'props' must be awaited when accessed. */
  props);
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

  const {
    urlSlug
  } = params;

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

  const registeredInChamp = await checkRegisteredInChamp({
    idRiderDB,
    champId: championship._id,
  });

  const buttons = buttonsMenuChampionshipPage(urlSlug);
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
                title={getH1ForRegistration({
                  name: championship.name,
                  parentChampionship: championship.parentChampionship,
                  type: championship.type,
                  stage: championship.stage,
                })}
              />

              {profile ? (
                registeredInChamp.data ? (
                  <BlockRegistered registeredInChamp={registeredInChamp.data} />
                ) : (
                  <FormRaceRegistration
                    profile={profile}
                    championshipId={championship._id}
                    races={championship.races}
                  />
                )
              ) : (
                <BlockMessage>
                  <h3 className={styles.error}>
                    Для регистрации в Чемпионатах необходимо зарегистрироваться на сайте, если
                    вы еще не сделали этого. Если у вас уже есть учетная запись, пожалуйста,
                    войдите в нее.
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
