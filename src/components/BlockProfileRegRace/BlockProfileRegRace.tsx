import { TProfileForRegistration } from '@/types/index.interface';
import { getDefaultValue } from '../UI/Forms/FormRaceRegistration/utils';
import styles from './BlockProfileRegRace.module.css';

type Props = {
  profile: TProfileForRegistration;
  // firstName: string;
  // lastName: string;
  // gender: string;
  // ageCategory: string;
  // city: string;
};

export default function BlockProfileRegRace({
  profile,
}: // firstName,
// lastName,
// gender,
// ageCategory,
// city,
Props) {
  return (
    <section className={styles.wrapper}>
      <h3 className={styles.title}>Данные из профиля аккаунта:</h3>
      <dl className={styles.list}>
        <dt className={styles.desc__title}>Имя</dt>
        <dd className={styles.desc__detail}>
          {getDefaultValue(profile.firstName, 'firstName')}
        </dd>

        <dt className={styles.desc__title}>Фамилия</dt>
        <dd className={styles.desc__detail}>{getDefaultValue(profile.lastName, 'lastName')}</dd>

        <dt className={styles.desc__title}>Возрастная категория</dt>
        <dd className={styles.desc__detail}>
          {getDefaultValue(profile.ageCategory, 'ageCategory')}
        </dd>

        <dt className={styles.desc__title}>Пол</dt>
        <dd className={styles.desc__detail}>{getDefaultValue(profile.gender, 'gender')}</dd>

        <dt className={styles.desc__title}>Город</dt>
        <dd className={styles.desc__detail}>{getDefaultValue(profile.city, 'city')}</dd>
      </dl>
    </section>
  );
}
