import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';
import WrapperResultRaceEdit from '@/components/WrapperResultRaceEdit/WrapperResultRaceEdit';
import { getResultRaceForRider, putResultRaceRider } from '@/actions/result-race';
import { getChampionship } from '@/actions/championship';
import { getOrganizerForModerate } from '@/actions/organizer';
import styles from '../../../layout.module.css';
import { checkPermissionOrganizer } from '@/actions/permissions';
import BlockMessage from '@/components/BlockMessage/BlockMessage';

type Props = {
  params: Promise<{
    resultId: string;
  }>;
};

/**
 * Страница редактирования финишного протокола Заезда в Чемпионате.
 */
export default async function EditFinishProtocolPage(props: Props) {
  const params = await props.params;

  const { resultId } = params;

  const result = await getResultRaceForRider({ resultId });

  if (!result.data) {
    return (
      <>
        <h2>Не найден запрашиваемый Результат!</h2>
        <p>{result.message}</p>
      </>
    );
  }

  const [championship, organizer] = await Promise.all([
    getChampionship({ urlSlug: result.data.championship.urlSlug, forModeration: true }),
    getOrganizerForModerate(),
  ]);

  if (!organizer.data || !championship.data) {
    return (
      <h2 className={styles.error}>
        Не найден Организатор, перед созданием Чемпионата необходимо создать Организатора!
      </h2>
    );
  }

  if (['series', 'tour'].includes(championship.data.type)) {
    return (
      <BlockMessage>
        <h2 className={styles.error}>
          В Серии или Туре нет финишных протоколов. Добавляйте финишный протокол в
          соответствующих заездах этапов данного Чемпионата!
        </h2>
      </BlockMessage>
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

  return (
    <>
      <TitleAndLine
        hSize={1}
        title={`Редактирование результата райдера для чемпионата "${championship.data.name}"`}
        Icon={IconResults}
      />
      <WrapperResultRaceEdit result={result.data} putResultRaceRider={putResultRaceRider} />
    </>
  );
}
