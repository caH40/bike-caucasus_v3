// Страница описания Организатора Чемпионатов
/**
 * Название
 * Лого
 * Описание
 * Контактные данные
 * Список прошедших и будущих Чемпионатов, проводимых организатором.
 * * Отзывы
 */
import { Metadata } from 'next';

import { getOrganizer } from '@/actions/organizer';
import styles from './OrganizerPage.module.css';
import BlockOrganizerHeader from '@/components/BlockOrganizerHeader/BlockOrganizerHeader';
import BlockOrganizerContacts from '@/components/BlockOrganizerContacts/BlockOrganizerContacts';
import { generateMetadataOrganizer } from '@/meta/meta';
import { getChampionships } from '@/actions/championship';
import ChampionshipCard from '@/components/ChampionshipCard/ChampionshipCard';

// Создание динамических meta данных
export async function generateMetadata(props: Props): Promise<Metadata> {
  return await generateMetadataOrganizer(props);
}

type Props = {
  params: Promise<{
    urlSlug: string;
  }>;
};

export default async function OrganizerPage(props: Props) {
  const params = await props.params;

  const { urlSlug } = params;

  const organizer = await getOrganizer({ urlSlug });

  const championships = await getChampionships({
    needTypes: ['series', 'tour', 'single'],
    organizerId: organizer.data?._id,
  });

  return (
    <div className={styles.main}>
      {organizer.data && (
        <>
          <BlockOrganizerHeader organizer={organizer.data} />

          <div className={styles.wrapper__contacts}>
            <BlockOrganizerContacts organizer={organizer.data.contactInfo} />
          </div>

          <div className={styles.wrapper__cards}>
            {championships.data &&
              championships.data.map((champ) => (
                <ChampionshipCard championship={champ} key={champ._id} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
