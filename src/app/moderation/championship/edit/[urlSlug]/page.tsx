import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconChampionship from '@/components/Icons/IconChampionship';
import { getChampionship, getToursAndSeries } from '@/actions/championship';
import { getOrganizerForModerate } from '@/actions/organizer';
import { checkPermissionOrganizer } from '@/actions/permissions';
import styles from '../ChampionshipEditPage.module.css';
import CContainerChampionshipForms from '@/components/ClientContainers/CContainerChampionshipForms/CContainerChampionshipForms';
import { getRacePointsTables } from '@/actions/race-points-table';
import { getChampionshipPagesTitleName } from '@/app/championships/utils';
import { getAllDistances } from '@/actions/distance';

type Props = {
  params: Promise<{
    urlSlug: string;
  }>;
};

/**
 * Страница Редактирования запрашиваемого Чемпионата.
 */
export default async function ChampionshipEditCurrentPage(props: Props) {
  const params = await props.params;

  const { urlSlug } = params;

  // Получение чемпионата для редактирования.
  // Проверка прав пользователя на редактирование Чемпионата и получение данных Организатора.
  const [championship, organizer, racePointsTables, distances] = await Promise.all([
    getChampionship({ urlSlug, forModeration: true }),
    getOrganizerForModerate(),
    getRacePointsTables(),
    getAllDistances(),
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
    return <h2 className={styles.error}>{responsePermission.message}</h2>;
  }

  const parentChampionships = await getToursAndSeries({ organizerId: organizer.data._id });

  return (
    <>
      <TitleAndLine
        title={getChampionshipPagesTitleName({
          name: championship.data.name,
          parentChampionship: championship.data.parentChampionship,
          type: championship.data.type,
          stageOrder: championship.data.stageOrder,
          pageName: 'Редактирование',
        })}
        hSize={1}
        Icon={IconChampionship}
      />

      <CContainerChampionshipForms
        championshipForEdit={championship.data}
        parentChampionships={parentChampionships.data || []}
        organizer={organizer.data}
        racePointsTables={racePointsTables?.data || []}
        distances={distances.data || []}
      />
    </>
  );
}
