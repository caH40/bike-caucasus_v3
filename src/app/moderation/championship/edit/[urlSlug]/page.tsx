import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import FormChampionship from '@/components/UI/Forms/FormChampionship/FormChampionship';
import IconChampionship from '@/components/Icons/IconChampionship';

import { getChampionship, getToursAndSeries, putChampionship } from '@/actions/championship';
import { getOrganizerForModerate } from '@/actions/organizer';
import { checkPermissionOrganizer } from '@/actions/permissions';
import styles from '../ChampionshipEditPage.module.css';

type Props = {
  params: {
    urlSlug: string;
  };
};

/**
 * Страница Редактирования запрашиваемого Чемпионата.
 */
export default async function ChampionshipEditCurrentPage({ params: { urlSlug } }: Props) {
  // Получение чемпионата для редактирования.
  // Проверка прав пользователя на редактирование Чемпионата и получение данных Организатора.
  const [championship, organizer] = await Promise.all([
    getChampionship({ urlSlug, forModeration: true }),
    getOrganizerForModerate(),
  ]);

  if (!organizer.data || !championship.data) {
    return (
      <h2 className={styles.error}>
        Не найден Организатор, перед созданием Чемпионата необходимо создать Организатора!
      </h2>
    );
  }

  // Проверка разрешения на редактирование.
  const responsePermission = await checkPermissionOrganizer({
    organizerId: organizer.data?._id,
    championshipId: championship.data?.organizer._id,
  });

  if (!responsePermission.ok) {
    return (
      <h2 className={styles.error}>
        Вы не являетесь Организатором или модератором для данного Чемпионата!
      </h2>
    );
  }

  const parentChampionships = await getToursAndSeries({ organizerId: organizer.data._id });

  return (
    <>
      <TitleAndLine title="Редактирование Чемпионата" hSize={1} Icon={IconChampionship} />
      <FormChampionship
        putChampionship={putChampionship}
        championshipForEdit={championship.data}
        parentChampionships={parentChampionships.data || []}
        organizer={organizer.data}
      />
    </>
  );
}
