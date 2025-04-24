import Image from 'next/image';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import MenuProfile from '@/components/UI/Menu/MenuProfile/MenuProfile';
import BlockSocial from '@/components/BlockSocial/BlockSocial';

import { getLogoProfile } from '@/libs/utils/profile';
import { blurBase64 } from '@/libs/image';
import { generateMetadataProfile } from '@/meta/meta';
import { getRegistrationsRider } from '@/actions/registration-champ';
import TableRegistrationsRider from '@/components/Table/TableRegistrationsRider/TableRegistrationsRider';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getResultsRaceForRider } from '@/actions/result-race';
import TableResultsRider from '@/components/Table/TableResultsRider/TableResultsRider';
import styles from './ProfilePage.module.css';
import { getProfile } from '@/actions/user';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Создание динамических meta данных
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataProfile(props);
}

/**
 * Страница профиля пользователя.
 */
export default async function ProfilePage(props: Props) {
  const params = await props.params;

  const { id } = params;

  const session = await getServerSession(authOptions);
  const userIdDbFromSession = session?.user.idDB;

  const { data: profile } = await getProfile({ userId: +id });

  // Если нет данных, то пользователь не найден.
  if (!profile) {
    return <h2>Пользователь не найден</h2>;
  }

  const profileImage = getLogoProfile(
    profile.imageFromProvider,
    profile.provider?.image,
    profile.image
  );

  const [registrationsRider, results] = await Promise.all([
    getRegistrationsRider({ riderId: id }),
    getResultsRaceForRider({ riderId: id }),
  ]);

  return (
    <div className={styles.wrapper}>
      <aside className={styles.wrapper__aside}>
        <Image
          width={300}
          height={300}
          src={profileImage}
          alt="vk"
          className={styles.profile__image}
          priority={true}
          placeholder="blur"
          blurDataURL={blurBase64}
        />

        <section className={styles.wrapper__details}>
          <h1 className={styles.title}>{`${profile.person.lastName} ${
            profile.person.firstName
          }${profile.person.patronymic ? ' ' + profile.person.patronymic : ''}`}</h1>
          <dl className={styles.list}>
            <dt className={styles.desc__title}>Город</dt>
            <dd className={styles.desc__detail}>{profile.city ?? 'нет данных'}</dd>

            <dt className={styles.desc__title}>Возраст</dt>
            <dd className={styles.desc__detail}>
              {'ageCategory' in profile.person ? profile.person.ageCategory : 'нет данных'}
            </dd>

            <dt className={styles.desc__title}>Пол</dt>
            <dd className={styles.desc__detail}>
              {profile.person.gender === 'female' ? 'женский' : 'мужской'}
            </dd>

            <dt className={styles.desc__title}>Команда</dt>
            <dd className={styles.desc__detail}>{profile.team?.name ?? 'нет данных'}</dd>

            <dt className={styles.desc__title}>Контакты</dt>
            <dd className={styles.desc__detail}>
              <BlockSocial social={profile.social} />
            </dd>
          </dl>
          {profile.person.bio && <p>{profile.person.bio}</p>}
        </section>

        {/* меню профиля */}
        <div className={styles.menu}>
          <MenuProfile profileId={id} />
        </div>
      </aside>

      <div className={styles.wrapper__main}>
        <article className={styles.races}>
          <h2 className={styles.title__races}>Участие в соревнованиях</h2>
          <hr className={styles.line} />
          {results.data ? (
            <TableResultsRider results={results.data} />
          ) : (
            <p className={styles.paragraph}>Нет данных</p>
          )}
        </article>

        <article className={styles.races}>
          <h2 className={styles.title__races}>Зарегистрирован в соревнованиях</h2>
          <hr className={styles.line} />
          {registrationsRider.data ? (
            <TableRegistrationsRider
              registrationsRider={registrationsRider.data}
              userIdDbFromSession={userIdDbFromSession}
            />
          ) : (
            <p className={styles.paragraph}>Нет данных</p>
          )}
        </article>
      </div>
    </div>
  );
}
