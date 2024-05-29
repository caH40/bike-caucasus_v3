import TableLogsErrors from '@/components/Table/TableLogsErrors/TableLogsErrors';
import { Logger } from '@/services/logger';
import type { TGetErrorsDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';
import styles from './LogsErrorsPage.module.css';

/**
 * Получает список ошибок из логов.
 * @returns - Промис с данными логов ошибок или null в случае ошибки.
 */
async function getLogsError(): Promise<ResponseServer<TGetErrorsDto[] | null>> {
  const logger = new Logger();

  const response = await logger.getErrors();

  return response;
}

/**
 * Компонент страницы отображения логов ошибок.
 * @returns  - Компонент страницы логов ошибок.
 */
export default async function LogsErrorsPage(): Promise<JSX.Element> {
  const logsData = await getLogsError();
  return (
    <>
      <h1 className={styles.title}>Логирование ошибок</h1>
      <TableLogsErrors logs={logsData.data || []} />
    </>
  );
}
