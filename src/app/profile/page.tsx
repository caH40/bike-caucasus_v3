import Image from 'next/image';

import styles from './ProfilePage.module.css';
import { type IProfileForClient } from '@/types/fetch.interface';

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

/**
 * Получение данных профиля с сервера.
 * @param id - id профиля на сайте.
 * @returns
 */
async function getProfile(id: string): Promise<IProfileForClient | null> {
  try {
    if (!server) {
      throw new Error('Не получены данные с server с .env');
    }
    const res = await fetch(`${server}/api/profile/${id}`);
    if (!res.ok) {
      throw new Error('Ошибка fetch');
    }
    const profile = await res.json();

    return profile;
  } catch (error) {
    return null;
  }
}

/**
 * Страница профиля спортсмена
 */
export default async function ProfilePage() {
  const profile = await getProfile('1000');

  return (
    <div className={styles.wrapper}>
      <aside className={styles.wrapper__aside}>
        {profile?.image ? (
          <Image
            width={300}
            height={300}
            src={profile.image}
            alt="vk"
            className={styles.profile__image}
          />
        ) : (
          <div className={styles.empty}></div>
        )}
        {!profile && (
          <section className={styles.details}>
            <h1 className={styles.title}>Бережнев Александр</h1>
            <dl className={styles.list}>
              <dt className={styles.desc__title}>Город</dt>
              <dd className={styles.desc__detail}>Пятигорск </dd>

              <dt className={styles.desc__title}>Возраст</dt>
              <dd className={styles.desc__detail}>ветеран</dd>

              <dt className={styles.desc__title}>Пол</dt>
              <dd className={styles.desc__detail}>мужской</dd>

              <dt className={styles.desc__title}>Команда</dt>
              <dd className={styles.desc__detail}>нет</dd>

              <dt className={styles.desc__title}>Контакты</dt>
              <dd className={styles.desc__detail}>tel</dd>
              <dd className={styles.desc__detail}>gar</dd>
            </dl>
          </section>
        )}
        <div className={styles.menu}></div>
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
