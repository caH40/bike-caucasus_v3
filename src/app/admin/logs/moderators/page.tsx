import { buttonsMenuAdminPage } from '@/constants/menu';
import { geAllModeratoActionLogsError } from '@/actions/logs';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconLog from '@/components/Icons/IconLog';

import styles from './AllModeratorsLogsPage.module.css';

export const dynamic = 'force-dynamic';

/**
 * Компонент страницы отображения логов модераторов.
 * @returns  - Компонент страницы логов модераторов.
 */
export default async function AllModeratorsLogsPage(): Promise<JSX.Element> {
  const logsData = await geAllModeratoActionLogsError();
  console.log(logsData);

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenuAdminPage} />
      </aside>
      <div className={styles.main}>
        <TitleAndLine Icon={IconLog} title="Логирование ошибок" hSize={1} />

        {/* <ContainerTableLogsError logs={logsData.data} /> */}
      </div>
    </div>
  );
}
