import type { ResponseServer } from '@/types/index.interface';
import styles from './permissions.module.css';

export const dynamic = 'force-dynamic';

async function getPermissions(): Promise<ResponseServer<null>> {}

export default async function PermissionsAdminPage() {
  return (
    <>
      <h1 className={styles.title}>Администрирование разрешений (доступов) к ресурсам сайта</h1>
    </>
  );
}
