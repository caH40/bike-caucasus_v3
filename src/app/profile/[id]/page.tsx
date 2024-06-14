import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import MenuProfile from '@/components/UI/Menu/MenuProfile/MenuProfile';
import BlockSocial from '@/components/BlockSocial/BlockSocial';
import { UserService } from '@/services/user';
import { getLogoProfile } from '@/libs/utils/profile';
import { blurBase64 } from '@/libs/image';
import type { ParamsWithId } from '@/types/index.interface';
import styles from './ProfilePage.module.css';
import { generateMetadataProfile } from '@/meta/meta';

// Создание динамических meta данных
export async function generateMetadata(props: ParamsWithId): Promise<Metadata> {
  return await generateMetadataProfile(props);
}

const userService = new UserService();

/**
 * Страница профиля пользователя
 */
export default async function ProfilePage({ params }: ParamsWithId) {
  const { data: profile } = await userService.getProfile({ id: +params.id });
  const profileImage = getLogoProfile(
    profile?.imageFromProvider,
    profile?.provider?.image,
    profile?.image
  );

  if (!profile) {
    notFound();
  }

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
          <h1
            className={styles.title}
          >{`${profile.person.lastName} ${profile.person.firstName}`}</h1>
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
          <MenuProfile profileId={params.id} />
        </div>
      </aside>

      <div className={styles.wrapper__main}>
        <article className={styles.races}>
          <h2 className={styles.title__races}>Участие в соревнованиях</h2>
          <hr className={styles.line} />
          <p className={styles.paragraph}>Нет данных</p>
        </article>
        <article className={styles.races}>
          <h2 className={styles.title__races}>Зарегистрирован в соревнованиях</h2>
          <hr className={styles.line} />
          <p className={styles.paragraph}>Нет данных</p>
        </article>
      </div>
    </div>
  );
}
