import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import IconChampionship from '@/components/Icons/IconChampionship';
import FromChampionship from '@/components/UI/Forms/FromChampionship/FromChampionship';
// import styles from './Championship.module.css';

// export const dynamic = 'force-dynamic';

/**
 * Страница создания Чемпионатов.
 */
export default async function ChampionshipCreatePage() {
  const session = await getServerSession(authOptions);

  const userIdDB = session?.user.idDB;
  if (!userIdDB) {
    return <h1>Нет авторизации!</h1>;
  }

  return (
    <>
      <TitleAndLine title="Создание Чемпионата" hSize={1} Icon={IconChampionship} />
      <FromChampionship />
    </>
  );
}
