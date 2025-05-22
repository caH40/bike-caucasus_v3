import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';
import { getChampionship } from '@/actions/championship';
import { TOptions } from '@/types/index.interface';
import WrapperProtocolRaceEdit from '@/components/WrapperProtocolRaceEdit/WrapperProtocolRaceEdit';
import { postRiderRaceResult } from '@/actions/result-race';
import { getOrganizerForModerate } from '@/actions/organizer';
import { checkPermissionOrganizer } from '@/actions/permissions';
import styles from '../../../layout.module.css';

type Props = {
  params: Promise<{
    urlSlug: string;
    id: string;
  }>;
};

/**
 * Страница добавления/редактирования финишного протокола Заезда в Чемпионате
 */
export default async function ProtocolRaceEditPage(props: Props) {
  const params = await props.params;

  const { urlSlug, id } = params;

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
    championshipId: championship.data.organizer._id,
  });

  if (!responsePermission.ok) {
    return <h2 className={styles.error}>{responsePermission.message}</h2>;
  }

  if (!championship.data) {
    return (
      <>
        <h2>Не найден запрашиваемый Чемпионат!</h2>
        <p>{championship.message}</p>
      </>
    );
  }

  // Опции для выбора заезда в котором редактируется финишный протокол.
  const options: TOptions[] = championship.data.races.map((race) => ({
    id: race.number,
    translation: `Заезд №${race.number}: ${race.name}`,
    name: String(race._id),
  }));

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Добавление результатов райдеров для протокола Заезда"
        Icon={IconResults}
      />
      <WrapperProtocolRaceEdit
        postRiderRaceResult={postRiderRaceResult}
        options={options}
        championship={championship.data}
        initialRaceId={id}
      />
    </>
  );
}
