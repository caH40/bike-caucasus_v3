import Image from 'next/image';

import MenuProfile from '@/components/UI/menu/MenuProfile/MenuProfile';
import { UserService } from '@/services/mongodb/UserService';
import type { ParamsWithId } from '@/types/index.interface';
import styles from './ProfilePage.module.css';
import { handlerDateForm } from '@/libs/utils/date';

const userService = new UserService();

/**
 * Страница профиля пользователя
 */
export default async function ProfilePage({ params }: ParamsWithId) {
  const { data: profile } = await userService.getProfile({ id: +params.id });

  return (
    <div className={styles.wrapper}>
      <aside className={styles.wrapper__aside}>
        {profile ? (
          <Image
            width={300}
            height={300}
            src={profile.image ?? '/images/icons/noimage.svg'}
            alt="vk"
            className={styles.profile__image}
          />
        ) : (
          <div className={styles.empty}></div>
        )}
        {profile && (
          <section className={styles.wrapper__details}>
            <h1
              className={styles.title}
            >{`${profile.person.lastName} ${profile.person.firstName}`}</h1>
            <dl className={styles.list}>
              <dt className={styles.desc__title}>Город</dt>
              <dd className={styles.desc__detail}>{profile.city ?? 'нет данных'}</dd>

              <dt className={styles.desc__title}>Возраст</dt>
              <dd className={styles.desc__detail}>
                {handlerDateForm.getFormDate(profile.person.ageCategory) ?? 'нет данных'}
              </dd>

              <dt className={styles.desc__title}>Пол</dt>
              <dd className={styles.desc__detail}>
                {profile.person.gender === 'female' ? 'женский' : 'мужской'}
              </dd>

              <dt className={styles.desc__title}>Команда</dt>
              <dd className={styles.desc__detail}>{profile.team?.name ?? 'нет данных'}</dd>

              <dt className={styles.desc__title}>Контакты</dt>
              <dd className={styles.desc__detail}>tel</dd>
              <dd className={styles.desc__detail}>gar</dd>
            </dl>
            {profile.person.bio && <p>{profile.person.bio}</p>}
          </section>
        )}
        <div className={styles.menu}>
          <MenuProfile />
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
