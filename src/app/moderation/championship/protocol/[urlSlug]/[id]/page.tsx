import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconResults from '@/components/Icons/IconResults';
import { getChampionship } from '@/actions/championship';

import WrapperProtocolRaceEdit from '@/components/WrapperProtocolRaceEdit/WrapperProtocolRaceEdit';
import { postRiderRaceResult } from '@/actions/result-race';
import { getOrganizerForModerate } from '@/actions/organizer';
import { checkPermissionOrganizer } from '@/actions/permissions';
import styles from '../../../layout.module.css';
import BlockMessage from '@/components/BlockMessage/BlockMessage';
import Spacer from '@/components/Spacer/Spacer';
import IconEditOld from '@/components/Icons/IconEditOld';

type Props = {
  params: Promise<{
    urlSlug: string;
    id: string;
  }>;
};

/**
 * Страница добавления финишного протокола Заезда в Чемпионате
 */
export default async function AddFinishProtocolPage(props: Props) {
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

  if (!championship.data) {
    return (
      <>
        <h2>Не найден запрашиваемый Чемпионат!</h2>
        <p>{championship.message}</p>
      </>
    );
  }

  return (
    <>
      <TitleAndLine
        hSize={1}
        title={`Добавление результатов для чемпионата "${championship.data.name}"`}
        Icon={IconResults}
      />
      {championship.data.parentChampionship?.type === 'series' &&
        !championship.data.racePointsTable && (
          <Spacer margin="b-lg">
            <BlockMessage>
              <>
                <h3 className={styles.error}>
                  Внимание! В настройках Серии заездов не выбрана таблица начисления очков за
                  этапы! При добавлении результата не будут начисляться очки за этап.
                </h3>
                <div>
                  Необходимо создать очковую таблицу (Таблица очков), а затем установить её в
                  настройках Серии заездов.
                </div>
                <div className={styles.helper}>
                  <span>
                    Список ➡️ в строке родительского чемпионата данного этапа (тип Серия) нажать
                  </span>
                  <IconEditOld squareSize={14} />
                  <span> ➡️ Таблица начисления очков за этапы</span>
                  <span> ➡️ Сохранить</span>
                </div>
              </>
            </BlockMessage>
          </Spacer>
        )}

      <WrapperProtocolRaceEdit
        postRiderRaceResult={postRiderRaceResult}
        championship={championship.data}
        initialRaceId={id}
      />
    </>
  );
}
