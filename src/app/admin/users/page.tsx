import TableUsersAdmin from '@/components/Table/TableUsersAdmin/TableUsersAdmin';
import { UserService } from '@/services/user';
import { TUserDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';
import styles from './UsersAdminPage.module.css';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuAdminPage } from '@/constants/menu';

export const dynamic = 'force-dynamic';

async function getUsers(): Promise<ResponseServer<TUserDto[] | null>> {
  const userService = new UserService();

  const response = await userService.getProfiles();

  return response;
}

export default async function UsersAdminPage() {
  const response = await getUsers();
  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside__left}>
        <MenuOnPage buttons={buttonsMenuAdminPage} />
      </aside>
      <div className={styles.main}>
        <h1 className={styles.title}>Администрирование зарегистрированными пользователями</h1>
        <TableUsersAdmin users={response.data || []} />
      </div>
    </div>
  );
}
