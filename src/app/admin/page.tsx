import Wrapper from '@/components/Wrapper/Wrapper';
import styles from './Admin.module.css';
import { buttonsMenuAdminPage } from '@/constants/menu';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import IconAdmin from '@/components/Icons/IconAdmin';

export default function AdminPage() {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenuAdminPage} />
      </aside>
      <div className={styles.main}>
        <Wrapper title="Администрирование сайта" Icon={IconAdmin}>
          <h2>Добро пожаловать на страницу администрирования сайта</h2>
          <div>
            <h3>Просмотр логов ошибок</h3>
            <p>
              Отслеживайте и анализируйте ошибки, возникающие на сайте. Это поможет вам быстро
              находить и устранять неполадки, обеспечивая стабильную работу системы.
            </p>
          </div>

          <div>
            <h3>Просмотр логов действий модераторов и админов</h3>
            <p>
              Контролируйте действия модераторов и администраторов на сайте. Это включает в себя
              все изменения, внесенные в контент, а также административные операции.
            </p>
          </div>

          <div>
            <h3>Назначение прав пользователям</h3>
            <p>
              Управляйте правами пользователей, предоставляя или ограничивая доступ к различным
              функциям и разделам сайта.
            </p>
          </div>

          <div>
            <h3>Блокировка пользователей</h3>
            <p>
              Блокируйте нарушителей и предотвращайте нежелательные действия на сайте.
              Заблокированные пользователи не смогут войти в свои аккаунты и взаимодействовать с
              сайтом.
            </p>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
