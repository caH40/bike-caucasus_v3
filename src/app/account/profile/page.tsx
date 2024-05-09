import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import FormProfile from '@/components/UI/Forms/FormProfile/FormProfile';
import styles from './AccountProfilePage.module.css';
import { UserService } from '@/services/mongodb/UserService';

/**
 * Страница изменения данных профиля
 */
export default async function AccountProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.idDB) {
    return <h1>Не получен id пользователя</h1>;
  }
  const userService = new UserService();
  const profile = await userService.getProfile({ idDB: session.user.idDB });

  const getDataClient = async (dataFromClient: FormData) => {
    'use server';
    // console.log(dataFromClient);
    // const bytes = await image.arrayBuffer();
    // const buffer = Buffer.from(bytes);
    // let type = 'jpg';
    // if (image.type === 'image/jpeg') {
    //   type = 'jpg';
    // }

    // const srcDir = path.resolve(process.cwd(), 'public', `avatar.${type}`);

    // const writed = await writeFile(srcDir, buffer);
  };

  return (
    <div className={styles.wrapper}>
      {profile?.data && <FormProfile formData={profile.data} getDataClient={getDataClient} />}
    </div>
  );
}
