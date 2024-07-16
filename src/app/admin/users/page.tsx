import { UserService } from '@/services/user';
import { TUserDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';
import MenuOnPage from '@/components/UI/Menu/MenuOnPage/MenuOnPage';
import { buttonsMenuAdminPage } from '@/constants/menu';
import ContainerTableUsers from '@/components/Table/Containers/Users/ContainerTableUsers';
import styles from './UsersAdminPage.module.css';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconUsers from '@/components/Icons/IconUsers';

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
        <TitleAndLine
          title="Администрирование зарегистрированными пользователями"
          hSize={1}
          Icon={IconUsers}
        />
        <ContainerTableUsers users={response.data} />
      </div>
    </div>
  );
}
