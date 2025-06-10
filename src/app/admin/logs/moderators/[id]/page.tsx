import { getTimerLocal } from '@/libs/utils/date-local';
import { getModeratorActionLog } from '@/actions/logs';
import ShowServerError from '@/components/UI/ShowServerError/ShowServerError';
import styles from './ModeratorLogPage.module.css';
import JSONBlock from '@/components/JSONBlock/JSONBlock';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export const dynamic = 'force-dynamic';

/**
 * Страница подобной информации о действии модератора.
 */
export default async function ModeratorLogPage(props: Props) {
  const params = await props.params;
  const { data: log, ok, message } = await getModeratorActionLog(params.id);

  return (
    <>
      {log && (
        <section>
          <ShowServerError ok={ok} message={message} />
          <dl className={styles.list}>
            <dt>Дата и время</dt>
            <dd className={styles.group}>{getTimerLocal(log.timestamp, 'DDMMYYHms')}</dd>

            <dt>Модератор</dt>
            <dd className={styles.group}>{log.moderator.person.lastName}</dd>

            <dt>Сущность</dt>
            <dd className={styles.group}>{log.entity}</dd>

            <dt>Действие</dt>
            <dd className={styles.group}>{log.action}</dd>

            {log.changes && (
              <>
                <dt>Входные параметры и комментарий</dt>
                <dd className={styles.group}>{JSONBlock({ json: log.changes })}</dd>
              </>
            )}

            <dt>_id лога</dt>
            <dd className={styles.group}>{log._id}</dd>

            <dt>_ids модерируемых сущностей</dt>
            <dd className={styles.group}>{JSONBlock({ json: log.entityIds })}</dd>

            {log.client && (
              <>
                <dt>meta данные модератора</dt>
                <dd className={styles.group}>{JSONBlock({ json: log.client })}</dd>
              </>
            )}
          </dl>
        </section>
      )}
    </>
  );
}
