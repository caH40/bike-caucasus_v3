import { getTimerLocal } from '@/libs/utils/date-local';
import { getLogError } from '@/actions/logs';
import ShowServerError from '@/components/UI/ShowServerError/ShowServerError';
import styles from './ModeratorLogPage.module.css';

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
  const { data: log, ok, message } = await getLogError({ id: params.id });

  return (
    <>
      {log && (
        <section>
          <ShowServerError ok={ok} message={message} />
          <dl className={styles.list}>
            <dt>Дата и время</dt>
            <dd className={styles.group}>{getTimerLocal(log.createdAt, 'DDMMYYHms')}</dd>
            {log.type && (
              <>
                <dt>Тип</dt>
                <dd className={styles.group}>{log.type}</dd>
              </>
            )}

            {log.message && (
              <>
                <dt>Краткое описание</dt>
                <dd className={styles.group}>{log.message}</dd>
              </>
            )}

            {log.stack && (
              <>
                <dt>Стэк</dt>
                <dd className={styles.group}>
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: log.stack,
                    }}
                  />
                </dd>
              </>
            )}
          </dl>
        </section>
      )}
    </>
  );
}
