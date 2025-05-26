import { Logger } from '@/services/logger';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuAdminPage } from '@/constants/menu';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconLog from '@/components/Icons/IconLog';
import ContainerTableLogsError from '@/components/Table/Containers/LogsError/ContainerTableLogsError';
import type { TGetErrorsDto } from '@/types/dto.types';
import type { ServerResponse } from '@/types/index.interface';
import styles from './LogsErrorsPage.module.css';

export const dynamic = 'force-dynamic';

/**
 * Получает список ошибок из логов.
 * @returns - Промис с данными логов ошибок или null в случае ошибки.
 */
async function getLogsError(): Promise<ServerResponse<TGetErrorsDto[] | null>> {
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
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenuAdminPage} />
      </aside>
      <div className={styles.main}>
        <TitleAndLine Icon={IconLog} title="Логирование ошибок" hSize={1} />

        <ContainerTableLogsError logs={logsData.data} />
      </div>
    </div>
  );
}
