import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';
import { getChampionship } from '@/actions/championship';
import { TOptions } from '@/types/index.interface';
import WrapperProtocolRaceEdit from '@/components/WrapperProtocolRaceEdit/WrapperProtocolRaceEdit';
import { postResultRaceRider } from '@/actions/result-race';
import { getOrganizerForModerate } from '@/actions/organizer';
import { checkPermissionOrganizer } from '@/actions/permissions';
import styles from '../../../layout.module.css';

type Props = {
  params: {
    urlSlug: string;
    raceNumber: string;
  };
};

/**
 * Страница добавления/редактирования финишного протокола Заезда в Чемпионате
 */
export default async function ProtocolRaceEditPage({ params: { urlSlug, raceNumber } }: Props) {
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

  const options: TOptions[] = championship.data.races.map((race) => ({
    id: race.number,
    translation: `Заезд №${race.number}: ${race.name}`,
    name: String(race.number),
  }));

  return (
    <>
      <TitleAndLine
        hSize={1}
        title="Добавление результатов райдеров для протокола Заезда"
        Icon={IconResults}
      />
      <WrapperProtocolRaceEdit
        postResultRaceRider={postResultRaceRider}
        options={options}
        championship={championship.data}
        initialRaceNumber={raceNumber}
      />
    </>
  );
}
