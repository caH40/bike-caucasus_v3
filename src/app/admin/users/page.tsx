import TableUsersAdmin from '@/components/Table/TableUsersAdmin/TableUsersAdmin';
import { UserService } from '@/services/user';
import { TUserDto } from '@/types/dto.types';
import type { ResponseServer } from '@/types/index.interface';
import styles from './UsersAdminPage.module.css';

export const dynamic = 'force-dynamic';

async function getUsers(): Promise<ResponseServer<TUserDto[] | null>> {
  const userService = new UserService();

  const response = await userService.getProfiles();

  return response;
}

export default async function UsersAdminPage() {
  const response = await getUsers();
  return (
    <>
      <h1 className={styles.title}>Администрирование зарегистрированными пользователями</h1>
      <TableUsersAdmin users={response.data || []} />
    </>
  );
}
