import { buttonsMenuAdminPage } from '@/constants/menu';
import { geAllModeratoActionLogs } from '@/actions/logs';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconLog from '@/components/Icons/IconLog';

import styles from './AllModeratorsLogsPage.module.css';
import AllModeratorActionLogsContainer from '@/components/Table/Containers/AllModeratorActionLogs/AllModeratorActionLogsContainer';

export const dynamic = 'force-dynamic';

/**
 * Компонент страницы отображения логов модераторов.
 * @returns  - Компонент страницы логов модераторов.
 */
export default async function AllModeratorsLogsPage(): Promise<JSX.Element> {
  const logsData = await geAllModeratoActionLogs();

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenuAdminPage} />
      </aside>
      {logsData.data ? (
        <div className={styles.main}>
          <TitleAndLine Icon={IconLog} title="Логирование ошибок" hSize={1} />

          <AllModeratorActionLogsContainer logs={logsData.data} />
        </div>
      ) : (
        <h3>Данные не получены</h3>
      )}
    </div>
  );
}
