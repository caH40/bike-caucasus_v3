import { UserService } from '@/services/user';
import ContainerTableUsers from '@/components/Table/Containers/Users/ContainerTableUsers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconUsers from '@/components/Icons/IconUsers';
import type { TUserDto } from '@/types/dto.types';
import type { ServerResponse } from '@/types/index.interface';
import styles from './UsersAdminPage.module.css';

export const dynamic = 'force-dynamic';

async function getUsers(): Promise<ServerResponse<TUserDto[] | null>> {
  const userService = new UserService();

  const response = await userService.getProfiles();

  return response;
}

export default async function UsersAdminPage() {
  const response = await getUsers();
  return (
    <div className={styles.wrapper}>
      <TitleAndLine
        title="Администрирование зарегистрированными пользователями"
        hSize={1}
        Icon={IconUsers}
      />
      <ContainerTableUsers users={response.data} />
    </div>
  );
}
