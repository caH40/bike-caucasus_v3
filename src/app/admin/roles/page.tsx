import type { ResponseServer } from '@/types/index.interface';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconRole from '@/components/Icons/IconRole';

import styles from './roles.module.css';

export const dynamic = 'force-dynamic';

async function getPermissions(): Promise<ResponseServer<null>> {}

export default async function RolesAdminPage() {
  return (
    <>
      <TitleAndLine
        title="Администрирование ролей и разрешений (доступов) к ресурсам сайта"
        hSize={1}
        Icon={IconRole}
      />
    </>
  );
}
