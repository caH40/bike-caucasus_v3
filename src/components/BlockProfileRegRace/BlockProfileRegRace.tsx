import { TProfileForRegistration } from '@/types/index.interface';
import { getDefaultValue } from '../UI/Forms/FormRaceRegistration/account';
import styles from './BlockProfileRegRace.module.css';
import TitleAndLine from '../TitleAndLine/TitleAndLine';

type Props = {
  profile: TProfileForRegistration;
  category: { age: string | null; skillLevel: string | null };
};

export default function BlockProfileRegRace({ profile, category }: Props) {
  return (
    <section className={styles.wrapper}>
      <TitleAndLine hSize={3} title="Данные из вашего аккаунта:" />

      <dl className={styles.list}>
        <dt className={styles.desc__title}>Фамилия</dt>
        <dd className={styles.desc__detail}>{getDefaultValue(profile.lastName, 'lastName')}</dd>

        <dt className={styles.desc__title}>Имя</dt>
        <dd className={styles.desc__detail}>
          {getDefaultValue(profile.firstName, 'firstName')}
        </dd>

        <dt className={styles.desc__title}>Отчество</dt>
        <dd className={styles.desc__detail}>{profile.patronymic}</dd>

        <dt className={styles.desc__title}>Год рождения</dt>
        <dd className={styles.desc__detail}>
          {getDefaultValue(profile.yearBirthday, 'yearBirthday')}
        </dd>

        <dt className={styles.desc__title}>
          {category.skillLevel ? 'Спецкатегория' : 'Возрастная категория'}
        </dt>
        <dd className={styles.desc__detail}>
          {category.skillLevel ? category.skillLevel : category.age}
        </dd>

        <dt className={styles.desc__title}>Пол</dt>
        <dd className={styles.desc__detail}>{getDefaultValue(profile.gender, 'gender')}</dd>

        <dt className={styles.desc__title}>Город</dt>
        <dd className={styles.desc__detail}>{getDefaultValue(profile.city, 'city')}</dd>
      </dl>
    </section>
  );
}
