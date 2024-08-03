// import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import IconOrganizers from '@/components/Icons/IconOrganizers';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
// import { OrganizerService } from '@/services/Organizer';
// import { getServerSession } from 'next-auth';

/**
 * Страница создания/удаления Организатора Чемпионатов.
 */
export default async function OrganizerCreatePage() {
  // const session = await getServerSession(authOptions);
  // console.log(session);

  // const organizerService = new OrganizerService();
  // const res = await organizerService.getOne({ _id: '' });
  // console.log(res.data);

  return (
    <>
      <TitleAndLine
        title="Создание/удаление Организатора Чемпионатов"
        hSize={1}
        Icon={IconOrganizers}
      />
    </>
  );
}
