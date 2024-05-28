import TableUsersAdmin from '@/components/Table/TableUsersAdmin/TableUsersAdmin';
import { UserService } from '@/services/mongodb/UserService';
import type { ResponseServer } from '@/types/index.interface';
import { IUserModel } from '@/types/models.interface';

async function getUsers(): Promise<ResponseServer<IUserModel[] | null>> {
  const userService = new UserService();

  const response = await userService.getProfiles();

  return response;
}

export default async function UsersAdminPage() {
  const logsData = await getUsers();
  return (
    <>
      <h1>Администрирование зарегистрированными пользователями</h1>
      <TableUsersAdmin users={logsData.data || []} />
    </>
  );
}
