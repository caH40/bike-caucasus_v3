import { getServerSession } from 'next-auth';

import { getChampionship } from '@/actions/championship';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { getTitle } from './utils';
import FormRaceRegistration from '@/components/UI/Forms/FormRaceRegistration/FormRaceRegistration';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getProfileForReg } from '@/actions/user';
import styles from './Registration.module.css';

type Props = {
  params: {
    champName: string;
  };
};

/**
 * Страница регистрации на Соревнование/Этап.
 */
export default async function Registration({ params: { champName } }: Props) {
  const session = await getServerSession(authOptions);

  const profile = await getProfileForReg({ idDB: session?.user?.idDB });

  const { data: championship } = await getChampionship({ urlSlug: champName });
  if (!championship) {
    return <h2>Не получены данные с сервера о Чемпионате </h2>;
  }

  return (
    <div className={styles.wrapper}>
      <TitleAndLine
        hSize={1}
        title={getTitle({
          name: championship.name,
          parentChampionship: championship.parentChampionship,
          type: championship.type,
          stage: championship.stage,
        })}
      />

      {/* <TitleAndLine hSize={2} title="Выбор заезда" /> */}

      {profile ? (
        <FormRaceRegistration
          profile={profile}
          championshipId={championship._id}
          races={championship.races}
        />
      ) : (
        <h3>
          Для регистрации в Чемпионатах вам необходимо сначала зарегистрироваться на сайте, если
          вы еще не сделали этого. Если у вас уже есть учетная запись, пожалуйста, войдите в
          нее.
        </h3>
      )}
    </div>
  );
}
